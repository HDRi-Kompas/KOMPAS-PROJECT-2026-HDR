# DOKUMENTASI ARSITEKTUR & PENGEMBANG KOMPAS (VERSI V7)

**Dokumen Teknis Pengembang & Tim Penilai**  
**Aplikasi:** KOMPAS (Audit Kualitas Metadata Geospasial Kelautan)  
**Pengembang:** Hilmi Najwan Ardhani, Dimas Rizky, Tri Untung — Universitas Diponegoro  

---

## 1. Prinsip Utama Desain Perangkat Lunak

1. **Konfigurasi Dinamis Eksternal (*Zero Hardcoded Rules*):**
   Seluruh bobot 32 elemen, bobot kategori, aturan penilaian, nilai acuan pengujian, dan ambang batas mutu dibaca secara *runtime* dari `KOMPAS_aturan_dan_acuan_v7.json` melalui modul `configLoader.ts`. Perubahan aturan tidak memerlukan kompilasi ulang kode logika utama.
2. **Parser Hirarki Rantai Tag (*Strict Path Navigation*):**
   Mencegah kontaminasi tag dengan melarang `findNode` liar. Setiap nilai dicari melalui rantai spesifik (contoh: `identificationInfo > MD_DataIdentification > citation > CI_Citation > title`).
3. **Kompatibilitas Penuh Hosting Statis (*Static Deployment Ready*):**
   Sistem penyimpanan riwayat dan inventaris didesain mandiri di sisi klien menggunakan modul `InventoryStorageEngine` (`localStorage`), sehingga aplikasi dapat berjalan sempurna di GitHub Pages, Vercel, maupun server Express tanpa kegagalan endpoint API.
4. **Verifikasi Terintegrasi U1–U5 (Node Test Runner):**
   Pengujian unit menguji 15 dataset sampel secara komparatif per elemen ($E01 \dots E32$), 14 penanda kualitas ($F01 \dots F14$), format XML gmd/mdb/esri/ckan, dan kasus khusus data riil.

---

## 2. Struktur Modul Inti

```
src/
├── audit/
│   ├── configLoader.ts     # Pemuat JSON dinamis v7 & pengelola keputusan terbuka
│   ├── engine.ts           # Mesin audit utama 32 elemen & mode O/U/M
│   ├── v7Scoring.ts        # Kalkulasi Skor A, MQI Biner, MQI Diperluas, Skor Inti/Ekstensi
│   ├── flags.ts            # Evaluator 14 penanda peringatan mutu F01–F14
│   ├── extensions.ts       # Pemeriksaan kesiapan ISO 19115-3 (E27–E32)
│   ├── consistency.ts      # Verifikasi keselarasan metadata vs data spasial riil
│   └── audit.test.ts       # Suite pengujian unit resmi U1–U5
├── parsers/
│   ├── xmlParser.ts        # Parser XML hierarkis (ISO 19139 gmd & ISO 19115-3 mdb, ESRI XML)
│   ├── jsonParser.ts       # Parser katalog CKAN package_show & JSON OpenData
│   ├── geoJsonParser.ts    # Parser spasial GeoJSON & validasi topologi cincin
│   └── shapefileZipParser.ts # Ekstraksi arsip ZIP Shapefile (.shp, .shx, .dbf, .prj)
├── components/
│   ├── Header.tsx          # Navigasi utama dengan identitas ISO · SNI · MQI
│   ├── DashboardView.tsx   # Dashboard status, KPI kelengkapan, & riwayat terkini
│   ├── AuditResultsView.tsx # Tampilan hasil audit, diagnosis elemen, override, & ekspor
│   ├── InventoryView.tsx   # Manajemen katalog inventaris & histori audit
│   ├── UploadAuditView.tsx # Antarmuka unggah berkas metadata & data spasial
│   └── BenchmarkExplorerModal.tsx # Penjelajah matriks 15 dataset sampel empiris
└── data/
    ├── rules_v7.json       # Sumber acuan resmi aturan v7
    └── benchmarksV7.ts     # Pemuat data sampel D01–D18 dari konfigurasi aktif
```

---

## 3. Spesifikasi Ekspor Bagian 14

KOMPAS v7 menyediakan dua mode ekspor komprehensif:

### A. Ekspor Laporan Dataset Tunggal (CSV & JSON)
Mengekspor laporan audit dataset aktif lengkap dengan 17 kolom standar:
- `Dataset_ID`, `Judul_Dataset`, `Kelompok_Sumber`, `Status_Format`.
- `Skor_Utama_Skema_A`, `Skor_MQI_Biner`, `Skor_MQI_Diperluas`, `Kategori_MQI_Diperluas`, `Kategori_MQI_Biner`.
- `Skor_Inti_26_SkorA`, `Skor_Inti_26_MQIBiner`, `Skor_Inti_26_MQIDiperluas`, `Skor_Ekstensi_6`.
- `Skor_Kat_InfoUmum` s.d. `Skor_Kat_Pemrosesan` (8 kategori).
- Kolom individual `Nilai_E01` s.d. `Nilai_E32`.
- `Elemen_Kosong`, `Penanda_Kualitas`, `Nilai_Mesin_vs_Override`, `Catatan_Auditor`, `Versi_Aturan`.

### B. Ekspor 15 Dataset Bab 4 Sekaligus (CSV Matriks & JSON)
Menghasilkan berkas tabular 15 baris yang memuat seluruh dataset sampel (D01 s.d. D18) untuk memudahkan pembuatan peta panas (*heat map*) dan tabel perbandingan pada bab evaluasi penelitian ilmiah.

---

## 4. Perintah Verifikasi & Validasi Kode

Pengembang dan penguji dapat menjalankan perintah pengujian otomatis berikut di terminal proyek:

```bash
# 1. Menjalankan pengujian unit mandiri (U1–U5)
npx tsx --test src/audit/audit.test.ts

# 2. Memeriksa konsistensi tipe TypeScript
npm run lint

# 3. Mengompilasi aplikasi untuk produksi
npm run build
```
Semua perintah di atas dipastikan lolos tanpa peringatan atau kegagalan sintaks.
