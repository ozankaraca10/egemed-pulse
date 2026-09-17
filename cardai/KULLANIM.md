# EGEMED PULSE 6.0 — Kullanım

Türkçe EKG ve dolaşım eğitim uygulaması; 13 sentetik örüntü, 200 vaka ve 200 değerlendirme sorusu içerir. Her bölümün oturumu kendi havuzundan rastgele seçilen 10 benzersiz maddeden oluşur. Beş seçenekli maddeler eğitim amacıyla hazırlanmıştır; içerik ve sinyaller bağımsız klinisyen veya psikometrik doğrulamadan geçmemiştir.

## Açma ve LMS'ye yükleme

- **Tek dosya:** `EGEMED_PULSE_Onizleme.html` dosyasını tarayıcıda açın. CSS, yedi JavaScript dosyası ve bütün görseller dosyanın içine gömülüdür.
- **LMS:** `EGEMED_PULSE_SCORM_1.2.zip` dosyasını açmadan LMS'nin SCORM etkinliğine yükleyin. Standart **SCORM 1.2**, tek SCO; giriş `index.html`, puan aralığı 0–100 ve başarı eşiği 80'dir. ZIP kökündeki `imsmanifest.xml` dosyasının çevresine ek klasör koymayın.
- **Klasör:** ZIP'i çıkarıp `index.html` dosyasını açabilirsiniz. Çalışma için sunucu, hesap, API anahtarı veya harici çalışma zamanı bağımlılığı gerekmez. Kaynak bağlantıları internet gerektirir.

Bağımsız kullanımda ilerleme yalnız tarayıcı izin verirse yerel depolamaya kaydedilir; LMS'ye gönderilmez. Özellikle `file://`, özel gezinme ve depolamayı engelleyen ayarlarda kayıt başarısız olabilir. Kayıt durumunu arayüzden kontrol edin; dosyayı başka tarayıcıya taşımak ilerlemeyi taşımaz.

Hedef LMS'de içe aktarma, başlatma, yeniden açıp devam etme, puan, etkileşim raporu ve oturum bitirme davranışını kontrol edin. Gerçek LMS üzerinde doğrulama veya SCORM sertifikasyonu yapılmamıştır; API taklitleriyle yapılan tarayıcı testleri bunun yerini tutmaz.

## Öğrenme sırası

1. Landing’de **Simülatörü başlat** ile açılan **mod seçim ekranından** İnceleme, Uygulama veya Değerlendirme modunu seçin. Modlar açıktır; kartlardaki durum satırları yalnızca **öneri** gösterir (13 örüntüyü 16 sn izleme, 10 vakayı gönderme). İlk kullanımda gerçek sahne üzerinde üç adımlı tanıtım gösterilir; "Tekrar gösterme" ile kalıcı olarak kapatılabilir. İnceleme modunda her örüntüyü kartına tıklayarak veya klavyeyle bilinçli olarak seçin ve görünür, oynar durumda en az **16 gerçek saniye** inceleyin. Açılış ekranı, programatik değişim, başka bölüm, duraklatma, açık dialog, gizli sekme veya görünmeyen simülasyon gözleme eklenmez. Yenileme veya bölümden dönüş gözlemi kendiliğinden yeniden başlatmaz; kartı yeniden seçin. 2× hız gerçek süreyi kısaltmaz.
2. Uygulama modunda oturumdaki **10 vaka yanıtını gönderin**. Yanlış fakat gönderilmiş yanıt da ilerlemeye sayılır; yalnız bir seçeneği işaretlemek yeterli değildir.
3. Değerlendirme modunda oturumdaki 10 soruyu yanıtlayıp **Yanıtları değerlendir** düğmesine basın. En az **8/10 doğru = 80/100** geçer sonuçtur. Değerlendirme sırasında madde açıklaması gösterilmez; sonuç **Sonuçlar** ekranında özet, alan bazlı performans, zayıf alanlar ve açılır soru raporu olarak sunulur. Vaka oturumu sonundaki **Raporu gör** aynı şablonun vaka varyantını açar (vaka puanı LMS’ye yazılmaz).

Bu eşikler öğretim akışı kurallarıdır; klinik yeterlilik veya güvenli sınav ölçümü değildir. **Başarı** için üç aşamanın tamamlanması gerekir (13/13 gözlem, 10/10 gönderilmiş vaka, en az 8/10 doğru); modlar arasında gezinti ise serbesttir. İstemci kodundaki yanıtlar görülebilir/değiştirilebilir; güvenlik sınırı oluşturmaz.

## Devam etme, tekrar ve sıfırlama

Oturum kimlikleri, seçilen madde kimlikleri, yanıtlar ve gönderim durumları kayıt başarılı olduğunda korunur. Yenileme ve bölüm dönüşü yeni soru örneklemez.

| Eylem | Sonuç |
|---|---|
| Aynı 10 vakayı/soruyu yeniden dene | Aynı madde sırasını korur; ilgili oturumun yanıtlarını ve gönderimlerini temizler, yeni deneme kimliği oluşturur. |
| Yeni 10 vaka/soru örneklemi | İlgili havuzdan yeni rastgele örneklem ve oturum kimliği oluşturur; ilgili yanıtları temizler. Bazı maddeler önceki örneklemle örtüşebilir. |
| Başa al | Yalnız simülasyon zamanını sıfırlar; öğrenme ilerlemesini silmez. |
| Hakkında → Yerel veriler → İlerlemeyi sıfırla | Onaydan sonra yerel gözlemleri, iki örneklemi, yanıtları, en iyi puanı, kontrol listesini ve araç kullanımını sıfırlar. |

Tekrar veya yeni örneklem gözlem ilerlemesini ve geçmiş en iyi tamamlanmış değerlendirme puanını korur. Yeni veya yeniden başlatılan vaka oturumu ilerleme sayacını sıfırlar; başarı için üç aşamanın güncel durumu birlikte değerlendirilir. Önceden elde edilen başarı, geçerli geçmiş deneme ve o denemeye eşlik eden tamamlanmış vakalarla korunur. LMS'nin daha önce kabul ettiği `passed` durumu, tam yerel sıfırlamadan sonra da korunur; uygulama LMS başarı kaydını sıfırlamaz. Yerel puan geçmişi sıfırlanır.

Eski v1–v5 kayıtlarında doğrulanabilen örüntü, simülasyon zamanı, en fazla 16 saniyelik gözlem ve AF profili korunur. Eski sabit 50 maddelik yanıtların yeni havuza güvenilir eşlemesi yoktur; eski yanıtlar, puan ve yerel başarı yeni havuza taşınmaz. LMS'de zaten kabul edilmiş `passed` ayrı olarak korunur. Okunamayan kayıt, bozuk JSON, desteklenmeyen sürüm/biçim veya 4096 bayttan büyük kayıt için güvenli başlangıç görünümü açılır; önceki kaydı ezmemek için yeni yazımlar engellenir. Kaydı yeniden okumayı deneyin veya Hakkında → Yerel veriler bölümünde ilerlemeyi sıfırlamayı açıkça onaylayın. Desteklenen sürümlerdeki geçersiz alanlar dar şemayla güvenli değerlere döner.

## Görünüm ve araçlar

Üst çubukta sekmeler yerine **mod çipi** ve **Mod Değiştir** düğmesi bulunur; **Hakkında** atıfları ve yerel veri araçlarını, **Yardım** kısayolları ve kapsam notunu gösterir. Değerlendirme modunda çıkış, yanıtları koruyan bir onay ister.

Açık tema ve ürün ailesi yazı ölçeği (14 px gövde) kullanılır; tarayıcı yakınlaştırması kullanılabilir. En az 1366×768 masaüstü pencere önerilir; dar ekranlarda paneller alt alta yerleşir. Tam ekran tarayıcının tam ekran API'sine bağlıdır. Uygulamada sesli anlatım yoktur.

- Kalp, EKG veya açıklama panelini büyütmek için odak düğmesini; geri dönmek için aynı düğmeyi, **Bölünmüş** veya Esc'yi kullanın.
- Üç eşzamanlı şerit menüsü: D1/D2/D3, aVR/aVL/aVF ve V1–V6. Sütuna tıklamak ölçüm derivasyonunu seçer. Senaryo değişiminde öğretici varsayılan üçlü yüklenir.
- Vaka ve sorular kendi sentetik EKG ve derivasyon menülerine sahiptir. **Simülatörde aç** yalnız doğru gönderilmiş vakada görünür; **Vakaya dön** aynı vaka ve yanıt bağlamını korur.
- **Normalle karşılaştır**, **Kaliper**, R–R/PR/QRS/QT ve J+20 ms ölçümleri, **Rehberli tur** ve **Sistematik okuma** incelemeyi destekler. Ölçülemeyen değerler sayısal sonuç gibi sunulmaz.
- Oynat/duraklat ortak simülasyon saatini yönetir. 0,25×/0,5×/1×/2× yalnız simülasyon zamanını etkiler; hastanın elektriksel hızını değiştirmez.
- **Hakkında** sayfası geliştirici/atıf kartlarını, kaynakları, sınırlılıkları ve **Yerel veriler** bölümünü (CSV raporu indir, ilerlemeyi sıfırla) içerir.
- Klavye (İnceleme modu): Space oynat/duraklat; 1–9 ilk dokuz örüntü; `[`/`]` örüntüler arasında geçiş; sağ/sol ok olaylar; F tam ekran; C kaliper; Esc odaktan çıkış. Form alanlarında ve açık pencerelerde kısayollar devre dışı kalır; seçeneklerde ok tuşlarıyla gezinilir.

## Kayıt ve oturum bitirme

Kompakt sürüm 6 devam kaydı gözlemleri, 10+10 örneklemi, yanıtları, türetilen başarı için gerekli geçmiş denemeleri, derivasyonları, kontrol listesini ve araç kullanımını taşır. SCORM `suspend_data` kaydı 4096 baytı aşarsa kayıt reddedilir ve başarısızlık gösterilir. Puan LMS'ye en iyi tamamlanmış değerlendirme puanı olarak gönderilir. Gönderilen vaka/test yanıtları LMS desteklediğinde `cmi.interactions` üzerinden oturum ve madde kimlikleriyle raporlanır; tekrarlarda yeni deneme kayıtları oluşabilir.

Kayıt yaklaşık 10 saniyede bir ve önemli etkileşimlerde denenir. Aktif öğrenme süresi açılış, açık dialog ve gizli sekme sürelerini dışlar. Çekirdek ilerleme kaydı ile isteğe bağlı etkileşim raporunun başarısı ayrı gösterilir. Başarısız kayıtta ilerleme bellekte kalır ve sonraki kayıt denemeleri sürer; kayıt durumu ekranda ayrı bir gösterge olarak tutulmaz. Tarayıcının ani kapanışı son kayıt denemesini garanti etmez.

Değerlendirme sonuç ekranındaki **"Modülden Çık"** düğmesi isteğe bağlıdır; onay sonrası kaydı LMS'e bitmiş olarak bildirir. Bu düğme kullanılmasa da ilerleme düzenli olarak kaydedilir; sekme kapanırken uygulama son kaydı yapıp LMS bitirme çağrısını (LMSFinish) **otomatik** dener. Yeni bir LMS kaydı için dersi LMS'den yeniden açın.

## Model ve kaynak sınırları

Örüntüler: normal sinüs ritmi, AF, anterior ve inferior ST elevasyonlu MI örnekleri, PVC, düzenli dar kompleks SVT, monomorfik VT, VF, fokal/paroksismal atriyal taşikardi, 2:1 atriyal flutter, sinüs taşikardisi, LBBB ve RBBB.

EKG elektriksel etkinliktir; kan hareketi değildir. Sinyaller, anatomik şekiller, koroner alanlar, kapaklar ve mekanik yanıtlar sentetik öğretim şemalarıdır. Model gerçek hasta basıncı, debisi, nabzı, damar tıkanması veya sonucu hesaplamaz; tanı ve tedavi kararında kullanılmaz. VF'de etkili ileri akım ve organize ejeksiyon yoktur; VT'nin klinik nabız/hemodinamik durumu çizimden çıkarılamaz. MI'de tek derivasyon kesin tanı/damar belirlemez. Kaliper zamanı ve voltajı sentetik modelden ölçer; ekrandaki fiziksel milimetre ölçeğe bağlıdır.

Kaynaklar 16 Eylül 2026 tarihinde denetlendi. Bunlar kavramları destekler; 400 maddenin geçerliği veya modelin klinik doğrulaması değildir. Tam erişim sınırları proje kökündeki `MEDICAL_SOURCES.md` belgesindedir.

- [ESC AF 2024](https://doi.org/10.1093/eurheartj/ehae176), [ESC SVT 2019](https://doi.org/10.1093/eurheartj/ehz467).
- [ESC ventriküler aritmiler 2022](https://doi.org/10.1093/eurheartj/ehac262), [AHA ALS 2025](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support).
- [ESC ACS 2023](https://doi.org/10.1093/eurheartj/ehad191), [AHA/ACCF/HRS ileti standardı 2009](https://doi.org/10.1161/CIRCULATIONAHA.108.191095).
- [Klabunde: ekstremite derivasyonları](https://cvphysiology.com/arrhythmias/a013a), [kardiyak döngü](https://cvphysiology.com/heart-disease/hd002).

## Hak sahipliği

Bu uygulama Ege Üniversitesi Tıp Fakültesi Dekanlığı tarafından geliştirilmiştir. Tüm hakları saklıdır © 2026
