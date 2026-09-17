# EGEMED Pulse — Revizyon 2: Ausculta UI/UX referansı + klinik içerik sadeleştirme

**Referans ürün:** https://github.com/ozankaraca10/egemed-ausculta — yerel kopya
`/Users/ozankaraca/Documents/Default Project/egemed-ausculta` (main, origin ile senkron).
Bu depodaki kopyalar: `baseline/ausculta-reference/*.tsx`, `ausculta-styles.css`, `screens/*.png`.
Önceki hizalama planı `YONERGE_URUN_AILESI_UIUX_PLANI.md` büyük ölçüde uygulandı (commit a68bf71);
bu yönerge **kalan farkları** ve **içerik sadeleştirmesini** kapsar. Çakışmada bu yönerge geçerlidir.

**Kullanıcı kararları (bu turda geçerli):**
1. İnceleme (sim) ekranı **dokunulmaz** — sadece somut bir hata varsa düzeltilir; düzen/sığdırma değişmez.
2. Vaka ve değerlendirme maddeleri **klinik ve sade** olacak; hesap/formül ağırlıklı maddeler azaltılır.
3. Git commit **yapılmaz**. Çalışma zamanı kodu yalnız `cardai/` içinde.
4. Değişmezler: `model.js`, EKG sahnesi/kaliper, skorlama (8/10=80), SCORM şeması (`state.js` sürüm 6,
   4096 bayt), `qa/build.py` paketleme, 200 vaka + 200 soru, madde başına 5 seçenek, kilit/öneri mantığı.

Çalışma kuralları: IIFE modül / `$()` / kompakt satır stili ve Türkçe metin dili korunur; yeni PNG
eklenmez (inline SVG); her faz sonunda `python3 qa/build.py` + `python3 qa/sol_package_tests.py` +
ilgili `qa/*.mjs` geçmeli. QA betikleri `http://127.0.0.1:8765/` üzerinden depo kökünü bekler
(`python3 -m http.server 8765` depo kökünde) ve Playwright'ı
`/Users/ozankaraca/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs`
yolundan içe aktarır. Değişen seçiciler için `grep -rn "<seçici>" qa/*.mjs` ile bağımlı testleri güncelle.

---

## Faz A — Vaka (Uygulama) ve Değerlendirme ekranı kabuğu

Hedef: `baseline/ausculta-reference/screens/03-uygulama-vaka-1366.png`, `03b-…`, `03c-…`, `04-degerlendirme-1366.png`.
Mevcut durum: `qa/evidence/family/final/1366-05/06/07/08-*.png` — sağ sütundaki geri bildirim ve
"Devam Et"/vaka sonu kartı ekran altına taşıyor; Ausculta'da iki sütun header'ın hemen altında başlar.

A1. `index.html` `#caseView` ve `#quizView`: `.view-heading` bloğunu (h1 "Klinik bilgiyi EKG bulgusuyla
    birleştir." / "Gördüğünü mekanizmayla eşleştir.", eyebrow, **"← Simülasyona dön"** düğmesi) **kaldır**.
    Header'daki `Mod Değiştir` ve marka bağlantısı zaten geri dönüş sağlıyor. `#caseTitle`/`#quizTitle`
    `aria-labelledby` hedefleri için görsel olarak gizli (`.sr-only`) bir h1 bırak.
A2. Vaka ekranındaki ikinci ilerleme şeridini (`#casePageLabel` "Vaka 01 /10" + `#caseProgressBar` +
    `#caseAnswered` "Gönderilen N /10") **kaldır**; header'daki `.header-progress` ("Vaka N / 10") ve
    Olgu kartındaki `Vaka N / 10` rozeti yeterli. Gönderilen sayısını header ilerleme çubuğuna bağla
    (çubuk = gönderilen/10). `features.js:83` civarındaki güncellemeleri ve `qa/*.mjs` bağımlılıklarını uyarla.
A3. Değerlendirme ekranındaki açıklama paragrafı ("Değerlendirme13 örüntü gözlemi ve10 gönderilmiş…") —
    boşluk hatası var ve Ausculta'da karşılığı yok: **kaldır**. `.strict-banner` kalır (ilk soruda tam,
    sonrakilerde kompakt — mevcut davranış).
A4. İki sütun `.case-layout`/`.quiz-layout` header'ın hemen altında başlasın (Ausculta: üst boşluk
    ~12px). 1366×768'de sol sütun (stage-card + derivasyon chip'leri + toolbar) footer üstünde bitmeli;
    sağ sütun soru kartı "Yanıtla" düğmesi görünür olmalı (gönderim öncesi kaydırma gerekmemeli).
    Geri bildirim sonrası sağ sütun kaydırılabilir (Ausculta'da da öyle) — ama "Devam Et" düğmesi
    geri bildirim kutusunun **üstünde** değil hemen altında, kısa bir kutuyla görünür olsun (A6).
A5. Seçenekler: A–E harf rozeti yerine Ausculta `.opt` radyo dairesi (`Questions.tsx` / `.opt .radio`
    stili — `ausculta-styles.css`'ten uyarla). Seçili: mavi kenar + dolu daire; gönderim sonrası
    doğru = yeşil kenar + ✓ daire, seçilen yanlış = kırmızı kenar + ✗ daire. `role=radio aria-checked`,
    ok tuşu gezinme, 44px dokunma hedefi korunur. "Yanıtla →" seçim yapılmadan `disabled` (açık mavi).
A6. Geri bildirim (Uygulama modu): Ausculta `03b` kalıbı — büyük ✓/✗ ikonu + "Doğru!"/"Yanlış",
    "Yanıtınız: …", "Doğru yanıt: …" (yeşil), ardından **tek** açıklama paragrafı: doğru seçeneğin
    açıklaması; yanlışsa ek olarak "Seçtiğiniz seçenek neden değil: …" (yalnız seçilen çeldiricinin
    açıklaması). Beş seçeneğin tamamını listeleyen `optionFeedback` çıktısı vaka ekranından kalkar;
    tam liste **Sonuçlar → Soru raporu** genişleyen satırında kalır. CTA "Devam Et" / "Vakayı tamamla".
A7. Olgu kartı: `item.vitals` varsa Ausculta `.kv` kutuları (Nabız / TA / SpO₂ / Solunum / Ateş —
    yalnız verilenler). Stem "**Başvuru:** …" kalıbıyla (Faz B ile birlikte).
A8. Değerlendirme ekranı: aynı düzen; mor kimlik korunur; madde geri bildirimi sınav sırasında yok
    (mevcut). Header saati ve "Yanıtları değerlendir" korunur.
A9. Header ince ayar (Ausculta `ausculta-chrome.tsx`): Yardım/Hakkında grubu önünde dikey ayırıcı;
    tam ekran ikonu köşe-ok (⛶ tarzı inline SVG). Küçük iş; başka header değişikliği yok.
A10. Mod seçim kartları: metin yoğunluğunu Ausculta `02-mod-secimi-1366.png` seviyesine indir —
    3 madde + tek satırlık küçük not (öneri/kilit durumu). "Kurallar: …" satırını kaldır; kural
    bilgisi `.strict-banner`'da zaten var.

Kabul: 1366×768, 1280×800, 768×1024, 390×844'te vaka soru/geri bildirim/vaka sonu + değerlendirme
ekran görüntüleri `qa/evidence/family/rev2/`; yatay taşma yok; `qa/ui_audit.mjs`, `sol_ui`,
`independent_e2e`, `independent_state`, `independent_scorm` geçer.

---

## Faz B — İçerik: klinik ve sade vaka/değerlendirme maddeleri (`cardai/curriculum.js`)

Mevcut yapı: `bank(id,objective,rows)` seçenek bankaları (5 seçenek + 5 açıklama), `caseRows`/`quizRows`
mod başına 15 satır `stem^task^bankId`, `extraCases`/`extraQuestions` 5+5, `makeItems` → 200 C + 200 Q.
`qa/independent_content.mjs` değişmezleri: her havuzda 200 madde; `stem+question` metni benzersiz;
`mode:decisionId` çifti havuz içinde benzersiz; doğru seçenek pozisyonları 40'ar (i%5 — otomatik);
5 benzersiz seçenek; `objectiveIds` O1–O6; başlık/aria'da tanı adı sızmaz (`/AF|flutter|STEMI|VF|sinüs|bloğu/i`
title+ariaLabel'da yasak); sayısal id'ler (`rr800, pr175, q80, qt350, st32, …`) doğru seçenekteki ilk
sayı ile model değerini karşılaştırır.

Sorun: maddeler "Kaliper P'nin ilk sapmasını R'ye göre −215 ms işaretliyor → PR kaç?",
"aVR için doğru formül?", "Görsel ölçek/grid pikseli", "Oynatma 2× çarpanı" gibi hesap ve araç-teknik
ağırlıklı; klinik senaryo yok. Ausculta'da her olgu kısa klinik vinyet + vitaller + tek net soru.

B1. **Stem = kısa sentetik klinik vinyet.** Kalıp: "*NN yaşında kadın/erkek hasta.* **Başvuru:** …
    (1–2 cümle: yakınma, bağlam, muayene bulgusu)". Yaş/cinsiyet/yakınma sentetiktir; gerçek hasta
    kaydı değildir — `limitations` metnine "Olgu vinyetleri ve vitaller sentetiktir" eklenir.
    `makeItems` içindeki "Sınırlandırılmış sentetik eğitim senaryosu. " ön eki **kaldırılır**
    (sahnedeki "● Sentetik kayıt" rozeti yeterli). Her satırın vinyeti farklı olmalı (benzersizlik).
B2. **Vitaller.** Satır formatı `stem^task^bankId^vitals` (4. alan isteğe bağlı). `vitals` =
    `Nabız=88/dk düzensiz;TA=130/85;SpO₂=%96` biçimi → `item.vitals=[{k,v}]`. Mod başına varsayılan
    vital seti tanımla (satırda verilmezse kullanılır) ve **EKG modeliyle tutarlı** tut
    (`model.js rrAt`): normal/stemi/inferior/pvc/lbbb/rbbb ≈ 75/dk; sintach 120; pat 150;
    flutter 150; svt ≈ 165; vt ≈ 160 (hipotansif olabilir); af kontrollü 60–100 düzensiz, hızlı
    profil 110–170 düzensiz; **vf: "Nabız alınamıyor", TA "ölçülemiyor", bilinç kapalı**.
    STEMI/inferior: göğüs ağrısı bağlamı; inferior'da bradikardi/hipotansiyon yok (model 75/dk).
B3. **Soru (task) = tek, klinik dilde.** Örnekler: "Bu EKG'deki ritim hangisidir?", "Bu bulgu için
    ilk yorum ne olmalıdır?", "Hangi derivasyon grubu bu bölgeyi gösterir?", "Bu hastada nabız
    düzenli mi, düzensiz mi beklenir?", "Kalp hızı yaklaşık kaçtır?".
B4. **Bankalar.** Kavramsal bankalar (O2 ritim, O5 klinik sınırlar, O1 sistematik okuma, O4
    elektrik–mekanik) **korunur**, seçenek/açıklama dili sadeleştirilir: kısa seçenek (≤ 8 kelime),
    açıklama tek cümle, jargon azaltılır ("ayrık P yokluğu + düzensiz R–R" gibi ifadeler kalabilir,
    "terminal sağ/lateral bileşenler … tutarlı dağıtılıyor" gibi ifadeler gider).
    **Kaldırılacak/ dönüştürülecek bankalar** (formül/araç/piksel): `avr, avl, avf, limb,
    componentTransform, speed, timeScale, grid200, pvcAverage, anteriorAVL, inferiorAVR, iii28,
    avf24, avl18, pToQR315, pToQL335, j, rateVsRR, duration, qt, qtNone, prNone`. Yerlerine aynı
    hedefte (O3/O6) **klinik** bankalar: ör. O3 "Hangi derivasyonlar inferior duvarı gösterir?
    (II, III, aVF)", "V1–V2 hangi bölge?", "aVR'de P negatif olması ne anlatır?"; O6 "Kalp hızı
    yaklaşık kaç? (~75 normal / ~150 hızlı / ~40 yavaş …)", "QRS dar mı geniş mi?", "PR normal mi
    uzun mu?", "Ritim düzenli mi?". Basit sayısal bankalar (`rr800/360/380/400/500, pr175/140,
    q80/140/160/180, qt350/…`) **kalabilir** ama sade kalıpla: seçenek "Yaklaşık 75/dk" /
    "Dar (≈80 ms) — normal" biçiminde; doğru seçenekteki ilk sayı model değeriyle eşleşmeli
    (`independent_content` sayısal testi). Sayısal maddelerin toplam payı havuz başına **≤ %15**
    (≤ 30/200); formül türetme, mm/piksel, oynatma hızı, ölçek soruları **sıfır**.
    O3 "Derivasyon ilişkileri" etiketi `features.js OBJECTIVE_LABELS` içinde "Derivasyon ve bölge
    bilgisi"; O6 "Ölçüm ve hız kontrolü" → "Hız, aralık ve düzen" olarak güncellenebilir.
B5. Her modun 15 satırı 15 **farklı** banka kullanmalı (mevcut kural). Bir bankanın **doğru
    seçeneği o modun EKG'siyle tutarlı** olmalı (ör. `sinus` bankası yalnız normal modda doğru).
    Yeni banka eklerken `bank('id','Ox',[[doğru,açıklama],[çeldirici,açıklama]×4])` — ilk satır doğru.
B6. Uygulama (C) ve değerlendirme (Q) maddeleri aynı kavramları farklı vinyetlerle sorabilir
    (mevcut sınırlılık notu); değerlendirme maddeleri **daha bağımsız** olsun: vinyet + tek
    yorum sorusu, ipucu vermeyen stem (stem içinde cevabı söyleme: "AF'li hasta… ritim hangisi?" olmaz).
B7. Kaynak eşleme (`modeSources`, `sourceIds`) ve `objectiveIds` dağılımı korunur; O1–O6'nın her biri
    her havuzda en az 15 maddede kalsın.
B8. `qa/independent_content.mjs` tekrar çalıştırılır; `qa/evidence/final/all400-independent-review.tsv`
    ve `qa/sol_item_inventory.json` yeniden üretilir. `KULLANIM.md` "Öğrenme sırası"/içerik bölümü,
    `AUDIT.md` (yeni "Revizyon 2" bölümü), `MEDICAL_SOURCES.md` (değişen kavram varsa) güncellenir.

Kabul: 400 madde şema/benzersizlik/pozisyon testleri geçer; rastgele 20 maddelik örnekleme
(`node -e` ile) okunduğunda her stem klinik vinyet, her soru tek cümle, formül/piksel/oynatma
sorusu yok; vitaller EKG hızıyla çelişmiyor.

---

## Faz C — Doğrulama ve paket
1. `python3 qa/build.py` → `EGEMED_PULSE_Onizleme.html` + `EGEMED_PULSE_SCORM_1.2.zip`;
   `python3 qa/sol_package_tests.py` geçer; `BUILD.md` hash tablosu güncellenir.
2. `qa/ui_audit.mjs`, `qa/sol_core.mjs`, `qa/sol_followup.mjs`, `qa/sol_ui.mjs`,
   `qa/sol_state_model.mjs`, `qa/sol_scorm_edges.mjs`, `qa/independent_{content,state,scorm,e2e}.mjs`
   çalıştırılır; başarısızlar düzeltilir (test beklentisi eskiyse test güncellenir, gerekçesi raporda).
3. Ekran görüntüleri `qa/evidence/family/rev2/` (1366/768/390: modes, case-question, case-feedback,
   case-end, exam, results, about). İnceleme ekranı görüntüsü **değişmediğini** göstermek için alınır.
4. Son rapor (`qa/evidence/family/rev2/RAPOR.md`): yapılanlar, değişen dosyalar, kaldırılan/eklenen
   bankalar, sayısal madde payı, test sonuçları, **kullanıcı kararı bekleyen** noktalar.

---

## Faz D — Kabuk hizalaması: Header, Footer, Landing, Hakkında (kullanıcı eki)

Ausculta kaynağı doğrudan referanstır: `/Users/ozankaraca/Documents/Default Project/egemed-ausculta/src/ui/chrome.tsx`
(Header/Footer), `src/ui/icons.tsx`, `src/screens/StartScreen.tsx`, `src/screens/SourcesScreen.tsx`,
`src/styles.css` (`.eg-header*`, `.eg-footer*`, `.footer-*`, `.start-hero*`, `.hero-*`, `.why-*`,
`.about-*`/Sources bölümleri). Hedef görüntüler: `screens/01-landing-1366.png`, `07-hakkinda-1366.png`.
Mevcut Pulse: `qa/evidence/family/final/1366-01-landing.png`, `1366-11-about.png`.

D1. **Header** (`chrome.tsx` düzeni birebir):
    `[marka] [spacer] [bağlam grubu: mod çipi (+ değerlendirmede saat)] [spacer] [⇄ Mod Değiştir] [⛶] | [? Yardım] [ⓘ Hakkında]`
    - Bağlam grubu header'ın **ortasında** (iki `.spacer` arasında), Ausculta `.eg-header-context`.
      Pulse'un `.header-progress` metni ("Vaka N / 10", "N / 13 örüntü", "Soru N/10 · ⏱") bu grupta
      çipin **solunda** küçük metin olarak kalır (Ausculta'da yok ama Pulse için bilgi taşıyor);
      ilerleme çubuğu ince (4px) çipin altına değil, metnin yanına — tek satır yüksekliğini aşmasın.
    - İkonlar `icons.tsx`'ten birebir inline SVG (stroke 2, 18px): `IconSwap`, `IconFullscreen` /
      `IconFullscreenExit` (tam ekran durumuna göre değişir), `IconHelpCircle` (Yardım — soru işareti),
      `IconInfo` (Hakkında). Mevcut kutulu ok ikonu ve çift (i) ikonu gider.
    - Tam ekran düğmesinden sonra `.divider-v` (1px, 24px, rgba(255,255,255,.22)).
    - Düğme stili `.eg-header-chip.clickable` (şeffaf, hover rgba(255,255,255,.1), `--blue-100` metin).
    - Değerlendirmede saat: çipin yanında `IconClock` + mm:ss (`.eg-timer`).
    - ≤720px: Mod Değiştir/tam ekran gizli (`hide-mobile`), ≤480px: `brand-top` gizli, kısa mod adı.
D2. **Footer** (`Footer()` birebir): ortalı tek satır; solda **ürün ikonu** (Pulse için
    `assets/egemed-pulse-favicon.png` — Ege Tıp mührü değil; Ausculta kendi `logo-icon-web.png`'sini
    kullanır) 26px + metin: `EGEMED Pulse™` (kalın) `Etkileşimli EKG Simülatörü` `, Ege Üniversitesi
    Tıp Fakültesi Dekanlığı tarafından geliştirilmiştir.` (kalın `--ink-800`) `Tüm hakları saklıdır © 2026`.
    Kademeli kısalma: ≤860px `.footer-sub` gizli, ≤480 `.footer-copy` gizli. Sağ blokta Ausculta'nın
    "Ses kayıtları" atfı yerine Pulse için `Sinyaller sentetiktir · klinik tanı için kullanılmaz`
    (≤1280 gizli). Yükseklik `--foot-h:52px`.
D3. **Landing** (`StartScreen.tsx` + `.start-hero*`): Pulse'taki yapı zaten yakın; farkları kapat:
    - `.hero-title` `clamp(28px,3.2vw,44px)`, 800, `-.6px`; başlık **tek satır** olacak şekilde
      kısalt: "Elektriksel etkinliği, mekanik yanıtı ve dolaşımı birlikte keşfedin." → 1366'da iki
      satıra sarıyor; "EKG'yi, kalbi ve dolaşımı birlikte keşfedin." gibi tek satırlık alternatif kullan.
    - `.hero-sub` `--fs-lg`, `max-width:680px`; CTA `.hero-cta` (16px 34px, degrade, gölge, ok ikonu);
      `.hero-links` (Nasıl kullanılır? | ⓘ Hakkında ve kaynaklar) `.hero-link` stili — mevcut alt
      çizgili bağlantı stili gider; `.why-grid` `max-width:640px`, kutu `--r-md`, başlık `--fs-lg`.
    - Alt satır `.hero-audio-hint` kalıbında ikonlu: "Sinyaller sentetik öğretim şemalarıdır; klinik
      tanı için kullanılmaz." (kulaklık yerine uyarı/bilgi ikonu).
    - Silik amblem, degrade arka plan (`.start-hero-screen`, `.hero-glow`) Ausculta değerleriyle.
    - 1366×768 ve 1280×800'de footer dahil kaydırmasız (`@media (max-height:820px)` sıkıştırması).
D4. **Hakkında** (`SourcesScreen.tsx` yapısı birebir):
    - Üst `HAKKINDA` eyebrow ve sağ üst "← Geri" **kaldır**; başlık `EGEMED Pulse™ Hakkında`
      Ausculta ölçeğinde (34px/800), altında tek cümle açıklama.
    - Bölüm başlıkları: ikon (outline, mavi, 20px — Ausculta ikon seti) + başlık; "Geliştiriciler"
      3 lacivert kart (mevcut — doğru), "Kurum" kartı: mühür + ürün adı + açıklama + kanıt cümlesi
      **satır içi** üst simge `[1]` ile, ardından küçük atıf satırı + doi bağlantısı (Pulse'taki mavi
      kutu kalıbı gider; Oh S-Y … Acad Med 2022 atfı korunur).
    - Sonraki bölümler Ausculta sırasıyla: "Kaynaklar" (Pulse: kılavuz kartları — ESC/AHA; Ausculta
      "Ses Veri Setleri" kartlarının yerine), "Sınırlılıklar" kutusu, en altta "← Geri" düğmesi
      (Ausculta'daki konum ve stil).
    - İçerik genişliği ve kenar boşlukları Ausculta `.sources-screen` ile aynı (1200px, 24px).
D5. Kabul: 1366/768/390'da landing, hakkında, bir çalışma ekranı (header/footer için) görüntüleri
    `qa/evidence/family/rev2/` — Ausculta `01`/`07` ile yan yana aynı yapı; footer tek satır ortalı;
    header'da çip ortada; `qa/ui_audit.mjs` ve `sol_ui` seçici güncellemeleri yapılmış ve geçer.

---

## Faz E — Sonuç ekranları hizalaması (kullanıcı eki)

Referans: `/Users/ozankaraca/Documents/Default Project/egemed-ausculta/src/screens/ResultsScreen.tsx`
ve `src/styles.css` (`.results-wrap-v2`, `.results-title-v2`, `.results-sub-v2`, `.weak-chip-row`,
`.results-summary-strip`, `.rs-box/.rs-lbl/.rs-num/.rs-status/.rs-ring-sm.score-ring`, `.domain-row*`,
`.report-table-v2`, `.report-row`, `.report-detail-row`, `.rd-*`, `.results-actions`).
Hedef görüntü: `baseline/ausculta-reference/screens/05-sonuclar-1366.png`. Mevcut Pulse:
`qa/evidence/family/final/1366-10-results.png` (değerlendirme) ve `1366-12-results-case.png` (vaka).
İki varyant (değerlendirme / vaka oturumu) aynı şablonu kullanır; `#resultsView` ve `features.js`
`rowsFor/domainRows/reportRows/weakChips` işlevleri uyarlanır. LMS puan mantığı değişmez.

E1. Üst blok: eyebrow ("DEĞERLENDİRME") ve sağ üst "← Geri" **kalkar**. `h1.results-title-v2`
    (Ausculta ölçeği ~34px/800): değerlendirmede "Değerlendirme Tamamlandı", vaka oturumunda
    "Vaka Raporu". Altında `.results-sub-v2` tek paragraf: başarılıysa "Tebrikler — performansınız
    hedefin üzerinde. Bu düzeyi korumak için İnceleme modunda farklı örüntülerle çalışmaya devam
    edebilirsiniz."; değilse "Hedef puanın altında kaldınız. İnceleme modunda ilgili örüntüleri tekrar
    izleyip Uygulama modunda yeniden denemeniz önerilir." (vaka varyantında "hedef" = 8/10).
E2. **Zayıf alanlar** ayrı bölüm değil, alt başlığın hemen altında `.weak-chip-row`: "Zayıf alanlar:"
    etiketi + turuncu `.badge.orange.weak-chip` çipleri (<%60 alanlar; alan etiketleri
    `OBJECTIVE_LABELS`). Çip tıklanınca ilgili örüntüyle İnceleme açılır (mevcut "İncelemede çalış"
    davranışı çipin kendisine taşınır, ayrı bağlantı metni yok). Zayıf alan yoksa satır yok.
E3. **Özet şeridi** `.results-summary-strip`: değerlendirmede 4 kutu (Toplam puan halkalı `.rs-ring-sm`
    + "Toplam puan"; `.rs-status` ✓ "Başarılı"/"Hedefin altında" + "Durum (eşik 80)"; ⏱ süre + "Süre";
    sayı + "Soru sayısı"), vaka oturumunda 3 kutu (süre yok; "Vaka sayısı"). Etiketler küçük büyük
    harf `.rs-lbl` (Ausculta: değer üstte, etiket altta — Pulse'taki "etiket üstte" düzeni değişir).
    Halka: 80×80 SVG, track/prog, 8px, yeşil/kırmızı.
E4. **Alan bazlı performans** bir `.card` içinde: `h3` + `.domain-row`lar — solda küçük mavi ikon
    kutusu `.dr-ic` (alan başına ikon: O1 liste, O2 kalp ritmi, O3 derivasyon/ızgara, O4 kalp,
    O5 bilgi, O6 saat — Ausculta ikon setinden), etiket, `.domain-bar`, sağda `%NN` (`.dr-pct`).
    Pulse'un "%67 · 2/3" biçimi yerine yalnız `%NN`; sayı `title`/aria'da kalabilir.
E5. **Soru/Vaka raporu** bir `.card` içinde `.report-table-v2` **tablo**: başlık satırı
    `SORU · PUAN · SONUÇ` (değerlendirme) / `VAKA · SONUÇ` (vaka oturumu; Ausculta'daki İPUCU sütunu
    Pulse'ta yok — kaldır). Satır: `.report-chev` ok + madde başlığı (soru kökü kısaltılmış, ~70 karakter)
    + sonuç `Doğru`/`Yanlış` (yeşil/kırmızı `td.ok/.no`). Tıklanınca `.report-detail-row` açılır:
    `.rd-q` soru metni, `.rd-given` "Verilen yanıt: …", `.rd-correct` "Doğru yanıt: …" (yeşil),
    `.rd-feedback` açıklama (italik; doğru seçeneğin açıklaması + yanlışsa seçilen çeldirici
    açıklaması), sağda `.rd-mark` ✓/✗. `<details>` yerine tablo + `aria-expanded` düğme;
    `.table-scroll` sarmalayıcı (mobilde yatay kaydırma).
E6. **Eylemler** `.results-actions`: `[⏏ Modülden Çık]` (primary, mevcut finishBtn/LMS bitirme akışı)
    `[Tekrar dene]` (outline — aynı örneklem) `[İnceleme modunda çalış]` (outline). Pulse'a özgü
    "Yeni 10 soru örneklemi" outline olarak dördüncü düğme kalır (kullanıcı kararı bekleyen not:
    Ausculta'da yok). Vaka varyantında "Modülden Çık" yerine `[Değerlendirmeye gir →]` primary.
E7. Sayfa genişliği `.results-wrap-v2` (Ausculta: max 1200px, 24px yan boşluk, sola hizalı doküman
    akışı), arka plan `EcgDeco` yıkaması; footer içeriğin sonunda. Mobil 390: kutular 2×2, tablo
    yatay kaydırır, eylemler alt alta.
E8. Kabul: 1366/768/390 değerlendirme ve vaka sonuç görüntüleri `qa/evidence/family/rev2/`; Ausculta
    `05-sonuclar` ile aynı hiyerarşi; `independent_scorm`, `sol_core`, `ui_audit` geçer; puan/`bestScore`/
    `passed`/`cmi.interactions` değişmedi.
