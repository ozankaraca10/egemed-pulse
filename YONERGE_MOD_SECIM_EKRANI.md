# Ajan Yönergesi 2 — EGEMED Pulse: Mod Seçim Ekranı (İnceleme · Uygulama · Değerlendirme)

Bu yönerge, **EGEMED Pulse** deposunda (`cardai/` çalışma zamanı; vanilla JS, tek HTML, SCORM 1.2)
çalışan kodlama ajanı içindir. Amaç: EGEMED Ausculta'daki **mod seçim ekranının** eşdeğerini Pulse'a
eklemek. Ausculta'da akış `Landing → Öğretici → Mod Seçimi (3 kart) → Mod` biçimindedir; header'da
mod çipi ve "Mod Değiştir" düğmesi bulunur, sekme/nav yoktur.

`YONERGE_FOOTER_HAKKINDA.md` (footer/Hakkında) bu yönergeden **önce** uygulanmış olmalı; oradaki
renk tokenlarını ve `.tm` sınıfını burada da kullan.

Kurallar: `cardai/` dışına runtime kodu koyma; mevcut kod stilini (IIFE modüller, `$()` yardımcı,
kompakt satırlar, Türkçe metin) koru; **kilitleme pedagojisini, gözlem sayacını, skorlamayı, SCORM
kayıt şemasını ve tıbbi içeriği DEĞİŞTİRME** (aşağıda izin verilen tek şema eki hariç); git commit
yapma; sonunda dosya listesi + ekran görüntüleriyle raporla.

---

## 0) Depoyu tanı (bu tespitler doğrulanmıştır — yine de dosyaları oku)
- `cardai/index.html`: `#landingPage` (landing) → `#appRoot` (uygulama). Topbar'da `nav[aria-label=Bölümler]`
  içinde 4 sekme: `#simTab` (sim), `#caseTab` (case), `#quizTab` (quiz), `#educatorTab` (educator);
  ayrıca `#fullscreenBtn`, `#helpBtn`; `.header-progress` ("0 / 13 ritim incelendi").
- Görünümler: `#simView`, `#caseView`, `#quizView`, `#educatorView` (`.view`, `hidden` ile geçiş).
- `cardai/app.js` `showView(view)` (satır ~102): kilit denetimi yapar (`derivePrerequisites()` →
  `casesUnlocked`, `quizUnlocked`), kilitliyse `lockMessage` üretir ve uygun görünüme düşer; sekme
  `active`/`aria-pressed` günceller. `landing.js` `enter()` landing'i kapatıp `sim`'e girer.
- `cardai/state.js`: sürüm 6 kompakt kayıt; `u` alanı `['sim','case','quiz','educator']` indeksidir
  (`int(raw.u,0,3,0)`); `derive()` kapıları döndürür: `simComplete` (13×16 s), `casesComplete`
  (10/10 gönderim), `casesUnlocked = simComplete`, `quizUnlocked = simComplete && casesComplete`.
- Kilit kuralları `cardai/KULLANIM.md` "Öğrenme sırası" bölümünde belgelidir → **korunur**.
- Paketleme: `python3 qa/build.py` + `python3 qa/sol_package_tests.py`; tarayıcı testleri `qa/*.mjs`
  (Playwright/Node). Bunlar sekmelere tıklıyor olabilir → güncellenmeli.

---

## 1) Hedef akış

```
Landing ("Simülatörü başlat") → MOD SEÇİMİ → [İnceleme | Uygulama | Değerlendirme]
                                      ↑ header "Mod Değiştir" her görünümden geri döner
```
- **Landing** artık doğrudan `sim`'e değil **mod seçim ekranına** gider.
- **Devam kaydı varsa** (LMS/yerel): kullanıcının kaldığı görünüm `sim/case/quiz` ise doğrudan o
  görünüme dönülür (Ausculta davranışı); kayıt yoksa ya da son görünüm `modes`/`educator` ise mod
  seçim ekranı açılır.
- **Eğitici** bir mod değildir: topbar'da ikon düğme (`#educatorTab` → `#educatorBtn`, `aria-label=
  "Eğitici paneli"`) olarak kalır; mod ekranının altında da küçük bir bağlantı ("Eğitici paneli →").

---

## 2) Mod seçim ekranı — `#modesView`

Yeni `section#modesView.view.secondary-view` (`#main` içine, diğer görünümlerin yanına). İçerik ve
sıra Ausculta ile aynı:

1. **Stepper** (küçük): `Mod Seçimi · Çalışma · Tamamla` — aktif: 1.
2. **Başlık**: `Çalışma Modunu Seçin` · alt metin: `Hangi modda çalışmak istersiniz?`
3. **Dürüstlük şeridi** (Ausculta'daki kulaklık şeridinin karşılığı, ince tek satır, kartların
   ÜSTÜNDE): ⓘ `Tüm sinyaller sentetik öğretim şemalarıdır; gerçek hasta kaydı değildir ve klinik
   tanı için kullanılmaz.` — KULLANIM.md'deki sınırla uyumlu.
4. **Üç kart** (3 sütun ≥1024px; altında tek sütun):

| | **İnceleme Modu** (`.mode-card.learn`, yeşil) | **Uygulama Modu** (`.mode-card.practice`, mavi) | **Değerlendirme Modu** (`.mode-card.assessment`, mor) |
|---|---|---|---|
| Hedef görünüm | `sim` | `case` | `quiz` |
| Tek cümle | `13 örüntüyü kalp–EKG–dolaşım birlikte, kaliper ve rehberli turla sınırsız inceleyin.` | `{cases} vakalık havuzdan her oturumda rastgele 10 vaka; gönderim sonrası açıklama ve simülatörde açma.` | `{questions} soruluk havuzdan rastgele 10 soru; 8/10 doğru = 80 geçer, en iyi puan LMS'ye yazılır.` |
| 3 madde | 13 örüntü · 12 derivasyon · Kaliper, ölçüm, rehberli tur | Rastgele 10 vaka · Gönderim sonrası açıklama · Simülatörde aç | Rastgele 10 soru · Geçme eşiği 80 · SCORM puanı |
| Durum satırı | `7/13 örüntü izlendi` + ince ilerleme çubuğu (13 dilim) | `Oturum: 4/10 gönderildi` (kilitliyse kilit nedeni) | `En iyi puan: 90 / Henüz denenmedi` (kilitliyse kilit nedeni) |
| CTA | `İncelemeye başla` / ilerleme varsa `İncelemeye devam et` | `Vakaları çöz` / `Vakalara devam et` | `Değerlendirmeye gir` / tamamlandıysa `Sonuçları gör` |
| Kilit | yok | `simComplete` değilse kilitli | `quizUnlocked` değilse kilitli |

Sayılar `window.PulseCurriculum.cases.length` / `.questions.length` ve `state`'ten canlı gelir
(landing.js'teki gibi sabit yazma).

**Kilitli kart görünümü** (gizleme yok — Ausculta'da kilit yok, Pulse'ta pedagojik kilit var; kilidi
görünür ve açıklayıcı yap):
- Kart soluk değil, **ikon dairesi gri**, başlığın yanında küçük kilit rozeti `🔒 Kilitli`.
- Durum satırında neden + ilerleme: Uygulama → `Açılması için 13 örüntünün her birini 16 sn izleyin
  — 7/13 tamamlandı` (+ ilerleme çubuğu); Değerlendirme → `Açılması için oturumdaki 10 vakayı
  gönderin — 4/10 gönderildi`.
- CTA pasif değil, **yönlendirici**: `Kilidi aç → İnceleme'ye git` / `Kilidi aç → Vakalara git`
  (ilgili görünümü açar). `aria-describedby` ile neden metnine bağla. Böylece mevcut
  `showView` içindeki `lockMessage` düşürme mantığı da korunur (çift güvence).
- Değerlendirme kartında ek satır: `Kurallar: 10 soru · tüm sorular yanıtlanınca "Yanıtları
  değerlendir" · yeni örneklem alınabilir`.

5. **Alt bağlantı**: `Eğitici paneli →` (küçük, ikincil).

### Markup iskeleti (index.html)
```html
<section id="modesView" class="view secondary-view modes-view" aria-labelledby="modesTitle" hidden>
  <ol class="stepper" aria-label="İlerleme">
    <li class="step active"><span class="dot">1</span><span class="lbl">Mod Seçimi</span></li>
    <li class="step"><span class="line"></span><span class="dot">2</span><span class="lbl">Çalışma</span></li>
    <li class="step"><span class="line"></span><span class="dot">3</span><span class="lbl">Tamamla</span></li>
  </ol>
  <h1 id="modesTitle" class="mode-title">Çalışma Modunu Seçin</h1>
  <p class="mode-sub">Hangi modda çalışmak istersiniz?</p>
  <div class="honesty-banner thin">ⓘ Tüm sinyaller sentetik öğretim şemalarıdır; gerçek hasta kaydı değildir ve klinik tanı için kullanılmaz.</div>
  <div class="mode-cards" id="modeCards"><!-- renderModes() doldurur --></div>
  <p class="mode-foot"><button class="link-btn" id="modesEducator">Eğitici paneli →</button></p>
</section>
```
Kartlar `renderModes()` ile üretilir (durum/kilit canlı değiştiği için): her kart
`<article class="mode-card learn|practice|assessment [locked]">` → `.ic` (ikon) · `<h3>` · `.desc` ·
`<ul>` 3 madde (✓ daire) · `.mode-status` (metin + `.mode-progress` çubuğu) · `<button class="btn">`
CTA (`data-view="sim|case|quiz"`). Kilitli kartta `.lock-badge` ve CTA `data-view` = kilidi açan
görünüm.

### CSS (Ausculta ile aynı dil; Pulse'un `--label/--body` yazı ölçeğine uyarla)
```css
.modes-view { max-width: 1020px; margin: 0 auto; padding: 8px 0 24px; }
.stepper { display: flex; justify-content: center; gap: 0; margin: 8px auto 2px; padding: 0; list-style: none; max-width: 520px; }
.step { position: relative; width: 150px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.step .dot { width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 700; background: #fff; color: var(--ink-400,#7c93b8); border: 2px solid var(--border-strong,#b9cfeb); z-index: 1; }
.step.active .dot { background: var(--blue-600); border-color: var(--blue-600); color: #fff; box-shadow: 0 0 0 4px rgba(22,115,230,.15); }
.step .lbl { font-size: 12px; color: var(--ink-600); } .step.active .lbl { color: var(--ink-900,#0b2559); font-weight: 700; }
.step .line { position: absolute; top: 10px; left: -50%; width: 100%; height: 2px; background: var(--border-strong,#b9cfeb); }
.mode-title { text-align: center; font-size: clamp(28px, 3.4vw, 42px); font-weight: 800; color: var(--navy-800); margin: 8px 0 4px; letter-spacing: -.5px; }
.mode-sub { text-align: center; color: var(--ink-600); font-size: 16px; margin-bottom: 18px; }
.honesty-banner { display: flex; align-items: center; gap: 10px; max-width: 760px; margin: 0 auto 18px; padding: 10px 14px; border: 1px solid var(--border); border-radius: 14px; background: rgba(255,255,255,.85); color: var(--ink-700,#1e3a6e); font-size: 13px; }
.mode-cards { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 20px; }
@media (max-width: 1024px) { .mode-cards { grid-template-columns: 1fr; } }
.mode-card { background: rgba(255,255,255,.92); border: 1px solid var(--border); border-radius: 22px; padding: 20px 20px 16px; text-align: center; box-shadow: var(--shadow-card); display: flex; flex-direction: column; gap: 10px; }
.mode-card .ic { width: 60px; height: 60px; border-radius: 50%; margin: 0 auto; display: grid; place-items: center; }
.mode-card.learn .ic { background: var(--green-50,#ecfaf1); color: var(--green-600,#16a34a); }
.mode-card.practice .ic { background: var(--blue-50); color: var(--blue-600); }
.mode-card.assessment .ic { background: var(--purple-50,#f5f0fd); color: var(--purple-600,#7c3aed); }
.mode-card.locked .ic { background: #eef2f7; color: var(--ink-400,#7c93b8); }
.mode-card h3 { font-size: 20px; margin: 0; }
.mode-card.learn h3 { color: var(--green-600,#16a34a); } .mode-card.practice h3 { color: var(--blue-700); } .mode-card.assessment h3 { color: var(--purple-600,#7c3aed); }
.lock-badge { display: inline-flex; align-items: center; gap: 4px; margin-left: 6px; font-size: 12px; font-weight: 700; color: var(--ink-600); background: #eef2f7; border-radius: 999px; padding: 2px 8px; vertical-align: middle; }
.mode-card .desc { color: var(--ink-600); font-size: 14px; min-height: 40px; margin: 0; }
.mode-card ul { list-style: none; margin: 2px 0 8px; padding: 9px 4px 0; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 8px; text-align: left; }
.mode-card li { display: flex; gap: 10px; align-items: center; font-size: 14px; color: var(--ink-700,#1e3a6e); }
.mode-card li .ck { width: 19px; height: 19px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0; }
.mode-card.learn li .ck { background: var(--green-100,#dcf3e7); color: var(--green-600,#16a34a); }
.mode-card.practice li .ck { background: var(--blue-100); color: var(--blue-600); }
.mode-card.assessment li .ck { background: var(--purple-100,#ede4fb); color: var(--purple-600,#7c3aed); }
.mode-status { font-size: 13px; color: var(--ink-600); text-align: left; }
.mode-card.locked .mode-status { color: var(--amber-900,#7a4a00); }
.mode-progress { height: 6px; border-radius: 999px; background: var(--blue-100); overflow: hidden; margin-top: 6px; }
.mode-progress i { display: block; height: 100%; background: var(--blue-600); border-radius: 999px; }
.mode-card.learn .mode-progress i { background: var(--green-600,#16a34a); }
.mode-card .btn { margin-top: auto; width: 100%; min-height: 44px; border-radius: 12px; font-weight: 700; border: 0; color: #fff; }
.mode-card.learn .btn { background: var(--green-600,#16a34a); } .mode-card.practice .btn { background: var(--blue-600); } .mode-card.assessment .btn { background: var(--purple-600,#7c3aed); }
.mode-card.locked .btn { background: #fff; color: var(--ink-700,#1e3a6e); border: 1.5px solid var(--border-strong,#b9cfeb); }
.mode-rules { font-size: 12px; color: var(--ink-600); text-align: left; }
.mode-foot { text-align: center; margin-top: 16px; }
```

---

## 3) Header (topbar) değişiklikleri
- `nav[aria-label=Bölümler]` içindeki **sim/case/quiz sekmelerini kaldır**. Yerine ortada tek bağlam
  grubu: **mod çipi** (`.mode-chip.learn|practice|assessment` — "İnceleme Modu" / "Uygulama Modu" /
  "Değerlendirme Modu"; ≤480px'te kısa: "İnceleme" …) + **"Mod Değiştir"** düğmesi (⇄ ikon +
  etiket; `aria-label="Mod seçim ekranına dön"`). Mod ekranındayken çip ve düğme gizli.
- `.header-progress`: yalnız `sim`'de "N / 13 ritim incelendi"; `case`'de "Vaka N / 10";
  `quiz`'de "Soru N / 10" (mevcut `progress()` fonksiyonunu görünüme göre dallandır). Mod
  ekranında gizli.
- Eğitici: `#educatorTab` → ikon düğme `#educatorBtn` (grafik ikon, `aria-label="Eğitici paneli"`,
  `title`), fullscreen ve Hakkında'nın yanında. Aktifken `aria-pressed=true`.
- Sıra: `[Marka™] … [Mod çipi] [Mod Değiştir] … [Eğitici] [Tam ekran] [Hakkında]`.
- **Değerlendirmeden çıkış onayı**: `quiz` görünümünde "Mod Değiştir"/marka tıklanınca yerleşik
  `<dialog>` ile onay ("Değerlendirmeden çıkılsın mı? Yanıtlarınız kaydedilir; oturum devam
  ettirilebilir." — `window.confirm` KULLANMA). Pulse'ta yanıtlar zaten kalıcı; bu yalnız yanlışlıkla
  çıkışı önler.

---

## 4) Mantık (`app.js`, `landing.js`, `state.js`)

### 4.1 `showView`
- Geçerli görünüm listesine `'modes'` ekle. `showView('modes')`: `revokeObservation()`,
  `setPlaying(false)`, tüm `.view`'leri gizle, `#modesView`'i göster, `renderModes()` çağır, header
  çipi/progress gizle, `state.activeView='modes'`, `persist()`. Kilit mesajı gerekmez.
- `case`/`quiz` kilitliyken çağrılırsa mevcut düşürme davranışı ve `lockMessage` **aynen kalır**;
  ek olarak mod ekranı kilitli kartta aynı nedeni gösterir (tek doğruluk kaynağı için neden
  metinlerini `LOCK_REASONS = { case: '...', quiz: '...' }` sabitine al ve iki yerde de onu kullan).
- Görünüm girişinde başlığa odak (mevcut `heading.setAttribute('tabindex','-1'); heading.focus()`
  deseni) mod ekranı için `#modesTitle`.
- Her `showView` sonunda header'ı güncelleyen `renderHeader(view)` çağır (çip metni/rengi, "Mod
  Değiştir" görünürlüğü, progress etiketi).

### 4.2 `renderModes()`
`derivePrerequisites()` → kapılar; `state.viewed` → izlenen örüntü sayısı (`≥16` olanlar);
`state.caseSession.submitted` → gönderim sayısı; `state.bestScore`/`state.assessed` → puan.
Kart HTML'ini üret, CTA'lara `click → showView(btn.dataset.view)` bağla. `cardai:session`,
`cardai:reset` olaylarında ve `progress()` içinde (mod ekranı görünürken) yeniden çiz.

### 4.3 `landing.js`
`enter()` → `showView(hasProgress ? state.activeView : 'modes')`; `hasProgress` =
`state.activeView ∈ {sim,case,quiz}` **ve** (herhangi bir `viewed>0` veya herhangi gönderim).
Devam kaydı bloklu (`S.resumeBlocked`) ise `modes`.

### 4.4 `state.js` — izin verilen tek şema eki
`u` alanı: `['sim','case','quiz','educator','modes']` (indeks 4). `decode`: `int(raw.u,0,4,0)`;
kilit düşürme kontrolü aynen. `encode`: `indexOf` zaten 4 üretir. Eski kayıtlar (0–3) etkilenmez;
**sürüm numarası 6 kalır** (geriye uyumlu alan genişlemesi; 4096 bayt bütçesini değiştirmez).
`blank()`'te `activeView:'modes'`.

### 4.5 Öğretici ile ilişki
Pulse'ta ayrı öğretici ekranı yok; "Rehberli tur" sim içinde. Mod ekranına ek adım ekleme.

---

## 5) Erişilebilirlik ve duyarlılık
- Kartlar `article`, başlık `h3`, CTA gerçek `button`; kilitli CTA `aria-describedby` → neden
  metni. Klavye: Tab sırası stepper'ı atlar (`aria-hidden` değil, odaklanamaz), kartlar sırayla.
- Odak halkası belirgin (`:focus-visible` 3px).
- ≥1024 üç sütun; 1024–721 tek sütun; ≤720 kartlar tam genişlik, CTA ≥44px; yatay taşma yok
  (`scrollWidth <= innerWidth` 390/768/1366).
- `prefers-reduced-motion`: geçiş animasyonu yok.

---

## 6) Belgeler
- `cardai/KULLANIM.md` "Öğrenme sırası" ve "Görünüm ve araçlar": yeni akışı yaz (Landing → Mod
  Seçimi; sekmeler yerine "Mod Değiştir"; kilitli kartların yönlendirmesi; Eğitici ikon düğmesi;
  klavye notu). Kilit eşikleri aynen.
- `BUILD.md`: değişiklik yok (dosya kümesi aynı). Eğer yeni ikon PNG eklersen bütünlük envanteri ve
  `build.py` görsel gömme listesini güncelle — tercihen **inline SVG** kullan, yeni PNG ekleme.

---

## 7) Doğrulama
1. `python3 qa/build.py` ve `python3 qa/sol_package_tests.py` geçmeli (kaynak sabitlendikten sonra).
2. `qa/independent_e2e.mjs`, `qa/sol_ui.mjs`, `qa/independent_state.mjs` ve sekmelere tıklayan diğer
   `qa/*.mjs` betiklerini yeni akışa göre güncelle (`#simTab` → mod kartı CTA'sı; kilit testleri mod
   ekranındaki nedeni ve düşürmeyi doğrulasın). Suspend boyutu testi `u=4` ile ≤4096 kalmalı.
3. Playwright ile 1366×768 ve 390×844'te: landing → mod ekranı (kilitli 2 kart, ilerleme 0/13) →
   İnceleme'ye gir → header çipi "İnceleme Modu" + "Mod Değiştir" → geri dön → 13/13 sonrası
   Uygulama kartı açık (test için gözlem sayacını `state.viewed` üzerinden hazırlamak yerine mevcut
   qa yardımcılarını kullan; sayaç mantığına dokunma) → Değerlendirme kilit nedeni "4/10 gönderildi".
   Görüntüleri `qa/evidence/modes/` altına koy ve **kendin incele**.
4. Rapor: değişen dosyalar; `u` indeksi eki; header düzeni; kaldırılan sekmeler; qa betiği
   güncellemeleri; ekran görüntüleri; uygulanamayan/kararsız noktalar (ör. kilit kurallarının
   gevşetilmesi — **kullanıcı kararı**, kendin değiştirme).

---

## 8) Ausculta ile bilinçli farklar (rapora yaz)
- Ausculta'da modlar arası kilit yok; Pulse'ta pedagojik kilit var → kartlar görünür + yönlendirici.
- Ausculta'da Öğretici ekranı mod ekranından önce gelir; Pulse'ta rehberli tur sim içinde.
- Ausculta'daki "kulaklık" şeridi yerine "sentetik sinyal" dürüstlük şeridi.
- Eğitici paneli Pulse'a özgüdür; mod değil, header ikonu + mod ekranı alt bağlantısı.
