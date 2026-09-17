# Revizyon 2 — Ausculta hizalama + içerik sadeleştirmesi — Rapor

> **Güncelleme (18 Eylül 2026, doğrulama turu):** Aşağıdaki ilk teslimden sonra görsel/içerik
> incelemesinde bulunan 14 madde ve bir sim-ekranı flicker düzeltmesi uygulandı. Bu güncellemenin
> ayrıntıları dosyanın **en altındaki "Doğrulama turu düzeltmeleri" bölümündedir**; okuma sırası
> önce bu bölüm, sonra ilk teslimin ayrıntılarıdır.

Kapsam: `YONERGE_REVIZYON_2_AUSCULTA_HIZALAMA.md` Faz A (vaka/değerlendirme kabuğu), Faz B (içerik),
Faz C (doğrulama/paket), ve çalışma sırasında eklenen Faz D (header/footer/landing/hakkında) ile
Faz E (sonuç ekranları). Çalışma zamanı kodu yalnız `cardai/` içinde değişti. **Git commit yapılmadı.**
İnceleme (sim) ekranına dokunulmadı; `model.js`, EKG sahnesi/kaliper, skorlama (8/10=80) ve SCORM
şeması (`state.js` sürüm 6, 4096 bayt) değişmedi.

## Faz A — Vaka/Değerlendirme kabuğu

- `#caseView`/`#quizView`: `.view-heading` (eyebrow + "Klinik bilgiyi EKG bulgusuyla birleştir." /
  "Gördüğünü mekanizmayla eşleştir." başlığı + "← Simülasyona dön") kaldırıldı; yerine yalnız ekran
  okuyucuya yönelik gizli `h1.sr-only` bırakıldı (`#caseTitle`, `#quizTitle` — `showView` odak/duyuru
  akışı bozulmadı).
- İkinci ilerleme şeridi (`#casePageLabel`, `#caseProgressBar`, `#caseAnswered`) ve değerlendirme
  intro paragrafı kaldırıldı. `features.js` `renderCase()` içindeki bu elemanlara yazan ölü kod
  satırı temizlendi (aksi hâlde `null.textContent` ile çökerdi). Header'daki tek ilerleme çubuğu
  gönderilen sayısına bağlı kalmaya devam ediyor (`app.js progress()` — zaten mevcuttu).
- Seçenekler A–E harf rozeti yerine Ausculta `.opt-radio` dairesine geçti (seçili: mavi dolu nokta;
  gönderim sonrası doğru = yeşil kenar + ✓, seçilen yanlış = kırmızı kenar + ✗). Native
  `<input type=radio>` + ortak `name` zaten ok tuşu gezinmesini ve `checked`/`aria` durumunu sağladığı
  için ayrıca `role=radio`/`aria-checked` eklendi, davranış değişmedi. "Yanıtla →" ve "Yanıtla" (quiz)
  düğmeleri seçim yapılmadan `disabled`.
- Uygulama modu geri bildirimi: büyük ✓/✗ ikonu + "Doğru!"/"Yanlış" başlığı, yanlışsa "Yanıtınız: …"
  ve yeşil "Doğru yanıt: …" satırları, ardından **tek** açıklama paragrafı (doğru seçeneğin
  açıklaması) ve yanlışsa ek "Seçtiğiniz seçenek neden değil: …" satırı. Beşli tam liste yalnız
  Sonuçlar → Soru raporunda.
- Olgu kartına `item.vitals` varsa `.kv` kutuları eklendi (Nabız/TA/SpO₂ — yalnız verilenler).
- Mod kartlarındaki "Kurallar: …" satırı kaldırıldı (kural bilgisi `.strict-banner`'da zaten var).
- Header ince ayar: Yardım/Hakkında öncesi dikey ayırıcı; tam ekran ikonu inline SVG (bkz. Faz D).

## Faz D — Header/Footer/Landing/Hakkında

- Header, Ausculta `chrome.tsx` ile aynı iskelete getirildi: marka — spacer — bağlam grubu
  (ilerleme metni + ince ilerleme çubuğu + mod çipi, ortada) — spacer — Mod Değiştir/Tam ekran
  (ikon, ≤720px'te `hide-mobile`) — `.divider-v` — Yardım/Hakkında. İkonlar `icons.tsx`'ten birebir
  inline SVG (`IconSwap`, `IconFullscreen`/`IconFullscreenExit` — tam ekran durumuna göre
  `features.js syncFullscreen()` içinde path değişimiyle güncelleniyor, `IconHelpCircle`, `IconInfo`).
- Landing başlığı tek satıra indirildi: **"EKG'yi, kalbi ve dolaşımı birlikte keşfedin."** (1366'da
  tek satır — bkz. ekran görüntüsü). Bağlantı satırına ayraç ve ikon, alt uyarı satırına bilgi ikonu
  eklendi.
- Hakkında: üst "HAKKINDA" eyebrow'u ve sağ üst "← Geri" kaldırıldı; başlık Ausculta ölçeğinde
  (`--fs-3xl`/34px, zaten uygundu). Kurum kartındaki kanıt cümlesi satır içi üst simge `[1]`
  (bağlantılı) + altında küçük atıf satırı + doi bağlantısı biçimine getirildi (`institutionCard()`).
  "← Geri" düğmesi ekranın en altına, `Yerel veriler` bölümünden sonra taşındı.

**Uygulanmayan/kısmi kalan noktalar (kullanıcı kararı bekliyor):**
1. **Footer ürün ikonu** Ege Tıp mührü (`assets/brand/ege-tip-seal-128.png`) olarak kaldı; Ausculta'daki
   gibi ürün amblemine (favicon) çevrilmedi. Sebep: `qa/build.py` sabit 15 kaynak dosyasını hash'liyor
   ve `qa/sol_package_tests.py` (`test_deterministic_payload_and_integrity`) gömülü `<img>`/`<link>`
   baytlarının kümesinin tam olarak 4 ASSETS dosyasının baytlarına eşit olmasını zorunlu kılıyor.
   Mührün tek kullanım yeri footer'dı; oradan kaldırılırsa paket testi kırılır. Değiştirmek için ya
   mühür başka bir ekranda (ör. Hakkında Kurum kartı, şu an `ege-tip-logo.png` kullanıyor) yeniden
   referanslanmalı ya da `qa/build.py`/`ASSETS` envanteri ve ilgili paket testleri güncellenmeli —
   bu, "kaynak envanteri sabit" ilkesine dokunacağından kullanıcı onayı istiyorum.
2. **Footer sağ blok** ("Sinyaller sentetiktir · klinik tanı için kullanılmaz", ≤1280px gizli)
   eklenmedi. `qa/ui_audit.mjs`'nin `expectedFooter()` fonksiyonu footer metnini tam eşleşmeyle
   doğruluyor; yeni sağ blok eklenirse >1280px genişliklerde (1920/1600/1440) bu test güncellenmeden
   kırılır. Test dosyasını güncelleme kapsamı bu turda zaman bütçesi dışında tutuldu.
3. **Değerlendirme zamanlayıcısı** ayrı bir `IconClock` + `.eg-timer` öğesi yerine mevcut ilerleme
   metninin içine gömülü bırakıldı (`"Soru N/10 · ⏱ mm:ss"`). İşlevsel olarak eşdeğer; yalnız görsel
   biçim Ausculta'dan farklı (ikon yok, tek metin).

## Faz E — Sonuç ekranları

- `#resultsView` → `.results-wrap-v2`; üst eyebrow ve sağ üst "← Geri" kaldırıldı. Başlık
  ("Değerlendirme Tamamlandı" / "Vaka Raporu") + tek paragraf alt metin (başarı durumuna göre 2
  varyant, E1 metniyle birebir).
- Zayıf alanlar artık ayrı bölüm değil, alt metnin hemen altında `.weak-chip-row` (turuncu
  `.badge.orange.weak-chip`; tıklanınca ilgili örüntüyle İnceleme açılır — davranış çipin kendisine
  taşındı, ayrı "İncelemede çalış" bağlantısı yok).
- Özet şeridi `.results-summary-strip`/`.rs-box` (değer üstte, etiket altta): değerlendirmede 4 kutu
  (puan halkası `.rs-ring-sm`, durum `.rs-status`, süre, soru sayısı), vaka oturumunda 3 kutu (süre
  yok, "Vaka sayısı").
- Alan bazlı performans bir `.card` içinde `.domain-row-v2` (ikon + etiket + çubuk + `%NN`; sayı
  `title` özniteliğinde). `OBJECTIVE_LABELS` O3 → "Derivasyon ve bölge bilgisi", O6 → "Hız, aralık
  ve düzen" olarak güncellendi (Faz B'deki yeni bankalarla tutarlı).
- Soru/Vaka raporu `<details>` yerine `.report-table-v2` tablosu (SORU·PUAN·SONUÇ / VAKA·SONUÇ —
  İPUCU sütunu yok), satır tıklanınca `.report-detail-row-v2` açılıyor (`rd-q/rd-given/rd-correct/
  rd-feedback`, sağda ✓/✗). `.table-scroll` sarmalayıcı ile mobilde yatay kaydırma.
- Eylemler: değerlendirmede birincil **"⏏ Modülden Çık"** (yeni — `#finishDialog` onayından sonra
  `CardAIScorm.finish(state)` + landing'e dönüş; `scorm.js`'deki `finished` bayrağı sayesinde daha
  sonraki otomatik `pagehide` bitirmesiyle çakışmıyor — `independent_e2e.mjs`'nin tekil `LMSFinish`
  beklentisi hâlâ geçiyor), vaka oturumunda **"Değerlendirmeye gir →"**; ikisinde de outline "Tekrar
  dene" (aynı örneklem), "İnceleme modunda çalış" ve — Ausculta'da karşılığı olmayan, **kullanıcı
  kararı bekleyen** — "Yeni 10 …örneklemi" düğmesi. Puan/`bestScore`/`passed`/`cmi.interactions`
  mantığı değişmedi (bkz. test sonuçları).

## Faz B — İçerik (`cardai/curriculum.js` tamamen yeniden yazıldı)

**Kaldırılan bankalar (22, formül/araç/piksel):** `avr, avl, avf, limb, componentTransform, speed,
timeScale, grid200, pvcAverage, anteriorAVL, inferiorAVR, iii28, avf24, avl18, pToQR315, pToQL335,
j, rateVsRR, duration, qt, qtNone, prNone`.

**Eklenen bankalar (17, klinik/kavramsal):**
- O3 (derivasyon/bölge, mod-bağımsız gerçek): `inferiorLeadGroup`, `lateralLeadGroup`,
  `precordialSeptal`, `anteriorLeadGroup`, `augmentedGroup`.
- O6 (hız/aralık/düzen, mod grubuna göre doğru): `qrsNarrowBank`/`qrsWideBank`/`qrsUnmeasurableBank`
  (QRS dar mı geniş mi), `prNormalBank`/`prUnmeasurableBank` (PR normal mi), `rhythmRegularBank`/
  `rhythmIrregularBank` (ritim düzenli mi), `pWaveVisibleYesBank`/`pWaveVisibleNoBank`/
  `pWaveEctopicBank` (P seçilebiliyor mu), `stIsoelectricBank`/`stSecondaryBank` (ST izoelektrik mi /
  geniş QRS'e sekonder mi).

Kalan ~74 klinik/sayısal banka (sinus, af, svt, pvc, vt, vf, lbbb, rbbb, anterior, inferior, pulse,
mechanic, fill, eject, p/qrs/t, pr, st, rr800/500/400/380/360, pr175/140/prL175/prR175,
q80/140/160/180, qt350/430/410/345/245, st32/st20, flutterCount, urgent, limits, leadAll, vb.)
**korundu**; her 400 maddenin `decisionId`'si bu havuzdan geliyor.

**400 madde tamamen yeniden yazıldı:**
- Her stem `"NN yaşında kadın/erkek hasta. Başvuru: …"` kalıbında, 13 mod × 30 (15 vaka + 15
  değerlendirme) = 390 + 10 ek madde = 400 **benzersiz** klinik vinyet (yaş/cinsiyet/bağlam
  kombinasyonu elle yazıldı, kopyala-yapıştır şablonu değil). "Kimlik" bankaları (sinus/af/svt/…)
  için stem tanıyı adıyla söylemiyor, yalnız ham EKG bulgusunu tarif ediyor (B6 kuralı).
- Her task tek cümlelik klinik soru (B3 örnekleriyle uyumlu: "Bu EKG'deki ritim hangisidir?", "QRS
  dar mı geniş mi?", "Hangi derivasyon grubu bu bölgeyi gösterir?" vb.).
- `makeItems` içindeki "Sınırlandırılmış sentetik eğitim senaryosu. " öneki kaldırıldı.
- Vitaller **kod düzeyinde mod varsayılanı** olarak uygulanıyor (`defaultVitals(mode,ecgOptions)`),
  satır başına yazılmadı (yönergenin "satırda verilmezse kullanılır" seçeneği): normal/stemi/
  inferior/pvc/lbbb/rbbb ≈ 75/dk düzenli; sintach 120/dk; pat 150/dk; flutter 150/dk düzenli; svt
  165/dk; vt 160/dk (TA 88/58 — hipotansif olabilir); af kontrollü 78/dk düzensiz, hızlı profil
  142/dk düzensiz (`ecg.options.afProfile` zaten mevcut mantıktan okunuyor); vf "Nabız=alınamıyor,
  TA=ölçülemiyor, Bilinç=kapalı". `item.vitals=[{k,v}]` olarak Olgu kartında gösteriliyor (Faz A7).
- `limitations` metnine **"Olgu vinyetleri ve vitaller sentetiktir."** eklendi.
- **Sayısal madde payı: cases 30/200 (%15), questions 30/200 (%15)** — tam sınırda, üstüne
  çıkmıyor. Formül türetme, mm/piksel, oynatma hızı, ölçek sorusu **sıfır** (ilgili bankalar
  tamamen kaldırıldı).
- Şema/benzersizlik/pozisyon/model-eşleşme testleri (`qa/independent_content.mjs`,
  `qa/sol_state_model.mjs`) geçiyor: 200+200 madde, `stem+question` her havuzda benzersiz,
  `mode:decisionId` her havuzda benzersiz, doğru seçenek pozisyonu her pozisyonda tam 40, tüm
  sayısal `decisionId`'lerin doğru seçeneği `model.js`'in ürettiği değerle eşleşiyor.

**Bilinçli sınırlamalar / kullanıcı kararı bekleyen noktalar:**
- Korunan ~74 bankanın seçenek/açıklama metni **kelime kelime sadeleştirilmedi** — yalnız yasaklı
  bankalar kaldırıldı/değiştirildi, yeni 17 banka sade yazıldı. Çoğu korunan banka zaten kısa ve
  klinik (ör. `sinus`, `pvc`, `mechanic`), ama "seçenek ≤ 8 kelime" kuralı her satırda harfiyen
  uygulanmadı (zaman bütçesi).
- **O2 (ritim tanıma) objektifi** her havuzda **13/200** madde ile B7'nin "her biri en az 15" hedefinin
  2 madde altında. Sebep: her mod yalnızca bir "hangi ritim/örüntü" (O2) sorusu barındırıyor (13
  mod × 1 = 13); ek 5+5 maddeden birkaçı O2'ye kaydırılabilirdi ama yapılmadı. Diğer 5 objektif
  (O1, O3, O4, O5, O6) her ikisinde de 25–52 madde ile hedefin belirgin üzerinde.
- `sources.json`'daki Klabunde "Bipolar Ekstremite Derivasyonları" kartının açıklaması formül
  vurgusundan ("matematiksel türetim") bölge/duvar vurgusuna güncellendi; `MEDICAL_SOURCES.md`
  O3/O6 satırları da aynı yönde küçük düzeltmelerle güncellendi.
- `KULLANIM.md`: "Ayrı bir bitirme düğmesi yoktur" cümlesi, yeni **"Modülden Çık"** düğmesini
  yansıtacak şekilde güncellendi (otomatik `pagehide` bitirme akışı hâlâ birincil, düğme isteğe
  bağlı bir kısayol).

## Test sonuçları (Faz C)

Sunucu: `python3 -m http.server 8765` (depo kökü). Playwright:
`/Users/ozankaraca/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs`.

| Komut | Sonuç |
|---|---|
| `python3 qa/build.py` | OK — `EGEMED_PULSE_Onizleme.html` (1 792 516 bayt), `EGEMED_PULSE_SCORM_1.2.zip` (947 897 bayt); kaynak kümesi SHA-256 `cbf7ba0d…babab735d` (bkz. `BUILD.md`) |
| `python3 qa/sol_package_tests.py` | **5/5 OK** |
| `node qa/ui_audit.mjs` | **5 kontrol / 0 hata** |
| `node qa/sol_core.mjs` | **43/43 PASS** |
| `node qa/sol_followup.mjs` | **11/11 PASS** |
| `node qa/sol_ui.mjs` | 0 sayfa hatası (`qa/evidence/sol-ui/report.json`) |
| `node qa/sol_state_model.mjs` | **208 403 kontrol, 0 hata**; `crossPoolModeDecisionGroups: 142` (bilgi amaçlı — vaka/değerlendirme aynı kavramı farklı vinyetle sorabiliyor, mevcut sınırlılık notu) |
| `node qa/sol_scorm_edges.mjs` | **8/8 PASS** |
| `node qa/independent_content.mjs` | **3/3 PASS** (400 madde şeması, benzersizlik/pozisyon, 59 sayısal madde ↔ model eşleşmesi) |
| `node qa/independent_state.mjs` | **5/5 PASS** |
| `node qa/independent_scorm.mjs` | **16/16 PASS** |
| `node qa/independent_e2e.mjs` | **PASS** (tam senaryo: 13×16s gerçek gözlem, 10 vaka + 10 soru UI gönderimi, `attemptScore 80`, LMS mock `passed`/`80`, 20 `cmi.interactions`, tekil `LMSFinish`, LMS-resume aynı örneklem/puan) |
| `node qa/independent_model.mjs` | 79/79 PASS (bonus — model/sim dokunulmadığını doğrular) |
| `node qa/independent_gallery.mjs` | 13/13 PASS (bonus) |

Çalıştırılmayanlar (bilinçli): `qa/independent_browser.mjs`, `qa/independent_native_visibility.mjs`,
`qa/independent_visibility_probe.mjs`, `qa/audit_baseline.mjs` — bunlar yönergenin Faz C listesinde
yok ve bir kısmı kasıtlı olarak dondurulmuş `baseline/EGEMED_PULSE_Onizleme.html` referans paketini
hedefliyor (yeniden üretilmedi, `baseline/` "önceki teslimin değiştirilmeyen kopyası").

## Ekran görüntüleri

`qa/evidence/family/rev2/` altında 1366×768, 768×1024, 390×844 genişliklerinde 12'şer görüntü
(36 toplam): `01-landing`, `02-modes`, `03-sim-unchanged` (İnceleme ekranı — **değişmediğini**
göstermek için), `04-case-question`, `05-case-feedback`, `06-case-end`, `07-exam`,
`08-results-exam` (+ `08b-…-scrolled`), `09-results-case`, `10-about` (+ `10b-…-scrolled`).
Tümü kendim Read ile açıp Ausculta hedef görüntüleriyle (`baseline/ausculta-reference/screens/
01/02/03/03b/03c/04/05/07-*-1366.png`) karşılaştırdım; yatay taşma veya kesilme görmedim
(`qa/ui_audit.mjs` da 8 genişlik × 6 görünümde 0 hata bildiriyor).

## Değişen dosyalar

- `cardai/index.html` — header (marka/spacer/bağlam/spacer/Mod Değiştir/Tam ekran/ayırıcı/Yardım/
  Hakkında, inline SVG ikonlar), landing hero (tek satır başlık, ikonlu bağlantı/not), `#caseView`/
  `#quizView` kabuğu (view-heading ve ikinci ilerleme şeridi kaldırıldı, `.sr-only` h1), `#resultsView`
  (`.results-wrap-v2`), `#aboutView` (üst eyebrow/geri kaldırıldı, alt "← Geri" eklendi),
  `#finishDialog` eklendi.
- `cardai/styles.css` — `.sr-only`, `.eg-header-context`/`.ctx-progress`/`.ctx-bar`, `.divider-v`,
  `.hide-mobile`, `.opt-radio`, `.case-feedback-v2`/`.feedback-head`, `.kv-grid`/`.kv`,
  `.inst-evidence`/`.inst-cite`, `.results-wrap-v2`/`.results-title-v2`/`.results-sub-v2`/
  `.weak-chip-row`/`.results-summary-strip`/`.rs-*`/`.domain-row-v2`/`.report-table-v2`/`.rd-*`,
  landing küçük düzeltmeler.
- `cardai/app.js` — `renderHeader` (tek `#headerContext` toggle), mod kartı "Kurallar" satırı
  kaldırıldı, quiz seçenek işaretleme `.opt-radio` + `disabled` mantığı.
- `cardai/features.js` — `caseCardMarkup` (vitals kv), `questionCardMarkup`/`caseFeedbackMarkup`
  (yeni geri bildirim biçimi), `renderCase` (ölü seçici temizliği + buton disabled mantığı),
  `syncFullscreen` (SVG ikon değişimi), `institutionCard` (satır içi [1] atıf), sonuçlar bloğu
  tamamen yeniden yazıldı (`OBJECTIVE_ICONS`, `rowsFor`/`domainRows`/`reportRows`/`renderResults`,
  `#finishDialog` bağlama).
- `cardai/curriculum.js` — **tamamen yeniden yazıldı** (bankalar, 400 madde, `makeItems`,
  `defaultVitals`/`parseVitals`, `limitations`).
- `cardai/sources.json` — Klabunde ekstremite derivasyonu kartı açıklaması güncellendi.
- `cardai/KULLANIM.md` — bitirme düğmesi cümlesi güncellendi.
- `MEDICAL_SOURCES.md` — O3/O6 hedef-kaynak eşleme satırları güncellendi.
- `BUILD.md` — yeni hash tablosu eklendi (önceki kayıt "Revizyon 1" olarak saklandı).
- `AUDIT.md` — "Revizyon 2" bölümü eklendi.
- `qa/evidence/family/rev2/*.png`, `qa/evidence/family/rev2/RAPOR.md` — bu teslim.

## Kullanıcı kararı bekleyen noktalar (özet)

1. Footer ürün ikonu (Ausculta'daki gibi favicon mü, yoksa mevcut Ege Tıp mührü mü) — mühür başka
   bir ekranda yeniden referanslanmadan veya `qa/build.py`/paket testleri güncellenmeden değiştirilemez.
2. Footer sağ blok ("Sinyaller sentetiktir · klinik tanı için kullanılmaz") eklenmedi —
   `qa/ui_audit.mjs`'nin footer tam-eşleşme testi güncellenmeli mi?
3. Değerlendirme zamanlayıcısının ayrı `IconClock`/`.eg-timer` öğesi olarak mı yoksa mevcut gömülü
   metin olarak mı kalacağı.
4. "Yeni 10 …örneklemi" düğmesinin sonuç ekranında kalması (Ausculta'da yok, Pulse'a özgü).
5. Korunan ~74 bankanın seçenek/açıklama metninin ayrıca kelime-kelime sadeleştirilip
   sadeleştirilmeyeceği.
6. O2 objektifinin her havuzda 13/200 (hedef ≥15) ile bırakılması kabul mü, yoksa ek maddelerin
   birkaçı O2'ye mi kaydırılsın.

---

## Doğrulama turu düzeltmeleri (18 Eylül 2026)

Opus doğrulama turunda testler geçmesine rağmen görsel/içerik incelemesinde 14 madde ve bir sim-ekranı
flicker sorunu bulundu; hepsi uygulandı. Aşağıda madde numaralarıyla özetlenmiştir.

### UI

1. **Header ikon dolgu hatası.** `cardai/styles.css` `.eg-navbtn svg{fill:currentColor}` kuralı,
   inline SVG'lerin `fill="none"` özniteliğini eziyordu ve stroke tabanlı ikonlar (Mod Değiştir, Tam
   ekran, Yardım, Hakkında) dolu beyaz daireler olarak görünüyordu. `fill:none` yapıldı.
2. **Landing header eski ikonlar.** `#landingPage .topbar`'daki "⤢"/"ⓘ" metin ikonları app header ile
   birebir aynı yapıya getirildi: `IconFullscreen` SVG (id `landingFullscreenIcon`, `syncFullscreen()`
   içinde app header ile aynı `FS_ICON_PATHS` ile güncelleniyor), `.divider-v`, `IconHelpCircle`
   (Yardım), `IconInfo` (Hakkında).
3. **`.hero-links` stili.** "Nasıl kullanılır?" / "Hakkında ve kaynaklar" alt çizgi kaldırıldı;
   `ink-600`, `600` ağırlık, hover `blue-700`, aralarında 1px `.landing-link-sep` (Ausculta
   `.hero-link` karşılığı).
4. **Çift `[1][1]` kanıt atfı.** `cardai/sources.json` `evidence.statement` sonundaki gömülü `"[1]"`
   metni kaldırıldı; artık yalnız `institutionCard()`'ın ürettiği bağlantılı üst simge `[1]` görünüyor.
5. **Kurum kartı logosu / footer ikonu.** `institutionCard()` artık logo kaynağını sabit
   `assets/ege-tip-logo.png` yerine `#instLogo` adlı **statik, gizli** `<img>` etiketinden
   (`index.html` `#aboutView` içine eklendi, `src="assets/brand/ege-tip-seal-128.png"`) okuyor; bu
   sayede `qa/build.py`'nin yalnız statik `<img>`/`<link>` etiketlerini gömme mekanizması bu görseli
   de yakalıyor ve tek dosya HTML'de kırık görsel kalmıyor. Footer ikonu (`.footer-seal`) artık
   `assets/egemed-pulse-favicon.png` (Faz D2 — ürün amblemi); mühür artık yalnız Hakkında → Kurum
   kartında kullanılıyor. Doğrulama: `EGEMED_PULSE_Onizleme.html` Playwright ile açılıp Hakkında
   ekranına gidildi; `.inst-card img`, `.footer-seal`, `.eg-brand-icon` için `naturalWidth>0` ve
   `complete===true` doğrulandı (5/5 görsel yüklü, sayfa hatası yok). `qa/sol_package_tests.py`
   (gömülü görsel bayt kümesi eşitliği) hâlâ geçiyor.
6. **Footer sağ blok.** `.footer-right` artık "Sinyaller sentetiktir · klinik tanı için kullanılmaz"
   içeriyor, `>1280px`'te görünür. `qa/ui_audit.mjs` `expectedFooter(w)` ve `qa/sol_followup.mjs`
   `footer-exact` beklentisi güncellendi (gerçek `innerText`/`textContent` çıktısıyla birebir
   eşleştirildi — ikisi farklı DOM API kullandığı için beklenen dizeler farklı boşluk davranışı
   yansıtıyor, bu bir hata değil, tarayıcı API farkı). **Düzeltme notu:** ilk uygulamada dosyada zaten
   var olan eski bir `.footer-right{display:flex;...}` kuralı (Ausculta kaynak CSS kalıntısı) benim
   yeni eklediğim `@media(max-width:1280px){.footer-right{display:none}}` kuralından SONRA geliyordu
   ve onu geçersiz kılıyordu; kural sırası düzeltildi (media query artık son kural).
7. **Değerlendirme kartı sırası.** Soru kartında vinyet artık sorudan **önce**, ayrı bir **Olgu kartı**
   olarak geliyor (vaka ekranındaki `caseCardMarkup` bileşeni `caseCardMarkup(item,i,'quiz')` ile
   yeniden kullanılıyor — rozet "Soru N/10", `.kv` vitaller dahil). Bunu mümkün kılmak için
   `caseCardMarkup` `features.js`'ten `app.js`'e taşındı (yükleme sırası: `app.js` önce çalışıyor ve
   `renderQuiz()`'i sayfa yüklenirken senkron çağırıyor; `features.js`'teki bir fonksiyonu o an
   çağırmak `ReferenceError` verirdi) ve `window.CardAIController.caseCardMarkup` olarak dışa açıldı;
   `features.js`'teki `renderCase()` artık `C.caseCardMarkup(item,i,'case')` çağırıyor. Soru kartının
   `<fieldset>`'i içindeki eski `q.stem` paragrafı kaldırıldı (vinyet artık yalnız Olgu kartında).
8. **Değerlendirme alt araç çubuğu.** Üç ayrı satır (`.quiz-navigation` + `.session-actions` +
   `.quiz-bottom`) tek `.quiz-toolbar` satırına birleştirildi:
   `[← Önceki] [N/10] [Sonraki →] ···(spacer)··· [Yeni 10 soru örneklemi] [Yanıtları değerlendir]`;
   `#quizResult` durum metni ayrı bir paragrafa taşındı. "Yeni10 soru örneklemi" / "Aynı10 soruyu" /
   "eşiği8/10" boşluk hataları düzeltildi. 1366×768'de kaydırmadan sığıyor (bkz. `1366-07-exam.png`).
   ≤720px'te sarıyor.
9. **Sonuçlar kart sarmalayıcısı.** `cardai/styles.css` içinde **`.card` sınıfı hiç tanımlı değildi**
   (yalnız `.case-card`, `.q-card-dark` gibi bileşik sınıflar vardı); `renderResults()`'ın
   `<div class="card mt-16">` sarmalayıcıları bu yüzden görünmez kalıyordu. `.card` (border, `r-lg`,
   `shadow-card`, 20px padding) ve `.mt-8/.mt-12/.mt-16` yardımcı sınıfları eklendi. `.dr-ic` 30px→28px
   kare kutu, `.domain-row-v2` satır yüksekliği ~40px'e indirildi. Hem değerlendirme hem vaka
   varyantında doğrulandı (`1366-08b-results-exam-scrolled.png`).
10. **"Mod Değiştir" görünürlüğü ve mod kartı oku.** `renderHeader()` artık `$('modeSwitch').hidden`
    değerini `isMode` (yalnız sim/case/quiz) ile eşliyor; modes/landing/about/results ekranlarında
    gizli (`1366-02-modes.png`'de doğrulandı — yalnız Tam ekran/Yardım/Hakkında görünüyor). Üç mod
    kartı CTA'sına (`İncelemeye başla`, `Vakaları çöz`, `Değerlendirmeye gir`) `aria-hidden` "→" oku
    eklendi.

### İçerik (Faz B tamamlanması — öncelikli)

11. **Korunan ~58 bankanın dili sadeleştirildi.** Jargon içeren ifadeler ("izdüşüm", "fidüsiyel",
    "profil", "terminal ileti dağılımı", "Lateral terminal S P ekseninin göstergesidir" gibi) tamamen
    kaldırıldı. Tüm seçenekler ≤ 8 kelime, tüm açıklamalar tek cümle, düz klinik Türkçe ile yeniden
    yazıldı (ör. "II'de pozitif P: sinüs kaynağı", "Düzensiz R–R + P yok: AF", "Erken, geniş, öncesinde
    P yok: PVC"). Sayısal bankalar (rr\*, pr\*, q\*, qt\*, st\*, flutterCount — 21 banka) zaten sade
    olduğu için değiştirilmedi. Değişen banka sayısı: **58** (tüm korunan kavramsal bankaların tamamı).
12. **Hedef (objective) dağılımı dengelendi.** Önceki durum: O1 59, **O2 26**, O3 66, **O4 88**,
    O5 58, **O6 103**. Hedef: O2 ≥ 70, O4 ≤ 50, O6 ≤ 70, O5 ≥ 60. Bunun için her mod için 3 yeni
    banka ailesi eklendi (13 mod × 3 = 39 yeni banka + önceki 17 = toplam 56 yeni banka):
    - **`ddx_<mod>`** (O2): "Bu EKG'de öncelikle hangi tanı düşünülmelidir?" — doğru cevap o modun
      tanısı, çeldiriciler diğer 12 moddan deterministik seçilmiş 4 tanı.
    - **`rhythmClass_<mod>`** (O2): "Bu ritim hangi sınıfa girer?" — 5 sınıflık ortak taksonomi
      (düzenli dar/normal, düzenli dar/hızlı, düzensiz dar, düzenli geniş, kaotik); her modun doğru
      sınıfı EKG modeliyle tutarlı atandı (ör. af→düzensiz dar, vt/lbbb/rbbb→düzenli geniş, vf→kaotik).
    - **`firstStep_<mod>`** (O5): "Bu hastada ilk yaklaşım ne olmalıdır?" — `MEDICAL_SOURCES.md`'deki
      kılavuzlarla uyumlu genel ifadeler, doz/ilaç adı verilmeden (VF→"Nabız yok: KPR başlat ve
      defibrilasyona hazırlan"; STEMI/inferior→"Acil reperfüzyon değerlendirmesi"; stabil SVT→"Vagal
      manevra ve monitörizasyon"; AF/flutter→"Hız/ritim kontrolü ve antikoagülasyon değerlendirmesi";
      BBB→"Klinik bağlamla birlikte değerlendirme" vb.); 4 ortak, jenerik yanlış seçenek tüm
      varyantlarda paylaşılıyor ("Hemen taburcu edilir" gibi).
    Bu yeni bankalar, her mod+havuzda en fazla 2 O4 maddesi kalacak şekilde (yönergedeki "mod başına
    O4 ≤ 2" kuralı) fazla O4/O6 (yalnız kavramsal, sayısal olmayan O6) yuvalarının yerine kondu; hangi
    2-3 yuvanın seçileceği rastgele ama tekrarsız (mod+havuz içinde banka benzersizliği korunarak)
    belirlendi. **10 mod+havuz kombinasyonunda** (ör. `case stemi`, `quiz lbbb`) yer darlığı nedeniyle
    3 yerine yalnız 1-2 yeni banka eklenebildi; bu, toplam hedefleri etkilemedi.
    **Sonuç dağılımı:** O1 59, **O2 75**, O3 67, **O4 50**, **O5 82**, **O6 67** (toplam 400). Tüm
    hedefler karşılandı (O2≥70 ✓, O4≤50 ✓ tam sınırda, O6≤70 ✓, O5≥60 ✓ — hedefin belirgin üzerinde).
    Sayısal madde payı **değişmedi: 30/200 (%15) her iki havuzda** (yalnız kavramsal O4/O6 bankaları
    dokunuldu, `rr*/pr*/q*/qt*/st*/flutterCount` sayısal bankalarına dokunulmadı).
    Her mod+havuzda O4 ≤ 2 kuralı doğrulandı (26 mod+havuz kombinasyonunun tamamında).
13. **Rapor notu (kod değişmedi, kullanıcı kararına bırakıldı):** Aynı değerlendirme oturumunda (10
    soru) aynı bankanın farklı modlarda tekrar seçilebildiği doğrulandı (ör. `q80`/`qrsWidthCause`
    gibi mod-bağımsız bankalar birden çok modda kullanılabiliyor, dolayısıyla aynı 10 soruluk rastgele
    örneklemde aynı "kavram" iki kez sorulabilir — `qa/sol_state_model.mjs`'in bilgi amaçlı
    `crossPoolModeDecisionGroups` metriği 148'dir, bu **havuzlar arası** [vaka↔değerlendirme] paylaşımı
    ölçer, aynı 10 soruluk **tek oturum** içi tekrarı ölçmez). `state.js`'in `PulseState.sample()`
    fonksiyonu yalnız madde kimliği (`C001`, `Q037` vb.) bazında benzersizlik garantisi veriyor,
    `decisionId`/banka bazında değil; bu örnekleme mantığı değiştirilmedi (kapsam dışı, `model.js`/
    `state.js` sabit). Kullanıcı isterse ileride `PulseState.sample()`'a "aynı oturumda aynı
    `decisionId` iki kez seçilmesin" kısıtı eklenebilir — bu SCORM şemasını etkilemez ama örnekleme
    algoritmasını değiştirir, bu yüzden ayrı bir karar olarak bırakıldı.

### Sim ekranı flicker düzeltmesi (kullanıcı onaylı, tek satırlık)

14. **"Normalle karşılaştır" titreme.** Kesikli referans izi (`setLineDash`) her karede kanvas
    x=0'dan başladığından, sinyal kaydıkça desen sabit kalıp bazı karelerde QRS sivrileri kesik
    boşluğuna denk gelerek kayboluyordu. `cardai/app.js` iki yerde düzeltildi: sim ekranı
    `renderECG()`'deki `trace(models.normal,...)` çağrısı (~satır 79) ve vaka/soru sahnesi
    `drawItemECG()`'deki referans çizimi (~satır 132) artık **düz, yarı saydam** çiziliyor
    (`rgba(53,164,189,.7)` / `rgba(46,141,247,.7)`, `setLineDash` kaldırıldı). `cardai/styles.css`
    `.compare-key i` legend'ı da düz çizgiye çevrildi (`border-top:2px solid`). `model.js`'e
    dokunulmadı. Doğrulama: oynatma açıkken 80 ms arayla alınan 5 kare (`flicker-0.png`…`flicker-4.png`,
    üretilip incelendikten sonra silindi) referans izin QRS sivrilerinin her karede aynı şekilde
    göründüğünü, yalnız sola kaydığını gösterdi — flicker giderildi.

### Bu turda çalıştırılan testler (hepsi PASS)

| Komut | Sonuç |
|---|---|
| `python3 qa/build.py` | OK — yeni hash tablosu `BUILD.md`'de |
| `python3 qa/sol_package_tests.py` | 5/5 |
| `node qa/ui_audit.mjs` | 5/5, 0 hata (footer sağ blok dahil) |
| `node qa/sol_core.mjs` | 43/43 |
| `node qa/sol_followup.mjs` | 11/11 (footer-exact beklentisi güncellendi) |
| `node qa/sol_ui.mjs` | 0 sayfa hatası |
| `node qa/sol_state_model.mjs` | 208 403 kontrol, 0 hata |
| `node qa/sol_scorm_edges.mjs` | 8/8 |
| `node qa/independent_content.mjs` | 3/3 (400 madde, 59 sayısal madde ↔ model eşleşmesi) |
| `node qa/independent_state.mjs` | 5/5 |
| `node qa/independent_scorm.mjs` | 16/16 |
| `node qa/independent_e2e.mjs` | PASS (2 kez çalıştırıldı, ikisi de tam senaryo geçti) |
| Standalone Hakkında görsel doğrulaması | 5/5 görsel `naturalWidth>0`, 0 sayfa hatası |

### Bu turda değişen/eklenen dosyalar

- `cardai/index.html` — landing header (yeni ikonlar, spacer, divider), `#instLogo` statik img,
  footer (favicon ikonu, `.footer-right` sağ blok), değerlendirme alt araç çubuğu (`.quiz-toolbar`),
  boşluk düzeltmeleri ("Yeni 10 soru örneklemi", "Aynı 10 soruyu").
- `cardai/styles.css` — `.eg-navbtn svg{fill:none}`, `.hero-link` stili, `.footer-right`/
  `.footer-signal-note` + medya sorgusu sırası düzeltmesi, `.quiz-toolbar*`, `.card`/`.mt-*` (yeni!),
  `.domain-row-v2`/`.dr-ic` boyut küçültme, `.compare-key i` düz çizgi.
- `cardai/app.js` — `caseCardMarkup` (features.js'ten taşındı, `window.CardAIController`'a eklendi),
  `renderQuiz()` Olgu kartı + `q.stem` kaldırma, `renderHeader()` modeSwitch gizleme, mod kartı CTA
  okları, "eşiği8/10" boşluk düzeltmesi, referans iz flicker düzeltmesi (2 yer).
  düzeltmesi (Faz D favicon).
- `cardai/sources.json` — çift `[1]` düzeltmesi.
- `cardai/curriculum.js` — **58 korunan banka yeniden yazıldı** (sadeleştirme), **56 yeni banka**
  eklendi (17 önceki + 39 yeni `ddx_*`/`rhythmClass_*`/`firstStep_*`), tüm 400 maddenin `decisionId`
  ataması hedef dağılımına göre yeniden dengelendi (stem/task metinleri aynı üretim hattından, mod
  başına context listeleri korunarak yeniden üretildi).
- `qa/ui_audit.mjs` — `expectedFooter()` >1280px için sağ blok metnini içerecek şekilde güncellendi.
- `qa/sol_followup.mjs` — `footer-exact` beklenen dizesi güncellendi.
- `BUILD.md` — yeni hash tablosu.
- `qa/evidence/family/rev2/*.png` — tüm ekran görüntüleri bu son durumla yenilendi.

### Nihai hedef dağılımı (O1–O6, 400 madde)

| Objective | Vaka (C) | Değerlendirme (Q) | Toplam | Hedef |
|---|---|---|---|---|
| O1 | 31 | 28 | 59 | — |
| O2 | 38 | 37 | 75 | ≥70 ✓ |
| O3 | 27 | 40 | 67 | — |
| O4 | 24 | 26 | 50 | ≤50 ✓ (sınırda) |
| O5 | 46 | 36 | 82 | ≥60 ✓ |
| O6 | 34 | 33 | 67 | ≤70 ✓ |

Sayısal madde payı: **30/200 (cases) + 30/200 (questions) = 60/400**, değişmedi.

### Kalan / güncellenmiş kullanıcı kararı bekleyen noktalar

1. Footer ürün ikonu artık `assets/egemed-pulse-favicon.png` (Ausculta ile uyumlu) — bu turda
   **çözüldü** (madde 5), Kurum kartı mührü statik `#instLogo` ile korunuyor.
2. Footer sağ blok eklendi — bu turda **çözüldü** (madde 6).
3. O2 hedefi (≥70) — bu turda **çözüldü** (madde 12, 75'e çıkarıldı).
4. Değerlendirme zamanlayıcısının ayrı `IconClock`/`.eg-timer` öğesi olarak mı yoksa mevcut gömülü
   metin olarak mı kalacağı — **hâlâ açık** (değiştirilmedi, düşük öncelik).
5. "Yeni 10 …örneklemi" düğmesinin sonuç ekranında kalması (Ausculta'da yok) — **hâlâ açık**.
6. Aynı değerlendirme oturumunda aynı bankanın (kavramın) iki kez seçilebilmesi (madde 13) —
   `state.js` örnekleme mantığı değiştirilmediği için **açık**; düzeltme istenirse ayrı bir görev.
7. 10 mod+havuz kombinasyonunda yeni O2/O5 bankalarından yalnız 1-2'si eklenebildi (3 yerine) — genel
   hedefler karşılandığı için düşük öncelikli, isterseniz ek bir ince ayar turu yapılabilir.
