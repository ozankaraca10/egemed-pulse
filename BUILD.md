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


## Son teslim kaydı (Revizyon 2 — Ausculta hizalama, doğrulama turu düzeltmeleri, 18 Eylül 2026)

Kaynak kümesi SHA-256: `d8c3bca475bb178b9d17d08dabd045b501ac612d2338fefe91ffe847151bb9ba`

| Çıktı | Boyut | SHA-256 |
|---|---|---|
| `EGEMED_PULSE_Onizleme.html` | 1921316 | `ea8ca015a01c5dd132ac21ebe9cd3d4c01f9dffa288763c9b5c1649fb527ca29` |
| `EGEMED_PULSE_SCORM_1.2.zip` | 944019 | `7212444f773e7dc4760903106ad7e7faf4710cab48decd9544c45448645b2edc` |

Tam kaynak envanteri `qa/sol_package_manifest.json` içindedir. Kaynaklar sabitlendi; bu kayıt `cardai/` değişmedikçe geçerlidir.

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
