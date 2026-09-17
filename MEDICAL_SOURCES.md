# Tıbbi ve teknik kaynak kontrolü

Kontrol: 16 Eylül 2026. Bu dosya kaynak ve yazılım tutarlılığı incelemesidir; bağımsız klinisyen validasyonu değildir. Sentetik sinyal, basınç, debi, nabız veya hasta sonucu hesaplayan doğrulanmış fizyolojik model olarak sunulamaz. İzleme eşiği bir öğrenme akışı kuralıdır, klinik yeterlilik ölçütü değildir.

| Kimlik | Kaynak | Kullanılacak kapsam |
|---|---|---|
| AF2024 | [2024 ESC AF kılavuzu](https://academic.oup.com/eurheartj/article/45/36/3314/7738779), [ESC yayın sayfası](https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/atrial-fibrillation/) | AF: ayrık düzenli P yokluğu, düzensiz ventriküler yanıt; atriyal katkı kaybı. Her klinik AF örneğinin hızını veya nabzını tek değere indirgeme. |
| SVT2019 | [ESC SVT kılavuzu](https://academic.oup.com/eurheartj/article/41/5/655/5556821?login=false), DOI 10.1093/eurheartj/ehz467 | Dar kompleks taşikardi ayırımı, sinüs ve fokal atriyal taşikardi, flutter. Tipik karşı-saat yönlü flutterda inferior negatif, V1 pozitif F etkinliği; 2:1 örnek tüm flutter olgularını temsil etmez. Kesin SVT mekanizması tek şeritten çıkmaz. |
| VA2022 | [ESC ventriküler aritmiler kılavuzu](https://academic.oup.com/eurheartj/article/43/40/3997/6675633), DOI 10.1093/eurheartj/ehac262 | PVC erken ve tipik olarak geniş QRS, sekonder T; VT ventriküler kökenli ardışık hızlı kompleksler; VF ayrık organize QRS içermez. Geniş kompleks düzenli taşikardinin yalnız genişlikten kesin mekanizması belirlenmez. |
| ALS2025 | [2025 AHA Adult Advanced Life Support](https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support) | VF/pulssuz VT arrest bağlamı; VF modelinde etkili ejeksiyon ve düzenli nabız yok. VT'de nabız/hemodinamik durum ayrıca değerlendirilir. |
| ACS2023 | [2023 ESC ACS kılavuzu](https://academic.oup.com/eurheartj/article/44/38/3720/7243210), DOI 10.1093/eurheartj/ehad191 | İskemik belirtilerle EKG değerlendirmesi, komşu derivasyonlar, seri değerlendirme. Anterior ve inferior ST dağılımları eğitim örnekleridir; tek derivasyon, ST yüksekliği veya çizilmiş koroner bölge kesin damar/duvar hareketi tanısı sağlamaz. |
| BBB2009 | [AHA/ACCF/HRS intraventriküler ileti standardı](https://www.ahajournals.org/doi/epdf/10.1161/CIRCULATIONAHA.108.191095) | Erişkinde tam dal bloğunda geniş QRS ve derivasyona özgü morfolojiyi birlikte ele al. RBBB için sağ prekordiyal terminal R′ ve lateral terminal S; LBBB için V1 negatif, lateral geniş/çentikli R. Bu eski belge bir morfoloji standardıdır, güncel tedavi kılavuzu gibi sunulmaz. |
| ECG | [Klabunde: bipolar ekstremite derivasyonları](https://cvphysiology.com/arrhythmias/a013a) | Aynı anda I, II, III elektrot potansiyellerinden türemeli: II=I+III. Aynı potansiyellerden aVR=−(I+II)/2, aVL=I−II/2, aVF=II−I/2. |
| CYCLE | [Klabunde: kardiyak döngü](https://cvphysiology.com/heart-disease/hd002) | Elektriksel etkinlik, mekanik kasılma, basınç farkına bağlı kapaklar ve ejeksiyon ayrımı. Şematik zamanlamadan ölçülmüş hasta hemodinamisi iddia edilmez. |
| SCORM12 | [Rustici SCORM çalışma zamanı başvurusu](https://scorm.com/scorm-explained/technical-scorm/run-time/run-time-reference/) | SCORM 1.2 bölümü: API dönüş değerleri, 4096 karakter suspend_data, yazılabilir etkileşim kimlikleri/doğru yanıtları, HH:MM:SS.SS süre. Rustici uygulayıcının teknik başvurusudur. ADL özgün belgesinin bulunan aynası açılamadı. |
| WCAG22 | [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Metin karşıtlığı, klavye işlevleri, görünen odak, durum mesajları, içerik kaybetmeden yeniden ölçekleme. |

Erişim kanıtı: SVT tam metni ve ilgili flutter bölümü, AHA ALS sayfası, Klabunde sayfaları, Rustici ve W3C açıldı. AF/VA/ACS yayınların ilgili tanım bölümleri yayıncı arama sonuçlarında okundu; tam metin açılışı CDN hatası verdi. BBB PDF arama dizinindeki standardizasyon ve geniş QRS bölümleri görüldü; PDF açılışı engellendi. Bu erişim sınırlamaları tam metnin tamamı okunmuş gibi raporlanmaz.

## Öğrenme hedefleri ve kaynak eşleştirmesi

- O1: P, düzenlilik, hız, PR, QRS ve ST–T ile sistematik okuma — ECG, AF2024, SVT2019, VA2022, BBB2009, ACS2023.
- O2: Benzer örüntüleri ayrıştırma — AF2024, SVT2019, VA2022, BBB2009.
- O3: Derivasyon grupları ve hangi bölgeyi/duvarı yansıttıkları — ECG, ACS2023, BBB2009.
- O4: Elektriksel ve mekanik etkinlik ayrımı — CYCLE, ALS2025.
- O5: Klinik bağlam, EKG'nin çıkarım sınırları ve acil değerlendirme gereksinimi — AF2024, SVT2019, VA2022, ACS2023, ALS2025.
- O6: Hız, aralık ve düzen (dar/geniş QRS, normal/uzamış PR, düzenli/düzensiz ritim) ile çizilen sinyalde zaman/voltaj ölçümü — ECG, CYCLE; sayısal hedefler sentetik modelin kendi fidüsiyel noktalarından türetilir; formül türetme veya piksel/oynatma hızı sorusu yoktur.

Başlangıçtaki 100 maddenin tek tek envanteri ve hedef/kaynak incelemesi `qa/evidence/baseline/item-review.json` içindedir. Hedef ve kaynaklar başlangıç ürününde mevcut değildir; bunlar denetçinin eşleştirmesidir. 200+200 düzeltme havuzunda her madde kalıcı kimlik, örüntü, kaynak kimlikleri, öğrenme hedefi, tek doğru yanıt ve her seçeneğe özgü gerekçe taşımalıdır. Kaynak bağlantısı tek başına madde geçerliği kanıtı değildir.

## Uzman incelemesi gereken alanlar

13×12 sentetik morfolojinin klinik tipikliği; örneklerin öğretim düzeyine uygunluğu; 400 maddenin içerik/psikometrik geçerliği ve çeldirici işlevi; MI ve dal bloğunda şematik mekanik anlatım. Kod testleri bunların bağımsız klinisyen onayının yerini tutmaz.
