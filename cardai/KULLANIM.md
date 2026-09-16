# EGEMED PULSE

EKG ile kalbin elektriksel etkinliğini, mekanik yanıtını, kapak durumlarını ve kan akışını ortak bir simülasyon saatinde gösteren Türkçe eğitim uygulaması.

## Paket

- Standart: **SCORM 1.2**, tek SCO.
- Toplam 13 senaryo: normal sinüs ritmi, atriyal fibrilasyon, anterior ST elevasyonlu MI, inferior ST elevasyonlu MI, PVC, düzenli dar kompleks SVT, monomorfik ventriküler taşikardi, ventriküler fibrilasyon, paroksismal atriyal taşikardi, atriyal flutter, sinüs taşikardisi, sol dal bloğu ve sağ dal bloğu.
- İçerik çevrimdışı çalışır. Sunucu, hesap veya API anahtarı gerekmez. Kaynak bağlantıları internet gerektirir.
- Açık tema ve sabit %120 okunabilirlik ölçeği kullanılır.
- 16:9 masaüstü ve sınıf ekranlarında kalp/dolaşım solda; üç derivasyon şeridi ve açıklama sağda tek ekrana sığar. Dar ekranlarda paneller alt alta yerleşir.
- Ege Üniversitesi Tıp Fakültesi logosu paket içinde yereldir. Anatomi, eğitim amaçlı programlanmış bir şemadır; fotoğraf gerçekliğinde 3B model değildir.
- Uygulamada sesli anlatım bulunmaz.

## LMS'ye yükleme

1. `EGEMED_PULSE_SCORM_1.2.zip` dosyasını açmadan LMS'nin SCORM etkinliğine yükleyin.
2. Standart sorulursa **SCORM 1.2** seçin. Lansman kaynağı `index.html` olur.
3. Puan aralığı 0–100, başarı eşiği 80'dir. Elli eşit ağırlıklı soruda geçer sonuç en az 40/50'dir.
4. En az 1366×768, tercihen 16:9 pencere kullanın. Uygulamadaki **Tam ekran** düğmesi tarayıcının tam ekran API'sini kullanır.
5. İlk kullanımda kendi LMS'nizde başlatma, ilerleme kaydı, puan raporu ve devam etme davranışını kontrol edin. Gerçek LMS üzerinde sertifikasyon yapılmamıştır.

ZIP kökünde `imsmanifest.xml` bulunur. Paketi ayrıca bir üst klasör içine alıp yeniden sıkıştırmayın.

## LMS dışında açma

ZIP'i klasöre çıkarıp `index.html` dosyasını güncel bir tarayıcıda açabilirsiniz. `EGEMED_PULSE_Onizleme.html` tek dosya olarak da çalışır. Bağımsız kullanımda ilerleme, tarayıcı izin verirse yerel olarak saklanır; LMS'ye iletilmez.

## Üç derivasyonlu elektriksel etkinlik alanı

Elektriksel etkinlik görünümü, aynı zaman eksenini paylaşan üç kompakt sütundan oluşur:

| Derivasyon grubu | Seçenekler | Eğitim amacı |
|---|---|---|
| 1 | D1, D2, D3 | Ekstremite bipolar derivasyonları |
| 2 | aVR, aVL, aVF | Artırılmış ekstremite derivasyonları |
| 3 | V1, V2, V3, V4, V5, V6 | Prekordiyal derivasyonlar |

Her sütunun açılır menüsü bağımsızdır. Sütuna veya izine tıklamak o derivasyonu ölçümler için etkinleştirir. Senaryo seçildiğinde öğretici varsayılan üçlü otomatik yüklenir; kullanıcı daha sonra her sütunu değiştirebilir. MI ve dal bloğu örneklerindeki morfoloji seçilen derivasyona göre değişir.

## Temel etkileşimler

- Yatay ritim şeridindeki senaryo kartları EKG'yi, açıklamayı, ölçümleri ve mekanik davranışı birlikte değiştirir.
- Kalp, EKG veya açıklama paneli ayrı büyütülebilir. Aynı odak düğmesine ikinci kez basmak ya da **Bölünmüş** düğmesini kullanmak görünümü küçültür ve üç paneli geri getirir.
- Arayüz, sabit %120 yazı ölçeğiyle 16:9 ekran için doğrulanmıştır.
- **Normalle karşılaştır** seçili anomalinin arkasında kesikli normal ritim referansı gösterir. Ventriküler fibrilasyonda organize kompleks olmadığı için karşılaştırma anahtarı gösterilmez.
- EKG'ye tıklama, seçilen sütunu etkinleştirir ve simülasyonu ilgili zamana taşır.
- **Kaliper**, iki nokta arasındaki süre ve voltaj farkını hesaplar. Hazır R–R, PR, QRS ve ST/J ölçümleri de vardır.
- **Rehberli tur**, elektriksel uyarıdan doluşa kadar kalp döngüsünü adım adım oynatır.
- **Sistematik okuma**, hız, ritim, P, PR, QRS ve ST–T kontrol listesi sunar.
- Vakalar alanında 50 klinik soru sentetik EKG ile sayfa sayfa sunulur. Vaka başlıkları tanıyı ele vermeyen klinik durum adlarıdır; vaka içinde ek süre kilidi yoktur.
- **Eğitici** paneli gözlem sürelerini, vaka/test sonuçlarını ve kullanılan araçları özetler; CSV raporu indirir.
- Oynat/duraklat tüm simülasyonu aynı anda yönetir. Arka plandaki sekme otomatik bekler.
- 0,25× / 0,5× / 1× / 2× oynatma hızı yalnız simülasyon zamanını etkiler; hastanın kalp hızını değiştirmez.
- Elektriksel uyarı, akış parçacıkları, kapaklar, anatomik etiketler ve koroner katman ayrı ayrı açılıp kapatılabilir.
- **Başa al** simülasyon saatini sıfırlar, öğrenme ilerlemesini silmez.
- Klavye: Space oynat/duraklat; 1–9 ilk dokuz senaryo; `[`/`]` tüm senaryolar arasında geçiş; sağ/sol ok olaylar; F tam ekran; C kaliper; Esc odaktan çıkış.

## Tamamlama ve SCORM verileri

Her bir 13 senaryo, en az **16 saniye gerçek izleme süresi** boyunca görünür ve oynar durumda incelenmelidir. Hız kontrolü süreyi kısaltmaz; zaman atlama, duraklatma, soru ekranı ve arka plandaki sekme süreye eklenmez.

On üç simülasyon varyantının her biri en az 16 saniye izlendiğinde Vakalar ve Değerlendirme bölümleri birlikte açılır. Değerlendirme puanı en az 80/100 olursa `cmi.core.lesson_status=passed` kaydedilir. 50 soruda ilk geçer puan 80/100'dür. Başarı bir kez elde edilince korunur; en iyi puan saklanır.

Paket; puanı, durumu, son senaryo/zamanı, üç derivasyon seçimini, oynatma hızını, gözlem sürelerini, kontrol listesini, vaka sonuçlarını, araç kullanımını ve cevapları kaydeder. 50 değerlendirme sorusu ve 50 vaka yanıtı `cmi.interactions` üzerinden raporlanır (LMS desteklediğinde). Kayıt yaklaşık 10 saniyede bir, önemli etkileşimlerde ve sayfa kapanışında yapılır.

## Fizyolojik kapsam ve model varsayımları

EKG kan hareketini değil elektriksel etkinliği kaydeder. Mekanik kasılma uyarıyı izler; kapaklar uygun basınç farkları oluştuğunda açılır. Model bu sırayı öğretir, gerçek hasta basınçlarını veya debisini hesaplamaz.

- Normal sinüs ritmi: 75/dk, R–R 800 ms, PR 175 ms, QRS 80 ms.
- Atriyal fibrilasyon: P dalgası ve organize atriyal kasılma yok; ince f dalgaları ve düzensiz R–R. Kontrollü/hızlı ventrikül yanıtı seçilebilir.
- PVC: 75/dk temel ritimde erken, yaklaşık 140 ms geniş kompleks ve toparlanma aralığı.
- Düzenli dar kompleks SVT: yaklaşık 167/dk, R–R 360 ms, QRS 80 ms; ayrı P dalgası gösterilmez.
- Paroksismal atriyal taşikardi: yaklaşık 150/dk, düzenli dar QRS ve inferior derivasyonlarda farklı/invert P morfolojisi.
- Atriyal flutter: atriyal hız yaklaşık 300/dk, 2:1 iletimle ventrikül hızı yaklaşık 150/dk; testere dişi aktivite inferior derivasyonlar ve V1'de belirgindir.
- Sinüs taşikardisi: yaklaşık 120/dk, her QRS öncesinde sinüs P dalgası ve dar kompleks.
- Monomorfik ventriküler taşikardi: yaklaşık 158/dk, düzenli ve yaklaşık 180 ms geniş kompleks; mekanik yanıt azaltılmıştır.
- Ventriküler fibrilasyon: organize QRS ve etkili ejeksiyon yoktur; sinyal kaotik eğitim örneğidir.
- Sol dal bloğu: yaklaşık 160 ms geniş QRS; V1'de derin negatif, I/aVL/V6'da geniş-çentikli pozitif morfoloji ve gecikmiş sol ventrikül yanıtı.
- Sağ dal bloğu: yaklaşık 140 ms geniş QRS; V1'de rSR' benzeri görünüm, I/V6'da geniş terminal S ve gecikmiş sağ ventrikül yanıtı.
- Anterior STEMI: V1–V4'te belirgin sentetik ST/J yükselmesi, inferior karşılıkta hafif resiprokal değişim.
- İnferior STEMI: D2, D3 ve aVF'de sentetik ST/J yükselmesi; D1/aVL'de resiprokal değişim.

MI bölgeleri, koroner tıkanma ve duvar hareketi şematiktir. Tek bir derivasyon tanı koydurmaz; komşu derivasyonlar, klinik tablo ve diğer incelemeler birlikte değerlendirilir. Üretilen sinyaller sentetiktir ve tanısal cihaz çıktısı değildir.

Şemada sağ kalp ekranın solundadır. Mavi parçacıklar oksijeni az, kırmızı parçacıklar oksijeni fazla kanı; sarı çizgiler elektriksel uyarıyı temsil eder. Bir küçük EKG karesi yatayda 0,04 saniye, düşeyde 0,1 mV eşdeğeridir; fiziksel milimetre ekran ölçeğine bağlıdır.

## Kaynaklar

1. Camm AJ ve ark. Atrial fibrillation guideline. *European Heart Journal*. [DOI: 10.1093/eurheartj/ehq278](https://doi.org/10.1093/eurheartj/ehq278).
2. Page RL ve ark. 2015 ACC/AHA/HRS supraventriküler taşikardi kılavuzu. [DOI: 10.1161/CIR.0000000000000311](https://doi.org/10.1161/CIR.0000000000000311).
3. Al-Khatib SM ve ark. 2017 AHA/ACC/HRS ventriküler aritmi kılavuzu. [DOI: 10.1161/CIR.0000000000000549](https://doi.org/10.1161/CIR.0000000000000549).
4. Surawicz B ve ark. AHA/ACCF/HRS intraventriküler iletim bozuklukları standardizasyon önerileri. [DOI: 10.1161/CIRCULATIONAHA.108.191095](https://doi.org/10.1161/CIRCULATIONAHA.108.191095).
5. Wagner GS ve ark. AHA/ACCF/HRS akut iskemi ve infarktüs EKG standardizasyon önerileri. [DOI: 10.1016/j.jacc.2008.12.016](https://doi.org/10.1016/j.jacc.2008.12.016).
6. Klabunde RE. [CV Physiology: Cardiac Cycle](https://cvphysiology.com/heart-disease/hd002).

Kontrol tarihi: 15 Eylül 2026. Kaynaklar klinik kavramları destekler; yazılımın tanısal veya hemodinamik doğrulaması anlamına gelmez.

## Yapılan doğrulamalar

On üç deterministik model ve derivasyona özgü MI/dal bloğu morfolojileri; üç bağımsız derivasyon menüsü; oynat/duraklat senkronizasyonu; açık tema; sabit %120 okunabilirlik ölçeği; açılıp yeniden küçülebilen panel odağı; 1366×768 ve 1920×1080 görünüm; dar ekran uyumu; ölçüm, karşılaştırma, rehber, vaka ve rapor araçları otomatik olarak sınanır.

SCORM 1.2 API test düzeneğinde başlatma, 80/100 `passed` kaydı, 100 etkileşime kadar raporlama, v5 kaldığı yerden devam ve oturumu tek kez bitirme doğrulanır. Bunlar otomatik yazılım testleridir; hedef LMS içe aktarma testi ve klinik uzman validasyonu yerine geçmez.

## Hak sahipliği

Bu uygulama Ege Üniversitesi Tıp Fakültesi Dekanlığı tarafından geliştirilmiştir. Tüm hakları saklıdır. © 2026
