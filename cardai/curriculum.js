/* Authored bounded synthetic scenarios. No patient records, no clinical validation claim.
   Each row supplies different evidence / a different interpretation task. Reused option
   banks are editorial option sets, not demographic story generators. */
(function(root){'use strict';
const banks={};
function bank(id,objective,rows){banks[id]={objective,options:rows.map(r=>r[0]),explanations:rows.map(r=>r[1])};}
bank('sinus','O2',[
['Normal sinüs örüntüsü','Düzenli dar QRS, uygun P ekseni ve sabit P–QRS ilişkisi sinüs örüntüsünü destekler.'],
['Atriyal fibrilasyon örüntüsü','AF için ayrık sinüs P yerine düzensiz atriyal etkinlik ve düzensiz R–R beklenir.'],
['Sabit2:1 atriyal flutter','Flutterda yaklaşık300/dk sürekli F etkinliği ve2:1 ventriküler yanıt beklenir.'],
['Fokal atriyal taşikardi','Fokal AT’de sinüs P’sinden farklı atriyal morfoloji ve artmış atriyal hız beklenir.'],
['AV düğüm bağımlı taşikardi olasılığı','Bu olasılık hızlı düzenli dar taşikardide düşünülebilir; normal hızdaki sinüs P ilişkisinin açıklaması değildir.']]);
bank('af','O2',[
['Atriyal fibrilasyon örüntüsü','Ayrık tutarlı P yokluğu ile düzensiz düzensiz R–R birlikte AF’yi destekler.'],
['Sinüs aritmisi örüntüsü','Sinüs aritmisinde her QRS öncesindeki sinüs P ilişkisi korunur; burada korunmamıştır.'],
['Sabit2:1 atriyal flutter','Sabit2:1 flutter örneği düzenli ventriküler aralık ve düzenli F etkinliği gerektirir.'],
['Sık ventriküler erken atımlar','PVC açıklaması erken geniş farklı kompleks gerektirir; düzensiz dar komplekslerin tamamını açıklamaz.'],
['Fokal atriyal taşikardi','Düzenli ayrık ektopik P dizisi fokal AT’yi destekler; kaotik atriyal tabanla uyuşmaz.']]);
bank('svt','O2',[
['Mekanizması belirlenemeyen düzenli dar kompleks taşikardi','Hızlı düzenli dar QRS vardır; görünmeyen P tek başına AVNRT ile AVRT’yi ayıramaz.'],
['Sinüs taşikardisi için yeterli sinüs P kanıtı','Sinüs taşikardisi için QRS öncesinde uygun ayrık P ilişkisi aranır; bu kanıt verilmemiştir.'],
['Fokal AT için yeterli ektopik P kanıtı','Fokal AT SVT grubundadır; ancak alt tip tanısı için ayrık ektopik P kanıtı burada yoktur.'],
['Atriyal fibrilasyon için yeterli düzensizlik','AF’nin düzensiz düzensiz ventriküler yanıtı bu düzenli örnekte bulunmaz.'],
['Monomorfik VT için yeterli geniş kompleks kanıtı','VT değerlendirmesinde geniş kompleks ve ek ventriküler kanıt aranır; bu kayıt dardır.']]);
bank('at','O2',[
['Fokal atriyal taşikardiyle uyumlu örüntü','Düzenli dar taşikardide ayrık, sinüs dışı morfolojili P ve sabit P–QRS ilişkisi fokal AT’yi destekler.'],
['Sinüs taşikardisiyle uyumlu örüntü','Sinüs taşikardisinde sinüs P ekseni korunur; inferior ters P bu iddiayı zayıflatır.'],
['Tipik2:1 flutter ile uyumlu örüntü','Flutterda sürekli F dizisi beklenir; ayrık P arasındaki izoelektrik taban bununla uyuşmaz.'],
['AF ile uyumlu örüntü','AF düzenli ayrık ektopik P dizisi oluşturmaz; R–R düzensizliği beklenir.'],
['PVC dizisiyle uyumlu örüntü','PVC erken geniş ventriküler komplekstir; sürekli dar P–QRS dizisini açıklamaz.']]);
bank('flutter','O2',[
['Sabit2:1 atriyal flutter örüntüsü','Düzenli300/dk F etkinliği ve150/dk ventriküler yanıt2:1 flutter örneğine uyar.'],
['Fokal atriyal taşikardi örüntüsü','Fokal AT’de ayrık ektopik P ve arada izoelektrik hat beklenebilir; sürekli F tabanı farklıdır.'],
['Atriyal fibrilasyon örüntüsü','AF’de atriyal etkinlik düzensizdir; düzenli F dizisi ve sabit iletim bu açıklamayı desteklemez.'],
['Sinüs taşikardisi örüntüsü','Sinüs P–QRS dizisi sürekli iki F dalgası başına bir QRS ilişkisini açıklamaz.'],
['Ventriküler erken atım örüntüsü','Erken geniş kompleks bulunmadan düzenli F etkinliği PVC diye sınıflanamaz.']]);
bank('tach','O2',[
['Sinüs taşikardisi örüntüsü','Uygun sinüs P, sabit PR ve hızlı düzenli dar kompleksler sinüs taşikardisini destekler.'],
['P’si gösterilmemiş AVNRT/AVRT olasılığı','AVNRT/AVRT olasılığı hızla tek başına kanıtlanmaz; burada ayrık sinüs P ilişkisi vardır.'],
['Fokal atriyal taşikardi örüntüsü','Fokal AT için sinüs dışı P morfolojisi aranır; bu örnekte sinüs P ekseni korunur.'],
['Sabit2:1 flutter örüntüsü','İki F dalgası başına bir QRS ve sürekli atriyal taban burada bulunmaz.'],
['Atriyal fibrilasyon örüntüsü','AF’de sabit ayrık sinüs P ve düzenli R–R dizisi beklenmez.']]);
bank('pvc','O2',[
['Ventriküler erken atımla uyumlu örüntü','Beklenenden erken, geniş farklı QRS ve ilişkili öncül P yokluğu PVC’yi destekler.'],
['Normal zamanında sinüs atımı','Sinüs atımı beklenen zamanda ve önceki sinüs atımlarıyla benzer P–QRS dizisinde olmalıdır.'],
['Sabit dal bloğunda sinüs atımı','Sabit BBB tüm uygun atımlarda geniş ileti morfolojisi oluşturur; tek erken farklı kompleksle eş değildir.'],
['Tek başına atriyal fibrilasyon','AF tüm R–R dizisinde düzensizlik ve ayrık P yokluğu yapar; izole erken geniş kompleksi açıklamaz.'],
['Sabit2:1 flutter atımı','Flutter açıklaması düzenli F dizisi gerektirir; sinüs tabanındaki tek erken komplekse uymaz.']]);
bank('vt','O2',[
['VT olarak öncelikle değerlendirilmesi gereken geniş taşikardi','Hızlı düzenli geniş taşikardi, özellikle ek ventriküler kanıtla VT kuşkusu doğurur; klinik doğrulama gerekir.'],
['Normal sinüs örüntüsü','Normal sinüs hızı ve dar QRS bu hızlı geniş örneğin özellikleri değildir.'],
['Dar kompleks sinüs taşikardisi','Sinüs taşikardisi etiketi bu geniş QRS ve ventriküler kanıtı yeterince açıklamaz.'],
['Kaotik VF örüntüsü','VF’de düzenli seçilebilir tek biçimli QRS yoktur; bu kayıtta organize geniş kompleks vardır.'],
['İzole ventriküler erken atım','PVC tek erken komplekstir; ardışık hızlı geniş kompleks dizisi farklı bir örüntüdür.']]);
bank('vf','O2',[
['Ventriküler fibrilasyonla uyumlu elektriksel örüntü','Kaotik değişken etkinlik içinde ayrık organize QRS seçilemiyorsa VF örüntüsü düşünülür.'],
['Monomorfik ventriküler taşikardi','Monomorfik VT’de düzenli tek biçimli organize geniş kompleksler seçilebilir.'],
['Atriyal fibrilasyon','AF’de atriyal düzensizliğe rağmen ventriküler QRS kompleksleri genellikle seçilebilir.'],
['Atriyal flutter','Flutter düzenli atriyal F etkinliği ile seçilebilir ventriküler kompleksler gösterir.'],
['Asistoli benzeri düz taban','Asistoli düz veya çok düşük etkinlikli tabandır; bu kayıttaki belirgin kaotik dalgaları açıklamaz.']]);
bank('lbbb','O2',[
['Sol dal bloğuyla uyumlu ileti örüntüsü','Geniş QRS, V1 negatif kompleks ve lateral geniş çentikli R birlikte LBBB’yi destekler.'],
['Sağ dal bloğuyla uyumlu ileti örüntüsü','RBBB’de sağ prekordiyal terminal R′ ve lateral terminal S beklenir; burada ters dağılım vardır.'],
['Normal dar kompleks ileti','Normal80ms QRS bu160ms geniş ve derivasyona özgü morfolojiyi açıklamaz.'],
['İzole PVC örüntüsü','PVC erken farklı komplekstir; her sinüs atımında sabit geniş morfoloji PVC lehine değildir.'],
['VF ile uyumlu etkinlik','VF’de düzenli ayrık P–QRS dizisi ve tekrarlayan lateral R morfolojisi bulunmaz.']]);
bank('rbbb','O2',[
['Sağ dal bloğuyla uyumlu ileti örüntüsü','Geniş QRS, V1 terminal R′ ve lateral geniş terminal S birlikte RBBB’yi destekler.'],
['Sol dal bloğuyla uyumlu ileti örüntüsü','LBBB’de V1 çoğunlukla negatif ve lateral geniş R vardır; sağ terminal R′ dağılımı farklıdır.'],
['Normal dar kompleks ileti','140ms genişliği ile sağ ve lateral terminal morfoloji normal80ms iletiye uymaz.'],
['İzole PVC örüntüsü','Tüm sinüs atımlarındaki aynı terminal ileti gecikmesi, tek erken ventriküler atımdan ayrılır.'],
['Atriyal flutter örüntüsü','Flutter atriyal F etkinliğiyle tanımlanır; terminal QRS yönü tek başına flutter kanıtı değildir.']]);
bank('anterior','O3',[
['Anterior prekordiyal ST dağılımı','V1–V4 komşu prekordiyallerindeki yükselme anterior dağılımdır; semptomlar ayrıca değerlendirilir.'],
['İnferior ekstremite ST dağılımı','İnferior dağılımda II,III,aVF’de birlikte yükselme aranır; verilen başlıca değişimler prekordiyaldir.'],
['Sağ dal bloğunun terminal ileti dağılımı','RBBB terminal QRS morfolojisidir; komşu prekordiyal ST yükselmesinin eş anlamlısı değildir.'],
['Atriyal flutter taban dağılımı','Flutter F etkinliği atriyal tabanı değiştirir; bu örnekte düzenli P ve bölgesel ST platosu vardır.'],
['İzole erken ventriküler atım dağılımı','PVC erken geniş kompleks gerektirir; düzenli dar komplekslerin bölgesel ST değişimini açıklamaz.']]);
bank('inferior','O3',[
['İnferior ST yükselmesi ve lateral karşılıklı çökme','II,III,aVF yükselmesi ile I,aVL çökmesi birlikte inferior dağılımı destekler.'],
['Anterior baskın prekordiyal yükselme','Anterior dağılım V1–V4’te baskın yükselmedir; verilen baskın grup ekstremite inferior grubudur.'],
['Tam RBBB terminal morfolojisi','Sağ terminal R′ ve geniş QRS olmadan ST dağılımı RBBB diye açıklanamaz.'],
['Tipik2:1 flutter tabanı','Sürekli F etkinliği olmadan komşu ST platosu flutter olarak adlandırılamaz.'],
['Normal izoelektrik ST örüntüsü','Inferior pozitif ve lateral negatif ST değerleri izoelektrik örüntüyle uyuşmaz.']]);
bank('pulse','O4',[
['Mekanik nabız ayrıca klinik olarak değerlendirilir','EKG elektriksel etkinliği gösterir; seçilebilir QRS klinik nabzın varlığını kanıtlamaz.'],
['Elektriksel hız klinik nabızla birebir aynıdır','Nabız açığı veya etkisiz mekanik atımlar olabilir; birebir eşitlik EKG’den çıkarılamaz.'],
['QRS genişliği nabız basıncını belirler','Genişlik aktivasyon süresidir; arter basıncı veya nabız basıncı ölçümü değildir.'],
['T genliği atım hacmini doğrudan verir','T genliği repolarizasyon voltajıdır; atım hacmi için kalibre edilmiş ölçüm değildir.'],
['PR süresi mekanik debiyi doğrudan verir','PR atriyoventriküler elektriksel iletim ölçüsüdür; debi hesabına tek başına dönüştürülemez.']]);
bank('vfFlow','O4',[
['Etkili ileri akım ve organize ejeksiyon yok','VF’nin kaotik ventriküler etkinliği etkili pompa oluşturmaz; tüm ileri akım parçacıkları durur.'],
['Düzenli düşük hacimli ejeksiyon sürer','Düşük ama organize ejeksiyon çizmek VF’de etkili pompa olduğu izlenimini verir ve yanlıştır.'],
['Yalnız koroner ileri akım korunur','Modelde VF için koroner parçacıkları da durur; etkili dolaşım ayrıca kanıtlanmış değildir.'],
['Yalnız pulmoner ileri akım korunur','Organize sağ ventrikül ejeksiyonu olmadan pulmoner ileri akım korunmuş gibi gösterilemez.'],
['Kaotik elektriksel dalga düzenli nabız üretir','Kaotik elektriksel etkinlik düzenli mekanik nabızla eşleştirilemez.']]);
bank('vfRate','O6',[
['Organize QRS hızı hesaplanamaz','R–R tanımı ayrık tekrarlayan QRS gerektirir; VF’de böyle bir seri yoktur.'],
['Dalga tepe sayısı ventriküler atım hızıdır','VF dalga tepeleri organize ventriküler atımlar değildir; tepeleri saymak atım hızını vermez.'],
['Atriyal F hızı300/dk olarak alınır','F dalgası düzenli flutter etkinliğidir; VF’nin kaotik ventriküler sinyalini tanımlamaz.'],
['Son sinüs R–R değeri hâlâ geçerlidir','Ritim değiştiğinde önceki sinüs R–R yeni VF için hız ölçüsü olarak kullanılamaz.'],
['Simülasyon oynatma çarpanı klinik hızı verir','Oynatma çarpanı ekran zamanını değiştirir; ölçülemeyen VF hızını klinik değere dönüştürmez.']]);
bank('mechanic','O4',[
['Tüm kapaklar kapalı; izovolümetrik kasılma','QRS sonrası basıncın yükseldiği erken sistolde AV kapaklar kapanır, çıkışlar henüz açılmaz; ejeksiyon başlamaz.'],
['Çıkış kapakları açık; ventriküler ejeksiyon','Çıkışlar açıldığında ejeksiyon evresidir; verilen erken anda çıkışlar kapalı ve basınç yükselmektedir.'],
['AV kapaklar açık; pasif ventriküler doluş','Pasif doluşta AV giriş açıktır; verilen kasılma başlangıcında AV kapaklar kapalıdır.'],
['Tüm kapaklar kapalı; izovolümetrik gevşeme','Gevşeme ejeksiyon sonrasındaki basınç düşüşüdür; QRS sonrası erken basınç yükselişiyle aynı faz değildir.'],
['AV kapaklar açık; atriyal sistol','Atriyal sistol doluşun sonunda açık AV girişine katkı yapar; kapalı AV erken ventriküler kasılma değildir.']]);bank('fill','O4',[
['AV kapaklar açık; ventriküler doluş','Diyastolik girişte AV kapaklar açık, semilüner çıkışlar kapalıdır; ventrikül hacmi geri kazanılır.'],
['Çıkış kapakları açık; ventriküler ejeksiyon','Bu düzen ventrikülden ileri çıkıştır; verilen açık AV girişli doluş fazını tanımlamaz.'],
['Tüm kapaklar kapalı; izovolümetrik kasılma','Kapalı AV erken kasılmada hacim sabittir; açık AV ve artan doluş hacmiyle uyuşmaz.'],
['Tüm kapaklar kapalı; izovolümetrik gevşeme','Gevşeme sonunda AV açılmadan hacim değişmez; verilen aktif giriş bu fazdan sonradır.'],
['AV kapaklar kapalı; yalnız atriyal sistol','Atriyal kasılmanın ventrikül doluşuna katkısı açık AV girişini gerektirir; kapalı AV düzeni verilen doluş değildir.']]);bank('eject','O4',[
['Çıkış kapakları açık; ventriküler ejeksiyon','Ventrikül basıncı çıkış basıncını aşınca semilüner kapaklar açılır; AV kapaklar kapalı kalır.'],
['AV kapaklar açık; pasif ventriküler doluş','AV açık ve çıkış kapalı düzeni ventriküle giriş fazıdır; verilen ileri çıkış fazı değildir.'],
['Tüm kapaklar kapalı; izovolümetrik kasılma','Kasılma başlangıcında çıkış henüz kapalıdır; verilen açık semilüner kapakla farklıdır.'],
['Tüm kapaklar kapalı; izovolümetrik gevşeme','Ejeksiyon bittikten sonra çıkış kapanır; verilen açık çıkış ve ileri akım bu evreye uymaz.'],
['AV kapaklar açık; atriyal sistol','Atriyal sistol açık AV üzerinden doluşa katkıdır; kapalı AV ve açık çıkışlı ventriküler ejeksiyon değildir.']]);bank('p','O1',[
['P: atriyal depolarizasyon','P atriyal elektriksel aktivasyondur; mekanik atriyal yanıt kısa gecikmeyle izler.'],
['P: atriyal repolarizasyon','Atriyal repolarizasyon ayrı düşük genlikli etkinliktir; çoğu kez QRS ile örtüşür, P değildir.'],
['P: ventriküler depolarizasyon','Ventriküler depolarizasyon QRS ile kaydedilir; P ayrık atriyal etkinliktir.'],
['P: ventriküler repolarizasyon','Ventriküler repolarizasyon T ile değerlendirilir; P’nin atriyal kaynağından farklıdır.'],
['P: yalnız AV düğüm içi iletim','AV düğüm içi gecikme PR bağlamında değerlendirilir; P’nin görünen kitlesel kaynağı atriyal depolarizasyondur.']]);bank('qrs','O1',[
['QRS: ventriküler depolarizasyon','QRS ventriküler kitlenin elektriksel aktivasyonudur; mekanik ejeksiyon daha sonra başlayabilir.'],
['QRS: atriyal depolarizasyon','Ayrık atriyal depolarizasyon P ile değerlendirilir; QRS’nin baskın kaynağı ventriküler kitledir.'],
['QRS: ventriküler repolarizasyon','Ventriküler repolarizasyon esas olarak T dalgasıyla değerlendirilir; QRS depolarizasyondur.'],
['QRS: yalnız atriyal repolarizasyon','Atriyal repolarizasyon QRS altında örtüşebilir, fakat toplam QRS’nin baskın ventriküler aktivasyon tanımının yerine geçmez.'],
['QRS: yalnız AV düğüm gecikmesi','AV düğüm gecikmesi ventrikül aktivasyonundan önceki PR bağlamındadır; QRS’nin genişliği kitlesel ventriküler aktivasyondur.']]);bank('t','O1',[
['T: ventriküler repolarizasyon','T ventriküler elektriksel repolarizasyondur; mekanik gevşeme ve ejeksiyon zamanlarıyla birebir eş değildir.'],
['T: atriyal repolarizasyon','Atriyal repolarizasyon genellikle QRS altında örtüşür; görünen T’nin ana kaynağı ventrikülerdir.'],
['T: ventriküler depolarizasyon','Ventriküler depolarizasyon QRS’nin başlangıç ve destek aralığıyla tanımlanır; T sonraki repolarizasyondur.'],
['T: sonraki atriyal depolarizasyon','Sonraki atriyal depolarizasyon yeni P etkinliğidir; aynı kompleksin T desteğiyle karıştırılmaz.'],
['T: gecikmiş terminal sağ ventrikül depolarizasyonu','RBBB’de terminal sağ aktivasyon QRS içindeki R′/S bileşenidir; sonrasında görülen T farklı elektriksel olaydır.']]);bank('pr','O6',[
['P başlangıcından QRS başlangıcına ölçülür','PR aralığı P’nin ilk sapması ile QRS’nin ilk sapması arasındadır; yalnız sessiz PR segmenti değildir.'],
['P tepesinden R tepesine ölçülür','Tepe–tepe süresi PR tanımından iki dalganın başlangıçlarını çıkarır ve farklı ölçüm verir.'],
['P sonundan QRS sonuna ölçülür','Bu sınırlar PR segmentiyle QRS süresini karıştırır; standart PR aralığı değildir.'],
['QRS sonundan T sonuna ölçülür','QRS sonu–T sonu ventriküler repolarizasyon bölgesini kapsar; PR değildir.'],
['Bir R tepesinden sonraki R’ye ölçülür','R–R döngü aralığıdır; atriyoventriküler PR aralığından farklıdır.']]);
bank('prNone','O6',[
['Ayrık ilişkili P olmadığı için PR ölçülemez','PR için tanımlanabilir P başlangıcı ve ilişkili QRS başlangıcı gerekir; bu önkoşul burada yoktur.'],
['Son görülen T başlangıcı P yerine kullanılır','T ventriküler repolarizasyondur; atriyal P başlangıcının yerine konamaz.'],
['Her taban dalgası aynı P kabul edilir','Düzensiz f veya sürekli F etkinliği ayrık ilişkili P gibi seçilerek PR üretilemez.'],
['R–R değeri PR olarak kaydedilir','R–R ventriküler döngü süresidir; P başlangıcı yokluğunu gidermez.'],
['Varsayılan175ms her kayda atanır','Bir öğretim presetinin başka ritimlerde uygulanması ölçülmüş PR varmış izlenimi verir.']]);
bank('duration','O6',[
['QRS ilk sapmadan son dönüşe ölçülür','QRS destek aralığı ventriküler depolarizasyonun ilk ve son sınırıdır; R tepe genişliği yeterli değildir.'],
['Yalnız R tepesinin çevresi ölçülür','R tepesinin dar çevresi Q,S veya terminal R′/S bileşenlerini dışlar ve toplam QRS’yi küçültür.'],
['P başlangıcından QRS sonuna ölçülür','Bu sınırlar PR ve QRS’yi birlikte içerir; QRS süresi tek başına değildir.'],
['J noktasından T sonuna ölçülür','J–T repolarizasyon bölümüdür; QRS başlangıcı–sonu süresini ölçmez.'],
['T tepeleri arası süre ölçülür','T–T ritim düzenliliği hakkında bilgi verebilir; kompleks aktivasyon süresi değildir.']]);
bank('qt','O6',[
['QRS başlangıcından T sonuna ölçülür','QT ventriküler depolarizasyon ve repolarizasyonu kapsar; sentetik değer kalp hızına göre klinik QTc değildir.'],
['R tepesinden T tepesine ölçülür','Tepe–tepe aralığı QRS başlangıcı ile T sonunu dışlar; toplam QT değildir.'],
['P başlangıcından T başlangıcına ölçülür','Bu aralık atriyal ve ventriküler sınırları karıştırır; QT’nin standart sınırları değildir.'],
['QRS sonundan T başlangıcına ölçülür','Bu çoğunlukla ST segmentini tanımlar; QRS ve T desteğinin tamamını kapsamaz.'],
['İki QRS başlangıcı arası ölçülür','Bu ventriküler döngü aralığıdır; bir kompleksin depolarizasyon/repolarizasyon süresi değildir.']]);
bank('st','O6',[
['J sonrası ST voltajı uygun tabana göre ölçülür','Model J+20ms değerini mV olarak verir; klinik taban ve komşu derivasyon değerlendirmesi ayrıca gerekir.'],
['R tepe voltajı ST yüksekliği kabul edilir','R ventriküler depolarizasyon genliğidir; J sonrası ST düzeyiyle eş değildir.'],
['P tepe voltajı ST yüksekliği kabul edilir','P atriyal depolarizasyondur; ST’nin ölçüm konumu ve tabanı farklıdır.'],
['R–R süresi ST yüksekliği kabul edilir','R–R milisaniye birimlidir; ST yüksekliği voltaj farkı olarak mV ile ifade edilir.'],
['T tepe konumu J noktası kabul edilir','J QRS’nin sonudur; T tepesi daha sonraki repolarizasyon olayıdır.']]);
bank('speed','O6',[
['Ekran oynatması değişir; modelin zaman ölçütü değişmez','2× ekran akışını hızlandırır; gerçek16s izleme ve sinyalin saniye/mV tanımları korunur.'],
['Gerçek16s izleme8s’ye iner','Öğretim izleme eşiği monotonic gerçek zamandır; oynatma çarpanı bu eşiği kısaltmaz.'],
['PR ve QRS metadatası ikiye katlanır','Elektriksel destek süreleri modelin kendi saniye koordinatlarındadır; oynatma bunları yeniden tanımlamaz.'],
['QRS voltajı oynatma hızıyla ikiye katlanır','Hız çarpanı zaman akışına uygulanır; mV genliğini çarpmaz.'],
['Oynatma hızı hastanın nabzı diye raporlanır','Arayüz hızı klinik nabız değildir; mekanik nabız ayrıca değerlendirilmelidir.']]);
bank('limb','O3',[
['II=I+III aynı anda sağlanır','Bipolar ekstremite derivasyonları aynı elektrot potansiyellerinin farklarından oluşur; Einthoven ilişkisi geçerlidir.'],
['II=I−III aynı anda sağlanır','İşaret burada ters çevrilmiştir; doğru yeniden düzenleme III=II−I’dir.'],
['II=−I−III aynı anda sağlanır','Bu toplamın polaritesini ters çevirir; standart elektrot yönleriyle uyuşmaz.'],
['II=(I+III)/2 aynı anda sağlanır','Bipolar II için ortalama değil toplam gerekir; yarıya bölmek voltajı yanlış küçültür.'],
['II ve I ve III bağımsız voltajlardır','Aynı üç ekstremite elektrodundan gelen bu derivasyonlar bağımsız rastgele sinyaller değildir.']]);
bank('avr','O3',[
['aVR=−(I+II)/2','Sağ kol potansiyeli diğer iki ekstremitenin ortalamasına karşı ölçülür; I,II dönüşümü negatif yarım toplamdır.'],
['aVR=(I+II)/2','Sağ kol referans yönü için gereken eksi işareti kaybolmuştur.'],
['aVR=I−II/2','Bu ifade aVL içindir; sağ kol aVR yerine sol kol yönünü verir.'],
['aVR=II−I/2','Bu ifade aVF içindir; sağ kol yerine inferior artırılmış yönü verir.'],
['aVR=II−I','Bu bipolar III ifadesidir; artırılmış aVR değildir.']]);
bank('avl','O3',[
['aVL=I−II/2','Sol kol artırılmış potansiyeli I eksi II’nin yarısıyla ifade edilir.'],
['aVL=II−I/2','Bu artırılmış inferior aVF ifadesidir; sol kol aVL değildir.'],
['aVL=−(I+II)/2','Bu artırılmış sağ kol aVR ifadesidir; sol kol yönünü ters bir referansla karıştırır.'],
['aVL=II−I','Bu bipolar III ifadesidir; artırılmış sol kol potansiyeli değildir.'],
['aVL=(I+II)/2','Pozitif yarım toplam standart aVL dönüşümü değildir; hem katsayı hem yön hatası vardır.']]);
bank('avf','O3',[
['aVF=II−I/2','Artırılmış inferior potansiyel II eksi I’nin yarısıyla ifade edilir.'],
['aVF=I−II/2','Bu aVL ifadesidir; inferior yön yerine sol kol artırılmış potansiyelini verir.'],
['aVF=−(I+II)/2','Bu aVR ifadesidir; inferior derivasyonu sağ kol yönüyle karıştırır.'],
['aVF=II−I','Bu bipolar III ifadesidir; artırılmış inferior referansla aynı değildir.'],
['aVF=(I+II)/2','Bu katsayılar standart aVF dönüşümünü karşılamaz; I bileşeninin işareti yanlıştır.']]);
bank('afAtrial','O4',[
['Organize atriyal kasılma katkısı kaybolur','AF’de organize ayrık atriyal depolarizasyon/kasılma yoktur; pasif ventriküler doluş yine sürebilir.'],
['Her f dalgası güçlü bir atriyal kasılmadır','Düzensiz f etkinliği koordineli atriyal mekanik kasılmalar dizisi gibi yorumlanamaz.'],
['Ventriküler doluş bütünüyle durur','Atriyal katkı kaybı pasif doluşun tamamen kaybolması değildir; AV ve diyastol koşulları önemlidir.'],
['Sinüs düğümünün düzenli P dizisi korunur','Bu AF örneğinde ayrık sinüs P dizisi yoktur; düzenli P varsayımı verilen sinyalle çelişir.'],
['Her QRS etkili arter nabzını kanıtlar','Ventriküler elektriksel aktivasyon mekanik perfüzyonun klinik kanıtı değildir.']]);
bank('afRR','O1',[
['Birden fazla ardışık R–R birlikte incelenir','AF hız ve düzensizlik değerlendirmesinde tek aralık yerine yeterli süre boyunca birden çok kompleks değerlendirilir.'],
['En kısa R–R tüm ritmin ortalamasıdır','En kısa aralık anlık en yüksek hızdır; değişken döngülerin ortalaması değildir.'],
['En uzun R–R tüm ritmin ortalamasıdır','En uzun aralık anlık en düşük hızdır; tüm örneğin ortalama hızını temsil etmez.'],
['f dalga tepeleri ventrikül atımı sayılır','Atriyal f dalgaları ventriküler QRS değildir; ventriküler hız için QRS sayılır.'],
['Önceki sinüs hızı yeni AF hızı kabul edilir','Ritim değişikliği sonrası hız yeni gözlenen QRS dizisinden değerlendirilmelidir.']]);
bank('afRisk','O5',[
['Tromboemboli riski klinik risk verileriyle değerlendirilir','AF’de risk değerlendirmesi yaş,komorbidite ve kılavuz kapsamlı klinik veriler gerektirir; şerit puan hesaplamaz.'],
['Risk yalnız atriyal f frekansından derecelenir','Atriyal elektriksel frekans klinik risk verilerinin yerine geçmez; komorbidite ve ilgili klinik değerlendirme gerekir.'],
['Dar QRS tromboemboli riskini dışlar','QRS genişliği atriyal staz veya klinik tromboemboli riskini tek başına dışlamaz.'],
['Kontrollü hız bütün AF risklerini ortadan kaldırır','Ventrikül hız kontrolü tromboemboli değerlendirmesini gereksiz kılmaz.'],
['Tek kısa şerit AF süresini kesin bildirir','Kısa örnek başlangıç zamanını veya toplam AF yükünü belirlemez.']]);
bank('pvcPause','O1',[
['Erken aralıkla duraklama toplamı iki temel döngüdür','Bu sentetik PVC dizisinde480+1120=1600ms, iki800ms sinüs döngüsüne eşittir.'],
['Yalnız erken480ms temel döngü kabul edilir','Erken kompleksin kısa aralığı temel sinüs hızını tanımlamaz; önceki800ms dizisi dikkate alınır.'],
['Yalnız1120ms bütün ritmin döngüsüdür','Duraklama postektopik aralıktır; düzenli temel sinüs döngüsünün yerine konamaz.'],
['Toplam1600ms bir atriyal PR aralığıdır','Bu iki ventriküler döngünün toplamıdır; P başlangıcı–QRS başlangıcı PR ölçümü değildir.'],
['Her PVC mutlaka bu duraklamayı oluşturur','Kompansatuvar duraklama bu örnekte verilmiştir; bütün PVC olgularına zorunlu genellenemez.']]);
bank('pvcT','O1',[
['Geniş erken QRS sonrası sekonder diskordan T','Bu örnekte ventriküler aktivasyon yolu değiştiğinden sonraki repolarizasyon yönü ana QRS’ye karşıttır.'],
['Her diskordan T kesin akut oklüzyondur','Geniş kompleks sonrası sekonder repolarizasyon olabilir; tek başına akut oklüzyon tanısı koydurmaz.'],
['T değişimi yeni atriyal P dizisidir','T ventriküler repolarizasyondur; atriyal P etkinliğine yeniden adlandırılamaz.'],
['Sekonder T değişimi ayrı bir atriyal taşikardi kanıtıdır','Geniş erken ventriküler aktivasyon sonrası T değişimi repolarizasyondur; bağımsız atriyal kaynak kanıtı değildir.'],
['Repolarizasyon yönü nabız yönünü gösterir','EKG polaritesi mekanik kan akım yönünün kaydı değildir.']]);
bank('bbbLimits','O5',[
['Önceki EKG ve klinik bağlamla yorumlanır','Dal bloğu ileti örüntüsüdür; yeni/eski oluşu ve iskemi kuşkusu semptomlar,seri EKG ve ek verilerle değerlendirilir.'],
['Dal bloğu tek başına kesin akut MI’dır','BBB tek başına akut MI veya koroner oklüzyon etiyolojisini kesinleştirmez.'],
['Dal bloğu tek başına güvenli eve dönüş ölçütüdür','Klinik belirtiler,yapısal hastalık ve değişimin süresi değerlendirilmeden güvenlik sonucu çıkarılamaz.'],
['Dal bloğu tüm atımlarda nabızsızlık demektir','Gecikmiş elektriksel ileti her atımın mekanik olarak etkisiz olduğunu kanıtlamaz.'],
['Dal bloğu kesin hangi ilaç gerektiğini gösterir','İleti örüntüsü klinik neden ve tedavi kararının yerine geçmez.']]);
bank('lMorph','O3',[
['V1 negatif, lateral geniş çentikli R','LBBB örneğinde sağ prekordiyal QS/rS ve I,aVL,V5,V6’da geniş çentikli R birlikte değerlendirilir.'],
['V1 terminal R′, lateral terminal S','Bu dağılım RBBB için tipiktir; verilen LBBB örneğinin karşıt terminal yönüdür.'],
['Tüm derivasyonlarda aynı QRS polaritesi','Derivasyon yönleri farklıdır; aynı polarite varsayımı sağ/lateral morfolojiyi siler.'],
['İnferior sürekli F, her iki F’ye QRS','Bu atriyal flutter iletim ilişkisi olup LBBB’nin terminal ventriküler morfolojisi değildir.'],
['Organize QRS yok, kaotik taban var','Bu VF örüntüsüdür; BBB’de düzenli organize geniş QRS kalır.']]);
bank('rMorph','O3',[
['V1 terminal R′, lateral geniş terminal S','RBBB örneğinde geç sağ aktivasyon sağ prekordiyal R′ ve lateral terminal S ile görülür.'],
['V1 negatif, lateral geniş çentikli R','Bu LBBB’nin tipik sağ/lateral yön dağılımıdır; sağ terminal R′ örneğinden ayrılır.'],
['Tüm derivasyonlarda dar aynı QRS','RBBB geniş terminal aktivasyon içerir; normal dar ve eş morfoloji bu kanıtı açıklamaz.'],
['İnferior F dizisi terminal R′ yerine geçer','F atriyal etkinliktir; terminal ventriküler QRS bileşeniyle aynı yapı değildir.'],
['Her T tepesi yeni R′ kompleksidir','Terminal R′ QRS içinde yer alır; sonraki T dalgası repolarizasyondur.']]);
bank('flutterRatio','O1',[
['Atriyal300/dk ve ventriküler150/dk:2:1','300/150=2; her iki düzenli atriyal F dalgasından biri ventriküler kompleksiyle ilişkilidir.'],
['Atriyal150/dk ve ventriküler300/dk:2:1','Atriyal ve ventriküler hızlar ters çevrilmiştir; bu örnekte atriyal etkinlik daha hızlıdır.'],
['Atriyal300/dk ve ventriküler300/dk:2:1','Eşit hızlar1:1 olur; iki F başına bir QRS için ventriküler hız yarıdır.'],
['Atriyal300/dk ve ventriküler100/dk:2:1','300/100=3; bu3:1 olur ve kayıttaki400ms R–R ile uyuşmaz.'],
['Atriyal300/dk ve ventriküler75/dk:2:1','300/75=4; bu4:1 olur,2:1 örneği değildir.']]);
bank('flutterPolarity','O3',[
['İnferior negatif F, V1 pozitif F','Tipik karşı-saat yönlü flutter öğretim örneğinde inferior negatif ve V1 pozitif F etkinliği gösterilir.'],
['İnferior pozitif F, V1 negatif F','Bu ters polarite verilen tipik öğretim örneğiyle uyuşmaz; flutterın tüm tiplerine genellenmez.'],
['Her derivasyonda F pozitif ve eşittir','Aynı atriyal kaynak farklı derivasyon eksenlerine farklı yansır; eş polarite/genlik beklenmez.'],
['F yalnız QRS içinde görünür','Flutter F etkinliği ventriküler komplekslerden bağımsız sürekli atriyal dizidir.'],
['F mekanik arter basınç dalgasıdır','F elektriksel atriyal etkinliktir; arter basıncının kaydı değildir.']]);
bank('tachCause','O5',[
['Sinüs hız artışının klinik nedeni araştırılır','Ateş,ağrı,hipovolemi ve diğer nedenler sinüs hızını artırabilir; EKG kökeni gösterir ama nedeni tek başına seçmez.'],
['Sinüs P korunması sistemik nedenleri dışlar','Sinüs kökeni sistemik stres yanıtıyla uyumludur; neden araştırmasını kaldırmaz.'],
['120/dk hızı primer AVNRT mekanizmasını kanıtlar','Hızlar örtüşebilir; uygun sinüs P dizisi varken yalnız hız AVNRT mekanizması kanıtı değildir.'],
['Çarpıntının ani tarifi sinüs P kanıtını geçersiz kılar','Öykü önemlidir fakat elektriksel P ekseni ve ilişki birlikte değerlendirilir; tek semptom tarifi kökeni kesin değiştirmez.'],
['Dar QRS klinik hacim kaybını dışlar','QRS genişliği ventriküler ileti süresidir; hacim kaybı veya hipoperfüzyonu dışlayan ölçüm değildir.']]);bank('vtContext','O5',[
['Nabız ve hemodinamik durum ayrıca belirlenir','VT nabızlı veya nabızsız olabilir; acil yaklaşım klinik nabız,perfüzyon ve ilgili algoritmayla ayrılır.'],
['Geniş QRS bütün VT’leri nabızsız yapar','QRS genişliği elektriksel aktivasyondur; klinik nabzın varlığını tek başına göstermez.'],
['Düzenli QRS bütün VT’leri stabil yapar','Elektriksel düzenlilik dolaşım kararlılığına eş değildir; hipotansiyon veya arrest olabilir.'],
['T polaritesi VT için kan basıncıdır','Repolarizasyon yönü kan basıncı değeri değildir; basınç ayrıca ölçülür.'],
['Animasyon perfüzyonun gerçek ölçümüdür','Şematik düşük akım hasta debisi veya perfüzyon ölçümü değildir.']]);
bank('svtLimits','O5',[
['Kesin mekanizma için ek EKG ve klinik veri gerekir','Düzenli dar taşikardi SVT örüntüsüdür; tek şerit AVNRT,AVRT veya AT mekanizmasını kesin ayırmaz.'],
['P seçilmiyorsa kesin AVNRT vardır','P görünmemesi tek başına AVNRT için özgül değildir; başka mekanizmalarda da P örtüşebilir.'],
['Hız167/dk ise kesin AVRT vardır','Hız değeri mekanizmaların örtüşen aralıklarından biridir; AVRT’ye özgül kanıt değildir.'],
['Dar QRS varsa kesin fokal AT vardır','Dar QRS supraventriküler iletimi destekler; fokal AT için ayrık atriyal kanıt gerekir.'],
['Düzenli hız varsa klinik değerlendirme gereksizdir','Düzenlilik belirtileri ve hemodinamik durumu değerlendirme gereğini kaldırmaz.']]);
bank('atLimits','O5',[
['Fokal AT desteklenir; paroksismal başlangıç kanıtlanmaz','Değişik P morfolojisi atriyal kökeni destekler; kısa sürekli şerit başlangıç/sonlanmanın ani oluşunu göstermez.'],
['Tek sürekli şerit atağın ani başladığını kanıtlar','Başlangıç bölümü kaydedilmeden paroksismal başlangıç davranışı gözlenmiş sayılamaz.'],
['Tek sürekli şerit atağın toplam süresini verir','Kayıt penceresi toplam atağın başlangıç ve sonunu içermez; süre kesin belirlenemez.'],
['Ters P her zaman aynı anatomik odağı belirler','P ekseni köken hakkında ipucu verir; tam anatomik odak tek sentetik derivasyonla kesinleştirilmez.'],
['Fokal AT tanımı SVT grubunun dışındadır','Fokal AT supraventriküler taşikardi alt türüdür; iki etiketi dışlayan seçenekler örtüşme yaratır.']]);
bank('ischemiaLimits','O5',[
['Bölgesel ST örüntüsü klinik bağlam ve seri EKG ister','ST dağılımı eğitim örneğidir; belirtiler,komşu derivasyonlar,seri EKG ve klinik inceleme birlikte yorumlanır.'],
['Tek ST değerinden kesin sorumlu damar seçilir','ST bölgesi olası anatomik ipucu verir; tek sentetik değer kesin koroner damar tanısı değildir.'],
['Düzenli sinüs ritmi akut iskemiyi dışlar','Akut iskemi sırasında sinüs düzeni korunabilir; ritim düzeni ST ve belirtileri dışlamaz.'],
['Karşılıklı çökme yoksa her iskemi dışlanır','Karşılıklı değişim destekleyici olabilir; yokluğu tüm klinik iskemi olasılığını sıfırlamaz.'],
['Şematik duvar hareketi gerçek ejeksiyon fraksiyonudur','Animasyon kalibre edilmiş ultrason veya hacim ölçümü değildir; hasta EF’si vermez.']]);
function numberBank(id,label,correct,other,explanations){bank(id,'O6',[[correct,label],...other.map((x,i)=>[x,explanations[i]])]);}
numberBank('rr800','R–R800ms ise60/0,8=75/dk elektriksel hızdır.','75/dk',['60/dk','90/dk','120/dk','150/dk'],['60/dk1000ms gerektirir;800ms değil.','90/dk yaklaşık667ms gerektirir.','120/dk500ms gerektirir.','150/dk400ms gerektirir.']);
numberBank('rr500','60/0,5=120/dk; uygun sinüs P ile sinüs taşikardisi örneğidir.','120/dk',['75/dk','100/dk','150/dk','167/dk'],['75/dk800ms döngüdür.','100/dk600ms döngüdür.','150/dk400ms döngüdür.','167/dk yaklaşık360ms döngüdür.']);
numberBank('rr400','60/0,4=150/dk ventriküler elektriksel hızdır.','150/dk',['75/dk','100/dk','120/dk','300/dk'],['75/dk800ms döngüdür.','100/dk600ms döngüdür.','120/dk500ms döngüdür.','300/dk200ms; flutter atriyal hızını ventrikülle karıştırır.']);
numberBank('rr360','60/0,36 yaklaşık166,7/dk elektriksel hızdır.','Yaklaşık167/dk',['120/dk','150/dk','180/dk','200/dk'],['120/dk500ms gerektirir.','150/dk400ms gerektirir.','180/dk yaklaşık333ms gerektirir.','200/dk300ms gerektirir.']);
numberBank('rr380','60/0,38 yaklaşık157,9/dk elektriksel hızdır.','Yaklaşık158/dk',['120/dk','140/dk','180/dk','200/dk'],['120/dk500ms gerektirir.','140/dk yaklaşık429ms gerektirir.','180/dk yaklaşık333ms gerektirir.','200/dk300ms gerektirir.']);
numberBank('pr175','P ilk sapması−215ms, QRS ilk sapması−40ms: fark175ms.','175ms',['130ms','155ms','215ms','255ms'],['130ms P merkezinden QRS başlangıcına gitme hatasıdır.','155ms verilen iki başlangıcın farkı değildir.','215ms P başlangıcından R tepesine ölçüm hatasıdır.','255ms P başlangıcından QRS sonuna ölçüm hatasıdır.']);
numberBank('pr140','Ektopik P başlangıcı−180ms, QRS başlangıcı−40ms: fark140ms.','140ms',['95ms','120ms','180ms','220ms'],['95ms P tepesinden QRS başlangıcına ölçüm hatasıdır.','120ms verilen ilk sapmaların farkı değildir.','180ms R tepesini QRS başlangıcı yerine alma hatasıdır.','220ms QRS sonunu PR sınırı alma hatasıdır.']);
numberBank('q80','−40ms ile+40ms arasındaki QRS desteği80ms’dir.','80ms',['40ms','60ms','100ms','140ms'],['40ms yalnız R’den son dönüşe yarı desteği sayar.','60ms başlangıç veya terminal bileşenin bir kısmını dışlar.','100ms iki sınırın verilen farkından fazladır.','140ms geniş PVC/RBBB örneğiyle karıştırır.']);
numberBank('q140','−60ms ile+80ms arasındaki geniş QRS desteği140ms’dir.','140ms',['80ms','110ms','160ms','200ms'],['80ms normal dar QRS örneğidir.','110ms terminal desteğin bir kısmını dışlar.','160ms LBBB öğretim genişliğidir.','200ms verilen ilk/son sapma farkından60ms uzundur.']);
numberBank('q160','−70ms ile+90ms arasındaki geniş QRS desteği160ms’dir.','160ms',['80ms','120ms','180ms','240ms'],['80ms normal dar aktivasyondur.','120ms bu sinyalin son terminal bölümünü dışlar.','180ms VT örneğinin genişliğidir.','240ms verilen160ms destekten80ms uzundur.']);
numberBank('q180','−70ms ile+110ms arasındaki VT QRS desteği180ms’dir.','180ms',['80ms','140ms','220ms','270ms'],['80ms normal dar QRS örneğidir.','140ms PVC/RBBB örneğinin genişliğidir.','220ms verilen sınırların farkından uzundur.','270ms verilen180ms destekten90ms uzundur.']);
numberBank('st32','V3’te J+20ms sentetik ST düzeyi+0,32mV’dir.','+0,32mV',['+0,032mV','−0,32mV','+3,2mV','0mV'],['Ondalık kayması yüksekliği10kat küçültür.','Polarite yükselmeden çökmeye çevrilmiştir.','Ondalık kayması yüksekliği10kat büyütür.','Yükselmiş ST platosunu izoelektrik kabul eder.']);
numberBank('st20','II’de J+20ms sentetik inferior ST düzeyi+0,20mV’dir.','+0,20mV',['−0,20mV','+0,02mV','+2,0mV','0mV'],['Polarite ters çevrilmiştir; II’de yükselme vardır.','Ondalık kayması10kat küçültür.','Ondalık kayması10kat büyütür.','Pozitif ST platosu sıfır değildir.']);
numberBank('iii28','II0,20mV−I(−0,08mV)=III0,28mV.','+0,28mV',['+0,12mV','−0,28mV','+0,14mV','+0,20mV'],['Negatif I’yi çıkarmak yerine toplama hatasıdır.','III polaritesi ters çevrilmiştir.','Bipolar farkı yanlışlıkla ikiye bölmüştür.','II değerini III yerine kopyalamıştır.']);
numberBank('avf24','aVF=II−I/2=0,20−(−0,08)/2=0,24mV.','+0,24mV',['+0,16mV','+0,28mV','−0,06mV','−0,18mV'],['Negatif I yarısını çıkarma işareti yanlış uygulanmıştır.','III=II−I ile aVF karıştırılmıştır.','aVR=−(I+II)/2 sonucudur.','aVL=I−II/2 sonucudur.']);
numberBank('avl18','aVL=I−II/2=−0,08−0,10=−0,18mV.','−0,18mV',['+0,18mV','−0,06mV','+0,24mV','−0,08mV'],['Polarite ters çevrilmiş ve lateral çökme yükselmeye dönüşmüştür.','Bu aVR sonucudur; aVL değildir.','Bu aVF sonucudur; aVL değildir.','I değeri artırılmış dönüşüm yapılmadan kopyalanmıştır.']);
bank('afProfile','O1',[
['Düzensizlik korunur; hızlı profil daha kısa R–R içerir','Hızlı AF profili340–560ms, kontrollü profil600–1000ms döngüler üretir; ikisi de düzensizdir.'],
['Hızlı profilde düzenli sinüs P yeniden oluşur','Ventriküler hız profili atriyal kökeni sinüse dönüştürmez; ayrık P yokluğu sürer.'],
['Kontrollü profilde PR175ms yeniden ölçülebilir','Hızın yavaşlaması ayrık ilişkili P oluşturmaz; AF’de PR tanımlanamaz.'],
['Hızlı profilde geniş VT QRS zorunludur','Bu iki AF profilinde QRS80ms tutulur; hız profili VT morfolojisi değildir.'],
['Kontrollü profil AF tanımını kaldırır','AF örüntüsü yalnız hızla tanımlanmaz; P yokluğu ve düzensizlik sürer.']]);
bank('pvcOrigin','O2',[
['Beklenen sinüs atımından önce ventriküler aktivasyon','Öncül ilişkili P olmayan erken geniş farklı kompleks bu örnekte ventriküler erken aktivasyondur.'],
['Her atımda sabit sağ dal gecikmesi','Sabit RBBB tüm atımlarda terminal ileti morfolojisi verir; burada tek erken farklı kompleks vardır.'],
['Her atımda sabit sol dal gecikmesi','Sabit LBBB’nin tüm sinüs komplekslerindeki genişliği izole erken olaydan ayrıdır.'],
['Düzenli hızlı atriyal F devresi','Flutterın sürekli F dizisi tek erken geniş kompleksin kaynağı değildir.'],
['Koordineli sinüs hızının kademeli artışı','Kademeli sinüs hız artışı, uygun P ilişkisiyle dar temel diziyi hızlandırır; izole farklı PVC’yi açıklamaz.']]);
bank('bbbDelay','O4',[
['Gecikmiş aktivasyon şematik eşzamanlılığı azaltabilir','Dal gecikmesi ventriküler aktivasyon sırasını değiştirir; animasyon bu varsayımı gösterir, basınç/debi ölçmez.'],
['BBB’de bütün ventriküler depolarizasyon kaybolur','Geniş organize QRS etkinliğin kaybolmadığını, aktivasyonun uzadığını gösterir.'],
['Gecikme yalnız atriyal F frekansıdır','BBB intraventriküler iletimdir; flutterın atriyal frekansı farklı süreçtir.'],
['Terminal R veya S doğrudan ejeksiyon hacmidir','Terminal QRS yönü aktivasyon vektörünü gösterir; hacim veya EF ölçümü değildir.'],
['Kısa animasyon gecikmesi kesin hasta gecikmesidir','60ms görsel ayrıştırma şematik seçimdir; ölçülmüş hastaya özgü mekanik gecikme değildir.']]);
bank('ischemiaFlow','O4',[
['Bölgesel azalma şematiktir; global ileri akım sürebilir','İskemik örnekte bir bölge zayıf gösterilir, tüm pompa durdurulmaz; gerçek debi klinik veri gerektirir.'],
['Bölgesel ST yükselmesi VF ile eş akımsızlıktır','Bölgesel iskemi ile VF’nin organize pompa yokluğu aynı mekanik durum değildir.'],
['Düzenli QRS global debinin normal olduğunu ölçer','Elektriksel düzenlilik normal global hemodinamiyi kanıtlamaz; ayrıca klinik değerlendirme gerekir.'],
['Rengin koyuluğu gerçek koroner stenoz yüzdesidir','Renk öğretim şemasıdır; stenoz yüzdesi veya koroner anatomiyi kalibre etmez.'],
['Her ST milivoltu sabit bir EF kaybıdır','ST voltajını sabit ejeksiyon fraksiyonu kaybına dönüştüren doğrulanmış model yoktur.']]);
bank('fastFill','O4',[
['Kısa döngü diyastolik doluş süresini kısaltabilir','Hız artınca döngü kısalır; şematik doluş azalabilir, fakat hasta debisi veya nabzı bundan hesaplanmaz.'],
['Hız artışı her hastada atım hacmini aynı oranda artırır','Atım hacmi doluş,kasılma ve yük koşullarına bağlıdır; yalnız elektriksel hızdan sabit oran çıkmaz.'],
['Dar QRS kısalan diyastolü tamamen telafi eder','Dar ileti süresi, hız nedeniyle kısalan doluş süresini kendiliğinden ortadan kaldırmaz.'],
['Atriyal P görünürse doluş süresi hızdan bağımsızdır','Atriyal etkinlik var olsa da daha kısa döngü doluş penceresini kısaltabilir.'],
['Kısalan R–R doğrudan kan basıncı değeridir','R–R elektriksel döngü süresidir; kan basıncına mmsHg olarak doğrudan çevrilmez.']]);
bank('timeScale','O6',[
['Yatay süre ve dikey voltaj ayrı birimlerdir','EKG’de yatay eksen saniye, dikey eksen mV’dir;25mm/sn ve10mm/mV orantısı korunur.'],
['Yatay piksel her ekranda gerçek1mm’dir','Ekran cihazı fiziksel milimetreye kalibre edilmez; çizim ölçeği bir orantı/etiketleme varsayımıdır.'],
['Dikey bir kare daima bir saniyedir','Dikey kare voltaj eksenindedir; yatay zamanla yer değiştirilemez.'],
['QRS yüksekliği kompleks süresini verir','Yükseklik mV, genişlik saniyedir; iki eksen ayrı ölçümlerdir.'],
['Canvas genişlemesi hastanın elektriksel hızını artırır','Resize görsel piksel yoğunluğunu değiştirir; modelin saniye ve hız koordinatlarını değiştirmez.']]);
const caseRows={
normal:`
Rutin muayenede düzenli75/dk elektriksel hız, II’de pozitif P ve her dar QRS öncesinde sabit P vardır.^Bu verilerin desteklediği örüntü hangisidir?^sinus
Egzersiz öncesi kayıtta PR175ms ve QRS80ms; belirti yok, II’de P pozitif, aVR’de P negatiftir.^Sinüs kökeni için en uygun bütüncül sınıflama hangisidir?^sinus
Palpasyonda dakikada70 nabız sayılmış; aynı zaman aralığındaki EKG’de75/dk organize QRS seçiliyor.^İki hızın farklılığı için hangi değerlendirme gerekir?^pulse
Aile hekimi kaydında iki R tepesi arasında800ms bulunuyor; P–QRS ilişkisi sabit.^Elektriksel ventrikül hızı kaçtır?^rr800
Kaliper P’nin ilk sapmasını R’ye göre−215ms, QRS’nin ilk sapmasını−40ms işaretliyor.^PR aralığı hangi değerdir?^pr175
Kişi QRS’nin yalnız R tepesini ölçmüş; şeklin ilk sapması−40ms, son dönüşü+40ms.^Toplam QRS süresi kaçtır?^q80
Bir öğrenci sessiz PR segmentini tüm PR aralığı sanıyor; P başlangıcı ve QRS başlangıcı görülüyor.^Hangi sınırlar standart PR’yi verir?^pr
T dalgasından sonra kapak katmanında AV giriş açık, aort çıkışı kapalı gösteriliyor.^Bu kapak ve hacim düzeni nasıl yorumlanır?^fill
R’den45ms sonra ventrikül kasılmaya başlamış; aort ve pulmoner çıkış henüz kapalı.^Hangi mekanik evre açıklaması tutarlıdır?^mechanic
R’den140ms sonra semilüner kapaklar açık; AV kapaklar kapalı ve ileri parçacıklar ilerliyor.^Bu an için hangi açıklama uygundur?^eject
R’den245ms sonra T dalgası seçiliyor; ejeksiyonun son bölümü hâlâ sürüyor.^T’nin temel elektriksel anlamı nedir?^t
İzde QRS başlamadan önce ayrık P, atriyal animasyondan biraz önce beliriyor.^P’nin kaydettiği olay hangisidir?^p
Bilek nabzı muayenede değerlendirilmemiş; sadece düzenli dar QRS kaydı var.^QRS’nin doğrudan temsil ettiği olay hangisidir?^qrs
Aynı zaman noktasında I0,72mV, II1,00mV, III0,28mV kaydediliyor.^Bu üç sinyal arasındaki temel ilişki hangisidir?^limb
Yakınması olmayan kişinin kısa normal örüntüsü var; ailede kalp hastalığı öyküsü ayrıca sorgulanıyor.^Bu kayıtla risk ve etiyoloji hakkında hangi çıkarım sınırı korunmalıdır?^limits`,
af:`
Çarpıntıda dar QRS dizisinin R–R aralıkları620,870,710,990ms; ayrık tutarlı P yok.^En uygun ritim örüntüsü hangisidir?^af
Nabız muayenesinde düzensizlik var; şeritte değişken dar QRS ve ince düzensiz taban görülüyor, F dizisi yok.^Sabit flutter yerine hangi örüntü desteklenir?^af
Monitör bir620ms aralıktan97/dk bildiriyor; izde sonra990ms aralık geliyor.^Hızı temsil etmek için hangi yaklaşım uygundur?^afRR
Kontrollü hız seçeneğinde600–1000ms değişken döngüler var; hasta semptomları ayrı kaydediliyor.^Atriyal köken ve hız profili nasıl birlikte yorumlanır?^afProfile
Hızlı profil340–560ms düzensiz R–R üretiyor; QRS hâlâ80ms.^Hız profilinin değiştirdiği temel özellik hangisidir?^afProfile
F dalgası aranıyor fakat ayrık P yok; öğrenci otomatik175ms PR yazmak istiyor.^PR hakkında hangi ifade savunulabilir?^prNone
Atriyum animasyonunda titreme var, koordine kasılma yok; AV kapaklar diyastolde açılıyor.^Doluşun atriyal bileşenine ne olur?^afAtrial
Elektriksel QRS sayısı bilek nabzından fazla; basınç ve perfüzyon ölçümü henüz yapılmadı.^Mekanik etkinlik için hangi ek değerlendirme gerekir?^pulse
AF kaydı ve hipertansiyon öyküsü birlikte değerlendirilmekte; yaş ve diğer risk bilgileri eksik.^Tromboemboli değerlendirmesi için hangi yaklaşım uygundur?^afRisk
Hasta hız kontrolü sonrası daha rahat; EKG’de ayrık P yokluğu ve düzensizlik sürüyor.^Hız kontrolü ile AF riskleri arasındaki çıkarım hangisidir?^afRisk
Bir düzensiz dar QRS’nin ilk ve son sapması−40/+40ms; tabanda f etkinliği var.^Bu ventriküler kompleksin süresi kaçtır?^q80
Tabandaki ince f voltajı artmış, ancak organize QRS’ler hâlâ ayırt edilebiliyor.^QRS’nin elektriksel tanımı hangisidir?^qrs
Uzun R–R sonrası diyastolde AV kapaklar açık; öğrenci pasif doluşu tamamen durmuş sanıyor.^Gözlenen kapak düzeni nasıl yorumlanmalıdır?^fill
Aynı anda I ve II’den aVR hesaplanıyor; düzensiz f ve QRS bileşenleri birlikte dönüştürülüyor.^Doğru aVR ilişkisi hangisidir?^avr
Kısa AF şeridi var; başlangıç zamanı ve toplam ritim yükü bilinmiyor, önceki kayıt isteniyor.^Hangi genel çıkarım sınırı doğrudur?^limits`,
stemi:`
Baskı tarzında ağrı sırasında V1–V4’te komşu ST yükselmesi; II’de düzenli P ve dar QRS korunuyor.^ST değişiminin dağılımı hangisidir?^anterior
Göğüs ağrısında V2+0,24,V3+0,32,V4+0,24mV; inferior grupta yükselme yok.^Hangi bölgesel örüntü desteklenir?^anterior
İskemik belirtilerle düzenli75/dk ritim görülüyor; ağrı20dakikadır sürüyor.^Ritim düzenli olsa da hangi klinik değerlendirme ilkesi geçerlidir?^urgent
Öğrenci yalnız V3 ST yüksekliğinden kesin sorumlu koroner damarı seçmek istiyor.^Hangi çıkarım sınırı korunmalıdır?^ischemiaLimits
Sentetik V3’te QRS sonundan20ms sonra voltaj+0,32mV; TP tabanı sıfır.^ST ölçümünün değeri kaçtır?^st32
R tepe genliği belirgin ama ST platosu daha küçük; ölçüm aracı J sonrası bölgeyi işaretliyor.^ST yüksekliği hangi ölçümle tanımlanır?^st
Ekranda anterior duvar bölgesi zayıf hareket ediyor; aort yolundaki parçacıklar sürüyor.^Bölgesel iskemi ve global akım nasıl ayrılır?^ischemiaFlow
Görüntüde tek koroner dal engel işareti var; klinik anjiyografi verisi bulunmuyor.^Bu animasyondan hangi sınırlandırılmış yorum yapılabilir?^ischemiaFlow
ST yüksekliği ve düzenli QRS var; hasta nabzı ile basıncı henüz değerlendirilmiyor.^Elektriksel kayda ek olarak ne gerekir?^pulse
P ilk sapma−215ms ve QRS ilk sapma−40ms; ST değişimi QRS sonrasında.^Bu örnekte PR kaçtır?^pr175
Dar QRS’nin zaman desteği−40ms’den+40ms’ye; ST yükselmesi daha sonra başlıyor.^QRS süresi kaçtır?^q80
T’nin son sınırı görülüyor, ancak öğrenci QT için R tepesinden T tepesine gidiyor.^QT için hangi sınırlar kullanılmalıdır?^qt
Önceki kaydı normal olan kişinin ağrısı sürüyor; yeni kayıt seri olarak karşılaştırılıyor.^Tek ST örneği yerine hangi yorum ilkesi uygundur?^ischemiaLimits
R’den140ms sonra çıkış kapakları açık, AV kapaklar kapalı; duvar bölgesi asimetrik.^Kapak düzeninin gösterdiği mekanik evre nedir?^eject
Aynı anda I+0,04mV ve II−0,04mV ST bileşenleri var; artırılmış sol kol türetiliyor.^aVL hangi dönüşümle elde edilir?^avl`,
pvc:`
Temel800ms sinüs dizisine480ms’de gelen140ms farklı kompleks eklenmiş; ilişkili öncül P yok.^Erken olayın en uygun sınıflaması hangisidir?^pvc
Tekleme sırasında tek erken geniş QRS ve sonraki1120ms ara var; önceki ve sonraki kompleksler dar.^Sabit dal bloğundan hangi olay ayrılır?^pvc
Öğrenci erken atımın kaynağını P yerine QRS’nin farklı yönü ve zamanından değerlendiriyor.^Bu örnekte uyarının başlangıcı nasıl açıklanır?^pvcOrigin
Erken480ms ve ardından1120ms aralık; temel sinüs döngüsü800ms.^Bu duraklama için doğru hesap ve yorum hangisidir?^pvcPause
Erken kompleksin ilk sapması−60ms, son dönüşü+80ms; terminal dönüş de ölçüme dahil.^Toplam QRS süresi kaçtır?^q140
Geniş erken pozitif QRS’nin ardından T negatif; sonraki sinüs T’si pozitif.^Bu ikincil T değişimi nasıl yorumlanır?^pvcT
PVC sırasında bilek nabzı daha zayıf hissediliyor; basınç ve hacim ölçümü yok.^EKG ile mekanik nabız hakkında hangi sınır geçerlidir?^pulse
Kişi tekleme hissediyor; önceki yapısal kalp hastalığı, sıklık ve semptom ilişkisi sorgulanıyor.^Tek PVC örneği etiyoloji ve risk için ne sağlar?^limits
PVC’de P yokken sonraki sinüs atımında P başlangıcı−215ms ve QRS−40ms.^Sonraki sinüs atımının PR değeri kaçtır?^pr175
Öğrenci öncül P’siz erken ventriküler kompleks için PR atamak istiyor.^Erken olayda PR ölçümü nasıl ele alınır?^prNone
Bir sinüs kompleksinin desteği−40/+40ms; yanındaki erken kompleks daha geniş.^Temel sinüs QRS süresi hangisidir?^q80
Erken geniş kompleks için sadece yüksek R lobu ölçülmüş, terminal dönüş dışlanmış.^QRS süresinin doğru ölçüm tanımı hangisidir?^duration
Atım sonrası T içinde kaliper var; öğrenci toplam depolarizasyon–repolarizasyon süresini soruyor.^QT hangi sınırlar arasında ölçülür?^qt
PVC sonrası daha uzun diyastolde AV kapaklar açık ve hacim geri kazanılıyor.^Bu mekanik kapak düzeni hangi evreyi gösterir?^fill
Erken atımın mV bileşenleri I ve II’den bütün ekstremite izlerine dağıtılıyor.^PVC için de korunması gereken bipolar ilişki hangisidir?^limb`,
svt:`
Ani düzenli çarpıntıda360ms R–R,80ms QRS; ayrık P bu şeritte seçilemiyor.^Bu verilerle en uygun kapsamlı örüntü adı hangisidir?^svt
Dar kompleks düzenli taşikardi167/dk; klinisyen AVNRT ve AVRT arasında ek veri arıyor.^Tek şeridin desteklediği sınıflama hangisidir?^svt
R–R360ms bulunmuş; R sayımıyla ekran hızından bağımsız elektriksel hız hesaplanıyor.^Elektriksel hız yaklaşık kaçtır?^rr360
P QRS veya T içinde örtüşebilir; kayıt sadece üç saniyelik dar taşikardi penceresi.^Kesin taşikardi mekanizması için hangi sınır geçerlidir?^svtLimits
Öğrenci dar QRS ve görünmeyen P’den kesin AVNRT etiketini seçmek istiyor.^Mekanizma hakkında hangi sonuç savunulabilir?^svtLimits
Çarpıntı sırasında kan basıncı ölçümü bekleniyor; ekranda organize QRS sürüyor.^Klinik nabız ve elektriksel hız nasıl ayrılmalıdır?^pulse
Kişide presenkop ve düzenli hızlı dar kompleks var; perfüzyon verisi eksik.^Hangi klinik değerlendirme ilkesi uygundur?^urgent
Hızlı döngüde diyastol kısa; animasyon AV girişinin açık kaldığı süreyi azaltıyor.^Yüksek hızın doluşa etkisi nasıl sınırlandırılır?^fastFill
QRS’nin ilk ve son dönüşü−40/+40ms, PR için ayrık P bulunamıyor.^QRS süresi kaçtır?^q80
Kayıt aracı otomatik175ms PR gösteriyor fakat P başlangıcı tanımlanamadı.^Bu PR hakkında hangi değerlendirme doğrudur?^prNone
R’den45ms sonra çıkış kapakları hâlâ kapalı; hızlı döngü ejeksiyonu60ms’de başlatıyor.^Bu45ms anı için hangi evre açıklaması tutarlıdır?^mechanic
R’den100ms sonra semilüner kapaklar açık, AV kapaklar kapalı; T henüz yükselmektedir.^Gözlenen mekanik durum nedir?^eject
T desteği sona yaklaşırken elektriksel sinyal QRS’den farklı polarite gösteriyor.^T’nin temel elektriksel olayı hangisidir?^t
Ekran2× seçilmiş; aynı360ms model aralığı daha hızlı oynuyor.^Oynatma ile ölçüm ve gözlem süresi ilişkisi hangisidir?^speed
R’den300ms sonra AV kapaklar yeniden açılmış ve ventrikül hacmi geri kazanılıyor.^Döngünün bu kapak düzeni nasıl adlandırılır?^fill`,
inferior:`
Akut ağrı ve bulantıda II,III,aVF’de ST yükselmesi; I,aVL’de çökme var, QRS dar.^Dağılım ve karşılıklı değişim hangisidir?^inferior
Terlemeyle göğüs ağrısında II+0,20,III+0,28,aVF+0,24mV; V3 izoelektrik.^Hangi bölgesel EKG örüntüsü desteklenir?^inferior
İnferior komşu değişimler ve sürmekte olan göğüs ağrısı birlikte kaydediliyor.^Hangi klinik değerlendirme ilkesi uygulanır?^urgent
ST dağılımı biliniyor ama sağ/sol baskın koroner anatomi ve anjiyografi bilinmiyor.^Sorumlu damar konusunda hangi sınır gerekir?^ischemiaLimits
II’de J+20ms voltaj+0,20mV; TP tabanı sıfır ve QRS bitmiştir.^ST ölçümü kaçtır?^st20
I−0,08mV, II+0,20mV aynı anda örneklenmiş; III değeri hesaplanacak.^III ST bileşeni kaçtır?^iii28
I−0,08 ve II+0,20mV; inferior artırılmış elektrot yönü hesaplanıyor.^aVF ST bileşeni kaçtır?^avf24
I−0,08 ve II+0,20mV; lateral karşılıklı değişim aVL üzerinden inceleniyor.^aVL ST bileşeni kaçtır?^avl18
Öğrenci III+0,28mV yüksekliğini global ejeksiyon fraksiyonu kaybına çeviriyor.^Animasyonun dolaşım çıkarım sınırı hangisidir?^ischemiaFlow
İnferior duvar bölgesinde hareket azalmış, aortta akım parçacıkları sürüyor.^Bölgesel kasılma azalması nasıl yorumlanır?^ischemiaFlow
Düzenli75/dk QRS var; semptomlar sürüyor ve nabız muayenesi bekleniyor.^Elektriksel sinyalden mekanik nabız hakkında ne yapılır?^pulse
Kaliper ST ölçmek için R tepesine konmuş; başka öğrenci J sonrası tabanı seçiyor.^Uygun ST ölçüm tanımı hangisidir?^st
P başlangıcı−215ms,QRS başlangıcı−40ms; inferior ST yükselmesi PR’den sonra.^PR aralığı kaçtır?^pr175
QRS ilk sapma−40ms, son dönüş+40ms; ST düzeyi pozitiftir.^QRS süresi kaçtır?^q80
Karşılıklı I ve aVL değişimi aynı elektrot potansiyellerinden türetilmekte.^aVL için doğru dönüşüm hangisidir?^avl`,
vt:`
Baş dönmesinde380ms düzenli R–R ve180ms tek biçimli QRS; dar sinüs P ilişkisi gösterilemiyor.^Hangi örüntü acil VT değerlendirmesini gerektirir?^vt
Önceki MI öyküsü olan kişide hızlı geniş kompleksler; klinik notta AV ayrışması da saptanmış.^Öncelikli elektriksel değerlendirme hangisidir?^vt
Geniş düzenli kompleksin döngüsü380ms; öğrenci hız için QRS süresini kullanmış.^Doğru ventriküler elektriksel hız yaklaşık kaçtır?^rr380
Dalga ilk sapması−70ms ve son dönüş+110ms; kompleksin terminal kısmı ölçüme dahil.^Çizilen QRS süresi kaçtır?^q180
Kayıt VT örneği olarak verilmiş ama hastanın nabzı ve kan basıncı bilinmiyor.^Acil yaklaşımı ayıran ek veri hangisidir?^vtContext
Bir hasta geniş taşikardide uyanıkken diğeri yanıtsız; ikisinde benzer organize QRS var.^VT’nin klinik nabız durumu nasıl belirlenir?^vtContext
Geniş taşikardiye hipotansiyon ve bilinç değişikliği eşlik ediyor; tedavi kararı klinik ekibe ait.^Hangi değerlendirme ilkesi uygundur?^urgent
Şematik döngü380ms; doluş ve kasılma eşzamanlılığı azaltılmış çiziliyor.^Hızın doluşa etkisi için hangi sınırlı ifade uygundur?^fastFill
Pozitif geniş QRS’den sonra negatif T görülüyor; bu T yeni erken QRS sanılıyor.^T’nin elektriksel tanımı hangisidir?^t
Öğrenci geniş QRS içinde R lobunu saymış, terminal kısmı hariç bırakmış.^QRS süresi hangi sınırlarla ölçülür?^duration
PR kutusu boş; şeritte P ile QRS arasında tanımlanmış sabit ilişki yok.^Bu örnekte PR neden sayısal atanamaz?^prNone
R’den70ms sonra ventrikül kasılırken semilüner kapaklar kapalı; ejeksiyon100ms’de başlayacak.^Bu an için hangi mekanik açıklama tutarlıdır?^mechanic
R’den140ms sonra çıkış kapakları açık; ileri akım örnekte düşük fakat sıfır değil.^Kapak durumu hangi evredir?^eject
Monitör hızı158/dk yazıyor; bilek nabzı ayrıca değerlendirilecek.^EKG elektriksel hızının klinik nabza ilişkisi hangisidir?^pulse
Aynı ventriküler kompleksin I ve II bileşenleri diğer ekstremite voltajlarını türetiyor.^Artırılmış inferior ilişki hangisidir?^avf`,
vf:`
Yanıtsız kişide kaotik değişken dalga, ayrık QRS yok; klinik ekip dolaşım bulgusu saptamıyor.^Elektriksel görünüm hangi örüntüyle uyumludur?^vf
Önceki düzenli geniş kompleksler kaybolmuş; artık değişken genlikli organize olmayan etkinlik var.^Monomorfik VT’den hangi elektriksel örüntüye geçiş gösteriliyor?^vf
Kaotik dalgada öğrenci saniyedeki tepeleri ventrikül hızı olarak sayıyor.^VF’de hız ölçümü için hangi ifade doğrudur?^vfRate
R–R ve QRS kutuları boş; bir önceki normal döngü800ms idi.^Önceki hızın yeni VF’de kullanımı nasıl ele alınır?^vfRate
Kırmızı aort parçacıkları, mavi pulmoner parçacıklar ve koroner parçacıklar aynı yerde kalıyor.^Bu mekanik gösterimin doğru açıklaması hangisidir?^vfFlow
VF seçildiğinde koroner katman açık; ventriküler ejeksiyon kapakları kapalı gösteriliyor.^Koroner ve ileri dolaşım birlikte nasıl gösterilmelidir?^vfFlow
Öğrenci kaotik elektriksel genliğin sürdüğünü görüp zayıf düzenli ejeksiyon bekliyor.^VF’nin pompa durumu hangisidir?^vfFlow
Yanıtsızlık ve dolaşım bulgusu yokluğu kaotik EKG ile birlikte; eğitim izleme sayacı tamamlanmamış.^Klinik bağlamda hangi ilke önceliklidir?^urgent
Acil ekip şüpheli VF kaydını klinik arrest bulgularıyla değerlendiriyor; uygulama tedavi ölçümü yapmıyor.^Bu örnek için klinik değerlendirme yaklaşımı hangisidir?^urgent
Ölçüm aracı P başlangıcı istiyor; kaotik etkinlikte ayrık ilişkili P bulunamıyor.^PR hakkında hangi sonuç doğrudur?^prNone
Farklı ekstremite voltajlarında kaotik dalga var; öğrenci bunları bağımsız rastgele üretmek istiyor.^VF’de de korunacak bipolar ilişki hangisidir?^limb
Kaotik sinyalde I ve II anlık voltajı bilinmekte; aVR türetilecek.^Doğru dönüşüm hangisidir?^avr
Ventriküler kaotik voltajın genliği büyümüş, klinik dolaşım hâlâ yok.^Genlik artışı etkili pompa konusunda neyi değiştirmez?^vfFlow
Kayıt oynatma hızı2×; kaotik etkinlikten organize R–R elde edilemiyor.^Elektriksel hızın raporlanması nasıl yapılır?^vfRate
Kısa kaotik eğitim çizimi var; gerçek hasta nedeni, süre ve müdahale yanıtı çizimden bilinmiyor.^Etiyoloji ve sonuç hakkında hangi çıkarım sınırı gerekir?^limits`,
pat:`
Düzenli150/dk dar taşikardide II’de ters ayrık P ve P’ler arasında izoelektrik hat var.^En uygun alt örüntü hangisidir?^at
Önceki sinüs kaydında P pozitifken yeni hızlı kayıtta inferior P ters; sabit P–QRS ilişkilidir.^Sinüs taşikardisinden hangi örüntü ayrılır?^at
Her QRS öncesinde ayrık ektopik P seçiliyor; sürekli testere dişi atriyal taban bulunmuyor.^Flutterdan ayıran sınıflama hangisidir?^at
Atak dışında veri yok; sürekli üç saniyelik şeritte ektopik P görülüyor, başlangıç kaydedilmemiş.^Paroksismal davranış için hangi sınırlama gerekir?^atLimits
Öğrenci ters P’den kesin atriyal odak anatomisi ve ani başlangıç çıkarıyor.^Kayıt hangi sınırlandırılmış yorumu destekler?^atLimits
R–R400ms; ayrık ektopik P başına bir dar QRS var.^Ventriküler elektriksel hız kaçtır?^rr400
P başlangıcı−180ms ve QRS başlangıcı−40ms kaliperle işaretlenmiş.^Bu modelde PR kaçtır?^pr140
Öğrenci ektopik P tepesini kullanmış; ilk atriyal sapma daha önce başlıyor.^PR için hangi sınırlar doğru tanımdır?^pr
Dar QRS−40/+40ms destekli; inferior P polaritesi sinüsten farklı.^QRS süresi kaçtır?^q80
Hızlı döngüde P görünür ama diyastol yine kısa; hasta basıncı ölçülmemiş.^Hızın doluş etkisi nasıl sınırlandırılır?^fastFill
Her ektopik P atriyal animasyondan önce gelir; P sinüs düğümü kökenli değil.^P’nin değişmeyen elektriksel tanımı hangisidir?^p
Kişide çarpıntı var; ritim fokal AT’yle uyumlu ama semptom şiddeti ve neden bilinmiyor.^Nedensellik ve risk için hangi genel sınır gerekir?^limits
EKG150/dk; palpasyonda tüm atımların iletilip iletilmediği henüz değerlendirilmedi.^Mekanik nabız için ne gerekir?^pulse
R’den45ms sonra çıkışlar kapalı, AV kapaklar kapalı;60ms sonrası ejeksiyon planlı.^Bu45ms mekanik anı hangisidir?^mechanic
Ektopik atriyal P ve ventriküler QRS voltajları aynı ekstremite elektrot dönüşümünü kullanıyor.^aVL hangi ilişkiyle türetilir?^avl`,
flutter:`
Düzenli150/dk dar kompleksler arasında300/dk testere dişi F etkinliği var.^Hangi atriyal ve ventriküler örüntü desteklenir?^flutter
II,III,aVF’de sürekli negatif F, V1’de pozitif F; iki F’ye bir QRS seçiliyor.^En uygun ritim örüntüsü hangisidir?^flutter
F döngüsü200ms, R–R400ms; öğrenci iki elektriksel hızı tek değer sayıyor.^Doğru hız ve iletim ilişkisi hangisidir?^flutterRatio
Atriyal etkinlik300/dk ve ventriküler150/dk ölçülmüş; aynı bölümde düzenli QRS var.^İletim oranı hangi seçenekle doğru gösterilir?^flutterRatio
II’de F aşağı yönlü, V1’de yukarı yönlü; klinik örnek tipik karşı-saat yönlü flutter olarak sınırlandırılmış.^Beklenen derivasyon polaritesi hangisidir?^flutterPolarity
Öğrenci her derivasyonda F’yi aynı yönde çizmek istiyor; inferior ile V1 karşılaştırılıyor.^Bu tipik öğretim örneğinin F yön dağılımı hangisidir?^flutterPolarity
QRS aralıkları400ms; atriyal hızın300/dk olduğu ayrıca yazıyor.^Ventriküler elektriksel hız hangisidir?^rr400
Sürekli F tabanı nedeniyle ayrı P başlangıcı tanımlanamıyor; otomatik PR kutusu boş.^PR için hangi ifade doğrudur?^prNone
F etkinliği sürerken QRS−40/+40ms boyunca seçilebiliyor.^Ventriküler QRS süresi kaçtır?^q80
Hasta nabzı düzenli hissediliyor;300/dk atriyal ve150/dk QRS sayımları klinik nabızla karşılaştırılıyor.^EKG’den mekanik nabız hakkında hangi sınır korunur?^pulse
Hızlı ventriküler yanıt nedeniyle doluş penceresi kısaltılmış; akım klinik olarak ölçülmemiş.^Doluş hakkında hangi ifade uygundur?^fastFill
R’den100ms sonra F dalgaları sürüyor; semilüner kapaklar açık ve AV kapaklar kapalı.^Elektriksel F sürerken mekanik evre hangisidir?^eject
Kısa2:1 şerit var; öğrenci bütün flutter olgularında aynı ventriküler hızı varsayıyor.^Genelleme için hangi çıkarım sınırı gerekir?^limits
Sürekli atriyal F’nin I ve II bileşenlerinden tüm ekstremite voltajları hesaplanıyor.^aVF için doğru dönüşüm hangisidir?^avf
T dalgası F tabanıyla üst üste geliyor; öğrenci görünür her taban dalgasını mekanik basınç sanıyor.^T’nin temel elektriksel karşılığı nedir?^t`,
sintach:`
Ateşle düzenli120/dk, her dar QRS öncesinde uygun pozitif P ve sabit PR var.^En uygun ritim örüntüsü hangisidir?^tach
Ağrı sırasında hız artmış, II’de pozitif ve aVR’de negatif P ilişkisi korunmuş; QRS80ms.^Sinüs kökenini destekleyen sınıflama hangisidir?^tach
Hacim kaybı kuşkusu var; EKG’de sinüs P ve hızlı düzenli dar QRS seçiliyor.^Ritim tanımından sonra hangi klinik neden yaklaşımı uygundur?^tachCause
Ateş ölçülmemiş; öğrenci P genliğini kullanarak neden ve sıcaklığı belirlemek istiyor.^Hangi klinik yorum sınırı korunur?^tachCause
R–R500ms ve uygun sinüs P görülüyor; ekran oynatması1×.^Ventriküler elektriksel hız kaçtır?^rr500
Öğrenci120/dk sayımını tüm atımların güçlü arter nabzı kanıtı sanıyor; palpasyon yapılmadı.^Mekanik nabız için hangi değerlendirme gerekir?^pulse
Döngü500ms; önceki75/dk örneğe göre AV açık doluş penceresi daha kısa.^Yüksek hızın doluşla ilişkisi nasıl açıklanır?^fastFill
Sinüs P ilk sapması−215ms,QRS ilk sapması−40ms; hızlı döngüde ilişki sabit.^PR süresi kaçtır?^pr175
Dar kompleks−40ms’de başlayıp+40ms’de bitiyor; T sonraki hızlı P’ye yaklaşıyor.^QRS süresi kaçtır?^q80
P görünür fakat sadece P tepe–R tepe aralığı ölçülmüş.^Hangi sınırlar PR aralığını verir?^pr
Öğrenci P dalgasını hızlı arter akımının grafiği sanıyor; atriyal animasyon kısa gecikmeli.^P hangi elektriksel olayı kaydeder?^p
R’den45ms sonra kasılma başlamış; semilüner çıkışlar60ms’ye kadar kapalı.^Bu an hangi mekanik evredir?^mechanic
R’den110ms sonra çıkış kapakları açık; hızlı döngüde ileri akım şematiktir.^Hangi kapak açıklaması tutarlıdır?^eject
R’den300ms sonra AV kapaklar açık ve ventrikül doluşu geri geliyor.^Bu evrenin doğru kapak ve hacim tanımı nedir?^fill
Hızlı sinüs örneği2× oynatılıyor; gözlem tamamlama sayacı gerçek zamanla ilerliyor.^Oynatma çarpanı hangi ölçümleri değiştirir?^speed`,
lbbb:`
Düzenli75/dk sinüs dizisinde160ms QRS, V1’de negatif QS ve V6’da geniş çentikli R var.^En uygun ileti örüntüsü hangisidir?^lbbb
I,aVL,V5,V6’da geniş R; V1’de derin S, her QRS öncesinde P korunmuş.^Sağ dal örneğinden hangi sınıflama ayrılır?^lbbb
Öğrenci yalnız genişliği görüyor; sağ ve lateral terminal QRS yönleri birlikte gösteriliyor.^LBBB’de beklenen birlikte morfoloji hangisidir?^lMorph
V1 ve V6 aynı atımda karşılaştırılıyor; V1 negatif, V6 pozitif geniş/çentikli.^Hangi sağ–lateral yön dağılımı bu örneğe uyar?^lMorph
QRS ilk sapması−70ms, son dönüş+90ms; geniş çentikli R desteği ölçülüyor.^Toplam QRS süresi kaçtır?^q160
P ilk sapma−245ms,QRS ilk sapma−70ms; dal gecikmesi QRS’nin devamında.^PR sınırları hangi standart tanımla alınır?^pr
Geniş QRS içindeki çentik ikinci bağımsız atım sanılıyor; tek P–QRS döngüsü var.^QRS’nin temel elektriksel olayı hangisidir?^qrs
Sol ventrikül görsel hareketi60ms gecikmeli; klinik ultrason veya basınç kaydı yok.^Bu gecikme nasıl sınırlandırılmalıdır?^bbbDelay
Önceki EKG aynı geniş iletiyi gösteriyor; şimdi yeni göğüs ağrısı ayrıca sorgulanıyor.^Dal bloğunun klinik yorumu için hangi ilke uygundur?^bbbLimits
Yeni fark edilen geniş QRS var; semptom ve eski kayıt bilgisi henüz tamamlanmamış.^Etiyoloji ve iskemi için hangi yaklaşım gerekir?^bbbLimits
Lateral pozitif geniş R sonrası T negatif; öğrenci bu yönü doğrudan akım kaybı sanıyor.^T’nin temel elektriksel tanımı nedir?^t
Sinüs elektriksel hızı75/dk; geniş komplekslerin mekanik nabzı muayeneyle değerlendirilecek.^Elektriksel hız ile nabız arasında hangi sınır geçerlidir?^pulse
QRS terminal bölümü kaliperde dışlanmış; görünen R tepesi160ms toplam desteğin parçası.^QRS süresi hangi sınırlarla ölçülmelidir?^duration
Kişide presenkop var; sadece eski BBB etiketi bilinmekte, klinik bulgular değerlendirilmekte.^Hangi genel klinik değerlendirme ilkesi uygundur?^urgent
Sol/lateral geniş R’nin I ve II bileşenleri diğer ekstremite sinyallerini de belirliyor.^LBBB’de aVL dönüşümü hangisidir?^avl`,
rbbb:`
Düzenli sinüs dizisinde140ms QRS; V1’de terminal R′, V6’da geniş terminal S var.^En uygun ileti örüntüsü hangisidir?^rbbb
Sağ prekordiyalde rSR′ ve I’de terminal S her atımda tekrarlanıyor; erken olay yok.^Tek PVC yerine hangi ileti örüntüsü desteklenir?^rbbb
V1 ile V6 eşzamanlı inceleniyor; sağda geç pozitif, lateralde geç negatif bileşen var.^RBBB’nin birlikte morfoloji dağılımı hangisidir?^rMorph
Öğrenci V1’deki son R′yi T olarak etiketliyor; bu bileşen QRS bitiminden önce.^Doğru terminal QRS dağılımı hangisidir?^rMorph
QRS ilk sapma−60ms, son dönüş+80ms; terminal R′/S destekleri de ölçülüyor.^Çizilen QRS süresi kaçtır?^q140
P başlangıcı−235ms,QRS başlangıcı−60ms; sağ terminal ileti daha sonra uzuyor.^PR’nin başlangıç ve bitiş tanımı hangisidir?^pr
Sağ ventrikül hareketi60ms ayrıştırılıyor; gerçek mekanik ölçüm verisi yok.^Dal gecikmesi animasyonu nasıl yorumlanır?^bbbDelay
Önceki kayıtla aynı RBBB var; kişinin yeni dispnesi ayrıca değerlendirilmekte.^Dal bloğu klinik önem açısından nasıl ele alınır?^bbbLimits
İlk kez fark edilen terminal R′ var; yapısal hastalık ve klinik öykü bilinmiyor.^Tek dal bloğu kaydı için hangi klinik sınır uygundur?^bbbLimits
V1’de pozitif terminal R′ ardından negatif T; lateral terminal S ayrı görülüyor.^T dalgası hangi temel olayı kaydeder?^t
Elektriksel75/dk sinüs aktivasyonu var; öğrenci140ms genişliği düşük basınç kanıtı sayıyor.^Mekanik nabız ve basınç hakkında ne gerekir?^pulse
Ölçümde yalnız ilk r lobu sayılmış; terminal R′ ve S desteği dışarıda bırakılmış.^QRS süre ölçümü için hangi tanım doğrudur?^duration
Geniş QRS hâlâ düzenli P sonrası geliyor; T daha sonra ve ayrı zaman bölgesinde.^QRS hangi elektriksel etkinliği gösterir?^qrs
Kaçış hissi ve baş dönmesi sürüyor; klinik ekip nabız,basınç ve ek kaydı değerlendiriyor.^Semptomlu kişide hangi değerlendirme ilkesi geçerlidir?^urgent
Terminal sağ/lateral bileşenler I ve II’den bütün ekstremite derivasyonlarına tutarlı dağıtılıyor.^aVR için doğru dönüşüm hangisidir?^avr`
};
bank('qtNone','O6',[
['QT tanımlanamaz; organize QRS ve T sınırı yok','QT için bir QRS başlangıcı ve ona ait T sonu gerekir; kaotik VF’de bu sınırlar seçilemez.'],
['En yüksek kaotik tepeden en düşük tepeye ölçülür','Kaotik tepe/çukur sınırı depolarizasyon–repolarizasyon QT sınırı değildir.'],
['Son sinüs QT’si yeni VF QT’sidir','Önceki ritmin aralığı yeni kaotik ritimde tanımlanmış bir QT oluşturmaz.'],
['Dalga salınım periyodu QT olarak kaydedilir','VF salınım periyodu organize ventriküler kompleksin QT süresiyle aynı tanım değildir.'],
['Atriyal F aralığı QT yerine kullanılır','F aralığı atriyal döngüdür; ventriküler QRS–T sınırının yerine konamaz.']]);
bank('fNotP','O1',[
['Sürekli F etkinliği ayrık sinüs P dizisi değildir','Flutter F düzenli sürekli atriyal depolarizasyondur; ayrı P ve PR tanımlarıyla karıştırılmaz.'],
['Her F bir ventriküler QRS’dir','F atriyal etkinlik, QRS ventriküler depolarizasyondur;2:1 örnekte hızları farklıdır.'],
['F yalnız ventriküler T’nin başka adıdır','F atriyal devre etkinliği ve T ventriküler repolarizasyon farklı kaynaklıdır.'],
['Negatif F ayrık sinüs P ekseniyle aynı dizidir','F sürekli atriyal devre etkinliğidir; polaritesi ters olsa da ayrık sinüs P dizisi yerine geçmez.'],
['F görülmesi atriyal katkının normal olduğunu ölçer','Sürekli atriyal elektriksel devre koordine normal mekanik atriyal katkıyı kanıtlamaz.']]);
bank('fNotQRS','O1',[
['AF’nin f etkinliği QRS sayımından ayrılır','İnce düzensiz f atriyal taban etkinliğidir; ventriküler elektriksel hız ayrık QRS dizisinden değerlendirilir.'],
['Her f tepesi ventriküler atım sayılır','Atriyal taban tepeleri ventriküler depolarizasyon kompleksleri değildir.'],
['En geniş f tepesinin süresi QRS’dir','Genlik veya taban genişliği f etkinliğini QRS’ye dönüştürmez; ayrı ventriküler sınırlar seçilir.'],
['f varlığı geniş VT morfolojisini kanıtlar','AF tabanı ventriküler QRS genişliğinin veya VT kökeninin özgül kanıtı değildir.'],
['f yoksa kısa şerit kesin sinüs ritmidir','İnce f görünmeyebilir; ayrık P ve R–R düzenliliği birlikte değerlendirilmelidir.']]);
bank('leadAll','O3',[
['Derivasyonlar aynı elektriksel kaynağın farklı izdüşümleridir','Lead seçimi morfoloji ve polariteyi değiştirir; ritmin elektriksel kaynağı veya klinik nabzı düğmeyle değişmez.'],
['Lead değiştirmek ritim mekanizmasını değiştirir','Elektrot görünümünü seçmek aynı kaynağın izdüşümünü değiştirir; hastanın ritmini dönüştürmez.'],
['Bütün leadler aynı morfolojiyi göstermelidir','Eksenler farklıdır; BBB/ST/P yön ve genlik farkları öğretim konusudur.'],
['Negatif QRS ventriküler kökeni tek başına kesinleştirir','QRS polaritesi lead eksenine göre değişir; negatiflik tek başına ventriküler odak veya VT kanıtı değildir.'],
['Seçili tek lead bütün12 derivasyon bilgisine eşittir','Bölgesel dağılım ve morfoloji için diğer derivasyonlar ek bilgi taşır.']]);
bank('j','O6',[
['J noktası QRS’nin bittiği ST başlangıç sınırıdır','J terminal QRS’den ST’ye geçişi tanımlar; ölçüm konumu dalga geometrisiyle ortak fidüsiyelden alınır.'],
['J noktası P’nin ilk sapmasıdır','P başlangıcı atriyal depolarizasyon sınırıdır; QRS–ST geçişi daha sonradır.'],
['J noktası R’nin en yüksek tepesidir','R tepesi QRS içindedir; J terminal dönüşteki QRS sonudur.'],
['J noktası T’nin en yüksek tepesidir','T tepesi repolarizasyon içinde ve QRS sonundan daha sonradır.'],
['J noktası bir sonraki QRS başlangıcıdır','Sonraki QRS yeni döngüdür; mevcut QRS’nin bitiş geçişiyle karışmamalıdır.']]);
bank('rateVsRR','O6',[
['Hız=60/R–R(saniye) organize düzenli dizide kullanılır','Düzenli seçilebilir ventriküler komplekslerde döngü saniye cinsinden alınır; düzensiz ritimde çoklu aralık gerekir.'],
['Hız=60/QRS(saniye) kullanılır','QRS aktivasyon genişliğidir; döngü aralığı değildir ve çok yüksek yanlış hız üretir.'],
['Hız=60/PR(saniye) kullanılır','PR atriyoventriküler iletim aralığıdır; iki ventriküler atım aralığı değildir.'],
['Hız=1000/R–R(saniye) kullanılır','1000 katsayısı aralığı yanlış birime bağlar; saniye cinsinden aralık için dakikada60 saniye kullanılır.'],
['Hız=R–R(ms)/60 kullanılır','Aralık önce saniyeye çevrilmeli ve ters orantı kullanılmalıdır; bu birim ve yön hatasıdır.']]);
bank('qrsWidthCause','O5',[
['Genişlik morfoloji ve klinik kanıtla birlikte yorumlanır','Geniş QRS yavaş veya farklı ventriküler aktivasyonu gösterir; tek genişlik VT ile aberrans etiyolojisini kesin ayırmaz.'],
['120ms üstü her QRS kesin VT atımıdır','BBB veya başka intraventriküler gecikmeler de geniş QRS oluşturur; hız,zamanlama ve diğer kanıt önemlidir.'],
['140ms her QRS kesin RBBB atımıdır','RBBB için terminal sağ/lateral morfoloji gerekir; PVC de bu öğretim genişliğinde olabilir.'],
['160ms her QRS kesin LBBB atımıdır','Genişlik tek başına LBBB’nin sağ/lateral morfolojisini kanıtlamaz.'],
['Genişlik tek başına mekanik debiyi hesaplar','Aktivasyon süresi debi veya nabız ölçümü değildir; hemodinamik veri ayrıca gerekir.']]);
bank('sinusAxis','O1',[
['II’de pozitif ve aVR’de negatif ayrık P destekleyicidir','Bu öğretim sinüs örneği uygun P ekseni ve her QRS öncesi ilişkiyi birlikte gösterir.'],
['İnferior ters ayrık P sinüs örneğini destekler','Bu modelde inferior ters P ektopik atriyal örneğe aittir; sinüs ekseniyle eş tutulmaz.'],
['Sürekli inferior testere dişi taban sinüs P’sidir','Bu flutter F etkinliğidir; ayrık sinüs P morfolojisi değildir.'],
['Düzensiz ince taban dalgaları düzenli sinüs P’sidir','AF f etkinliği ayrık düzenli ilişkili sinüs P dizisinden farklıdır.'],
['Lateral terminal S P ekseninin göstergesidir','Terminal S ventriküler QRS bileşenidir; atriyal P ekseni ayrı değerlendirilir.']]);
bank('atAxis','O1',[
['Bu örnekte inferior ters ayrık P ektopik ekseni destekler','Sinüsten farklı ayrık P morfolojisi atriyal köken değişimini destekler; tam anatomik odak kesinleşmez.'],
['Inferior ters P her kayıtta sinüs eksenidir','Standart sinüs öğretim örneğinde inferior P pozitiftir; bu değişim sinüs dışı morfoloji olarak sınırlandırılmıştır.'],
['Ayrık ters P sürekli flutter F tabanıdır','Ayrık P ve izoelektrik aralık sürekli flutter F devresinden farklıdır.'],
['Ters P ventriküler erken QRS’nin parçasıdır','P atriyal etkinliktir; burada QRS öncesi ayrı ve tekrarlayan bir morfolojidir.'],
['Ters P etkinliğin mekanik yönünü kesin gösterir','P polaritesi elektriksel eksendir; mekanik doluş yönü veya hacmi değildir.']]);
bank('afEarly','O2',[
['Düzensiz dar yanıt izole erken geniş PVC’den ayrılır','Tüm dizide P yokluğu/düzensizlik AF’yi; tek erken geniş farklı olay PVC’yi destekler.'],
['Her kısa R–R mutlaka PVC’dir','AF’de kısa dar döngüler olabilir; PVC için erken farklı geniş morfoloji ve ek kanıt aranır.'],
['Her uzun R–R mutlaka tam kompansatuvar duraklamadır','AF’nin değişken aralığı PVC sonrası iki temel döngü toplamıyla aynı kanıt değildir.'],
['QRS80ms ise her zaman düzenli sinüs vardır','Dar QRS AF’de de görülebilir; P ve düzenlilik ayrıca değerlendirilir.'],
['Düzensizlik tek başına ventriküler köken kanıtıdır','Düzensizliği atriyal ve ventriküler nedenlerden ayırmak için P,kompleks ve zamanlama gerekir.']]);
bank('stContiguous','O3',[
['Komşu derivasyonlardaki dağılım birlikte incelenir','Bölgesel ST yorumu tek lead yerine anatomik komşuluk,karşılıklı değişim ve klinik veriyi birlikte kullanır.'],
['En yüksek tek R genliği bölgeyi belirler','R genliği depolarizasyon izdüşümüdür; ST bölgesinin tek başına belirleyicisi değildir.'],
['aVR her durumda tek başına anterior bölgeyi verir','Tek artırılmış lead bütün anterior prekordiyal dağılımın yerine geçmez.'],
['Bir leadin ismi sorumlu damarın kesin adıdır','Derivasyon bölgesi koroner anatomiyi kesin birebir isimlendirmez.'],
['ST’nin mV değeri yalnız ventrikül hızıdır','ST voltaj ve R–R zaman farklı ölçütlerdir; bölgesel voltaj hız etiketi değildir.']]);
numberBank('qt350','QRS−40ms,T sonu310ms:310−(−40)=350ms; klinik QTc değildir.','350ms',['270ms','310ms','390ms','800ms'],['QRS başlangıcının bir kısmı veya T sonu dışlanmıştır.','R tepesinden T sonuna ölçüm hatasıdır.','QRS başlangıcı yerine daha erken atriyal sınır karıştırılmıştır.','R–R döngüsü QT yerine yazılmıştır.']);
numberBank('qt245','QRS−40ms,T sonu205ms: toplam245ms sentetik QT.','245ms',['165ms','205ms','285ms','400ms'],['QRS başlangıç/son sınırları yanlış daraltılmıştır.','R tepesinden ölçerek başlangıç40ms dışlanmıştır.','Fazladan40ms eklenmiştir; verilen fark245ms’dir.','R–R400ms ile QT karıştırılmıştır.']);
numberBank('qt345','QRS−70ms,T sonu275ms: toplam345ms sentetik VT QT.','345ms',['180ms','275ms','380ms','415ms'],['Bu QRS süresidir; T desteği eklenmemiştir.','R referansı kullanılarak70ms başlangıç dışlanmıştır.','VT R–R380ms döngüsü QT değildir.','Başlangıç70ms iki kez eklenmiştir.']);
numberBank('qt430','QRS−70ms,T sonu360ms: toplam430ms sentetik LBBB QT.','430ms',['160ms','360ms','500ms','800ms'],['Bu QRS süresidir; repolarizasyon bölümünü dışlar.','R tepesinden başlama ilk70ms’yi dışlar.','70ms başlangıç iki kez eklenmiştir.','R–R döngüsü QT değildir.']);
numberBank('qt410','QRS−60ms,T sonu350ms: toplam410ms sentetik geniş kompleks QT.','410ms',['140ms','350ms','470ms','800ms'],['Bu yalnız QRS süresidir.','R tepesini başlangıç alarak60ms dışlar.','Başlangıç60ms iki kez eklenmiştir.','R–R döngüsü QT yerine kullanılmıştır.']);
numberBank('prL175','P−245ms,QRS−70ms:175ms; geniş QRS PR sınırını değiştirmez.','175ms',['130ms','160ms','245ms','335ms'],['P tepesinden ölçme ilk45ms’yi dışlar.','QRS160ms süresi PR yerine yazılmıştır.','P’den R referansına gitme70ms fazlalık ekler.','P’den QRS sonuna gitme QRS160ms’yi de içerir.']);
numberBank('prR175','P−235ms,QRS−60ms:175ms; terminal sağ gecikme QRS içindedir.','175ms',['130ms','140ms','235ms','315ms'],['P merkezinden ölçme ilk45ms’yi dışlar.','QRS140ms süresi PR yerine kullanılmıştır.','P’den R referansına ölçme60ms fazlalık ekler.','QRS sonu kullanılarak140ms kompleks de eklenmiştir.']);
bank('vfArtifact','O5',[
['Klinik durumu ve elektrot/sinyal güvenilirliğini doğrula','Uyanık,konuşan ve perfüze kişide VF benzeri monitor görünümü klinikle çelişir; artefakt/bağlantı ve gerçek ritim hızla doğrulanır.'],
['Yalnız ekran dalgasından kesin nabızsız VF de','Klinik perfüzyon bilgisiyle çelişen görünüm doğrulanmadan kesin nabızsız VF diye etiketlenmez.'],
['Sadece dalga genliğine göre koroner damar seç','VF benzeri artefakt veya kaotik dalga genliği koroner damar lokalizasyonu vermez.'],
['Son normal hızı kaydedip yeni görünümü atla','Yeni monitor değişimi klinik ve sinyal güvenilirliği açısından değerlendirilmelidir; görmezden gelinmez.'],
['Uyanıklık varsa bütün ritim değişimlerini dışla','Uyanıklık arrest görünümüyle çelişir ama diğer ritimleri veya monitor sorunlarını değerlendirmeyi kaldırmaz.']]);
bank('noQrs','O1',[
['Organize QRS sınırları seçilemez','VF kaotik dalgada ayrık tekrarlayan ventriküler depolarizasyon kompleksi tanımlanamaz; genişlik kutusu boş kalır.'],
['Kaotik her pozitif tepe dar QRS kabul edilir','Pozitif tepe tek başına organize kompleksin başlangıç/sonunu tanımlamaz.'],
['İki negatif çukur arası QRS genişliğidir','Kaotik çukur aralığı QRS destek sınırı değildir; döngü ve kompleks tanımı karıştırılır.'],
['Eski VT180ms yeni VF QRS’sine atanır','Ritim değişince önceki kompleks süresi yeni organize olmayan dalgada geçerli olmaz.'],
['F dalga süresi QRS genişliği yerine yazılır','Atriyal F etkinliği ventriküler QRS sınırı değildir ve bu kaotik örnekte düzenli F de yoktur.']]);
// Editorial revision: no repeated decision bank within a pattern's15-case group.
function revise(mode,index,row){const rows=caseRows[mode].trim().split('\n');rows[index]=row;caseRows[mode]=rows.join('\n');}
revise('normal',1,'II’de ayrık pozitif P ve aVR’de negatif P, her80ms QRS öncesinde görülüyor; yalnız P ekseni sorgulanıyor.^Bu modelde sinüs P’sini destekleyen yön dağılımı hangisidir?^sinusAxis');
revise('af',1,'Dizinin tamamında kısa ve uzun dar döngüler var; tek erken geniş farklı kompleks seçilmiyor.^AF düzensizliği izole PVC’den nasıl ayrılır?^afEarly');
revise('af',4,'Hızlı AF340–560ms döngüleri nedeniyle diyastol kısa; hasta debisi ölçülmemiş.^Hız artışı ve doluş için hangi sınırlı ifade uygundur?^fastFill');
revise('af',9,'Yavaşlayan ventrikül yanıtı sonrası kısa şerit var; AF’nin başlangıç zamanı, yükü ve nedeni bilinmiyor.^Kayıttan etiyoloji konusunda hangi sınır gerekir?^limits');
revise('af',14,'AF sinyali II’den V1’e geçince f morfolojisi değişiyor ama düzensiz QRS dizisi aynı kaynaktan geliyor.^Lead değişimi nasıl yorumlanır?^leadAll');
revise('stemi',1,'Yeni ağrıda V2,V3,V4 komşu yükselmesi ayrı ayrı görülüyor; öğrenci sadece en yüksek V3’e bakıyor.^Bölgesel yorum için hangi yöntem uygundur?^stContiguous');
revise('stemi',7,'V3’ten II’ye geçince ST yüksekliği farklılaşıyor; kalbin ritmi ve klinik belirtiler değişmiyor.^Derivasyon seçiminde değişen temel özellik nedir?^leadAll');
revise('stemi',12,'QRS’nin son dönüşünde yükselmiş ST platosuna geçiş görülüyor; kaliper sınırı R tepesinde değil.^Bu geçişin tanımı hangisidir?^j');
revise('pvc',1,'Erken kompleks140ms ve farklı morfolojili; sonraki sinüs kompleksleri80ms, sürekli terminal dal morfolojisi yok.^Genişliğin tek başına etiyoloji sayılması nasıl önlenir?^qrsWidthCause');
revise('svt',1,'Dar düzenli taşikardide II,V1 ve aVF görünümleri farklı; lead menüsü değiştirilirken kaynak döngü360ms kalıyor.^Lead değişiminin anlamı nedir?^leadAll');
revise('svt',4,'Öğrenci167/dk için80ms QRS genişliğini kullanıyor; iki organize R tepesinin arası360ms.^Düzenli dizide doğru hız formülü hangisidir?^rateVsRR');
revise('inferior',1,'II,III,aVF komşu grubu ile I,aVL karşılıklı değişimi ayrı ayrı görülüyor; tek lead tanısından kaçınılıyor.^ST bölgesini yorumlamak için hangi yöntem uygundur?^stContiguous');
revise('inferior',9,'Dar QRS sona erdikten sonra pozitif inferior ST platosu başlıyor; ölçüm aynı terminal sınırı kullanıyor.^Bu terminal geçiş nasıl adlandırılır?^j');
revise('vt',1,'Geniş düzenli taşikardi180ms; önceki dal bloğu ve ayrıntılı atriyal kanıt bilinmiyor.^Genişliği etiolojik kanıt olarak kullanırken hangi sınır gerekir?^qrsWidthCause');
revise('vt',5,'Geniş taşikardi kaydı var; toplam süresi,nedeni ve yapısal kalp verileri kısa pencerede bulunmuyor.^Etiyoloji ve risk hakkında hangi genel sınır uygundur?^limits');
revise('vf',1,'VF benzeri kaotik dalga II ve V1’de farklı yansıyor; lead seçimi elektriksel görünümü değiştiriyor.^Derivasyon değişiminin kaynağa etkisi nasıl yorumlanır?^leadAll');
revise('vf',3,'Kaotik etkinlikte yatay eksen saniye,dikey eksen mV; ekran büyütülmüş fakat dalga kaynağı aynı.^Eksen ve fiziksel ekran ölçeği için hangi ifade doğrudur?^timeScale');
revise('vf',5,'Ölçüm aracı QT istiyor; dalgada organize QRS başlangıcı veya ona ait T sonu seçilemiyor.^QT nasıl raporlanır?^qtNone');
revise('vf',6,'VF’de ölçüm kutusu QRS genişliği istiyor; kaotik tepelerin farklı genişlikleri var.^Kompleks sınırları hakkında hangi ifade uygundur?^noQrs');
revise('vf',8,'Monitor VF benzeri görünürken kişi uyanık,konuşuyor ve perfüze; bu çelişkili sentetik senaryoda gerçek ritim doğrulanacak.^Öncelikli değerlendirme hangisidir?^vfArtifact');
revise('vf',12,'Kaotik anlık I ve II voltajı farklı; artırılmış sol kol sinyalinin de tutarlı türetilmesi isteniyor.^aVL için dönüşüm hangisidir?^avl');
revise('vf',13,'Kaotik I ve II bileşenleri aynı elektrot anından alınmış; inferior artırılmış sinyal hesaplanıyor.^aVF için dönüşüm hangisidir?^avf');
revise('pat',1,'Hızlı kayıtta inferior P ters ama ayrık; sinüs dışı morfoloji var, kesin anatomik odak bilinmiyor.^P ekseni için hangi yorum uygundur?^atAxis');
revise('pat',2,'Ektopik P’ler arasındaki taban izoelektrik; V1’e geçince P izdüşümü değişiyor ama kaynak sabit.^Lead seçimiyle ne değişir?^leadAll');
revise('pat',4,'Ektopik P ve QRS döngüsü400ms; ilk ve son atak sınırları kaydedilmemiş, hız formülü soruluyor.^Düzenli elektriksel hız hangi formülle hesaplanır?^rateVsRR');
revise('flutter',1,'İnferior testere dişi etkinlik QRS dışında da sürekli sürüyor; öğrenci bu dalgaları sinüs P sayıyor.^F ile ayrık P arasındaki doğru ayrım hangisidir?^fNotP');
revise('flutter',3,'Sürekli F tabanında aynı QRS II’den V1’e geçince farklı polaritede; atriyal devre hızı sabit.^Lead değişimi nasıl yorumlanır?^leadAll');
revise('flutter',5,'R–R400ms ve QRS80ms; öğrenci hız formülünde QRS genişliğini döngü yerine kullanıyor.^Düzenli ventriküler hız için doğru formül hangisidir?^rateVsRR');
revise('sintach',1,'Ağrıda sinüs P II’de pozitif,aVR’de negatif; hız120/dk ve QRS dar, yalnız atriyal eksen yorumlanıyor.^Sinüs P’si için hangi yön dağılımı destekleyicidir?^sinusAxis');
revise('sintach',3,'Ateş sonrası kısa hızlı sinüs şeridi var; toplam süreç,ilaç etkisi ve yapısal kalp verileri eksik.^Etiyoloji ve risk çıkarımı nasıl sınırlandırılır?^limits');
revise('lbbb',1,'Geniş QRS160ms; sadece genişlik kaydedilmiş, sağ/lateral morfoloji diğer izlerde ayrıca inceleniyor.^Tek genişliği mekanizma sayarken hangi sınır gerekir?^qrsWidthCause');
revise('lbbb',3,'P ilk sapması−245ms,QRS ilk sapması−70ms; öğrenci R tepesini bitiş sanıyor.^Bu sinüs atımının PR değeri kaçtır?^prL175');
revise('lbbb',9,'LBBB’de QRS başlangıcı−70ms,T sonu+360ms; toplam elektriksel destek soruluyor.^Sentetik QT kaçtır?^qt430');
revise('rbbb',1,'Her sinüs atımının QRS’si140ms; sadece süre biliniyor, terminal sağ/lateral kanıt ayrıca aranıyor.^Tek genişlikle RBBB etiyolojisi kesinleştirilirken hangi sınır gerekir?^qrsWidthCause');
revise('rbbb',3,'P başlangıcı−235ms,QRS başlangıcı−60ms; terminal R′ PR’den sonra uzuyor.^PR aralığı kaçtır?^prR175');
revise('rbbb',8,'RBBB kompleksinde QRS başlangıcı−60ms,T sonu+350ms; klinik QTc hesabı yapılmıyor.^Sentetik QT değeri kaçtır?^qt410');
const quizRows={
normal:`
İki ardışık organize kompleksin R tepeleri0,8s aralıklıdır; T tepeleri hız hesabına katılmıyor.^Elektriksel hız hangi değerdir?^rr800
Sinüs P’nin ilk sapması−0,215s; QRS’nin ilk sapması−0,040s.^Milisaniyeye çevrilen PR kaçtır?^pr175
Normal çizimde QRS−0,040s ile+0,040s arasında desteklenir.^Çizginin kalınlığından bağımsız aktivasyon süresi kaçtır?^q80
Bu sinüs çiziminde T’nin son sınırıR+0,310s; QRS ilk sınırıR−0,040s.^QT’nin ham sentetik değeri kaçtır?^qt350
P,R,T farklı tepeler taşır; öğrenci atriyoventriküler iletim süresini tanımlıyor.^PR’nin tanımında hangi iki başlangıç kullanılır?^pr
R lobu yüksek,Q ve S daha küçük; aktivasyon süresi sorusu tüm kompleksi kapsıyor.^QRS genişliği hangi sınırlarla ölçülür?^duration
T’nin son dönüşü ve QRS’nin ilk sapması belirlenmiş; hız düzeltmesi yapılmıyor.^QT’nin tanımı hangisidir?^qt
I0,72mV ve II1,00mV anlık elektriksel potansiyellerdir; artırılmış sağ kol isteniyor.^aVR için doğru formül hangisidir?^avr
Bir andaki I ve II elektriksel bileşenlerinden artırılmış sol kol görüntüsü oluşturulacak.^Doğru aVL formülü hangisidir?^avl
Bir andaki I ve II elektriksel bileşenlerinden artırılmış inferior görüntü oluşturulacak.^Doğru aVF formülü hangisidir?^avf
Oynatma1×’ten2×’e alınmış; sinyal fidüsiyelleri ve16s gözlem kuralı sabit.^Çarpanın etkisi hangi ifadeyle doğru açıklanır?^speed
Bir panel büyütülünce grid pikseli değişiyor; kayıt eksenleri hâlâ saniye ve mV.^Görsel ölçek hakkında hangi ifade doğrudur?^timeScale
QRS terminal dönüşü ile düz ST çizgisi birleşiyor; R tepesi daha önce.^Bu birleşim sınırı nedir?^j
II yerine V1 seçiliyor; sinyal polaritesi değişiyor, döngü800ms kalıyor.^Lead değiştirmek neyi değiştirir?^leadAll
Hesap aracı normal düzenli dizide80ms QRS yerine800ms döngü süresini seçiyor.^Hız için hangi formül uygundur?^rateVsRR`,
af:`
On ardışık dar kompleksin aralıkları değişken; tümünde tutarlı ayrık P yok, düzenli F tabanı da yok.^En uygun elektriksel örüntü hangisidir?^af
Bu AF kaydının en kısa aralığıyla başka bir penceredeki en uzun aralık farklı hız verir.^Temsil edici hız değerlendirmesi nasıl yapılır?^afRR
Kontrollü profilde600–1000ms, hızlı profilde340–560ms aralıklar üretiliyor.^Bu iki profil arasındaki ayrım hangisidir?^afProfile
PR aracında f tabanından rastgele bir tepe seçilmiş; ilişkili P başlangıcı yok.^Bu aralıktaki PR durumu nedir?^prNone
Dar QRS−40ms’den+40ms’ye sürüyor; AF tabanı desteğin dışında da devam ediyor.^Ventriküler kompleks süresi kaçtır?^q80
Bir f dalgası QRS’den önce görülüyor, ancak sonraki döngüde aynı ilişki tekrarlanmıyor.^Bu taban etkinliği sayımda nasıl ele alınır?^fNotQRS
Atriyumlarda ince düzensiz voltaj sürüyor; ayrı koordine kasılma gösterilmiyor.^AF’nin doluş katkısında hangi değişim beklenir?^afAtrial
Elektriksel90/dk sayım ile palpasyon sayımı eşleştirilecek; QRS dar olması veri olarak var.^Mekanik nabız için hangi çıkarım doğrudur?^pulse
Kontrollü hızda QRS daha seyrek, fakat ayrık sinüs P geri dönmemiş.^Klinik tromboemboli değerlendirmesi hangi ilkeye bağlıdır?^afRisk
Kısa R–R’nin morfolojisi yine80ms dar; erken geniş ventriküler olay kanıtı yok.^Kısa AF aralığı PVC’den nasıl ayrılır?^afEarly
f ve QRS bileşenleri I/II elektrot farklarından birlikte türetiliyor.^III için temel bipolar ilişki hangisidir?^limb
AF’de aynı anlık I/II voltajları sağ kol artırılmış leadine aktarılıyor.^aVR nasıl hesaplanır?^avr
Düzensiz sinyalde sol kol artırılmış leadin hem taban hem QRS’si tutarlı türetiliyor.^aVL ilişkisi hangisidir?^avl
Hızlı AF’ye geçince daha kısa diyastol çiziliyor; doğrudan basınç/debi verisi yok.^Hız ve doluş hakkında hangi sınırlandırılmış yorum uygundur?^fastFill
Son QRS’den sonra AV açıkken tabanda f etkinliği sürüyor; ventrikül hacmi doluşla geri geliyor.^Kapak düzeninin mekanik yorumu nedir?^fill`,
stemi:`
V1,V2,V3,V4 birlikte yükselmiş ST içeriyor; II ve III’de aynı baskın yükselme görülmüyor.^Dağılımın doğru adı hangisidir?^anterior
Komşu V2/V3/V4 değişimleri ve iskemik belirtiler birlikte verilmiş; tek tepeye odaklanılmıyor.^Bölgesel ST yorumu hangi yöntemle yapılır?^stContiguous
V3 J+20ms+0,32mV, TP0mV; sayısal voltaj farkı isteniyor.^ST ölçümü hangi değerdir?^st32
R tepesinden sonra QRS biter; ST platosu T’den önce devam eder.^ST yüksekliği için hangi yaklaşım doğru tanımdır?^st
Kaliper mevcut QRS’nin son sapmasını belirliyor; sonraki QRS değil.^QRS–ST birleşiminin fidüsiyeli hangisidir?^j
Düzenli sinüs dizisinde iki R arası800ms; ST yükselmesi bu süreyi değiştirmiyor.^Ventriküler elektriksel hız kaçtır?^rr800
P−215ms ve QRS−40ms ilk sapmaları veriliyor; J noktası daha sonraki sınır.^PR değeri kaçtır?^pr175
QRS ilk ve son sınırları−40/+40ms; sonrasında yükselmiş ST var.^QRS aktivasyon süresi kaçtır?^q80
ST platosu yükselmiş ama T sonuR+310ms; QRS başlangıcıR−40ms.^Ham sentetik QT kaçtır?^qt350
Bölgesel duvar hareketi zayıf gösterilirken global çıkış parçacıkları sürüyor.^İskemi şeması ile gerçek hemodinami nasıl ayrılır?^ischemiaFlow
ST bölgesi anterior, koroner anatomi ve klinik seri veriler henüz yok.^Tek çizimden damar/klinik tanı çıkarımı için hangi sınır gerekir?^ischemiaLimits
Devam eden göğüs ağrısı var;75/dk sinüs düzeni korunuyor.^Klinik değerlendirme gereksinimi nasıl yorumlanır?^urgent
I+0,04,II−0,04mV anlık ST bileşenleri ve III−0,08mV birlikte gösteriliyor.^Bipolar ilişki hangisidir?^limb
II,V3 ve aVL’yi seçmek aynı kaynakta farklı ST voltajları gösteriyor.^Lead değişimi nasıl yorumlanır?^leadAll
Düzenli organize QRS yanında klinik perfüzyon bilgisi eksik; ST bölgesi biliniyor.^Mekanik nabız için hangi ek yaklaşım gerekir?^pulse`,
pvc:`
800ms temel sinüs döngüsü içinde erken480ms aralıklı,140ms farklı QRS beliriyor.^Olayın doğru örüntü adı hangisidir?^pvc
Öncül ilişkili P yok; ventriküler kompleks beklenen sinüs anından önce başlıyor.^Erken olayın elektriksel kaynağı nasıl açıklanır?^pvcOrigin
Erken aralık480ms, postektopik aralık1120ms; toplam iki800ms temel döngü.^Duraklamanın bu sentetik örnekteki yorumu nedir?^pvcPause
Geniş erken dalga−60/+80ms sınırlarına sahiptir; sonraki sinüs kompleksi dardır.^Erken QRS süresi kaçtır?^q140
Bu PVC penceresindeki temel sinüs QRS’si−40/+40ms arasında; PVC’yle karıştırılmıyor.^Sinüs kompleksinin süresi kaçtır?^q80
Erken olaydan sonraki T’nin ana yönü QRS’ye ters; izde sonraki sinüs T farklıdır.^Repolarizasyon değişimi nasıl sınıflanır?^pvcT
140ms tek erken kompleks ile140ms her sinüs atımında terminal dal gecikmesi karşılaştırılıyor.^Genişlik yorumunda hangi ilke korunmalıdır?^qrsWidthCause
Erken QRS’de P sınırı yok; sinüs aralığı için ölçülen PR bu olaya aktarılmak isteniyor.^Erken olayın PR durumu nedir?^prNone
Komşu sinüs atımında P−215ms,QRS−40ms; yalnız bu atımda PR tanımlı.^Sinüs PR değeri kaçtır?^pr175
PVC’de QRS−60ms,T sonu+350ms; toplam destek isteniyor.^Ham sentetik QT kaçtır?^qt410
Öğrenci yalnız erken geniş kompleksin pozitif tepesini kaliperle kapsıyor.^Toplam QRS için hangi sınır tanımı gerekir?^duration
Tekleme hissi verilmiş fakat sıklık,yapısal hastalık ve semptom ilişkisi bilinmiyor.^Risk ve etiyoloji için hangi sınır uygundur?^limits
Erken elektriksel atımın palpasyonda hissedilip hissedilmediği değerlendirilmemiş.^Mekanik nabız için ne gerekir?^pulse
Postektopik daha uzun döngüde AV kapaklar açık ve hacim toparlanıyor.^Bu kapak/hacim durumu hangi evredir?^fill
Erken QRS ve sekonder T’nin I/II voltajları artırılmış inferior leadine birlikte aktarılıyor.^aVF’nin tutarlı dönüşümü hangisidir?^avf`,
svt:`
167/dk düzenli80ms kompleksler var; ayrık sinüs veya ektopik P bu pencerede gösterilmemiş.^Tanımlanabilecek en uygun örüntü hangisidir?^svt
Bir R’den sonraki R’ye360ms var; dar QRS genişliği80ms ayrıca verilmiş.^Döngüden hesaplanan hız kaçtır?^rr360
QRS desteği−40/+40ms; P seçilememesi QRS sınırlarını ortadan kaldırmıyor.^QRS süresi kaçtır?^q80
Dar taşikardinin P’si T veya QRS ile örtüşebilir; mekanizma belirleyici ek veri yok.^Kesin AVNRT/AVRT ayrımı için hangi sınır geçerlidir?^svtLimits
PR kutusuna varsayılan175ms konmuş ama ayrık ilişkili P başlangıcı saptanmamış.^Ölçümün doğru durumu nedir?^prNone
Hız hesabı QRS genişliğiyle değil düzenli R–R ile yapılacak; zaman birimi saniye.^Doğru formül hangisidir?^rateVsRR
Hızlı çizimde QRS başlangıcı−40ms,T sonu+205ms.^Ham sentetik QT kaçtır?^qt245
Repolarizasyon için R/T tepeleri yerine QRS ilk sapması/T sonu aranıyor.^QT tanımında hangi sınırlar doğrudur?^qt
45ms’de kasılma başlamış, semilüner kapaklar henüz açılmamış;60ms’de ejeksiyon başlayacak.^45ms’nin kapak/faz açıklaması nedir?^mechanic
100ms’de AV kapaklar kapalı, çıkışlar açık; elektriksel T bölümü yaklaşmakta.^Mekanik anın doğru açıklaması nedir?^eject
Döngü360ms olduğundan doluş penceresi75/dk örnekten daha kısa; hasta debisi ölçülmüyor.^Hız–doluş için hangi ifade uygundur?^fastFill
T sona yaklaşırken prekordiyal grup V1’den V6’ya alınmış; ritim kaynağı değişmiyor.^Lead değişiminin anlamı nedir?^leadAll
Şerit2× oynatılınca dalga akışı hızlanıyor fakat360ms model döngüsü aynı.^Oynatma ve gerçek izleme süresi nasıl ayrılır?^speed
Organize dar hızlı QRS var; klinik palpasyon ve basınç verisi yok.^Mekanik nabız hakkında ne gerekir?^pulse
Presenkop ve hızlı düzenli çarpıntı bildirilmiş; tüm ayrıntılar klinik ekibe ait.^Hangi klinik değerlendirme ilkesi uygundur?^urgent`,
inferior:`
II,III,aVF’de pozitif ST,I/aVL’de negatif ST; V3’te baskın anterior yükselme yok.^Bu dağılım nasıl sınıflanır?^inferior
II’de J+20ms+0,20mV ve taban0mV; QRS sona ermiş.^ST voltaj farkı kaçtır?^st20
I−0,08 ve II+0,20mV anlık değerlerinden III hesaplanıyor.^III değeri kaçtır?^iii28
Inferior ST anında I−0,08mV ve II+0,20mV; bu değerler inferior artırılmış lead için kullanılacak.^aVF değeri kaçtır?^avf24
Inferior ST anında I−0,08mV ve II+0,20mV; bu değerler lateral artırılmış lead için kullanılacak.^aVL değeri kaçtır?^avl18
Inferior grubun tümünde yükselme, lateral grupta karşılıklı çökme ayrı kanıtlar olarak okunuyor.^Bölgesel yorum yöntemi hangisidir?^stContiguous
Ölçüm aVL T tepesine değil terminal QRS’den20ms sonrasına konacak.^ST yüksekliği için doğru tanım hangisidir?^st
Terminal QRS sonrası plato başlıyor; öğretim modelinin ölçüm sınırı bu geçişi kullanıyor.^Bu geçiş sınırı hangisidir?^j
Düzenli75/dk P–QRS dizisi var; inferior ST değişimi süren ağrıyla birlikte.^Klinik değerlendirme gereksinimi hangi ilkedir?^urgent
Sadece inferior bölge verilmiş; damar anatomisi ve diğer klinik testler verilmemiş.^Kesin damar çıkarımı için hangi sınır gerekir?^ischemiaLimits
Bir duvar bölgesinin hareketi azalırken global ileri akım şematiktir ve sürer.^Hangi dolaşım yorumu uygundur?^ischemiaFlow
Sinüs P−215ms,QRS−40ms; ST ölçümü PR’den daha sonra.^PR kaçtır?^pr175
Dar QRS desteği−40/+40ms; bölgesel voltaj değişimi kompleksi genişletmemiş.^QRS süresi kaçtır?^q80
II yerine aVF seçildiğinde ST+0,20’den+0,24mV’ye değişiyor; kaynak aynı.^Lead seçimi nasıl yorumlanır?^leadAll
Ekstremite ST bileşenleri I ve II’den artırılmış inferior sinyali türetiyor.^Genel aVF dönüşümü hangisidir?^avf`,
vt:`
Ardışık düzenli geniş tek biçimli kompleksler158/dk; ek klinik kanıtla VT kuşkusu değerlendirilmekte.^Öncelikli elektriksel sınıflama hangisidir?^vt
R–R380ms ve QRS180ms ayrı ölçülmüş; ventriküler hız döngüden bulunacak.^Yaklaşık elektriksel hız kaçtır?^rr380
QRS desteği−70ms’den+110ms’ye; terminal kısım ölçüme dahildir.^QRS genişliği kaçtır?^q180
QRS başlangıcı−70ms,T sonu+275ms; klinik hız düzeltmesi istenmiyor.^Ham sentetik QT kaçtır?^qt345
Geniş taşikardide sadece genişlik verilmiş; aberrans/VT ayrımı için ek kanıt araştırılıyor.^Genişlik için hangi sınır doğrudur?^qrsWidthCause
Kayıt VT örneği ama perfüzyon ve nabız verisi dışarıdan eklenecek.^Klinik acil yaklaşımı hangi ek veriler ayırır?^vtContext
P ile QRS arasında tanımlanmış sabit başlangıç ilişkisi yok; PR alanı boş.^PR için hangi ölçüm durumu doğrudur?^prNone
70ms’de kasılma sürüyor fakat çıkışlar kapalı;100ms’den sonra çıkış açılacak.^70ms’deki mekanik faz hangisidir?^mechanic
140ms’de çıkış kapakları açık, AV kapaklar kapalı; düşük şematik ileri akım var.^Bu mekanik durum nasıl açıklanır?^eject
380ms döngüde300ms kasılma sonuna yaklaşılır; doluş aralığı kısadır.^Hızın doluş etkisi için hangi ifade uygundur?^fastFill
Geniş QRS sonrası sekonder T var; kaliper toplam QRS’yi belirlemek istiyor.^QRS sınır ölçüm tanımı hangisidir?^duration
Repolarizasyon yönü ana QRS’ye ters; öğrenci T’yi ikinci ventriküler aktivasyon sanıyor.^T’nin temel elektriksel anlamı nedir?^t
I ve II aynı geniş kompleksin anlık bileşenleridir; artırılmış inferior voltaj türetilecek.^Doğru aVF dönüşümü hangisidir?^avf
Monitör158/dk sayıyor; arter nabzının sayısı ve gücü henüz kaydedilmemiş.^Nabız için hangi çıkarım sınırı geçerlidir?^pulse
Geniş taşikardi ve bilinç değişikliği birlikte verilmiş; bu eğitim aracı tedavi ölçmez.^Hangi klinik değerlendirme ilkesi geçerlidir?^urgent`,
vf:`
Değişken genlikli kaotik etkinlikte tekrarlayan ayrık QRS dizisi yok; klinik arrest bağlamı verilmiş.^Elektriksel örüntü hangisidir?^vf
Dalgada pozitif ve negatif tepeler var ama organize kompleks başlangıç/sonu yok.^QRS genişliği için hangi ifade doğrudur?^noQrs
Kaotik tepe frekansı farklı pencerelerde değişiyor; bunlar organize atım değil.^Elektriksel ventrikül hızı nasıl raporlanır?^vfRate
QT aracının iki fidüsiyeli tanımlanamıyor; önceki ritim aralıkları yeni kayda uygulanmıyor.^QT durumu hangisidir?^qtNone
P başlangıcı görünmüyor ve QRS ile sabit atriyal ilişki kurulamıyor.^PR için hangi ifade doğrudur?^prNone
VF modelinde aort,pulmoner,venöz ve koroner parçacıkların tamamı aynı yerde kalıyor.^İleri dolaşım için doğru açıklama nedir?^vfFlow
Yanıtsızlık ve dolaşım bulgusu yokluğu kaotik elektriksel görünümle birlikte.^Hangi klinik değerlendirme ilkesi uygundur?^urgent
Benzer kaotik monitor izi sırasında kişi konuşuyor ve klinik perfüzyonu normal bulunuyor.^Bu çelişki nasıl değerlendirilir?^vfArtifact
Kaotik I/II elektriksel değerleri aynı zamanda alınmış; III dönüşümle türetiliyor.^Bipolar ilişki hangisidir?^limb
VF’nin hem hızlı hem yavaş bileşenleri artırılmış sağ kol leadine aktarılıyor.^aVR formülü hangisidir?^avr
Kaotik sinyalin artırılmış sol kol izdüşümü de aynı I/II potansiyellerinden alınacak.^aVL formülü hangisidir?^avl
Kaotik sinyalin artırılmış inferior izdüşümü aynı I/II potansiyellerinden alınacak.^aVF formülü hangisidir?^avf
II’den V2’ye geçince kaotik dalganın şekli değişiyor; seçili kaynak VF kalıyor.^Lead seçimiyle değişen özellik hangisidir?^leadAll
Dalga ekran boyunca çizilmiş; dikey mV ve yatay saniye etiketleri farklı.^Ekran orantısı ve fiziksel ölçek için doğru ifade hangisidir?^timeScale
Arrest görünümü eğitim için sınırlandırılmış; neden,süre ve gerçek müdahale sonucu bilinmiyor.^Bu kayıt hangi genel çıkarım sınırını korumalıdır?^limits`,
pat:`
Sinüs dışı ayrık ters inferior P, izoelektrik aralık ve150/dk dar düzenli QRS birlikte.^Alt örüntü için hangi sınıflama savunulabilir?^at
II’de P tersken QRS dar; önceki sinüs P pozitifti, odak anatomisi kesin verilmemiş.^P ekseni nasıl yorumlanır?^atAxis
Üç saniyelik sürekli kayıtta ektopik P var; atağın başlangıcı ve sonu yok.^Paroksismal davranış için hangi sınır geçerlidir?^atLimits
P’nin ilk sapması−180ms,QRS’nin ilk sapması−40ms; P merkezi daha sonra.^PR kaçtır?^pr140
Organize ventriküler aralık400ms; atriyal P hızı da1:1 ilişkili.^Ventriküler elektriksel hız kaçtır?^rr400
QRS’nin ilk sapması−40ms, sonu+40ms; ektopik P ayrı bir dalga.^QRS süresi kaçtır?^q80
Hızlı atriyal örnekte T sonu+205ms,QRS ilk sapma−40ms.^Ham sentetik QT kaçtır?^qt245
Atriyal eksen değişmiş olsa da P sınırı ilk sapma olarak belirlenebiliyor.^PR için doğru tanım hangisidir?^pr
Ektopik P voltajı negatif; öğrenci bu olayı mekanik geri akım sanıyor.^P’nin temel elektriksel tanımı nedir?^p
Döngü400ms; koordine atriyal etkinlik sürse de diyastol kısa.^Hız ve doluş için hangi yorum uygundur?^fastFill
R’den45ms’de AV/çıkış kapakları kapalı;60ms’de ejeksiyon başlayacak.^45ms mekanik fazı hangisidir?^mechanic
R’den100ms’de semilüner kapaklar açık; ayrık ektopik P bu zamandan önce görülmüştü.^Bu mekanik kapak düzeni nedir?^eject
P ve QRS’nin anlık I/II bileşenleri aynı elektrot dönüşümünü kullanıyor.^aVL formülü hangisidir?^avl
LeadII’den V1’e geçince ektopik P izdüşümü farklılaşıyor; atriyal kaynak değişmiyor.^Lead değişimi nasıl açıklanır?^leadAll
150/dk elektriksel dizide palpasyon henüz yapılmamış; ektopik P’nin varlığı biliniyor.^Nabız değerlendirmesi için hangi sınır korunur?^pulse`,
flutter:`
Sürekli düzenli F tabanında150/dk dar QRS seçiliyor; atriyal etkinlik300/dk.^Örüntü sınıflaması hangisidir?^flutter
Bir F döngüsü200ms ve bir QRS döngüsü400ms; iki ayrı elektriksel kaynak ölçütü var.^Hız ve iletim ilişkisi hangi seçenektir?^flutterRatio
Tipik karşı-saat yönlü öğretim örneğinde inferior taban aşağı,V1 taban yukarı yönlü.^F polarite dağılımı hangisidir?^flutterPolarity
F dizisi QRS dışında kesintisiz sürüyor, ayrı sinüs P ve sessiz PR dizisi yok.^F ile P arasındaki ayrım nedir?^fNotP
R–R400ms; bir öğrenci atriyal300/dk sayısını ventriküler hız yerine yazıyor.^Ventriküler hız kaçtır?^rr400
Ventriküler kompleks−40/+40ms destekli; F etkinliği ölçüm dışında da sürüyor.^QRS süresi kaçtır?^q80
Sürekli F tabanında ilişkili ayrık P ilk sapması tanımlanamıyor.^PR durumu nedir?^prNone
Flutter2:1 örneğinin QRS başlangıcı−40ms,T sonu+205ms.^Ham sentetik QT kaçtır?^qt245
Hızlı ventriküler yanıt doluş zamanını azaltabilir; F genliği debi ölçümü değildir.^Hız–doluş için hangi yorum uygundur?^fastFill
100ms’de semilüner çıkış açıkken atriyal F etkinliği devam ediyor.^Mekanik kapak evresi nasıl açıklanır?^eject
300ms’de AV giriş açık, çıkışlar kapalı; F etkinliği yine devam ediyor.^Bu kapak ve hacim düzeni hangi evredir?^fill
İki F’ye bir QRS ilişkisi aynı kaynakta lead seçimi değişince de korunuyor.^Lead değişimi neyi değiştirir?^leadAll
I/II bileşenleriyle hem F tabanı hem QRS inferior artırılmış leadine aktarılıyor.^aVF dönüşümü hangisidir?^avf
R–R400ms elektriksel ölçütü var, fakat gerçek arter nabzı klinik muayenede ölçülecek.^Mekanik nabız için hangi sınır gerekir?^pulse
Bu kayıt yalnız2:1 flutter öğretim örneği; değişken iletim ve toplam atak süresi gösterilmemiş.^Genelleme için hangi çıkarım sınırı uygundur?^limits`,
sintach:`
II’de pozitif,aVR’de negatif ayrık P;120/dk dar düzenli P–QRS dizisi korunmuş.^Örüntü adı hangisidir?^tach
Atriyal P ekseni değişmemiş; yalnız uygun pozitif II/negatif aVR yönü sorgulanıyor.^Sinüs kökenini destekleyen P dağılımı hangisidir?^sinusAxis
Ateş ve ağrı olası nedenler olarak verilmiş; EKG sinüs kökenini gösteriyor ama nedeni seçmiyor.^Klinik neden yaklaşımı hangisidir?^tachCause
R–R0,500s; çizgi kalınlığı veya T voltajı hız hesabına katılmayacak.^Elektriksel hız kaçtır?^rr500
P ilk sapma−0,215s,QRS ilk sapma−0,040s.^PR’nin sayısal değeri kaçtır?^pr175
QRS80ms’nin desteği−40/+40ms; sonraki hızlı döngü500ms.^Kompleks süresi kaçtır?^q80
QRS ilk sapma−40ms,T sonu+205ms; hız düzeltmesi yapılmıyor.^Ham sentetik QT kaçtır?^qt245
Hızlı sinüs çiziminde P ve QRS’nin tepeleri değil ilk sapmaları işaretleniyor.^PR ölçümü için hangi tanım doğrudur?^pr
QRS’nin ana elektriksel kaynağı atriyal P’nin kaynağından ayrılıyor.^QRS’nin temel elektriksel tanımı hangisidir?^qrs
T hızlı döngü sonunda görülüyor; ejeksiyonla örtüşmesi mümkün.^T’nin temel elektriksel tanımı hangisidir?^t
45ms’de kasılma başlamış ama çıkış kapakları kapalı.^Bu kapak evresi hangi seçenekle açıklanır?^mechanic
110ms’de çıkış kapakları açık, AV kapaklar kapalı.^Bu an için hangi açıklama tutarlıdır?^eject
Yüksek hızda koordine atriyal P korunmuş ama döngü75/dk örneğe göre kısa.^Doluş süresi için hangi yorum uygundur?^fastFill
Oynatma0,5× yapılınca aynı model500ms döngüyü daha yavaş gösteriyor.^Hız kontrolünün anlamı hangi ifadedir?^speed
120/dk QRS kaydı yanında muayene nabzı ve kan basıncı henüz eklenmemiş.^Mekanik nabız hakkında hangi sınır korunur?^pulse`,
lbbb:`
Sinüs dizisinde160ms QRS, V1 negatif kompleks ve V6 geniş çentikli R; her atım aynı.^En uygun ileti sınıflaması hangisidir?^lbbb
Sağ prekordiyal ve lateral izler eşzamanlı; terminal yön dağılımı birlikte soruluyor.^LBBB’nin beklenen morfoloji bileşimi hangisidir?^lMorph
QRS ilk sapma−70ms, son dönüş+90ms; terminal çentik dahil.^QRS süresi kaçtır?^q160
P ilk sapma−245ms,QRS ilk sapma−70ms; R referansı başlangıç yerine kullanılmıyor.^PR kaçtır?^prL175
QRS ilk sapma−70ms,T sonu+360ms; ölçülen değer ham aralıktır.^Sentetik QT kaçtır?^qt430
Şerit geniş ama yalnız genişlik dışında morfoloji veya ventriküler köken kanıtı yok.^Genişlik yorumunda hangi sınır doğrudur?^qrsWidthCause
Sol ventrikül hareketi görsel olarak geciktirilmiş; hasta mekanik ölçümü yapılmamış.^Bu ayrıştırma nasıl yorumlanır?^bbbDelay
Yeni göğüs ağrısı var; LBBB’nin eski olup olmadığı önceki EKG’den araştırılıyor.^Dal bloğunun klinik yorumu hangi ilkeye bağlıdır?^bbbLimits
Çentikli R’nin iki lobu tek kompleks içinde; ayrı iki atım sayılmamalı.^QRS’nin temel elektriksel tanımı nedir?^qrs
Terminal R ve sonraki negatif T birbirinden ayrılmış; T klinik akım ölçümü değildir.^T’nin elektriksel tanımı hangisidir?^t
İki R referansı800ms aralıklı; geniş kompleks süresi160ms ayrıca verilmiş.^Ventriküler elektriksel hız kaçtır?^rr800
Kaliper yalnız ilk R lobunu kapsıyor; son çentik/terminal dönüş dışarıda.^Toplam QRS ölçümü için hangi sınırlar gerekir?^duration
Geniş QRS kaydı varken palpasyon ve basınç verisi ayrı toplanıyor.^Elektriksel hız–mekanik nabız ilişkisi nedir?^pulse
Lateral pozitif geniş QRS’nin I/II bileşenleri artırılmış sol kola dönüştürülüyor.^aVL formülü hangisidir?^avl
LeadV1’den V6’ya geçince QRS/T yönü değişiyor; ileti kaynağı aynı.^Lead seçiminin temel anlamı nedir?^leadAll`,
rbbb:`
Sinüs P sonrası140ms QRS, V1’de terminal R′ ve V6’da terminal S birlikte.^En uygun ileti sınıflaması hangisidir?^rbbb
Sağ ve lateral terminal QRS yönleri eşzamanlı karşılaştırılıyor; P ilişkisi sabit.^RBBB’nin tipik morfoloji bileşimi hangisidir?^rMorph
QRS−60ms’de başlayıp+80ms’de bitiyor; R′ dahil bütün destek ölçülüyor.^Toplam QRS süresi kaçtır?^q140
P−235ms,QRS−60ms ilk sapmaları verilmiş; terminal gecikme QRS içinde.^PR kaçtır?^prR175
QRS ilk sınırı−60ms,T son sınırı+350ms; QTc değil ham model aralığı.^Sentetik QT kaçtır?^qt410
140ms genişlik kaydedilmiş; tek süreyi PVC veya RBBB diye kesin etiyoloji seçmek isteniyor.^Genişlik için hangi sınır geçerlidir?^qrsWidthCause
Sağ ventrikül görsel olarak60ms ayrıştırılmış; hemodinamik doğrulama bulunmuyor.^Gecikmiş animasyon nasıl yorumlanır?^bbbDelay
Önceki EKG yok; yeni semptomlar ve yapısal hastalık ayrıca sorgulanıyor.^Dal bloğunun klinik yorumu için hangi yaklaşım uygundur?^bbbLimits
Terminal R′ QRS içindedir; ayrı T daha sonra ve sağda diskordan görünür.^QRS’nin temel elektriksel tanımı hangisidir?^qrs
Sağ negatif T ventriküler repolarizasyon bölümünde; arter basıncı kaydı değil.^T için doğru elektriksel anlam nedir?^t
R referansları800ms aralıklı;140ms aktivasyon genişliği farklı ölçüt.^Döngüden hesaplanan hız kaçtır?^rr800
Ölçüm yalnız ilk r lobuna yerleştirilmiş; geç R′ ve lateral S dışarıda bırakılıyor.^Toplam QRS için hangi sınırlar kullanılmalıdır?^duration
Geniş organize P–QRS dizisi var; nabzın varlığı ve gücü klinik muayeneye bırakılmış.^Nabız değerlendirmesi için hangi sınır geçerlidir?^pulse
I/II’den artırılmış sağ kol leadine terminal QRS bileşenleri de taşınıyor.^aVR formülü hangisidir?^avr
V1 ve V6 seçenekleri terminal yönü değiştiriyor; elektriksel kaynak sinüs ve sağ dal gecikmesi aynı.^Lead seçimi nasıl açıklanır?^leadAll`
};
// Comparable clinical interpretation alternatives for the general clinical tasks.
bank('urgent','O5',[
['Semptom/perfüzyonla acil değerlendirme ve uygun algoritma','Süren iskemik belirtiler,instabilite veya arrest bulguları acil klinik değerlendirme gerektirir; çizim tedavi talimatı değildir.'],
['Ritim düzenli kalıyorsa yalnız rutin kontrol','Elektriksel düzenlilik devam eden ağrı,presenkop veya dolaşım bozukluğu bağlamını rutinleştirmez.'],
['Önce kesin elektrofizyolojik mekanizma,sonra perfüzyon','Klinik instabilite ve perfüzyon değerlendirmesi kesin mekanizma çıkarımı beklenerek geciktirilmez.'],
['Önce tek derivasyondan damar/odak kesinliği','Tek derivasyon etiyolojik kesinlik sağlamaz; klinik aciliyet yeterli kanıtla değerlendirilir.'],
['Animasyonda akım varsa klinik aciliyet dışlanır','Şematik parçacık akışı hastanın gerçek dolaşım kararlılığını ölçmez ve acil belirtileri dışlamaz.']]);
bank('limits','O5',[
['Örüntü desteklenir; etiyoloji/risk ek veri ister','EKG örüntüsü tanımlanabilir; neden,süre ve hasta riski için klinik öykü ve ek inceleme gerekir.'],
['Kısa kayıt atağın başlangıç zamanını belirler','Kayıt yalnız bir pencereyi kapsar; başlangıç gösterilmeden toplam süre veya başlangıç kesinliği sağlanmaz.'],
['QRS genişliği tek başına hasta riskini dereceler','Genişlik iletiyi tanımlar; semptom,yapısal hastalık ve bağlam yerine risk derecesi oluşturmaz.'],
['P ekseni tek başına tam anatomik odağı belirler','P ekseni köken ipucudur; tam odak anatomisi yalnız sentetik izdüşümden kesinleştirilmez.'],
['Elektriksel hız tek başına dolaşım kararlılığıdır','Hız ve düzenlilik,klinik nabız/kan basıncı/perfüzyon verisinin yerine geçmez.']]);
const extraCases=[
['normal','Karşılaştırma panelinde düzenli sinüs QRS ile kaotik ikinci sinyal var; ikinci sinyalin klinik kaydı doğrulanacak.','Lead görünümü farklılığını ritim dönüşümünden ayırmak için hangi ilke uygundur?','leadAll'],
['pvc','Aynı140ms genişlikte tek erken olay ve her sinüs atımında terminal sağ gecikme karşılaştırılıyor.','Yalnız genişlikten kesin köken seçme sorunu hangi ilkeyle çözülür?','qrsWidthCause'],
['stemi','Ağrılı hastada komşu anterior yükselme var; başka hastanın inferior dağılımı öğretim karşılaştırmasına eklenmiş.','Bölgesel yorum yöntemi tek yüksek tepe seçmekten nasıl ayrılır?','stContiguous'],
['flutter','Sabit2:1 kayıtta atriyal200ms ve ventriküler400ms birlikte; AF örneğindeki düzensiz tabandan farklı.','Atriyal/ventriküler hız ayrımının hesaplanmış karşılığı hangisidir?','flutterRatio'],
['rbbb','Sağ terminal R′ ve lateral S’li sinüs kaydı var; başka örneğin sol/lateral terminal yönü ters.','Gösterilen sağ/lateral morfoloji bileşimi hangisidir?','rMorph']];
const extraQuestions=[
['af','AF’de hızlı ve kontrollü profiller aynı dar kompleks/f taban yapısını farklı döngü aralıklarında gösteriyor.','Hız profili ile atriyal ritim kaynağı nasıl birlikte yorumlanır?','afProfile'],
['vt','Organize geniş taşikardi ve kaotik VF eğitim karşılaştırması açık; nabız bilgisi yalnız klinik bölümden sağlanacak.','VT için acil yaklaşımı ayıran klinik veri hangisidir?','vtContext'],
['inferior','I−0,08mV ve II+0,20mV inferior ST bileşenleri,bir anterior kayıt değerleriyle karıştırılmadan kullanılıyor.','Artırılmış inferior anlık voltaj kaçtır?','avf24'],
['lbbb','Sol/lateral geniş çentikli R ile sağ negatif QRS birlikte; sağ dal örneğinde bunun yerine terminal R′ var.','Bu sol ileti örneğinde beklenen morfoloji bileşimi hangisidir?','lMorph'],
['vf','Kaotik bir görüntü ile düzenli dar QRS görüntüsü ayrı sentetik kaynaklardan; kaotik görüntüde R–R tanımlanamıyor.','Kaotik örneğin organize elektriksel hızı nasıl raporlanır?','vfRate']];
numberBank('grid200','25mm/sn orantısında5 küçük yatay kare:5×40ms=200ms.','200ms',['40ms','100ms','400ms','500ms'],['Yalnız bir küçük kare sayılmıştır.','İki küçük kareye yakın değer kullanılmıştır;5kare200ms’dir.','Her küçük kare yanlışlıkla80ms alınmıştır.','Dikey voltaj veya başka hız ölçeği zamanla karıştırılmıştır.']);
numberBank('pvcAverage','Beş döngü toplam4,00s:5/4×60=75/dk ortalama elektriksel hız.','75/dk',['54/dk','80/dk','125/dk','150/dk'],['1120ms en uzun aralık bütün dizinin ortalaması yerine kullanılmıştır.','Toplam4s ve5döngü hesabından çıkmaz.','480ms en kısa aralık bütün dizinin ortalaması yerine kullanılmıştır.','400ms varsayımı gerçek beş döngü toplamını kullanmaz.']);
numberBank('anteriorAVL','aVL=0,04−(−0,04)/2=+0,06mV.','+0,06mV',['+0,02mV','−0,06mV','0mV','−0,08mV'],['II’nin negatif yarısı çıkarılmak yerine eklenmiştir.','aVF sonucudur; aVL yönüyle karıştırılmıştır.','aVR’nin sıfır yarım toplamıdır; aVL değildir.','III sonucudur; artırılmış sol kol değildir.']);
numberBank('flutterCount','300/dk=5F/s ve150/dk=2,5QRS/s:6s’de30F ve15QRS.','30F ve15QRS',['15F ve30QRS','30F ve30QRS','15F ve15QRS','60F ve15QRS'],['Atriyal ve ventriküler kaynak sayıları ters çevrilmiştir.','Ventriküler sayıyı atriyal sayıya eşitlemek1:1 varsayımıdır.','Atriyal sayım300/dk yerine150/dk alınmıştır.','Atriyal frekans yanlışlıkla iki katına çıkarılmıştır.']);
numberBank('pToQR315','P başlangıcı−235ms,QRS sonu+80ms:315ms; PR175+QRS140.','315ms',['175ms','235ms','410ms','455ms'],['Yalnız PR sayılmış; QRS süresi eklenmemiştir.','R referansı bitiş kabul edilmiş; terminal80ms dışlanmıştır.','Bu QT410ms’dir; farklı başlangıç/bitiş sınırlarıdır.','QRS süresi iki kez eklenmiştir.']);
numberBank('inferiorAVR','aVR=−(−0,08+0,20)/2=−0,06mV.','−0,06mV',['+0,06mV','−0,18mV','+0,24mV','+0,28mV'],['Sağ kol yönü için gereken eksi işareti kaybolmuştur.','aVL sonucudur; sağ kol değildir.','aVF sonucudur; sağ kol değildir.','III sonucudur; artırılmış sağ kol değildir.']);
numberBank('pToQL335','P başlangıcı−245ms,QRS sonu+90ms:335ms; PR175+QRS160.','335ms',['175ms','245ms','430ms','495ms'],['Yalnız PR ölçülmüştür; QRS desteği dışlanmıştır.','R referansı terminal QRS sonu yerine kullanılmıştır.','Bu QT430ms’dir; P başlangıcından farklı ölçümdür.','QRS süresi iki kez eklenmiştir.']);
bank('afResidual','O4',[
['Atriyal katkı yokken pasif ventriküler doluş sürebilir','Organize atriyal kasılma kaybı,AV açık diyastoldeki pasif girişin tamamen kaybolması değildir.'],
['Atriyal katkı kaybı pasif girişi de sıfırlar','Pasif doluş ayrı basınç farklarına bağlıdır; atriyal kasılma yokluğu tüm girişin yokluğu değildir.'],
['f genliği pasif giriş hacmini doğrudan verir','f elektriksel atriyal voltajdır; pasif doluş hacmi için kalibre edilmiş ölçüm değildir.'],
['Dar QRS atriyal katkıyı geri oluşturur','Ventriküler ileti genişliği organize atriyal mekanik kasılmayı geri oluşturmaz.'],
['Kontrollü hız bütün doluşu aktif atriyal yapar','Hızın azalması P/organize atriyal katkı oluşturmaz; pasif ve aktif süreçler ayrı kalır.']]);
bank('organizedCompare','O2',[
['VT organize geniş kompleks; VF kaotik,komplekssiz','Bu karşılaştırmada VT ardışık seçilebilir tek biçimli geniş kompleksleri,VF organize QRS yokluğunu gösterir.'],
['VT kaotik,komplekssiz; VF organize geniş kompleks','İki ventriküler örüntünün organize/kaotik tanımları ters çevrilmiştir.'],
['VT ve VF aynı düzenli dar kompleks dizisidir','VT öğretim kaydı geniş,VF organize olmayan etkinliktir; ikisi dar düzenli dizi değildir.'],
['VT ve VF yalnız atriyal F frekanslarıdır','Her ikisi ventriküler aritmidir; atriyal flutter F dizisiyle tanımlanmaz.'],
['VT ve VF ayrımı yalnız ST yüksekliğidir','Organizasyon ve ventriküler kompleks yapısı temel ayrımdır; bölgesel ST dağılımı eş anlamlı değildir.']]);
bank('componentTransform','O3',[
['Tüm P,QRS,ST,T ve kaotik bileşenler birlikte dönüştürülür','Aynı elektrot farkları bütün anlık sinyale uygulanır; yalnız QRS’yi düzeltmek limb ilişkilerini tabanda/ST/T’de bozar.'],
['Yalnız QRS dönüştürülür,diğer bileşenler bağımsızdır','Bipolar/artırılmış kimlikler bütün anlık voltaj için geçerlidir; P,ST,T veya kaotik taban istisna değildir.'],
['Yalnız ST dönüştürülür,QRS bağımsız kalır','QRS de aynı elektrot potansiyellerinden gelir; ayrı rastgele lead voltajı ilişkiyi bozar.'],
['AF ve VF matematik ilişkisinden muaf tutulur','Düzensiz veya kaotik elektriksel kaynak elektrot farkı tanımlarını değiştirmez.'],
['Göğüs leadleri I+III toplamıyla zorunlu eşlenir','Einthoven kimliği ekstremite bipolar leadleri içindir; ayrı göğüs konumları aynı toplamla zorunlu belirlenmez.']]);
extraCases[0]=['normal','Normal sinüs şeridinde kaliper iki noktayı5 küçük yatay kare ayırıyor; çizim25mm/sn orantısında.','Bu zaman aralığı kaçtır?','grid200'];
extraCases[1]=['pvc','PVC dizisinin beş ardışık döngüsü800,800,480,1120,800ms; kısa ve uzun aralar birlikte veriliyor.','Bu beş döngüde ortalama elektriksel hız kaçtır?','pvcAverage'];
extraCases[2]=['stemi','Anterior ST anlık bileşenleri I+0,04mV,II−0,04mV; lateral artırılmış sinyal ayrı hesaplanıyor.','aVL ST voltajı kaçtır?','anteriorAVL'];
extraCases[3]=['flutter','Sabit2:1 öğretim ritmi300/dk atriyal,150/dk ventriküler; sayım penceresi6s olarak verilmiş.','Bu pencerenin atriyal/ventriküler çevrim sayıları hangisidir?','flutterCount'];
extraCases[4]=['rbbb','RBBB sinüs atımında P başlangıcı−235ms,QRS sonu+80ms; PR ile QRS birleştirilerek ölçülüyor.','P başlangıcından QRS sonuna toplam süre kaçtır?','pToQR315'];
extraQuestions[0]=['af','AF’de atriyum koordine kasılmıyor; ventriküler diyastolde AV açık kalabiliyor ve pasif giriş çizilmiş.','Atriyal katkı ile pasif doluşun ayrımı hangisidir?','afResidual'];
extraQuestions[1]=['vt','VT kaydındaki tek biçimli geniş kompleks dizisi,ayrı verilen kaotik VF morfolojisiyle karşılaştırılıyor.','Organize elektriksel etkinlik açısından doğru karşılaştırma hangisidir?','organizedCompare'];
extraQuestions[2]=['inferior','I−0,08mV,II+0,20mV aynı inferior ST anından; sağ kol artırılmış referans isteniyor.','aVR ST bileşeni kaçtır?','inferiorAVR'];
extraQuestions[3]=['lbbb','LBBB atımında P başlangıcı−245ms,QRS sonu+90ms; PR ve QRS birleştirilerek ölçülecek.','Bu toplam atriyal başlangıç–ventriküler depolarizasyon sonu aralığı kaçtır?','pToQL335'];
extraQuestions[4]=['vf','Kaotik örnekte voltaj tabanı ve hızlı salınımlar aynı ekstremite elektrot potansiyellerinden geliyor.','Tüm zamanlarda limb tutarlılığı hangi dönüşüm kapsamıyla sağlanır?','componentTransform'];
const labels={normal:'Normal sinüs ritmi',af:'Atriyal fibrilasyon',stemi:'Anterior ST yükselmesi örneği',pvc:'Ventriküler erken atım',svt:'Düzenli dar kompleks taşikardi',inferior:'İnferior ST yükselmesi örneği',vt:'Monomorfik VT örneği',vf:'VF elektriksel örneği',pat:'Fokal atriyal taşikardi',flutter:'2:1 flutter örneği',sintach:'Sinüs taşikardisi',lbbb:'LBBB örneği',rbbb:'RBBB örneği'};
const modeSources={normal:['ECG','CYCLE'],af:['AF2024'],stemi:['ACS2023'],pvc:['VA2022'],svt:['SVT2019'],inferior:['ACS2023'],vt:['VA2022','ALS2025'],vf:['VA2022','ALS2025'],pat:['SVT2019'],flutter:['SVT2019'],sintach:['SVT2019','ECG'],lbbb:['BBB2009'],rbbb:['BBB2009']};
const leads={normal:['II','aVF','V3'],af:['II','aVF','V1'],stemi:['II','aVL','V3'],pvc:['II','aVR','V1'],svt:['II','aVF','V1'],inferior:['II','aVF','V1'],vt:['II','aVR','V1'],vf:['II','aVF','V1'],pat:['II','aVF','V1'],flutter:['II','aVF','V1'],sintach:['II','aVF','V3'],lbbb:['I','aVL','V6'],rbbb:['I','aVR','V1']};
function authoredRows(rows,extra){return Object.entries(rows).flatMap(([mode,text])=>text.trim().split('\n').map(row=>{const [stem,task,b]=row.split('^');return [mode,stem,task,b];})).concat(extra);}
function display(text){return text.replace(/(\p{L})([0-9])/gu,'$1 $2').replace(/([0-9])(\p{L})/gu,'$1 $2').replace(/([,;:])(?=\p{L})/gu,'$1 ').replace(/\bV ([1-6])\b/g,'V$1');}
function makeItems(rows,prefix){return rows.map(([mode,stem,task,bankId],i)=>{const b=banks[bankId];if(!b||!stem||!task)throw new Error('Missing authored item '+prefix+(i+1));const correct=i%5,order=Array.from({length:5},(_,j)=>(j-correct+5)%5),id=prefix+String(i+1).padStart(3,'0'),sources=new Set(modeSources[mode]);if(b.objective==='O3'||b.objective==='O6')sources.add('ECG');if(b.objective==='O4')sources.add('CYCLE');return {id,mode,title:(prefix==='C'?'Sentetik vaka ':'Sentetik değerlendirme ')+id,ariaLabel:id+' için üç derivasyonlu sentetik kayıt; zaman saniye,voltaj mV',stem:'Sınırlandırılmış sentetik eğitim senaryosu. '+display(stem),question:display(task),text:display(task),options:order.map(n=>display(b.options[n])),correct,explanations:order.map(n=>display(b.explanations[n])),feedback:display(b.explanations[0]),objectiveIds:[b.objective],sourceIds:[...sources],decisionId:bankId,ecg:{mode,options:mode==='af'?{afProfile:bankId==='fastFill'?'rapid':'controlled'}:{},leads:[...leads[mode]],start:mode==='pvc'?.6:.5+(i%5)*.08,seconds:3.2}};});}
const cases=makeItems(authoredRows(caseRows,extraCases),'C'),questions=makeItems(authoredRows(quizRows,extraQuestions),'Q');
if(cases.length!==200||questions.length!==200)throw new Error('400 authored items required');
function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
root.PulseCurriculum=freeze({version:6,sessionSize:10,labels,cases,questions,byId:Object.fromEntries([...cases,...questions].map(item=>[item.id,item])),limitations:'400 sentetik madde ve13 örüntü bağımsız klinisyen veya psikometrik doğrulamadan geçmemiştir.16s gözlem yalnız akış kuralıdır.'});
})(window);
