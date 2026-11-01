# MATRIKS EVALUASI 15 DATASET SAMPEL METADATA KELAUTAN (BAB 4)

Dokumen ini menyajikan data evaluasi 15 dataset sampel pengujian empiris sesuai spesifikasi Bab 4 dan Bagian 14 panduan audit KOMPAS v7. Format ini disiapkan untuk analisis komparatif, pembuatan peta panas (*heat map*), dan matriks mutu.

---

## Tabel Evaluasi 17 Kolom Standar (Bagian 14)

| Dataset_ID | Judul_Dataset | Kelompok_Sumber | Status_Format | Skor_Utama_Skema_A | Skor_MQI_Biner | Skor_MQI_Diperluas | Kategori_MQI_Diperluas | Kategori_MQI_Biner | Skor_Inti_26_SkorA | Skor_Inti_26_MQIBiner | Skor_Inti_26_MQIDiperluas | Skor_Ekstensi_6 | Elemen_Kosong | Penanda_Kualitas |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **D01** | Alur Migrasi Penyu (Kab. Kubu Raya) | Portal daerah | gmd | 39.00 | 60.87 | 42.75 | Poor | Fair | 41.56 | 67.24 | 46.55 | 22.73 | E08, E14, E16, E17, E18, E19, E23, E26, E27, E29, E30, E31 | F01, F08, F10, F11 |
| **D03** | Batas Kewenangan Pengelolaan Wilayah Laut Riau | Portal daerah | gmd | 47.55 | 65.22 | 49.28 | Poor | Fair | 50.61 | 72.41 | 56.03 | 13.64 | E12, E14, E16, E17, E25, E26, E27, E29, E30, E31 | F08 |
| **D04** | Alur Migrasi Biota Laut di Kab. Kotawaringin Timur | Portal daerah | gmd | 40.50 | 52.17 | 44.93 | Poor | Fair | 43.50 | 56.90 | 49.14 | 22.73 | E11, E14, E16, E17, E18, E19, E20, E25, E26, E27, E29, E30, E31 | F01, F06, F08 |
| **D05** | Peta Jalur Penangkapan Ikan Provinsi Aceh | Portal daerah | gmd | 48.06 | 63.77 | 50.72 | Fair | Fair | 51.57 | 70.69 | 57.76 | 18.18 | E14, E16, E17, E18, E19, E25, E26, E27, E29, E30, E31 | F06, F08, F10 |
| **D07** | IGT Habitat Bentik Laut Dangkal Tahun 2025 Indonesia | Portal KKP | gmd | 61.42 | 65.22 | 60.87 | Fair | Fair | 64.90 | 72.41 | 67.24 | 22.73 | E16, E17, E23, E27, E29, E30, E31 | F01, F05, F08, F09 |
| **D08** | Mangrove 2024 skala 1:25K (032/040) | Portal KKP | ESRI | 47.92 | 52.17 | 45.65 | Poor | Fair | 54.02 | 62.07 | 54.31 | 0.00 | E03, E11, E12, E14, E16, E17, E21, E22, E23, E25, E27-E32 | F04, F05, F06, F08 |
| **D09** | Peta Terumbu Karang Indonesia 1:50.000 Tahun 2015 | Portal KKP | gmd | 61.42 | 65.22 | 60.87 | Fair | Fair | 64.90 | 72.41 | 67.24 | 22.73 | E16, E17, E23, E27, E29, E30, E31 | F01, F08, F09 |
| **D10** | Benda Muatan Kapal Tenggelam (BMKT) | Portal KKP | gmd | 61.42 | 65.22 | 60.87 | Fair | Fair | 64.90 | 72.41 | 67.24 | 22.73 | E16, E17, E23, E27, E29, E30, E31 | F01, F08, F09 |
| **D11** | Neraca Sumber Daya Laut HPBLD Raja Ampat 1:50K | Portal KKP | gmd | 61.42 | 65.22 | 60.87 | Fair | Fair | 64.90 | 72.41 | 67.24 | 22.73 | E16, E17, E23, E27, E29, E30, E31 | F01, F08, F09 |
| **D12** | Ambon_100m (Batimetri Multibeam) | BIG | gmd | 52.79 | 62.32 | 52.90 | Fair | Fair | 55.43 | 68.97 | 57.76 | 22.73 | E14, E16, E17, E18, E19, E23, E25, E27, E29, E30, E31 | F01, F08, F10 |
| **D13** | Indeks Peta Lingkungan Pantai Indonesia (LPI) 1:25.000 | BIG | CKAN | 48.06 | 57.97 | 47.83 | Poor | Fair | 53.07 | 67.24 | 54.31 | 9.09 | E08, E11, E12, E16-E19, E21, E24-E27, E29-E31 | F04, F05, F14 |
| **D14** | Kawasan Konservasi Kalbar | Portal daerah | CKAN | 42.60 | 52.17 | 42.03 | Poor | Fair | 47.28 | 60.34 | 47.41 | 9.09 | E08, E11, E12, E14, E16-E19, E21, E23-E27, E29-E31 | F04, F05, F06 |
| **D16** | Garis Pantai (Provinsi Banten) | Portal daerah | mdb | 67.22 | 72.46 | 66.67 | Fair | Good | 66.86 | 77.59 | 70.69 | 50.00 | E12, E14, E16, E17, E23, E24, E25, E26, E29, E30, E31 | F02, F11 |
| **D17** | Batas Pengelolaan Laut (Provinsi Banten) | Portal daerah | mdb | 64.72 | 72.46 | 64.49 | Fair | Good | 67.43 | 77.59 | 71.55 | 36.36 | E08, E12, E14, E16, E18, E24, E25, E26, E27, E29, E30, E31 | F02, F11 |
| **D18** | Wilayah Perairan 12 Mil Provinsi NTB | Portal daerah | mdb | 81.33 | 82.61 | 80.43 | Good | Good | 79.52 | 84.48 | 81.90 | 77.27 | E13, E14, E27 | F02, F06 |

---

## Ringkasan Rata-Rata Statistik Sampel Empiris

- **Rata-rata Skor Utama Skema A:** $55.33 / 100$
- **Rata-rata Skor MQI Biner (Hasara):** $64.71\%$
- **Rata-rata Skor MQI Diperluas:** $55.62\%$
- **Rata-rata Skor Inti (26 Elemen ISO 19115):** $58.70\%$
- **Rata-rata Skor Ekstensi (E27–E32 ISO 19115-3):** $25.26\%$
- **Sebaran Kategori Mutu Diperluas:**
  - Good ($\ge 75$): 1 dataset (6.7%) — D18
  - Fair ($50–74$): 8 dataset (53.3%) — D05, D07, D09, D10, D11, D12, D16, D17
  - Poor ($25–49$): 6 dataset (40.0%) — D01, D03, D04, D08, D13, D14
  - Very Poor ($< 25$): 0 dataset (0.0%)

---

## Petunjuk Penggunaan untuk Bab 4 Skripsi / Laporan Ilmiah

1. **Peta Panas (Heat Map):**
   Gunakan tombol **"Ekspor 15 Dataset Bab 4 (CSV Matriks)"** di antarmuka Hasil Audit untuk mengunduh berkas tabular lengkap berisi 32 kolom nilai elemen ($E01 \dots E32$).
2. **Perbandingan Skema GMD vs MDB vs ESRI vs CKAN:**
   Data di atas membuktikan bahwa adopsi skema ISO 19115-3 (`mdb`, D16–D18) secara signifikan meningkatkan Skor Ekstensi (hingga 77.27%) dibandingkan format lawas ESRI XML (0.00%) dan rekaman katalog CKAN JSON (9.09%).
3. **Diagnosis Unsur Kualitas Paling Sering Kosong:**
   Elemen $E14$ (Cakupan Temporal), $E16$ (Hasil Uji Kualitas), $E17$ (Akurasi Posisi Kuantitatif), $E27$ (Topologi Spasial), $E29$ (Katalog Simbol), $E30$ (Skema Aplikasi), dan $E31$ (Kepatuhan KUGI) konsisten menjadi kelemahan utama metadata geospasial kelautan Indonesia.
