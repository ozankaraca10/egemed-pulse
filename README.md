# EGEMED Pulse™ — Etkileşimli EKG Simülatörü

EGEMED Pulse, Ege Üniversitesi Tıp Fakültesi Dekanlığı tarafından mezuniyet öncesi tıp eğitimi için
geliştirilen, tarayıcı tabanlı ve tamamen çevrimdışı çalışan bir **EKG yorumlama simülatörüdür**.
Tıp fakültesi öğrencilerinin sistematik EKG okuma becerisini; 13 sentetik EKG sonucu, 200 vaka ve
200 değerlendirme sorusundan oluşan bir madde havuzu üzerinden geliştirmeyi hedefler. Pulse,
**EGEMED SIM** ürün ailesinin (Pulse · Ausculta · Opaca) kardiyoloji modülüdür; arayüz dili ve
etkileşim kalıpları ailenin ortak şablon deposuna dayanır:
[egemed-sim-ui-ux-framework](https://github.com/ozankaraca10/egemed-sim-ui-ux-framework).

Bu depo, diğer iki EGEMED üründen farklı olarak React/Vite değil, **saf JavaScript** bir runtime
(`cardai/`) ve bunu tek dosya HTML ile SCORM 1.2 paketine derleyen bir **Python build betiği**
(`qa/build.py`) kullanır.

## Özellikler

| Mod | İçerik |
|---|---|
| İnceleme | 13 EKG sonucunu kartlardan seçip en az 16 gerçek saniye izleme (önerilir, kilitlenmez); üç derivasyon şeridi, kaliper, normalle karşılaştırma, rehberli tur |
| Uygulama | Oturum başına havuzdan rastgele örneklenen 10 benzersiz vaka; yanlış da olsa gönderilen yanıt ilerlemeye sayılır, ipucu cezası yok |
| Değerlendirme | Oturum başına 10 benzersiz soru; 8/10 doğru = 80/100 geçer notu; sonuç ekranında alan bazlı performans ve zayıf alan raporu |

- Madde havuzu: 13 EKG sonucu × 200 vaka + 200 değerlendirme sorusu = 400 sentetik madde
  (`cardai/curriculum.js` içinde çalışma zamanında `cases.length===200 && questions.length===200`
  doğrulamasıyla garanti edilir).
- Üç eşzamanlı derivasyon şeridi (D1/D2/D3, aVR/aVL/aVF, V1–V6), kaliper ile R–R/PR/QRS/QT ve J+20 ms ölçümü.
- Seçenek sırası her madde kimliğine özgü sabit bir tohumla (`seededPermutation`) karıştırılır; sıra
  tahmin edilebilir bir örüntü izlemez.
- SCORM `suspend_data` uyumlu kompakt devam kaydı; sürüm imzası uyuşmazlığında yalnız ilgili
  oturumlar tazelenir, gözlem/kontrol listesi ilerlemesi korunur.
- Açılış ekranında kapatılabilir sentetik EKG monitör sesi (WebAudio) ve tam ekran önerisi.

## Hızlı başlangıç

Test edilen araçlar: **Python 3** (standart kitaplık dışında bağımlılık yok) ve isteğe bağlı olarak
**Node.js** (yalnız paket testindeki JavaScript kaçış kontrolü için; bu ortamda Node v24.20.0,
Python 3.14.7 ile doğrulandı). Üretim için Node veya npm paket kurulumu gerekmez.

```sh
# Tek dosya önizleme + SCORM paketini üret
python3 qa/build.py

# Paketleme kontrollerini çalıştır (5 test: byte eşitliği, manifest/ZIP tutarlılığı, kaynak hash'leri vb.)
python3 qa/sol_package_tests.py
```

`qa/build.py` kökte `EGEMED_PULSE_Onizleme.html` (tek dosya, ~1,7 MB) ve
`EGEMED_PULSE_SCORM_1.2.zip` (~0,8 MB) üretir; ayrıca `qa/sol_package_manifest.json` bütünlük
kaydını yazar. Farklı hedef için `python3 qa/build.py --output /tmp/pulse-build --report
/tmp/pulse-build-report.json`, farklı kaynak kopyası için `--source /path/to/cardai` kullanılabilir.

Kaynak kod değişikliği yapmadan önizlemeyi doğrudan açmak için:

```sh
open "EGEMED_PULSE_Onizleme.html"    # ya da cardai/index.html'i bir statik sunucudan servis edin
```

`EGEMED_PULSE_Onizleme.html`, yedi runtime JS dosyasını (`model.js → scorm.js → curriculum.js →
state.js → app.js → features.js → landing.js`), CSS'i ve dört PNG'yi (base64 veri URI) tek dosyada
gömer; `sources.json` `<script type="application/json">` yer tutucusuna gömülüdür. Çevrimdışı
çalışır, herhangi bir web sunucusu, hesap veya API anahtarı gerekmez; yalnız kaynak bağlantıları
(dış atıflar) internet ister.

## Depo yapısı

```
EGEMED_PULSE/
├── cardai/                    Yetkili runtime kaynağı (saf JS, LMS'ye giden tek gerçek kaynak)
│   ├── index.html, styles.css
│   ├── model.js, scorm.js, curriculum.js, state.js, app.js, features.js, landing.js
│   ├── sources.json           Atıf, kılavuz referansları, credits (tek doğruluk kaynağı)
│   ├── KULLANIM.md            Türkçe kullanım kılavuzu (paket içine de kopyalanır)
│   ├── imsmanifest.xml        SCORM 1.2 manifesti
│   └── assets/                Gömülü PNG'ler
├── baseline/                  Önceki teslimin değiştirilmeyen geri dönüş kopyası
├── brand/                     Marka varlıkları (logo setleri, kurumsal kimlik sunumu)
│   ├── logo-assets/, logo-paketi/
│   └── marka-kimligi-sunumu.png
├── docs/
│   ├── gecmis/                 Geçmiş yönerge ve düzeltme belgeleri (FIXES_SOL.md, YONERGE_*.md)
│   └── qc/                     Kardiyoloji QC raporu (.docx) ve 400 maddelik QC tablosu (.xlsx)
├── qa/                         Bağımsız denetim/test/dışa aktarım betikleri ve kanıtları
│   ├── build.py                HTML + SCORM ZIP üretici (yetkili build betiği)
│   ├── sol_package_tests.py    Paketleme birim testleri (Python unittest)
│   ├── export_items.mjs        400 maddenin QC dışa aktarımı → qa/evidence/export/ (git dışı)
│   ├── independent_*.mjs, mode_flow_audit.mjs, ui_audit.mjs   Bağımsız tarayıcı/akış denetimleri
│   └── evidence/                Denetim kanıtları (ekran görüntüleri, JSON sonuçlar)
├── AUDIT.md                    Bağımsız başlangıç kalite denetimi (bulgu kayıtları)
├── BUILD.md                    Derleme/paket bütünlüğü ve teslim geçmişi (sürüm sürüm SHA-256)
├── MEDICAL_SOURCES.md          Tıbbi/teknik kaynak kontrolü ve öğrenme hedefi eşlemesi
├── EGEMED_PULSE_Onizleme.html  Üretilen tek dosya önizleme (build çıktısı)
└── EGEMED_PULSE_SCORM_1.2.zip  Üretilen SCORM 1.2 paketi (build çıktısı)
```

`qa/evidence/export/` dizini `.gitignore` ile depo dışıdır (yeniden üretilebilir QC dışa aktarımı,
~80 MB PNG): `node qa/export_items.mjs` ile yeniden üretilir.

## İçerik ve veri kaynakları

`cardai/sources.json` içindeki `datasets` alanı boştur: **EKG sinyalleri bu modülde tamamen
sentetiktir; harici bir EKG veri seti kullanılmamıştır.** Kavramsal/kılavuz kaynakları:

| Kimlik | Kaynak | Kullanım |
|---|---|---|
| AF2024 | 2024 ESC Atriyal Fibrilasyon Kılavuzu | AF: düzensiz ventriküler yanıt, atriyal katkı kaybı |
| SVT2019 | 2019 ESC SVT Kılavuzu | Dar kompleks taşikardi ayırımı, flutter |
| VA2022 | 2022 ESC Ventriküler Aritmiler Kılavuzu | PVC, VT, VF elektriksel tanımı |
| ALS2025 | 2025 AHA Adult Advanced Life Support | VF arrest bağlamı |
| ACS2023 | 2023 ESC Akut Koroner Sendromlar Kılavuzu | İskemik EKG değerlendirmesi |
| BBB2009 | AHA/ACCF/HRS İntraventriküler İleti Standardı | LBBB/RBBB morfolojisi |
| ECG, CYCLE | Klabunde Cardiovascular Physiology Concepts | Derivasyon fizyolojisi, kardiyak döngü |

Tam erişim kanıtı ve sınırları `MEDICAL_SOURCES.md` dosyasındadır (kontrol tarihi: 16 Eylül 2026).

**Kullanım uyarısı:** EKG sinyalleri, anatomik şekiller ve mekanik yanıtlar sentetik öğretim
şemalarıdır; gerçek hasta basıncı, debisi, nabzı veya sonucu hesaplamaz. **Klinik tanı veya tedavi
kararında kullanılamaz.**

**Validasyon ifadesi (`cardai/sources.json` → `module.description`, aynen):**

> "Ege Üniversitesi Tıp Fakültesi Dekanlığı tarafından, tıp fakültesi öğrencilerinin EKG yorumlama
> becerilerini geliştirmek amacıyla hazırlanmıştır. Tüm hakları saklıdır © 2026. Simülatörün tüm
> tıbbi içerik ve sinyal validasyonları Ege Üniversitesi Tıp Fakültesi Kardiyoloji Anabilim Dalı
> öğretim üyelerince yapılmıştır."

## Pedagojik ve teknik tasarım kararları

- **Öneri ≠ kilit:** Mod seçim kartlarındaki durum satırları (13 EKG izleme, 10 vaka gönderme)
  yalnız öneridir; modlar arasında geçiş serbesttir, kilitlenmez (`KULLANIM.md`).
- **Tohumlu seçenek permütasyonu:** Her madde kimliği (`C001`…, `Q001`…) kendi deterministik
  tohumundan türeyen bir karıştırma sırası taşır (`curriculum.js` → `seededPermutation`).
- **Oturum içi tekrar yasağı yok, kimlik korunumu var:** Yenileme/bölüm dönüşü yeni madde
  örneklemez; aynı oturum kimliği ve yanıtlar korunur (`KULLANIM.md` → "Devam etme, tekrar ve sıfırlama").
- **En iyi puan:** LMS'ye gönderilen puan, o oturumdaki en iyi tamamlanmış değerlendirme puanıdır.
- **Tam ekran önerisi:** Açılışta bir kez tam ekrana geçmeyi öneren pencere gösterilir; "Tekrar
  sorma" işareti yalnız tarayıcıda yerel olarak saklanır, LMS kaydına yazılmaz.
- **SCORM 1.2 tek SCO ve `suspend_data` sınırı:** Kayıt 4096 baytı aşarsa reddedilir ve arayüzde
  başarısızlık gösterilir; başarı eşiği 80/100.
- **Bütünlük hash'leri kazara değişikliği saptar, dijital imza veya sınav güvenliği sağlamaz**
  (istemci kodundaki yanıtlar görülebilir/değiştirilebilir).

## Test ve kalite güvencesi

```sh
python3 qa/sol_package_tests.py   # paketleme birim testleri
node qa/mode_flow_audit.mjs       # mod akışı / kilit denetimi (gerçek tarayıcı)
node qa/independent_e2e.mjs       # bağımsız uçtan uca senaryo testi
node qa/ui_audit.mjs              # arayüz/erişilebilirlik denetimi
```

Bu depoda `python3 qa/sol_package_tests.py` çalıştırıldı: **5 test, tamamı geçti** (`OK`, 0,279 sn) —
deterministik byte eşitliği, eksik kaynak/manifest reddi, gömülü JavaScript'in ham metin
sentinelleriyle korunması, sürüm uyuşmazlığı reddi. Bağımsız tarayıcı/akış denetimlerinin geçmiş
kanıtları `qa/evidence/` altındadır (`baseline/`, `mode-flow/`, `final/`, `ui-audit/` vb.); bulgu
kayıtları ve kabul kriterleri `AUDIT.md` içindedir. Bu kontroller bir SCORM sertifikasyonu veya
gerçek LMS testi değildir; madde düzeyinde psikometrik analiz (güçlük/ayırt edicilik) henüz
yapılmamıştır.

## Paketleme ve dağıtım

- **Tek dosya:** `EGEMED_PULSE_Onizleme.html` — herhangi bir tarayıcıda doğrudan açılır, sunucu gerekmez.
- **LMS/SCORM:** `EGEMED_PULSE_SCORM_1.2.zip` — standart SCORM 1.2, tek SCO, giriş `index.html`,
  puan aralığı 0–100, başarı eşiği 80. ZIP'i açmadan LMS'nin SCORM etkinliğine yükleyin;
  `imsmanifest.xml` çevresine ek klasör koymayın.
- Her iki çıktı da `qa/build.py` ile üretilir; kaynaklar sabitlendikten sonra üretin (betik, kaynak
  değişirse hata verir). Teslim geçmişi, her turun boyut/SHA-256 kaydı `BUILD.md` içindedir.
- Gerçek LMS üzerinde doğrulama veya SCORM sertifikasyonu yapılmamıştır; API taklitleriyle yapılan
  tarayıcı testleri bunun yerini tutmaz (`cardai/KULLANIM.md`).

## Belgeler

- [`BUILD.md`](BUILD.md) — Derleme yöntemi, teslim geçmişi, sürüm sürüm SHA-256 kayıtları.
- [`cardai/KULLANIM.md`](cardai/KULLANIM.md) — Türkçe kullanım kılavuzu (öğrenme sırası, kayıt/oturum, model sınırları).
- [`MEDICAL_SOURCES.md`](MEDICAL_SOURCES.md) — Tıbbi/teknik kaynak kontrolü, öğrenme hedefi eşlemesi.
- [`AUDIT.md`](AUDIT.md) — Bağımsız başlangıç kalite denetimi ve bulgu kayıtları.
- [`docs/qc/EGEMED_PULSE_Kardiyoloji_QC_Raporu.docx`](docs/qc/EGEMED_PULSE_Kardiyoloji_QC_Raporu.docx) —
  Kardiyoloji QC raporu (400 madde).
- [`docs/gecmis/`](docs/gecmis/) — Geçmiş yönerge ve düzeltme belgeleri (FIXES_SOL.md, YONERGE_*.md).

## Katkıda bulunanlar

`cardai/sources.json` → `credits` alanından:

| Rol | Kişi |
|---|---|
| Yazılım geliştirme, öğretim ve ölçme-değerlendirme tasarımı | Doç. Dr. Ozan KARACA |
| Öğretim Tasarımı ve Tıbbi Danışmanlık | Prof. Dr. Hatice ŞAHİN, Prof. Dr. Burcu BARUTÇUOĞLU, Prof. Dr. İpek KAPLAN BULUT |
| Tıbbi İçerik Validasyonu | belirlenecek (4 kişi) |

**Kurum:** Ege Üniversitesi Tıp Fakültesi Dekanlığı.

## Lisans

Depoda ayrı bir `LICENSE` dosyası yoktur. **Tüm hakları saklıdır © 2026 Ege Üniversitesi Tıp
Fakültesi Dekanlığı.** Bu modülde kullanılan tüm EKG sinyalleri sentetiktir; harici bir veri seti
lisansı söz konusu değildir. Kılavuz/referans kaynakları (ESC, AHA, Klabunde) kendi telif haklarına
tabidir ve yalnız bağlantı/atıf amacıyla kullanılır.
