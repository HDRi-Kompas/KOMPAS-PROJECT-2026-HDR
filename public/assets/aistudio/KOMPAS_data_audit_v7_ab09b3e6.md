## README
| KOMPAS: Data Audit v7 (draf kerja, koreksi) | Unnamed: 1 |
| --- | --- |
| Disusun 25 Oktober 2026. Menggantikan spreadsheet sampel dan handover sebelumnya. Versi 3 (koreksi) disusun 29 Oktober 2026; daftar perubahan di sheet Log\_Koreksi. Versi 4 disusun 29 Oktober 2026 setelah analisis handover aplikasi dan penulis. Versi 5 disusun 29 Oktober 2026 setelah tiga rekaman mdb ditambahkan. Versi 6 disusun 31 Oktober 2026 setelah E27-E32 dikodekan untuk 15 dataset. |  |
| Tujuan | Spreadsheet kerja untuk audit kelengkapan metadata 15 dataset kelautan Indonesia dengan kerangka 8 kategori MQI. Semua skor dihitung dengan rumus dari sheet Kodean, Checklist, dan Bobot. |
| Isi sheet | Sampel\_v2: tabel sampel yang dibersihkan. Verifikasi: catatan lama vs file mentah. Checklist: 32 elemen (E01-E26 inti dan E27-E32 tambahan), aturan 1 / 0,5 / 0. Bobot: bobot kategori dan tiga skema. Kodean: matriks nilai. Placeholder: penanda teks templat. Bukti: dasar tiap nilai di bawah 1. Skor: skema A, B, C dan skor MQI yang sebanding dengan paper. Sensitivitas: placeholder = 0 dan korelasi peringkat. Penanda: penanda mutu di luar skor. Rujukan\_MQI: perbandingan KOMPAS dengan paper MQI asli. Pemetaan\_MQI: pemetaan 26 elemen ke parameter paper. Cek\_Paper dan Temuan\_Paper: pemeriksaan angka dan konsistensi paper. Standar\_Rujukan: status standar SNI/ISO dan dokumen yang sudah dianalisis. Log\_Koreksi: perubahan v2 ke v3. Acuan\_Uji\_Aplikasi: nilai acuan dan kriteria uji aplikasi. Cek\_Klaim\_Naskah: klaim naskah dicocokkan dengan data. Arsip\_Sampel\_Diganti: dataset D02, D06, D15 yang dikeluarkan. |
| Status kodean | DRAF. Kodean awal disusun Claude dari file mentah yang ditempel Hilmi dan harus diverifikasi tim. Dua anggota yang bukan pengumpul data sebaiknya mengodekan 5 dataset sendiri tanpa melihat sheet Kodean, lalu dibandingkan (tingkat kesepakatan) sebagai validasi. Panduan verifikasi: sheet Kesepakatan dan berkas Lembar\_Verifikasi\_Auditor.xlsx. |
| D01 | Ditambahkan 25 Oktober 2026 dari XML Kubu Raya. Semua 15 dataset terkodekan (D01, D03-D05, D07-D14, D16-D18; D02, D06, D15 diganti pada v5). File pertama yang ditempel untuk D01 adalah rekaman Mukomuko dan tidak dipakai. |
| Skor elemen | 1 = bermakna. 0,5 = ada tetapi generik, templat, sebagian, atau tidak konsisten. 0 = kosong atau tidak ada. Definisi per elemen di sheet Checklist. |
| Asumsi 1 | Skema bobot elemen 3 / 2 / 1 (kritis, penting, pendukung) mengikuti paper MQI (Hasara dan Karunanayaka, 2026), tetapi paper tidak mempublikasikan bobot lengkap untuk 72 parameternya. Bobot tiap elemen KOMPAS adalah usulan. Kolom Bobot paper di Checklist menunjukkan elemen yang bobotnya disebut di paper. |
| Asumsi 2 | Bobot kategori skema A: Ketelitian 20, Pemrosesan 20, Identifikasi 15, Cakupan 15, Deskripsi 10, Kontak 10, Meta-metadata 5, Informasi umum 5. Skema B setara, skema C menggandakan Ketelitian dan Pemrosesan lalu dinormalkan. |
| Asumsi 3 | Teks templat atau salinan diberi 0,5 pada skor utama. Sheet Sensitivitas menghitung ulang dengan nilai 0. Keduanya harus dilaporkan. |
| Asumsi 4 | Bounding box dinilai dari kewajaran terhadap judul memakai pengetahuan umum letak wilayah. Verifikasi dengan layer batas di GIS sebelum masuk paper. Ketersediaan tautan tidak diuji online. |
| Asumsi 5 | Checklist disusun dari standar ISO 19115 dan kerangka MQI, tetapi aturan pembeda teks templat dan placeholder berasal dari pengamatan 15 dataset ini (pilot). Ungkapkan di bagian metode. Idealnya uji pada 3 sampai 5 dataset baru. |
| Kesesuaian dengan paper MQI | Sama: 8 kategori, skema bobot 3/2/1, rumus jumlah(p x w) dibagi jumlah(w) x 100, ambang kualitas. Berbeda: elemen generik ISO 19115 (bukan 72 parameter batimetri), bobot kategori pada skema A (tidak ada di paper), penilaian tiga tingkat (paper biner), tanpa inferensi parameter. Kolom MQI biner di sheet Skor adalah skor yang sebanding dengan paper. Paper memiliki beberapa inkonsistensi angka: lihat Cek\_Paper dan Temuan\_Paper sebelum mengutip. |
| Aturan | Jangan mengubah bobot atau aturan skor setelah melihat hasil. Perubahan hanya melalui sheet Sensitivitas dan dicatat beserta alasannya. |
| Warna | Biru = nilai masukan (kodean). Hitam = rumus. Hijau = rujukan antar sheet. Latar kuning = diisi tim. |
| Keterbatasan | Sampel kecil dan tidak acak. Rekaman CKAN (D13, D14) adalah tampilan hasil harvest, bukan metadata sumber. Kelengkapan tidak sama dengan kebenaran isi. Tulis hasil sebagai pola awal pada sampel ini, bukan generalisasi. |
| Versi 3 | Memperbaiki galat nilai (angka tersimpan sebagai teks di Kodean), rumus yang hilang di Skor!D5, ringkasan Kodean yang berupa nilai tetap, dan format Checklist/Kodean. Kodean E02 diselaraskan dengan aturannya untuk empat dataset. Rincian di Log\_Koreksi. |
| Kerangka standar | Dasar hukum audit ini: Peraturan BIG No. 3 Tahun 2023 yang mewajibkan lima SNI (SNI 8843-1:2019, SNI ISO 19115-2:2020, SNI ISO 19115-3:2021, SNI ISO 19157:2015, SNI ISO 19157-2:2021). ISO 19115-3:2023 adalah skema XML edisi internasional terbaru dan tidak tercantum di peraturan itu; pakai sebagai pembanding. Kolom Jalur ISO 19115-3 di Checklist belum diverifikasi terhadap teks standar atau XSD. |
| Batas transisi | Pasal 6 Perka BIG 3/2023: metadata berbasis ISO 19115:2003 (SNI ISO 19115:2012; setahu saya adopsi ISO 19115:2003, cek prakata SNI) dan ISO/TS 19139:2012 harus disesuaikan paling lama 2 tahun sejak diundangkan (26 Mei 2023), yaitu 26 Mei 2025. Batas itu sudah lewat. Skor KOMPAS menilai kelengkapan isi, bukan kepatuhan hukum. |
| E27-E32 | Elemen tambahan dari panduan BIG v6. Dikodekan untuk 15 dataset dan masuk skor utama (32 elemen) sejak v6 atas putusan Ketua. Skor inti 26 elemen tetap dihitung sebagai pembanding (Skor kolom AA-AE) karena paper MQI tidak memuat E27-E32. |
| Versi 4 | Menambah Acuan\_Uji\_Aplikasi dan Cek\_Klaim\_Naskah, serta tujuh catatan R2-01 sampai R2-07 di Log\_Koreksi. Tidak ada kodean yang berubah dari v3. |
| Versi 5 | D02, D06, dan D15 diganti tiga rekaman mdb (D16 Garis Pantai Banten, D17 Batas Pengelolaan Laut Banten, D18 Wilayah Perairan 12 Mil NTB). E27-E32 dikodekan untuk ketiganya. Skor lama D01, D03-D05, D07-D14 tidak berubah, tetapi rata-rata dan peringkat berubah karena sampel berganti. |
| Versi 6 | E27-E32 dikodekan untuk 15 dataset dari XML mentah dan masuk skor (32 elemen). Skor inti 26 elemen tetap tersedia di Skor kolom AA sampai AE. Rata-rata Skor A bergeser dari 50.3 ke 48.6 karena instrumen berubah. Detail di Log\_Koreksi R4-01 sampai R4-06. |
| Versi 7 | Atas putusan Ketua (31 Okt 2026): skor utama 32 elemen; tafsir E32 diseragamkan (D03, D10, D18 dari 1 menjadi 0,5); padanan ESRI dan CKAN untuk E27-E32 didokumentasikan (Checklist kolom I, J); definisi operasional E27-E32 (Checklist kolom Q). Penanda F09 (D18), F10 (D16, D17) dan Placeholder D18 (E17, E25, E26) diselaraskan dengan bukti. Teks basi diperbarui. Ditambahkan sheet Paket\_Penulis dan Kesepakatan, serta bagian D di Standar\_Rujukan. Rincian di Log\_Koreksi R5-01 sampai R5-07. |

## Rujukan_MQI
| Perbandingan KOMPAS dengan paper MQI asli | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 |
| --- | --- | --- | --- | --- | --- |
| Hasara, K.M.D., dan Karunanayaka, K.A.N.C. (2026). Development of a Metadata Quality Index (MQI) for Bathymetric Data Assessment in Marine Spatial Data Infrastructure. IJRSI, Vol. XIII Issue II, 759-777. DOI 10.51244/IJRSI.2026.13020067. Halaman merujuk nomor halaman PDF. |  |  |  |  |  |
| No | Aspek | Paper MQI | KOMPAS (spreadsheet ini) | Status | Tindak lanjut |
| 1 | Kategori | 8 kategori: informasi umum, identifikasi, deskripsi, cakupan, parameter ketelitian, kontak, meta-metadata, pemrosesan (hlm 759, 764-765). | 8 kategori yang sama. | Sesuai | Nyatakan bahwa nama kategori dipertahankan dan isi elemen diadaptasi (lihat Pemetaan\_MQI). |
| 2 | Parameter | 72 parameter khusus batimetri (perangkat, platform, TVU/THU/TPU, kalibrasi, CATZOC). Jumlah per kategori tidak konsisten (lihat Temuan\_Paper). | 32 elemen generik ISO 19115 (E01-E26 inti dan E27-E32 tambahan) untuk dataset tematik kelautan. | Berbeda (adaptasi) | Tulis sebagai adaptasi. Parameter khusus batimetri tidak berlaku untuk peta tematik. Bobot lengkap 72 parameter tidak dipublikasikan. |
| 3 | Bobot parameter | Tiga tingkat: kritis 3, penting 2, pendukung 1 (hlm 765-766). | Skema 3/2/1 yang sama. Bobot tiap elemen adalah usulan KOMPAS. | Sesuai pada skema, berbeda pada nilai | Pertimbangkan bobot selaras paper untuk 7 elemen yang bobotnya disebut (kolom Bobot selaras paper di Checklist, hasil di kolom Y sheet Skor). |
| 4 | Bobot kategori | Tidak ada. Bobot parameter dijumlahkan lintas kategori (hlm 766). | Skema A memakai bobot kategori usulan. Skor MQI biner dan diperluas tidak memakai bobot kategori. | Berbeda | Pakai MQI biner sebagai skor yang sebanding dengan paper. Skema A diposisikan sebagai analisis tambahan. |
| 5 | Penilaian elemen | Biner: p = 1 bila terdokumentasi, 0 bila tidak. Hanya keberadaan, bukan kualitas isi (hlm 766, 775). | Tiga tingkat 1 / 0,5 / 0 yang menilai kebermaknaan isi. MQI biner memakai nilai di atas 0 sebagai 'ada'. | Berbeda (perluasan) | Jadikan penilaian isi sebagai kebaruan KOMPAS dan laporkan MQI biner untuk perbandingan. |
| 6 | Rumus | MQI = jumlah (p x w) / jumlah w x 100 (hlm 766). Studi kasus memakai rumus lain yang tidak dapat direproduksi (hlm 773). | MQI biner memakai rumus hlm 766 pada 26 elemen. | Sesuai (rumus hlm 766) | Jangan memakai rumus studi kasus. |
| 7 | Ambang kualitas | Excellent 90-100, Good 75-89, Fair 50-74, Poor 25-49, Very Poor 0-24 (Tabel 2, hlm 766). | Dipakai pada kolom Kategori MQI di sheet Skor. | Sesuai | Terjemahkan istilah kategori ke bahasa Indonesia di paper. |
| 8 | Inferensi parameter | Parameter boleh disimpulkan dari konteks, mis. sistem pemosisian dari era survei (hlm 766-767). | Tidak ada inferensi. Hanya yang tertulis di rekaman. | Berbeda (lebih ketat) | Jelaskan di metode agar audit dapat direplikasi. |
| 9 | Tingkat integrasi | Level 1 (>= 25), Level 2 (>= 50), Level 3 (>= 75) dengan parameter kritis wajib (Tabel 9, hlm 773). | Belum diadaptasi. Hanya ambang skor yang tampak pada kolom kategori. | Belum | Opsional: tentukan elemen wajib tiap level untuk data tematik. |
| 10 | Analisis temporal | ANOVA dan Tukey per dekade dengan n = 3 (hlm 767). | Tidak dilakukan. Hanya 2 dari 15 dataset berumur di atas 5 tahun. | Tidak berlaku | Laporkan secara deskriptif saja. |
| 11 | Validasi bobot | Konsultasi 8 pakar tanpa statistik kesepakatan (hlm 766). | Belum. Rencana: audit independen 5 dataset dan uji sensitivitas. | Belum | Hitung tingkat kesepakatan antar-pengode. |
| 12 | Objek studi | 12 dataset batimetri dari satu kantor hidrografi (Sri Lanka), 1991 sampai 2023. | 15 dataset kelautan Indonesia dari portal daerah, KKP, dan BIG. | Berbeda | Tegaskan bahwa KOMPAS adalah penerapan baru pada konteks Indonesia. |
| 13 | Keterbatasan yang diakui | Satu kantor, bobot subjektif, inferensi, menilai keberadaan dan bukan kualitas isi (hlm 775). | Sampel kecil, bobot usulan, kodean masih draf. | Serupa | Tulis keterbatasan secara sejalan. |
|  | Ambang kualitas (Tabel 2 paper) dan tafsirannya |  |  |  |  |
| Rentang MQI | Kategori | Tafsiran (paper) | Kesesuaian untuk MSDI (paper) |  |  |
| 90-100 | Excellent | Metadata lengkap dengan semua parameter kritis dan sebagian besar parameter penting terdokumentasi | Dapat dipakai ulang penuh |  |  |
| 75-89 | Good | Sebagian besar parameter kritis dan penting terdokumentasi, celah kecil | Cocok untuk sebagian besar aplikasi dengan beberapa batasan |  |  |
| 50-74 | Fair | Parameter kritis terdokumentasi, parameter penting sebagian | Cocok untuk penemuan dan evaluasi dasar, pemakaian ulang perlu hati-hati |  |  |
| 25-49 | Poor | Parameter kritis sebagian, parameter penting banyak hilang | Hanya untuk penemuan, evaluasi dan pemakaian ulang sangat terbatas |  |  |
| 0-24 | Very Poor | Dokumentasi minimal | Nilai penemuan terbatas, perlu dokumentasi ulang |  |  |

## Standar_Rujukan
| Standar dan dokumen rujukan: status, prioritas, dan fungsi untuk KOMPAS | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 |
| --- | --- | --- | --- | --- | --- | --- |
| Dasar: Peraturan BIG No. 3 Tahun 2023, Pasal 2 ayat (1). Prioritas 1 = perlu lebih dulu. "Status berkas" mengikuti keterangan Hilmi per 29 Oktober 2026. Kolom Catatan memuat hal yang belum saya verifikasi. |  |  |  |  |  |  |
| No | Standar | Dasar | Dipakai KOMPAS untuk | Prioritas | Status berkas | Catatan |
| A. Lima SNI yang diwajibkan Perka BIG 3/2023 |  |  |  |  |  |  |
| 1 | SNI 8843-1:2019 Profil Metadata Spasial Indonesia, Bagian 1: Fundamental | Wajib, Pasal 2(1)a | Menentukan elemen wajib, kondisional, dan opsional versi Indonesia. Dasar untuk bobot kritis/penting/pendukung, aturan E02 dan E11, dan kosakata peran (E21). | 1 (paling penting) | Belum ditemukan | Cek akses-sni.bsn.go.id (baca daring) dan pesta.bsn.go.id (beli). Keterangan BSN yang saya temukan: SNI adopsi identik standar internasional dikecualikan dari akses gratis; SNI 8843-1 adalah profil nasional sehingga lebih mungkin bisa dibaca. Belum saya periksa untuk dokumen ini. |
| 2 | SNI ISO 19115-3:2021 Metadata, Bagian 3: Skema implementasi XML | Wajib, Pasal 2(1)c | Struktur XML dan jalur elemen (kolom Jalur ISO 19115-3 di Checklist). | 2 | Belum ditemukan | Terbit 2021, jadi tidak mungkin mengadopsi edisi ISO 19115-3:2023. Cek prakata SNI untuk edisi ISO yang diadopsi. Edisi 2023 mengubah urutan elemen dan merealokasi komponen; ISO/TC 211 menyediakan XSLT migrasi. XSD gratis di schemas.isotc211.org dapat dipakai memverifikasi jalur. |
| 3 | SNI ISO 19157:2015 Kualitas data | Wajib, Pasal 2(1)d | Definisi elemen, ukuran, dan hasil kualitas data. Aturan nilai E16 dan E17 menyebut standar ini secara eksplisit. | 2 | Belum ditemukan | Perlu untuk memverifikasi daftar elemen kualitas dan nama kelas pada E16/E17 (lihat Log\_Koreksi S07). |
| 4 | SNI ISO 19157-2:2021 Kualitas data, Bagian 2: Implementasi skema XML | Wajib, Pasal 2(1)e | Jalur XML blok kualitas (mdq). | 3 | Belum ditemukan | Hanya untuk jalur XML. XSD mdq gratis di schemas.isotc211.org cukup untuk verifikasi awal. |
| 5 | SNI ISO 19115-2:2020 Metadata, Bagian 2: Ekstensi untuk akuisisi dan pemrosesan | Wajib, Pasal 2(1)b | Ekstensi untuk citra, data gridded, dan langkah pemrosesan (E26; relevan bila ada dataset raster atau gridded, mis. batimetri D12, format berkasnya belum dicek). | 3 (paling rendah untuk data vektor) | Belum ditemukan | Sebagian besar dataset sampel vektor. |
| B. Standar di luar daftar Pasal 2 dan dokumen pendukung |  |  |  |  |  |  |
| 6 | ISO 19115-1:2014 (+ Amd 1:2018, Amd 2:2020) | Tidak tercantum di Pasal 2 | Model isi metadata yang mendasari profil SNI 8843-1 dan skema 19115-3 (menurut pemahaman saya; cek prakata SNI 8843-1). | 3, tunda | Berbayar | Jangan dibeli dulu. Peroleh SNI 8843-1 lebih dulu; bila elemen wajib dan definisi sudah ada di sana, ISO 19115-1 hanya perlu untuk detail kodelist, yang juga tersedia dari ISO/TC 211. |
| 7 | ISO 19115-3:2023 | Tidak tercantum di Pasal 2 (yang diwajibkan SNI ISO 19115-3:2021) | Rujukan teknis edisi internasional terbaru untuk skema XML. Terbit Agustus 2023; mencakup ISO 19115-1 dan 19115-2 serta aturan Schematron. | 3, tunda | Berbayar | Harga di ISO sekitar 219 euro pada daftar yang saya lihat. Dasar hukum Indonesia tetap SNI ISO 19115-3:2021, jadi klaim "sesuai ISO 19115-3:2023" sebaiknya ditulis sebagai pembanding, bukan acuan kepatuhan. |
| 8 | Surat Edaran BIG No. 6 Tahun 2021 (Pedoman Standar Data dan Struktur serta Format Baku Metadata Spasial) | Disitir dokumen Kediri bab 2.4 | Struktur baku 11 komponen metadata spasial. | 2 | Belum dicari | Hanya saya kenal dari kutipan dokumen Kediri; isinya belum saya baca. Cek JDIH BIG. |
| C. Dokumen yang sudah dianalisis |  |  |  |  |  |  |
| No | Dokumen | Jenis | Cukup untuk | Tidak cukup untuk | Temuan penting |  |
| 1 | Peraturan BIG No. 3 Tahun 2023 | Dasar hukum | Daftar SNI wajib, ruang lingkup berlaku (instansi pusat, pemda, setiap orang), dan batas transisi. | Isi teknis elemen: peraturan hanya menyebut judul standar. | Pasal 6: metadata berbasis SNI ISO 19115:2012, 19115-2:2012, dan ISO/TS 19139:2012 harus disesuaikan paling lama 2 tahun sejak diundangkan 26 Mei 2023 (batas 26 Mei 2025, sudah lewat). |  |
| 2 | Petunjuk Implementasi Pembuatan Metadata v6 (BIG, 18 Nov 2022) | Panduan operasional (ArcCatalog) | Makna isian per elemen, kebiasaan BIG (walidata = Custodian, produsen = Originator, tautan layanan http lalu ubah manual ke https), dan bab-bab yang melatari E27-E32. | Acuan kepatuhan 19115-3: terbit sebelum Perka 3/2023; ekspor memakai translator ARCGIS2ISO19139gml321 sehingga hasilnya ISO 19139 (gmd), bukan mdb. | Nama dan versi standar dibuat otomatis oleh ArcCatalog dan hanya bisa diubah manual di XML (bab 9 dan 10): salah satu penyebab nama standar generik pada rekaman sampel. |  |
| 3 | Petunjuk Implementasi v3 CatMDEdit (BIG, Juni 2022) | Panduan operasional (CatMDEdit 5) | Alur pengisian elemen ISO 19115 (nama kelas ISO 19115:2003 seperti CI\_ResponsibleParty dan MD\_Distribution). | Acuan 19115-3 (kelas gmd, bukan mdb). | Menyarankan mengetik "bahasa Indonesia" atau default english untuk bahasa; produsen = Owner (beda dengan v6); contoh nama standar "SNI ISO 19115, SNI 8843-1:2019". |  |
| 4 | Metadata Diskominfo Kota Kediri 2024 | Laporan implementasi pemda | Contoh keluaran nyata pemda: 10 dataset spasial, penamaan berkas, dan kutipan SNI 8843-1:2019 serta SE BIG 6/2021. | Rujukan standar: ini laporan kegiatan, bukan standar. | Keluaran metadata spasial yang ditampilkan berformat ArcGIS Item Description, dengan extent dan batasan penggunaan kosong pada contoh yang saya lihat (administrasi kelurahan): pola celah yang sama dengan temuan KOMPAS. Teks menyebut CatMDEdit tetapi gambar hasilnya bergaya ArcGIS. |  |
| D. Hasil verifikasi skema dan jumlah elemen (31 Okt 2026, dari sumber daring) |  |  |  |  |  |  |
| No | Hal yang diperiksa | Hasil | Sumber | Status | Akibat untuk naskah |  |
| 1 | Edisi ISO 19115-3 dan SNI 2021 | ISO/TS 19115-3:2016 digantikan ISO 19115-3:2023 (Agustus 2023). SNI ISO 19115-3:2021 terbit sebelum edisi 2023 sehingga tidak mungkin mengadopsinya. Edisi ISO yang diadopsi SNI 2021 belum dicek ke prakata SNI. | committee.iso.org (proyek ISO 19115-3); webstore ANSI | Terverifikasi sebagian | Jangan menyebut SNI 2021 sama dengan edisi 2023. |  |
| 2 | Namespace pada D16-D18 | Ketiga berkas memakai namespace mdb/2.0, cit/2.0, mrl/2.0. Repositori ISO/TC 211 menandai paket mdb/2.0 "historical"; pustaka R geometa memetakan namespace 2.0 ke edisi 2023. Kesesuaian terhadap edisi tertentu tidak dapat disimpulkan tanpa validasi XSD. | schemas.isotc211.org/19115/-3/mdb/2.0; README geometa | Belum divalidasi | Tulis: "memakai namespace ISO 19115-3 versi 2.0; kesesuaian terhadap edisi tertentu belum divalidasi". |  |
| 3 | Nama standar "ISO 19115-3:2018" (D16, D17) | Bukan edisi terbitan ISO (edisi: TS 2016 dan standar 2023). Kemungkinan label bawaan perangkat lunak pembuat metadata; ini dugaan dan belum dikonfirmasi ke pembuat metadata. | Daftar edisi di committee.iso.org | Dugaan | Dikodekan 1 pada E02 menurut aturan tertulis, tetapi catat sebagai nama standar tidak baku. |  |
| 4 | Klaim "43 elemen" dan Perka BIG 3/2023 | Kutipan teks Perka yang terbaca hanya mendaftar lima SNI wajib (Pasal 2) tanpa jumlah elemen. Sumber angka 43 belum ditemukan; kandidat: SNI 8843-1:2019 atau SE Kepala BIG 6/2021. | peraturan.go.id dan peraturan.bpk.go.id (Perka BIG 3/2023) | Belum terverifikasi | Jangan menulis "Perka mewajibkan 43 elemen". Sitir dokumen yang benar-benar memuat angka itu setelah dibaca. |  |

## Pemetaan_MQI
| Pemetaan 26 elemen inti KOMPAS ke parameter paper MQI (E27-E32 tidak dipetakan) | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Kesepadanan: Sama = parameter yang sama. Setara = fungsi sama, letak kategori berbeda. Adaptasi = disesuaikan untuk data tematik. Baru = tidak ada di paper. |  |  |  |  |  |  |  |  |
| E27-E32 adalah elemen tambahan panduan BIG: tidak ada padanan di paper MQI. Karena itu skor yang dibandingkan dengan paper adalah skor inti 26 elemen. |  |  |  |  |  |  |  |  |
| ID | Elemen KOMPAS | Kategori KOMPAS | Bobot KOMPAS | Bobot selaras paper | Kategori di paper | Parameter paper terdekat | Kesepadanan | Catatan |
| E01 | Bahasa metadata (dan bahasa data bila ada) | Informasi umum | 1 | 1 | Meta-Metadata | Language | Setara | Paper menaruhnya di Meta-Metadata. |
| E02 | Nama dan versi standar metadata | Informasi umum | 2 | 2 | Meta-Metadata | Standards | Setara | Paper menaruhnya di Meta-Metadata. |
| E03 | Tautan akses data atau layanan | Informasi umum | 2 | 1 | Identification | Online Resources (bobot 1); Distribution Format | Setara | Bobot paper 1 (pendukung), bobot KOMPAS 2. |
| E04 | Judul informatif | Identifikasi | 3 | 3 | General | Data Set Name; Alternative Title (bobot 1) | Setara | Bobot Data Set Name tidak disebut. |
| E05 | Tanggal sitasi dan jenis tanggal | Identifikasi | 2 | 2 | General / Identification | Published Date; Creation Date | Setara |  |
| E06 | Identifier unik | Identifikasi | 2 | 3 | General / Identification | ID; Identifier (Data Set ID kritis, bobot 3) | Setara | Bobot paper 3, bobot KOMPAS 2. |
| E07 | Abstrak | Deskripsi | 3 | 3 | General | Description | Setara |  |
| E08 | Tujuan (purpose) | Deskripsi | 2 | 2 | Description | Primary Purpose | Sama |  |
| E09 | Kata kunci | Deskripsi | 1 | 1 | General | Keywords (bobot 1) | Sama |  |
| E10 | Kategori topik ISO | Deskripsi | 1 | 1 | General | MSDI Category | Setara | Dipetakan ke kategori topik ISO. |
| E11 | Lisensi atau batasan penggunaan | Deskripsi | 3 | 3 | Identification | Access Constraints | Setara | KOMPAS menilai isi lisensi dan batasan penggunaan. |
| E12 | Deskripsi atribut atau katalog fitur | Deskripsi | 2 | 2 | (tidak ada) | (tidak ada) | Baru | Dari ISO 19115 contentInfo (katalog fitur). |
| E13 | Bounding box | Cakupan | 3 | 3 | Extent | Spatial Extent: Area, Corner Coordinates (kritis, bobot 3) | Sama |  |
| E14 | Cakupan temporal | Cakupan | 2 | 3 | Extent | Time Extent: Begin dan End Date; Survey Date (kritis, bobot 3) | Setara | Bobot paper 3, bobot KOMPAS 2. |
| E15 | Sistem referensi koordinat | Cakupan | 2 | 2 | Extent | Horizontal Datum; Vertical Datum | Adaptasi | Datum vertikal khusus batimetri tidak dinilai. |
| E16 | Akurasi posisi | Ketelitian | 3 | 2 | Accuracy Parameters | THU, TPU, Positioning Accuracy (bobot 2) | Adaptasi | Tanpa TVU. Bobot paper 2, bobot KOMPAS 3. |
| E17 | Akurasi tematik atau laporan kualitas lain | Ketelitian | 3 | 3 | Accuracy Parameters | Completeness, Consistency, Reliability, Precision | Adaptasi | Elemen kualitas data ISO 19157. |
| E18 | Skala atau resolusi | Ketelitian | 2 | 2 | Accuracy Parameters | Spatial Resolution | Setara |  |
| E19 | Organisasi penanggung jawab | Kontak | 3 | 3 | Point of Contact | Organization; Division; Owner | Sama |  |
| E20 | Sarana kontak valid | Kontak | 3 | 3 | Point of Contact | Email; Telephone; Address | Sama |  |
| E21 | Peran (role) | Kontak | 1 | 1 | Point of Contact / Identification | Owner; Originator; Custodian | Adaptasi | Nilai peran dari codelist ISO. |
| E22 | Tanggal metadata | Meta-metadata | 2 | 2 | Meta-Metadata | Published Date | Sama |  |
| E23 | Frekuensi pembaruan | Meta-metadata | 1 | 1 | Accuracy Parameters | Timeliness: Update Frequency | Setara | Paper menaruhnya di Accuracy. |
| E24 | Pernyataan lineage | Pemrosesan | 3 | 2 | Processing Information | Processing Lineage (bobot 2) | Sama | Bobot paper 2, bobot KOMPAS 3. |
| E25 | Sumber data | Pemrosesan | 3 | 3 | Meta-Metadata / Description | Source; Data Type | Adaptasi | Sumber data dan citra. |
| E26 | Langkah atau metode pemrosesan | Pemrosesan | 3 | 3 | Processing Information | Processing Software; Purpose; Edited Format | Adaptasi | Langkah dan metode pemrosesan. |
| Parameter paper yang tidak diadopsi dan alasannya |  |  |  |  |  |  |  |  |
| Parameter paper | Alasan tidak diadopsi dan padanan di KOMPAS |  |  |  |  |  |  |  |
| Device Category, Device Name, Device Uncertainty, Device Type/Model (kritis) | Perangkat akuisisi batimetri (echo sounder). Tidak berlaku untuk peta tematik hasil citra atau digitasi. Padanan untuk data penginderaan jauh: sensor dan citra sumber (tercakup di E25). |  |  |  |  |  |  |  |
| Positioning Device/Name, Platform Category/Name, Supplementary Instruments, Average Vessel Speed, Acquisition Software | Rincian survei kapal. Tidak berlaku untuk dataset tematik. |  |  |  |  |  |  |  |
| Vertical Extent (Minimum/Maximum Depth), Vertical Datum, Tidal Correction, SVP Information | Khusus batimetri. D12 (batimetri) kehilangan datum vertikal dan dicatat sebagai pengamatan kualitatif. |  |  |  |  |  |  |  |
| TVU dan TPU, CATZOC Accuracy Level, Survey Specification (IHO S-44) | Standar survei hidrografi. KOMPAS memakai akurasi posisi dan laporan kualitas data umum. |  |  |  |  |  |  |  |
| Calibration Status dan Calibration Date | Celah terbesar di paper (0%). Untuk data citra, padanan kalibrasi adalah koreksi radiometrik dan atmosferik pada langkah pemrosesan (E26). |  |  |  |  |  |  |  |
| Coverage, Coverage Percentage, Line Spacing, Data Gaps | Desain survei. Tidak berlaku untuk dataset tematik. |  |  |  |  |  |  |  |
| Project Number, Division, Processing Software, Edited Format, Interoperability | Dapat ditambahkan sebagai elemen opsional bila tim ingin kedekatan lebih tinggi. |  |  |  |  |  |  |  |

## Sampel_v2
| Tabel sampel v2 | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 | Unnamed: 12 | Unnamed: 13 | Unnamed: 14 | Unnamed: 15 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Kolom TAHUN dipecah; standar isi dipisah dari pengodean. Kolom kuning diisi tim. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ID | Judul dataset | Topik | Kelompok sumber | Portal atau perangkat | Pengodean | Standar isi (dinyatakan di rekaman) | Tahun nominal | Tanggal referensi di metadata | Tanggal metadata | Tanggal rekaman portal | URL sumber (dicatat tim) | Status verifikasi | Catatan | Nama file mentah (isi tim) | URL CSW atau API yang dipakai (isi tim) |
| D01 | Alur Migrasi Penyu (Kab. Kubu Raya) | Biota laut / konservasi | Portal daerah | Geoportal Kab. Kubu Raya (GeoNode, pycsw 3.0-dev) | XML ISO 19139 (CSW) | ISO 19115:2003 | 2023 | 2023-06-19 (publication) | 2026-02-18 | - | https://geoportal.kuburaya.go.id/catalogue/uuid/2604454c-eef9-4d03-b9fd-21f94f4f62d7 | Diverifikasi ke file mentah (draf) | Abstrak identik dengan judul; kontak 'Admin Admin'; bounding box nasional; lisensi OSM. | D01\_alur\_migrasi\_penyu.xml |  |
| D03 | Batas Kewenangan Pengelolaan Wilayah Laut Riau | Batas administrasi laut | Portal daerah | Geoportal Provinsi Riau | XML ISO 19139 | ISO 19139 (disebut sebagai standar) | 2026 | 2026-07-10 (creation, publication, revision) | 2026-07-29 | - | https://geoportal.riau.go.id/katalog/view/03e5e548-e3c2-40b0-be7f-17afc85566ea | Diverifikasi ke file mentah (draf) | Abstrak dan lineage identik; tujuan templat. | D03\_batas\_kewenangan\_laut\_riau.xml |  |
| D04 | Alur Migrasi Biota Laut di Kab. Kotawaringin Timur | Biota laut / konservasi | Portal daerah | Geoportal Kotawaringin Timur (GeoNode, pycsw 2.6.1) | XML ISO 19139 (CSW) | ISO 19115:2003 | 2025 | 2025-06-22 (publication) | 2025-06-22 | - | https://geoportal.kotimkab.go.id/catalogue/#/dataset/40 | Diverifikasi ke file mentah (draf) | Kontak kosong; lineage hanya rujukan peraturan. | D04\_alur\_migrasi\_biota\_laut\_kotim.xml |  |
| D05 | Peta Jalur Penangkapan Ikan Provinsi Aceh | Perikanan / jalur tangkap | Portal daerah | SIG Provinsi Aceh (GeoNode, pycsw 2.6.1) | XML ISO 19139 (CSW) | ISO 19115:2003 | 2025 | 2025-02-26 (publication) | 2025-11-05 | - | https://sig.acehprov.go.id/catalogue/#/dataset/91 | Diverifikasi ke file mentah (draf) | Tujuan kosong; lisensi bawaan GeoNode. | D05\_jalur\_penangkapan\_ikan\_aceh.xml |  |
| D07 | IGT Habitat Bentik Laut Dangkal Tahun 2025 Indonesia | Habitat bentik / mangrove / lamun | Portal KKP | Portal Data KKP | XML ISO 19139 (profil SNI) | SNI 8843-1:2019 | 2025 | 2025-11-26 (creation) | 2025-11-26 | - | https://portaldata.kkp.go.id/portals/metadata/meta-spasial/d/1260# | Diverifikasi ke file mentah (draf) | Banyak teks templat; bounding box 0,0,0,0; tautan lokal. | D07\_habitat\_bentik\_laut\_dangkal.xml |  |
| D08 | Mangrove 2024 skala 1:25K (MANGROVE2024\_25K\_032/040) | Mangrove | Portal KKP | Portal Data KKP | ESRI XML (.shp.xml) | Tidak dinyatakan (ArcGIS metadata) | 2024 | (tidak ada tanggal sitasi); CreaDate 2025-02-03 | 2025-02-03 | - | https://portaldata.kkp.go.id/portals/metadata/meta-spasial/d/1203# | Diverifikasi ke file mentah (draf) | Tanpa abstrak, kontak, bounding box; jalur lokal. | D08\_mangrove2024\_25k.shp.xml |  |
| D09 | Peta Terumbu Karang Indonesia 1:50.000 Tahun 2015 | Terumbu karang | Portal KKP | Portal Data KKP (produsen BRIN) | XML ISO 19139 | ISO 19139 (disebut sebagai standar) | 2015 | (tanggal sitasi nilReason=missing); periode 2015 | 2015-12-01 | - | https://portaldata.kkp.go.id/portals/metadata/meta-spasial/d/68# | Diverifikasi ke file mentah (draf) | Lineage rinci; akurasi tematik berupa ambang; tanpa tautan unduh. | D09\_terumbu\_karang.xml |  |
| D10 | Benda Muatan Kapal Tenggelam (Potensi Sumber Daya Arkeologi Maritim) | Arkeologi maritim | Portal KKP | Portal Data KKP | XML ISO 19139 | ISO 19139 (disebut sebagai standar) | 2022 | 2022-09-20 (publication) | 2022-09-21 | - | https://portaldata.kkp.go.id/portals/metadata/meta-spasial/d/66# | Diverifikasi ke file mentah (draf) | Lineage, batasan hukum, dan CRS berisi teks templat. | D10\_kapal\_tenggelam.xml |  |
| D11 | Neraca Sumber Daya Laut Habitat Bentik KKPN Kepulauan Raja Ampat 1:50K | Neraca sumber daya / habitat bentik | Portal KKP | Portal Data KKP | XML ISO 19139 | ISO 19139 (disebut sebagai standar; mengacu SNI 9257:2024 dan 9258:2024 pada teks) | 2020 (aktiva 2014/2015, pasiva 2020/2021) | 2020-03-01 (creation); 2020-10-31 (publication) | 2024-12-13 | - | https://portaldata.kkp.go.id/portals/metadata/meta-spasial/d/615# | Diverifikasi ke file mentah (draf) | 11 laporan DQ; tanpa lisensi; tanpa tautan unduh; tiga bounding box di luar Raja Ampat. | D11\_neraca\_hpbld\_raja\_ampat.xml |  |
| D12 | Ambon\_100m (batimetri) | Batimetri | BIG | SIBATNAS BIG (CSW, pycsw 2.6.0) | XML ISO 19139 (CSW) | ISO 19115 (ISO19115:2003/Cor 1 2006) | 2026 | 2026-07-20 (publication) | 2026-07-20 | - | https://sibatnas.big.go.id/geoserver/wms (endpoint; perlu URL rekaman) | Diverifikasi ke file mentah (draf); URL perlu dilengkapi | Tanpa blok kualitas data; bounding box nasional; hanya WMS. | D12\_batimetri\_ambon.xml |  |
| D13 | Indeks Peta Lingkungan Pantai Indonesia (LPI) 1:25.000 | Lingkungan pantai / indeks peta | BIG | Satu Data BIG, Ina-Geoportal (CKAN) | JSON CKAN package\_show | Tidak dinyatakan | 2021 | 2021-09-29 (publication) | 2022-04-11 | 2024-07-03 | https://tanahair.indonesia.go.id/ (beranda; perlu URL rekaman) | Diverifikasi ke file mentah (draf); URL perlu dilengkapi | Penanda rejected pada enam sumber daya; rekaman hasil harvest. | D13\_indeks\_lpi\_25k\_ckan.json |  |
| D14 | Kawasan Konservasi Pesisir dan Pulau-Pulau Kecil Kalimantan Barat | Kawasan konservasi | Portal daerah | Satu Data Provinsi Kalbar (CKAN) | JSON CKAN package\_show | Tidak dinyatakan | 2007 (tanggal referensi) | 2007-09-01 (publication) | 2020-02-06 | 2022-10-09 | http://geospasial.kalbarprov.go.id:8080/geoserver/wfs? atau data.go.id (pilih satu) | Diverifikasi ke file mentah (draf); URL perlu dilengkapi | Kontak 'Belum Ada'; lineage dan lisensi kosong. | D14\_kawasan\_konservasi\_kalbar\_ckan.json |  |
| D16 | Garis Pantai (Provinsi Banten) | Garis pantai | Portal daerah | Portal Data Provinsi Banten (geoMDB-hub; GeoServer gistaru) | XML ISO 19115-3 (mdb) | ISO 19115-3:2018 | 2026 | 2026-07-13 (creation, publication, revision) | 2026-07-13 | - |  | Diverifikasi ke file mentah (draf); URL rekaman perlu dilengkapi | Format mdb (namespace mdb/2.0). Kontak originator berisi data contoh standar; tanpa lineage dan tanpa kualitas posisi; hanya WMS dan WCS. Identik dengan D17 pada seluruh 26 elemen. | D16\_garis\_pantai\_banten.xml |  |
| D17 | Batas Pengelolaan Laut (Provinsi Banten) | Batas administrasi laut | Portal daerah | Portal Data Provinsi Banten (geoMDB-hub; GeoServer gistaru) | XML ISO 19115-3 (mdb) | ISO 19115-3:2018 | 2026 | 2026-07-13 (creation, publication, revision) | 2026-07-13 | - |  | Diverifikasi ke file mentah (draf); URL rekaman perlu dilengkapi | Format mdb (namespace mdb/2.0). Dihasilkan generator yang sama dengan D16; hanya judul, topik, dan bounding box yang berbeda. | D17\_batas\_pengelolaan\_laut\_banten.xml |  |
| D18 | Wilayah Perairan 12 Mil Provinsi NTB | Batas administrasi laut | Portal daerah | Geoportal Provinsi NTB (GeoServer palapa) | XML ISO 19115-3 (mdb) | SNI 8843-1:2019 | 2025 | 2025-09-03 (creation, publication); 2025-10-03 (revision) | 2025-11-20 (revision) | - |  | Diverifikasi ke file mentah (draf); URL rekaman perlu dilengkapi | Format mdb (namespace mdb/2.0). Rekaman paling lengkap, tetapi bounding box tidak valid dan lineage serta kualitas data tampak salinan alur RBI. | D18\_perairan\_12mil\_ntb.xml |  |

## Verifikasi
| Log verifikasi: catatan lama vs file mentah | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 |
| --- | --- | --- | --- | --- | --- | --- |
| Setiap baris membandingkan spreadsheet dan handover sebelumnya dengan XML atau JSON mentah yang ditempel. |  |  |  |  |  |  |
| Catatan v7: baris yang menyebut D02, D06, atau D15 adalah arsip. Ketiga dataset itu diganti pada v5 (lihat Arsip\_Sampel\_Diganti). |  |  |  |  |  |  |
| ID | Dataset | Topik | Klaim atau catatan sebelumnya | Temuan pada file mentah | Status | Tindak lanjut |
| V01 | D01 | Kesesuaian file | D01 = Alur Migrasi Penyu, Kab. Kubu Raya, ISO 19115:2003 via GeoNode. | File mentah pertama yang ditempel untuk D01 adalah rekaman CKAN Kab. Mukomuko (XLSX, bukan data spasial) dan tidak dipakai. XML Kubu Raya yang benar ditambahkan pada 25 Oktober 2026 dan sudah dikodekan. | Terselesaikan | Simpan XML aslinya di folder data\_mentah/D01. |
| V02 | D02, D03 | Lineage sama dengan abstrak | Spreadsheet: D02 lineage dan abstrak 'copy-paste definisi umum', D03 'lineage sama persis dengan abstrak'. Handover meletakkan aturan duplikasi di D02. Catatan Claude sebelumnya menyebut itu temuan D03 saja. | Pada D02 dan D03 teks lineage identik dengan teks abstrak. | Terkonfirmasi (koreksi atas catatan Claude sebelumnya) | Aturan deteksi duplikasi abstrak dan lineage berlaku untuk keduanya. |
| V03 | D02 | Tujuan (purpose) | Teks templat 'Dataset spasial untuk kebutuhan GIS' dicatat hanya pada D03. | Teks yang sama juga ada pada D02. | Tambahan | Tandai sebagai templat pada D02 dan D03. |
| V04 | D02, D03 | Perangkat portal | Handover: 'platform GeoNode di Riau tidak diimbangi SDM yang paham'. | Tidak ada penanda GeoNode atau pycsw pada XML D02 dan D03. Penyebab kualitas isi tidak dapat disimpulkan dari metadata. | Tidak didukung data | Jangan menulis klaim tentang perangkat atau SDM. Tulis sebagai pengamatan isi saja. |
| V05 | D02 | Kontak dan kategori topik | Tidak dicatat. | Email gmail, nama individu 'Bidang', tanpa telepon. topicCategory geoscientificInformation untuk zonasi terumbu karang. | Tambahan | Dikodekan di E20 dan E10. |
| V06 | D04 | Kualitas lineage | Spreadsheet: 'Abstrak dan Lineage BAGUS (mencantumkan Perda)'. Handover: 'lumayan bagus'. | Lineage hanya satu kalimat yang merujuk Perda Kalteng No. 1 Tahun 2019 (RZWP3K). Tidak ada sumber data, metode, atau waktu. Kata 'juga' menunjukkan kalimat awal mungkin terpotong. | Dikoreksi | Dikodekan 0,5 (E24) dan 0 (E25, E26). Cek apakah portal menampilkan teks lineage yang lebih panjang. |
| V07 | D04 | Kontak, lisensi, bahasa | Kontak kosong (nilReason=missing), lisensi Not Specified, bahasa salah. | Terkonfirmasi. Seluruh bidang kontak nilReason=missing; lisensi 'Not Specified' dan 'None'; bahasa metadata dan data 'eng'. | Terkonfirmasi | - |
| V08 | D04, D06 | CRS | Tidak dicatat. | Metadata menyatakan EPSG:4326, tetapi URL layanan WFS dan WMS memakai EPSG:32749 (D04) dan EPSG:32748 (D06). | Tambahan, perlu dicek | Periksa CRS asli layer di portal. Mungkin perilaku bawaan GeoNode. Jangan disimpulkan sebelum dicek. |
| V09 | D05 | Typo nama layer | Ada typo di nama layer. Handover: jalur\_penagkapan\_ikant. | alternateTitle dan typename WFS memuat 'jalur\_penagkapan\_ikant'. | Terkonfirmasi | Catat sebagai pengamatan kualitatif, bukan elemen skor. |
| V10 | D05, D15 | Generalisasi Aceh | Handover: portal Aceh SELALU mengosongkan Tujuan dan tidak pernah mencantumkan akurasi; kontak dan lisensi rajin. | Benar untuk dua rekaman (tujuan nilReason=missing, tidak ada akurasi). D15 memiliki telepon dan faks '-' serta alamat jalan berisi URL. | Terkonfirmasi untuk n = 2; generalisasi tidak didukung | Tulis 'pada dua rekaman Aceh dalam sampel'. |
| V11 | D05, D06, D15 | Lisensi | D05: 'Lisensi jelas'. | Lisensi berupa teks bawaan GeoNode: 'Public Domain (PD)' dengan rujukan situs copyright.gov (AS), ditambah 'Tidak ada batasan dalam penggunaan data'. D06 punya lisensi kedua yang kosong. 'Not Specified' pada D04 juga bawaan GeoNode. | Dikoreksi (konteks) | Dikodekan 1 karena status penggunaan jelas, ditandai F12. Tim boleh memutuskan 0,5 jika dianggap tidak bermakna. |
| V12 | D06 | 'Sangat rapi' | Handover: 'metadatanya sangat rapi, TAPI lineage kosong'. | Abstrak dan kontak baik, tetapi lineage dan tujuan kosong, judul nama berkas, kata kunci 'sr' tidak bermakna, label tanggal berbahasa Italia 'pubblicazione', lisensi kedua kosong. | Dikoreksi | Hindari kata 'rapi'. Gunakan hasil skor. |
| V13 | D07 | Placeholder | Banyak teks templat; bounding box 0,0,0,0; tautan C:\; rentang 2009 vs 2025. | Terkonfirmasi. Tambahan: tujuan memuat fragmen teks rusak, kata kunci digabung, identifier berspasi, dataSetURI berisi instruksi, laporan DQ bernilai 100 dengan definisi unit 'temporal consistency', distributor berisi teks templat. | Terkonfirmasi + tambahan | Dikodekan di E03, E06, E09, E11, E14, E17, E24. Penanda F01, F02, F03, F08, F09. |
| V14 | D08 | Format ESRI | Format ESRI; tanpa abstrak, kontak, bounding box; judul 040 vs 032; bocor nama laptop dan jalur lokal. | Terkonfirmasi. Ketidakcocokan 032 vs 040 tercatat di riwayat geoproses (Rename). Tautan berupa jalur jaringan lokal dengan nama host. Jumlah fitur 0 dan ukuran 0.000. 13 atribut tanpa definisi. | Terkonfirmasi + tambahan | Tulis netral: 'memuat jalur berkas lokal dan nama host perangkat'. Jangan menyebut nama host atau berspekulasi tentang pemiliknya. |
| V15 | D09 | Akurasi dan tanggal | 'Ada akurasi OA >60%'; tanggal sitasi kosong; tanpa tautan unduh; tanpa akurasi posisi. | Terkonfirmasi, tetapi OA 'tidak kurang dari 60%' adalah ambang (nilai '60%' tanpa satuan, specification nilReason=missing, 'dalam proses uji akurasi'), bukan hasil terukur. dateStamp 2015-12-01 padahal merujuk katalog fitur KUGI bertanggal 2022-09-20. | Dikoreksi + tambahan | E17 dikodekan 0,5 dan E22 dikodekan 0,5. |
| V16 | D10 | Templat ArcGIS | Lineage dan batasan hukum teks default; CRS tidak valid; extent ganda. | Terkonfirmasi. Tambahan: bahasa data 'eng', scope DQ nilReason=missing, kata kunci 'Downloadable Data' hanya dengan tautan FeatureServer, satu elemen peran menautkan codelist yang salah. | Terkonfirmasi + tambahan | - |
| V17 | D11 | 'Diamond Standard' | 10 laporan DQ; domain email @kkp.co.id salah; tanpa tautan unduh. Handover: 'diterapkan dengan sempurna'. | Ada 11 laporan DQ (bukan 10). Domain @kkp.co.id muncul di semua kontak. Tambahan: kode pos '4130'; tiga dari empat bounding box (sekitar 100 sampai 116 BT) jauh dari Raja Ampat (sekitar 130 BT); tidak ada lisensi; semua hasil konformitas punya specification nilReason=missing; TemporalValidity pass=true tetapi penjelasan '> 2 tahun'; kata kunci 'Downloadable Data' tanpa tautan; teks 'SNI SNI'. | Dikoreksi + tambahan | Gunakan D11 sebagai contoh terbaik, bukan sempurna. Cek bounding box di GIS sebelum ditulis. |
| V18 | D12 | Metadata BIG | Judul nama berkas; bounding box nasional; lineage, akurasi, topicCategory kosong; tautan WMS. | Terkonfirmasi; blok dataQualityInfo tidak ada sama sekali. Tambahan: tidak ada lisensi, tidak ada datum vertikal (verticalElement missing), skala 1:250000 vs judul 100m, bahasa data 'Indonesia' (teks bebas), abstrak tidak menyebut Ambon. | Terkonfirmasi + tambahan | Hindari klaim 'krusial untuk pelayaran' kecuali ada sitasi. |
| V19 | D13 | Status ditolak | Handover: 'kurasi\_notes'; portal tahu formatnya salah dan menolaknya tetapi tidak ada takedown; kegagalan sistemik. | Nama field 'kurasi\_notes\_extra'. review\_status 'rejected' dan catatan 'Format data tidak sesuai' tercatat enam kali, sesuai enam sumber daya (resources). Empat sumber daya mengarah ke halaman kontak BIG, satu ke layanan MapServer, satu ke portal layanan data. Rekaman berasal dari harvest 'Badan Informasi Geospasial - CSW'. | Dikoreksi | Tulis sebagai pengamatan: 'rekaman memuat penanda rejected pada enam sumber daya'. Kebijakan portal tidak diketahui. |
| V20 | D14 | Tahun | Data 2007 baru dipublikasikan 2022. | dataset-reference-date (publication) 2007-09-01; metadata-date 2020-02-06; rekaman portal dibuat 2022-10-09. Terkonfirmasi: kontak 'Belum Ada', lineage dan lisensi kosong, tag 'Dataset Khusus', pihak bertanggung jawab 'JaringanKalbar', tautan layanan HTTP port 8080. | Dikoreksi | Tulis tiga tanggal itu apa adanya. Kolom TAHUN harus dipecah (sudah dilakukan di Sampel\_v2). |
| V21 | D15 | Koordinat | Handover penutup: D15 'tidak ada koordinat'. | Bounding box ada (95,16 sampai 97,78 BT; 2,30 sampai 5,64 LU). Yang tidak ada adalah akurasi posisi. | Dikoreksi (klaim lama salah) | Hapus klaim tersebut. |
| V22 | D13, D14 | Rekaman CKAN | Diaudit seperti metadata dataset biasa (D01 kini berupa XML GeoNode). | Rekaman CKAN adalah tampilan hasil harvest atau pemetaan portal. Kekosongan (mis. lineage) bisa berasal dari sumber atau dari pemetaan harvest. | Ancaman validitas | Tulis di bagian keterbatasan. Bila ada, ambil XML sumber lewat CSW induk. |
| V23 | D02, D03, D09, D10, D11 | Nama standar | Kolom STANDAR METADATA: ISO 19139. | metadataStandardName memang 'ISO 19139 ... Implementation Specification' (spesifikasi implementasi XML, bukan standar isi ISO 19115). | Terkonfirmasi sebagai pernyataan rekaman | Kolom dipecah menjadi standar isi dan pengodean. Penanda F13. |
| V24 | D12, D13, D14 | URL sumber | D12: endpoint WMS. D13: beranda tanahair.indonesia.go.id. D14: dua alternatif tautan. | URL tidak menunjuk ke rekaman spesifik, sehingga audit tidak dapat direplikasi. | Perlu dilengkapi tim | Catat URL rekaman atau permintaan CSW GetRecordById (D12: fileIdentifier 'Ambon\_100m'), URL API CKAN (D13: nama 'indeks\_lpi\_25k'; D14: nama 'kawasan\_konservasi'). |
| V26 | D01 | Catatan lama D01 | Abstrak mengulang judul, kontak 'Admin Admin', bounding box seluruh Indonesia, lisensi OSM padahal sumber Bappedalitbang. | Terkonfirmasi semuanya. Kontak 'Admin Admin' ada di dua blok kontak dengan organisasi nilReason=missing; bounding box 94,87 sampai 140,77 BT dan -13,42 sampai 7,40 LU. Tambahan: satu kata kunci 'Global', tanpa tujuan, akurasi, atau cakupan temporal; peran 'Metadata Author' dan 'Point of Contact' berupa teks bebas; satu tautan unduh berupa jalur relatif '/download/11'; lineage hanya 'SUMBER : BAPPEDALITBANG KABUPATEN KUBURAYA'. | Terkonfirmasi + tambahan | Dikodekan di E04, E07 sampai E09, E11, E13, E19, E21, E24, E25. Penanda F01, F02, F06, F12. |
| V25 | D02, D05 | Kontak gmail | Tidak dicatat. | D02 dan D05 memakai email gmail untuk kontak instansi. | Tambahan | Dikodekan 0,5 di E20 (email non-institusional). Tim boleh mengubah aturan ini. |
| V27 | D16, D17, D18 | Sampel pengganti mdb | Tidak dicatat (sampel v4 tidak memuat rekaman mdb). | Tiga berkas mdb diterima 29 Oktober 2026 (garis\_pantai\_banten.xml, batas\_pengelolaan\_laut\_banten.xml, Perairan\_NTB.xml) dan menggantikan D02, D06, D15. Ketiganya berformat mdb dengan namespace mdb/2.0. | Terkonfirmasi | Simpan XML asli di data\_mentah/D16, D17, D18. Arsip D02, D06, D15 ada di sheet Arsip\_Sampel\_Diganti. |
| V28 | D16, D17 | Kontak data contoh | Tidak dicatat. | Kontak originator memakai data contoh standar ("The Ancient Geographers", "Claudius Ptolomaeus", email gmail) pada kedua rekaman Banten; email distributor sama. | Tambahan | Penanda F06. E19 dan E20 tetap 1 karena kontak custodian spesifik dan beremail resmi. |
| V29 | D18 | Isi tampak salinan templat | Tidak dicatat. | Lineage (Foto Udara Lidar 2015, Stereoploting, Kontur dan Spotheight) dan laporan kualitas ("format data adalah gdb") tampak salinan alur RBI, tidak sesuai dataset batas 12 mil tahun 2025; bounding box tidak valid. | Tambahan | Dikodekan menurut teks yang tertulis (kelengkapan, bukan kebenaran). Penanda F01, F02, F06, F10, F11. |
| V30 | D16, D17 | Teks rusak (F10) | Tidak dicatat. | Nama kontak originator memuat fragmen markup literal "<ContactPerson>" sebelum nama (sebagai teks, bukan tag XML). Format distribusi "PNG" berversi "2023-2043" (rentang tahun pada kolom edisi) untuk data vektor. | Tambahan | Penanda F10 dinyalakan untuk D16 dan D17 (v7). |
| V31 | D18 | Laporan kualitas templat (F09) | V29 menyebut tampak salinan alur RBI, tetapi penanda F09 belum menyala. | Laporan DQ berisi hasil lulus/gagal tanpa nilai terukur; teks "format data adalah gdb" padahal distribusi berupa WMS; ketelitian posisi hanya "memenuhi spesifikasi". | Tambahan | Penanda F09 dinyalakan untuk D18. Placeholder E17, E25, E26 ikut ditandai agar uji sensitivitas konsisten dengan V29. |
| V32 | D16, D17, D18 | Versi skema dan nama standar | Hilmi: ketiganya format mdb terbaru dan sesuai SNI ISO 19115-3:2021; belum tahu soal edisi 2023. | Namespace mdb/2.0, cit/2.0, mrl/2.0 (D18 juga mrc/2.0 dan msr/2.0). ISO/TS 19115-3:2016 digantikan ISO 19115-3:2023; SNI 2021 terbit sebelum edisi 2023 sehingga tidak mungkin mengadopsinya. Repositori ISO/TC 211 menandai paket mdb/2.0 "historical". D16 dan D17 menulis "ISO 19115-3:2018", yang bukan edisi terbitan. | Belum terkonfirmasi | Validasi XSD dan cek prakata SNI ISO 19115-3:2021 sebelum menulis klaim kesesuaian (Standar\_Rujukan bagian D). |

## Checklist
| Checklist 32 elemen (E01-E26 inti dan E27-E32 tambahan) dan aturan skor | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 | Unnamed: 12 | Unnamed: 13 | Unnamed: 14 | Unnamed: 15 | Unnamed: 16 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Bobot elemen: 3 kritis, 2 penting, 1 pendukung (usulan). Ubah hanya sebelum pembekuan. E27-E32 berasal dari panduan BIG v6 dan masuk skor sejak v6; skor inti E01-E26 tetap dihitung sebagai pembanding. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ID | Kategori | Elemen | Bobot elemen | Nilai 1 | Nilai 0,5 | Nilai 0 | Jalur ISO 19115 (gmd) | Padanan ESRI | Padanan CKAN | Bobot di paper MQI (bila disebut) | Bobot selaras paper | Jalur ISO 19115-3 (mdb) | Jenis perubahan gmd ke mdb | Catatan migrasi gmd ke mdb (verifikasi pada XSD dan SNI) | Jalur mdb teramati pada 3 berkas (29 Okt) | Definisi operasional v7 (E27-E32) |
| E01 | Informasi umum | Bahasa metadata (dan bahasa data bila ada) | 1 | Kode ISO 639 valid dan sesuai isi | Teks bebas atau tidak sesuai isi (mis. eng untuk isi berbahasa Indonesia) | Tidak ada | gmd:language; MD\_DataIdentification/gmd:language | mdLang/languageCode | extras: metadata-language |  | 1 | mdb:defaultLocale/lan:PT\_Locale/lan:language (bahasa metadata); mdb:identificationInfo/mri:MD\_DataIdentification/mri:defaultLocale/lan:PT\_Locale/lan:language (bahasa data) | Struktur berubah | gmd:language dan gmd:characterSet tingkat metadata menjadi satu lan:PT\_Locale (language, country, characterEncoding). Isi bahasa dengan kode ISO 639-2 (mis. ind), bukan teks bebas. | Teramati |  |
| E02 | Informasi umum | Nama dan versi standar metadata | 2 | Tertulis tepat "SNI 8843-1:2019" ATAU "ISO 19115-1:2014" / "ISO 19115-3" (beserta versi/tahunnya). | Tertulis standar lama seperti "ISO 19115:2003", "ISO 19139", atau hanya menyebut "SNI 8843" tanpa versi yang jelas. | Tidak ada | gmd:metadataStandardName; gmd:metadataStandardVersion | (tidak ada) | (tidak ada) |  | 2 | mdb:metadataStandard/cit:CI\_Citation/(cit:title, cit:edition); profil: mdb:metadataProfile/cit:CI\_Citation | Struktur berubah | Nama dan versi yang terpisah menjadi satu CI\_Citation (title + edition). Profil SNI 8843-1:2019 semestinya disitir sebagai profil; konfirmasi pada teks SNI 8843-1. | Teramati |  |
| E03 | Informasi umum | Tautan akses data atau layanan | 2 | Tautan unduh langsung atau layanan fitur (WFS, FeatureServer), bukan jalur lokal | Hanya layanan visual (WMS, MapServer) atau halaman informasi | Tidak ada, jalur lokal, atau teks templat (ketersediaan online tidak diuji) | gmd:distributionInfo//gmd:onLine/gmd:linkage | Esri/DataProperties/itemProps/itemLocation | resources[].url | 1 | 1 | mdb:distributionInfo/mrd:MD\_Distribution/mrd:transferOptions/mrd:MD\_DigitalTransferOptions/mrd:onLine/cit:CI\_OnlineResource/cit:linkage | Ganti namespace | Hanya prefiks namespace yang berubah (gmd menjadi mri, cit, gex, mrd, mco, mmi, msr, mpc atau mas). | Teramati |  |
| E04 | Identifikasi | Judul informatif | 3 | Judul deskriptif memuat tema dan lokasi | Kode, nama berkas, atau tanpa lokasi | Tidak ada | gmd:citation//gmd:title | dataIdInfo/idCitation/resTitle | title |  | 3 | mdb:identificationInfo/mri:MD\_DataIdentification/mri:citation/cit:CI\_Citation/cit:title | Ganti namespace | Hanya prefiks namespace yang berubah (gmd menjadi mri, cit, gex, mrd, mco, mmi, msr, mpc atau mas). | Teramati |  |
| E05 | Identifikasi | Tanggal sitasi dan jenis tanggal | 2 | Tanggal dengan jenis (creation, publication, revision) | Hanya tanggal sistem atau tanpa jenis | Tidak ada | gmd:citation/gmd:date (CI\_Date + dateType) | idCitation/date; Esri/CreaDate | extras: dataset-reference-date |  | 2 | mri:citation/cit:CI\_Citation/cit:date/cit:CI\_Date (cit:date + cit:dateType) | Ganti namespace | Hanya prefiks namespace yang berubah (gmd menjadi mri, cit, gex, mrd, mco, mmi, msr, mpc atau mas). | Teramati |  |
| E06 | Identifikasi | Identifier unik | 2 | UUID atau kode terstruktur tanpa spasi | Teks bebas berspasi atau nama berkas pendek | Tidak ada | gmd:fileIdentifier | (tidak ada) | id; extras: guid | 3 | 3 | mri:citation/cit:CI\_Citation/cit:identifier/mcc:MD\_Identifier/mcc:code (identifier data); mdb:metadataIdentifier/mcc:MD\_Identifier/mcc:code (identifier rekaman) | Struktur berubah | gmd:fileIdentifier menjadi mdb:metadataIdentifier (MD\_Identifier: code, codeSpace); gmd:parentIdentifier menjadi mdb:parentMetadata (CI\_Citation). | Teramati |  |
| E07 | Deskripsi | Abstrak | 3 | Menjelaskan isi, cakupan, atau penggunaan dataset secara spesifik | Generik, definisi umum, atau mengulang judul | Tidak ada | gmd:abstract | dataIdInfo/idAbs | notes |  | 3 | mdb:identificationInfo/mri:MD\_DataIdentification/mri:abstract | Ganti namespace | Hanya prefiks namespace yang berubah (gmd menjadi mri, cit, gex, mrd, mco, mmi, msr, mpc atau mas). | Teramati |  |
| E08 | Deskripsi | Tujuan (purpose) | 2 | Tujuan atau peruntukan spesifik | Templat, generik, atau hanya pembatasan peruntukan | Kosong atau nilReason=missing | gmd:purpose | dataIdInfo/idPurp | (tidak ada) |  | 2 | mdb:identificationInfo/mri:MD\_DataIdentification/mri:purpose | Ganti namespace | Hanya prefiks namespace yang berubah (gmd menjadi mri, cit, gex, mrd, mco, mmi, msr, mpc atau mas). | Teramati |  |
| E09 | Deskripsi | Kata kunci | 1 | Dua atau lebih kata kunci relevan (tema, lokasi), terpisah | Satu kata kunci, generik, atau digabung dalam satu elemen | Tidak ada | gmd:descriptiveKeywords | dataIdInfo/searchKeys | tags | 1 | 1 | mri:descriptiveKeywords/mri:MD\_Keywords/mri:keyword | Ganti namespace | Hanya prefiks namespace yang berubah (gmd menjadi mri, cit, gex, mrd, mco, mmi, msr, mpc atau mas). | Teramati |  |
| E10 | Deskripsi | Kategori topik ISO | 1 | Nilai ISO sesuai isi | Ada tetapi kurang sesuai | Tidak ada | gmd:topicCategory | dataIdInfo/tpCat | (tidak ada) |  | 1 | mri:topicCategory/mri:MD\_TopicCategoryCode | Ganti namespace | Hanya prefiks namespace yang berubah (gmd menjadi mri, cit, gex, mrd, mco, mmi, msr, mpc atau mas). | Teramati |  |
| E11 | Deskripsi | Lisensi atau batasan penggunaan | 3 | Status penggunaan dinyatakan jelas (lisensi, terbuka, atau batasan spesifik) | Hanya batasan teknis, atau teks templat | Tidak ada, kosong, atau 'Not Specified' | gmd:resourceConstraints (useLimitation, otherConstraints) | dataIdInfo/resConst | extras: licence, access\_constraints; license\_title |  | 3 | mri:resourceConstraints/mco:MD\_Constraints/mco:useLimitation; mco:MD\_LegalConstraints/(mco:accessConstraints, mco:useConstraints, mco:otherConstraints) | Ganti namespace | Hanya prefiks namespace yang berubah (gmd menjadi mri, cit, gex, mrd, mco, mmi, msr, mpc atau mas). | Teramati |  |
| E12 | Deskripsi | Deskripsi atribut atau katalog fitur | 2 | Katalog fitur atau definisi atribut tersedia atau tertaut | Daftar atribut tanpa definisi, atau rujukan kosong | Tidak ada | gmd:contentInfo/gmd:MD\_FeatureCatalogueDescription | eainfo | (tidak ada) |  | 2 | mdb:contentInfo/mrc:MD\_FeatureCatalogueDescription (katalog fitur) atau mdb:contentInfo/mrc:MD\_CoverageDescription/mrc:attributeGroup (atribut) | Ganti namespace | Tumpang tindih dengan E31 (sama-sama contentInfo/katalog fitur). Putuskan pembagian sebelum E27-E32 dikodekan. | Teramati (D18): MD\_FeatureCatalogueDescription dan MD\_CoverageDescription (nama atribut di attributeDescription). |  |
| E13 | Cakupan | Bounding box | 3 | Valid dan sesuai lingkup dataset | Valid tetapi terlalu luas atau sebagian tidak sesuai | Tidak ada atau 0,0,0,0 | gmd:extent//gmd:EX\_GeographicBoundingBox | dataIdInfo/dataExt/geoEle | extras: bbox-\*, spatial | 3 | 3 | mri:extent/gex:EX\_Extent/gex:geographicElement/gex:EX\_GeographicBoundingBox | Ganti namespace | Hanya prefiks namespace yang berubah (gmd menjadi mri, cit, gex, mrd, mco, mmi, msr, mpc atau mas). | Teramati |  |
| E14 | Cakupan | Cakupan temporal | 2 | Periode atau waktu data terstruktur dan konsisten | Ada tetapi tidak konsisten, atau hanya dalam teks | Tidak ada | gmd:extent//gmd:temporalElement | dataIdInfo/dataExt/tempEle | (tidak ada) | 3 | 3 | mri:extent/gex:EX\_Extent/gex:temporalElement/gex:EX\_TemporalExtent | Ganti namespace | Hanya prefiks namespace yang berubah (gmd menjadi mri, cit, gex, mrd, mco, mmi, msr, mpc atau mas). | Tidak teramati: tidak ada temporalElement pada ketiga berkas |  |
| E15 | Cakupan | Sistem referensi koordinat | 2 | Menggunakan Sistem Referensi Geospasial Indonesia (SRGI) secara eksplisit atau kode EPSG yang merujuk langsung pada SRGI. | Valid tetapi hanya menggunakan EPSG:4326 (WGS84) tanpa menyebut SRGI, ATAU tidak konsisten dengan layanan yang disediakan. | Tidak ada | gmd:referenceSystemInfo | refSysInfo; Esri/DataProperties/coordRef | extras: spatial-reference-system |  | 2 | mdb:referenceSystemInfo/mrs:MD\_ReferenceSystem/mrs:referenceSystemIdentifier/mcc:MD\_Identifier (mcc:code, mcc:codeSpace) | Struktur berubah | gmd:RS\_Identifier menjadi mcc:MD\_Identifier. Aturan nilai 1 (SRGI eksplisit) membuat semua dataset sampel bernilai 0,5; lihat Log\_Koreksi S13. | Teramati |  |
| E16 | Ketelitian | Akurasi posisi | 3 | Ada nilai/uraian terukur (misal CE90, LE90, RMSE) DAN memenuhi/mengacu pada elemen akurasi posisi SNI ISO 19157. | Pernyataan kualitatif tanpa nilai angka (misal "akurasi baik"), ATAU tidak mengacu pada SNI ISO 19157. | Tidak ada | gmd:dataQualityInfo//DQ\_\*PositionalAccuracy | dqInfo | (tidak ada) | 2 | 2 | mdb:dataQualityInfo/mdq:DQ\_DataQuality/mdq:report/(mdq:DQ\_AbsoluteExternalPositionalAccuracy | mdq:DQ\_RelativeInternalPositionalAccuracy | mdq:DQ\_GriddedDataPositionalAccuracy) | Struktur berubah | DQ\_PositionalAccuracy adalah kelas abstrak pada ISO 19157; XML memuat subkelasnya. Verifikasi nama kelas dan ukuran pada SNI ISO 19157:2015 dan 19157-2:2021. | Teramati |  |
| E17 | Ketelitian | Akurasi tematik atau laporan kualitas lain | 3 | Laporan kualitas mencakup minimal 2 dari 5 elemen SNI ISO 19157 (Kelengkapan, Konsistensi Logis, Akurasi Posisi, Temporal, Tematik) dengan hasil terukur. | Hanya mencakup 1 elemen kualitas, ATAU laporan tidak lengkap (misal: hanya menyebut ambang batas tanpa hasil), ATAU berisi teks templat. | Tidak ada | gmd:dataQualityInfo//gmd:report | dqInfo | (tidak ada) |  | 3 | mdb:dataQualityInfo/mdq:DQ\_DataQuality/mdq:report/(mdq:DQ\_CompletenessCommission, DQ\_CompletenessOmission, DQ\_ThematicClassificationCorrectness, DQ\_QuantitativeAttributeAccuracy, DQ\_TemporalValidity, dll.) | Struktur berubah | DQ\_ThematicAccuracy adalah kelas abstrak; yang muncul di XML adalah subkelas. Nama kelas ISO 19157 berbeda dari ISO 19115:2003 (mis. NonQuantitativeAttributeAccuracy menjadi ...Correctness). Verifikasi pada SNI ISO 19157:2015. | Teramati sebagian: DQ\_CompletenessCommission, DQ\_DomainConsistency, DQ\_FormatConsistency, DQ\_AbsoluteExternalPositionalAccuracy (D18). Struktur D16 dan D17 berbeda (DQ\_ConformanceResult langsung di bawah report). |  |
| E18 | Ketelitian | Skala atau resolusi | 2 | Elemen terstruktur | Hanya dalam judul atau teks, atau tidak konsisten | Tidak ada | gmd:spatialResolution | dataIdInfo/dataScale | (tidak ada) |  | 2 | mri:spatialResolution/mri:MD\_Resolution/(mri:equivalentScale/mri:MD\_RepresentativeFraction/mri:denominator | mri:distance) | Ganti namespace | Hanya prefiks namespace yang berubah (gmd menjadi mri, cit, gex, mrd, mco, mmi, msr, mpc atau mas). | Teramati |  |
| E19 | Kontak | Organisasi penanggung jawab | 3 | Organisasi spesifik tercantum | Generik atau bukan organisasi | Tidak ada atau nilReason=missing | gmd:contact, gmd:pointOfContact//gmd:organisationName | dataIdInfo/idPoC | extras: responsible-party; organization |  | 3 | mdb:contact atau mri:pointOfContact: cit:CI\_Responsibility/cit:party/cit:CI\_Organisation/cit:name | Struktur berubah | gmd:CI\_ResponsibleParty menjadi cit:CI\_Responsibility (role + party). Satu party = satu individu atau satu organisasi. | Teramati |  |
| E20 | Kontak | Sarana kontak valid | 3 | Email institusional valid | Hanya telepon, email non-institusi, atau domain tampak keliru | Tidak ada atau placeholder | gmd:contactInfo//gmd:electronicMailAddress, gmd:phone | idPoC/rpCntInfo | extras: contact-email |  | 3 | cit:CI\_Responsibility/cit:party/(cit:CI\_Organisation | cit:CI\_Individual)/cit:contactInfo/cit:CI\_Contact/(cit:phone, cit:address/cit:CI\_Address/cit:electronicMailAddress, cit:onlineResource) | Struktur berubah | Sama dengan E19: kontak berada di bawah party/contactInfo. | Teramati |  |
| E21 | Kontak | Peran (role) | 1 | Nilai codelist ISO | Teks bebas atau campuran | Tidak ada | gmd:role | idPoC/role | extras: responsible-party.roles |  | 1 | cit:CI\_Responsibility/cit:role/cit:CI\_RoleCode | Struktur berubah | Panduan v6: walidata = Custodian, produsen = Originator. Panduan v3: produsen = Owner. Keduanya kode valid; pilih satu sesuai SNI 8843-1. | Teramati |  |
| E22 | Meta-metadata | Tanggal metadata | 2 | Ada dan logis | Ada tetapi tidak konsisten | Tidak ada | gmd:dateStamp | mdDateSt | extras: metadata-date |  | 2 | mdb:dateInfo/cit:CI\_Date (cit:date + cit:dateType) | Struktur berubah | gmd:dateStamp menjadi mdb:dateInfo (CI\_Date); jenis tanggal (dateType) kini ikut dicatat. | Teramati |  |
| E23 | Meta-metadata | Frekuensi pembaruan | 1 | Nilai valid selain unknown | unknown, teks bebas, atau tidak lengkap | Tidak ada | gmd:resourceMaintenance, gmd:metadataMaintenance | resMaint | extras: frequency-of-update |  | 1 | mri:resourceMaintenance/mmi:MD\_MaintenanceInformation/mmi:maintenanceAndUpdateFrequency (data); mdb:metadataMaintenance/mmi:MD\_MaintenanceInformation (metadata) | Ganti namespace | Hanya prefiks namespace yang berubah (gmd menjadi mri, cit, gex, mrd, mco, mmi, msr, mpc atau mas). | Teramati |  |
| E24 | Pemrosesan | Pernyataan lineage | 3 | Menyebut sumber, metode, atau waktu (minimal dua) | Generik, salinan abstrak, rujukan peraturan, atau templat | Kosong | gmd:dataQualityInfo//gmd:LI\_Lineage/gmd:statement | Esri/DataProperties/lineage | extras: lineage | 2 | 2 | mdb:resourceLineage/mrl:LI\_Lineage/mrl:statement | Pindah lokasi | Lineage tidak lagi di bawah dataQualityInfo; menjadi mdb:resourceLineage pada tingkat metadata. | Teramati |  |
| E25 | Pemrosesan | Sumber data | 3 | Sumber data spesifik | Generik (mis. 'survei') | Tidak ada | gmd:LI\_Lineage/gmd:source | lineage/Process (masukan) | (tidak ada) |  | 3 | mdb:resourceLineage/mrl:LI\_Lineage/mrl:source/mrl:LI\_Source/mrl:description | Pindah lokasi | Sama dengan E24 (resourceLineage). | Teramati |  |
| E26 | Pemrosesan | Langkah atau metode pemrosesan | 3 | Langkah atau metode diuraikan | Riwayat otomatis atau sangat generik | Tidak ada | gmd:LI\_Lineage/gmd:processStep | lineage/Process | (tidak ada) |  | 3 | mdb:resourceLineage/mrl:LI\_Lineage/mrl:processStep/mrl:LI\_ProcessStep/mrl:description (ekstensi ISO 19115-2: LE\_ProcessStep) | Pindah lokasi | Sama dengan E24. Langkah pemrosesan citra atau gridded memakai ekstensi ISO 19115-2 (SNI ISO 19115-2:2020). | Teramati |  |
| E27 | Informasi umum | Representasi Spasial (Topologi & Geometri) | 2 | Menyebutkan topologi, geometri, dan jumlah objek | Hanya menyebut salah satu dari topologi/geometri | Tidak ada | gmd:spatialRepresentationInfo | ESRI XML: spatRepInfo/VectSpatRep dengan topLvl/TopoLevCd (topologi), geometObjs/geoObjTyp/GeoObjTypCd (geometri), dan geometObjs/geoObjCnt (jumlah objek). | Tidak ada padanan CKAN. Rekaman tidak memuat topologi, geometri, atau jumlah objek; nilai 0. |  | 2 | mdb:spatialRepresentationInfo/msr:MD\_VectorSpatialRepresentation/(msr:topologyLevel, msr:geometricObjects/msr:MD\_GeometricObjects) | Ganti namespace | Hanya prefiks namespace yang berubah (gmd menjadi mri, cit, gex, mrd, mco, mmi, msr, mpc atau mas). Elemen tambahan dari panduan v6; dikodekan dan masuk skor sejak v6. Padanan gmd ada (kolom H), jadi elemen ini dapat dinilai pada rekaman XML ISO 19139, bukan hanya mdb. | Teramati | 1 bila topologyLevel, geometricObjectType, dan geometricObjectCount (> 0) semuanya ada. 0,5 bila satu atau dua unsur ada (jumlah objek bernilai 0 dianggap tidak valid). 0 bila elemen tidak ada atau kosong. |
| E28 | Informasi umum | Lingkup Metadata (Metadata Scope) | 1 | Ada MD\_ScopeCode (dataset) dan nama spesifik | Hanya ada MD\_ScopeCode tanpa nama | Tidak ada | gmd:hierarchyLevel | ESRI XML: mdHrLv/ScopeCd (kode lingkup) dan mdHrLvName (nama lingkup). | CKAN extras: resource-type (padanan hierarchyLevel; hasil harvest dari ISO). Nama lingkup tidak ada, sehingga paling tinggi 0,5. |  | 1 | mdb:metadataScope/mdb:MD\_MetadataScope/(mdb:resourceScope, mdb:name) | Struktur berubah | gmd:hierarchyLevel dan hierarchyLevelName menjadi mdb:metadataScope (resourceScope + name). Panduan v6 bab 5 dan 6. Elemen tambahan dari panduan v6; dikodekan dan masuk skor sejak v6. Padanan gmd ada (kolom H), jadi elemen ini dapat dinilai pada rekaman XML ISO 19139, bukan hanya mdb. Addendum handover menulis mdb:metadataScope/mcc:MD\_Scope; kelas yang kemungkinan benar adalah mdb:MD\_MetadataScope (verifikasi XSD). | Teramati: mdb:MD\_MetadataScope (bukan mcc:MD\_Scope). | 1 bila kode lingkup ada dan nama lingkup berisi teks spesifik. Nama yang hanya berupa kata lingkup ISO (dataset, series, featureType, service, dan sejenisnya) tidak spesifik. 0,5 bila hanya kode atau nama tidak spesifik. 0 bila tidak ada. |
| E29 | Deskripsi | Katalog Simbol (Portrayal Catalogue) | 1 | Ada sitasi ke dokumen aturan simbol/SNI | Ada teks tapi tidak spesifik | Tidak ada | gmd:portrayalCatalogueInfo | Tidak ada padanan ESRI. Elemen portCatInfo tidak ditemukan pada sampel; nilai 0. | Tidak ada padanan CKAN; nilai 0. |  | 1 | mdb:portrayalCatalogueInfo/mpc:MD\_PortrayalCatalogueReference/mpc:portrayalCatalogueCitation | Ganti namespace | Hanya prefiks namespace yang berubah (gmd menjadi mri, cit, gex, mrd, mco, mmi, msr, mpc atau mas). Elemen tambahan dari panduan v6; dikodekan dan masuk skor sejak v6. Padanan gmd ada (kolom H), jadi elemen ini dapat dinilai pada rekaman XML ISO 19139, bukan hanya mdb. | Teramati | 1 bila ada sitasi dokumen aturan simbol atau SNI/RSNI. 0,5 bila ada teks tetapi bukan sitasi dokumen (mis. tabel warna, judul dataset). 0 bila tidak ada. |
| E30 | Deskripsi | Skema Aplikasi (Application Schema) | 2 | Ada nama skema (UML) dan tautan/dokumen | Hanya ada nama skema tanpa dokumen | Tidak ada | gmd:applicationSchemaInfo | Tidak ada padanan ESRI. Elemen appSchInfo tidak ditemukan pada sampel; nilai 0. | Tidak ada padanan CKAN; nilai 0. |  | 2 | mdb:applicationSchemaInfo/mas:MD\_ApplicationSchemaInformation | Ganti namespace | Hanya prefiks namespace yang berubah (gmd menjadi mri, cit, gex, mrd, mco, mmi, msr, mpc atau mas). Elemen tambahan dari panduan v6; dikodekan dan masuk skor sejak v6. Padanan gmd ada (kolom H), jadi elemen ini dapat dinilai pada rekaman XML ISO 19139, bukan hanya mdb. | Teramati | 1 bila ada nama skema dan tautan atau dokumen. 0,5 bila hanya nama. 0 bila tidak ada. |
| E31 | Deskripsi | Kepatuhan KUGI | 3 | Ada complianceCode (true) dan sitasi KUGI | Ada sitasi KUGI tapi complianceCode kosong | Tidak ada | gmd:contentInfo | Tidak ada padanan ESRI. Elemen contInfo tidak ditemukan pada sampel; nilai 0. | Tidak ada padanan CKAN. Tidak ada complianceCode atau sitasi KUGI pada rekaman; nilai 0. |  | 3 | mdb:contentInfo/mrc:MD\_FeatureCatalogueDescription/(mrc:complianceCode, mrc:featureCatalogueCitation) | Ganti namespace | Tumpang tindih dengan E12 (lihat catatan E12). Elemen tambahan dari panduan v6; dikodekan dan masuk skor sejak v6. Padanan gmd ada (kolom H), jadi elemen ini dapat dinilai pada rekaman XML ISO 19139, bukan hanya mdb. | Teramati | 1 bila complianceCode true dan sitasi menyebut KUGI (judul "Katalog Unsur Geografi Indonesia" atau singkatan KUGI). 0,5 bila sitasi KUGI tanpa complianceCode true. 0 bila tidak ada atau sitasinya bukan KUGI (mis. tautan katalog fitur GeoNode). |
| E32 | Informasi umum | Metadata Layanan (Service) | 2 | Ada tautan WMS/WFS/CSW dan deskripsi layanan | Hanya ada tautan tanpa deskripsi/operasi | Tidak ada | gmd:distributionInfo | ESRI XML: distInfo (distributor, transfer, format). Tautan layanan tidak ada pada sampel; nilai 0. | CKAN resources[]: resource\_locator\_protocol (OGC:WMS, OGC:WFS, ESRI:ArcGIS:MapServer, dan sejenisnya), url, dan description. |  | 2 | mdb:identificationInfo/srv:SV\_ServiceIdentification (tautan layanan tetap di mrd:onLine) | Pindah lokasi | Sheet versi lama menulis mdb:distributionInfo. Metadata layanan memakai srv:SV\_ServiceIdentification pada identificationInfo (panduan v6, bab Informasi Metadata Layanan, hlm 61); tautan tetap di mrd:onLine. Elemen tambahan dari panduan v6; dikodekan dan masuk skor sejak v6. Padanan gmd ada (kolom H), jadi elemen ini dapat dinilai pada rekaman XML ISO 19139, bukan hanya mdb. Penerapan aturan: 1 bila ada tautan layanan dengan protokol layanan terdeklarasi (OGC:WMS, OGC:WFS, OGC:CSW, ESRI:ArcGIS:\*Server) dan deskripsi yang menyebut layanan atau layernya; 0,5 bila ada tautan layanan tanpa deskripsi atau deskripsinya hanya label teknis; 0 bila tidak ada tautan layanan. | Tidak teramati: tidak ada srv:SV\_ServiceIdentification pada ketiga berkas | 1 bila ada tautan layanan (OGC WMS/WFS/CSW/WCS, ArcGIS FeatureServer/MapServer) dengan deskripsi yang menjelaskan layanan atau layer yang dilayani. 0,5 bila hanya tautan, atau deskripsi hanya berupa label jenis/format ("OGC WMS Service", "RAW", "ImageWMS"), nama portal, atau pengulangan judul dataset. 0 bila tidak ada tautan layanan. Diputuskan Ketua 31 Okt 2026. |

## Bobot
| Bobot kategori dan skema sensitivitas | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 |
| --- | --- | --- | --- |
| Skema A adalah usulan utama. B dan C hanya untuk uji sensitivitas. |  |  |  |
| Kategori | Skema A (usulan) | Skema B (setara) | Skema C (Ketelitian dan Pemrosesan x2) |
| Informasi umum | 5 | 12.5 | 3.571429 |
| Identifikasi | 15 | 12.5 | 10.714286 |
| Deskripsi | 10 | 12.5 | 7.142857 |
| Cakupan | 15 | 12.5 | 10.714286 |
| Ketelitian | 20 | 12.5 | 28.571429 |
| Kontak | 10 | 12.5 | 7.142857 |
| Meta-metadata | 5 | 12.5 | 3.571429 |
| Pemrosesan | 20 | 12.5 | 28.571429 |
| Total | 100 | 100 | 100 |
| Catatan: total tiap skema harus 100. Skema A bersumber dari usulan KOMPAS. Paper MQI asli tidak memakai bobot kategori (bobot parameter dijumlahkan lintas kategori), jadi skema A bukan bagian dari MQI asli. |  |  |  |

## Kodean
| Kodean 32 elemen x 15 dataset (DRAF untuk diverifikasi tim) | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 | Unnamed: 12 | Unnamed: 13 | Unnamed: 14 | Unnamed: 15 | Unnamed: 16 | Unnamed: 17 | Unnamed: 18 | Unnamed: 19 | Unnamed: 20 | Unnamed: 21 | Unnamed: 22 | Unnamed: 23 | Unnamed: 24 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Nilai 1 / 0,5 / 0. Dasar tiap nilai di bawah 1 ada di sheet Bukti. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ID | Kategori | Bobot | Elemen | D01 | D03 | D04 | D05 | D07 | D08 | D09 | D10 | D11 | D12 | D13 | D14 | D16 | D17 | D18 | n = 1 | n = 0,5 | n = 0 | % belum penuh | Rata-rata nilai | Kunci urut n=0 (bantu) |
| E01 | Informasi umum | 1 | Bahasa metadata | 1 | 1 | 0.5 | 1 | 0.5 | 0.5 | 1 | 0.5 | 1 | 0.5 | 0.5 | 1 | 1 | 1 | 1 | 9 | 6 | 0 | 0.4 | 0.8 | 0.095 |
| E02 | Informasi umum | 2 | Nama dan versi standar | 0.5 | 0.5 | 0.5 | 0.5 | 1 | 0 | 0.5 | 0.5 | 0.5 | 0.5 | 0 | 0 | 1 | 1 | 1 | 4 | 8 | 3 | 0.733333 | 0.533333 | 3.094 |
| E03 | Informasi umum | 2 | Tautan akses data | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 0 | 0.5 | 0.5 | 1 | 0.5 | 0.5 | 0.5 | 6 | 5 | 4 | 0.6 | 0.566667 | 4.093 |
| E04 | Identifikasi | 3 | Judul informatif | 0.5 | 0.5 | 1 | 1 | 1 | 0.5 | 1 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 1 | 5 | 10 | 0 | 0.666667 | 0.666667 | 0.092 |
| E05 | Identifikasi | 2 | Tanggal sitasi | 1 | 1 | 1 | 1 | 1 | 0.5 | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 13 | 1 | 1 | 0.133333 | 0.9 | 1.091 |
| E06 | Identifikasi | 2 | Identifier unik | 1 | 1 | 1 | 1 | 0.5 | 0 | 1 | 0.5 | 1 | 0.5 | 1 | 1 | 1 | 1 | 1 | 11 | 3 | 1 | 0.266667 | 0.833333 | 1.09 |
| E07 | Deskripsi | 3 | Abstrak | 0.5 | 0.5 | 1 | 1 | 1 | 0 | 1 | 1 | 1 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 1 | 7 | 7 | 1 | 0.533333 | 0.7 | 1.089 |
| E08 | Deskripsi | 2 | Tujuan | 0 | 0.5 | 1 | 0 | 1 | 0 | 1 | 1 | 1 | 0.5 | 0 | 0 | 0 | 0 | 1 | 6 | 2 | 7 | 0.6 | 0.466667 | 7.088 |
| E09 | Deskripsi | 1 | Kata kunci | 0.5 | 0.5 | 1 | 1 | 0.5 | 0 | 1 | 1 | 1 | 1 | 1 | 0.5 | 0.5 | 0.5 | 1 | 8 | 6 | 1 | 0.466667 | 0.733333 | 1.087 |
| E10 | Deskripsi | 1 | Kategori topik | 1 | 0.5 | 1 | 1 | 1 | 0 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 10 | 1 | 4 | 0.333333 | 0.7 | 4.086 |
| E11 | Deskripsi | 3 | Lisensi/batasan | 0.5 | 1 | 0 | 1 | 0.5 | 0 | 0.5 | 0.5 | 0 | 0 | 1 | 0 | 0.5 | 0.5 | 0.5 | 3 | 7 | 5 | 0.8 | 0.433333 | 5.085 |
| E12 | Deskripsi | 2 | Katalog fitur | 1 | 0 | 1 | 1 | 0.5 | 0.5 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 6 | 2 | 7 | 0.6 | 0.466667 | 7.084 |
| E13 | Cakupan | 3 | Bounding box | 0.5 | 1 | 1 | 1 | 0 | 0 | 1 | 1 | 0.5 | 0.5 | 1 | 1 | 1 | 1 | 0 | 9 | 3 | 3 | 0.4 | 0.7 | 3.083 |
| E14 | Cakupan | 2 | Cakupan temporal | 0 | 0 | 0 | 0 | 0.5 | 0 | 1 | 0 | 0.5 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 2 | 12 | 0.933333 | 0.133333 | 12.082 |
| E15 | Cakupan | 2 | Sistem referensi | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0 | 15 | 0 | 1 | 0.5 | 0.081 |
| E16 | Ketelitian | 3 | Akurasi posisi | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0.5 | 0 | 0 | 0 | 0 | 0 | 0.5 | 0 | 2 | 13 | 1 | 0.066667 | 13.08 |
| E17 | Ketelitian | 3 | Akurasi tematik | 0 | 0 | 0 | 0 | 0.5 | 0 | 0.5 | 0.5 | 0.5 | 0 | 0 | 0 | 0.5 | 0.5 | 0.5 | 0 | 7 | 8 | 1 | 0.233333 | 8.079 |
| E18 | Ketelitian | 2 | Skala/resolusi | 0 | 0.5 | 0 | 0 | 1 | 0.5 | 1 | 1 | 1 | 0.5 | 0.5 | 0 | 0 | 0 | 1 | 5 | 4 | 6 | 0.666667 | 0.466667 | 6.078 |
| E19 | Kontak | 3 | Organisasi | 0 | 1 | 0 | 1 | 1 | 0 | 1 | 1 | 1 | 1 | 1 | 0.5 | 1 | 1 | 1 | 11 | 1 | 3 | 0.266667 | 0.766667 | 3.077 |
| E20 | Kontak | 3 | Sarana kontak | 1 | 1 | 0 | 0.5 | 1 | 0 | 1 | 1 | 0.5 | 1 | 1 | 0 | 1 | 1 | 1 | 10 | 2 | 3 | 0.333333 | 0.733333 | 3.076 |
| E21 | Kontak | 1 | Peran (role) | 0.5 | 1 | 1 | 1 | 0.5 | 0 | 1 | 1 | 1 | 0.5 | 0.5 | 1 | 1 | 1 | 1 | 10 | 4 | 1 | 0.333333 | 0.8 | 1.075 |
| E22 | Meta-metadata | 2 | Tanggal metadata | 1 | 1 | 1 | 1 | 1 | 1 | 0.5 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 14 | 1 | 0 | 0.066667 | 0.966667 | 0.074 |
| E23 | Meta-metadata | 1 | Frekuensi pembaruan | 0 | 1 | 0.5 | 0 | 0.5 | 0 | 0.5 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 9 | 3 | 3 | 0.4 | 0.7 | 3.073 |
| E24 | Pemrosesan | 3 | Pernyataan lineage | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 1 | 0.5 | 1 | 0 | 0 | 0 | 0 | 0 | 0.5 | 2 | 8 | 5 | 0.866667 | 0.4 | 5.072 |
| E25 | Pemrosesan | 3 | Sumber data | 0.5 | 0 | 0 | 0.5 | 0 | 0.5 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 3 | 3 | 9 | 0.8 | 0.3 | 9.071 |
| E26 | Pemrosesan | 3 | Langkah proses | 0 | 0 | 0 | 0 | 0 | 0.5 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 3 | 1 | 11 | 0.8 | 0.233333 | 11.07 |
| E27 | Informasi umum | 2 | Representasi Spasial (Topologi & Geometri) | 0 | 0 | 0 | 0 | 0.5 | 0.5 | 1 | 1 | 1 | 0.5 | 0 | 0 | 0 | 0 | 0.5 | 3 | 4 | 8 | 0.8 | 0.333333 | 8.069 |
| E28 | Informasi umum | 1 | Lingkup Metadata (Metadata Scope) | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 0.5 | 1 | 1 | 14 | 0 | 0.933333 | 0.533333 | 0.068 |
| E29 | Deskripsi | 1 | Katalog Simbol (Portrayal Catalogue) | 0 | 0 | 0 | 0 | 0.5 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 2 | 1 | 12 | 0.866667 | 0.166667 | 12.067 |
| E30 | Deskripsi | 2 | Skema Aplikasi (Application Schema) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 14 | 0.933333 | 0.066667 | 14.066 |
| E31 | Deskripsi | 3 | Kepatuhan KUGI | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 3 | 0 | 12 | 0.8 | 0.2 | 12.065 |
| E32 | Informasi umum | 2 | Metadata Layanan (Service) | 1 | 0.5 | 1 | 1 | 0 | 0 | 0 | 0.5 | 0 | 0.5 | 1 | 0.5 | 0.5 | 0.5 | 0.5 | 4 | 7 | 4 | 0.733333 | 0.5 | 4.064 |

## Placeholder
| Penanda teks templat, salinan, atau bawaan (1 = ya) | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 | Unnamed: 12 | Unnamed: 13 | Unnamed: 14 | Unnamed: 15 | Unnamed: 16 | Unnamed: 17 | Unnamed: 18 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dipakai untuk uji sensitivitas: skor dihitung ulang dengan nilai sel penanda = 0. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ID | Kategori | Bobot | Elemen | D01 | D03 | D04 | D05 | D07 | D08 | D09 | D10 | D11 | D12 | D13 | D14 | D16 | D17 | D18 |
| E01 | Informasi umum | 1 | Bahasa metadata (dan bahasa data bila ada) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E02 | Informasi umum | 2 | Nama dan versi standar metadata | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E03 | Informasi umum | 2 | Tautan akses data atau layanan | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E04 | Identifikasi | 3 | Judul informatif | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E05 | Identifikasi | 2 | Tanggal sitasi dan jenis tanggal | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E06 | Identifikasi | 2 | Identifier unik | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E07 | Deskripsi | 3 | Abstrak | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 0 |
| E08 | Deskripsi | 2 | Tujuan (purpose) | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E09 | Deskripsi | 1 | Kata kunci | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 0 |
| E10 | Deskripsi | 1 | Kategori topik ISO | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E11 | Deskripsi | 3 | Lisensi atau batasan penggunaan | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | 1 |
| E12 | Deskripsi | 2 | Deskripsi atribut atau katalog fitur | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E13 | Cakupan | 3 | Bounding box | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E14 | Cakupan | 2 | Cakupan temporal | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E15 | Cakupan | 2 | Sistem referensi koordinat | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E16 | Ketelitian | 3 | Akurasi posisi | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E17 | Ketelitian | 3 | Akurasi tematik atau laporan kualitas lain | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| E18 | Ketelitian | 2 | Skala atau resolusi | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E19 | Kontak | 3 | Organisasi penanggung jawab | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E20 | Kontak | 3 | Sarana kontak valid | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E21 | Kontak | 1 | Peran (role) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E22 | Meta-metadata | 2 | Tanggal metadata | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E23 | Meta-metadata | 1 | Frekuensi pembaruan | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E24 | Pemrosesan | 3 | Pernyataan lineage | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| E25 | Pemrosesan | 3 | Sumber data | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| E26 | Pemrosesan | 3 | Langkah atau metode pemrosesan | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| E27 | Informasi umum | 2 | Representasi Spasial (Topologi & Geometri) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E28 | Informasi umum | 1 | Lingkup Metadata (Metadata Scope) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E29 | Deskripsi | 1 | Katalog Simbol (Portrayal Catalogue) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E30 | Deskripsi | 2 | Skema Aplikasi (Application Schema) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E31 | Deskripsi | 3 | Kepatuhan KUGI | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| E32 | Informasi umum | 2 | Metadata Layanan (Service) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Jumlah sel penanda |  |  |  |  | 21 |  |  |  |  |  |  |  |  |  |  |  |  |  |

## Bukti
| Bukti dari file mentah untuk nilai di bawah 1 dan catatan penting | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 |
| --- | --- | --- | --- | --- | --- |
| Nilai dan penanda ditarik dari Kodean dan Placeholder dengan rumus. |  |  |  |  |  |
| Dataset | Elemen | Nama elemen | Nilai | Placeholder | Bukti |
| D01 | E02 | Nama dan versi standar metadata | 0.5 | 0 | Standar isi dinyatakan di rekaman: ISO 19115:2003 (standar lama; belum menyebut SNI 8843-1:2019, ISO 19115-1 atau ISO 19115-3). Sumber: Sampel\_v2 kolom G. |
| D01 | E03 | Tautan akses data atau layanan | 1 | 0 | Tautan unduh '/download/11' (relatif) dan URL penuh geoportal.kuburaya.go.id/download/11; WFS shape-zip tersedia |
| D01 | E04 | Judul informatif | 0.5 | 0 | Judul 'ALUR MIGRASI PENYU' tanpa lokasi (Kubu Raya tidak disebut) |
| D01 | E07 | Abstrak | 0.5 | 1 | Abstrak identik dengan judul ('ALUR MIGRASI PENYU') |
| D01 | E08 | Tujuan (purpose) | 0 | 0 | Tujuan nilReason=missing |
| D01 | E09 | Kata kunci | 0.5 | 0 | Satu kata kunci 'Global' (tidak sesuai dataset lokal) |
| D01 | E11 | Lisensi atau batasan penggunaan | 0.5 | 0 | Lisensi ODbL/OSM (bawaan GeoNode) bertentangan dengan pernyataan sumber 'BAPPEDALITBANG KABUPATEN KUBURAYA' |
| D01 | E13 | Bounding box | 0.5 | 0 | Bounding box 94,87 sampai 140,77 BT dan -13,42 sampai 7,40 LU (seluruh Indonesia) untuk dataset Kubu Raya |
| D01 | E14 | Cakupan temporal | 0 | 0 | Tidak ditemukan pada rekaman. |
| D01 | E16 | Akurasi posisi | 0 | 0 | Tidak ditemukan pada rekaman. |
| D01 | E17 | Akurasi tematik atau laporan kualitas lain | 0 | 0 | Tidak ditemukan pada rekaman. |
| D01 | E18 | Skala atau resolusi | 0 | 0 | Tidak ditemukan pada rekaman. |
| D01 | E19 | Organisasi penanggung jawab | 0 | 0 | organisationName nilReason=missing pada semua kontak; nama instansi hanya muncul di teks sumber |
| D01 | E20 | Sarana kontak valid | 1 | 0 | Email litbang@kuburayakab.go.id (domain resmi); telepon nilReason=missing; nama kontak 'Admin Admin' (akun admin GeoNode) |
| D01 | E21 | Peran (role) | 0.5 | 0 | Peran 'Metadata Author' dan 'Point of Contact' (teks bebas, bukan codelist); peran owner valid pada pointOfContact |
| D01 | E23 | Frekuensi pembaruan | 0 | 0 | Tidak ditemukan pada rekaman. |
| D01 | E24 | Pernyataan lineage | 0.5 | 0 | Lineage hanya 'SUMBER : BAPPEDALITBANG KABUPATEN KUBURAYA' (atribusi, tanpa metode atau waktu) |
| D01 | E25 | Sumber data | 0.5 | 0 | Sumber disebut sebatas instansi (Bappedalitbang), bukan data atau survei |
| D01 | E26 | Langkah atau metode pemrosesan | 0 | 0 | Tidak ditemukan pada rekaman. |
| D01 | E27 | Representasi Spasial (Topologi & Geometri) | 0 | 0 | Elemen spatialRepresentationInfo ada tetapi kosong (tidak berisi MD\_VectorSpatialRepresentation). |
| D01 | E28 | Lingkup Metadata (Metadata Scope) | 0.5 | 0 | hierarchyLevel berkode "dataset"; tidak ada hierarchyLevelName. |
| D01 | E29 | Katalog Simbol (Portrayal Catalogue) | 0 | 0 | Tidak ada portrayalCatalogueInfo. |
| D01 | E30 | Skema Aplikasi (Application Schema) | 0 | 0 | Tidak ada applicationSchemaInfo. |
| D01 | E31 | Kepatuhan KUGI | 0 | 0 | contentInfo memuat MD\_FeatureCatalogueDescription dengan includedWithDataset false dan tautan xlink ke katalog fitur GeoNode; tanpa complianceCode dan tanpa sitasi KUGI. |
| D01 | E32 | Metadata Layanan (Service) | 1 | 0 | Tautan OGC:WMS dan OGC:WFS pada geoportal.kuburaya.go.id/geoserver/ows dengan deskripsi "geonode Service - Provides Layer: ...". Tidak ada srv:SV\_ServiceIdentification; nilai 1 mengikuti teks aturan E32 dan tumpang tindih dengan E03. |
| D03 | E02 | Nama dan versi standar metadata | 0.5 | 0 | Nama standar 'ISO 19139 ... Implementation Specification' (spesifikasi implementasi XML) |
| D03 | E04 | Judul informatif | 0.5 | 0 | Judul berupa kode: ADMINLAUTRIAU\_AR\_2026\_250K |
| D03 | E05 | Tanggal sitasi dan jenis tanggal | 1 | 0 | Tanggal pembuatan, publikasi, dan revisi identik (2026-07-10) |
| D03 | E07 | Abstrak | 0.5 | 0 | Abstrak pendek yang mengulang judul: 'Batas Kewenangan Pengelolaan Wilayah Laut dan Bagi Hasil Kelautan' |
| D03 | E08 | Tujuan (purpose) | 0.5 | 1 | Tujuan templat 'Dataset spasial untuk kebutuhan GIS' |
| D03 | E09 | Kata kunci | 0.5 | 0 | Dua kata kunci generik: 'admin', 'laut' |
| D03 | E10 | Kategori topik ISO | 0.5 | 0 | geoscientificInformation untuk batas administrasi laut; kategori boundaries lebih sesuai |
| D03 | E12 | Deskripsi atribut atau katalog fitur | 0 | 0 | Tidak ditemukan pada rekaman. |
| D03 | E14 | Cakupan temporal | 0 | 0 | Tidak ada temporalElement |
| D03 | E16 | Akurasi posisi | 0 | 0 | Tidak ditemukan pada rekaman. |
| D03 | E17 | Akurasi tematik atau laporan kualitas lain | 0 | 0 | Tidak ditemukan pada rekaman. |
| D03 | E18 | Skala atau resolusi | 0.5 | 0 | Skala 250K hanya pada judul |
| D03 | E24 | Pernyataan lineage | 0.5 | 1 | Pernyataan lineage identik dengan abstrak |
| D03 | E25 | Sumber data | 0 | 0 | Tidak ditemukan pada rekaman. |
| D03 | E26 | Langkah atau metode pemrosesan | 0 | 0 | Tidak ditemukan pada rekaman. |
| D03 | E27 | Representasi Spasial (Topologi & Geometri) | 0 | 0 | Tidak ada spatialRepresentationInfo. |
| D03 | E28 | Lingkup Metadata (Metadata Scope) | 0.5 | 0 | hierarchyLevel berkode "dataset"; tidak ada hierarchyLevelName. |
| D03 | E29 | Katalog Simbol (Portrayal Catalogue) | 0 | 0 | Tidak ada portrayalCatalogueInfo. |
| D03 | E30 | Skema Aplikasi (Application Schema) | 0 | 0 | Tidak ada applicationSchemaInfo. |
| D03 | E31 | Kepatuhan KUGI | 0 | 0 | Tidak ada contentInfo. |
| D03 | E32 | Metadata Layanan (Service) | 0.5 | 0 | Tautan OGC:WMS dan OGC:WFS (geoportal.riau.go.id/wms-proxy dan wfs-proxy) dengan deskripsi hanya "OGC WMS Service" dan "OGC WFS Service" (label jenis layanan). Dikodekan 0,5 menurut tafsir seragam E32 (Checklist kolom Q), diputuskan 31 Okt 2026. |
| D04 | E01 | Bahasa metadata (dan bahasa data bila ada) | 0.5 | 0 | Bahasa metadata dan data 'eng', isi berbahasa Indonesia |
| D04 | E02 | Nama dan versi standar metadata | 0.5 | 0 | Standar isi dinyatakan di rekaman: ISO 19115:2003 (standar lama; belum menyebut SNI 8843-1:2019, ISO 19115-1 atau ISO 19115-3). Sumber: Sampel\_v2 kolom G. |
| D04 | E11 | Lisensi atau batasan penggunaan | 0 | 0 | 'Not Specified: The original author did not specify a license.' dan 'None' (teks bawaan GeoNode) |
| D04 | E14 | Cakupan temporal | 0 | 0 | Tidak ditemukan pada rekaman. |
| D04 | E15 | Sistem referensi koordinat | 0.5 | 0 | CRS metadata EPSG:4326, tetapi URL layanan memakai EPSG:32749 (perlu dicek) |
| D04 | E16 | Akurasi posisi | 0 | 0 | Tidak ditemukan pada rekaman. |
| D04 | E17 | Akurasi tematik atau laporan kualitas lain | 0 | 0 | Tidak ditemukan pada rekaman. |
| D04 | E18 | Skala atau resolusi | 0 | 0 | Tidak ditemukan pada rekaman. |
| D04 | E19 | Organisasi penanggung jawab | 0 | 0 | Nama organisasi, individu, dan jabatan: nilReason=missing |
| D04 | E20 | Sarana kontak valid | 0 | 0 | Email, telepon, faks, alamat: nilReason=missing |
| D04 | E23 | Frekuensi pembaruan | 0.5 | 0 | Frekuensi pembaruan 'unknown' |
| D04 | E24 | Pernyataan lineage | 0.5 | 0 | Satu kalimat merujuk Perda Kalteng 1/2019 (RZWP3K); tanpa sumber data, metode, waktu; kalimat tampak terpotong ('juga') |
| D04 | E25 | Sumber data | 0 | 0 | Hanya rujukan peraturan; sumber data tidak disebut |
| D04 | E26 | Langkah atau metode pemrosesan | 0 | 0 | Tidak ditemukan pada rekaman. |
| D04 | E27 | Representasi Spasial (Topologi & Geometri) | 0 | 0 | Elemen spatialRepresentationInfo ada tetapi kosong (tidak berisi MD\_VectorSpatialRepresentation). |
| D04 | E28 | Lingkup Metadata (Metadata Scope) | 0.5 | 0 | hierarchyLevel berkode "dataset"; tidak ada hierarchyLevelName. |
| D04 | E29 | Katalog Simbol (Portrayal Catalogue) | 0 | 0 | Tidak ada portrayalCatalogueInfo. |
| D04 | E30 | Skema Aplikasi (Application Schema) | 0 | 0 | Tidak ada applicationSchemaInfo. |
| D04 | E31 | Kepatuhan KUGI | 0 | 0 | contentInfo memuat MD\_FeatureCatalogueDescription dengan includedWithDataset false dan tautan xlink ke katalog fitur GeoNode; tanpa complianceCode dan tanpa sitasi KUGI. |
| D04 | E32 | Metadata Layanan (Service) | 1 | 0 | Tautan OGC:WMS dan OGC:WFS pada geoportal.kotimkab.go.id/geoserver/ows dengan deskripsi "geonode Service - Provides Layer: ...". Tidak ada srv:SV\_ServiceIdentification; nilai 1 mengikuti teks aturan E32 dan tumpang tindih dengan E03. |
| D05 | E02 | Nama dan versi standar metadata | 0.5 | 0 | Standar isi dinyatakan di rekaman: ISO 19115:2003 (standar lama; belum menyebut SNI 8843-1:2019, ISO 19115-1 atau ISO 19115-3). Sumber: Sampel\_v2 kolom G. |
| D05 | E04 | Judul informatif | 1 | 0 | Judul baik; nama layer pada alternateTitle salah ketik: geonode:jalur\_penagkapan\_ikant |
| D05 | E08 | Tujuan (purpose) | 0 | 0 | Tujuan nilReason=missing |
| D05 | E11 | Lisensi atau batasan penggunaan | 1 | 0 | Teks lisensi bawaan GeoNode 'Public Domain (PD)' dengan rujukan situs copyright.gov (AS), ditambah 'Tidak ada batasan dalam penggunaan data' |
| D05 | E14 | Cakupan temporal | 0 | 0 | Tidak ditemukan pada rekaman. |
| D05 | E16 | Akurasi posisi | 0 | 0 | Tidak ditemukan pada rekaman. |
| D05 | E17 | Akurasi tematik atau laporan kualitas lain | 0 | 0 | Tidak ditemukan pada rekaman. |
| D05 | E18 | Skala atau resolusi | 0 | 0 | Tidak ditemukan pada rekaman. |
| D05 | E20 | Sarana kontak valid | 0.5 | 0 | Email gmail; telepon ada; individu nilReason=missing |
| D05 | E23 | Frekuensi pembaruan | 0 | 0 | Tidak ada |
| D05 | E24 | Pernyataan lineage | 0.5 | 0 | 'Diperoleh dari survei dan pengolahan DKP Aceh': tanpa metode rinci atau waktu |
| D05 | E25 | Sumber data | 0.5 | 0 | Sumber disebut generik ('survei') |
| D05 | E26 | Langkah atau metode pemrosesan | 0 | 0 | Metode tidak dijelaskan ('pengolahan' saja) |
| D05 | E27 | Representasi Spasial (Topologi & Geometri) | 0 | 0 | Elemen spatialRepresentationInfo ada tetapi kosong (tidak berisi MD\_VectorSpatialRepresentation). |
| D05 | E28 | Lingkup Metadata (Metadata Scope) | 0.5 | 0 | hierarchyLevel berkode "dataset"; tidak ada hierarchyLevelName. |
| D05 | E29 | Katalog Simbol (Portrayal Catalogue) | 0 | 0 | Tidak ada portrayalCatalogueInfo. |
| D05 | E30 | Skema Aplikasi (Application Schema) | 0 | 0 | Tidak ada applicationSchemaInfo. |
| D05 | E31 | Kepatuhan KUGI | 0 | 0 | contentInfo memuat MD\_FeatureCatalogueDescription dengan includedWithDataset false dan tautan xlink ke katalog fitur GeoNode; tanpa complianceCode dan tanpa sitasi KUGI. |
| D05 | E32 | Metadata Layanan (Service) | 1 | 0 | Tautan OGC:WMS dan OGC:WFS pada sig.acehprov.go.id/geoserver/ows dengan deskripsi "geonode Service - Provides Layer: ...". Tidak ada srv:SV\_ServiceIdentification; nilai 1 mengikuti teks aturan E32 dan tumpang tindih dengan E03. |
| D07 | E01 | Bahasa metadata (dan bahasa data bila ada) | 0.5 | 0 | Bahasa metadata 'eng'; bahasa data 'Indonesia' (teks bebas, bukan kode ISO) |
| D07 | E02 | Nama dan versi standar metadata | 1 | 0 | Standar isi dinyatakan di rekaman: SNI 8843-1:2019 (Sampel\_v2 kolom G); pengodean XML tetap ISO 19139. Dikodekan 1 menurut aturan E02. |
| D07 | E03 | Tautan akses data atau layanan | 0 | 0 | Satu-satunya tautan adalah jalur berkas lokal (drive C:, folder pengguna); dataSetURI berisi instruksi; distributor berisi teks templat |
| D07 | E06 | Identifier unik | 0.5 | 0 | Identifier 'METADATA HBLD\_AR50K' (berspasi, nama berkas) |
| D07 | E07 | Abstrak | 1 | 0 | Abstrak informatif tetapi memuat kalimat rusak ('ditambah dengan proses, metode, distribusi oleh ...') |
| D07 | E08 | Tujuan (purpose) | 1 | 0 | Tujuan informatif tetapi memuat fragmen teks Inggris yang tercampur dan terpotong |
| D07 | E09 | Kata kunci | 0.5 | 0 | Tiga kata kunci digabung dalam satu elemen (dipisah koma) |
| D07 | E11 | Lisensi atau batasan penggunaan | 0.5 | 1 | Teks definisi ISO tidak dihapus ('Restrictions on the access and use of a resource or metadata'); tidak ada lisensi |
| D07 | E12 | Deskripsi atribut atau katalog fitur | 0.5 | 0 | Rujukan katalog fitur tanpa judul dan tanggal; catatan 'dalam proses pemutakhiran' |
| D07 | E13 | Bounding box | 0 | 0 | Bounding box 0,0,0,0 |
| D07 | E14 | Cakupan temporal | 0.5 | 0 | Rentang 2009-01-01 s.d. 2009-01-02, tidak konsisten dengan judul (2025); tampak nilai bawaan |
| D07 | E16 | Akurasi posisi | 0 | 0 | Tidak ditemukan pada rekaman. |
| D07 | E17 | Akurasi tematik atau laporan kualitas lain | 0.5 | 1 | Laporan DQ\_CompletenessOmission bernilai 100 dengan definisi unit 'temporal consistency'; tanpa deskripsi pengukuran (tampak templat) |
| D07 | E21 | Peran (role) | 0.5 | 0 | Peran 'Produsen Data' (teks bebas, bukan codelist) pada kontak utama |
| D07 | E23 | Frekuensi pembaruan | 0.5 | 0 | '2 tahun sekali' (teks bebas, bukan codelist) |
| D07 | E24 | Pernyataan lineage | 0.5 | 1 | Teks definisi ISO: 'General explanation of the data producer's knowledge about the lineage of a dataset' |
| D07 | E25 | Sumber data | 0 | 0 | Tidak ditemukan pada rekaman. |
| D07 | E26 | Langkah atau metode pemrosesan | 0 | 0 | Tidak ditemukan pada rekaman. |
| D07 | E27 | Representasi Spasial (Topologi & Geometri) | 0.5 | 0 | topologyLevel geometryOnly dan geometricObjectType surface ada, tetapi geometricObjectCount bernilai 0 (tidak valid untuk dataset berisi fitur). |
| D07 | E28 | Lingkup Metadata (Metadata Scope) | 0.5 | 0 | hierarchyLevel berkode "dataset"; hierarchyLevelName nilReason=missing. |
| D07 | E29 | Katalog Simbol (Portrayal Catalogue) | 0.5 | 0 | Sitasi portrayal berjudul "IG Habitat Bentik Laut Dangkal" (nama dataset) dengan warna kelas (RGB) di otherCitationDetails; tidak mengutip dokumen aturan simbol. |
| D07 | E30 | Skema Aplikasi (Application Schema) | 0 | 0 | Tidak ada applicationSchemaInfo. |
| D07 | E31 | Kepatuhan KUGI | 0 | 0 | MD\_FeatureCatalogueDescription ada tetapi judul sitasi nilReason=missing, includedWithDataset unknown, dan catatan "dalam proses pemutakhiran QG"; tanpa complianceCode dan tanpa KUGI. |
| D07 | E32 | Metadata Layanan (Service) | 0 | 0 | Tautan hanya ke http://www.kkp.go.id dan jalur lokal C:\Users\...; tanpa tautan layanan. |
| D08 | E01 | Bahasa metadata (dan bahasa data bila ada) | 0.5 | 0 | Bahasa bawaan ArcGIS eng/USA |
| D08 | E02 | Nama dan versi standar metadata | 0 | 0 | Tidak menyatakan standar metadata (format ESRI) |
| D08 | E03 | Tautan akses data atau layanan | 0 | 0 | Hanya jalur jaringan lokal dengan nama host perangkat |
| D08 | E04 | Judul informatif | 0.5 | 0 | Judul MANGROVE2024\_25K\_032 (nama berkas); riwayat geoproses mencatat penggantian nama menjadi \_040 |
| D08 | E05 | Tanggal sitasi dan jenis tanggal | 0.5 | 0 | Hanya tanggal sistem ArcGIS (20250203); tidak ada tanggal sitasi |
| D08 | E06 | Identifier unik | 0 | 0 | Tidak ada identifier |
| D08 | E07 | Abstrak | 0 | 0 | Tidak ada abstrak |
| D08 | E08 | Tujuan (purpose) | 0 | 0 | Tidak ditemukan pada rekaman. |
| D08 | E09 | Kata kunci | 0 | 0 | Tidak ditemukan pada rekaman. |
| D08 | E10 | Kategori topik ISO | 0 | 0 | Tidak ditemukan pada rekaman. |
| D08 | E11 | Lisensi atau batasan penggunaan | 0 | 0 | Tidak ditemukan pada rekaman. |
| D08 | E12 | Deskripsi atribut atau katalog fitur | 0.5 | 0 | 13 atribut terdaftar tetapi tanpa definisi (kode singkat BPDAS, KTTJ, SMBDT, dst.) |
| D08 | E13 | Bounding box | 0 | 0 | Tidak ada bounding box |
| D08 | E14 | Cakupan temporal | 0 | 0 | Tidak ditemukan pada rekaman. |
| D08 | E16 | Akurasi posisi | 0 | 0 | Tidak ditemukan pada rekaman. |
| D08 | E17 | Akurasi tematik atau laporan kualitas lain | 0 | 0 | Tidak ditemukan pada rekaman. |
| D08 | E18 | Skala atau resolusi | 0.5 | 0 | 25K hanya pada nama berkas |
| D08 | E19 | Organisasi penanggung jawab | 0 | 0 | Tidak ada blok kontak |
| D08 | E20 | Sarana kontak valid | 0 | 0 | Tidak ditemukan pada rekaman. |
| D08 | E21 | Peran (role) | 0 | 0 | Tidak ditemukan pada rekaman. |
| D08 | E23 | Frekuensi pembaruan | 0 | 0 | Tidak ditemukan pada rekaman. |
| D08 | E24 | Pernyataan lineage | 0.5 | 0 | Riwayat geoproses otomatis ArcGIS (ExportFeatures, Rename; 2025-02-03), tanpa uraian sumber atau metode |
| D08 | E25 | Sumber data | 0.5 | 0 | Hanya nama kelas fitur masukan (MANGROVE\_AR\_25K\_2024) |
| D08 | E26 | Langkah atau metode pemrosesan | 0.5 | 0 | Operasi tercatat otomatis (ExportFeatures, Rename) |
| D08 | E27 | Representasi Spasial (Topologi & Geometri) | 0.5 | 0 | VectSpatRep: topLvl 001 dan geoObjTyp 002 ada, tetapi geoObjCnt 0 (nilai bawaan ArcGIS yang tidak valid). |
| D08 | E28 | Lingkup Metadata (Metadata Scope) | 0.5 | 0 | mdHrLv ScopeCd 005 (dataset) dan mdHrLvName "dataset" (mengulang kode, bukan nama dataset). |
| D08 | E29 | Katalog Simbol (Portrayal Catalogue) | 0 | 0 | Tidak ada padanan portrayalCatalogueInfo pada ESRI XML. |
| D08 | E30 | Skema Aplikasi (Application Schema) | 0 | 0 | Tidak ada padanan applicationSchemaInfo pada ESRI XML. |
| D08 | E31 | Kepatuhan KUGI | 0 | 0 | Tidak ada padanan katalog fitur pada ESRI XML. |
| D08 | E32 | Metadata Layanan (Service) | 0 | 0 | Tidak ada tautan layanan; satu-satunya linkage berupa jalur lokal file://ROG-ZEPHYRUS/D$/DATA ILH/.... |
| D09 | E02 | Nama dan versi standar metadata | 0.5 | 0 | Nama standar 'ISO 19139 ... Implementation Specification' (spesifikasi implementasi XML) |
| D09 | E03 | Tautan akses data atau layanan | 0 | 0 | MD\_DigitalTransferOptions kosong; tidak ada tautan |
| D09 | E05 | Tanggal sitasi dan jenis tanggal | 0 | 0 | Tanggal sitasi nilReason=missing |
| D09 | E11 | Lisensi atau batasan penggunaan | 0.5 | 0 | Ada batasan penggunaan teknis (tidak untuk skala lebih detail) tetapi tidak ada lisensi atau status keterbukaan |
| D09 | E16 | Akurasi posisi | 0 | 0 | Akurasi posisi tidak dinyatakan |
| D09 | E17 | Akurasi tematik atau laporan kualitas lain | 0.5 | 0 | OA 'tidak kurang dari 60%' berupa ambang; nilai '60%' tanpa satuan; spesifikasi nilReason=missing; 'dalam proses uji akurasi' |
| D09 | E22 | Tanggal metadata | 0.5 | 0 | dateStamp 2015-12-01, tetapi merujuk katalog fitur KUGI 5.1 bertanggal 2022-09-20 |
| D09 | E23 | Frekuensi pembaruan | 0.5 | 0 | Frekuensi nilReason=missing; 'Setiap 2 tahun' hanya pada elemen buatan pengguna |
| D09 | E27 | Representasi Spasial (Topologi & Geometri) | 1 | 0 | topologyLevel geometryOnly, geometricObjectType surface, geometricObjectCount 69. |
| D09 | E28 | Lingkup Metadata (Metadata Scope) | 0.5 | 0 | hierarchyLevel berkode "dataset" dan hierarchyLevelName "dataset" (mengulang kode, bukan nama dataset). |
| D09 | E29 | Katalog Simbol (Portrayal Catalogue) | 1 | 0 | Sitasi portrayal "RSNI 3 Pemetaan Habitat Perairan Laut Dangkal" (rancangan SNI); tanggal nilReason=missing. |
| D09 | E30 | Skema Aplikasi (Application Schema) | 0 | 0 | Tidak ada applicationSchemaInfo. |
| D09 | E31 | Kepatuhan KUGI | 1 | 0 | complianceCode true, includedWithDataset true, featureTypes "Terumbu karang (Area)", sitasi "Katalog Unsur Geografi Indonesia" (KUGI, 2022-09-20). |
| D09 | E32 | Metadata Layanan (Service) | 0 | 0 | Tidak ada tautan online pada rekaman. |
| D10 | E01 | Bahasa metadata (dan bahasa data bila ada) | 0.5 | 0 | Bahasa metadata 'ind', bahasa data 'eng' (isi berbahasa Indonesia) |
| D10 | E02 | Nama dan versi standar metadata | 0.5 | 0 | Nama standar 'ISO 19139 ... Implementation Specification' (spesifikasi implementasi XML) |
| D10 | E04 | Judul informatif | 0.5 | 0 | Judul tanpa spasi: POTENSISUMBERDAYAARKEOLOGIMARITIM |
| D10 | E06 | Identifier unik | 0.5 | 0 | Identifier berupa teks bebas: 'IGT Potensi Sumberdaya Arkeologi Maritim' |
| D10 | E11 | Lisensi atau batasan penggunaan | 0.5 | 1 | Batasan hukum berisi teks definisi ISO; tidak ada lisensi |
| D10 | E13 | Bounding box | 1 | 0 | Bounding box valid; blok extent muncul dua kali dengan isi identik |
| D10 | E14 | Cakupan temporal | 0 | 0 | Tidak ditemukan pada rekaman. |
| D10 | E15 | Sistem referensi koordinat | 0.5 | 1 | Kode CRS berisi teks 'Alphanumeric value identifying an instance in the namespace' |
| D10 | E16 | Akurasi posisi | 0 | 0 | Tidak ditemukan pada rekaman. |
| D10 | E17 | Akurasi tematik atau laporan kualitas lain | 0.5 | 1 | Laporan DQ\_TemporalConsistency bernilai 100 tanpa satuan dan tanpa deskripsi; scope DQ nilReason=missing |
| D10 | E21 | Peran (role) | 1 | 0 | Satu pointOfContact menautkan codelist MD\_ScopeCode untuk elemen peran (rujukan codelist keliru) |
| D10 | E24 | Pernyataan lineage | 0.5 | 1 | Teks definisi ISO: 'General explanation of the data producer's knowledge about the lineage of a dataset' |
| D10 | E25 | Sumber data | 0 | 0 | Tidak ditemukan pada rekaman. |
| D10 | E26 | Langkah atau metode pemrosesan | 0 | 0 | Tidak ditemukan pada rekaman. |
| D10 | E27 | Representasi Spasial (Topologi & Geometri) | 1 | 0 | topologyLevel geometryOnly, geometricObjectType point, geometricObjectCount 74. |
| D10 | E28 | Lingkup Metadata (Metadata Scope) | 0.5 | 0 | hierarchyLevel berkode "dataset" dan hierarchyLevelName "dataset" (mengulang kode, bukan nama dataset). |
| D10 | E29 | Katalog Simbol (Portrayal Catalogue) | 0 | 0 | Tidak ada portrayalCatalogueInfo. |
| D10 | E30 | Skema Aplikasi (Application Schema) | 0 | 0 | Tidak ada applicationSchemaInfo. |
| D10 | E31 | Kepatuhan KUGI | 1 | 0 | complianceCode true, includedWithDataset false, sitasi "KATALOG UNSUR GEOGRAFI INDONESIA" (KUGI, 2019-01-01). |
| D10 | E32 | Metadata Layanan (Service) | 0.5 | 0 | Satu tautan ESRI:ARCGIS:FEATURESERVER (satupeta.kkp.go.id) dengan nama "Satu Peta KKP" dan deskripsi "Portal Satu Peta KKP" (nama portal, bukan deskripsi layanan). Dikodekan 0,5 menurut tafsir seragam E32, diputuskan 31 Okt 2026. |
| D11 | E02 | Nama dan versi standar metadata | 0.5 | 0 | Nama standar 'ISO 19139 ... Implementation Specification' (spesifikasi implementasi XML) |
| D11 | E03 | Tautan akses data atau layanan | 0 | 0 | Tidak ada onLine; hanya 'unitsOfDistribution: Gigabytes (GB)', padahal kata kunci 'Downloadable Data' |
| D11 | E04 | Judul informatif | 0.5 | 0 | Judul berupa kode: IGT\_NERACA\_HPBLD\_KKPN\_KEP\_RAJA\_AMPAT\_AR50K |
| D11 | E11 | Lisensi atau batasan penggunaan | 0 | 0 | Tidak ada resourceConstraints (lisensi atau batasan) |
| D11 | E12 | Deskripsi atribut atau katalog fitur | 0 | 0 | Tidak ada contentInfo |
| D11 | E13 | Bounding box | 0.5 | 0 | Empat ekstensi; tiga di antaranya (sekitar 100 sampai 116 BT) berada jauh dari Raja Ampat (sekitar 130 BT); verifikasi di GIS |
| D11 | E14 | Cakupan temporal | 0.5 | 0 | Tidak ada temporalElement; tahun aktiva/pasiva (2014/2015, 2020/2021) hanya di teks lineage |
| D11 | E16 | Akurasi posisi | 0.5 | 0 | Laporan AbsoluteExternalPositionalAccuracy: georegistrasi ke garis pantai RBI, tanpa nilai ketelitian |
| D11 | E17 | Akurasi tematik atau laporan kualitas lain | 0.5 | 0 | 11 laporan DQ; semua hasil konformitas punya specification nilReason=missing; TemporalValidity pass=true tetapi penjelasan '> 2 tahun' |
| D11 | E20 | Sarana kontak valid | 0.5 | 0 | Email berdomain @kkp.co.id (bukan kkp.go.id) pada semua kontak; telepon ada; kode pos '4130' |
| D11 | E27 | Representasi Spasial (Topologi & Geometri) | 1 | 0 | topologyLevel geometryOnly, geometricObjectType composite, geometricObjectCount 977233. |
| D11 | E28 | Lingkup Metadata (Metadata Scope) | 0.5 | 0 | hierarchyLevel berkode "featureType" sedangkan hierarchyLevelName "dataset" (tidak sama dengan kode). |
| D11 | E29 | Katalog Simbol (Portrayal Catalogue) | 0 | 0 | Tidak ada portrayalCatalogueInfo. |
| D11 | E30 | Skema Aplikasi (Application Schema) | 0 | 0 | Tidak ada applicationSchemaInfo. |
| D11 | E31 | Kepatuhan KUGI | 0 | 0 | Tidak ada contentInfo. |
| D11 | E32 | Metadata Layanan (Service) | 0 | 0 | Tidak ada tautan online pada rekaman. |
| D12 | E01 | Bahasa metadata (dan bahasa data bila ada) | 0.5 | 0 | Bahasa metadata 'eng'; bahasa data 'Indonesia' (teks bebas) |
| D12 | E02 | Nama dan versi standar metadata | 0.5 | 0 | Standar isi dinyatakan di rekaman: ISO 19115 (ISO19115:2003/Cor 1 2006) (standar lama; belum menyebut SNI 8843-1:2019, ISO 19115-1 atau ISO 19115-3). Sumber: Sampel\_v2 kolom G. |
| D12 | E03 | Tautan akses data atau layanan | 0.5 | 0 | Hanya WMS dengan nama layer; tidak ada unduhan |
| D12 | E04 | Judul informatif | 0.5 | 0 | Judul berupa nama berkas: Ambon\_100m |
| D12 | E06 | Identifier unik | 0.5 | 0 | Identifier 'Ambon\_100m' (nama berkas) |
| D12 | E07 | Abstrak | 0.5 | 0 | Abstrak generik ('data spasial ... akuisisi data batimetri'); tidak menyebut Ambon atau metode |
| D12 | E08 | Tujuan (purpose) | 0.5 | 0 | 'Diperuntukan hanya untuk Aplikasi Web SIBATNAS': peruntukan terbatas, bukan tujuan data |
| D12 | E10 | Kategori topik ISO | 0 | 0 | topicCategory nilReason=missing |
| D12 | E11 | Lisensi atau batasan penggunaan | 0 | 0 | Tidak ada resourceConstraints |
| D12 | E12 | Deskripsi atribut atau katalog fitur | 0 | 0 | Tidak ditemukan pada rekaman. |
| D12 | E13 | Bounding box | 0.5 | 0 | Bounding box seluruh Indonesia (94,77 sampai 141,00 BT) untuk data Ambon |
| D12 | E14 | Cakupan temporal | 0 | 0 | temporalElement nilReason=missing |
| D12 | E16 | Akurasi posisi | 0 | 0 | Tidak ada blok dataQualityInfo; tidak ada datum vertikal (verticalElement missing) |
| D12 | E17 | Akurasi tematik atau laporan kualitas lain | 0 | 0 | Tidak ditemukan pada rekaman. |
| D12 | E18 | Skala atau resolusi | 0.5 | 0 | Skala 1:250000 pada elemen, sedangkan judul menyebut 100m (tidak konsisten) |
| D12 | E21 | Peran (role) | 0.5 | 0 | Peran 'Walidata' dan 'Produsen Data' (teks bebas, bukan codelist) |
| D12 | E24 | Pernyataan lineage | 0 | 0 | Tidak ada dataQualityInfo atau lineage |
| D12 | E25 | Sumber data | 0 | 0 | Tidak ditemukan pada rekaman. |
| D12 | E26 | Langkah atau metode pemrosesan | 0 | 0 | Tidak ditemukan pada rekaman. |
| D12 | E27 | Representasi Spasial (Topologi & Geometri) | 0.5 | 0 | Hanya topologyLevel geometryOnly; tidak ada geometricObjects. |
| D12 | E28 | Lingkup Metadata (Metadata Scope) | 0.5 | 0 | hierarchyLevel berkode "dataset" dan hierarchyLevelName "dataset" (mengulang kode, bukan nama dataset). |
| D12 | E29 | Katalog Simbol (Portrayal Catalogue) | 0 | 0 | Tidak ada portrayalCatalogueInfo. |
| D12 | E30 | Skema Aplikasi (Application Schema) | 0 | 0 | Tidak ada applicationSchemaInfo. |
| D12 | E31 | Kepatuhan KUGI | 0 | 0 | Tidak ada contentInfo. |
| D12 | E32 | Metadata Layanan (Service) | 0.5 | 0 | Satu tautan OGC:WMS (sibatnas.big.go.id/geoserver/wms) dengan nama layer tetapi tanpa deskripsi. |
| D13 | E01 | Bahasa metadata (dan bahasa data bila ada) | 0.5 | 0 | metadata-language 'Bahasa Indonesia' (bukan kode ISO) |
| D13 | E02 | Nama dan versi standar metadata | 0 | 0 | Rekaman CKAN tidak memuat nama standar |
| D13 | E03 | Tautan akses data atau layanan | 0.5 | 0 | Enam sumber daya: satu layanan MapServer, empat tautan ke halaman kontak BIG, satu portal layanan data; tidak ada unduhan data |
| D13 | E04 | Judul informatif | 0.5 | 0 | Judul berupa kode: INDEKS\_LPI\_25K |
| D13 | E07 | Abstrak | 0.5 | 0 | Deskripsi menyebut jenis peta dan produsen, tidak menjelaskan cakupan isi |
| D13 | E08 | Tujuan (purpose) | 0 | 0 | CKAN tidak memiliki bidang tujuan |
| D13 | E10 | Kategori topik ISO | 0 | 0 | Tidak ditemukan pada rekaman. |
| D13 | E11 | Lisensi atau batasan penggunaan | 1 | 0 | Lisensi 'Bersifat terbuka' dengan batasan skala 1:25.000 |
| D13 | E12 | Deskripsi atribut atau katalog fitur | 0 | 0 | Tidak ditemukan pada rekaman. |
| D13 | E14 | Cakupan temporal | 0 | 0 | Tidak ditemukan pada rekaman. |
| D13 | E16 | Akurasi posisi | 0 | 0 | Tidak ditemukan pada rekaman. |
| D13 | E17 | Akurasi tematik atau laporan kualitas lain | 0 | 0 | Tidak ditemukan pada rekaman. |
| D13 | E18 | Skala atau resolusi | 0.5 | 0 | Skala 1:25.000 hanya pada judul atau deskripsi |
| D13 | E21 | Peran (role) | 0.5 | 0 | Peran 'produsen data' (teks bebas) pada responsible-party |
| D13 | E24 | Pernyataan lineage | 0 | 0 | lineage kosong |
| D13 | E25 | Sumber data | 0 | 0 | Tidak ditemukan pada rekaman. |
| D13 | E26 | Langkah atau metode pemrosesan | 0 | 0 | Tidak ditemukan pada rekaman. |
| D13 | E27 | Representasi Spasial (Topologi & Geometri) | 0 | 0 | JSON CKAN tidak memuat struktur representasi spasial; hanya extras "spatial" berupa poligon bounding box. |
| D13 | E28 | Lingkup Metadata (Metadata Scope) | 0.5 | 0 | Extras resource-type "featureType" (padanan hierarchyLevel); tanpa nama. |
| D13 | E29 | Katalog Simbol (Portrayal Catalogue) | 0 | 0 | Tidak ada padanan portrayalCatalogueInfo di JSON CKAN. |
| D13 | E30 | Skema Aplikasi (Application Schema) | 0 | 0 | Tidak ada padanan applicationSchemaInfo di JSON CKAN. |
| D13 | E31 | Kepatuhan KUGI | 0 | 0 | Tidak ada padanan katalog fitur di JSON CKAN. |
| D13 | E32 | Metadata Layanan (Service) | 1 | 0 | Resource ESRI:ArcGIS:MapServer (geoservices.big.go.id) dengan deskripsi "Web Map Sevice Indeks Lingkungan Pantai Indonesia Skala 1:25000". |
| D14 | E02 | Nama dan versi standar metadata | 0 | 0 | Rekaman CKAN tidak memuat nama standar |
| D14 | E04 | Judul informatif | 0.5 | 0 | Judul 'Kawasan\_Konservasi' tanpa lokasi (Kalbar hanya pada deskripsi) |
| D14 | E05 | Tanggal sitasi dan jenis tanggal | 1 | 0 | Tiga tanggal berbeda: referensi 2007-09-01, metadata 2020-02-06, rekaman portal dibuat 2022-10-09 |
| D14 | E07 | Abstrak | 0.5 | 0 | Deskripsi mengulang judul |
| D14 | E08 | Tujuan (purpose) | 0 | 0 | Tidak ditemukan pada rekaman. |
| D14 | E09 | Kata kunci | 0.5 | 0 | Satu tag generik: 'Dataset Khusus' |
| D14 | E10 | Kategori topik ISO | 0 | 0 | Tidak ditemukan pada rekaman. |
| D14 | E11 | Lisensi atau batasan penggunaan | 0 | 0 | licence '[]' (kosong) |
| D14 | E12 | Deskripsi atribut atau katalog fitur | 0 | 0 | Tidak ditemukan pada rekaman. |
| D14 | E14 | Cakupan temporal | 0 | 0 | Tidak ditemukan pada rekaman. |
| D14 | E16 | Akurasi posisi | 0 | 0 | Tidak ditemukan pada rekaman. |
| D14 | E17 | Akurasi tematik atau laporan kualitas lain | 0 | 0 | Tidak ditemukan pada rekaman. |
| D14 | E18 | Skala atau resolusi | 0 | 0 | Tidak ditemukan pada rekaman. |
| D14 | E19 | Organisasi penanggung jawab | 0.5 | 0 | Pihak bertanggung jawab 'JaringanKalbar' (nama jaringan, bukan organisasi) |
| D14 | E20 | Sarana kontak valid | 0 | 0 | contact-email 'Belum Ada' |
| D14 | E24 | Pernyataan lineage | 0 | 0 | lineage kosong |
| D14 | E25 | Sumber data | 0 | 0 | Tidak ditemukan pada rekaman. |
| D14 | E26 | Langkah atau metode pemrosesan | 0 | 0 | Tidak ditemukan pada rekaman. |
| D14 | E27 | Representasi Spasial (Topologi & Geometri) | 0 | 0 | JSON CKAN tidak memuat struktur representasi spasial; hanya extras "spatial" berupa poligon bounding box. |
| D14 | E28 | Lingkup Metadata (Metadata Scope) | 0.5 | 0 | Extras resource-type "dataset" (padanan hierarchyLevel); tanpa nama. |
| D14 | E29 | Katalog Simbol (Portrayal Catalogue) | 0 | 0 | Tidak ada padanan portrayalCatalogueInfo di JSON CKAN. |
| D14 | E30 | Skema Aplikasi (Application Schema) | 0 | 0 | Tidak ada padanan applicationSchemaInfo di JSON CKAN. |
| D14 | E31 | Kepatuhan KUGI | 0 | 0 | Tidak ada padanan katalog fitur di JSON CKAN. |
| D14 | E32 | Metadata Layanan (Service) | 0.5 | 0 | Resource OGC:WFS (deskripsi "RAW") dan OGC:WMS (deskripsi "ImageWMS"); deskripsi hanya label teknis yang tidak menerangkan layanan. |
| D16 | E02 | Nama dan versi standar metadata | 1 | 0 | metadataStandard berisi "ISO 19115-3:2018" (edisi 2018). Dikodekan 1 menurut aturan E02. Catatan: tahun 2018 tidak cocok dengan edisi ISO 19115-3 yang saya ketahui (2016 dan 2023), dan SNI 8843-1:2019 tidak disebut. |
| D16 | E03 | Tautan akses data atau layanan | 0.5 | 0 | Dua tautan: OGC:WMS dan OGC:WCS pada gistaru.bantenprov.go.id:8866, fungsi "information". WCS untuk data vektor tidak lazim; tidak ada tautan unduh atau WFS. Format distribusi "PNG" berversi "2023-2043". |
| D16 | E04 | Judul informatif | 0.5 | 0 | Judul "Garis Pantai" tanpa lokasi; nama provinsi hanya ada di abstrak. |
| D16 | E05 | Tanggal sitasi dan jenis tanggal | 1 | 0 | Tiga tanggal bertipe creation, publication, dan revision, semuanya 2026-07-13. |
| D16 | E07 | Abstrak | 0.5 | 1 | Abstrak "Garis Pantai Provinsi Banten" hanya mengulang judul dengan nama provinsi. |
| D16 | E08 | Tujuan (purpose) | 0 | 0 | Tidak ada elemen purpose. |
| D16 | E09 | Kata kunci | 0.5 | 1 | Dua kata kunci: "features" (tampak bawaan generator) dan "Garis\_Pantai"; tanpa kata kunci lokasi. |
| D16 | E11 | Lisensi atau batasan penggunaan | 0.5 | 1 | Hanya useLimitation "public" pada MD\_LegalConstraints; tanpa lisensi, tanpa kode accessConstraints atau useConstraints. |
| D16 | E12 | Deskripsi atribut atau katalog fitur | 0 | 0 | Tidak ada contentInfo. |
| D16 | E14 | Cakupan temporal | 0 | 0 | Tidak ada temporalElement pada extent. |
| D16 | E15 | Sistem referensi koordinat | 0.5 | 0 | Kode "84" dengan codeSpace "CRS" (setara OGC CRS84, WGS84). Bukan kode EPSG dan tidak menyebut SRGI. |
| D16 | E16 | Akurasi posisi | 0 | 0 | Tidak ada laporan akurasi posisi. |
| D16 | E17 | Akurasi tematik atau laporan kualitas lain | 0.5 | 0 | Satu DQ\_ConformanceResult langsung di bawah report (tanpa elemen kualitas), berisi tautan ke halaman status QC/QE/QA dan pass=true; tanpa ukuran atau hasil terukur. Struktur tidak lazim dan perlu divalidasi terhadap XSD. |
| D16 | E18 | Skala atau resolusi | 0 | 0 | Tidak ada spatialResolution. |
| D16 | E19 | Organisasi penanggung jawab | 1 | 0 | Kontak pertama (originator) berisi data contoh standar: "The Ancient Geographers", "Claudius Ptolomaeus", email gmail. Kontak custodian "Pemerintah Provinsi Banten" spesifik, sehingga nilai 1. Penanda F06. |
| D16 | E20 | Sarana kontak valid | 1 | 0 | Email metadata@bantenprov.go.id (domain resmi) pada kontak custodian. Email distributor memakai gmail contoh yang sama dengan kontak originator. |
| D16 | E24 | Pernyataan lineage | 0 | 0 | Tidak ada resourceLineage. |
| D16 | E25 | Sumber data | 0 | 0 | Tidak ada resourceLineage. |
| D16 | E26 | Langkah atau metode pemrosesan | 0 | 0 | Tidak ada resourceLineage. |
| D16 | E27 | Representasi Spasial (Topologi & Geometri) | 0 | 0 | Tidak ada spatialRepresentationInfo; hanya spatialRepresentationType "vector" pada identificationInfo, tanpa topologi dan geometri. |
| D16 | E28 | Lingkup Metadata (Metadata Scope) | 0.5 | 0 | metadataScope berisi resourceScope "dataset" tanpa name. |
| D16 | E29 | Katalog Simbol (Portrayal Catalogue) | 0 | 0 | Tidak ada portrayalCatalogueInfo. |
| D16 | E30 | Skema Aplikasi (Application Schema) | 0 | 0 | Tidak ada applicationSchemaInfo. |
| D16 | E31 | Kepatuhan KUGI | 0 | 0 | Tidak ada contentInfo. |
| D16 | E32 | Metadata Layanan (Service) | 0.5 | 0 | Tautan WMS dan WCS dengan nama layer tetapi tanpa deskripsi; tidak ada srv:SV\_ServiceIdentification. Nilai 0,5 mengikuti teks aturan E32 dan tumpang tindih dengan E03. |
| D17 | E02 | Nama dan versi standar metadata | 1 | 0 | metadataStandard berisi "ISO 19115-3:2018" (edisi 2018). Dikodekan 1 menurut aturan E02; lihat catatan pada D16. |
| D17 | E03 | Tautan akses data atau layanan | 0.5 | 0 | Dua tautan: OGC:WMS dan OGC:WCS pada gistaru.bantenprov.go.id:8866 (jalur webgis\_sipr), fungsi "information". Tidak ada tautan unduh atau WFS. Format distribusi "PNG" berversi "2023-2043". |
| D17 | E04 | Judul informatif | 0.5 | 0 | Judul "Batas\_Pengelolaan\_Laut" berbentuk nama berkas dengan garis bawah dan tanpa lokasi. |
| D17 | E05 | Tanggal sitasi dan jenis tanggal | 1 | 0 | Tiga tanggal bertipe creation, publication, dan revision, semuanya 2026-07-13. |
| D17 | E07 | Abstrak | 0.5 | 1 | Abstrak "Batas Pengelolaan Laut Provinsi Banten" hanya mengulang judul dengan nama provinsi. |
| D17 | E08 | Tujuan (purpose) | 0 | 0 | Tidak ada elemen purpose. |
| D17 | E09 | Kata kunci | 0.5 | 1 | Dua kata kunci: "features" (tampak bawaan generator) dan "Batas\_Pengelolaan\_Laut"; tanpa kata kunci lokasi. |
| D17 | E11 | Lisensi atau batasan penggunaan | 0.5 | 1 | Hanya useLimitation "public" pada MD\_LegalConstraints; tanpa lisensi, tanpa kode accessConstraints atau useConstraints. |
| D17 | E12 | Deskripsi atribut atau katalog fitur | 0 | 0 | Tidak ada contentInfo. |
| D17 | E14 | Cakupan temporal | 0 | 0 | Tidak ada temporalElement pada extent. |
| D17 | E15 | Sistem referensi koordinat | 0.5 | 0 | Kode "84" dengan codeSpace "CRS" (setara OGC CRS84, WGS84). Bukan kode EPSG dan tidak menyebut SRGI. |
| D17 | E16 | Akurasi posisi | 0 | 0 | Tidak ada laporan akurasi posisi. |
| D17 | E17 | Akurasi tematik atau laporan kualitas lain | 0.5 | 0 | Satu DQ\_ConformanceResult langsung di bawah report (tanpa elemen kualitas), berisi tautan ke halaman status QC/QE/QA dan pass=true; tanpa ukuran atau hasil terukur. Struktur tidak lazim. |
| D17 | E18 | Skala atau resolusi | 0 | 0 | Tidak ada spatialResolution. |
| D17 | E19 | Organisasi penanggung jawab | 1 | 0 | Kontak originator berisi data contoh standar ("The Ancient Geographers"); kontak custodian "Pemerintah Provinsi Banten" spesifik, sehingga nilai 1. Penanda F06. |
| D17 | E20 | Sarana kontak valid | 1 | 0 | Email metadata@bantenprov.go.id (domain resmi) pada kontak custodian; email distributor memakai gmail contoh. |
| D17 | E24 | Pernyataan lineage | 0 | 0 | Tidak ada resourceLineage. |
| D17 | E25 | Sumber data | 0 | 0 | Tidak ada resourceLineage. |
| D17 | E26 | Langkah atau metode pemrosesan | 0 | 0 | Tidak ada resourceLineage. |
| D17 | E27 | Representasi Spasial (Topologi & Geometri) | 0 | 0 | Tidak ada spatialRepresentationInfo; hanya spatialRepresentationType "vector". |
| D17 | E28 | Lingkup Metadata (Metadata Scope) | 0.5 | 0 | metadataScope berisi resourceScope "dataset" tanpa name. |
| D17 | E29 | Katalog Simbol (Portrayal Catalogue) | 0 | 0 | Tidak ada portrayalCatalogueInfo. |
| D17 | E30 | Skema Aplikasi (Application Schema) | 0 | 0 | Tidak ada applicationSchemaInfo. |
| D17 | E31 | Kepatuhan KUGI | 0 | 0 | Tidak ada contentInfo. |
| D17 | E32 | Metadata Layanan (Service) | 0.5 | 0 | Tautan WMS dan WCS dengan nama layer tetapi tanpa deskripsi; tidak ada srv:SV\_ServiceIdentification. |
| D18 | E02 | Nama dan versi standar metadata | 1 | 0 | metadataStandard "SNI 8843-1:2019 Profil Metadata Spasial Indonesia", edisi 2019. Satu-satunya sampel mdb yang menyebut profil SNI. |
| D18 | E03 | Tautan akses data atau layanan | 0.5 | 0 | Satu tautan OGC:WMS (geoportal.ntbprov.go.id/geoserver/palapa/wms) dan tautan halaman geoportal pada sitasi. Tidak ada tautan unduh atau WFS, padahal kata kunci memuat "Downloadable Data". |
| D18 | E05 | Tanggal sitasi dan jenis tanggal | 1 | 0 | Tanggal bertipe creation dan publication (2025-09-03) serta revision (2025-10-03). |
| D18 | E09 | Kata kunci | 1 | 0 | Lima kata kunci. "Mataram" (kota) dipakai sebagai kata kunci tempat untuk data tingkat provinsi, dan "Downloadable Data" tampak bawaan ArcGIS. Tetap dikodekan 1 karena ada dua atau lebih kata kunci relevan. |
| D18 | E10 | Kategori topik ISO | 1 | 0 | Kategori imageryBaseMapsEarthCover kurang sesuai; oceans sesuai. Dikodekan 1. |
| D18 | E11 | Lisensi atau batasan penggunaan | 0.5 | 1 | useLimitation generik ("pembatasan akses dan penggunaan data. mengacu ke peraturan BIG..."); accessConstraints dan useConstraints bernilai "patent" (tidak sesuai); SecurityConstraints "unclassified" dengan catatan "credential needed"; tidak ada lisensi. |
| D18 | E13 | Bounding box | 0 | 0 | Bounding box tidak valid: west dan south kosong, east = 1, north = 1. Penanda F02. |
| D18 | E14 | Cakupan temporal | 0 | 0 | Tidak ada temporalElement pada extent. |
| D18 | E15 | Sistem referensi koordinat | 0.5 | 0 | EPSG:4326 (WGS84); tidak menyebut SRGI. |
| D18 | E16 | Akurasi posisi | 0.5 | 0 | DQ\_AbsoluteExternalPositionalAccuracy ada, hasil pass=true dengan penjelasan "ketelitian posisi memenuhi spesifikasi" dan metode penilaian directExternal; tanpa nilai angka (CE90 atau RMSE). |
| D18 | E17 | Akurasi tematik atau laporan kualitas lain | 0.5 | 1 | Empat laporan (FormatConsistency, CompletenessCommission, DomainConsistency, AbsoluteExternalPositionalAccuracy) dengan hasil pass/fail tanpa nilai terukur. Teks tampak berasal dari templat RBI: "format data adalah gdb" padahal distribusi berupa WMS. |
| D18 | E19 | Organisasi penanggung jawab | 1 | 0 | Kontak owner dan custodian "Bappeda Provinsi NTB" spesifik. Kontak pointOfContact memakai judul dataset sebagai nama organisasi, dan pengguna "kementerian atr/bpn" berjabatan "pelaku". |
| D18 | E20 | Sarana kontak valid | 1 | 0 | Email bappeda@ntbprov.go.id (domain resmi). Pada kontak pemeliharaan, kolom email berisi URL. Penanda F06. |
| D18 | E22 | Tanggal metadata | 1 | 0 | dateInfo hanya bertipe revision (2025-11-20), tanpa creation. |
| D18 | E24 | Pernyataan lineage | 0.5 | 1 | Pernyataan lineage hanya "Alur proses pengolahan data" (generik, tampak templat). |
| D18 | E25 | Sumber data | 1 | 1 | Sumber "Foto Udara Lidar tahun 2015". Spesifik sebagai teks, tetapi kecocokan dengan dataset batas 12 mil tahun 2025 diragukan (tampak salinan templat RBI). Kebenaran isi tidak dinilai. |
| D18 | E26 | Langkah atau metode pemrosesan | 1 | 1 | Sembilan langkah bernama (Stereoploting, Topologi dan Poligon, DTM, Kontur dan Spotheight, dan seterusnya). Alur ini tampak salinan RBI dan tidak sesuai dataset batas laut. Kebenaran isi tidak dinilai. |
| D18 | E27 | Representasi Spasial (Topologi & Geometri) | 0.5 | 0 | topologyLevel geometryOnly dan geometricObjectType kode composite (teks "surface" tidak sama dengan kode); geometricObjectCount tidak ada. Dua dari tiga unsur, dikodekan 0,5. |
| D18 | E28 | Lingkup Metadata (Metadata Scope) | 1 | 0 | resourceScope "dataset" dan name "Wilayah Perairan 12 Mil Provinsi NTB". |
| D18 | E29 | Katalog Simbol (Portrayal Catalogue) | 1 | 0 | Sitasi "SNI 8743-2019 penyajian peta rupabumi indonesia" dengan tautan akses-sni.bsn.go.id; judul alternatif menulis "SNI 8873" (nomor tidak konsisten). |
| D18 | E30 | Skema Aplikasi (Application Schema) | 1 | 0 | Nama skema "Skema UML RBI", tautan geoportal.big.go.id/skemarbi/contoh, bahasa skema UML, berkas XSD. Skema RBI umum, bukan skema dataset ini. |
| D18 | E31 | Kepatuhan KUGI | 1 | 0 | complianceCode true, includedWithDataset true, sitasi "Katalog unsur geografi indonesia" (KUGI edisi 5) dengan tautan kugi.ina-sdi.or.id. |
| D18 | E32 | Metadata Layanan (Service) | 0.5 | 0 | Tautan OGC:WMS dengan nama layer "palapa:Wilayah\_Perairan\_12mil\_AR"; deskripsi layanan hanya mengulang judul dataset. Tidak ada srv:SV\_ServiceIdentification. Dikodekan 0,5 menurut tafsir seragam E32, diputuskan 31 Okt 2026. |

## Skor
| Skor kelengkapan metadata (15 dataset: D01, D03-D05, D07-D14, D16-D18). Skor utama memakai 32 elemen; skor inti 26 elemen di kolom AA-AE. | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 | Unnamed: 12 | Unnamed: 13 | Unnamed: 14 | Unnamed: 15 | Unnamed: 16 | Unnamed: 17 | Unnamed: 18 | Unnamed: 19 | Unnamed: 20 | Unnamed: 21 | Unnamed: 22 | Unnamed: 23 | Unnamed: 24 | Unnamed: 25 | Unnamed: 26 | Unnamed: 27 | Unnamed: 28 | Unnamed: 29 | Unnamed: 30 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Skor 0 sampai 100. Pecahan kategori dihitung dari Kodean dan bobot elemen. Hasil adalah pola awal pada sampel kecil, bukan generalisasi. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ID | Dataset | Kelompok sumber | Informasi umum | Identifikasi | Deskripsi | Cakupan | Ketelitian | Kontak | Meta-metadata | Pemrosesan | Skor A (usulan, E01-E32) | Skor B (setara, E01-E32) | Skor C (Ketelitian dan Pemrosesan x2, E01-E32) | Peringkat A | Peringkat B | Peringkat C | MQI biner (E01-E32) | MQI diperluas (E01-E32; 3 tingkat, tanpa bobot kategori) | MQI ketat (E01-E32; hanya nilai 1) | Kategori MQI (biner) | Kategori MQI (diperluas) | Peringkat MQI biner | Peringkat MQI diperluas | MQI biner (E01-E32; bobot selaras paper) | Skor ekstensi (E27-E32 saja) | Skor A inti (E01-E26) | MQI biner inti (E01-E26; sebanding dengan paper) | MQI diperluas inti (E01-E26) | MQI biner inti, bobot selaras paper (E01-E26) | Kategori inti (diperluas) |
| D01 | Alur Migrasi Penyu (Kab. Kubu Raya) | Portal daerah | 0.65 | 0.785714 | 0.361111 | 0.357143 | 0 | 0.5 | 0.666667 | 0.333333 | 39.003968 | 45.674603 | 32.621882 | 12 | 13 | 10 | 60.869565 | 42.753623 | 24.637681 | Fair | Poor | 8 | 11 | 60.294118 | 22.727273 | 41.559524 | 67.241379 | 46.551724 | 66.666667 | Poor |
| D03 | Batas Kewenangan Pengelolaan Wilayah Laut Riau | Portal daerah | 0.55 | 0.785714 | 0.361111 | 0.571429 | 0.125 | 1 | 1 | 0.166667 | 47.551587 | 56.999008 | 38.132086 | 7 | 6 | 7 | 65.217391 | 49.275362 | 33.333333 | Fair | Poor | 6 | 7 | 64.705882 | 13.636364 | 50.607143 | 72.413793 | 56.034483 | 71.929825 | Fair |
| D04 | Alur Migrasi Biota Laut di Kab. Kotawaringin Timur | Portal daerah | 0.6 | 1 | 0.5 | 0.571429 | 0 | 0.142857 | 0.833333 | 0.166667 | 40.5 | 47.678571 | 31.309524 | 11 | 11 | 12 | 52.173913 | 44.927536 | 37.681159 | Fair | Poor | 13 | 8 | 51.470588 | 22.727273 | 43.5 | 56.896552 | 49.137931 | 56.140351 | Poor |
| D05 | Peta Jalur Penangkapan Ikan Provinsi Aceh | Portal daerah | 0.65 | 1 | 0.555556 | 0.571429 | 0 | 0.785714 | 0.666667 | 0.333333 | 50.234127 | 57.03373 | 40.643424 | 5 | 5 | 6 | 65.217391 | 55.072464 | 44.927536 | Fair | Fair | 6 | 5 | 64.705882 | 22.727273 | 53.761905 | 72.413793 | 61.206897 | 71.929825 | Fair |
| D07 | IGT Habitat Bentik Laut Dangkal Tahun 2025 Indonesia | Portal KKP | 0.4 | 0.857143 | 0.527778 | 0.285714 | 0.4375 | 0.928571 | 0.833333 | 0.166667 | 49.956349 | 55.458829 | 44.314059 | 6 | 7 | 5 | 69.565217 | 51.449275 | 33.333333 | Fair | Fair | 5 | 6 | 72.058824 | 18.181818 | 52.678571 | 75.862069 | 57.758621 | 78.947368 | Fair |
| D08 | Mangrove 2024 skala 1:25K (MANGROVE2024\_25K\_032/040) | Portal KKP | 0.2 | 0.357143 | 0.055556 | 0.142857 | 0.125 | 0 | 0.666667 | 0.5 | 24.888889 | 25.590278 | 26.706349 | 15 | 15 | 14 | 37.681159 | 20.289855 | 2.898551 | Poor | Very Poor | 15 | 15 | 36.764706 | 13.636364 | 24.666667 | 39.655172 | 21.551724 | 38.596491 | Very Poor |
| D09 | Peta Terumbu Karang Indonesia 1:50.000 Tahun 2015 | Portal KKP | 0.45 | 0.714286 | 0.805556 | 0.857143 | 0.4375 | 1 | 0.5 | 1 | 75.126984 | 72.056052 | 74.197846 | 1 | 2 | 1 | 84.057971 | 73.913043 | 63.768116 | Good | Fair | 2 | 2 | 86.764706 | 59.090909 | 75.571429 | 87.931034 | 76.724138 | 91.22807 | Good |
| D10 | Benda Muatan Kapal Tenggelam (Potensi Sumber Daya Arkeologi Maritim) | Portal KKP | 0.7 | 0.642857 | 0.75 | 0.571429 | 0.4375 | 1 | 1 | 0.166667 | 56.297619 | 65.855655 | 48.843537 | 4 | 4 | 4 | 79.710145 | 63.768116 | 47.826087 | Good | Fair | 3 | 3 | 79.411765 | 59.090909 | 57.547619 | 81.034483 | 64.655172 | 80.701754 | Fair |
| D11 | Neraca Sumber Daya Laut Habitat Bentik KKPN Kepulauan Raja Ampat 1:50K | Portal KKP | 0.45 | 0.785714 | 0.388889 | 0.5 | 0.625 | 0.785714 | 1 | 1 | 70.781746 | 69.191468 | 73.772676 | 3 | 3 | 2 | 78.26087 | 62.318841 | 46.376812 | Good | Fair | 4 | 4 | 79.411765 | 22.727273 | 72.47619 | 87.931034 | 69.827586 | 89.473684 | Fair |
| D12 | Ambon\_100m (batimetri) | BIG | 0.5 | 0.642857 | 0.194444 | 0.357143 | 0.125 | 0.928571 | 1 | 0 | 36.230159 | 46.850198 | 27.664399 | 13 | 12 | 13 | 57.971014 | 37.681159 | 17.391304 | Fair | Poor | 11 | 13 | 58.823529 | 22.727273 | 37.202381 | 60.344828 | 40.517241 | 61.403509 | Poor |
| D13 | Indeks Peta Lingkungan Pantai Indonesia (LPI) 1:25.000 | BIG | 0.4 | 0.785714 | 0.305556 | 0.571429 | 0.125 | 0.928571 | 1 | 0 | 42.198413 | 51.453373 | 31.927438 | 10 | 10 | 11 | 53.623188 | 42.753623 | 31.884058 | Fair | Poor | 12 | 11 | 54.411765 | 22.727273 | 43.22619 | 58.62069 | 46.551724 | 59.649123 | Poor |
| D14 | Kawasan Konservasi Pesisir dan Pulau-Pulau Kecil Kalimantan Barat | Portal daerah | 0.45 | 0.785714 | 0.111111 | 0.571429 | 0 | 0.357143 | 1 | 0 | 32.289683 | 40.94246 | 23.064059 | 14 | 14 | 15 | 42.028986 | 31.15942 | 20.289855 | Poor | Poor | 14 | 14 | 42.647059 | 13.636364 | 33.595238 | 44.827586 | 34.482759 | 45.614035 | Poor |
| D16 | Garis Pantai (Provinsi Banten) | Portal daerah | 0.55 | 0.785714 | 0.25 | 0.571429 | 0.1875 | 1 | 1 | 0 | 44.357143 | 54.308036 | 34.362245 | 8 | 8 | 8 | 59.42029 | 44.927536 | 30.434783 | Fair | Poor | 9 | 8 | 60.294118 | 13.636364 | 46.857143 | 65.517241 | 50.862069 | 66.666667 | Fair |
| D17 | Batas Pengelolaan Laut (Provinsi Banten) | Portal daerah | 0.55 | 0.785714 | 0.25 | 0.571429 | 0.1875 | 1 | 1 | 0 | 44.357143 | 54.308036 | 34.362245 | 8 | 8 | 8 | 59.42029 | 44.927536 | 30.434783 | Fair | Poor | 9 | 8 | 60.294118 | 13.636364 | 46.857143 | 65.517241 | 50.862069 | 66.666667 | Fair |
| D18 | Wilayah Perairan 12 Mil Provinsi NTB | Portal daerah | 0.7 | 1 | 0.916667 | 0.142857 | 0.625 | 1 | 1 | 0.833333 | 73.97619 | 77.723214 | 73.673469 | 2 | 1 | 3 | 92.753623 | 78.26087 | 63.768116 | Excellent | Good | 1 | 1 | 91.176471 | 81.818182 | 74.059524 | 91.37931 | 77.586207 | 89.473684 | Good |
|  | Rata-rata |  | 0.52 | 0.780952 | 0.422222 | 0.480952 | 0.229167 | 0.757143 | 0.877778 | 0.311111 | 48.516667 | 54.741567 | 42.373016 |  |  |  | 63.864734 | 49.565217 | 35.2657 |  |  |  |  | 64.215686 | 28.181818 | 50.277778 | 68.505747 | 53.62069 | 69.005848 |  |
|  | Median |  | 0.55 | 0.785714 | 0.361111 | 0.571429 | 0.125 | 0.928571 | 1 | 0.166667 | 44.357143 | 54.308036 | 34.362245 |  |  |  | 60.869565 | 44.927536 | 33.333333 |  |  |  |  | 60.294118 | 22.727273 | 46.857143 | 67.241379 | 50.862069 | 66.666667 |  |
|  | Minimum |  | 0.2 | 0.357143 | 0.055556 | 0.142857 | 0 | 0 | 0.5 | 0 | 24.888889 | 25.590278 | 23.064059 |  |  |  | 37.681159 | 20.289855 | 2.898551 |  |  |  |  | 36.764706 | 13.636364 | 24.666667 | 39.655172 | 21.551724 | 38.596491 |  |
|  | Maksimum |  | 0.7 | 1 | 0.916667 | 0.857143 | 0.625 | 1 | 1 | 1 | 75.126984 | 77.723214 | 74.197846 |  |  |  | 92.753623 | 78.26087 | 63.768116 |  |  |  |  | 91.176471 | 81.818182 | 75.571429 | 91.37931 | 77.586207 | 91.22807 |  |
|  | Rata-rata skor per kelompok sumber (n kecil, deskriptif saja) | n |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Portal daerah | 8 |  |  |  |  |  |  |  |  | 46.53373 | 54.333457 | 38.521117 |  |  |  | 62.137681 | 48.913043 | 35.688406 |  |  |  |  | 61.948529 | 25.568182 | 48.849702 | 67.025862 | 53.340517 | 66.885965 |  |
|  | Portal KKP | 5 |  |  |  |  |  |  |  |  | 55.410317 | 57.630456 | 53.566893 |  |  |  | 69.855072 | 54.347826 | 38.84058 |  |  |  |  | 70.882353 | 34.545455 | 56.588095 | 74.482759 | 58.103448 | 75.789474 |  |
|  | BIG | 2 |  |  |  |  |  |  |  |  | 39.214286 | 49.151786 | 29.795918 |  |  |  | 55.797101 | 40.217391 | 24.637681 |  |  |  |  | 56.617647 | 22.727273 | 40.214286 | 59.482759 | 43.534483 | 60.526316 |  |

## Sensitivitas
| Sensitivitas: placeholder = 0 dan skema bobot lain | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 | Unnamed: 12 | Unnamed: 13 | Unnamed: 14 | Unnamed: 15 | Unnamed: 16 | Unnamed: 17 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Korelasi peringkat dihitung dengan CORREL pada peringkat (aproksimasi Spearman; peringkat sama tidak dikoreksi). |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ID | Informasi umum | Identifikasi | Deskripsi | Cakupan | Ketelitian | Kontak | Meta-metadata | Pemrosesan | Skor A dengan placeholder = 0 | Skor A (asli) | Selisih | Peringkat A | Peringkat A (placeholder = 0) | Peringkat B | Peringkat C | Peringkat MQI biner | Peringkat MQI diperluas |
| D01 | 0.65 | 0.785714 | 0.277778 | 0.357143 | 0 | 0.5 | 0.666667 | 0.333333 | 38.170635 | 39.003968 | 0.833333 | 12 | 12 | 13 | 10 | 8 | 11 |
| D03 | 0.55 | 0.785714 | 0.305556 | 0.571429 | 0.125 | 1 | 1 | 0 | 43.662698 | 47.551587 | 3.888889 | 7 | 6 | 6 | 7 | 6 | 7 |
| D04 | 0.6 | 1 | 0.5 | 0.571429 | 0 | 0.142857 | 0.833333 | 0.166667 | 40.5 | 40.5 | 0 | 11 | 11 | 11 | 12 | 13 | 8 |
| D05 | 0.65 | 1 | 0.555556 | 0.571429 | 0 | 0.785714 | 0.666667 | 0.333333 | 50.234127 | 50.234127 | 0 | 5 | 4 | 5 | 6 | 6 | 5 |
| D07 | 0.4 | 0.857143 | 0.444444 | 0.285714 | 0.25 | 0.928571 | 0.833333 | 0 | 42.039683 | 49.956349 | 7.916667 | 6 | 10 | 7 | 5 | 5 | 6 |
| D08 | 0.2 | 0.357143 | 0.055556 | 0.142857 | 0.125 | 0 | 0.666667 | 0.5 | 24.888889 | 24.888889 | 0 | 15 | 15 | 15 | 14 | 15 | 15 |
| D09 | 0.45 | 0.714286 | 0.805556 | 0.857143 | 0.4375 | 1 | 0.5 | 1 | 75.126984 | 75.126984 | 0 | 1 | 1 | 2 | 1 | 2 | 2 |
| D10 | 0.7 | 0.642857 | 0.666667 | 0.428571 | 0.25 | 1 | 1 | 0 | 46.238095 | 56.297619 | 10.059524 | 4 | 5 | 4 | 4 | 3 | 3 |
| D11 | 0.45 | 0.785714 | 0.388889 | 0.5 | 0.625 | 0.785714 | 1 | 1 | 70.781746 | 70.781746 | 0 | 3 | 2 | 3 | 2 | 4 | 4 |
| D12 | 0.5 | 0.642857 | 0.194444 | 0.357143 | 0.125 | 0.928571 | 1 | 0 | 36.230159 | 36.230159 | 0 | 13 | 13 | 12 | 13 | 11 | 13 |
| D13 | 0.4 | 0.785714 | 0.305556 | 0.571429 | 0.125 | 0.928571 | 1 | 0 | 42.198413 | 42.198413 | 0 | 10 | 9 | 10 | 11 | 12 | 11 |
| D14 | 0.45 | 0.785714 | 0.111111 | 0.571429 | 0 | 0.357143 | 1 | 0 | 32.289683 | 32.289683 | 0 | 14 | 14 | 14 | 15 | 14 | 14 |
| D16 | 0.55 | 0.785714 | 0.055556 | 0.571429 | 0.1875 | 1 | 1 | 0 | 42.412698 | 44.357143 | 1.944444 | 8 | 7 | 8 | 8 | 9 | 8 |
| D17 | 0.55 | 0.785714 | 0.055556 | 0.571429 | 0.1875 | 1 | 1 | 0 | 42.412698 | 44.357143 | 1.944444 | 8 | 7 | 8 | 8 | 9 | 8 |
| D18 | 0.7 | 1 | 0.833333 | 0.142857 | 0.4375 | 1 | 1 | 0 | 52.72619 | 73.97619 | 21.25 | 2 | 3 | 1 | 3 | 1 | 1 |
| Korelasi peringkat (aproksimasi Spearman) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| A vs A (placeholder = 0) |  |  |  |  | 0.957139 |  |  |  |  |  |  |  |  |  |  |  |  |
| A vs B (bobot setara) |  |  |  |  | 0.989245 |  |  |  |  |  |  |  |  |  |  |  |  |
| A vs C (Ketelitian dan Pemrosesan x2) |  |  |  |  | 0.978489 |  |  |  |  |  |  |  |  |  |  |  |  |
| A vs MQI biner (sebanding paper) |  |  |  |  | 0.933891 |  |  |  |  |  |  |  |  |  |  |  |  |
| A vs MQI diperluas (tanpa bobot kategori) |  |  |  |  | 0.973855 |  |  |  |  |  |  |  |  |  |  |  |  |

## Penanda
| Penanda mutu di luar skor (1 = terdapat pada dataset) | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 | Unnamed: 12 | Unnamed: 13 | Unnamed: 14 | Unnamed: 15 | Unnamed: 16 | Unnamed: 17 | Unnamed: 18 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Penanda diturunkan dari pengamatan pilot dan dilaporkan terpisah dari skor kelengkapan. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ID | Penanda | Definisi | D01 | D03 | D04 | D05 | D07 | D08 | D09 | D10 | D11 | D12 | D13 | D14 | D16 | D17 | D18 | n dataset |
| F01 | Teks templat, salinan, atau bawaan | Isi elemen berupa teks definisi standar, salinan elemen lain, atau teks bawaan yang tidak spesifik pada dataset | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | 1 | 7 |
| F02 | Bounding box tidak konsisten atau tidak informatif | 0,0,0,0, tidak ada, terlalu luas untuk data lokal, atau sebagian ekstensi di luar lingkup | 1 | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 6 |
| F03 | Jalur lokal atau nama host pada metadata | Jalur berkas lokal atau nama host perangkat tercantum dalam metadata | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| F04 | Bukan XML ISO (ESRI atau rekaman CKAN) | Format ESRI atau JSON CKAN; rekaman CKAN adalah tampilan hasil harvest portal | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 3 |
| F05 | Bahasa tidak sesuai isi atau bukan kode ISO | Bahasa eng untuk isi Indonesia, atau teks bebas sebagai bahasa | 0 | 0 | 1 | 0 | 1 | 1 | 0 | 1 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 6 |
| F06 | Kontak kosong, placeholder, atau non-institusional | nilReason=missing, 'Belum Ada', '-', email gmail, atau domain tampak keliru | 1 | 0 | 1 | 1 | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 1 | 1 | 1 | 9 |
| F07 | CRS tidak konsisten atau tidak valid | CRS metadata berbeda dari layanan, atau kode berisi teks templat | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| F08 | Tanggal tidak konsisten atau ambigu | Periode data tidak cocok dengan judul, tanggal metadata lebih tua dari rujukan, atau tiga tanggal berbeda | 0 | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 3 |
| F09 | Pernyataan kualitas kontradiktif atau templat | Laporan DQ dengan unit templat, ambang dilaporkan sebagai hasil, atau pass tidak cocok dengan penjelasan | 0 | 0 | 0 | 0 | 1 | 0 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 1 | 5 |
| F10 | Teks rusak, terpotong, atau salah ketik | Fragmen teks tercampur, kalimat terpotong, atau salah ejaan pada elemen atau nama layer | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 1 | 1 | 1 | 7 |
| F11 | Elemen ganda atau struktur bermasalah | Blok extent ganda, elemen city ganda, atau codelist keliru | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 6 |
| F12 | Lisensi bawaan GeoNode | 'Public Domain' dengan rujukan situs non-Indonesia, atau 'Not Specified' | 1 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 |
| F13 | Nama standar menyebut ISO 19139 | metadataStandardName memuat spesifikasi implementasi XML, bukan standar isi | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 4 |
| F14 | Penanda penolakan kurasi pada portal | review\_status 'rejected' dan catatan kurasi pada rekaman | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 1 |
|  | Jumlah penanda per dataset |  | 4 | 2 | 4 | 3 | 7 | 5 | 4 | 6 | 6 | 3 | 3 | 3 | 4 | 4 | 6 |  |

## Cek_Paper
| Pemeriksaan angka paper MQI (hitung ulang dari tabel paper) | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 | Unnamed: 12 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Nilai biru dimasukkan ulang dari paper. Kolom hitung ulang memakai rumus. |  |  |  |  |  |  |  |  |  |  |  |  |
| Dataset (Tabel 4, hlm 768) | Tahun | Teknologi | MQI di paper | Kategori tercetak | Dekade | Kategori hitung ulang (ambang Tabel 2) | Cocok? |  | Kategori | Jumlah tertulis (hlm 764-765) | Jumlah pada daftar | Skor tertimbang Tabel 8 (hlm 772) |
| 67 | 1991 | SBES | 12.8 | Very Poor | 1990-1999 | Very Poor | sesuai |  | General | 5 | 6 | 5 |
| 112 | 1995 | SBES | 16.3 | Very Poor | 1990-1999 | Very Poor | sesuai |  | Identification | 8 | 8 | 4.2 |
| 158 | 1999 | SBES | 18.4 | Very Poor | 1990-1999 | Very Poor | sesuai |  | Description | 15 | 15 | 4.7 |
| 198 | 2004 | SBES | 24.7 | Poor | 2000-2009 | Very Poor | TIDAK SESUAI |  | Extent | 12 | 9 | 4.4 |
| 204 | 2005 | SBES | 31.2 | Poor | 2000-2009 | Poor | sesuai |  | Accuracy Parameters | 21 |  | 4.8 |
| 238 | 2008 | SBES | 42.1 | Poor | 2000-2009 | Poor | sesuai |  | Point of Contact | 6 | 7 | 3.8 |
| 287 | 2012 | SBES | 58.6 | Fair | 2010-2019 | Fair | sesuai |  | Meta-Metadata | 5 | 6 | 5 |
| 325 | 2015 | MBES | 68.9 | Fair | 2010-2019 | Fair | sesuai |  | Processing | 6 | 6 |  |
| 342 | 2017 | MBES | 72.4 | Good | 2010-2019 | Fair | TIDAK SESUAI |  |  |  |  |  |
| 363 | 2021 | MBES | 76.8 | Good | 2020-2024 | Good | sesuai |  | Jumlah daftar Accuracy tidak pasti (21 atau 22 tergantung cara menghitung 'Across/Along Track'). |  |  |  |
| 401 | 2022 | MBES | 82.4 | Good | 2020-2024 | Good | sesuai |  |  |  |  |  |
| CONCMBH001 | 2023 | SBES | 78.5 | Good | 2020-2024 | Good | sesuai |  |  |  |  |  |
| Ukuran | Nilai di paper | Hitung ulang | Selisih | Status | Sumber di paper |  |  |  |  |  |  |  |
| Rata-rata MQI 12 dataset | 50.3 | 48.591667 | -1.708333 | TIDAK SESUAI | hlm 768 |  |  |  |  |  |  |  |
| Simpangan baku (sampel) | 27.1 | 27.07466 | -0.02534 | sesuai | hlm 768 |  |  |  |  |  |  |  |
| Rata-rata 1990-1999 | 15.8 | 15.833333 | 0.033333 | sesuai | Tabel 5, hlm 769 |  |  |  |  |  |  |  |
| Rata-rata 2000-2009 | 32.7 | 32.666667 | -0.033333 | sesuai | Tabel 5, hlm 769 |  |  |  |  |  |  |  |
| Rata-rata 2010-2019 | 71.3 | 66.633333 | -4.666667 | TIDAK SESUAI | Tabel 5, hlm 769 |  |  |  |  |  |  |  |
| Rata-rata 2020-2024 | 78.5 | 79.233333 | 0.733333 | TIDAK SESUAI | Tabel 5, hlm 769 |  |  |  |  |  |  |  |
| Contoh Tabel 3: 7 dibagi 13 dikali 100 | 53.8 | 53.846154 | 0.046154 | sesuai | hlm 767 |  |  |  |  |  |  |  |
| MQI studi kasus vs jumlah skor tertimbang Tabel 8 | 78.5 | 31.9 | -46.6 | TIDAK SESUAI | hlm 772-773 |  |  |  |  |  |  |  |
| Jumlah parameter, 8 kategori (tertulis) | 72 | 78 | 6 | TIDAK SESUAI | hlm 764 |  |  |  |  |  |  |  |
| Jumlah parameter, 7 kategori tanpa Processing | 72 | 72 | 0 | sesuai | Tabel 8, hlm 772 |  |  |  |  |  |  |  |

## Temuan_Paper
| Inkonsistensi yang ditemukan pada paper MQI dan dampaknya untuk KOMPAS | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 |
| --- | --- | --- | --- | --- |
| Halaman merujuk nomor halaman PDF. Pemeriksaan angka ada di sheet Cek\_Paper. |  |  |  |  |
| No | Halaman | Klaim di paper | Pengamatan dari hitung ulang atau pembacaan | Dampak untuk KOMPAS |
| 1 | 759, 769 | Abstrak: rata-rata pra-2000 = 18,4 (Poor) dan 2000-2010 = 32,7 (Fair). | Tabel 5: 1990-1999 = 15,8 (Very Poor) dan 2000-2009 = 32,7 (Poor). Ambang Tabel 2: 25-49 adalah Poor. Angka 18,4 adalah skor satu dataset (158). | Jangan mengutip angka dari abstrak. |
| 2 | 759, 770-771 | Abstrak: kepatuhan pelaporan ketidakpastian 8,3% pada dataset pra-2010. | Tabel 7 dan teks hlm 771: TVU/THU/TPU 0% pada pra-2010. Angka 8,3% tidak ditemukan di bagian hasil. | Jangan mengutip 8,3%. |
| 3 | 769 vs 768 | Tabel 5: rata-rata 2010-2019 = 71,3 (SD 5,4); 2020-2024 = 78,5 (SD 5,1). | Dari Tabel 4: 2010-2019 = 66,6 (SD 7,2); 2020-2024 = 79,2 (SD 2,9). Rata-rata 1990-an dan 2000-an cocok. | Jangan mengutip angka dekade 2010-an dan 2020-an. |
| 4 | 768 | Rata-rata keseluruhan 50,3 dengan SD 27,1. | Dari Tabel 4 rata-rata 48,6 (SD 27,1 cocok). | Gunakan hitung ulang bila perlu. |
| 5 | 766, 768-769 | Kategori: 71,3 dan 72,4 disebut Good; 24,7 disebut Poor. | Tabel 2: Good = 75-89 dan Very Poor = 0-24. Nilai 72,4 dan 71,3 masuk Fair. Nilai 24,7 berada tepat di bawah 25. | Pakai ambang Tabel 2 secara konsisten. |
| 6 | 764-765, 772 | Delapan kategori dengan 72 parameter. | Jumlah tertulis per kategori berjumlah 78. Angka 72 hanya cocok bila Processing dikeluarkan (Tabel 8 tidak memuat Processing). Daftar parameter General (6), Extent (9), Point of Contact (7), Meta-Metadata (6) tidak sama dengan jumlah tertulis. | Jangan mengutip '72 parameter' tanpa catatan. |
| 7 | 766, 773 | Rumus: jumlah (p x w) / jumlah w x 100. Studi kasus: 66/72 x (jumlah tertimbang / maksimum) x 100 = 78,5. | Dua rumus berbeda. Skor tertimbang kategori Tabel 8 berjumlah 31,9. Nilai 78,5 tidak dapat direproduksi dari tabel. | Pakai rumus hlm 766 (contoh Tabel 3 benar: 53,8). |
| 8 | 765-766, 770 | Parameter kritis (bobot 3): Data Set ID, Spatial Extent, Device Type, Survey Date. Bobot 2: TVU/THU/TPU, Calibration Status, Processing Lineage, Positioning System. | Tabel 7 menyebut 15 parameter kritis (bobot 3) termasuk yang berbobot 2. Tabel 3 memberi bobot 3 pada Calibration Date dan TVU Value. | Bobot paper hanya dipakai pada elemen yang disebut jelas. |
| 9 | 765-766 | Bobot divalidasi 8 pakar. | Bobot lengkap 72 parameter tidak dipublikasikan, hanya contoh. Tidak ada statistik kesepakatan pakar. | Bobot tidak dapat direplikasi persis. |
| 10 | 770, 773 | Tabel 9: Level 3 membutuhkan Calibration Status. Hasil: 67% (2010-an) dan 100% (2020-an) memenuhi Level 3. | Tabel 7: kalibrasi 0% pada semua dataset sehingga tidak ada dataset yang dapat memenuhi syarat parameter Level 3. Dataset 342 (72,4) juga di bawah 75. | Hati-hati mengutip tingkat kepatuhan Level 3. |
| 11 | 759, 764, 768 | Studi 1991-2024, '33 tahun', SBES n = 7. | Tabel 1 dan Tabel 4 berakhir 2023 (32 tahun) dan memuat 8 dataset SBES. | Gunakan 1991-2023 dari tabel. |
| 12 | 759-777 | Jurnal Vol. XIII Issue II, Februari 2026. | Halaman bernomor genap memuat header Vol. XII Issue IX, September 2025. | Cek versi final sebelum disitasi. |
| 13 | 766-767, 775 | Analisis ANOVA per dekade dengan n = 3; paper mengakui hanya menilai keberadaan dan bukan kualitas isi. | Daya uji statistik rendah dan penilaian isi tidak dilakukan. | Posisi KOMPAS: menambah penilaian kebermaknaan isi dan tidak memakai uji per dekade. |
|  | Aman dikutip (konsisten di abstrak, tabel, dan pembahasan): kerangka 8 kategori, skema bobot 3/2/1, rumus hlm 766, ambang Tabel 2, dan temuan dokumentasi kalibrasi 0% pada 12 dataset. |  |  |  |

## Acuan_Uji_Aplikasi
| Nilai acuan untuk uji aplikasi (15 dataset: D01, D03-D05, D07-D14, D16-D18), diambil dari sheet Skor dan Kodean | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 | Unnamed: 12 | Unnamed: 13 | Unnamed: 14 | Unnamed: 15 | Unnamed: 16 | Unnamed: 17 | Unnamed: 18 | Unnamed: 19 | Unnamed: 20 | Unnamed: 21 | Unnamed: 22 | Unnamed: 23 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Seluruh angka di tabel ini rumus; jangan diketik ulang. Skor A, MQI biner, dan MQI diperluas memakai 32 elemen (E01-E32); kolom U sampai X memuat padanan inti 26 elemen untuk perbandingan dengan paper dan versi sebelumnya. Status\_Format diturunkan dari kolom Pengodean di Sampel\_v2. Kategori memakai ambang Tabel 2 paper MQI pada skor MQI, bukan pada Skor A. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Versi aturan: v7-2026-10-31. Nilai acuan v6 dan handover lama tidak berlaku (E32 D03, D10, D18 berubah). |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ID | Judul | Kelompok sumber | Status\_Format | Skor A (usulan) | MQI biner | MQI diperluas | Kategori (biner) | Kategori (diperluas) | Informasi umum | Identifikasi | Deskripsi | Cakupan | Ketelitian | Kontak | Meta-metadata | Pemrosesan | n elemen kosong (nilai 0) | Daftar elemen kosong | Skor ekstensi (E27-E32 saja) | Skor A inti (E01-E26) | MQI biner inti (E01-E26) | MQI diperluas inti (E01-E26) | Kategori inti (diperluas) |
| D01 | Alur Migrasi Penyu (Kab. Kubu Raya) | Portal daerah | gmd | 39.003968 | 60.869565 | 42.753623 | Fair | Poor | 65 | 78.571429 | 36.111111 | 35.714286 | 0 | 50 | 66.666667 | 33.333333 | 12 | E08, E14, E16, E17, E18, E19, E23, E26, E27, E29, E30, E31 | 22.727273 | 41.559524 | 67.241379 | 46.551724 | Poor |
| D03 | Batas Kewenangan Pengelolaan Wilayah Laut Riau | Portal daerah | gmd | 47.551587 | 65.217391 | 49.275362 | Fair | Poor | 55 | 78.571429 | 36.111111 | 57.142857 | 12.5 | 100 | 100 | 16.666667 | 10 | E12, E14, E16, E17, E25, E26, E27, E29, E30, E31 | 13.636364 | 50.607143 | 72.413793 | 56.034483 | Fair |
| D04 | Alur Migrasi Biota Laut di Kab. Kotawaringin Timur | Portal daerah | gmd | 40.5 | 52.173913 | 44.927536 | Fair | Poor | 60 | 100 | 50 | 57.142857 | 0 | 14.285714 | 83.333333 | 16.666667 | 13 | E11, E14, E16, E17, E18, E19, E20, E25, E26, E27, E29, E30, E31 | 22.727273 | 43.5 | 56.896552 | 49.137931 | Poor |
| D05 | Peta Jalur Penangkapan Ikan Provinsi Aceh | Portal daerah | gmd | 50.234127 | 65.217391 | 55.072464 | Fair | Fair | 65 | 100 | 55.555556 | 57.142857 | 0 | 78.571429 | 66.666667 | 33.333333 | 11 | E08, E14, E16, E17, E18, E23, E26, E27, E29, E30, E31 | 22.727273 | 53.761905 | 72.413793 | 61.206897 | Fair |
| D07 | IGT Habitat Bentik Laut Dangkal Tahun 2025 Indonesia | Portal KKP | gmd | 49.956349 | 69.565217 | 51.449275 | Fair | Fair | 40 | 85.714286 | 52.777778 | 28.571429 | 43.75 | 92.857143 | 83.333333 | 16.666667 | 8 | E03, E13, E16, E25, E26, E30, E31, E32 | 18.181818 | 52.678571 | 75.862069 | 57.758621 | Fair |
| D08 | Mangrove 2024 skala 1:25K (MANGROVE2024\_25K\_032/040) | Portal KKP | ESRI | 24.888889 | 37.681159 | 20.289855 | Poor | Very Poor | 20 | 35.714286 | 5.555556 | 14.285714 | 12.5 | 0 | 66.666667 | 50 | 20 | E02, E03, E06, E07, E08, E09, E10, E11, E13, E14, E16, E17, E19, E20, E21, E23, E29, E30, E31, E32 | 13.636364 | 24.666667 | 39.655172 | 21.551724 | Very Poor |
| D09 | Peta Terumbu Karang Indonesia 1:50.000 Tahun 2015 | Portal KKP | gmd | 75.126984 | 84.057971 | 73.913043 | Good | Fair | 45 | 71.428571 | 80.555556 | 85.714286 | 43.75 | 100 | 50 | 100 | 5 | E03, E05, E16, E30, E32 | 59.090909 | 75.571429 | 87.931034 | 76.724138 | Good |
| D10 | Benda Muatan Kapal Tenggelam (Potensi Sumber Daya Arkeologi Maritim) | Portal KKP | gmd | 56.297619 | 79.710145 | 63.768116 | Good | Fair | 70 | 64.285714 | 75 | 57.142857 | 43.75 | 100 | 100 | 16.666667 | 6 | E14, E16, E25, E26, E29, E30 | 59.090909 | 57.547619 | 81.034483 | 64.655172 | Fair |
| D11 | Neraca Sumber Daya Laut Habitat Bentik KKPN Kepulauan Raja Ampat 1:50K | Portal KKP | gmd | 70.781746 | 78.26087 | 62.318841 | Good | Fair | 45 | 78.571429 | 38.888889 | 50 | 62.5 | 78.571429 | 100 | 100 | 7 | E03, E11, E12, E29, E30, E31, E32 | 22.727273 | 72.47619 | 87.931034 | 69.827586 | Fair |
| D12 | Ambon\_100m (batimetri) | BIG | gmd | 36.230159 | 57.971014 | 37.681159 | Fair | Poor | 50 | 64.285714 | 19.444444 | 35.714286 | 12.5 | 92.857143 | 100 | 0 | 12 | E10, E11, E12, E14, E16, E17, E24, E25, E26, E29, E30, E31 | 22.727273 | 37.202381 | 60.344828 | 40.517241 | Poor |
| D13 | Indeks Peta Lingkungan Pantai Indonesia (LPI) 1:25.000 | BIG | CKAN | 42.198413 | 53.623188 | 42.753623 | Fair | Poor | 40 | 78.571429 | 30.555556 | 57.142857 | 12.5 | 92.857143 | 100 | 0 | 14 | E02, E08, E10, E12, E14, E16, E17, E24, E25, E26, E27, E29, E30, E31 | 22.727273 | 43.22619 | 58.62069 | 46.551724 | Poor |
| D14 | Kawasan Konservasi Pesisir dan Pulau-Pulau Kecil Kalimantan Barat | Portal daerah | CKAN | 32.289683 | 42.028986 | 31.15942 | Poor | Poor | 45 | 78.571429 | 11.111111 | 57.142857 | 0 | 35.714286 | 100 | 0 | 17 | E02, E08, E10, E11, E12, E14, E16, E17, E18, E20, E24, E25, E26, E27, E29, E30, E31 | 13.636364 | 33.595238 | 44.827586 | 34.482759 | Poor |
| D16 | Garis Pantai (Provinsi Banten) | Portal daerah | mdb | 44.357143 | 59.42029 | 44.927536 | Fair | Poor | 55 | 78.571429 | 25 | 57.142857 | 18.75 | 100 | 100 | 0 | 12 | E08, E12, E14, E16, E18, E24, E25, E26, E27, E29, E30, E31 | 13.636364 | 46.857143 | 65.517241 | 50.862069 | Fair |
| D17 | Batas Pengelolaan Laut (Provinsi Banten) | Portal daerah | mdb | 44.357143 | 59.42029 | 44.927536 | Fair | Poor | 55 | 78.571429 | 25 | 57.142857 | 18.75 | 100 | 100 | 0 | 12 | E08, E12, E14, E16, E18, E24, E25, E26, E27, E29, E30, E31 | 13.636364 | 46.857143 | 65.517241 | 50.862069 | Fair |
| D18 | Wilayah Perairan 12 Mil Provinsi NTB | Portal daerah | mdb | 73.97619 | 92.753623 | 78.26087 | Excellent | Good | 70 | 100 | 91.666667 | 14.285714 | 62.5 | 100 | 100 | 83.333333 | 2 | E13, E14 | 81.818182 | 74.059524 | 91.37931 | 77.586207 | Good |
| Aturan hitung yang harus diikuti aplikasi |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| No | Hal | Aturan |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 1 | Nilai elemen | Nilai v hanya 1, 0,5, atau 0. Pada uji 15 dataset tidak ada elemen "tidak berlaku": seluruh 32 elemen masuk penyebut (spreadsheet tidak memakai N/A). |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 2 | Fraksi kategori | Jumlah (bobot elemen x nilai) dibagi jumlah bobot elemen pada kategori itu. Bobot elemen ada di Checklist kolom D; kategori elemen di Checklist kolom B. E27, E28, dan E32 masuk Informasi umum; E29, E30, dan E31 masuk Deskripsi. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 3 | Skor A (usulan) | Jumlah (fraksi kategori x bobot kategori), skala 0-100. Bobot kategori di sheet Bobot kolom B: 5, 15, 10, 15, 20, 10, 5, 20. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 4 | MQI biner | Jumlah (bobot elemen x [nilai > 0]) / jumlah bobot elemen x 100. Pada 26 elemen sebanding dengan rumus paper MQI hlm 766 (kolom Skor inti). |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 5 | MQI diperluas | Jumlah (bobot elemen x nilai) / jumlah bobot elemen x 100, tanpa bobot kategori. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 6 | Kategori | Dari skor MQI (bukan Skor A): >= 90 Excellent, >= 75 Good, >= 50 Fair, >= 25 Poor, selain itu Very Poor. Tabel 2 paper menulis rentang bulat (mis. 75-89); batas kontinu dipakai agar nilai 89,5 tidak jatuh di celah. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 7 | Skor inti dan Skor 32 elemen | Aplikasi menghitung keduanya. Skor inti (E01-E26) dipertahankan karena paper MQI tidak memuat E27-E32; angka yang dibandingkan dengan paper memakai skor inti. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 8 | Skor\_Inti\_MQI di ekspor | Diputuskan Ketua 31 Okt 2026: skor utama memakai 32 elemen. Ekspor Skor A, MQI biner, dan MQI diperluas untuk 32 elemen dan untuk 26 elemen (kolom U-W), tulis Kategori dari MQI diperluas 32 elemen, dan beri Versi\_Aturan v7-2026-10-31. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Kriteria uji penerimaan |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| No | Uji | Kriteria |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| U1 | Uji hitung | Masukkan Kodean 15 dataset (32 elemen) apa adanya. Skor A, MQI biner, MQI diperluas, delapan skor kategori, dan skor inti harus sama dengan tabel di atas, selisih paling besar 0,1. Karena deterministik, selisih lebih besar berarti ada bug. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| U2 | Uji parser | Tanpa kodean, biarkan parser mengisi elemen yang bisa diotomatiskan. Bandingkan per elemen dengan Kodean (E01-E32) dan laporkan jumlah elemen yang cocok per dataset. Setiap ketidakcocokan dijelaskan. Ambang lulus belum diputuskan; usulan 90% elemen cocok. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| U3 | Uji format | D08 (ESRI) dan D13-D14 (CKAN JSON) diuji lewat jalur masing-masing. D16-D18 diuji lewat jalur mdb dengan berkas aslinya; ini satu-satunya uji jalur mdb pada data nyata. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| U4 | Uji bendera | Bendera F01-F14 di sheet Penanda adalah acuan. Aplikasi menyalakan bendera yang sama atau menjelaskan selisihnya. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| U5 | Uji parser E27-E32 dan jalur mdb | Jalankan parser pada 15 berkas mentah tanpa kodean. E27-E32 hasil parser harus sama dengan tabel di bawah (nilai per elemen; Skor ekstensi selisih paling besar 0,1) atau setiap selisih dijelaskan: parser keliru, atau kodean manual menilai makna (E28 nama spesifik, E29 jenis sitasi, E32 isi deskripsi). D16-D18 menguji jalur mdb pada berkas nyata (D16 dan D17 berasal dari satu generator). Jangan menulis bahwa jalur mdb teruji luas atau bahwa sampel sesuai edisi standar tertentu. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Acuan E27-E32 untuk U5 (nilai dari Kodean; Skor ekstensi dari Skor!Z) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| ID | Judul | Skor ekstensi | E27 | E28 | E29 | E30 | E31 | E32 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| D01 | Alur Migrasi Penyu (Kab. Kubu Raya) | 22.727273 | 0 | 0.5 | 0 | 0 | 0 | 1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| D03 | Batas Kewenangan Pengelolaan Wilayah Laut Riau | 13.636364 | 0 | 0.5 | 0 | 0 | 0 | 0.5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| D04 | Alur Migrasi Biota Laut di Kab. Kotawaringin Timur | 22.727273 | 0 | 0.5 | 0 | 0 | 0 | 1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| D05 | Peta Jalur Penangkapan Ikan Provinsi Aceh | 22.727273 | 0 | 0.5 | 0 | 0 | 0 | 1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| D07 | IGT Habitat Bentik Laut Dangkal Tahun 2025 Indonesia | 18.181818 | 0.5 | 0.5 | 0.5 | 0 | 0 | 0 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| D08 | Mangrove 2024 skala 1:25K (MANGROVE2024\_25K\_032/040) | 13.636364 | 0.5 | 0.5 | 0 | 0 | 0 | 0 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| D09 | Peta Terumbu Karang Indonesia 1:50.000 Tahun 2015 | 59.090909 | 1 | 0.5 | 1 | 0 | 1 | 0 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| D10 | Benda Muatan Kapal Tenggelam (Potensi Sumber Daya Arkeologi Maritim) | 59.090909 | 1 | 0.5 | 0 | 0 | 1 | 0.5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| D11 | Neraca Sumber Daya Laut Habitat Bentik KKPN Kepulauan Raja Ampat 1:50K | 22.727273 | 1 | 0.5 | 0 | 0 | 0 | 0 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| D12 | Ambon\_100m (batimetri) | 22.727273 | 0.5 | 0.5 | 0 | 0 | 0 | 0.5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| D13 | Indeks Peta Lingkungan Pantai Indonesia (LPI) 1:25.000 | 22.727273 | 0 | 0.5 | 0 | 0 | 0 | 1 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| D14 | Kawasan Konservasi Pesisir dan Pulau-Pulau Kecil Kalimantan Barat | 13.636364 | 0 | 0.5 | 0 | 0 | 0 | 0.5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| D16 | Garis Pantai (Provinsi Banten) | 13.636364 | 0 | 0.5 | 0 | 0 | 0 | 0.5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| D17 | Batas Pengelolaan Laut (Provinsi Banten) | 13.636364 | 0 | 0.5 | 0 | 0 | 0 | 0.5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| D18 | Wilayah Perairan 12 Mil Provinsi NTB | 81.818182 | 0.5 | 1 | 1 | 1 | 1 | 0.5 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Kasus khusus yang harus ditangani parser (U5) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| No | Kasus pada berkas | Perilaku yang diharapkan |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 1 | Kode CRS "84" dengan codeSpace "CRS" (D16, D17) | Diterima sebagai WGS84 lon/lat (OGC CRS84); bukan galat "bukan angka EPSG". E15 = 0,5 karena SRGI tidak disebut. Pemeriksaan CRS harus membaca codeSpace dan code, bukan hanya mencocokkan angka EPSG (cek 7 handover). |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 2 | Bounding box berisi string kosong dan nilai 1 (D18) | String kosong bukan angka 0. Blok dinilai tidak valid: E13 = 0 dan bendera F02. Parser tidak boleh berhenti atau menghitung kotak 1,1,1,1 sebagai valid. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 3 | Beberapa blok kontak dengan mutu berbeda (D16, D17: originator berisi data contoh, custodian valid) | USULAN yang perlu putusan ketua: E19 dan E20 memakai blok terbaik dari semua blok kontak; F06 menyala bila ada blok placeholder. Kodean D16 dan D17 memakai aturan ini (E19 = 1, E20 = 1). |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 4 | Kolom email berisi URL (D18, kontak pemeliharaan) | Bukan email valid dan tidak dihitung sebagai email institusional. Email resmi pada blok lain tetap membuat E20 = 1. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 5 | mdq:report berisi DQ\_ConformanceResult langsung, tanpa elemen kualitas (D16, D17) | Struktur tidak lazim. Parser mencatat laporan ada: E16 = 0 dan E17 = 0,5 (0,5 adalah penilaian manual dan wajib bisa di-override). |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 6 | Elemen spatialRepresentationInfo ada tetapi kosong (D01, D04, D05; GeoNode) | Elemen kosong dihitung tidak ada: E27 = 0. Jangan menganggap keberadaan tag sebagai terisi. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 7 | geometricObjectCount bernilai 0 (D07 dan ESRI D08) | Jumlah objek 0 dianggap tidak valid: E27 paling tinggi 0,5. Topologi atau tipe geometri yang ada tetap dihitung sebagai unsur. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 8 | hierarchyLevelName hanya berisi kata lingkup, atau kode lingkup featureType (D08-D12, D11) | Nama yang sama dengan kata lingkup ISO (dataset, series, featureType, service, dan sejenisnya) tidak spesifik: E28 = 0,5. Daftar kata harus bisa diedit. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 9 | featureCatalogueCitation berupa tautan halaman katalog fitur GeoNode (D01, D04, D05) | Bukan sitasi KUGI: E31 = 0, walaupun E12 menilai keberadaan katalog fitur. KUGI dikenali dari judul "Katalog Unsur Geografi Indonesia" atau singkatan KUGI. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 10 | Deskripsi tautan layanan berupa label, nama portal, atau judul dataset (D03, D10, D14, D18) | E32 = 0,5. Daftar label dan nama portal harus bisa diedit; deskripsi yang identik dengan judul dataset juga dihitung tidak menjelaskan layanan. Keputusan akhir ada pada override auditor. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 11 | ESRI XML (D08) dan JSON CKAN (D13, D14) | E27-E32 mengikuti padanan di Checklist kolom I dan J. Nilai D08, D13, D14 pada tabel adalah acuan jalur ESRI dan CKAN. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 12 | Tautan layanan ESRI FeatureServer atau MapServer (D10, D13) | Diperlakukan setara layanan fitur atau visual (WFS atau WMS) untuk E32, konsisten dengan pemeriksaan tautan E03. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| 13 | Pembungkus csw:GetRecordByIdResponse | Handover 29 Oktober menyebut D01, D04, D05 dibungkus CSW, tetapi berkas di paket data mentah sudah berakar MD\_Metadata. Uji pembungkus memakai berkas buatan di paket uji (D01\_dibungkus\_csw\_BUATAN.xml); jangan menulis pembungkus teruji pada data nyata. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

## Cek_Klaim_Naskah
| Klaim naskah dan handover dicocokkan dengan data spreadsheet | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 |
| --- | --- | --- | --- | --- |
| Kolom Nilai dari data adalah rumus yang membaca Sampel\_v2, Kodean, Skor, dan Bukti. Kolom Koreksi menuliskan angka per 29 Oktober 2026; bila kodean berubah, periksa ulang kolom Nilai sebelum menyalin angka ke naskah. |  |  |  |  |
| No | Klaim atau pertanyaan | Nilai dari data | Status | Koreksi atau saran |
| 1 | Rekaman XML ISO 19139 dari 15 sampel | 9 | Fakta | Naskah menulis 100%. Yang benar: 9 dari 15 rekaman adalah XML ISO 19139 (gmd); 1 ESRI XML; 2 JSON CKAN; 3 XML ISO 19115-3 (mdb). |
| 2 | Rekaman ESRI XML | 1 | Fakta | D08. Bukan ISO 19139. |
| 3 | Rekaman JSON CKAN | 2 | Fakta | D13 dan D14. Bukan XML spasial. |
| 4 | Rekaman yang memakai ISO 19115-3 (mdb) | 3 | Fakta | Sejak v5 ada tiga rekaman mdb (D16-D18). Klaim "tidak satu pun mdb" tidak lagi berlaku. Catatan: ketiganya belum divalidasi terhadap XSD dan memakai namespace mdb/2.0. |
| 5 | Sampel dari portal daerah | 8 | Benar | 8 portal daerah. |
| 6 | Sampel dari Portal KKP | 5 | Benar | 5 Portal KKP. |
| 7 | Sampel dari BIG | 2 | Benar | 2 BIG (SIBATNAS dan Satu Data BIG). |
| 8 | Dataset yang memiliki judul (E04 > 0) | 15 | Benar | Judul ada di semua sampel, tetapi 10 dari 15 bernilai 0,5 (generik atau tanpa lokasi). |
| 9 | Dataset tanpa abstrak (E07 = 0) | 1 | Sebagian benar | Klaim "seluruh dataset mencantumkan identifikasi dasar" tidak tepat: 1 dataset (D08) tidak punya abstrak. Tulis: semua punya judul; 1 tanpa abstrak dan 7 abstrak generik. |
| 10 | Dataset dengan abstrak generik (E07 = 0,5) | 7 | Fakta | Lihat baris sebelumnya. |
| 11 | Dataset yang menyebut SRGI secara eksplisit (E15 = 1) | 0 | Belum ada bukti | Klaim "100% belum SRGI" hanya didukung bukti tercatat pada 5 dataset (baris berikut). Lengkapi bukti E15 untuk dataset lain sebelum mengutip. SRGI bukan kewajiban dari Peraturan BIG 3/2023; kutip regulasi SRGI yang benar. |
| 12 | Baris bukti E15 di sheet Bukti | 5 | Fakta | Dari 15 dataset. |
| 13 | Dataset tanpa laporan akurasi posisi (E16 = 0) | 13 | Benar | Ketelitian memang paling jarang terdokumentasi. |
| 14 | Dataset tanpa laporan kualitas lain (E17 = 0) | 8 | Benar | Lihat baris sebelumnya. |
| 15 | Dataset tanpa pernyataan lineage (E24 = 0) | 5 | Sebagian benar | Klaim "lineage paling sering tidak terdokumentasi" kurang tepat: pernyataan lineage ada di sebagian besar sampel. |
| 16 | Dataset tanpa langkah pemrosesan (E26 = 0) | 11 | Benar | Yang sering hilang adalah langkah pemrosesan (E26), bukan pernyataan lineage (E24). |
| 17 | Batas penyesuaian Pasal 6 (2 tahun sejak 26 Mei 2023) | 2025-05-26 | Fakta | Peraturan BIG 3/2023 Pasal 6. Dasar yang tepat untuk menyebut kesenjangan regulasi pada rekaman ISO 19139. |
| 18 | Rata-rata MQI biner (gaya paper) | 63.864734 | Perlu diungkapkan | Bandingkan tiga baris ini sebelum menulis "skor turun drastis". |
| 19 | Rata-rata MQI diperluas (3 tingkat) | 49.565217 | Perlu diungkapkan | Selisih dengan baris di atas berasal dari aturan penilaian KOMPAS, bukan hanya dari data. |
| 20 | Rata-rata MQI ketat (hanya nilai 1) | 35.2657 | Perlu diungkapkan | Bila aturan ketat (E02, E15, E16, E17) ditetapkan atau diperketat setelah melihat hasil, naskah harus mengatakannya dan melaporkan kedua skema. |
| 21 | Elemen paling sering kosong, urutan 1 | 14 | Fakta | E30 Skema Aplikasi (Application Schema) |
| 22 | Elemen paling sering kosong, urutan 2 | 13 | Fakta | E16 Akurasi posisi |
| 23 | Elemen paling sering kosong, urutan 3 | 12 | Fakta | E14 Cakupan temporal |
| 24 | Elemen paling sering kosong, urutan 4 | 12 | Fakta | E29 Katalog Simbol (Portrayal Catalogue) |
| 25 | Elemen paling sering kosong, urutan 5 | 12 | Fakta | E31 Kepatuhan KUGI |
| 26 | Dataset dengan skema aplikasi (E30 > 0) | 1 | Fakta | Skema aplikasi hampir tidak pernah dicantumkan; hanya D18 (NTB), dan itu skema RBI umum. |
| 27 | Dataset dengan katalog simbol (E29 > 0) | 3 | Fakta | Katalog simbol dicantumkan oleh D07, D09, dan D18; hanya D09 dan D18 yang menyitasi dokumen aturan. |
| 28 | Dataset dengan kepatuhan KUGI (E31 = 1) | 3 | Fakta | Kepatuhan KUGI dengan complianceCode true dan sitasi KUGI: D09, D10, dan D18. |
| 29 | Rata-rata Skor A inti (E01-E26) | 50.277778 | Perlu diungkapkan | Pembanding. Angka yang dipakai naskah harus menyebut apakah memakai 26 atau 32 elemen. |
| 30 | Rata-rata Skor A (E01-E32) | 48.516667 | Perlu diungkapkan | Memasukkan E27-E32 menggeser rata-rata dari 50.3 menjadi 48.6 pada sampel yang sama; perubahan ini berasal dari definisi instrumen, bukan dari data baru. |
| 31 | Skor utama memakai 32 elemen (E01-E32) | 32 | Putusan Ketua | Diputuskan Ketua 31 Okt 2026. Alasan yang disampaikan: mengikuti jumlah elemen standar. Karena E27-E32 ditambahkan setelah hasil 26 elemen terlihat, laporkan skor 32 dan skor inti 26 berdampingan, dan tulis alasannya di Bab 3. |
| 32 | Klaim "Perka BIG 3/2023 mewajibkan 43 elemen metadata" |  | Belum terverifikasi | Kutipan teks Perka yang terbaca hanya memuat daftar lima SNI wajib (Pasal 2); jumlah elemen tidak ditemukan. Cari angka 43 di SNI 8843-1:2019 atau SE Kepala BIG 6/2021 dan sitir sumbernya, bukan Perka. |

## Arsip_Sampel_Diganti
| Arsip: dataset yang diganti pada v5 (nilai statis, tangkapan 29 Oktober 2026) | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D02, D06, dan D15 dikeluarkan dari sampel dan diganti D16, D17, D18. Seluruh kodean, penanda, dan bukti disimpan di sini agar penggantian bisa dibatalkan. Angka di sheet ini bukan rumus. |  |  |  |  |  |  |  |  |
| ID | Judul | Kelompok | Portal | Pengodean | Standar isi | Skor A | MQI biner | MQI diperluas |
| D02 | Peta Zonasi Kawasan Konservasi (KKPSIAK) Bengkalis Meranti, Riau | Portal daerah | Geoportal Provinsi Riau | XML ISO 19139 | ISO 19139 (disebut sebagai standar) | 48.5 | 72.4 | 53.4 |
| D06 | Garis Pantai Kab. Tangerang (GARIS\_PANTAI\_LN) | Portal daerah | Geomaps Kab. Tangerang (GeoNode, pycsw 3.0-dev) | XML ISO 19139 (CSW) | ISO 19115:2003 | 45.6 | 62.1 | 55.2 |
| D15 | Pelampung Suar (PELAMPUNGSUAR\_PT\_50K) | Portal daerah | SIG Provinsi Aceh (GeoNode, pycsw 2.6.1) | XML ISO 19139 (CSW) | ISO 19115:2003 | 55.2 | 75.9 | 62.9 |
| Kodean dan penanda teks templat (P) per elemen |  |  |  |  |  |  |  |  |
| ID | Elemen | D02 nilai | D06 nilai | D15 nilai | D02 P | D06 P | D15 P |  |
| E01 | Bahasa metadata | 1 | 1 | 1 | 0 | 0 | 0 |  |
| E02 | Nama dan versi standar | 0.5 | 0.5 | 0.5 | 0 | 0 | 0 |  |
| E03 | Tautan akses data | 1 | 1 | 1 | 0 | 0 | 0 |  |
| E04 | Judul informatif | 0.5 | 0.5 | 0.5 | 0 | 0 | 0 |  |
| E05 | Tanggal sitasi | 1 | 1 | 1 | 0 | 0 | 0 |  |
| E06 | Identifier unik | 1 | 1 | 1 | 0 | 0 | 0 |  |
| E07 | Abstrak | 0.5 | 1 | 1 | 0 | 0 | 0 |  |
| E08 | Tujuan | 0.5 | 0 | 0 | 1 | 0 | 0 |  |
| E09 | Kata kunci | 0.5 | 0.5 | 1 | 0 | 0 | 0 |  |
| E10 | Kategori topik | 0.5 | 1 | 1 | 0 | 0 | 0 |  |
| E11 | Lisensi/batasan | 1 | 1 | 1 | 0 | 0 | 0 |  |
| E12 | Katalog fitur | 0 | 1 | 1 | 0 | 0 | 0 |  |
| E13 | Bounding box | 1 | 1 | 1 | 0 | 0 | 0 |  |
| E14 | Cakupan temporal | 0 | 0 | 0 | 0 | 0 | 0 |  |
| E15 | Sistem referensi | 0.5 | 0.5 | 0.5 | 0 | 0 | 0 |  |
| E16 | Akurasi posisi | 0 | 0 | 0 | 0 | 0 | 0 |  |
| E17 | Akurasi tematik | 0 | 0 | 0 | 0 | 0 | 0 |  |
| E18 | Skala/resolusi | 0.5 | 0 | 0.5 | 0 | 0 | 0 |  |
| E19 | Organisasi | 1 | 1 | 1 | 0 | 0 | 0 |  |
| E20 | Sarana kontak | 0.5 | 1 | 1 | 0 | 0 | 0 |  |
| E21 | Peran (role) | 1 | 1 | 1 | 0 | 0 | 0 |  |
| E22 | Tanggal metadata | 1 | 1 | 1 | 0 | 0 | 0 |  |
| E23 | Frekuensi pembaruan | 1 | 0 | 0 | 0 | 0 | 0 |  |
| E24 | Pernyataan lineage | 0.5 | 0 | 0.5 | 1 | 0 | 0 |  |
| E25 | Sumber data | 0 | 0 | 0.5 | 0 | 0 | 0 |  |
| E26 | Langkah proses | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Penanda F01-F14 (1 = ya) |  |  |  |  |  |  |  |  |
| Penanda | Nama | D02 | D06 | D15 |  |  |  |  |
| F01 | Teks templat, salinan, atau bawaan | 1 | 0 | 0 |  |  |  |  |
| F02 | Bounding box tidak konsisten atau tidak informatif | 0 | 0 | 0 |  |  |  |  |
| F03 | Jalur lokal atau nama host pada metadata | 0 | 0 | 0 |  |  |  |  |
| F04 | Bukan XML ISO (ESRI atau rekaman CKAN) | 0 | 0 | 0 |  |  |  |  |
| F05 | Bahasa tidak sesuai isi atau bukan kode ISO | 0 | 0 | 0 |  |  |  |  |
| F06 | Kontak kosong, placeholder, atau non-institusional | 1 | 0 | 1 |  |  |  |  |
| F07 | CRS tidak konsisten atau tidak valid | 0 | 1 | 0 |  |  |  |  |
| F08 | Tanggal tidak konsisten atau ambigu | 0 | 0 | 0 |  |  |  |  |
| F09 | Pernyataan kualitas kontradiktif atau templat | 0 | 0 | 0 |  |  |  |  |
| F10 | Teks rusak, terpotong, atau salah ketik | 0 | 1 | 1 |  |  |  |  |
| F11 | Elemen ganda atau struktur bermasalah | 0 | 0 | 0 |  |  |  |  |
| F12 | Lisensi bawaan GeoNode | 0 | 1 | 1 |  |  |  |  |
| F13 | Nama standar menyebut ISO 19139 | 1 | 0 | 0 |  |  |  |  |
| F14 | Penanda penolakan kurasi pada portal | 0 | 0 | 0 |  |  |  |  |
| Bukti yang pernah tercatat |  |  |  |  |  |  |  |  |
| ID | Elemen | Bukti |  |  |  |  |  |  |
| D02 | E02 | Nama standar 'ISO 19139 ... Implementation Specification' (spesifikasi implementasi XML) |  |  |  |  |  |  |
| D02 | E04 | Judul berupa kode berkas: KKPSIAKBENGKALISMERANTIRIAU\_AR\_2026\_50K |  |  |  |  |  |  |
| D02 | E05 | Tanggal pembuatan, publikasi, dan revisi identik (2026-07-10) |  |  |  |  |  |  |
| D02 | E07 | Abstrak berisi definisi umum terumbu karang, tidak menjelaskan dataset zonasi |  |  |  |  |  |  |
| D02 | E08 | Tujuan 'Dataset spasial untuk kebutuhan GIS' (templat; sama dengan D03) |  |  |  |  |  |  |
| D02 | E09 | Satu kata kunci: 'kkp' |  |  |  |  |  |  |
| D02 | E10 | geoscientificInformation untuk zonasi konservasi terumbu karang; perlu ditinjau (oceans atau environment lebih sesuai) |  |  |  |  |  |  |
| D02 | E12 | Tidak ditemukan pada rekaman. |  |  |  |  |  |  |
| D02 | E14 | Tidak ada temporalElement; tahun 2026 hanya pada judul |  |  |  |  |  |  |
| D02 | E16 | Tidak ditemukan pada rekaman. |  |  |  |  |  |  |
| D02 | E17 | Tidak ditemukan pada rekaman. |  |  |  |  |  |  |
| D02 | E18 | Skala 50K hanya pada judul atau kode |  |  |  |  |  |  |
| D02 | E20 | Email gmail (bukan email institusi); telepon tidak ada |  |  |  |  |  |  |
| D02 | E24 | Pernyataan lineage identik dengan abstrak (definisi terumbu karang) |  |  |  |  |  |  |
| D02 | E25 | Tidak ditemukan pada rekaman. |  |  |  |  |  |  |
| D02 | E26 | Tidak ditemukan pada rekaman. |  |  |  |  |  |  |
| D06 | E02 | Standar isi dinyatakan di rekaman: ISO 19115:2003 (standar lama; belum menyebut SNI 8843-1:2019, ISO 19115-1 atau ISO 19115-3). Sumber: Sampel\_v2 kolom G. |  |  |  |  |  |  |
| D06 | E04 | Judul berupa nama berkas: GARIS\_PANTAI\_LN |  |  |  |  |  |  |
| D06 | E08 | Tujuan nilReason=missing |  |  |  |  |  |  |
| D06 | E09 | Satu kata kunci tematik ('Pantai'); kata kunci 'sr' tidak bermakna |  |  |  |  |  |  |
| D06 | E11 | Lisensi bawaan GeoNode 'Public Domain (PD)' (rujukan copyright.gov); lisensi kedua kosong |  |  |  |  |  |  |
| D06 | E14 | Tidak ditemukan pada rekaman. |  |  |  |  |  |  |
| D06 | E15 | CRS metadata 4326, URL layanan EPSG:32748 (perlu dicek) |  |  |  |  |  |  |
| D06 | E16 | Tidak ditemukan pada rekaman. |  |  |  |  |  |  |
| D06 | E17 | Tidak ditemukan pada rekaman. |  |  |  |  |  |  |
| D06 | E18 | Tidak ditemukan pada rekaman. |  |  |  |  |  |  |
| D06 | E23 | Tidak ada |  |  |  |  |  |  |
| D06 | E24 | Lineage nilReason=missing |  |  |  |  |  |  |
| D06 | E25 | Tidak ditemukan pada rekaman. |  |  |  |  |  |  |
| D06 | E26 | Tidak ditemukan pada rekaman. |  |  |  |  |  |  |
| D15 | E02 | Standar isi dinyatakan di rekaman: ISO 19115:2003 (standar lama; belum menyebut SNI 8843-1:2019, ISO 19115-1 atau ISO 19115-3). Sumber: Sampel\_v2 kolom G. |  |  |  |  |  |  |
| D15 | E04 | Judul berupa kode: PELAMPUNGSUAR\_PT\_50K |  |  |  |  |  |  |
| D15 | E08 | Tujuan nilReason=missing |  |  |  |  |  |  |
| D15 | E11 | Lisensi bawaan GeoNode 'Public Domain (PD)' (rujukan copyright.gov) + 'Tidak ada batasan' |  |  |  |  |  |  |
| D15 | E14 | Tidak ditemukan pada rekaman. |  |  |  |  |  |  |
| D15 | E16 | Tidak ditemukan pada rekaman. |  |  |  |  |  |  |
| D15 | E17 | Tidak ditemukan pada rekaman. |  |  |  |  |  |  |
| D15 | E18 | Skala 50K hanya pada judul |  |  |  |  |  |  |
| D15 | E20 | Email resmi ada; telepon dan faks hanya '-'; alamat jalan berisi URL; jabatan 'Instansi Pemerintah' |  |  |  |  |  |  |
| D15 | E23 | Tidak ada |  |  |  |  |  |  |
| D15 | E24 | 'Diperoleh dari survei dan pengolahanan oleh Dinas Perhubungan Aceh': generik, tanpa metode atau waktu |  |  |  |  |  |  |
| D15 | E25 | Sumber disebut generik ('survei') |  |  |  |  |  |  |
| D15 | E26 | Metode tidak dijelaskan |  |  |  |  |  |  |
| E27-E32 untuk dataset yang diarsipkan (dikodekan dari XML mentah 31 Oktober 2026) |  |  |  |  |  |  |  |  |
| ID | Elemen | D02 | D06 | D15 |  |  |  |  |
| E27 | Representasi Spasial (Topologi & Geometri) | tidak dikodekan | 0 | 0 |  |  |  |  |
| E28 | Lingkup Metadata (Metadata Scope) | tidak dikodekan | 0.5 | 0.5 |  |  |  |  |
| E29 | Katalog Simbol (Portrayal Catalogue) | tidak dikodekan | 0 | 0 |  |  |  |  |
| E30 | Skema Aplikasi (Application Schema) | tidak dikodekan | 0 | 0 |  |  |  |  |
| E31 | Kepatuhan KUGI | tidak dikodekan | 0 | 0 |  |  |  |  |
| E32 | Metadata Layanan (Service) | tidak dikodekan | 1 | 1 |  |  |  |  |
| D02: paket data mentah hanya memuat berkas GeoJSON data (KKPSIAKBENGKALISMERANTIRIAU\_AR\_2026\_50K\_...geojson), tanpa XML metadata, sehingga E27-E32 tidak dapat dikodekan. D06 dan D15 berpola GeoNode: E27 kosong, E28 0,5, E29 sampai E31 nol, E32 1. |  |  |  |  |  |  |  |  |

## Paket_Penulis
| Paket angka untuk penulis (Bab 3 dan 4) | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 | Unnamed: 12 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Semua angka adalah rumus yang membaca sheet Skor, Kodean, dan Sensitivitas; jangan diketik ulang. Skor utama memakai 32 elemen; skor inti 26 elemen sebagai pembanding. Hasil adalah pola awal pada sampel kecil, bukan generalisasi. |  |  |  |  |  |  |  |  |  |  |  |  |
| A. Deskripsi sampel dan skor per dataset |  |  |  |  |  |  |  |  |  |  |  |  |
| ID | Dataset | Kelompok sumber | Format | Skor A (32 elemen) | MQI biner (32) | MQI diperluas (32) | Kategori MQI (diperluas, 32) | Skor A inti (26) | MQI biner inti (26) | Selisih Skor A (32 - 26) |  |  |
| D01 | Alur Migrasi Penyu (Kab. Kubu Raya) | Portal daerah | XML ISO 19139 (CSW) | 39.003968 | 60.869565 | 42.753623 | Poor | 41.559524 | 67.241379 | -2.555556 |  |  |
| D03 | Batas Kewenangan Pengelolaan Wilayah Laut Riau | Portal daerah | XML ISO 19139 | 47.551587 | 65.217391 | 49.275362 | Poor | 50.607143 | 72.413793 | -3.055556 |  |  |
| D04 | Alur Migrasi Biota Laut di Kab. Kotawaringin Timur | Portal daerah | XML ISO 19139 (CSW) | 40.5 | 52.173913 | 44.927536 | Poor | 43.5 | 56.896552 | -3 |  |  |
| D05 | Peta Jalur Penangkapan Ikan Provinsi Aceh | Portal daerah | XML ISO 19139 (CSW) | 50.234127 | 65.217391 | 55.072464 | Fair | 53.761905 | 72.413793 | -3.527778 |  |  |
| D07 | IGT Habitat Bentik Laut Dangkal Tahun 2025 Indonesia | Portal KKP | XML ISO 19139 (profil SNI) | 49.956349 | 69.565217 | 51.449275 | Fair | 52.678571 | 75.862069 | -2.722222 |  |  |
| D08 | Mangrove 2024 skala 1:25K (MANGROVE2024\_25K\_032/040) | Portal KKP | ESRI XML (.shp.xml) | 24.888889 | 37.681159 | 20.289855 | Very Poor | 24.666667 | 39.655172 | 0.222222 |  |  |
| D09 | Peta Terumbu Karang Indonesia 1:50.000 Tahun 2015 | Portal KKP | XML ISO 19139 | 75.126984 | 84.057971 | 73.913043 | Fair | 75.571429 | 87.931034 | -0.444444 |  |  |
| D10 | Benda Muatan Kapal Tenggelam (Potensi Sumber Daya Arkeologi Maritim) | Portal KKP | XML ISO 19139 | 56.297619 | 79.710145 | 63.768116 | Fair | 57.547619 | 81.034483 | -1.25 |  |  |
| D11 | Neraca Sumber Daya Laut Habitat Bentik KKPN Kepulauan Raja Ampat 1:50K | Portal KKP | XML ISO 19139 | 70.781746 | 78.26087 | 62.318841 | Fair | 72.47619 | 87.931034 | -1.694444 |  |  |
| D12 | Ambon\_100m (batimetri) | BIG | XML ISO 19139 (CSW) | 36.230159 | 57.971014 | 37.681159 | Poor | 37.202381 | 60.344828 | -0.972222 |  |  |
| D13 | Indeks Peta Lingkungan Pantai Indonesia (LPI) 1:25.000 | BIG | JSON CKAN package\_show | 42.198413 | 53.623188 | 42.753623 | Poor | 43.22619 | 58.62069 | -1.027778 |  |  |
| D14 | Kawasan Konservasi Pesisir dan Pulau-Pulau Kecil Kalimantan Barat | Portal daerah | JSON CKAN package\_show | 32.289683 | 42.028986 | 31.15942 | Poor | 33.595238 | 44.827586 | -1.305556 |  |  |
| D16 | Garis Pantai (Provinsi Banten) | Portal daerah | XML ISO 19115-3 (mdb) | 44.357143 | 59.42029 | 44.927536 | Poor | 46.857143 | 65.517241 | -2.5 |  |  |
| D17 | Batas Pengelolaan Laut (Provinsi Banten) | Portal daerah | XML ISO 19115-3 (mdb) | 44.357143 | 59.42029 | 44.927536 | Poor | 46.857143 | 65.517241 | -2.5 |  |  |
| D18 | Wilayah Perairan 12 Mil Provinsi NTB | Portal daerah | XML ISO 19115-3 (mdb) | 73.97619 | 92.753623 | 78.26087 | Good | 74.059524 | 91.37931 | -0.083333 |  |  |
|  | Rata-rata |  |  | 48.516667 | 63.864734 | 49.565217 |  | 50.277778 | 68.505747 | -1.761111 |  |  |
|  | Median |  |  | 44.357143 | 60.869565 | 44.927536 |  | 46.857143 | 67.241379 | -1.694444 |  |  |
|  | Minimum |  |  | 24.888889 | 37.681159 | 20.289855 |  | 24.666667 | 39.655172 | -3.527778 |  |  |
|  | Maksimum |  |  | 75.126984 | 92.753623 | 78.26087 |  | 75.571429 | 91.37931 | 0.222222 |  |  |
| B. Peta panas dataset x kategori (skor kategori, 0-100) |  |  |  |  |  |  |  |  |  |  |  |  |
| ID | Informasi umum | Identifikasi | Deskripsi | Cakupan | Ketelitian | Kontak | Meta-metadata | Pemrosesan |  |  |  |  |
| D01 | 65 | 78.571429 | 36.111111 | 35.714286 | 0 | 50 | 66.666667 | 33.333333 |  |  |  |  |
| D03 | 55 | 78.571429 | 36.111111 | 57.142857 | 12.5 | 100 | 100 | 16.666667 |  |  |  |  |
| D04 | 60 | 100 | 50 | 57.142857 | 0 | 14.285714 | 83.333333 | 16.666667 |  |  |  |  |
| D05 | 65 | 100 | 55.555556 | 57.142857 | 0 | 78.571429 | 66.666667 | 33.333333 |  |  |  |  |
| D07 | 40 | 85.714286 | 52.777778 | 28.571429 | 43.75 | 92.857143 | 83.333333 | 16.666667 |  |  |  |  |
| D08 | 20 | 35.714286 | 5.555556 | 14.285714 | 12.5 | 0 | 66.666667 | 50 |  |  |  |  |
| D09 | 45 | 71.428571 | 80.555556 | 85.714286 | 43.75 | 100 | 50 | 100 |  |  |  |  |
| D10 | 70 | 64.285714 | 75 | 57.142857 | 43.75 | 100 | 100 | 16.666667 |  |  |  |  |
| D11 | 45 | 78.571429 | 38.888889 | 50 | 62.5 | 78.571429 | 100 | 100 |  |  |  |  |
| D12 | 50 | 64.285714 | 19.444444 | 35.714286 | 12.5 | 92.857143 | 100 | 0 |  |  |  |  |
| D13 | 40 | 78.571429 | 30.555556 | 57.142857 | 12.5 | 92.857143 | 100 | 0 |  |  |  |  |
| D14 | 45 | 78.571429 | 11.111111 | 57.142857 | 0 | 35.714286 | 100 | 0 |  |  |  |  |
| D16 | 55 | 78.571429 | 25 | 57.142857 | 18.75 | 100 | 100 | 0 |  |  |  |  |
| D17 | 55 | 78.571429 | 25 | 57.142857 | 18.75 | 100 | 100 | 0 |  |  |  |  |
| D18 | 70 | 100 | 91.666667 | 14.285714 | 62.5 | 100 | 100 | 83.333333 |  |  |  |  |
| Rata-rata | 52 | 78.095238 | 42.222222 | 48.095238 | 22.916667 | 75.714286 | 87.777778 | 31.111111 |  |  |  |  |
| C. Frekuensi nilai per elemen (E01-E32) dan sepuluh elemen paling sering kosong |  |  |  |  |  |  |  |  |  |  |  |  |
| Elemen | Nama elemen | Kategori | Bobot | n nilai 1 | n nilai 0,5 | n nilai 0 | % belum penuh |  | Peringkat | Elemen | Nama elemen | n kosong (nilai 0) |
| E01 | Bahasa metadata | Informasi umum | 1 | 9 | 6 | 0 | 0.4 |  | 1 | E30 | Skema Aplikasi (Application Schema) | 14 |
| E02 | Nama dan versi standar | Informasi umum | 2 | 4 | 8 | 3 | 0.733333 |  | 2 | E16 | Akurasi posisi | 13 |
| E03 | Tautan akses data | Informasi umum | 2 | 6 | 5 | 4 | 0.6 |  | 3 | E14 | Cakupan temporal | 12 |
| E04 | Judul informatif | Identifikasi | 3 | 5 | 10 | 0 | 0.666667 |  | 4 | E29 | Katalog Simbol (Portrayal Catalogue) | 12 |
| E05 | Tanggal sitasi | Identifikasi | 2 | 13 | 1 | 1 | 0.133333 |  | 5 | E31 | Kepatuhan KUGI | 12 |
| E06 | Identifier unik | Identifikasi | 2 | 11 | 3 | 1 | 0.266667 |  | 6 | E26 | Langkah proses | 11 |
| E07 | Abstrak | Deskripsi | 3 | 7 | 7 | 1 | 0.533333 |  | 7 | E25 | Sumber data | 9 |
| E08 | Tujuan | Deskripsi | 2 | 6 | 2 | 7 | 0.6 |  | 8 | E17 | Akurasi tematik | 8 |
| E09 | Kata kunci | Deskripsi | 1 | 8 | 6 | 1 | 0.466667 |  | 9 | E27 | Representasi Spasial (Topologi & Geometri) | 8 |
| E10 | Kategori topik | Deskripsi | 1 | 10 | 1 | 4 | 0.333333 |  | 10 | E08 | Tujuan | 7 |
| E11 | Lisensi/batasan | Deskripsi | 3 | 3 | 7 | 5 | 0.8 |  |  |  |  |  |
| E12 | Katalog fitur | Deskripsi | 2 | 6 | 2 | 7 | 0.6 |  |  |  |  |  |
| E13 | Bounding box | Cakupan | 3 | 9 | 3 | 3 | 0.4 |  |  |  |  |  |
| E14 | Cakupan temporal | Cakupan | 2 | 1 | 2 | 12 | 0.933333 |  |  |  |  |  |
| E15 | Sistem referensi | Cakupan | 2 | 0 | 15 | 0 | 1 |  |  |  |  |  |
| E16 | Akurasi posisi | Ketelitian | 3 | 0 | 2 | 13 | 1 |  |  |  |  |  |
| E17 | Akurasi tematik | Ketelitian | 3 | 0 | 7 | 8 | 1 |  |  |  |  |  |
| E18 | Skala/resolusi | Ketelitian | 2 | 5 | 4 | 6 | 0.666667 |  |  |  |  |  |
| E19 | Organisasi | Kontak | 3 | 11 | 1 | 3 | 0.266667 |  |  |  |  |  |
| E20 | Sarana kontak | Kontak | 3 | 10 | 2 | 3 | 0.333333 |  |  |  |  |  |
| E21 | Peran (role) | Kontak | 1 | 10 | 4 | 1 | 0.333333 |  |  |  |  |  |
| E22 | Tanggal metadata | Meta-metadata | 2 | 14 | 1 | 0 | 0.066667 |  |  |  |  |  |
| E23 | Frekuensi pembaruan | Meta-metadata | 1 | 9 | 3 | 3 | 0.4 |  |  |  |  |  |
| E24 | Pernyataan lineage | Pemrosesan | 3 | 2 | 8 | 5 | 0.866667 |  |  |  |  |  |
| E25 | Sumber data | Pemrosesan | 3 | 3 | 3 | 9 | 0.8 |  |  |  |  |  |
| E26 | Langkah proses | Pemrosesan | 3 | 3 | 1 | 11 | 0.8 |  |  |  |  |  |
| E27 | Representasi Spasial (Topologi & Geometri) | Informasi umum | 2 | 3 | 4 | 8 | 0.8 |  |  |  |  |  |
| E28 | Lingkup Metadata (Metadata Scope) | Informasi umum | 1 | 1 | 14 | 0 | 0.933333 |  |  |  |  |  |
| E29 | Katalog Simbol (Portrayal Catalogue) | Deskripsi | 1 | 2 | 1 | 12 | 0.866667 |  |  |  |  |  |
| E30 | Skema Aplikasi (Application Schema) | Deskripsi | 2 | 1 | 0 | 14 | 0.933333 |  |  |  |  |  |
| E31 | Kepatuhan KUGI | Deskripsi | 3 | 3 | 0 | 12 | 0.8 |  |  |  |  |  |
| E32 | Metadata Layanan (Service) | Informasi umum | 2 | 4 | 7 | 4 | 0.733333 |  |  |  |  |  |
| D. Perbandingan per kelompok sumber (n kecil, deskriptif saja) |  |  |  |  |  |  |  |  |  |  |  |  |
| Kelompok | n | Skor A (32) | MQI biner (32) | MQI diperluas (32) | Skor A inti (26) |  |  |  |  |  |  |  |
| Portal daerah | 8 | 46.53373 | 62.137681 | 48.913043 | 48.849702 |  |  |  |  |  |  |  |
| Portal KKP | 5 | 55.410317 | 69.855072 | 54.347826 | 56.588095 |  |  |  |  |  |  |  |
| BIG | 2 | 39.214286 | 55.797101 | 40.217391 | 40.214286 |  |  |  |  |  |  |  |
| E. Uji sensitivitas (korelasi peringkat; lihat sheet Sensitivitas) |  |  |  |  |  |  |  |  |  |  |  |  |
| Perbandingan | Korelasi peringkat |  |  |  |  |  |  |  |  |  |  |  |
| A vs A (placeholder = 0) | 0.957139 |  |  |  |  |  |  |  |  |  |  |  |
| A vs B (bobot setara) | 0.989245 |  |  |  |  |  |  |  |  |  |  |  |
| A vs C (Ketelitian dan Pemrosesan x2) | 0.978489 |  |  |  |  |  |  |  |  |  |  |  |
| A vs MQI biner (sebanding paper) | 0.933891 |  |  |  |  |  |  |  |  |  |  |  |
| A vs MQI diperluas (tanpa bobot kategori) | 0.973855 |  |  |  |  |  |  |  |  |  |  |  |
| F. Contoh hitung Skor A (32 elemen) untuk D01 (mengisi placeholder rumus di Bab 2; contoh lama D01 = 41,56 tidak berlaku) |  |  |  |  |  |  |  |  |  |  |  |  |
| Kategori | Jumlah (bobot elemen x nilai) | Jumlah bobot elemen | Fraksi kategori | Bobot kategori | Kontribusi |  |  |  |  |  |  |  |
| Informasi umum | 6.5 | 10 | 0.65 | 5 | 3.25 |  |  |  |  |  |  |  |
| Identifikasi | 5.5 | 7 | 0.785714 | 15 | 11.785714 |  |  |  |  |  |  |  |
| Deskripsi | 6.5 | 18 | 0.361111 | 10 | 3.611111 |  |  |  |  |  |  |  |
| Cakupan | 2.5 | 7 | 0.357143 | 15 | 5.357143 |  |  |  |  |  |  |  |
| Ketelitian | 0 | 8 | 0 | 20 | 0 |  |  |  |  |  |  |  |
| Kontak | 3.5 | 7 | 0.5 | 10 | 5 |  |  |  |  |  |  |  |
| Meta-metadata | 2 | 3 | 0.666667 | 5 | 3.333333 |  |  |  |  |  |  |  |
| Pemrosesan | 3 | 9 | 0.333333 | 20 | 6.666667 |  |  |  |  |  |  |  |
| Skor A D01 (32 elemen) |  |  |  |  | 39.003968 |  |  |  |  |  |  |  |
| Cek terhadap Skor!L5 (harus 0) |  |  |  |  | 0 |  |  |  |  |  |  |  |

## Kesepakatan
| Verifikasi manusia: kesepakatan dua auditor | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 | Unnamed: 7 | Unnamed: 8 | Unnamed: 9 | Unnamed: 10 | Unnamed: 11 | Unnamed: 12 | Unnamed: 13 | Unnamed: 14 | Unnamed: 15 | Unnamed: 16 | Unnamed: 17 | Unnamed: 18 | Unnamed: 19 | Unnamed: 20 | Unnamed: 21 | Unnamed: 22 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dua anggota yang bukan pengumpul data mengodekan 5 dataset sendiri-sendiri memakai berkas Lembar\_Verifikasi\_Auditor.xlsx, tanpa melihat sheet Kodean. Ketua menyalin hasil keduanya ke kolom kuning di bawah. Kolom Kodean dan semua persentase terisi otomatis. Elemen yang tidak sepakat dicatat di tabel paling bawah beserta putusannya. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  | D01 |  |  |  | D07 |  |  |  | D09 |  |  |  | D12 |  |  |  | D18 |  |  |  |  |
| Elemen | Nama elemen | Auditor 1 | Auditor 2 | Kodean | Sepakat | Auditor 1 | Auditor 2 | Kodean | Sepakat | Auditor 1 | Auditor 2 | Kodean | Sepakat | Auditor 1 | Auditor 2 | Kodean | Sepakat | Auditor 1 | Auditor 2 | Kodean | Sepakat | % sepakat per elemen |
| E01 | Bahasa metadata (dan bahasa data bila ada) |  |  | 1 |  |  |  | 0.5 |  |  |  | 1 |  |  |  | 0.5 |  |  |  | 1 |  |  |
| E02 | Nama dan versi standar metadata |  |  | 0.5 |  |  |  | 1 |  |  |  | 0.5 |  |  |  | 0.5 |  |  |  | 1 |  |  |
| E03 | Tautan akses data atau layanan |  |  | 1 |  |  |  | 0 |  |  |  | 0 |  |  |  | 0.5 |  |  |  | 0.5 |  |  |
| E04 | Judul informatif |  |  | 0.5 |  |  |  | 1 |  |  |  | 1 |  |  |  | 0.5 |  |  |  | 1 |  |  |
| E05 | Tanggal sitasi dan jenis tanggal |  |  | 1 |  |  |  | 1 |  |  |  | 0 |  |  |  | 1 |  |  |  | 1 |  |  |
| E06 | Identifier unik |  |  | 1 |  |  |  | 0.5 |  |  |  | 1 |  |  |  | 0.5 |  |  |  | 1 |  |  |
| E07 | Abstrak |  |  | 0.5 |  |  |  | 1 |  |  |  | 1 |  |  |  | 0.5 |  |  |  | 1 |  |  |
| E08 | Tujuan (purpose) |  |  | 0 |  |  |  | 1 |  |  |  | 1 |  |  |  | 0.5 |  |  |  | 1 |  |  |
| E09 | Kata kunci |  |  | 0.5 |  |  |  | 0.5 |  |  |  | 1 |  |  |  | 1 |  |  |  | 1 |  |  |
| E10 | Kategori topik ISO |  |  | 1 |  |  |  | 1 |  |  |  | 1 |  |  |  | 0 |  |  |  | 1 |  |  |
| E11 | Lisensi atau batasan penggunaan |  |  | 0.5 |  |  |  | 0.5 |  |  |  | 0.5 |  |  |  | 0 |  |  |  | 0.5 |  |  |
| E12 | Deskripsi atribut atau katalog fitur |  |  | 1 |  |  |  | 0.5 |  |  |  | 1 |  |  |  | 0 |  |  |  | 1 |  |  |
| E13 | Bounding box |  |  | 0.5 |  |  |  | 0 |  |  |  | 1 |  |  |  | 0.5 |  |  |  | 0 |  |  |
| E14 | Cakupan temporal |  |  | 0 |  |  |  | 0.5 |  |  |  | 1 |  |  |  | 0 |  |  |  | 0 |  |  |
| E15 | Sistem referensi koordinat |  |  | 0.5 |  |  |  | 0.5 |  |  |  | 0.5 |  |  |  | 0.5 |  |  |  | 0.5 |  |  |
| E16 | Akurasi posisi |  |  | 0 |  |  |  | 0 |  |  |  | 0 |  |  |  | 0 |  |  |  | 0.5 |  |  |
| E17 | Akurasi tematik atau laporan kualitas lain |  |  | 0 |  |  |  | 0.5 |  |  |  | 0.5 |  |  |  | 0 |  |  |  | 0.5 |  |  |
| E18 | Skala atau resolusi |  |  | 0 |  |  |  | 1 |  |  |  | 1 |  |  |  | 0.5 |  |  |  | 1 |  |  |
| E19 | Organisasi penanggung jawab |  |  | 0 |  |  |  | 1 |  |  |  | 1 |  |  |  | 1 |  |  |  | 1 |  |  |
| E20 | Sarana kontak valid |  |  | 1 |  |  |  | 1 |  |  |  | 1 |  |  |  | 1 |  |  |  | 1 |  |  |
| E21 | Peran (role) |  |  | 0.5 |  |  |  | 0.5 |  |  |  | 1 |  |  |  | 0.5 |  |  |  | 1 |  |  |
| E22 | Tanggal metadata |  |  | 1 |  |  |  | 1 |  |  |  | 0.5 |  |  |  | 1 |  |  |  | 1 |  |  |
| E23 | Frekuensi pembaruan |  |  | 0 |  |  |  | 0.5 |  |  |  | 0.5 |  |  |  | 1 |  |  |  | 1 |  |  |
| E24 | Pernyataan lineage |  |  | 0.5 |  |  |  | 0.5 |  |  |  | 1 |  |  |  | 0 |  |  |  | 0.5 |  |  |
| E25 | Sumber data |  |  | 0.5 |  |  |  | 0 |  |  |  | 1 |  |  |  | 0 |  |  |  | 1 |  |  |
| E26 | Langkah atau metode pemrosesan |  |  | 0 |  |  |  | 0 |  |  |  | 1 |  |  |  | 0 |  |  |  | 1 |  |  |
| E27 | Representasi Spasial (Topologi & Geometri) |  |  | 0 |  |  |  | 0.5 |  |  |  | 1 |  |  |  | 0.5 |  |  |  | 0.5 |  |  |
| E28 | Lingkup Metadata (Metadata Scope) |  |  | 0.5 |  |  |  | 0.5 |  |  |  | 0.5 |  |  |  | 0.5 |  |  |  | 1 |  |  |
| E29 | Katalog Simbol (Portrayal Catalogue) |  |  | 0 |  |  |  | 0.5 |  |  |  | 1 |  |  |  | 0 |  |  |  | 1 |  |  |
| E30 | Skema Aplikasi (Application Schema) |  |  | 0 |  |  |  | 0 |  |  |  | 0 |  |  |  | 0 |  |  |  | 1 |  |  |
| E31 | Kepatuhan KUGI |  |  | 0 |  |  |  | 0 |  |  |  | 1 |  |  |  | 0 |  |  |  | 1 |  |  |
| E32 | Metadata Layanan (Service) |  |  | 1 |  |  |  | 0 |  |  |  | 0 |  |  |  | 0.5 |  |  |  | 0.5 |  |  |
|  | Kesepakatan Auditor 1 dan Auditor 2 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Auditor 1 terhadap Kodean |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Auditor 2 terhadap Kodean |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Rata-rata kesepakatan Auditor 1 dan 2 (5 dataset) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Panduan baca: di bawah 70% berarti aturan Checklist kurang jelas atau kodean perlu ditinjau; 70% sampai 85% wajar; di atas 85% baik. Angka ini patokan kasar, bukan standar baku. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Catatan ketidaksepakatan dan putusan |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Dataset | Elemen | Nilai Auditor 1 | Nilai Auditor 2 | Nilai Kodean | Putusan akhir | Alasan putusan |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

## Log_Koreksi
| Log koreksi v2 ke v3 (29 Oktober 2026) | Unnamed: 1 | Unnamed: 2 | Unnamed: 3 | Unnamed: 4 | Unnamed: 5 | Unnamed: 6 |
| --- | --- | --- | --- | --- | --- | --- |
| Status: Otomatis = kesalahan teknis yang sudah diperbaiki. Perlu persetujuan/putusan/verifikasi tim = perubahan atau temuan yang menyangkut aturan skor atau isi standar. Perubahan kodean hanya empat sel (E02 D07, D08, D13, D14); semua perubahan lain tidak mengubah nilai kodean. |  |  |  |  |  |  |
| ID | Jenis | Sheet | Sel atau area | Masalah | Perbaikan atau tindak lanjut | Status |
| K01 | Galat rumus | Kodean | E5:S30 | 118 sel angka (mis. 0.5) tersimpan sebagai teks. Rumus SUMPRODUCT di Skor dan Sensitivitas gagal (galat nilai) pada 559 sel; hanya kolom MQI biner (membandingkan >0) yang tampak jalan. | Semua sel dikonversi menjadi angka. | Otomatis |
| K02 | Galat rumus | Skor | D5 | Rumus skor Informasi umum untuk D01 hilang (sel kosong), padahal D02 sampai D15 ada. | Rumus ditambahkan dengan pola yang sama dengan baris lain. | Otomatis |
| K03 | Nilai statis | Kodean | T5:X30 | Kolom n = 1, n = 0,5, n = 0, % belum penuh, dan Rata-rata berupa nilai tetap (sebagian teks) dan tidak cocok dengan isi sel pada 10 elemen: E01, E03, E07, E08, E11, E12, E13, E18, E23, E25. README menyatakan semua skor dihitung dengan rumus. | Diganti rumus COUNTIF dan AVERAGE. | Otomatis |
| K04 | Nilai statis | Checklist | L5:L30 | Kolom Bobot selaras paper berupa nilai tetap untuk E01-E26 tetapi rumus untuk E27-E32. | Semua baris memakai =IF(K="",D,K). | Otomatis |
| K05 | Tampilan | Checklist, Kodean | seluruh tabel | Dua sheet ini kehilangan format (font Segoe UI, tanpa warna header, tanpa border, nilai kodean berwarna hitam), berbeda dari konvensi README (biru = masukan, hitam = rumus). | Format disamakan dengan sheet lain (Arial 10, header navy, border abu-abu, kodean biru). | Otomatis |
| K06 | Tampilan | Checklist, Kodean, Pemetaan\_MQI, Rujukan\_MQI, Sampel\_v2 | freeze panes | Titik pembekuan keliru (Checklist D21 membekukan 20 baris pertama sehingga tabel tidak bisa digulir di layar kecil; Pemetaan\_MQI C40; Rujukan\_MQI A19; Sampel\_v2 G9; Kodean G5 membekukan kolom D01 dan D02). | Dipindah ke bawah baris header (Checklist D5, Kodean E5, Pemetaan\_MQI C5, Rujukan\_MQI A5, Sampel\_v2 C5). | Otomatis |
| S01 | Kesesuaian standar | Checklist | E6 (aturan nilai 1 untuk E02) | ISO 19115-3 adalah skema XML dari ISO 19115-1 dan 19115-2, bukan model isi. Rekaman 19115-3 yang benar menyebut ISO 19115-1 sebagai standar (dan SNI 8843-1:2019 sebagai profil). | ISO 19115-1:2014 ditambahkan sebagai nama standar yang diterima. Tidak mengubah kodean mana pun karena tidak ada rekaman sampel yang menyebutnya. | Usulan, perlu putusan tim |
| S02-D07 | Kesesuaian aturan | Kodean | D07/E02 | Nilai 0.5 tidak cocok dengan aturan E02 di Checklist dan data Sampel\_v2. | Diubah menjadi 1. | Perlu persetujuan tim |
| S02-D08 | Kesesuaian aturan | Kodean | D08/E02 | Nilai 0.5 tidak cocok dengan aturan E02 di Checklist dan data Sampel\_v2. | Diubah menjadi 0. | Perlu persetujuan tim |
| S02-D13 | Kesesuaian aturan | Kodean | D13/E02 | Nilai 0.5 tidak cocok dengan aturan E02 di Checklist dan data Sampel\_v2. | Diubah menjadi 0. | Perlu persetujuan tim |
| S02-D14 | Kesesuaian aturan | Kodean | D14/E02 | Nilai 0.5 tidak cocok dengan aturan E02 di Checklist dan data Sampel\_v2. | Diubah menjadi 0. | Perlu persetujuan tim |
| S03 | Kelengkapan bukti | Bukti | baris tambahan (7 baris) | Nilai E02 di bawah 1 untuk D01, D04, D05, D06, D12, D15 tidak punya baris bukti (kebijakan sheet: dasar tiap nilai di bawah 1). D07 kini bernilai 1. | Bukti ditambahkan dari kolom Standar isi di Sampel\_v2; seluruh baris diurutkan ulang per dataset dan elemen. | Otomatis |
| S04 | Kesesuaian standar | Checklist | M5:M36 | Jalur mdb ditulis singkat dan beberapa tidak lengkap (mis. mri:extent/gex:EX\_GeographicBoundingBox tanpa EX\_Extent/geographicElement; mdq:DQ\_PositionalAccuracy dan DQ\_ThematicAccuracy adalah kelas abstrak). | Jalur dilengkapi sampai kelas konkret. Belum diverifikasi terhadap teks SNI ISO 19115-3:2021 atau ISO 19115-3:2023. | Perlu verifikasi XSD |
| S05 | Kesesuaian standar | Checklist | N5:N36 | Label "Elemen Baru (Hanya mdb)" untuk E27-E32 salah: kolom H sheet yang sama mencantumkan jalur gmd untuk keenamnya, jadi elemen itu sudah ada di ISO 19115:2003. Label "Wajib Migrasi" untuk E01-E23 terlalu umum. | Diganti tiga jenis perubahan: Ganti namespace, Struktur berubah, Pindah lokasi. Alasan per elemen di kolom O. Penilaian ini berasal dari pengetahuan struktur ISO 19115-1/-3, bukan dari teks standar; verifikasi pada XSD dan SNI. | Perlu verifikasi |
| S06 | Kesesuaian standar | Checklist | B36, M36, N36, O36 (E32) | Jalur mdb:distributionInfo salah untuk metadata layanan (srv:SV\_ServiceIdentification ada di identificationInfo). Kategori "Distribusi" tidak ada di sheet Bobot (8 kategori). | Jalur dikoreksi; kategori dipindah ke Informasi umum (sama dengan E03). | Perlu persetujuan tim |
| S07 | Rancangan | Checklist | E16 dan E17 | E17 (nilai 1 = minimal 2 dari 5 elemen SNI ISO 19157) menghitung akurasi posisi, padahal akurasi posisi sudah dinilai di E16. Daftar 5 elemen juga tampak tidak lengkap: setahu saya ISO 19157 memuat enam elemen kualitas (ditambah usability). | Tidak diubah. Verifikasi daftar elemen pada SNI ISO 19157:2015, lalu putuskan apakah E17 mengecualikan akurasi posisi. | Perlu putusan tim |
| S09 | Rancangan | Checklist | E12 dan E31 | Dua elemen menilai hal yang hampir sama (katalog fitur/KUGI di contentInfo). Bila keduanya masuk skor, katalog fitur terhitung dua kali. | Tidak diubah. E31 belum masuk skor. | Perlu putusan tim |
| S10 | Hukum | README | baris tambahan | Pasal 6 Perka BIG 3/2023: metadata berbasis SNI ISO 19115:2012, 19115-2:2012, dan ISO/TS 19139:2012 harus disesuaikan paling lama 2 tahun sejak diundangkan (26 Mei 2023), jadi batasnya 26 Mei 2025. Per 29 Oktober 2026 batas itu sudah lewat. Nilai 0,5 untuk standar lama di E02 adalah pembeda skor, bukan penilaian kepatuhan hukum. | Catatan ditambahkan di README dan Standar\_Rujukan. | Informasi |
| S11 | Rancangan | Penanda | F05 / Checklist E01 | Panduan v3 (bab 2 dan bab 15.12) mengarahkan mengetik "bahasa Indonesia" atau memakai default english. Ini kemungkinan penyebab bahasa teks bebas dan eng pada banyak rekaman sampel. Kode ISO 639-2 untuk Indonesia adalah ind. | Tidak ada perubahan skor. Catatan untuk bagian pembahasan. | Informasi |
| S12 | Rancangan | Checklist | E21 | Panduan v6: produsen = Originator. Panduan v3: produsen = Owner. Keduanya kode valid sehingga skor E21 tidak terpengaruh. | Tidak diubah. Pilih satu dan rujuk SNI 8843-1:2019. | Perlu putusan tim |
| S13 | Kelengkapan bukti | Bukti | E15 | Bukti E15 (nilai 0,5) hanya ada untuk D04, D06, D10 dari 15 dataset. Saya tidak punya XML mentah, jadi tidak mengarang bukti. Aturan nilai 1 (SRGI eksplisit) membuat seluruh sampel bernilai 0,5 sehingga E15 tidak membedakan dataset. | Tidak diubah. Lengkapi dari XML mentah dan putuskan apakah aturan SRGI dipertahankan. | Perlu putusan tim |
| S14 | Cakupan | Pemetaan\_MQI, Rujukan\_MQI | seluruh sheet | Dua sheet ini hanya memuat 26 elemen; E27-E32 belum dipetakan ke paper MQI. | Tidak diubah. Tambahkan bila E27-E32 dimasukkan ke skor. | Perlu putusan tim |
| S15 | Cakupan | Kodean, Placeholder, Skor | E27-E32 | Enam elemen tambahan belum dikodekan. Rumus skor sengaja tetap memakai baris 5 sampai 30 (E01-E26) sehingga hasil tetap sebanding dengan versi sebelumnya. | Tidak diubah. Tempel XML mentah bila ingin saya kodekan. | Perlu putusan tim |
| R2-01 | Verifikasi | Standar\_Rujukan, README, Log\_Koreksi | teks | Tiga rujukan di v3 diperiksa ulang ke dokumen sumber. Baris Kediri "10 dataset" benar (Gambar 5.1 sampai 5.10); bab 2 dan 15.12 panduan v3 benar. Tiga redaksi terlalu pasti: D12 sebagai raster (format belum dicek), SNI ISO 19115:2012 sebagai ISO 19115:2003 (belum dicek ke prakata), dan penulisan "hlm bab". | Redaksi diperhalus. Tidak ada angka yang berubah. | Otomatis |
| R2-02 | Tambahan | Acuan\_Uji\_Aplikasi, Cek\_Klaim\_Naskah, Kodean!Y | sheet baru dan kolom bantu | Handover aplikasi tidak memuat nilai acuan, aturan kategori, maupun kriteria uji parser, dan naskah belum dicocokkan dengan data. | Dua sheet rumus ditambahkan; Kodean kolom Y dipakai sebagai kunci urut elemen paling sering kosong. | Otomatis |
| R2-03 | Rancangan | Checklist | E27-E32 | Handover menyatakan E27-E32 "hanya untuk mdb" dan mengisi N/A untuk gmd. Keenam elemen punya padanan gmd (Checklist kolom H), dan semua sampel gmd/ESRI/CKAN sehingga skor ekstensi akan N/A untuk 15 dari 15 dataset. Diperbarui v5: kini ada tiga sampel mdb (D16-D18), tetapi usulan tetap berlaku karena keenam elemen juga ada pada gmd. | Usulan: nilai E27-E32 pada semua rekaman XML ISO (gmd maupun mdb), N/A hanya untuk ESRI dan CKAN, dan laporkan Status\_Skema terpisah sebagai indikator migrasi. Catatan ditambahkan di Checklist kolom O. | Perlu putusan ketua |
| R2-04 | Standar | Checklist | M32 dan O32 (E28) | Addendum handover menulis jalur E28 sebagai mdb:metadataScope/mcc:MD\_Scope. Kelas yang kemungkinan benar adalah mdb:MD\_MetadataScope (resourceScope + name). mcc:MD\_Scope dipakai pada cakupan kualitas dan pemeliharaan. | Checklist v3/v4 tetap memakai MD\_MetadataScope. Verifikasi pada XSD. | Perlu verifikasi XSD |
| R2-05 | Rancangan | Checklist | B kolom E28-E32 | Kategori di addendum (E28-E30 Identifikasi, E32 Distribusi) berbeda dari Checklist (E28 dan E32 Informasi umum, E29-E31 Deskripsi). "Distribusi" tidak ada di delapan kategori, dan panduan Rencana Kerja menaruh level hierarki di Informasi umum. | Checklist tidak diubah. Karena skor ekstensi dihitung terpisah, kategori tidak memengaruhi skor selama putusan R2-03 dipakai. | Perlu putusan ketua |
| R2-06 | Metode | Skor, Cek\_Klaim\_Naskah | MQI ketat dan aturan E02, E15, E16, E17 | Naskah dan catatan penulis menyebut "Skenario B (penilaian ketat)" dipilih sehingga skor "turun drastis". Rencana Kerja melarang mengubah bobot atau aturan setelah melihat hasil. Spreadsheet tidak memuat riwayat kapan aturan ketat ditetapkan. | Cek\_Klaim\_Naskah menampilkan tiga rata-rata (biner, diperluas, ketat) agar dampak aturan terlihat. Naskah harus menyatakan kapan aturan ditetapkan dan melaporkan kedua skema. | Perlu keterbukaan di naskah |
| R2-07 | Jadwal | README | tenggat | Guidebook memuat "Pengumuman full paper 25 Oktober - 2 November" dan penilaian mulai 3 November, sedangkan Rencana Kerja berasumsi tenggat Jumat 30 Oktober. Handover menyebut kerja pada "Senin" dan "Selasa". Tenggat unggah sebenarnya tidak tertulis jelas. | Tidak ada perubahan sheet. Konfirmasi tanggal dan format ke panitia hari ini. Guidebook: karya yang sudah diunggah tidak dapat direvisi. | Perlu konfirmasi panitia |
| R3-01 | Sampel | Sampel\_v2, Kodean, Placeholder, Penanda, Skor, Bukti | D02, D06, D15 diganti D16, D17, D18 | Tiga rekaman mdb baru menggantikan tiga dataset portal daerah. D02 dipilih oleh Hilmi. D06 (garis pantai Tangerang) dipilih karena tema dan wilayahnya sama dengan D16 (garis pantai Banten). D15 dipilih karena Aceh punya dua dataset dari portal dan tanggal yang sama (D05 dan D15), dan D15 yang dikumpulkan lebih akhir. Ketiganya portal daerah sehingga komposisi 8 portal daerah, 5 KKP, 2 BIG tidak berubah. | Kriteria penggantian tidak memakai skor. Seluruh data lama disimpan di Arsip\_Sampel\_Diganti. Alternatif yang saya pertimbangkan: mengganti D03 (Riau) alih-alih D15, karena batas wilayah laut kini ada tiga (D03, D17, D18, yaitu 20% sampel). Naskah harus mencantumkan bahwa sampel diganti dan alasannya. | Perlu persetujuan tim |
| R3-02 | Kodean | Kodean | D16-D18, E01-E26 dan E27-E32 | Tiga sampel baru dikodekan memakai aturan Checklist apa adanya. Keputusan yang bisa diperdebatkan: E02 = 1 untuk "ISO 19115-3:2018" (aturan menerima nama beserta versi); E03 = 0,5 untuk WMS dan WCS; E17 = 0,5 untuk D16/D17 (satu laporan tanpa elemen kualitas); E25 dan E26 = 1 untuk D18 menurut teks tertulis walau tampak salinan templat; E32 = 1 untuk D18 menurut teks aturan walau tumpang tindih dengan E03; E27 = 0,5 untuk D18 (dua dari tiga unsur). | Dasar tiap nilai ada di sheet Bukti. Tim boleh mengubah, tetapi ubah di Kodean dan jangan di hasil. | Perlu verifikasi tim |
| R3-03 | Rancangan sampel | Kodean | D16 dan D17 | D16 dan D17 berasal dari portal dan generator yang sama, dan nilai keduanya identik pada seluruh 26 elemen (hanya judul, topik, dan bounding box yang berbeda). Dua titik data ini tidak bebas satu sama lain. | Tidak diubah. Sebut di keterbatasan naskah: sampel efektif lebih kecil dari 15 bila rekaman satu generator dihitung satu. Pertimbangkan mengganti salah satunya dengan dataset dari portal lain. | Perlu putusan tim |
| R3-04 | Standar | Standar\_Rujukan, Checklist | versi skema ketiga berkas | Ketiganya memakai namespace mdb/2.0, cit/2.0, mrl/2.0, dan (D18) mrc/2.0 serta msr/2.0, dengan mdq 19157-2. Situs ISO/TC 211 memisahkan paket ISO 19115-3 versi 1.0 dan 2.0 dan menandai mdb 2.0 sebagai "historical". SNI ISO 19115-3:2021 terbit sebelum edisi 2023 dan kemungkinan mengacu ke versi 1.0 (belum saya periksa). Berkas D16 menulis "ISO 19115-3:2018", yang bukan edisi terbitan yang saya ketahui. | Saya tidak dapat memvalidasi XSD di sini (tanpa jaringan). Jalankan validasi dengan xmllint terhadap XSD ISO/TC 211, misalnya xmllint --noout --schema https://schemas.isotc211.org/19115/-3/mdt/2.0/mdt.xsd Perairan\_NTB.xml, dan laporkan hasilnya. Jangan menulis di naskah bahwa sampel "sesuai SNI ISO 19115-3:2021" sebelum divalidasi. | Perlu validasi XSD |
| R3-05 | Standar | Checklist | kolom P (baru) | Jalur mdb di kolom M sebelumnya belum teruji pada data nyata. | Kolom P mencatat jalur yang teramati pada tiga berkas. Semua jalur utama teramati, termasuk MD\_MetadataScope pada E28 (bukan mcc:MD\_Scope seperti di addendum handover). E14 dan E32 belum teramati. Teramati bukan berarti valid terhadap XSD. | Otomatis |
| R3-06 | Skor | Skor, Kodean, Acuan\_Uji\_Aplikasi | Skor ekstensi E27-E32 | E27-E32 belum punya skor. | Kodean baris 32-37 menampung keenam elemen (kuning = belum dikodekan). Skor!Z menghitung Skor ekstensi berbobot hanya bila keenam elemen terkodekan, selain itu N/A. Skor ekstensi tidak masuk Skor A maupun MQI. Saat ini hanya D16-D18 yang terkodekan; dua belas dataset lain butuh XML mentahnya. Diperbarui v6: keenam elemen kini dikodekan untuk 15 dataset dan masuk skor (lihat R4-01). | Otomatis |
| R4-01 | Skor | Kodean, Skor, Placeholder, Bukti, Acuan\_Uji\_Aplikasi | E27-E32 untuk 15 dataset; skor 32 elemen | E27-E32 dikodekan dari paket data mentah (XML ISO 19139 dan ISO 19115-3; D08 ESRI XML dan D13-D14 JSON CKAN dibaca lewat padanannya) dan dimasukkan ke Skor A, Skor B, Skor C, MQI biner, MQI diperluas, dan MQI ketat. Rata-rata sampel: Skor A 50.3 (26 elemen) menjadi 48.6 (32 elemen); MQI biner 68.5 menjadi 63.9; MQI diperluas 53.6 menjadi 49.9. | Skor inti 26 elemen tetap dihitung (Skor!AA sampai AE) karena paper MQI tidak memuat E27-E32. Kategori E27, E28, E32 = Informasi umum; E29, E30, E31 = Deskripsi, sesuai Checklist. Perubahan skor berasal dari instrumen, bukan dari dataset; naskah harus menyebutnya. Putusan Ketua 31 Okt 2026: skor utama 32 elemen. Alasan yang disampaikan (mengikuti jumlah elemen standar menurut Perka BIG 3/2023, 43 elemen) belum terverifikasi: lihat R5-01. | Diputuskan Ketua; alasan perlu verifikasi |
| R4-02 | Kodean | Kodean, Bukti | E32 (metadata layanan) | Aturan E32 menyebut tautan layanan dan deskripsi, tetapi tidak memerinci. Rekaman GeoNode memberi protokol OGC:WMS dan OGC:WFS dengan deskripsi "geonode Service - Provides Layer ...", sedangkan tautan unduhnya berprotokol "WWW:DOWNLOAD" untuk URL layanan. | Tafsir seragam diputuskan 31 Okt 2026 (Ketua menyerahkan pada usulan Claude): 1 bila ada tautan layanan dengan deskripsi yang menjelaskan layanan atau layer; 0,5 bila hanya tautan, atau deskripsi berupa label jenis/format, nama portal, atau pengulangan judul; 0 bila tidak ada tautan. Dampak: E32 D03, D10, D18 dari 1 menjadi 0,5. Rinci di R5-02. | Diputuskan (dapat diubah tim) |
| R4-03 | Kodean | Kodean, Bukti | E28 (lingkup metadata) | Tidak satu pun dataset lama punya nama lingkup yang spesifik: hierarchyLevelName kosong, nilReason=missing, atau hanya mengulang kata "dataset". D11 berkode featureType tetapi bernama "dataset". | Semua dataset lama dikodekan 0,5 (kode ada, nama tidak spesifik). Hanya D18 yang bernilai 1. | Fakta |
| R4-04 | Kodean | Kodean, Bukti | E27 pada D07, D08 (jumlah objek 0) | D07 dan D08 menyebut topologi dan geometri tetapi geometricObjectCount bernilai 0, nilai bawaan perangkat lunak yang tidak valid. | Dikodekan 0,5 (tiga unsur ada, satu tidak valid), sama dengan D18 yang tidak punya jumlah objek. | Perlu verifikasi tim |
| R4-05 | Cakupan | Arsip\_Sampel\_Diganti | D02 | Paket data mentah memuat GeoJSON data untuk D02, bukan XML metadata, sehingga E27-E32 D02 tidak dapat dikodekan. D02 sudah diarsipkan dan tidak ada di sampel. | D06 dan D15 (arsip) dikodekan; D02 ditandai "tidak dikodekan". | Fakta |
| R4-06 | Rancangan | Skor, Cek\_Klaim\_Naskah | dominasi E27-E32 pada daftar elemen kosong | E29 dan E30 kosong pada hampir semua sampel; setelah E27-E32 masuk, keduanya muncul di daftar elemen paling sering kosong. Itu temuan nyata tetapi juga akibat instrumen: portrayal dan skema aplikasi bukan elemen yang diwajibkan pada SNI 8843-1:2019 menurut yang saya ketahui (belum diperiksa karena dokumennya belum ada). | Jangan menyebut kedua elemen itu "kekurangan wajib" di naskah sebelum SNI 8843-1:2019 dibaca. | Perlu verifikasi SNI 8843-1 |
| R5-01 | Keputusan | Skor, README, Cek\_Klaim\_Naskah | skor utama 32 elemen | Ketua memutuskan skor utama memakai 32 elemen dengan alasan mengikuti jumlah elemen standar menurut Perka BIG 3/2023 (disebut 43 elemen; 32 dipilih karena hanya itu yang tersedia). Pemeriksaan: kutipan teks Perka yang terbaca hanya mendaftar lima SNI wajib (Pasal 2), tanpa jumlah elemen. Sumber angka 43 belum ditemukan (kandidat: SNI 8843-1:2019, SE Kepala BIG 6/2021). Risiko metodologis: E27-E32 ditambahkan sesudah hasil 26 elemen terlihat, sedangkan aturan README melarang mengubah instrumen setelah melihat hasil. | Naskah melaporkan 32 dan 26 elemen berdampingan, menyebut alasan pemilihan dan bahwa E27-E32 ditambahkan sesudah hasil 26 elemen terlihat, dan tidak menulis "Perka mewajibkan 43 elemen" sebelum angka itu ditemukan di dokumen sumbernya. | Diputuskan Ketua; alasan perlu verifikasi |
| R5-02 | Aturan | Kodean, Bukti, Checklist kolom Q | E32 D03, D10, D18 | Kodean E32 tidak seragam: D14 (deskripsi label "RAW", "ImageWMS") dinilai 0,5, tetapi D03 (label "OGC WMS Service"), D10 (nama portal), dan D18 (mengulang judul) dinilai 1. | Tafsir seragam diputuskan 31 Okt 2026 (Ketua menyerahkan pada usulan Claude): 1 bila ada tautan layanan dengan deskripsi yang menjelaskan layanan atau layer; 0,5 bila hanya tautan, atau deskripsi berupa label jenis/format, nama portal, atau pengulangan judul dataset; 0 bila tidak ada tautan. Ditulis di Checklist kolom Q. Dampak: E32 D03, D10, D18 dari 1 menjadi 0,5. Skor A turun 0,5 poin pada masing-masing (D03 48,1 menjadi 47,6; D10 56,8 menjadi 56,3; D18 74,5 menjadi 74,0); rata-rata Skor A 48,6 menjadi 48,5; rata-rata MQI diperluas 49,9 menjadi 49,6; MQI biner tidak berubah (0,5 tetap lebih dari 0). Satu kategori bergeser: D03 pada MQI diperluas dari Fair ke Poor (49,3 terhadap ambang 50), jadi hasil D03 adalah kasus batas. | Diputuskan (dapat diubah tim) |
| R5-03 | Aturan | Checklist kolom I dan J | padanan ESRI dan CKAN untuk E27-E32 | Kolom padanan ESRI dan CKAN untuk E27-E32 kosong, tetapi D08, D13, D14 sudah dikodekan; jalurnya tidak terdokumentasi sehingga uji U3 tidak dapat diimplementasikan. Alternatif N/A ditimbang: dampak angka kecil, tetapi Ketua memilih mengisi. | Jalur ditulis di Checklist kolom I (ESRI) dan J (CKAN): E27 dan E28 punya padanan ESRI (spatRepInfo, mdHrLv), E28 dan E32 punya padanan CKAN (extras resource-type, resources[]), sisanya tidak punya padanan sehingga bernilai 0. Nilai Kodean D08, D13, D14 tidak berubah. | Selesai |
| R5-04 | Konsistensi | Placeholder, Penanda, Verifikasi | D18 E17, E25, E26; F10 D16, D17; F09 D18 | Bukti D18 dan Verifikasi V29 menyebut lineage dan laporan kualitas D18 tampak salinan templat RBI, tetapi hanya E24 yang ditandai templat dan F09 belum menyala. F10 belum menyala untuk D16 dan D17 padahal nama kontak memuat "<ContactPerson>" literal dan format PNG berversi "2023-2043". | Placeholder D18 E17, E25, E26 = 1; Penanda F09 D18 = 1; F10 D16 dan D17 = 1; dasar di Verifikasi V30 dan V31. Kodean tidak berubah; hanya Sensitivitas dan Penanda (di luar skor) yang bergeser. Tim boleh membatalkan bila menilai teks itu sah. | Perlu persetujuan tim |
| R5-05 | Teks basi | README, Skor, Acuan\_Uji\_Aplikasi, Rujukan\_MQI, Pemetaan\_MQI, Standar\_Rujukan, Sampel\_v2 | README B5, B7, B21; Skor A1; Acuan A1, C24, C31, C35; Rujukan\_MQI D6; Pemetaan\_MQI A1, A3; Standar\_Rujukan bagian D; Sampel\_v2 kolom O | Teks masih menyebut "26 elemen", "D01 sampai D15", E27-E32 "belum dikodekan dan belum masuk skor", dan skor utama "belum diputuskan". Verifikasi skema ISO belum tercatat di Standar\_Rujukan. Nama berkas mentah belum diisi. | Semua diperbarui. Standar\_Rujukan bagian D mencatat hasil verifikasi skema dan klaim 43 elemen. Kolom URL sumber D16-D18 dan URL CSW atau API tetap diisi tim. | Selesai |
| R5-06 | Tambahan | Paket\_Penulis, Kesepakatan, Acuan\_Uji\_Aplikasi | sheet baru dan U5 | Penulis dan tim aplikasi perlu bahan siap pakai; verifikasi manusia (README B6) belum punya alat. | Paket\_Penulis: tabel sampel dan skor (32 dan 26 elemen), peta panas, frekuensi elemen dan sepuluh elemen paling sering kosong, perbandingan sumber, sensitivitas, contoh hitung D01. Kesepakatan: kolom isian dua auditor, persentase kesepakatan, catatan putusan. Acuan\_Uji\_Aplikasi: uji U5 dan 13 kasus khusus. | Selesai |
| R5-07 | Terbuka | Kesepakatan, Standar\_Rujukan, Sampel\_v2 | pekerjaan yang masih menunggu manusia | Belum dilakukan: kodean independen oleh dua anggota (5 dataset); validasi XSD tiga berkas mdb; membaca SNI 8843-1:2019 (E29 dan E30 belum boleh disebut kekurangan wajib); cek Pasal 6 Perka BIG 3/2023; berkas asli D01, D04, D05 berbungkus CSW; URL sumber D16-D18. | Lihat panduan di chat dan handover. Angka dibekukan setelah verifikasi manusia selesai. | Terbuka |