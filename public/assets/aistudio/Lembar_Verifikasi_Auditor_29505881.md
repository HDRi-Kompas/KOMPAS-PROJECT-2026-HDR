## Petunjuk
| Lembar verifikasi auditor KOMPAS |
| --- |
| Tujuan: kamu menilai 5 dataset sendiri-sendiri. Hasilmu dibandingkan dengan auditor lain dan dengan kodean tim untuk mengukur seberapa konsisten aturan penilaiannya. |
| Langkah |
| 1. Simpan salinan berkas ini dengan namamu, misalnya Lembar\_Auditor\_NamaKamu.xlsx. |
| 2. Buka berkas mentah dataset yang ada di sheet Isi (baris 5). XML bisa dibuka dengan browser atau editor teks; JSON dengan editor teks. |
| 3. Untuk setiap elemen (E01 sampai E32), baca aturannya di sheet Aturan, cari elemen itu di berkas mentah, lalu isi 1, 0,5, atau 0 di sheet Isi. |
| 4. Beri catatan singkat pada setiap nilai 0,5 dan pada nilai yang kamu ragukan. Tidak perlu menulis catatan untuk nilai yang jelas. |
| 5. Jangan membuka sheet Kodean di berkas utama dan jangan berdiskusi dengan auditor lain sampai kamu selesai. Itu yang membuat hasilnya bisa dipakai sebagai validasi. |
| 6. Kalau sebuah elemen tidak punya padanan di berkas (misalnya berkas ESRI atau JSON), isi 0. |
| 7. Kirim berkasmu ke Ketua. Ketua yang memasukkan hasilnya ke sheet Kesepakatan. |
| Makna nilai |
| 1 = ada dan bermakna. 0,5 = ada tetapi generik, templat, sebagian, atau tidak konsisten. 0 = kosong atau tidak ada. Elemen yang hanya berisi tanda hubung, "n/a", "Belum Ada", atau teks bawaan perangkat lunak tidak bernilai 1. |
| Perkiraan waktu: 2 sampai 3 jam untuk 5 dataset. Mulai dari dataset yang paling pendek (D12) supaya terbiasa dengan aturannya. |
| Jika aturan tidak cukup jelas untuk memutuskan, pilih nilai yang menurutmu paling masuk akal dan tulis alasanmu di kolom Catatan. Itu justru informasi yang berguna. |

## Aturan
| Aturan penilaian per elemen (salinan dari sheet Checklist) | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ID | Elemen | Kategori | Nilai 1 | Nilai 0,5 | Nilai 0 | Letak di XML ISO 19139 (gmd) | Padanan ESRI | Padanan CKAN | Definisi tambahan (E27-E32) |
| E01 | Bahasa metadata (dan bahasa data bila ada) | Informasi umum | Kode ISO 639 valid dan sesuai isi | Teks bebas atau tidak sesuai isi (mis. eng untuk isi berbahasa Indonesia) | Tidak ada | gmd:language; MD\_DataIdentification/gmd:language | mdLang/languageCode | extras: metadata-language |  |
| E02 | Nama dan versi standar metadata | Informasi umum | Tertulis tepat "SNI 8843-1:2019" ATAU "ISO 19115-1:2014" / "ISO 19115-3" (beserta versi/tahunnya). | Tertulis standar lama seperti "ISO 19115:2003", "ISO 19139", atau hanya menyebut "SNI 8843" tanpa versi yang jelas. | Tidak ada | gmd:metadataStandardName; gmd:metadataStandardVersion | (tidak ada) | (tidak ada) |  |
| E03 | Tautan akses data atau layanan | Informasi umum | Tautan unduh langsung atau layanan fitur (WFS, FeatureServer), bukan jalur lokal | Hanya layanan visual (WMS, MapServer) atau halaman informasi | Tidak ada, jalur lokal, atau teks templat (ketersediaan online tidak diuji) | gmd:distributionInfo//gmd:onLine/gmd:linkage | Esri/DataProperties/itemProps/itemLocation | resources[].url |  |
| E04 | Judul informatif | Identifikasi | Judul deskriptif memuat tema dan lokasi | Kode, nama berkas, atau tanpa lokasi | Tidak ada | gmd:citation//gmd:title | dataIdInfo/idCitation/resTitle | title |  |
| E05 | Tanggal sitasi dan jenis tanggal | Identifikasi | Tanggal dengan jenis (creation, publication, revision) | Hanya tanggal sistem atau tanpa jenis | Tidak ada | gmd:citation/gmd:date (CI\_Date + dateType) | idCitation/date; Esri/CreaDate | extras: dataset-reference-date |  |
| E06 | Identifier unik | Identifikasi | UUID atau kode terstruktur tanpa spasi | Teks bebas berspasi atau nama berkas pendek | Tidak ada | gmd:fileIdentifier | (tidak ada) | id; extras: guid |  |
| E07 | Abstrak | Deskripsi | Menjelaskan isi, cakupan, atau penggunaan dataset secara spesifik | Generik, definisi umum, atau mengulang judul | Tidak ada | gmd:abstract | dataIdInfo/idAbs | notes |  |
| E08 | Tujuan (purpose) | Deskripsi | Tujuan atau peruntukan spesifik | Templat, generik, atau hanya pembatasan peruntukan | Kosong atau nilReason=missing | gmd:purpose | dataIdInfo/idPurp | (tidak ada) |  |
| E09 | Kata kunci | Deskripsi | Dua atau lebih kata kunci relevan (tema, lokasi), terpisah | Satu kata kunci, generik, atau digabung dalam satu elemen | Tidak ada | gmd:descriptiveKeywords | dataIdInfo/searchKeys | tags |  |
| E10 | Kategori topik ISO | Deskripsi | Nilai ISO sesuai isi | Ada tetapi kurang sesuai | Tidak ada | gmd:topicCategory | dataIdInfo/tpCat | (tidak ada) |  |
| E11 | Lisensi atau batasan penggunaan | Deskripsi | Status penggunaan dinyatakan jelas (lisensi, terbuka, atau batasan spesifik) | Hanya batasan teknis, atau teks templat | Tidak ada, kosong, atau 'Not Specified' | gmd:resourceConstraints (useLimitation, otherConstraints) | dataIdInfo/resConst | extras: licence, access\_constraints; license\_title |  |
| E12 | Deskripsi atribut atau katalog fitur | Deskripsi | Katalog fitur atau definisi atribut tersedia atau tertaut | Daftar atribut tanpa definisi, atau rujukan kosong | Tidak ada | gmd:contentInfo/gmd:MD\_FeatureCatalogueDescription | eainfo | (tidak ada) |  |
| E13 | Bounding box | Cakupan | Valid dan sesuai lingkup dataset | Valid tetapi terlalu luas atau sebagian tidak sesuai | Tidak ada atau 0,0,0,0 | gmd:extent//gmd:EX\_GeographicBoundingBox | dataIdInfo/dataExt/geoEle | extras: bbox-\*, spatial |  |
| E14 | Cakupan temporal | Cakupan | Periode atau waktu data terstruktur dan konsisten | Ada tetapi tidak konsisten, atau hanya dalam teks | Tidak ada | gmd:extent//gmd:temporalElement | dataIdInfo/dataExt/tempEle | (tidak ada) |  |
| E15 | Sistem referensi koordinat | Cakupan | Menggunakan Sistem Referensi Geospasial Indonesia (SRGI) secara eksplisit atau kode EPSG yang merujuk langsung pada SRGI. | Valid tetapi hanya menggunakan EPSG:4326 (WGS84) tanpa menyebut SRGI, ATAU tidak konsisten dengan layanan yang disediakan. | Tidak ada | gmd:referenceSystemInfo | refSysInfo; Esri/DataProperties/coordRef | extras: spatial-reference-system |  |
| E16 | Akurasi posisi | Ketelitian | Ada nilai/uraian terukur (misal CE90, LE90, RMSE) DAN memenuhi/mengacu pada elemen akurasi posisi SNI ISO 19157. | Pernyataan kualitatif tanpa nilai angka (misal "akurasi baik"), ATAU tidak mengacu pada SNI ISO 19157. | Tidak ada | gmd:dataQualityInfo//DQ\_\*PositionalAccuracy | dqInfo | (tidak ada) |  |
| E17 | Akurasi tematik atau laporan kualitas lain | Ketelitian | Laporan kualitas mencakup minimal 2 dari 5 elemen SNI ISO 19157 (Kelengkapan, Konsistensi Logis, Akurasi Posisi, Temporal, Tematik) dengan hasil terukur. | Hanya mencakup 1 elemen kualitas, ATAU laporan tidak lengkap (misal: hanya menyebut ambang batas tanpa hasil), ATAU berisi teks templat. | Tidak ada | gmd:dataQualityInfo//gmd:report | dqInfo | (tidak ada) |  |
| E18 | Skala atau resolusi | Ketelitian | Elemen terstruktur | Hanya dalam judul atau teks, atau tidak konsisten | Tidak ada | gmd:spatialResolution | dataIdInfo/dataScale | (tidak ada) |  |
| E19 | Organisasi penanggung jawab | Kontak | Organisasi spesifik tercantum | Generik atau bukan organisasi | Tidak ada atau nilReason=missing | gmd:contact, gmd:pointOfContact//gmd:organisationName | dataIdInfo/idPoC | extras: responsible-party; organization |  |
| E20 | Sarana kontak valid | Kontak | Email institusional valid | Hanya telepon, email non-institusi, atau domain tampak keliru | Tidak ada atau placeholder | gmd:contactInfo//gmd:electronicMailAddress, gmd:phone | idPoC/rpCntInfo | extras: contact-email |  |
| E21 | Peran (role) | Kontak | Nilai codelist ISO | Teks bebas atau campuran | Tidak ada | gmd:role | idPoC/role | extras: responsible-party.roles |  |
| E22 | Tanggal metadata | Meta-metadata | Ada dan logis | Ada tetapi tidak konsisten | Tidak ada | gmd:dateStamp | mdDateSt | extras: metadata-date |  |
| E23 | Frekuensi pembaruan | Meta-metadata | Nilai valid selain unknown | unknown, teks bebas, atau tidak lengkap | Tidak ada | gmd:resourceMaintenance, gmd:metadataMaintenance | resMaint | extras: frequency-of-update |  |
| E24 | Pernyataan lineage | Pemrosesan | Menyebut sumber, metode, atau waktu (minimal dua) | Generik, salinan abstrak, rujukan peraturan, atau templat | Kosong | gmd:dataQualityInfo//gmd:LI\_Lineage/gmd:statement | Esri/DataProperties/lineage | extras: lineage |  |
| E25 | Sumber data | Pemrosesan | Sumber data spesifik | Generik (mis. 'survei') | Tidak ada | gmd:LI\_Lineage/gmd:source | lineage/Process (masukan) | (tidak ada) |  |
| E26 | Langkah atau metode pemrosesan | Pemrosesan | Langkah atau metode diuraikan | Riwayat otomatis atau sangat generik | Tidak ada | gmd:LI\_Lineage/gmd:processStep | lineage/Process | (tidak ada) |  |
| E27 | Representasi Spasial (Topologi & Geometri) | Informasi umum | Menyebutkan topologi, geometri, dan jumlah objek | Hanya menyebut salah satu dari topologi/geometri | Tidak ada | gmd:spatialRepresentationInfo | ESRI XML: spatRepInfo/VectSpatRep dengan topLvl/TopoLevCd (topologi), geometObjs/geoObjTyp/GeoObjTypCd (geometri), dan geometObjs/geoObjCnt (jumlah objek). | Tidak ada padanan CKAN. Rekaman tidak memuat topologi, geometri, atau jumlah objek; nilai 0. | 1 bila topologyLevel, geometricObjectType, dan geometricObjectCount (> 0) semuanya ada. 0,5 bila satu atau dua unsur ada (jumlah objek bernilai 0 dianggap tidak valid). 0 bila elemen tidak ada atau kosong. |
| E28 | Lingkup Metadata (Metadata Scope) | Informasi umum | Ada MD\_ScopeCode (dataset) dan nama spesifik | Hanya ada MD\_ScopeCode tanpa nama | Tidak ada | gmd:hierarchyLevel | ESRI XML: mdHrLv/ScopeCd (kode lingkup) dan mdHrLvName (nama lingkup). | CKAN extras: resource-type (padanan hierarchyLevel; hasil harvest dari ISO). Nama lingkup tidak ada, sehingga paling tinggi 0,5. | 1 bila kode lingkup ada dan nama lingkup berisi teks spesifik. Nama yang hanya berupa kata lingkup ISO (dataset, series, featureType, service, dan sejenisnya) tidak spesifik. 0,5 bila hanya kode atau nama tidak spesifik. 0 bila tidak ada. |
| E29 | Katalog Simbol (Portrayal Catalogue) | Deskripsi | Ada sitasi ke dokumen aturan simbol/SNI | Ada teks tapi tidak spesifik | Tidak ada | gmd:portrayalCatalogueInfo | Tidak ada padanan ESRI. Elemen portCatInfo tidak ditemukan pada sampel; nilai 0. | Tidak ada padanan CKAN; nilai 0. | 1 bila ada sitasi dokumen aturan simbol atau SNI/RSNI. 0,5 bila ada teks tetapi bukan sitasi dokumen (mis. tabel warna, judul dataset). 0 bila tidak ada. |
| E30 | Skema Aplikasi (Application Schema) | Deskripsi | Ada nama skema (UML) dan tautan/dokumen | Hanya ada nama skema tanpa dokumen | Tidak ada | gmd:applicationSchemaInfo | Tidak ada padanan ESRI. Elemen appSchInfo tidak ditemukan pada sampel; nilai 0. | Tidak ada padanan CKAN; nilai 0. | 1 bila ada nama skema dan tautan atau dokumen. 0,5 bila hanya nama. 0 bila tidak ada. |
| E31 | Kepatuhan KUGI | Deskripsi | Ada complianceCode (true) dan sitasi KUGI | Ada sitasi KUGI tapi complianceCode kosong | Tidak ada | gmd:contentInfo | Tidak ada padanan ESRI. Elemen contInfo tidak ditemukan pada sampel; nilai 0. | Tidak ada padanan CKAN. Tidak ada complianceCode atau sitasi KUGI pada rekaman; nilai 0. | 1 bila complianceCode true dan sitasi menyebut KUGI (judul "Katalog Unsur Geografi Indonesia" atau singkatan KUGI). 0,5 bila sitasi KUGI tanpa complianceCode true. 0 bila tidak ada atau sitasinya bukan KUGI (mis. tautan katalog fitur GeoNode). |
| E32 | Metadata Layanan (Service) | Informasi umum | Ada tautan WMS/WFS/CSW dan deskripsi layanan | Hanya ada tautan tanpa deskripsi/operasi | Tidak ada | gmd:distributionInfo | ESRI XML: distInfo (distributor, transfer, format). Tautan layanan tidak ada pada sampel; nilai 0. | CKAN resources[]: resource\_locator\_protocol (OGC:WMS, OGC:WFS, ESRI:ArcGIS:MapServer, dan sejenisnya), url, dan description. | 1 bila ada tautan layanan (OGC WMS/WFS/CSW/WCS, ArcGIS FeatureServer/MapServer) dengan deskripsi yang menjelaskan layanan atau layer yang dilayani. 0,5 bila hanya tautan, atau deskripsi hanya berupa label jenis/format ("OGC WMS Service", "RAW", "ImageWMS"), nama portal, atau pengulangan judul dataset. 0 bila tidak ada tautan layanan. Diputuskan Ketua 31 Okt 2026. |

## Isi
| Isian auditor | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Nama auditor: |  |  |  |  |  |  |  |  |  |  |  |
| Dataset |  | D01 |  | D07 |  | D09 |  | D12 |  | D18 |  |
| Berkas mentah |  | D01\_alur\_migrasi\_penyu.xml |  | D07\_habitat\_bentik\_laut\_dangkal.xml |  | D09\_terumbu\_karang.xml |  | D12\_batimetri\_ambon.xml |  | D18\_perairan\_12mil\_ntb.xml |  |
| Asal |  | Portal daerah (GeoNode, ISO 19139) |  | Portal KKP (ISO 19139) |  | Portal KKP (ISO 19139) |  | BIG (ISO 19139) |  | Portal daerah (ISO 19115-3 mdb) |  |
| ID | Elemen | Nilai | Catatan | Nilai | Catatan | Nilai | Catatan | Nilai | Catatan | Nilai | Catatan |
| E01 | Bahasa metadata (dan bahasa data bila ada) |  |  |  |  |  |  |  |  |  |  |
| E02 | Nama dan versi standar metadata |  |  |  |  |  |  |  |  |  |  |
| E03 | Tautan akses data atau layanan |  |  |  |  |  |  |  |  |  |  |
| E04 | Judul informatif |  |  |  |  |  |  |  |  |  |  |
| E05 | Tanggal sitasi dan jenis tanggal |  |  |  |  |  |  |  |  |  |  |
| E06 | Identifier unik |  |  |  |  |  |  |  |  |  |  |
| E07 | Abstrak |  |  |  |  |  |  |  |  |  |  |
| E08 | Tujuan (purpose) |  |  |  |  |  |  |  |  |  |  |
| E09 | Kata kunci |  |  |  |  |  |  |  |  |  |  |
| E10 | Kategori topik ISO |  |  |  |  |  |  |  |  |  |  |
| E11 | Lisensi atau batasan penggunaan |  |  |  |  |  |  |  |  |  |  |
| E12 | Deskripsi atribut atau katalog fitur |  |  |  |  |  |  |  |  |  |  |
| E13 | Bounding box |  |  |  |  |  |  |  |  |  |  |
| E14 | Cakupan temporal |  |  |  |  |  |  |  |  |  |  |
| E15 | Sistem referensi koordinat |  |  |  |  |  |  |  |  |  |  |
| E16 | Akurasi posisi |  |  |  |  |  |  |  |  |  |  |
| E17 | Akurasi tematik atau laporan kualitas lain |  |  |  |  |  |  |  |  |  |  |
| E18 | Skala atau resolusi |  |  |  |  |  |  |  |  |  |  |
| E19 | Organisasi penanggung jawab |  |  |  |  |  |  |  |  |  |  |
| E20 | Sarana kontak valid |  |  |  |  |  |  |  |  |  |  |
| E21 | Peran (role) |  |  |  |  |  |  |  |  |  |  |
| E22 | Tanggal metadata |  |  |  |  |  |  |  |  |  |  |
| E23 | Frekuensi pembaruan |  |  |  |  |  |  |  |  |  |  |
| E24 | Pernyataan lineage |  |  |  |  |  |  |  |  |  |  |
| E25 | Sumber data |  |  |  |  |  |  |  |  |  |  |
| E26 | Langkah atau metode pemrosesan |  |  |  |  |  |  |  |  |  |  |
| E27 | Representasi Spasial (Topologi & Geometri) |  |  |  |  |  |  |  |  |  |  |
| E28 | Lingkup Metadata (Metadata Scope) |  |  |  |  |  |  |  |  |  |  |
| E29 | Katalog Simbol (Portrayal Catalogue) |  |  |  |  |  |  |  |  |  |  |
| E30 | Skema Aplikasi (Application Schema) |  |  |  |  |  |  |  |  |  |  |
| E31 | Kepatuhan KUGI |  |  |  |  |  |  |  |  |  |  |
| E32 | Metadata Layanan (Service) |  |  |  |  |  |  |  |  |  |  |