# Ajan Yönergesi — EGEMED Pulse: Footer ve "Hakkında" sayfasını EGEMED Ausculta ile hizala

Bu yönerge, **EGEMED Pulse** (etkileşimli EKG simülatörü) deposunda çalışan bir kodlama ajanı içindir.
Amaç: EGEMED Ausculta (kardiyopulmoner oskültasyon simülatörü) ile **aynı ekip, aynı kurum, aynı
marka dili**; footer ve Hakkında sayfası görsel/içerik olarak birbirinin eşi olsun. Aşağıdaki kod ve
veri parçaları Ausculta deposundan alınmıştır — Pulse'un kendi teknolojisine (React/Vue/vanilla vb.)
uyarlayarak uygula; sınıf adları ve düzen birebir korunmalı.

Kurallar: mevcut kod stilini koru, git commit yapma (kullanıcı onaylayacak), sonunda dosya listesi ve
ekran görüntüsüyle raporla. Tıbbi/klinik içeriğe, EKG mantığına ve skorlamaya DOKUNMA.

---

## 0) Önce depoyu tanı
- Uygulama kabuğunu (header/footer bileşenleri), global CSS/tasarım tokenlarını, "Kaynaklar/Hakkında/
  Lisanslar" türünde mevcut bir sayfa varsa onu ve makine okunur atıf/veri dosyasını (varsa) bul.
- Pulse'ta kullanılan EKG veri seti/kaynakların lisans ve atıf bilgilerini topla (PhysioNet PTB-XL,
  MIT-BIH vb. hangileri kullanılıyorsa). Yoksa kullanıcıya sor; **uydurma**.
- Ege Üniversitesi Tıp Fakültesi amblemi: `https://egelogo.ege.edu.tr/` → "Tıp Fakültesi → PNG"
  (`download/fak/tipfak/tipfakpng.rar`, içinde `tip-fak.png` 1200×1200 şeffaf). **Hazır küçültülmüş
  kopyalar bu depoda:** `baseline/ausculta-brand/ege-tip-logo.png` (800px) ve `ege-tip-seal-128.png`
  — bunları `public/brand/` (ya da Pulse'un statik varlık klasörü) altına kopyala; indirmen gerekmez.
  Kaynağı veri dosyasına yaz: `https://egelogo.ege.edu.tr/`.

---

## 1) Footer (tüm ekranlarda aynı)

Metin (tek satır, ortalı, marka adı kalın, ™ üst simge):

> **EGEMED Pulse™** Etkileşimli EKG Simülatörü, Ege Üniversitesi Tıp Fakültesi Dekanlığı tarafından geliştirilmiştir. Tüm hakları saklıdır © 2026

- Solunda ürünün kendi ikon logosu (26×26 px). Logo + metin **birlikte ortalanır**.
- Sağda (yalnız ≥1500px) veri seti atıfı: `EKG verileri: <veri seti> · <lisans>` — Pulse'ta ne
  kullanılıyorsa (yoksa bu kısmı kaldır).
- Dar ekranlarda kademeli kısalma: ≤1500 sağ atıf gizli → ≤1100 "…Dekanlığı tarafından geliştirilmiştir."
  gizli → ≤860 alt başlık gizli → ≤720 telif gizli. Yani mobilde yalnız logo + "EGEMED Pulse™".
- Footer opak zemin, `position: relative; z-index: 1` (arka plan dekorları üstüne binmesin), 52px
  yükseklik (kısa ekranlarda 44px). Doküman tipi sayfalarda (landing, hakkında, sonuçlar) footer
  içeriğin **sonunda** (sabit değil); uygulama ekranında (EKG sahnesi) sabit olabilir.
- Header'daki marka adına da ™ ekle: `Pulse<sup class="tm">™</sup>`.

### JSX referansı (Ausculta)
```tsx
export function Footer() {
  return (
    <footer className="eg-footer">
      <div className="footer-left">
        <img src="brand/logo-icon-web.png" alt="" className="footer-seal" />
        <span className="footer-text">
          <span className="footer-brand">EGEMED Pulse<sup className="tm">™</sup></span>
          <span className="footer-sub"> Etkileşimli EKG Simülatörü</span>
          <span className="footer-inst">, Ege Üniversitesi Tıp Fakültesi Dekanlığı tarafından geliştirilmiştir.</span>
          <span className="footer-copy"> Tüm hakları saklıdır © 2026</span>
        </span>
      </div>
      <div className="footer-right">
        <span className="footer-attr2">EKG verileri: {/* veri seti · lisans */}</span>
      </div>
    </footer>
  )
}
```

### CSS referansı
```css
.tm { font-size: .5em; vertical-align: super; margin-left: 1px; font-weight: 600; letter-spacing: 0; }
.eg-footer { display: flex; align-items: center; justify-content: center; gap: 12px; position: relative; z-index: 1;
  background: var(--card); color: var(--ink-600); height: var(--foot-h, 52px); flex-shrink: 0;
  padding: 0 18px env(safe-area-inset-bottom, 0px); border-top: 1px solid var(--border); font-size: var(--fs-sm, 13px); }
.footer-left { display: flex; align-items: center; gap: 8px; flex: 0 1 auto; min-width: 0; justify-content: center; }
.footer-seal { width: 26px; height: 26px; display: block; }
.footer-text { display: block; flex: 0 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; line-height: 1.3; }
.footer-brand { font-weight: 800; color: var(--navy-800); }
.footer-sub, .footer-copy, .footer-attr2 { color: var(--ink-600); }
.footer-inst { font-weight: 500; }
.footer-right { display: flex; align-items: center; flex-shrink: 0; }
@media (max-width: 1500px) { .eg-footer .footer-attr2 { display: none; } }
@media (max-width: 1100px) { .footer-inst { display: none; } }
@media (max-width: 860px)  { .footer-sub { display: none; } }
@media (max-width: 720px)  { .footer-copy { display: none; } }
```
Renk tokenları Pulse'ta yoksa Ausculta paletinden al: `--navy-800:#0d346f`, `--ink-600:#46618c`,
`--ink-800:#1b3a6b`, `--border:#d9e5f4`, `--card:#fff`, `--blue-600:#1673e6`, `--blue-700:#0f62d8`,
`--blue-50:#eff6ff`, `--blue-100:#dbeafe`, `--card-soft:#f4f8fe`, `--navy-900:#0a2a5e`, `--navy-700:#10457e`.

---

## 2) Header düğmesi
- "Kaynaklar"/"Lisanslar" türü düğme varsa adı **"Hakkında"** olsun, ikonu **bilgi (ⓘ)** ikonu;
  `aria-label="Hakkında"`, `title="EGEMED Pulse Hakkında"`. Etiket her genişlikte görünür
  (yalnız ≤720px'te ikon-only). Landing'deki ikincil bağlantı: "Hakkında ve kaynaklar".

---

## 3) "Hakkında" sayfası — bölüm sırası ve içerik

Sayfa başlığı: **EGEMED Pulse™ Hakkında** (`<h1 class="src-title">`), alt metin:
"EGEMED Pulse™ Etkileşimli EKG Simülatörü'nü geliştiren ekip, kurum bilgisi ve modülde kullanılan
EKG verilerinin atıf ve lisans bilgileri." Sayfa doküman akışında (sayfa düzeyinde scroll), sola
hizalı, `max-width: 1240px`.

### 3.1 Geliştiriciler (EN ÜSTTE) — 3 sütun, hepsi lacivert kart
Ünisis profillerine bağlantı **ver**, ama "Kişi adları … Ünisis profillerine bağlanır" gibi bir
açıklama cümlesi **yazma**. Veri (makine okunur dosyaya koy, ör. `src/data/sources.json` → `credits`):

```json
"credits": [
  { "role": "Yazılım geliştirme, öğretim ve ölçme-değerlendirme tasarımı",
    "people": [ { "name": "Doç. Dr. Ozan KARACA", "url": "https://unisis.ege.edu.tr/researcher=ozan.karaca" } ] },
  { "role": "Öğretim tasarımı ve tıbbi validasyon",
    "people": [
      { "name": "Prof. Dr. Hatice ŞAHİN", "url": "https://unisis.ege.edu.tr/researcher=hatice.sahin" },
      { "name": "Prof. Dr. Burcu BARUTÇUOĞLU", "url": "https://unisis.ege.edu.tr/researcher=burcu.barutcuoglu" },
      { "name": "Prof. Dr. İpek KAPLAN BULUT", "url": "https://unisis.ege.edu.tr/researcher=ipek.kaplan.bulut" } ] },
  { "role": "Kullanıcı kabul testleri",
    "people": [ { "name": "Öğrenci 1" }, { "name": "Öğrenci 2" }, { "name": "Öğrenci 3" } ] }
]
```
> Pulse'ta tıbbi validasyon ekibi farklıysa (ör. kardiyoloji), kullanıcıdan isim/Ünisis adresi iste;
> Ünisis adres biçimi `https://unisis.ege.edu.tr/researcher=ad.soyad` (Türkçe karakterler sadeleştirilmiş).

Görünüm: her grup `credit-group lead` (lacivert degrade, beyaz rol başlığı büyük harf), kişiler
alt alta **pill** rozet (baş harf avatarı + ad + ↗). `url` olanlar `<a target="_blank"
rel="noreferrer">`, olmayanlar bağlantısız (gri avatar). Baş harfler unvanları (Prof., Doç., Dr.)
atlayarak üretilir (ör. "Doç. Dr. Ozan KARACA" → "OK").

```css
.credit-groups { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
@media (max-width: 1024px) { .credit-groups { grid-template-columns: 1fr; } }
.credit-group { border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 12px; box-shadow: var(--shadow-card); }
.credit-group.lead { background: linear-gradient(135deg, var(--navy-900), var(--navy-700)); color: #fff; }
.credit-group.lead .credit-role { color: var(--blue-100); }
.credit-role { font-size: 12px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; }
.credit-people { display: flex; flex-direction: column; align-items: stretch; gap: 8px; margin: 0; padding: 0; list-style: none; }
.credit-person { display: inline-flex; align-items: center; justify-content: flex-start; gap: 8px; min-height: 44px; padding: 6px 12px 6px 6px;
  border-radius: 999px; border: 1px solid var(--border); background: rgba(255,255,255,.92); color: var(--ink-900, #0b2559); font-weight: 600; text-decoration: none; }
a.credit-person:hover, a.credit-person:focus-visible { border-color: var(--blue-500, #2e8df7); background: var(--blue-50); color: var(--blue-700); }
.credit-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--blue-600); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; flex-shrink: 0; }
.credit-person.placeholder .credit-avatar { background: var(--ink-300, #a5b9d6); }
.credit-person .ext { font-size: 12px; color: var(--ink-400, #7c93b8); font-weight: 500; }
```

### 3.2 Kurum
Kart: solda Ege Üniversitesi Tıp Fakültesi amblemi (64×64), sağda:
- Başlık: **EGEMED Pulse™ — Etkileşimli EKG Simülatörü**
- Paragraf: "Ege Üniversitesi Tıp Fakültesi Dekanlığı tarafından, tıp fakültesi öğrencilerinin EKG
  yorumlama becerilerini geliştirmek amacıyla hazırlanmıştır. Tüm hakları saklıdır © 2026."
- **Bilimsel kanıt cümlesi + atıf** (EKG'ye özgü; doğrulanmış):
  > Yapılandırılmış, göreve özgü EKG yorumlama eğitiminin yorumlama yeterliğini geliştirdiği sistematik derleme ve meta-analizle gösterilmiştir.[1]
  >
  > [1] Oh S-Y, Cook DA, Van Gerven PWM, Nicholson J, Fairbrother H, Smeenk FWJM, Pusic MV. *Physician training for electrocardiogram interpretation: a systematic review and meta-analysis.* Acad Med. 2022;97(4):593–602. doi:10.1097/ACM.0000000000004607 — https://doi.org/10.1097/ACM.0000000000004607

  Veri dosyasına `module.evidence = { statement, citation, doi, url }` olarak yaz; `[1]` ve doi
  bağlantı olsun. Başka atıf **ekleme**; bu atfı değiştirmeden kullan.

### 3.3 EKG Veri Setleri / Kaynaklar
Kart ızgarası (`ds-grid`, `minmax(320px,1fr)`): başlık, yazarlar, çipler (lisans yeşil; kayıt sayısı;
popülasyon), anahtar-değer satırları (Veri seti → DOI/URL tıklanabilir, Makale DOI, Lisans → lisans
URL'si tıklanabilir, Kullanım), altta kesikli çizgiyle ayrılmış tam atıf metni. **Lisans etiketi veriden
gelsin** (sabit "CC BY" yazma). Hangi veri setlerinin kullanıldığını depodan doğrula.

### 3.4 Görsel varlıklar (varsa) — aynı kart biçimi.

### 3.5 Sorumluluk notu
Sarı/turuncu bilgi kutusu: "Simülasyon eğitim amaçlıdır; tek başına klinik tanı koymak için
kullanılamaz." + "Atıf ve katkı verileri makine okunur biçimde `src/data/sources.json` dosyasında
saklanır." (dosya adını Pulse'a göre uyarla).

### 3.6 "← Geri" düğmesi

### Bölüm başlıkları
`<h2>` ikonlu (kalp/doküman/kitap benzeri 20px ikon, mavi), `font-size: 20px`, `color: var(--navy-800)`.

---

## 4) Landing (isteğe bağlı ama Ausculta ile aynı)
Landing'in solunda, dikey ortada, **silik** (opacity .08, grayscale) ve **sola yaslı** büyük kurum
amblemi: `left: clamp(12px,3vw,56px); width: min(64vh,30vw); max-width: 560px; pointer-events:none;
z-index:0`. Dosya yoksa (`onError`) gizle.

---

## 5) Doğrulama ve rapor
1. Proje testleri, tip denetimi ve lint geçmeli.
2. 1366×768 ve 390×844'te ekran görüntüsü al ve **kendin incele**: footer tek satır ve ortalı, ™
   görünür, header'da "Hakkında" ⓘ etiketi, Hakkında sayfasında 3 lacivert sütun, atıf bağlantısı
   çalışır (`href` doğru), yatay taşma yok (`document.documentElement.scrollWidth <= innerWidth`).
3. Rapor: değişen dosyalar, veri dosyasına eklenen alanlar (`module`, `credits`, `evidence`),
   kullanıcıya sorulması gereken eksikler (Pulse'a özgü veri seti lisansları, farklı validasyon ekibi
   üyeleri, öğrenci isimleri).
