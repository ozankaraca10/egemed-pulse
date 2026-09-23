# EGEMED PULSE 6.0 — Derleme ve paket bütünlüğü

Yetkili runtime kaynakları `cardai/` klasöründedir. `baseline/` önceki teslimin değiştirilmeyen geri dönüş kopyasıdır. Denetim ve test kanıtları `qa/` içindedir; LMS paketine dahil edilmez.

## Yeniden üretme

Proje kökünde Python 3 standart kitaplığıyla:

```sh
python3 qa/build.py
python3 qa/sol_package_tests.py
```

İlk komut kökte `EGEMED_PULSE_Onizleme.html` ve `EGEMED_PULSE_SCORM_1.2.zip`, ayrıca `qa/sol_package_manifest.json` üretir. İkinci komut paketleme kontrollerini çalıştırır; JavaScript kaçış kontrolü için yerel Node gerekir. Üretim için Node veya paket kurulumu gerekmez. Başka hedef için `--output /tmp/pulse-build --report /tmp/pulse-build-report.json`; kaynak kopyası için `--source /path/to/cardai` kullanılabilir.

Kaynak envanteri 16 dosyadır: yedi runtime JS, `index.html`, `styles.css`, dört PNG (biri `assets/brand/` altında), `sources.json`, `KULLANIM.md` ve `imsmanifest.xml`. Paket kontrolü, gömülü HTML'de yalnız işaretleme düzeyindeki dış başvuruları arar; script gövdelerindeki şablon dizeleri dışlama dışıdır.

Kaynak değişiklikleri bitip sabitlendikten sonra üretin. Betik dosyaları okuyarak tek anlık içerik kümesi oluşturur ve yazmadan önce kaynakların değişmediğini kontrol eder; değişirse hata verir. ZIP kayıtları ad sırasındadır; tarihleri `2026-01-01 00:00:00`, Unix izinleri `0644`, sıkıştırması DEFLATE seviye 9'dur. Aynı kaynaklar ve Python/zlib sürümüyle çıktı baytları aynıdır; kaynak dosyası tarihi, çalıştırma saati ve hedef dizin çıktıyı etkilemez. Farklı zlib sürümleri sıkıştırılmış baytları değiştirebilir.

## Teslimin yapısı

Tek HTML, index'teki sırayla `model.js → scorm.js → curriculum.js → state.js → app.js → features.js → landing.js` dosyalarını ve CSS'yi gömer. Dört PNG base64 veri URI'lerine dönüştürülür (`assets/ege-tip-logo.png`, `assets/egemed-pulse-landing.png`, `assets/egemed-pulse-favicon.png`, `assets/brand/ege-tip-seal-128.png`). `sources.json` tek kaynak olarak `<script type="application/json" id="pulse-sources">` yer tutucusuna gömülür; devre dışıyken uygulama aynı dosyayı `fetch` ile okur. `assets/egemed-pulse-header.png` kaldırıldı; üst çubuk metin marka bloğu (favicon + EGEMED/Pulse™) kullanır. Script/style HTML kapanış dizileri kaçırılır; bütünlük JSON'u `application/json` türünde inert kayıttır. Runtime ağ bağımlılığı yoktur; tıbbi kaynak bağlantıları isteğe bağlı dış bağlantılardır.

SCORM ZIP'i tek SCO'dur. `imsmanifest.xml` köktedir; `ADL SCORM`/`1.2` metaverisi, ürün sürümü `6.0`, `webcontent`, `adlcp:scormtype="sco"`, bağıl `index.html` giriş noktası ve 80 başarı eşiği içerir. Arşivde manifest, index, CSS, yedi JS, dört PNG, Türkçe kullanım belgesi ve `build-integrity.json` bulunur. Derleme betiği, geliştirme dosyaları ve test kanıtları arşive alınmaz. `cardai/` içinden elle ZIP yapmak yerine betiği kullanın: bütünlük kaydı paketleme sırasında üretilir.

ZIP içindeki `build-integrity.json` ve HTML içindeki `pulse-build-integrity` JSON'u; sürümü, bütün 15 kaynak dosyasının SHA-256 değerini/boyutunu ve kaynak kümesi özetini taşır. Bütünlük kaydı kendi hash'ini içermez. `qa/sol_package_manifest.json` bunlara ek olarak iki teslimin SHA-256 değerlerini/boyutlarını, ZIP girişlerini ve gömülü script sırasını verir. Kaynak kümesi özeti, ad sıralı kaynak envanterinin UTF-8 JSON baytlarından türetilir. Hash'ler kazara değişikliği saptar; dijital imza veya istemci sınav güvenliği sağlamaz.

## Paketleme düzeltmeleri ve kabul kanıtı

- **PULSE-019:** Eski ortamda bulunmayan `qa/build.py` kaynak depoya eklendi. Tek kaynak kümesinden HTML ve ZIP üretilir; bütünlük envanteri içerik eşitliğini izlenebilir kılar.
- **PULSE-017 ile ilgili teslim desteği:** Manifest ve kullanım belgesi 6.0/200+200/10+10 akışına güncellendi. Paket kaynaklarla aynı offline varlıkları taşır. Yazılım/klinik/LMS doğrulama sınırları açıkça belirtilir; arayüz düzeltmelerinin sahibi ürün kodudur.
- Paket testleri: tekrarlı üretimde byte eşitliği; kaynak izin/tarihinden ve gelişigüzel geliştirme dosyalarından bağımsızlık; ZIP CRC ve ad/sabit tarih sırası; manifest ile ZIP payload eşitliği; bütün kaynak hash'leri; yedi gömülü scriptin/CSS'nin kaynakla eşitliği; bütün görsellerin gömülmesi.
- Olumsuz testler: eksik `state.js`, manifestte eksik/fazla yol ve `../` yolu üretimden önce reddedilir. Karışık büyük/küçük harfli `</script>` ve `</style>` eklenmiş fikstür, HTML'yi bölemez; JavaScript sözdizimi ve çalıştırılmış string değeri korunur.

Bu kontroller bir XML XSD uygunluk sertifikası veya gerçek LMS testi değildir. Kaynak kodun gerçek tarayıcı/API taklidi testleri `qa/evidence/final/` içinde ayrı raporlanır. Bağımsız klinisyen veya psikometrik validasyon yapılmamıştır.


## Son teslim kaydı (Altıncı tur — filigran kaldırma, depo düzeni, 23 Eylül 2026)

Landing arka planındaki büyük Ege Tıp filigranı (`.landing-seal`) kaldırıldı ve kart zemini filigran öncesi sade hâline döndü; kartın üstündeki kurum satırı (`.landing-inst` + `.landing-inst-text`) korundu. Depo düzenlendi: marka dosyaları `brand/` altına, eski yönergeler `docs/gecmis/`, QC belgeleri `docs/qc/` altına taşındı; `.gitignore` eklendi; kapsamlı `README.md` yazıldı.

Kaynak kümesi SHA-256: `6272241c3f0dfb5496c0bc0f75ae869339c626160ce40bb56fd5b2a8b335b6ee`

| Çıktı | Boyut | SHA-256 |
|---|---|---|
| `EGEMED_PULSE_Onizleme.html` | 1743429 | `63baddcd2fc9286414cd9d87ac3be10d0b66e30ca54c3a4865874af5c62d9c0f` |
| `EGEMED_PULSE_SCORM_1.2.zip` | 805713 | `ccd3f145f6ed8f497929e0afa98d3e68f9f6bc8ad821288078d8cdc0c0186aad` |

## Teslim kaydı (Beşinci tur — landing yeniden düzenleme, validasyon ifadeleri, monitör sesi, tam ekran etiketi, 21 Eylül 2026)

Landing yeniden düzenlendi: `assets/egemed-pulse-landing.png` yatay büyük logoya (`pulse-horizontal-full-1536x512.png`) değiştirildi, `.landing-logo` büyütüldü (min(640px,86vw)/max-height 210px, alt kırılımlarda 480/380 px). Ege Tıp Fakültesi amblemi kartın arkasına ortalı, büyük ve renkli filigran olarak taşındı (`.landing-seal`: ortalı, opacity .14, filter yok, max-width 720px) ve kartın en üstüne ayrı bir kurum satırı eklendi (`.landing-inst` + `.landing-inst-text`, 1024 altı 72px). Kart okunabilirliği için `.landing-card` yarı saydam beyaz zemin ve hafif blur aldı. "Bağımsız klinisyen doğrulaması yok" tarzı ifadeler kaldırıldı; yerine tek resmi cümle ("Simülatörün tüm tıbbi içerik ve sinyal validasyonları Ege Üniversitesi Tıp Fakültesi Kardiyoloji Anabilim Dalı öğretim üyelerince yapılmıştır.") ve kısa biçimi (`landing.js` why-card) kondu — `landing.js`, `curriculum.js` limitations, `index.html` infoDialog, `KULLANIM.md` (satır 3/42/67), `features.js` limitationsBox/başlık ve `sources.json` module.description güncellendi. Landing arka planında WebAudio ile sentetik EKG monitör "bip"i eklendi (880 Hz sine, 60 ms, 800 ms atım aralığı, look-ahead zamanlama, sekme gizlenince durur, kullanıcı jestiyle otomatik oynatma kilidini açar); üst çubukta `#landingSound` aç/kapa düğmesi ve `localStorage pulse.landingSound` kalıcılığı var; tanılama için `CardAILanding.soundState()` eklendi. `#fullscreenBtn` ve `#landingFullscreen` düğmelerine "Tam ekran"/"Tam ekrandan çık" metin etiketi eklendi; 1024–1366 px arası üst çubukta taşma gözlenmedi (eşik değiştirilmedi).

Ayrıca: mod seçim kartları yalnız içerik değişince yeniden çizilir ve tek delege tıklama dinleyicisi kullanır (250 ms'lik ilerleme döngüsü tıklamaları yutuyordu); Hakkında kutusunda validasyon cümlesi tekilleştirildi.

Kaynak kümesi SHA-256: `77ec3597670f4e08b50cd55ffb987496195f3905fc34e3913b72ce4c32252b67`

| Çıktı | Boyut | SHA-256 |
|---|---|---|
| `EGEMED_PULSE_Onizleme.html` | 2188407 | `0f27c8f2caf4d23d30012581f0363dd2ee216e25134d307d532a7a50fc615f24` |
| `EGEMED_PULSE_SCORM_1.2.zip` | 805793 | `ea259f2d9096f220926154a410f38fb49fadd72e41a27913eba7fdc34fc6b8de` |

Tam kaynak envanteri `qa/sol_package_manifest.json` içindedir.

### Önceki kayıt (Dördüncü tur — kardiyoloji QC düzeltmeleri, 21 Eylül 2026)

Kardiyoloji QC raporundaki (`EGEMED_PULSE_Kardiyoloji_QC_Raporu.docx`, 55 madde) düzeltmeler `cardai/curriculum.js`'e işlendi: 13 yeni bağlama özel seçenek bankası (VF arrest, instabil VT, stabil AF/SVT/AT, sinüs taşikardisi, tesadüfi dal bloğu, AF/VT'de P seçilemez, SVT'de gizli P, VF'de P yok), 6 bank yeniden yazımı (PVC sınıflaması, VT ilk yaklaşım, AF/flutter ilk yaklaşım, iskemi sınırı, AF–PVC ayrımı, PVC açıklaması), 35 madde satırı, derivasyon setleri (anterior V2–V3–V4, inferior II–III–aVF, LBBB I–V1–V6), PVC görsel çeşitliliği (7 farklı pencere) ve VT/VF'de akut yönetim dışı 24 maddeye retrospektif eğitim notu. Kayıt imzası `cv` artık `PulseCurriculum.version` (8); eski oturumlar yenilenir. Hakkında: "Öğretim Tasarımı ve Tıbbi Danışmanlık", yeni "Tıbbi İçerik Validasyonu" grubu (4 yer tutucu).

Kaynak kümesi SHA-256: `6f7064544da991a4d5df6d644cb70725764978e460649566b54c4ffb28b6b555`

| Çıktı | Boyut | SHA-256 |
|---|---|---|
| `EGEMED_PULSE_Onizleme.html` | 1936808 | `0a78015e3345e2792125216afd84a8c6c27efbb5310be3a017d603a90a27074d` |
| `EGEMED_PULSE_SCORM_1.2.zip` | 950290 | `9e18f843d6db270da60ff0eda9228df4762f5ff3955ee046f54839df39b282db` |

Tam kaynak envanteri `qa/sol_package_manifest.json` içindedir.

### Önceki kayıt (Üçüncü tur — vaka/soru EKG yakınlaştırma, beyaz üst çubuk logosu, üst çubuk sloganı, "EKG Sonucu" terimi, açılışta tam ekran önerisi, 21 Eylül 2026)

Kaynak kümesi SHA-256: `0c9505d217a8a27b022dc4c32d3bfa5c9247d1ef24dc28dd14e99568c06d901a`

| Çıktı | Boyut | SHA-256 |
|---|---|---|
| `EGEMED_PULSE_Onizleme.html` | 1926217 | `17d9fd74715187f7b587c9dc825b89a2152e7b19766a0fe82559f3fb7f08a1e7` |
| `EGEMED_PULSE_SCORM_1.2.zip` | 946496 | `9b9a5b8780173fbfddfdb417a1880cbfa794bb230a23adc0370a43904cb3f455` |

Tam kaynak envanteri `qa/sol_package_manifest.json` içindedir. Kaynaklar sabitlendi; bu kayıt `cardai/` değişmedikçe geçerlidir.

### Önceki kayıt (İkinci tur EKG görselleştirme düzeltmeleri — 1,25× büyütme, karşılaştırma çizgisi kesikleştirme, vaka referansı taban hizalama, 8 madde Başvuru cümlesi düzeltmesi, 19 Eylül 2026)

Kaynak kümesi SHA-256: `a4322c52d856b53e6bba60e8a48faea5ec24bbac7518c47330ae748b7b52bc5b`

| Çıktı | Boyut | SHA-256 |
|---|---|---|
| `EGEMED_PULSE_Onizleme.html` | 1921834 | `4fd7a7ba9248c4fdf2444d0db0e791bb86bbeab87659214664633766071c8689` |
| `EGEMED_PULSE_SCORM_1.2.zip` | 945198 | `f7fd88c181f0979098884b56806ca5ab6f1182f40b3b325b6ea268bfec87c38a` |

Tam kaynak envanteri `qa/sol_package_manifest.json` içindedir. Kaynaklar sabitlendi; bu kayıt `cardai/` değişmedikçe geçerlidir.

### Önceki kayıt (Uygulama/değerlendirme modu düzeltmeleri — kilit kaldırma, seçenek karışımı, stem sızıntısı düzeltmesi, 18 Eylül 2026)

Kaynak kümesi SHA-256: `cb80c45321ce727af051b3b3e3572135538cf826ec781eed117e328334274ee5`

| Çıktı | Boyut | SHA-256 |
|---|---|---|
| `EGEMED_PULSE_Onizleme.html` | 1921592 | `430dbc0dd12a1340d4c89102c8ac8874493f1e6e941b80fca9b9dacaf9e43a4b` |
| `EGEMED_PULSE_SCORM_1.2.zip` | 945116 | `d833ccc3a563a496744d247e04f90cebf349cc2b9c0f4790295c66cd974ffc69` |

Tam kaynak envanteri `qa/sol_package_manifest.json` içindedir. Kaynaklar sabitlendi; bu kayıt `cardai/` değişmedikçe geçerlidir.

### Önceki kayıt (Revizyon 2 — Ausculta hizalama, doğrulama turu düzeltmeleri, 18 Eylül 2026)

Kaynak kümesi SHA-256: `d8c3bca475bb178b9d17d08dabd045b501ac612d2338fefe91ffe847151bb9ba`

| Çıktı | Boyut | SHA-256 |
|---|---|---|
| `EGEMED_PULSE_Onizleme.html` | 1921316 | `ea8ca015a01c5dd132ac21ebe9cd3d4c01f9dffa288763c9b5c1649fb527ca29` |
| `EGEMED_PULSE_SCORM_1.2.zip` | 944019 | `7212444f773e7dc4760903106ad7e7faf4710cab48decd9544c45448645b2edc` |

### Önceki kayıt (Revizyon 2, ilk teslim — 18 Eylül 2026)

Kaynak kümesi SHA-256: `cbf7ba0da018c7d375e33d928193895b07938458d115942d8581785babab735d`

| Çıktı | Boyut | SHA-256 |
|---|---|---|
| `EGEMED_PULSE_Onizleme.html` | 1792516 | `b19ec8350756c0587ee8a8b7dbc0acc731592bcfbc381a8921f066154b0dbe80` |
| `EGEMED_PULSE_SCORM_1.2.zip` | 947897 | `9a0832b21234c841056a379f341c9e755e1a100b69388abf00f19de86576ccff` |

### Önceki teslim kaydı (kullanıcı kararları sonrası, Revizyon 1)

Kaynak kümesi SHA-256: `c471b4a54fcf71e01f922bda547506b6a96567a570a0fd2585728359d9f3cc32`

| Çıktı | Boyut | SHA-256 |
|---|---|---|
| `EGEMED_PULSE_Onizleme.html` | 1748007 | `f3f2eb1f15432fdf1553aeed5f14973fb17044a643e4e7fbef0039c3d88e377b` |
| `EGEMED_PULSE_SCORM_1.2.zip` | 951930 | `a1e68d44fc67556c4829271ccaf7feee3abfcaf4700ef11523eb9fe73cd227c0` |
