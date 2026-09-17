# EGEMED Pulse — Ürün Ailesi UI/UX Hizalama İş Planı (Ana Yönerge)

**Amaç.** EGEMED Ausculta (kardiyopulmoner oskültasyon simülatörü) ve EGEMED Pulse (etkileşimli EKG
simülatörü) aynı ekip ve kurumun **tek ürün ailesidir**. Kullanıcı bir üründen diğerine geçtiğinde
aynı yerleşimi, aynı renk/tipografi dilini, aynı mod akışını, aynı soru/geri bildirim kalıbını ve aynı
sonuç raporunu görmelidir. Bu plan Pulse'un **landing, header, footer, Hakkında, mod seçimi, öğretici,
vaka (uygulama), değerlendirme ve sonuç** ekranlarını Ausculta ile hizalar.

**Kapsam dışı (DEĞİŞMEZ):** EKG/dolaşım modeli (`model.js`), simülasyon sahnesi (kalp anatomisi, EKG
monitörü, kaliper/ölçüm araçları, rehberli tur, sistematik okuma), 400 maddelik içerik
(`curriculum.js`), kilit pedagojisi (13×16 s gözlem → vakalar → değerlendirme), skorlama (8/10 = 80),
SCORM 1.2 kayıt şeması (sürüm 6, 4096 bayt; yalnız §7'de izin verilen `u` eki), `qa/build.py`
paketleme mimarisi (tek HTML + ZIP, 15 kaynak dosya hash'i), tıbbi metinler ve sınırlılık ifadeleri.

**Referanslar (bu depoda):**
- `baseline/ausculta-reference/ausculta-styles.css` — Ausculta'nın tam CSS'i (token'lar ve tüm bileşenler)
- `baseline/ausculta-reference/{ausculta-chrome.tsx, ModeSelectScreen.tsx, Questions.tsx, ResultsScreen.tsx, SourcesScreen.tsx}` — header/footer, mod kartları, soru kartı, sonuç raporu, Hakkında (React; Pulse'a vanilla JS olarak uyarlanacak)
- `baseline/ausculta-reference/screens/*.png` — hedef görünümler (1366×768 ve 390×844)
- `baseline/ausculta-brand/ege-tip-logo.png`, `ege-tip-seal-128.png` — kurum amblemi
- Alt yönergeler (bu planın parçasıdır, çakışırsa **bu plan** geçerlidir):
  `YONERGE_FOOTER_HAKKINDA.md` (footer + Hakkında), `YONERGE_MOD_SECIM_EKRANI.md` (mod seçimi)

**Çalışma kuralları.** Çalışma zamanı kodu yalnız `cardai/` içinde; IIFE modül/`$()`/kompakt satır
stilini ve Türkçe metin dilini koru; yeni PNG ekleme (inline SVG kullan) — eklemek zorundaysan
`qa/build.py` gömme listesini ve bütünlük envanterini güncelle; her fazın sonunda `python3 qa/build.py`
+ `python3 qa/sol_package_tests.py` + ilgili `qa/*.mjs` geçmeli; git commit yapma; her faz sonunda
kısa rapor + ekran görüntüsü (`qa/evidence/family/<faz>/`).

---

## 0. Faz — Keşif ve tasarım sistemi (temel)

### 0.1 Envanter
`cardai/index.html`, `styles.css`, `app.js`, `features.js`, `landing.js`, `state.js`, `scorm.js`'i oku;
`qa/*.mjs` betiklerinin hangi seçicilere (id/class) bağlı olduğunu listele (değişecek seçiciler için
güncelleme planı çıkar). Mevcut Pulse token'ları: `--text #18384d, --muted #405f71, --cyan #087493,
--line #bfd0da, --ink #173b52, --radius 12px, --label/--body (×1.2 ölçek)`.

### 0.2 Aile token'ları (`styles.css` `:root`'a ekle; eski token'ları bunlara **eşle**, silme)
```css
:root{
  --navy-900:#0a2a5e; --navy-800:#0d346f; --navy-700:#10457e; --navy-600:#155396;
  --blue-700:#0f62d8; --blue-600:#1673e6; --blue-500:#2e8df7; --blue-400:#5aa5f9; --blue-300:#8ec1fb; --blue-200:#c3ddf8; --blue-100:#dbeafe; --blue-50:#eff6ff;
  --ink-900:#0b2559; --ink-800:#142f60; --ink-700:#1e3a6e; --ink-600:#46618c; --ink-500:#5f7ba6; --ink-400:#7c93b8; --ink-300:#a5b9d6;
  --green-600:#16a34a; --green-500:#1fa971; --green-100:#dcf3e7; --green-50:#ecfaf1;
  --purple-700:#6d28d9; --purple-600:#7c3aed; --purple-100:#ede4fb; --purple-50:#f5f0fd;
  --orange-500:#f59e0b; --orange-100:#fdeecd; --amber-700:#92400e; --red-600:#b91c1c; --red-500:#e11d48; --red-100:#fde5ea;
  --bg-grad-a:#e8f1fc; --bg-grad-b:#f6faff; --card:#fff; --card-soft:#f4f8fe; --border:#d9e5f4; --border-strong:#b9cfeb;
  --shadow-card:0 1px 2px rgba(13,52,111,.05),0 8px 24px rgba(13,52,111,.07); --shadow-pop:0 12px 40px rgba(10,42,94,.18);
  --r-sm:6px; --r-md:10px; --r-lg:14px; --r-xl:22px; --r-pill:999px;
  --fs-xs:12px; --fs-sm:13px; --fs-md:14px; --fs-lg:16px; --fs-xl:20px; --fs-2xl:26px; --fs-3xl:34px;
  --sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:24px; --sp-6:32px;
  --font:'Segoe UI','SF Pro Text',-apple-system,BlinkMacSystemFont,Roboto,'Helvetica Neue',Arial,sans-serif;
  --head-h:60px; --foot-h:52px;
  /* Pulse eski token köprüsü */
  --text:var(--ink-900); --muted:var(--ink-600); --cyan:var(--blue-600); --line:var(--border); --ink:var(--ink-800); --radius:var(--r-lg);
}
```
- Yazı ölçeği: Pulse'un `--ui-font-scale:1.2` + `--label/--body` sistemi yerine aile ölçeği
  (`--fs-*`, gövde 14px). `%120 sabit ölçek` KULLANIM.md'de belgeli — kaldırılırsa belgeyi güncelle.
  Kullanıcı büyütme ihtiyacı için tarayıcı yakınlaştırması yeterli (Ausculta ile aynı).
- Renk kimliği: **İnceleme = yeşil, Uygulama = mavi, Değerlendirme = mor** (Ausculta ile aynı).
  Pulse'un camgöbeği (`#087493`) yalnız EKG sahnesi/monitör içinde kalabilir (alan kimliği), UI
  kromunda kullanılmaz.
- Header laciverti: `linear-gradient(90deg, var(--navy-900), var(--navy-700))` (Ausculta `.eg-header`).
- Kartlar: beyaz, `--border`, `--r-lg`, `--shadow-card`. Koyu soru kartı: `--navy-900→--navy-800`.

### 0.3 Kabul
`grep -oE "#[0-9a-fA-F]{3,6}" cardai/styles.css | sort -u | wc -l` ≤ 40 ve hepsi `:root`'ta;
`font-size:` ile sabit px yok (yalnız `var(--fs-*)`/`clamp`); `border-radius:` sabit px yok.

---

## 1. Faz — Kabuk: Header, Footer, Landing, Hakkında

### 1.1 Header (`.topbar` → Ausculta `.eg-header` düzeni)
`[Logo + EGEMED / Pulse™] … [Mod çipi] [⇄ Mod Değiştir] … [Eğitici ⌗] [Tam ekran ⤢] [ⓘ Hakkında]`
- Marka bloğu: küçük ikon + iki satır ("EGEMED" küçük, "Pulse™" büyük) — Ausculta `.eg-brand`.
  Tıklanınca landing'e döner (değerlendirmedeyse onay dialogu, §4.4).
- Mevcut `nav[aria-label=Bölümler]` sekmeleri **kaldırılır** (mod akışı §2). Eğitici ikon düğme.
- `.header-progress`: görünüme göre "N / 13 örüntü" (İnceleme), "Vaka N / 10" (Uygulama), "Soru N / 10 · ⏱ mm:ss" (Değerlendirme — süre sayacı Ausculta'daki gibi; `learningMs`'e dokunma, ayrı görünür sayaç). Mod ekranı/landing'de gizli.
- Değerlendirme kimliği: çip mor, header sağ alt kenarında 3px mor şerit (Ausculta `mode-assessment`).
- Erişilebilirlik: tüm ikon düğmelerde `aria-label`; etiketler ≥721px görünür, ≤720px ikon-only.
- ≤480px: marka üst satırı gizli, kısa mod etiketi ("Değerlendirme"), tek satır (Ausculta ≤480 kuralları).

### 1.2 Footer — `YONERGE_FOOTER_HAKKINDA.md §1` birebir
Metin: **EGEMED Pulse™** Etkileşimli EKG Simülatörü, Ege Üniversitesi Tıp Fakültesi Dekanlığı tarafından geliştirilmiştir. Tüm hakları saklıdır © 2026 — logo+metin ortalı; kademeli kısalma. Doküman ekranlarında (landing, mod, hakkında, sonuç) içeriğin sonunda; sim/vaka/değerlendirme ekranında sabit alt.

### 1.3 Landing (Ausculta `screens/01-landing-1366.png`)
- Solda **silik, sola yaslı, büyük** Ege Tıp amblemi (`opacity:.08; grayscale; left:clamp(12px,3vw,56px); width:min(64vh,30vw)`).
- Ortada: ürün logosu (mevcut `egemed-pulse-landing.png`) → tek satır değer önerisi başlığı
  ("Elektriksel etkinliği, mekanik yanıtı ve dolaşımı birlikte keşfedin.") → 1 cümle alt metin
  (sayılar canlı: 13 örüntü, 200 vaka, 200 soru) → **Simülatörü başlat** (mavi degrade CTA) →
  ikincil bağlantılar: "Nasıl kullanılır?" · "Hakkında ve kaynaklar".
- **"Neden güvenilir?"** 3 kutu (Ausculta `.why-grid`): "13 sentetik örüntü — 12 derivasyon, bağımsız
  klinisyen doğrulaması yok (dürüst)", "200 vaka · 200 soru — her oturumda 10+10", "SCORM 1.2 — puan
  ve durum LMS'e raporlanır".
- Alt bilgi satırı: "Sinyaller sentetik öğretim şemalarıdır; klinik tanı için kullanılmaz." (Ausculta'daki kulaklık satırının yerine — dürüstlük).
- 1366×768'de footer dahil **kaydırmasız** sığar (Ausculta `@media (max-height:820px)` sıkıştırması).

### 1.4 Hakkında — `YONERGE_FOOTER_HAKKINDA.md §3` birebir
Başlık "EGEMED Pulse™ Hakkında"; Geliştiriciler 3 sütun lacivert (Ünisis bağlantılı, açıklama cümlesi yok); Kurum kartı + kanıt atfı (**Oh S-Y, Cook DA, … Pusic MV. Acad Med 2022;97(4):593–602, doi:10.1097/ACM.0000000000004607**); Kaynaklar (MEDICAL_SOURCES.md'deki kılavuzlar kart biçiminde: ESC AF 2024, ESC SVT 2019, ESC VA 2022, AHA ALS 2025, ESC ACS 2023, AHA/ACCF/HRS 2009, Klabunde — her biri başlık/kurum/yıl/DOI bağlantısı); Sınırlılıklar kutusu (`PulseCurriculum.limitations` + KULLANIM "Model ve kaynak sınırları"); "← Geri".
- Mevcut `#infoDialog` (Hakkında dialogu) → tam sayfa görünüm `#aboutView`; `#helpBtn`/`#sourceBtn` buraya gider. Dialog kaldırılır ya da yalnız "Yardım" (öğretici adımları) için kalır (§2.3).

### 1.5 Kabul (Faz 1)
1366/390 ekran görüntüleri Ausculta'nın `01-landing`, `07-hakkinda` ile yan yana konulduğunda aynı yapı; footer metni tek satır ortalı; header sekmesiz; yatay taşma yok.

---

## 2. Faz — Akış: Mod seçimi, Öğretici/Yardım, Mod değiştirme

### 2.1 Mod seçim ekranı — `YONERGE_MOD_SECIM_EKRANI.md` birebir
Landing → **Mod Seçimi** (3 kart: İnceleme/Uygulama/Değerlendirme; kilitli kartlar görünür +
yönlendirici CTA; dürüstlük şeridi; stepper; Eğitici alt bağlantısı) → mod. Header "Mod Değiştir"
geri döner. `state.activeView` 'modes' (`u`=4).

### 2.2 Adlandırma (aile dili)
| Pulse (eski) | Aile adı |
|---|---|
| Simülasyon / "Ritim" sekmesi | **İnceleme Modu** (Ausculta: Öğrenme) |
| Vakalar | **Uygulama Modu** |
| Değerlendirme (Quiz) | **Değerlendirme Modu** |
| Eğitici | Eğitici paneli (mod değil) |
Buton/başlık metinleri: "İncelemeye başla / Vakaları çöz / Değerlendirmeye gir", vaka ekranında
"Olgu", soru kartında eyebrow ("EKG YORUMU" / "RİTİM TANIMA" — madde türüne göre), "Yanıtla",
"Devam Et", "Vakayı tamamla", "Sonraki vaka →", "Sonuçları gör →".

### 2.3 Yardım / Öğretici
Ausculta'da ilk açılışta 3 adımlı **interaktif öğretici** (gerçek sahnede: sürükle → bırak → Bell/
Diyafram). Pulse karşılığı: Mod seçimine geçmeden önce ilk kullanımda (`tutorialSeen` oturum bayrağı
+ "Tekrar gösterme" kalıcı bayrağı — kayda `t` biti; §7) **3 adımlı canlı öğretici**: (1) bir örüntü
kartı seç, (2) EKG'yi oynat ve bir derivasyon sütununa tıkla, (3) kaliperi aç ve bir ölçüm yap.
Sağda gerçek sim sahnesi, solda adımlar ✓ ile işaretlenir; "Atla" her an. Header "Yardım" düğmesi
aynı adımları metin listesi olarak modalda gösterir (mevcut rehberli tur içeriğiyle çakışmasın: tur
sim içinde kalır). Mevcut Pulse'ta 16 s gözlem kuralı öğreticide **işletilmez** (öğretici gözlem
sayacına eklenmez — `observeEligible` zaten görünüm koşuluna bağlı; öğretici görünümü `sim` değil).

### 2.4 Kabul (Faz 2)
Landing → öğretici (ilk kez) → mod ekranı → İnceleme → Mod Değiştir → Uygulama (kilitliyse neden
görünür) akışı 1366/390'da çalışır; "Tekrar gösterme" işaretlenmese de öğreticiden çıkılabilir
(Ausculta'da yaşanan hata — test et); qa betikleri güncel.

---

## 3. Faz — Uygulama (Vaka) ekranı

Hedef: `screens/03-uygulama-vaka-1366.png`, `03b-…geri-bildirim`, `03c-…vaka-sonu`.
Ausculta düzeni: **iki sütun** — solda "sahne" (Pulse'ta: vaka EKG kanvası + derivasyon seçiciler +
araç çubuğu), sağda **Olgu kartı** + **koyu soru kartı**.

### 3.1 Sol sütun (sahne)
- `.stage-card` içinde vaka EKG kanvası (mevcut `ecgMarkup`), altında **derivasyon chip'leri**
  (Ausculta "Dinleme bölgeleri" chip'lerinin karşılığı): 3 sütun seçici `select` yerine chip grubu
  `D1 D2 D3 · aVR aVL aVF · V1–V6`; seçili chip mavi dolgu, incelenen (görüntülenmiş) chip ✓ (Ausculta
  `.region-list` durum sınıfları `is-active/is-listened`). Klavye erişimi korunur.
- Alt araç çubuğu (`.toolbar`, tek satır): `[Normalle karşılaştır] [Kaliper] [Ölçüm ▾] | [▶ Oynat] [Hız] | [Simülatörde aç]` — mevcut işlevler, Ausculta toolbar görünümü. "Simülatörde aç" yalnız doğru gönderim sonrası (mevcut kural).
- Sahnenin sol üstünde durum rozeti ("● Canlı" / "Ⅱ Duraklatıldı") — Ausculta `.stage-badge`.

### 3.2 Sağ sütun
- **Olgu kartı** (`.card`): ikon + "Olgu" + sağda `Vaka 3/10` rozeti; içerik: `item.stem` ("Başvuru:" kalıbı; Pulse'ta yaş/cinsiyet yoksa uydurma — stem'i olduğu gibi), varsa vitaller `kv` kutuları (yoksa bölüm yok).
- **Soru kartı** (`.q-card-dark`): eyebrow + **Soru 1/1** sayacı (vakada tek soru ise "Soru 1 / 1" göster — tutarlılık), soru kökü (`item.question`), 5 seçenek `.opt` (radio semantiği `role=radio aria-checked`, ok tuşu gezinme), **Yanıtla** (pasifken açık mavi/gri — Ausculta `.btn.primary:disabled`).
- **Geri bildirim** (gönderim sonrası, aynı kartta): seçenekler üzerinde ✓ yeşil (doğru) / ✗ kırmızı (seçilen yanlış) işaretleri (`.opt.is-correct/.is-wrong`), altında `optionFeedback` metni "Doğru!/Yanlış" başlığıyla; CTA **"Devam Et"** → sonraki vaka; son vakada **"Vakayı tamamla"**.
- **Vaka sonu kartı** (10/10 gönderildiğinde, koyu kart): "Oturum tamamlandı · 7/10 doğru", 10 madde için ✓/✗ şeridi, "Yanlışları gözden geçir" (ilgili vakaya atlar), **"Değerlendirmeye gir →"** (kilit açıldı) / "Yeni 10 vaka örneklemi" / "Aynı vakaları tekrar dene" (mevcut `retrySample/newSample`).
- Vaka geçişinde Olgu kartı 600 ms kenar vurgusu (`case-flash`); Ausculta `screens/04b` geçiş paneli yalnız değerlendirmede.

### 3.3 Mobil (≤720)
Sıra: Olgu (kısa) → EKG sahnesi (`min(55dvh,420px)`) → yapışkan alt toolbar (+ "Soruya git ↓") → soru kartı; derivasyon chip'leri yatay kaydırılır; 44px dokunma hedefleri.

### 3.4 Kabul (Faz 3)
1366'da iki sütun, Ausculta `03*` görüntüleriyle aynı hiyerarşi; gönderim sonrası ✓/✗ seçeneklerde; "Devam Et" akışı; 10/10 sonrası vaka sonu kartı; `caseAnswers/caseSubmitted` kayıt davranışı ve kilit mantığı değişmedi (qa/independent_state.mjs geçer).

---

## 4. Faz — Değerlendirme ekranı ve Sonuçlar

Hedef: `screens/04-degerlendirme-1366.png`, `04b-…gecis`, `05-sonuclar-1366.png`.

### 4.1 Değerlendirme (sınav) ekranı
- Aynı iki sütun düzeni; **mor kimlik**: header çipi mor, soru kartı üst kenarı 3px mor, "Yanıtla" mor.
- Üstte **kural şeridi** (Ausculta `.strict-banner`): ilk soruda tam metin "**Değerlendirme modu.** Gönderilen yanıt değiştirilemez; açıklamalar tüm sorular yanıtlanıp değerlendirildikten sonra gösterilir." — sonraki sorularda tek satır kompakt. (Mevcut Pulse davranışı: madde başı gönderim + sonunda "Yanıtları değerlendir" — korunur; kural şeridi bunu anlatır.)
- Soru kartı: eyebrow "DEĞERLENDİRME · SORU N/10" + nokta ilerlemesi; **madde geri bildirimi değerlendirme sırasında gösterilmez** (Ausculta kuralı). Not: Pulse şu an gönderim anında `optionFeedback` gösteriyor → değerlendirmede bunu **sonuç ekranına** taşı (madde bazlı liste). Uygulama modunda anlık geri bildirim kalır.
- Soru geçişinde 1.4 s **geçiş paneli** ("Soru 4 / 10") yalnız ilk 10 soruda değil, vaka değiştiğinde değil — Pulse'ta her soru bağımsız olduğu için geçiş paneli **kullanılmaz**; yerine soru sayacı + kenar vurgusu.
- Alt gezinme (Önceki/Sonraki) korunur; "Yanıtları değerlendir" tüm gönderimlerden sonra aktif.
- Zamanlayıcı header'da (görünür sayaç; skorlamayı etkilemez).
- Çıkış onayı: "Mod Değiştir"/marka → `<dialog>` "Değerlendirmeden çıkılsın mı? Gönderdiğiniz yanıtlar korunur."

### 4.2 Sonuçlar ekranı (`#resultsView`, doküman akışı, sola hizalı, 1240px) — Ausculta `ResultsScreen.tsx`
- Başlık "Değerlendirme Tamamlandı"; duruma göre iki metin (başarılı / hedefin altında).
- **Özet şeridi** 4 kutu: Toplam puan (küçük halka, yeşil/kırmızı), Durum (eşik 80), Süre, Soru sayısı (10).
- **Alan bazlı performans**: Pulse maddelerinin `objective` kodlarına (O1..On — `banks[].objective`) göre gruplayıp yüzde + çubuk ("Ritim tanıma %70", "İskemi/ST %50", "İleti bozuklukları %100" — objective→Türkçe etiket haritası `curriculum.js`'teki `labels`'tan). Alan yoksa bölüm gizli.
- **Zayıf alanlar** çipleri (<%60) → "İncelemede çalış" ilgili örüntüyü seçili açar (`state.mode`).
- **Soru raporu** tablosu (tam genişlik): satır = soru; tıklanınca genişler: soru kökü, verilen yanıt, doğru yanıt, ✓/✗, açıklama (`optionFeedback`) — değerlendirme geri bildirimi burada verilir.
- Eylemler: "Modülden Çık" (mevcut `finishBtn` akışı — LMS bitirme dialogu korunur), "Aynı soruları tekrar dene", "Yeni 10 soru örneklemi", "İnceleme modunda çalış".
- LMS'e yazılan puan mantığı (en iyi tamamlanmış deneme) **değişmez**; ekran yalnız gösterir.

### 4.3 Uygulama sonu raporu
Vaka oturumu 10/10 gönderildiğinde aynı sonuç şablonunun hafif sürümü (`#resultsView` "Vaka Oturumu Tamamlandı" varyantı; puan LMS'e yazılmaz — mevcut kural).

### 4.4 Kabul (Faz 4)
Değerlendirmede madde geri bildirimi görünmez, sonuçta görünür; puan/`bestScore`/`passed` mantığı ve
`cmi.interactions` raporu değişmedi (qa/independent_scorm.mjs geçer); Ausculta `05-sonuclar` ile aynı
yapı.

---

## 5. Faz — Eğitici paneli ve kalanlar
- Eğitici paneli: `.card` sistemine geçir, başlık/tab dili aile; CSV indirme korunur.
- "Oturumu kaydet ve bitir" dialogu, kayıt durumu (`#saveStatus`) metinleri: Ausculta tonunda kısa; footer üstünde ince durum çubuğu yerine header çipinin yanında küçük kayıt ikonu (✓ kaydedildi / ⟳ deneniyor / ! başarısız — `title` ile ayrıntı).
- Klavye kısayolları listesi Yardım modalında.
- `prefers-reduced-motion` tüm yeni animasyonları kapsar; odak halkası 3px `--blue-500`.

---

## 6. Faz — Doğrulama, paketleme, belgeler
1. `python3 qa/build.py` → `EGEMED_PULSE_Onizleme.html`, `EGEMED_PULSE_SCORM_1.2.zip`; `python3 qa/sol_package_tests.py` geçer.
2. `qa/*.mjs` betikleri yeni seçicilere göre güncel ve geçer (özellikle `independent_e2e`, `sol_ui`, `independent_state`, `independent_scorm`, `independent_visibility_probe` — 16 s gözlem koşulları görünüm değişikliğinden etkilenmemeli).
3. Görsel kabul: 1366×768, 768×1024, 390×844'te landing, öğretici, mod seçimi, inceleme, uygulama (soru/geri bildirim/vaka sonu), değerlendirme, sonuçlar, hakkında → `qa/evidence/family/`; her görüntüyü Ausculta karşılığıyla yan yana **kendin incele**; yatay taşma yok.
4. Belgeler: `cardai/KULLANIM.md` (akış, adlandırma, yazı ölçeği notu, klavye), `BUILD.md` (varsa yeni dosya), `AUDIT.md`'ye "Ürün ailesi hizalaması" bölümü.
5. Son rapor: faz bazında yapılanlar, değişen dosyalar, korunan değişmezler (kilit/skor/şema/model), qa sonuçları, ekran görüntüsü listesi, **kullanıcı kararı bekleyen** noktalar.

---

## 7. Durum/şema kısıtları (tek izinli ek)
- `state.js` `u` alanı: `['sim','case','quiz','educator','modes','about','results','tutorial']`
  indeksleri 0–7 (`int(raw.u,0,7,0)`); eski kayıtlar (0–3) geçerli; sürüm **6 kalır**.
- Öğretici "Tekrar gösterme" kalıcı bayrağı: mevcut `e` (features) dizisine **eklenmez**; yeni tek bit
  `w` (0/1) — `decode`: `int(raw.w,0,1,0)`, `encode`: `w:s.tutorialDone?1:0`. Oturum içi
  `tutorialSeen` kayda yazılmaz.
- Değerlendirme zamanlayıcısı kayda yazılmaz (yalnız görünüm).
- 4096 bayt bütçesi: `qa/independent_state.mjs` en dolu durumda boyutu ölçmeli (yeni alanlar +≤ 10 bayt).

---

## 8. Kullanıcı kararı bekleyen noktalar (raporda sor, kendin değiştirme)
1. Kilit kuralları (13×16 s → vakalar → değerlendirme) Ausculta'da yok; korunuyor. Gevşetme?
2. Değerlendirmede anlık madde geri bildiriminin sonuç ekranına taşınması (Ausculta kuralı) — onay.
3. Pulse'un %120 sabit yazı ölçeğinin aile ölçeğine (14px gövde) indirilmesi — onay.
4. Kaliper/ölçüm araçlarının Uygulama ve Değerlendirme ekranlarında da açık olması (mevcut) — korunur.
5. Öğrenci isimleri (Kullanıcı kabul testleri) ve Pulse'a özgü validasyon ekibi üyeleri.

---

## 9. Teslim sırası ve tahmini iş
| Faz | İçerik | Bağımlılık |
|---|---|---|
| 0 | Token'lar, keşif, qa seçici haritası | — |
| 1 | Header, footer, landing, hakkında | 0 |
| 2 | Mod seçimi, öğretici, mod değiştirme, `u`/`w` eki | 1 |
| 3 | Uygulama (vaka) ekranı | 2 |
| 4 | Değerlendirme + sonuçlar | 3 |
| 5 | Eğitici, kayıt durumu, kısayollar, a11y | 4 |
| 6 | Paket, qa, belgeler, rapor | 5 |

Her faz sonunda durup kısa rapor ver; kullanıcı onayı gelmeden bir sonraki faza geçme **yalnız**
kullanıcı "fazları art arda yap" dediyse gerekmez — aksi hâlde faz sonunda bekle.
