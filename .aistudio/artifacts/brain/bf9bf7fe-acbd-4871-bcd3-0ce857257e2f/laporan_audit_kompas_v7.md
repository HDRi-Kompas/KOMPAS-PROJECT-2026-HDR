# LAPORAN IMPLEMENTASI & AUDIT METADATA KOMPAS (VERSI V7)

**Aplikasi:** KOMPAS — Marine Metadata Quality Index (MQI) Audit Platform  
**Versi Aturan:** `v7-2026-10-31`  
**Institusi / Pengembang:** Hilmi Najwan Ardhani, Dimas Rizky, Tri Untung — Universitas Diponegoro (Diponegoro University)  
**Landasan Teoretis & Metodologis:** 
- K. M. D. Hasara & K. A. N. C. Karunanayaka (2026), *Metadata Quality Index for Marine Spatial Data Infrastructures*, Sabaragamuwa University of Sri Lanka.
- Standar SNI ISO 19115:2012 / ISO 19115-1:2014 & ISO 19115-3:2016.
- Peraturan Badan Informasi Geospasial (BIG) No. 3 Tahun 2023.

---

## 1. Ringkasan Eksekutif & Siklus Audit v7

KOMPAS v7 dibangun sebagai instrumen audit kualitas metadata geospasial kelautan yang objektif, deterministik, dan dapat dikonfigurasi secara dinamis tanpa mengandalkan konstanta nilai yang dikarang (*no fabricated defaults*).

Aplikasi mengaudit metadata dari berbagai sumber (Portal Daerah, Portal KKP, Badan Informasi Geospasial/BIG, dan repositori mandiri) dengan mengekstraksi dan mengevaluasi 32 elemen metadata yang terbagi menjadi:
- **E01–E26 (Elemen Inti ISO 19115):** Menjadi dasar evaluasi komparatif kepatuhan standar internasional dan MQI inti.
- **E27–E32 (Elemen Ekstensi ISO 19115-3 & KUGI):** Menilai kesiapan mutakhir terhadap skema modern XML mdb, representasi topologi, katalog simbol, skema aplikasi, kepatuhan KUGI, dan deskripsi layanan OGC.

Setiap elemen diberi bobot bergradasi 3 tingkat:
- **1,0:** Elemen tersedia, valid, dan bermakna (*meaningful*).
- **0,5:** Elemen tersedia namun generik, berupa templat bawaan, parsial, atau ambigu.
- **0,0:** Elemen kosong, nilReason, atau tidak tersedia.

---

## 2. Sistem Penilaian Multi-Metrik

KOMPAS v7 menyediakan 6 dimensi perhitungan matematis transparan:

1. **Skor Utama Skema A (32 Elemen Berbobot Kategori):**
   Dihitung berdasarkan proporsi ketercapaian pada 8 kategori informasi (Informasi Umum: 5%, Identifikasi: 15%, Deskripsi: 10%, Cakupan: 15%, Ketelitian: 20%, Kontak: 10%, Meta-metadata: 5%, Pemrosesan: 20%).
2. **MQI Biner (32 Elemen):**
   Formula Hasara (2026) dengan pendekatan biner (elemen bernilai 1 dihitung sebagai terpenuhi penuh, bobot 3/2/1).
3. **MQI Diperluas (32 Elemen):**
   Mengakomodasi nilai parsial (1, 0,5, 0) dengan rentang klasifikasi kualitas kontinu tanpa celah:
   - $\ge 90$: **Excellent**
   - $\ge 75$: **Good**
   - $\ge 50$: **Fair**
   - $\ge 25$: **Poor**
   - $< 25$: **Very Poor**
4. **Skor Inti 26 Elemen (E01–E26):**
   Memungkinkan perbandingan murni (*benchmarking*) dengan literatur MQI konvensional.
5. **Skor Ekstensi 6 Elemen (E27–E32):**
   Mengukur adopsi standar interoperabilitas mutakhir (ISO 19115-3 XML mdb).
6. **Skor Rinci 8 Kategori:**
   Menyediakan persentase ketercapaian per kelompok parameter untuk diagnosis kelemahan spesifik dataset.

---

## 3. Mode Penilaian O / U / M & Integritas Auditor

Setiap elemen metadata memiliki status mode yang dapat dikonfigurasi melalui `KOMPAS_aturan_dan_acuan_v7.json`:
- **O (Otomatis):** Diekstraksi dan dinilai penuh oleh algoritma (misal bahasa ISO 639-2, bounding box numerik, atau keberadaan identifier).
- **U (Usulan Mesin):** Mesin mengekstraksi nilai teks dan memberikan skor rekomendasi yang dapat diperiksa oleh pengguna/auditor.
- **M (Manual):** Memerlukan verifikasi kebenaran semantik oleh auditor manusia. Mesin menetapkan nilai usulan sementara sebesar `0,5` (dapat dikonfigurasi) saat data ditemukan.

### Transparansi Override:
Seluruh perubahan nilai oleh auditor dicatat secara berdampingan dengan nilai mesin asli:
$$\text{Format Catatan: } \text{E04}[\text{mesin}=0.5, \text{override}=1.0, \text{catatan}=\text{"Judul memuat nama teluk dan resolusi data" }]$$

---

## 4. Jalur Ekstraksi Format & Eliminasi Nilai Rekaan

Parser metadata diimplementasikan menggunakan navigasi hierarkis rantai tag XML (*strict tag chains*), bukan pencarian tag global:
- **ISO 19139 (`gmd`):** Membaca `gmd:MD_Metadata` dengan namespace URI `http://www.isotc211.org/2005/gmd`.
- **ISO 19115-3 (`mdb`):** Membaca `mdb:MD_Metadata` dengan namespace URI `http://standards.iso.org/iso/19115/-3/mdb/2.0` beserta namespace cit, mri, mcc, mrs, mrl, mdq, gex, lan.
- **ESRI XML (`.shp.xml`):** Parser tersendiri untuk struktur metadata ArcGIS Desktop/Pro (`idinfo`, `spdom`, `cntinfo`, `dataIdInfo`).
- **CKAN JSON (`package_show`):** Mengekstrak paket katalog terbuka termasuk atribut `extras` (`spatial`, `metadata-language`, `dataset-reference-date`) dan `resources` (WMS/WFS/Download).
- **CSW Unwrap:** Mampu membuka enkapsulasi `<csw:GetRecordByIdResponse>` dan `<csw:GetRecordsResponse>`.

**Aturan Integritas Tanpa Nilai Buatan:**
- Standar metadata yang tidak tertulis pada berkas dievaluasi `0,0` (tidak ada sintesis bawaan "ISO 19115-3 (mdb)").
- Tidak ada pengecekan substring tidak resmi seperti "sound velocity" atau "tide" pada teks mentah di luar checklist resmi.
- Berkas sampel yang belum tersedia di disk fisik (`D01_dibungkus_csw_BUATAN.xml`) diakui secara jujur sebagai kebutuhan berkas yang belum terpenuhi, bukan klaim kelulusan palsu.

---

## 5. Ringkasan 14 Penanda Kualitas (F01–F14)

Aplikasi mendeteksi 14 anomali dan kelemahan metadata di lapangan:
- **F01:** Teks templat, salinan identik (abstrak = judul), atau teks definisi standar.
- **F02:** Bounding box kosong, (0,0,0,0), string kosong, atau di luar amplop wilayah Indonesia (90–145 BT, -15 s.d 10 LU).
- **F03:** Jalur berkas lokal (`C:\`, `file://`) atau kebocoran nama host/laptop lokal.
- **F04:** Format non-ISO (ESRI XML atau rekaman CKAN JSON).
- **F05:** Ketidaksesuaian bahasa (misal kode "eng" untuk konten berbahasa Indonesia).
- **F06:** Narahubung kosong, nilReason, "Admin Admin", atau email non-institusional (@gmail.com).
- **F07:** Ketidakkonsistenan CRS (misal EPSG:4326 pada metadata vs EPSG:3857/UTM pada layer).
- **F08:** Ketidakkonsistenan kronologis (tanggal metadata lebih awal dari tanggal publikasi data).
- **F09:** Pernyataan kualitas kontradiktif atau templat RBI pada data bertipe non-geodatabase.
- **F10:** Kalimat rusak, terpotong, atau salah ketik (*typo* nama layer).
- **F11:** Struktur elemen ganda atau perujukan codelist yang salah.
- **F12:** Lisensi bawaan portal GeoNode (*Public Domain copyright.gov* / *Not Specified*).
- **F13:** Metadata mencantumkan standar implementasi XML (ISO 19139) alih-alih standar isi (SNI 8843-1:2019 / ISO 19115-1:2014).
- **F14:** Penanda penolakan kurasi portal (*review_status: rejected*).

---

## 6. Penyelarasan Kepatuhan dengan Abstrak

Berdasarkan tinjauan abstrak penelitian MQI, skor kuantitatif tinggi tidak secara otomatis menjadi bukti hukum atas sertifikasi kepatuhan SNI/ISO. Oleh karena itu, label audit dirumuskan secara proporsional:
- Skor Inti $\ge 75\%$: **"Kelengkapan Elemen Inti Tinggi (≥ 75%)"**
- Skor Inti $< 75\%$: **"Kelengkapan Elemen Inti Belum Optimal (< 75%)"**
- Dilengkapi catatan metodologis pada seluruh kartu KPI dan dokumen laporan ekspor.
