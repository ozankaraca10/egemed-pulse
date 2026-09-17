# EGEMED PULSE — Bağımsız başlangıç kalite denetimi

Tarih: 16 Eylül 2026. Denetçi ana ajan: gpt-6-astra / xhigh (yerel config ve runtime model kataloğu doğrulandı). Uygulama ajanı bu rapor tamamlandıktan sonra oluşturulacak. Ürün kodunda denetim sırasında değişiklik yapılmadı.

## Doğrulanmış başlangıç

- Gerçek kaynak çalışma yolu: `/Users/ozankaraca/Documents/Codex/EGEMED_PULSE/cardai`. Masaüstündeki mevcut PULSE SCORM ZIP arşivinden birebir çıkarılmıştır. Eski çalışma ortamının kısmi değişikliklerini içerdiği varsayılmadı.
- Önceki `/workspace/scratch/5d9bed6a3a7c` yok. Yerel bağımsız kaynak deposu bulunamadı; mevcut arşivde tüm runtime kaynakları var. Geçici codex-file-preview kaynak kabul edilmedi.
- Geri dönüş: `baseline/`, SHA-256 envanteri, Git başlangıç commit `8ab579a`. Yeni yerel Git kökü proje klasörü, branch `audit/2026-09-16`, remote yok; kullanıcının başka depolarına dokunulmadı. Uygulanabilir AGENTS.md bulunmadı.
- Kaynak paketi 13 örüntü ve 50+50 madde içerir; iddia edilen 200+200 havuz başlangıçta yoktur. 100 mevcut maddenin tamamı `qa/evidence/baseline/all-items.json` ve `item-review.json` içinde denetlendi.

## Yöntem ve kanıt ayrımı

Gerçek Chromium hem headless hem pencereli çalıştırıldı. `qa/audit_baseline.mjs` gerçek tarayıcı testidir; mock DOM değildir. SCORM senaryoları gerçek tarayıcıya eklenen API taklidi kullanır, gerçek LMS değildir. Sayısal model testleri Node üzerinde ayrı olarak çalışır. Ekran görüntüleri ve JSON kanıtları `qa/evidence/baseline/` içindedir.

Başlangıç ortamında port/Chromium başlatma sandbox tarafından engellendi; yetkili dış-sandbox çalıştırmada çözüldü. Bu kullanıcı izni vermedi olarak yorumlanmadı. İlk audit testimizde geniş `[data-mode]` seçicisi body ile karta birlikte eşleşti; test seçicisi daraltılıp yeniden çalıştırıldı. Bu test düzeneği hatası ürün bulgusu olarak yazılmadı.

16,5 gerçek saniye/2× izleme testi bu ortamda tamamlandı. Önceki başarısız testin betiği yok; eski başarısızlığın uygulama mı ortam mı kaynaklı olduğu kesinleştirilemez. Yeni test asıl uygunluk hatalarını ayrıca gösterir. Pencereli otomasyonda yeni sekmeye geçince `document.hidden=false` kaldı: bu koşul gerçek hidden testi sayılmadı; gizli sekme kabulü ek native lifecycle/uygun browser testi gerektirir.

Tıbbi kaynaklar, erişim sınırları ve hedefler `MEDICAL_SOURCES.md`. 13×12 derivasyon sayısal tarandı; tüm üretim dalları incelendi. Bu çalışma bağımsız klinisyen validasyonu veya psikometrik validasyon değildir.

## Başlangıçta geçen kontroller

Altı JS dosyası sözdizimi kontrolünden geçti. Manifestteki tüm dosya yolları arşivde var; kökte manifest ve index var. Masaüstü/İndirilenler HTML aynı; HTML içindeki altı script ve CSS ZIP ile eşleşiyor. Ürün runtime bağımlılığı/ağ isteği yok; kaynak bağlantıları dışarı açılıyor ve noopener/noreferrer taşıyor. Görünür light tema ve120 ölçek var; kullanıcı zoom veya sesli anlatım kontrolü yok.13 kart altları1366/1920/390 geometri ölçümünde kesilmiyor. Panel büyüt→küçült üç panelde çalışıyor.1366 ve1920 tam ekran help dialogu erişilebilir. Pause ve help modalında süre artmıyor.

İstemci kaynaklarında yanıtlar ve kilitler görülebilir/değiştirilebilir; bunlar sınav güvenliği sınırı değildir. Mevcut innerHTML noktaları sabit ürün verisinden besleniyor; doğrudan LMS stringinden çalışan XSS saptanmadı. Buna karşılık restore doğrulaması bozuk veriyle çökmeye açıktır (PULSE-013). Kısa audit bellek sızıntısı yokluğunu kanıtlamaz.

## Bulgular

### PULSE-001 — İlerleme/durum

- **Öncelik:** yüksek. **Sınıf:** Doğrudan gözlenen hata. **Durum:** Açık.
- **Konum:** `cardai/app.js:35, app.js:110; landing.js:3` (başlangıç commit satırları).
- **Yeniden üretme:** Temiz oturumda landing ekranını 17 saniye açık bırak; ardından programatik setMode çağır.
- **Beklenen / gerçekleşen:** Açık kart/klavye seçimi, oynatma, görünür simülasyon ve modal yokluğu birlikte gerekirdi. Landing açıkken normal=16 oldu; setMode(AF) 1,2 saniyede +1,29 saniye kazandırdı. Reset modalı açıkken +1,125 saniye ilerledi.
- **Etki:** İzleme kaydı gerçek kullanıcı etkinliğini temsil etmiyor; bölüm açılabilir.
- **Kanıt:** audit-baseline.json: LANDING-17s, PROGRAMMATIC, OTHER-MODAL.
- **Önerilen düzeltme:** Kalıcı gözlem miktarını geçici kullanıcı seçimi niyetinden ayır; ortak uygunluk kontrolü ve monotonic gerçek zaman kullan; tüm dialog/landing/görünürlük/navigasyon geçişlerinde zaman ankrajını sıfırla.
- **Kabul testi:** T01: landing/programatik değişim/başka bölüm/modal/pause/hidden/offscreen 0 artış; bilinçli tıklama ve Enter/Space/kısayol ile 16 gerçek saniye; 2× süreyi kısaltmaz; yenileme niyeti otomatik başlatmaz.

### PULSE-002 — Bölüm kilitleri

- **Öncelik:** yüksek. **Sınıf:** Doğrudan gözlenen hata. **Durum:** Açık.
- **Konum:** `cardai/app.js:93, app.js:108; index.html:121` (başlangıç commit satırları).
- **Yeniden üretme:** 13 viewed değerini 16 yaparak önkoşul durumunu hazırla; sıfır vaka yanıtıyla Değerlendirme seç.
- **Beklenen / gerçekleşen:** 13 simülasyondan sonra vakalar; 10 oturum vakası yanıtından sonra değerlendirme açılmalı. Sıfır yanıtla quiz açıldı.
- **Etki:** Öğretim sıralaması ve LMS başarı anlamı bozulur.
- **Kanıt:** audit-baseline.json: QUIZ-WITH-ZERO-CASES.
- **Önerilen düzeltme:** Tek türetilmiş prerequisites fonksiyonu UI, navigasyon, puanlama ve restore için ortak olsun.
- **Kabul testi:** T02: 12/13→iki bölüm kilitli; 13/13→vakalar açık quiz kapalı; 9/10→quiz kapalı; 10/10→quiz açık; yanlış fakat gönderilmiş vaka yanıtı tamamlamaya sayılır; vakada 16 sn beklenmez.

### PULSE-003 — Havuz/oturum

- **Öncelik:** yüksek. **Sınıf:** Doğrudan gözlenen hata. **Durum:** Açık.
- **Konum:** `cardai/curriculum.js:19–25; app.js:18–32, app.js:118–122; features.js:73–77` (başlangıç commit satırları).
- **Yeniden üretme:** PulseCurriculum dizilerini ve iki bölüm sayfalarını aç; yenile ve retry yap.
- **Beklenen / gerçekleşen:** 200 vaka + 200 soru; rastgele benzersiz 10+10 oturum ve kalıcı örneklem gerekirdi. 50+50 sabit sıra var; örneklem kimliği ve yeni oturum yok.
- **Etki:** İçerik kapsamı kullanıcı talebini karşılamıyor; oturum ve ilerleme ayrımı yok.
- **Kanıt:** audit-baseline.json: CONTENT; all-items.json; item-review.json.
- **Önerilen düzeltme:** Gerçek içerik ve değişmez madde kimlikleri; örneklem + yanıt + sürüm kaydı; devam/yeni soru oturumu/tüm ilerlemeyi sıfırla ayrı akışlar.
- **Kabul testi:** T03: her havuz 200, her örneklem 10 benzersiz geçerli ID; reload ve bölüm dönüşünde aynı; yeni oturum farklı; sadece ilgili oturum yanıtları sıfırlanır; 10 soru için 8 doğru=%80.

### PULSE-004 — Eğitsel/tıbbi madde kalitesi

- **Öncelik:** yüksek. **Sınıf:** Kod ve tüm başlangıç madde envanteriyle doğrulanan hata. **Durum:** Açık.
- **Konum:** `cardai/curriculum.js:19–25` (başlangıç commit satırları).
- **Yeniden üretme:** 100 başlangıç maddesinin tamamını all-items.json üzerinden incele ve klinik öyküleri yaş çıkararak karşılaştır.
- **Beklenen / gerçekleşen:** Beş seçenek ve tek savunulabilir doğru, anlamlı klinik farklılık, hedef/kaynak ve seçilen çeldirici açıklaması gerekirdi. Tüm maddeler üç seçenekli; 50 vakada 13 temel öykü var, tüm doğru yanıtlar 0. Q014–026 keyfi odak derivasyonunu klinik öncelik gibi soruyor. Mekanizma çeldiricileri çoğu kez bariz mutlak yanlış; etki soruları başka ritimde de mümkün.
- **Etki:** Ezber/yanıt pozisyonu öğrenilir; savunulamayan doğru yanıtlar puanı çarpıtır.
- **Kanıt:** item-review.json: 100 ayrı satır; MEDICAL_SOURCES.md.
- **Önerilen düzeltme:** Maddeleri gerçek karar, veri, morfoloji veya yorumlama farkıyla yeniden yaz. Demografik değişiklikleri bağımsız olgu diye sayma. Örtüşen SVT/AT seçeneklerini açık alt başlıklarla ayır; seçenek başına açıklama; her madde objective/source IDs.
- **Kabul testi:** T04: 400 maddenin ayrı envanteri, 5 benzersiz seçenek, tek doğru index, klinik/anlamsal tekrar denetimi, dengeli cevap yerleri, örüntü/görsel tutarlılığı, hedef/kaynak ve 5 gerekçe; bağımsız içerik incelemesi.

### PULSE-005 — Vaka/değerlendirme EKG

- **Öncelik:** yüksek. **Sınıf:** Doğrudan gözlenen hata. **Durum:** Açık.
- **Konum:** `cardai/features.js:74–77; app.js:118; index.html:119–121` (başlangıç commit satırları).
- **Yeniden üretme:** Vakalara gir; menüleri ara; vaka EKG ekranını 1366→1920 büyüt; quiz aç.
- **Beklenen / gerçekleşen:** Her soru kendi model ve derivasyonuyla çizilmeli, menü sinyali değiştirmeli ve resize/geri dönüşte güncellenmeli. Vakada menü yok; çoğu vaka seçili simülasyonun derivasyonlarını kullanıyor; bitmap 791×363 kalırken CSS 1135×673 oluyor. Quizde hiç EKG yok.
- **Etki:** Yanlış derivasyondan yorum, bulanık/boş olabilen çizim ve değerlendirmede görsel veri eksikliği.
- **Kanıt:** audit-baseline.json: CASE-BEFORE-ANSWER, QUIZ-WITH-ZERO-CASES; edges.json: resizeBefore/After.
- **Önerilen düzeltme:** Ortak soru EKG renderer; soruya ait model/lead ayarları; görünürlük ve ResizeObserver sonrası çizim; eksen/birim ve nötr erişilebilir açıklama.
- **Kabul testi:** T05: 10+10 sayfanın ilk/sonraki/önceki/reload/resize/dönüş çizimlerinde nonblank bitmap ve doğru lead/model; menü değişimi piksel/sinyal farkı üretir.

### PULSE-006 — Yanıt sızıntısı

- **Öncelik:** yüksek. **Sınıf:** Doğrudan gözlenen hata. **Durum:** Açık.
- **Konum:** `cardai/features.js:75; curriculum.js:18–19` (başlangıç commit satırları).
- **Yeniden üretme:** Yanıt vermeden caseExpand düğmesine bas.
- **Beklenen / gerçekleşen:** Simülatörde aç yalnız doğru vaka yanıtından sonra görünmeli. Düğme başlangıçta açık ve tanı başlıklı simülatöre götürüyor. Bazı vaka başlıkları tanıya özgü morfoloji ipucu içeriyor.
- **Etki:** Yanıtı görerek başarı elde etme; ölçme geçerliği zayıflar.
- **Kanıt:** audit-baseline.json: CASE-BEFORE-ANSWER; case-baseline.png.
- **Önerilen düzeltme:** Doğru yanıt kontrolü sonrası eylem; vaka/oturum geri dönüş bağlamı; başlık/alt/aria metninde cevabı ele vermeyen tanımlama.
- **Kabul testi:** T06: boş/yanlış yanıtta açma eylemi yok; doğruda var; simülatörden aynı ID ve yanıtlı vakaya dönülür; soru başlığı/erişilebilir etikette tanı sızıntısı yok.

### PULSE-007 — EKG derivasyon modeli

- **Öncelik:** yüksek. **Sınıf:** Doğrudan sayısal hata. **Durum:** Açık.
- **Konum:** `cardai/model.js:12–16, model.js:40–50` (başlangıç commit satırları).
- **Yeniden üretme:** 13 modun her birinde 0–10 saniyeyi 3 ms aralıkla 12 derivasyonda örnekle; II−I−III ve artırılmış ilişkileri hesapla.
- **Beklenen / gerçekleşen:** Aynı elektrot potansiyellerinden gelen ilişkiler sayısal toleransla tutmalı. Normalde II−I−III maksimum 0,40 mV; VF 0,824; LBBB 0,919. Tüm 13 örüntü başarısız.
- **Etki:** Derivasyon ve vektör ilişkilerini yanlış öğretir.
- **Kanıt:** audit-baseline.json: MODEL-*; MEDICAL_SOURCES.md ECG.
- **Önerilen düzeltme:** İki bağımsız ekstremite bileşeninden altı lead türet; P/QRS/ST/T, AF/flutter/VF bileşenlerine aynı dönüşümü uygula. Göğüs derivasyonlarının morfolojisini ayrıca koru.
- **Kabul testi:** T07: 13×12 sonlu örnekler; tüm zamanlarda limb kimlikleri <1e-9 mV; inferior/anterior ST ve BBB polariteleriyle eşzamanlı doğrulama.

### PULSE-008 — Ölçüm/sinyal tutarlılığı

- **Öncelik:** yüksek. **Sınıf:** Koddan kesin hesaplanan hata. **Durum:** Açık.
- **Konum:** `cardai/model.js:10–11, model.js:19–27, model.js:37; features.js:48` (başlangıç commit satırları).
- **Yeniden üretme:** Kontrol noktalarının ilk/son zamanını çıkar ve gösterilen QRS/PR ile karşılaştır.
- **Beklenen / gerçekleşen:** PVC 140, VT 180, LBBB 160, RBBB 140 ms bildiriliyor; çizilen destek aralıkları sırasıyla 195, 270, 240, 200 ms. PAT PR başlangıçlarından 123 ms, preset 175 ms. BBB PR yaklaşık 155/165 ms iken 175 yazıyor.
- **Etki:** Kaliper ve sistematik okuma yanlış sayısal öğretim üretir.
- **Kanıt:** model.js kontrol noktaları; audit-baseline.json MODEL-*.
- **Önerilen düzeltme:** Tek fidüsiyel/ölçüm tanımı kullan; dalga noktaları ve ölçümler aynı kaynaktan; PR/QRS/QT ve ST ölçüm tanımlarını belirt.
- **Kabul testi:** T08: sayısal örnekleme ile QRS başlangıç/son, P başlangıcı–QRS başlangıcı ve T sonu ölçümü gösterimle ≤2 ms uyum; ST/J işareti/genliği tüm leadlerde uyumlu; VF ölçülemez.

### PULSE-009 — VF dolaşım gösterimi

- **Öncelik:** kritik. **Sınıf:** Doğrudan gözlenen hata. **Durum:** Açık.
- **Konum:** `cardai/app.js:43–50, app.js:70–72; model.js:66` (başlangıç commit satırları).
- **Yeniden üretme:** VF seç, 700 ms sonra dolaşım parçacıklarının yerlerini karşılaştır.
- **Beklenen / gerçekleşen:** VF etkili pompa/ileri dolaşım göstermemeli. 58 parçacıktan 28 tanesi venöz/pulmoner/sistemik yolda ilerliyor; koroner parçacıkları da zamanla ilerler.
- **Etki:** Arrest ritminde etkili dolaşım varmış izlenimi ciddi öğretim hatasıdır.
- **Kanıt:** audit-baseline.json: VF-FLOW; ALS2025/VA2022.
- **Önerilen düzeltme:** VF için tüm ileri akım yollarını durdur; organize nabız/ejeksiyon yok; yalnız kaotik elektriksel etkinlik göster.
- **Kabul testi:** T09: VF tüm dolaşım ve koroner parçacıkları sabit, eject=false, etkili flow=0; elektriksel hız hesaplanamaz ve mekanik nabız yok; normal/VT gibi diğer örneklerin akışı ayrı test edilir.

### PULSE-010 — Elektrik–mekanik zamanlama

- **Öncelik:** yüksek. **Sınıf:** Kod incelemesinden çıkan doğrulanmış tutarsızlık. **Durum:** Açık.
- **Konum:** `cardai/model.js:53–66; app.js:56–64; features.js:66–69` (başlangıç commit satırları).
- **Yeniden üretme:** Hızlı ritimde R+45 ms anını ve diyastol boyunca cavity değerlerini incele; VF rehberli tur aç.
- **Beklenen / gerçekleşen:** Faz metni kapak/ejeksiyon durumuyla çelişmemeli; doluşta hacim geri gelmeli; VF rehberi organize ejeksiyon öğretmemeli. FastSnapshot 40 ms sonrası ejeksiyon derken eject 60 ms başlıyor; cavity geç döngüde 1 kalıyor; genel rehber VF’de ejeksiyon anlatıyor.
- **Etki:** Aynı anda birbiriyle çelişen sinyal, kapak, metin ve animasyon.
- **Kanıt:** model.js fastSnapshot; features.js availableGuide.
- **Önerilen düzeltme:** Ortak faz zaman çizelgesi; cavity doluşu; BBB gecikmesini açık şema varsayımı olarak tut; ritme uygun rehber ve nabız/elektriksel hız ayrımı.
- **Kabul testi:** T10: tüm13 mod/faz örneklerinde metin/kapak/eject uyumu, organize modlarda doluş/boşalma sürekliliği; VF/PAT/AF rehberinde yanlış P/ejeksiyon olayı yok; nabız klinik çıkarım gibi sunulmaz.

### PULSE-011 — SCORM kayıt doğruluğu

- **Öncelik:** kritik. **Sınıf:** Gerçek tarayıcı + API taklidinde gözlenen hata. **Durum:** Açık.
- **Konum:** `cardai/scorm.js:6, scorm.js:15–17` (başlangıç commit satırları).
- **Yeniden üretme:** LMSSetValue false, LMSGetLastError 0, LMSCommit true döndüren API ile save çağır.
- **Beklenen / gerçekleşen:** Her zorunlu Set/Commit başarısızlığı kaydı başarısız yapmalı. reportedSuccess=true; önceki passed durumu commit başarısız olsa bile ilerletilebilir.
- **Etki:** Kaybolan ilerleme ve başarı kullanıcıya kaydedilmiş görünür.
- **Kanıt:** audit-baseline.json: SCORM-SET-FALSE.
- **Önerilen düzeltme:** Her işlem dönüşü ve hata kodunu takip et; başarılı commit sonrası ledger güncelle; etkileşim hatalarını save başlangıcında unutma; kayıt denenebilir olmalı.
- **Kabul testi:** T11: Initialize/Set/Commit/Finish false/throw/hata kodu varyantları; UI doğru durum; önce başarısız sonra başarılı retry; pending durum kaybolmaz; failed save başarı gibi gösterilmez.

### PULSE-012 — Oturum bitirme

- **Öncelik:** yüksek. **Sınıf:** Gerçek tarayıcı + API taklidinde gözlenen hata. **Durum:** Açık.
- **Konum:** `cardai/app.js:123` (başlangıç commit satırları).
- **Yeniden üretme:** API LMSFinish true iken Oturumu kaydet ve bitir düğmesine bas.
- **Beklenen / gerçekleşen:** Kapanış dialogu ve geri dönüş/çıkış kontrolleri erişilebilir kalmalı. Tüm button/input/select devre dışı yapıldığı için dialogun iki kapatma düğmesi disabled.
- **Etki:** Kullanıcı dialogda kilitlenir.
- **Kanıt:** audit-baseline.json: SCORM-FINISH; finish-disabled.png.
- **Önerilen düzeltme:** Dialog/çıkış kontrollerini etkin tut; sona ermiş LMS oturumunda yeni kayıt varmış gibi davranma; açık salt inceleme/yeniden açma seçeneği.
- **Kabul testi:** T12: başarılı/başarısız Finish, Escape/kapat/geri dönüş, çift tıklama ve pagehide; tek başarılı Finish ve bitiş sonrası API yazımı yok; UI kilitlenmez.

### PULSE-013 — Güvenilmeyen kayıt/restore

- **Öncelik:** yüksek. **Sınıf:** Gerçek tarayıcı + bozuk kayıt fikstüründe gözlenen hata. **Durum:** Açık.
- **Konum:** `cardai/app.js:23–34; scorm.js:12` (başlangıç commit satırları).
- **Yeniden üretme:** suspend_data içinde currentCase/quizPage/activeLead=0.5 ve caseAnswers=[999], passed=true gönder.
- **Beklenen / gerçekleşen:** Sayfa indeksleri tamsayı, cevaplar sınır içinde, durum türetilmiş olmalı; uygulama açılmalı. text/lead okurken iki JS hatası çıktı. saved.score/passed/caseCorrect doğrulanmadan kabul ediliyor; checklist sınırsız kopyalanıyor.
- **Etki:** Çökme, sahte ilerleme ve bozuk devam verisi.
- **Kanıt:** audit-baseline.json: MALFORMED-RESTORE.
- **Önerilen düzeltme:** Dar şema/allowlist, finite integer sınırları; hesaplanabilir alanları yeniden türet; eski sürüm geçişi; tanınmayan alanları dışla. Saklanan HTML/veriyi çalıştırma.
- **Kabul testi:** T13: null,array,bozuk JSON,NaN/Infinity benzeri,kesir,negatif,büyük ID,HTML string,future version,eski v1–5; çökme/XSS yok; cevap/puan/kilitler tutarlı. İstemci kilidi güvenlik sınırı değil.

### PULSE-014 — SCORM boyut ve süre

- **Öncelik:** orta. **Sınıf:** Kod incelemesi riski; başlangıç boyutu sınır içinde. **Durum:** Açık.
- **Konum:** `cardai/scorm.js:13–15; app.js:32` (başlangıç commit satırları).
- **Yeniden üretme:** Tüm sistematik kontrolleri doldurup kaydı ölç; büyük/bozuk checklist yükle; yeni 200 havuz tasarımını düşün.
- **Beklenen / gerçekleşen:** SCORM1.2 suspend_data 4096 sınırına uyulmalı; bilinmeyen veri büyütmemeli; session_time aktif öğrenmeyi yansıtmalı. Normal en dolu başlangıç fikstürü 2688 karakter; mevcut kodda sınır kontrolü yok, keyfi checklist sınırsız. Süre landing/modal görünürlüğünü ayırmıyor.
- **Etki:** Bazı LMS kayıt reddi ve şişen süre riski; gerçek LMS hatası henüz gözlenmedi.
- **Kanıt:** edges.json: suspendMax; SCORM12.
- **Önerilen düzeltme:** Kompakt sürümlü 10+10 örneklem kaydı; boyut kontrolü, sınırı aşınca açık hata; aktif öğrenme zamanı ile izleme zamanını ayrı tanımla.
- **Kabul testi:** T14: en büyük geçerli state ≤4096 karakter/UTF8 bütçesi; truncate yok; süre HH:MM:SS.SS, artan ve görünür etkin kullanım; reload toplam/session ayrımı; eski sürüm geçişi.

### PULSE-015 — SCORM etkileşim kimlikleri

- **Öncelik:** yüksek. **Sınıf:** Kod incelemesinden kesin eksiklik. **Durum:** Açık.
- **Konum:** `cardai/scorm.js:16; features.js:61,75; app.js:120` (başlangıç commit satırları).
- **Yeniden üretme:** Bir vaka ve değerlendirme yanıtla; API yazılarını incele.
- **Beklenen / gerçekleşen:** Kalıcı soru/örneklem/oturum ID, correct_responses kaydı gerekirdi. pulse_qN yalnız sıra; correct_responses hiç yok; challenge 7/8 quiz indeksleriyle çakışabilir; örneklem desteği yok.
- **Etki:** LMS raporu gerçek madde ve doğru yanıtı ilişkilendiremez.
- **Kanıt:** scorm.js interaction; all-items.json.
- **Önerilen düzeltme:** Bölüm+session+item ID; yoğun indeks tahsisi ve _count/opsiyonel alan desteği; doğru yanıt harfi; başarısız gönderimi kuyrukta tut.
- **Kabul testi:** T15: 10+10 rastgele oturumda ID→item eşleşmesi, seçilen ve doğru yanıt, result/score; reload/yeniden denemede çakışma yok; optional interactions desteklenmiyorsa çekirdek kayıt ayrı dürüst durum.

### PULSE-016 — UI/okunabilirlik

- **Öncelik:** orta. **Sınıf:** Doğrudan geometri ve CSS karşıtlık ölçümü. **Durum:** Açık.
- **Konum:** `cardai/styles.css:46,95,100; index.html:101; styles.css:82` (başlangıç commit satırları).
- **Yeniden üretme:** 1366/1920/390 ekranları aç; AF hız seçicisi ve küçük metinleri kontrol et.
- **Beklenen / gerçekleşen:** Varsayılan120 ölçekte okunur, temel kontrol erişilebilir olmalı. AF select parentın alt sınırından başlıyor ve overflow:hidden ile kesiliyor. Mobil metrik etiketi 6px/değeri8px; bazı desktop grup etiketleri7.8px. Beyaz/primary #168db5 karşıtlığı3.81; focus #8bdfff/beyaz1.49.
- **Etki:** Özellikle küçük ekranda temel ayar/ölçüm okunamıyor; düşük karşıtlık.
- **Kanıt:** layout-1366.png, layout-1920.png, layout-390.png; edges.json afSelect.
- **Önerilen düzeltme:** Taşma kesmek yerine reflow/scroll; AF ayarını görünür grid satırına taşı; okunur font/taban ölçek; yeterli kontrast; grup başlıklarını I–II–III / aVR–aVL–aVF / V1–V6 ile hizala.
- **Kabul testi:** T16: 1366×768 ve1920×1080 normal/tam ekran;390×844/768×1024;13 kart altları erişilir; temel metin okunur; AF kontrolü gerçekten tıklanır; lead şerit hizası; metin kontrastı4.5 ve odak3.

### PULSE-017 — Marka/landing/telif

- **Öncelik:** düşük. **Sınıf:** Kod ve ekran gözlemi. **Durum:** Açık.
- **Konum:** `cardai/index.html:4,125,128; KULLANIM.md; model.js:1` (başlangıç commit satırları).
- **Yeniden üretme:** Landing, footer, help, manifest ve kullanım metnini karşılaştır.
- **Beklenen / gerçekleşen:** EGEMED PULSE ve veri kaynaklı örüntü/havuz/oturum sayıları; istenen footer birebir olmalı.50 sayıları hardcode, tüm içerik ritim diye genelleniyor; CardAI eski ad izleri; footer saklıdır. © yerine istenen saklıdır © olmalı.
- **Etki:** Yanlış kapsam ve sürüm bilgisi.
- **Kanıt:** index.html, KULLANIM.md, manifest; baseline screenshot.
- **Önerilen düzeltme:** Sayıları curriculumdan üret; ritim/iskemi/iletiyi örüntü diye adlandır; kullanıcı görünür marka/telif tutarlı; dahili eski API anahtarını migrasyon uyumu için koruyabilirsin.
- **Kabul testi:** T17: landing sayıları gerçek pool/session değerleri; büyük logo ve anlaşılır giriş; tüm ilgili yerlerde tam footer: Bu uygulama Ege Üniversitesi Tıp Fakültesi Dekanlığı tarafından geliştirilmiştir. Tüm hakları saklıdır © 2026.

### PULSE-018 — Performans/bellek

- **Öncelik:** orta. **Sınıf:** Doğrudan mikroölçüm + kod riski. **Durum:** Açık.
- **Konum:** `cardai/model.js:33–40; app.js:70–72,110` (başlangıç commit satırları).
- **Yeniden üretme:** 13 modda between sorgusunu 10sn ve36000sn zamanında 50 kez çalıştır.
- **Beklenen / gerçekleşen:** Görünür pencere sorgusu geçmişin tümünü taramamalı; kullanım uzadıkça sınırsız büyümemeli. beat dizisi45014–128611 öğeye çıkıyor; 50 sorgu yaklaşık0.05–0.17ms yerine17–55ms (ilk ensure maliyeti dahil). Her frame SVG yol uzunluğu tekrar alınıyor.
- **Etki:** Uzun oturum/seek ve restore sırasında gereksiz CPU/bellek. Gerçek bellek sızıntısı kanıtı değil.
- **Kanıt:** performance.json; model.js between filter.
- **Önerilen düzeltme:** Aralık için binary search/index; tekrar kullanılan geometriyi cachele; çizim görünürken çalışsın; 10 saat üst sınırını güvenli yönet; dinleyicileri tek kur.
- **Kabul testi:** T18: uzun seekte sonlu/kararlı model; 50 navigasyon/resize sonrası canvas/listener/RAF çoğalmaz; kısa performans ve heap eğilimi raporu; mikrobenchmark ile sızıntı iddiası kurulmaz.

### PULSE-019 — Paket/sürüm üretimi

- **Öncelik:** orta. **Sınıf:** Doğrudan dosya envanteri. **Durum:** Açık.
- **Konum:** `cardai/imsmanifest.xml:2,11; qa/build.py (arşivde yok); KULLANIM.md` (başlangıç commit satırları).
- **Yeniden üretme:** Arşiv ve HTML scriptlerini karşılaştır; üretim betiği ara.
- **Beklenen / gerçekleşen:** Tek sürümden yeniden üretilebilir HTML/SCORM ve tutarlı açıklamalar gerek. Mevcut HTML/ZIP JS/CSS aynı; yollar geçerli. Ancak kaynak üretim betiği yok, manifest/rehber50 ve beraber açılan kilitleri anlatıyor.
- **Etki:** Düzeltmeler mevcut çıktılarda sanılabilir; yeniden üretim güvence altında değil.
- **Kanıt:** PROVENANCE.md; sha256.json; başlangıç manifest yol denetimi.
- **Önerilen düzeltme:** Kaynak dosyalarından deterministik HTML inline ve SCORM ZIP üret; sürüm/build hash kaydı; manifest kökte, tüm runtime kaynakları yerel.
- **Kabul testi:** T19: build tekrarı deterministik; source/HTML/ZIP içerik hash eşleşmesi; arşiv açılarak gerçek tarayıcı testi; bağımsız file:// HTML offline; manifest yolları ve version eşleşir.

### PULSE-020 — Erişilebilirlik

- **Öncelik:** orta. **Sınıf:** Kod incelemesi ve tarayıcı gözlemi. **Durum:** Açık.
- **Konum:** `cardai/features.js:54–56,75,89; app.js:93; index.html:102` (başlangıç commit satırları).
- **Yeniden üretme:** Klavye ile kaliper tutamakları, kilitli bölümler ve vaka geri bildirimlerini kullan.
- **Beklenen / gerçekleşen:** Klavye eşdeğeri, görünen odak ve ekran okuyucu durumu olmalı. Kaliper pointer-only; vaka geribildirimi status/live değil; bölüm kilidi yalnız class/data; mobilde tamamlanma işareti CSS ile gizli.
- **Etki:** Klavye ve ekran okuyucu kullanıcıları temel durumu/ölçümü kullanamıyor.
- **Kanıt:** CSS/HTML/JS; WCAG22.
- **Önerilen düzeltme:** Kaliper klavye/numeric eşdeğer; aria-disabled ve açıklamalı kilit; soru geri bildiriminde role=status; tamamlama ve sayfa başlığı odak yönetimi; kaçış döngüsüz dialog.
- **Kabul testi:** T20: yalnız klavye ile seçim, form/lead/navigasyon/kaliper/dialog; odak görünür; canlı bölge yeni sonucu bildirir; mobilde durum anlaşılır. VoiceOver sertifikasyonu iddia edilmez.

### PULSE-021 — Kart ilerleme göstergesi

- **Öncelik:** orta. **Sınıf:** Doğrudan gözlenen eksiklik. **Durum:** Açık.
- **Konum:** `cardai/app.js:93; index.html:13–26; styles.css viewed-mark` (başlangıç commit satırları).
- **Yeniden üretme:** Bir kartı 8 saniye izle; tüm13 kart durumunu incele.
- **Beklenen / gerçekleşen:** 16 saniyede dolan halka ve bitince onay olmalı. Yalnız boş daire/check metni var, ara ilerleme yok.
- **Etki:** Öğrenen kalan süreyi kart bazında göremiyor.
- **Kanıt:** sim-1366.png; app.js progress.
- **Önerilen düzeltme:** Her kartta uygun aria değeriyle ring; süre tek state kaynağından; mobilde görünür.
- **Kabul testi:** T21:0/8/16 saniye→%0/%50/%100 ve check; diğer kartlar değişmez;13 kartta taşma/alt kesilme yok.

## Devir kapısı

Başlangıç denetimi tamamlandı;21 somut bulgu ve kabul testi tanımlandı. Öncelik: kritik PULSE-009/011, ardından yüksek durum/içerik/sinyal/SCORM grupları. Kaynak keşfi, snapshot, syntax, arşiv karşılaştırma, gerçek tarayıcı temel akış/geometri, API taklidi arıza testleri ve bütün başlangıç madde envanteri tamamlandı. Gizli sekme otomasyon davranışı ve klinik/psikometrik validasyon açık sınırlamalar olarak ayrı tutuldu.

Sol uygulamayı değiştirir; Astra eşzamanlı ürün dosyası yazmaz. Astra test altyapısı ve bağımsız kanıt/rapor üzerinde çalışabilir. Hiçbir Sol tamamlandı beyanı kabul testi sayılmaz. Düzeltme durumu ve T01–T21 sonuçları bağımsız yeniden testten sonra eklenecek.

## Ürün ailesi hizalaması (16–17 Eylül 2026, Faz 0–6)

EGEMED Ausculta ile ürün ailesi hizalaması `YONERGE_URUN_AILESI_UIUX_PLANI.md` planına göre altı fazda uygulandı. Çalışma zamanı yalnız `cardai/` içindedir; model, 400 maddelik içerik, kilit pedagojisi (13×16 sn → 10 vaka → 10 soru), 8/10 eşiği ve SCORM 1.2 şeması (sürüm 6) değiştirilmedi.

- **Faz 0:** `styles.css` aile tokenlarına geçirildi; kabul: 39 tekil hex değeri yalnız `:root` içinde, sabit px `font-size`/`border-radius` yok. Eski tokenlar köprülendi (`--text→--ink-900`, `--cyan→--blue-600`, `--radius→--r-lg`). %120 yazı ölçeği sistemi korundu (aile ölçeğine indirme kararı kullanıcı onayı bekliyor).
- **Faz 1:** Lacivert aile üst çubuğu (marka bloğu landing'e döner, ⓘ Yardım + ⓘ Hakkında), tek satır ortak footer (™, 26 px mühür, kademeli kısalma), landing'de sol silik kurum amblemi ve "Neden güvenilir?" kutuları, tam sayfa Hakkında (geliştiriciler/kurum/kanıt atfı/kaynak kartları/sınırlılıklar). Dikey taşma ve tam ekranda siyah zemin hataları giderildi; masaüstünde `html,body{height:100%;overflow:hidden}` + `main>.view` kabuk kilidi eklendi.
- **Faz 2:** Mod seçim ekranı (`#modesView`; stepper, dürüstlük şeridi, İnceleme/Uygulama/Değerlendirme kartları, kilitli kartlar görünür + nedenli + yönlendirici CTA), üç adımlı canlı öğretici (gözlem sayacına dokunmaz), header'da mod çipi + "Mod Değiştir", değerlendirmeden çıkış onayı. `state.js` `u` alanı 0–7 indekslerine genişletildi ve öğretici kalıcı bayrağı `w` biti eklendi; sürüm 6 ve 4096 bayt bütçesi korundu (en dolu durum 1561 bayt).
- **Faz 3:** Uygulama (vaka) ekranı iki sütuna geçti: sahne kartı (rozet, EKG, derivasyon chip grupları, araç çubuğu: normalles karşılaştırma ve kaliper), Olgu kartı, koyu soru kartı, gönderim sonrası ✓/✗ geri bildirim, vaka sonu kartı. Mobil sıralama ve yapışkan araç çubuğu eklendi.
- **Faz 4:** Değerlendirme ekranı mor kimlik + kural şeridi + nokta ilerlemesi + header süre sayacı; madde geri bildirimi sınavdan çıkarılıp **Sonuçlar** ekranına taşındı (özet kutuları, alan bazlı performans, zayıf alan çipleri, açılır soru raporu; vaka varyantı). Puan/`bestScore`/`passed` mantığı ve `cmi.interactions` raporu değişmedi.
- **Faz 5:** Kullanıcı kararıyla **Eğitici paneli kaldırıldı** (CSV raporu ve ilerleme sıfırlama Hakkında → Yerel veriler'e taşındı) ve **kayıt durumu göstergesi üst çubuktan kaldırıldı** (canlı bölge ve yeniden deneme yolu korundu). Durum metinleri kısaltıldı, Yardım modalı kısayol listesi güncellendi (Tab/↑↓ dahil), odak halkası 3 px `--blue-500`, `prefers-reduced-motion` tüm animasyonları kapsıyor.
- **Faz 6:** Üç boyutta (1366×768, 768×1024, 390×844) 36 ekran görüntüsü `qa/evidence/family/final/` altında; hiçbir görünümde yatay taşma yok. Paket yeniden üretildi ve hash'ler `BUILD.md`'ye yazıldı.

Aile hizalaması sonrası çalıştırılan kontroller: `qa/build.py`, `qa/sol_package_tests.py` (5/5), `sol_core` (43), `sol_followup` (11/11), `sol_ui`, `sol_scorm_edges` (8/8), `sol_state_model` (208 403 kontrol), `independent_state` (5/5), `independent_model`, `independent_content` (3/3), `independent_scorm` (16/16), `independent_e2e`, `independent_browser` (16/16), `independent_runtime` (6/6), `independent_native_visibility`, `independent_visibility_probe`, `audit_baseline`, `independent_gallery`. Bu kontroller tıbbi içerik veya klinik yeterlilik doğrulaması değildir.

Bilinçli sapmalar: vaka EKG'si sabit pencere olduğu için Uygulama/Değerlendirme araç çubuklarında Oynat/Hız/Ölçüm presetleri yok; sahne rozeti "Canlı/Duraklatıldı" yerine "Sentetik kayıt"; Ausculta'daki kilit yokluğunun aksine Pulse'un pedagojik kilidi görünür ve yönlendirici olarak korundu.

### Aile hizalaması sonrası kullanıcı kararları (17 Eylül 2026)

Kullanıcı talimatıyla kilit pedagojisi **gevşetildi**: modlar arasında gezinti serbest; mod kartları kilit rozeti göstermez, durum satırları yalnızca öneri verir (`case`/`quiz` görünümleri artık `showView` içinde düşürülmez, `state.js` çözümlemesi de görünümü geri almaz). Başarı tanımı (13/13 gözlem + 10/10 gönderim + 8/10 puan) ve LMS puanı değişmedi. Sabit %120 ölçek kaldırıldı; yazı tipografisi ürün ailesi ölçeğine geçti (14 px gövde, `--fs-*` tokenları, sabit px `font-size` yok). Kullanıcı isteğiyle **Bitir düğmesi kaldırıldı**; oturum bitirme `pagehide` üzerinde otomatik `LMSFinish` denemesiyle korunuyor (`scorm.js`). Öğrenci/validasyon isimleri kullanıcı kararıyla "Öğrenci 1–3" olarak bırakıldı.

### UI kırılma düzeltmeleri ve kapsamlı arayüz denetimi (17 Eylül 2026)

Kullanıcı bildirimiyle dört arayüz kusuru giderildi: (1) tam ekranda ana sayfaya dönüşte tıklamalar kilitleniyordu — tam ekran öğesi `#appRoot` iken landing dışarıda kaldığı için; kök değişiminde (landing↔uygulama) tam ekrandan **güvenli çıkış** eklendi (`landing.js`); (2) aynı nedenle "simülatör bazen çalışmıyor" durumu ortadan kalktı (landing'de tam ekrana girip simülatöre geçiş); (3) örüntü değişiminde EKG panelinde oluşan kayma giderildi — AF profil seçicisi kendi satırını açıp paneli 33 px aşağı itiyordu; artık üçüncü derivasyon hücresinin içinde ve satır yüksekliği sabit; (4) kısaltılmış footer'da cümle noktasız kalıyordu; 1100/860/720 px kırılımlarında noktalama CSS ile korunuyor.

Kalıcı denetim betiği `qa/ui_audit.mjs` eklendi; altı kategoride ölçüm yapar: tam ekran kök geçişleri ve tıklanabilirlik, 6 görünüm × 8 boyutta yatay taşma/footer bütünlüğü/denetim erişilebilirliği (üzerine binen katman denetimi), 13 örüntüde EKG paneli geometri kararlılığı ve panel içi taşma, diyaloglar (normal ve tam ekran), öğretici açıkken sahne erişilebilirliği, kanvas çizimi ve yeniden boyutlama. Sonuç: **0 hata**, `qa/evidence/ui-audit/report.json`.
