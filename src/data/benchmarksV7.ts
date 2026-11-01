/**
 * KOMPAS - Benchmark & Verification Matrix (D01–D18) v7
 * Dynamically generated from active rules configuration (configLoader).
 * Conforms to KOMPAS_data_audit_v7.xlsx (Sheet Kodean, Skor, Penanda, Acuan_Uji_Aplikasi).
 */

import {
  getActiveConfig,
  getBenchmarkSamples,
  getBenchmarkKodean,
  getBenchmarkAcuan,
  getBenchmarkFlags,
  DatasetAcuanConfig,
} from '../audit/configLoader';

export interface BenchmarkDatasetV7 {
  id: string; // D01, D03, D04, D05, D07, D08, D09, D10, D11, D12, D13, D14, D16, D17, D18
  title: string;
  sourceGroup: string;
  format: 'gmd' | 'ESRI' | 'CKAN' | 'mdb' | string;
  portalOrTool: string;
  scores: Record<string, number>; // E01 to E32: 1, 0.5, 0
  expectedSkorA: number;
  expectedMqiBiner: number;
  expectedMqiDiperluas: number;
  expectedMqiKetat?: number;
  expectedKategoriBiner: string;
  expectedKategoriDiperluas: string;
  expectedSkorAInti: number;
  expectedMqiBinerInti: number;
  expectedMqiDiperluasInti: number;
  expectedKategoriInti: string;
  expectedSkorEkstensi: number;
  categoryPercentages: {
    informasiUmum: number;
    identifikasi: number;
    deskripsi: number;
    cakupan: number;
    ketelitian: number;
    kontak: number;
    metaMetadata: number;
    pemrosesan: number;
  };
  emptyElementsCount: number;
  emptyElementsList: string[]; // E08, E14, etc.
  expectedFlags: string[]; // F01, F02, etc.
  rawFileName: string;
}

/**
 * Returns the 15 benchmark datasets dynamically assembled from active JSON configuration
 */
export function getBenchmarkDatasetsV7(): BenchmarkDatasetV7[] {
  const samples = getBenchmarkSamples();
  const kodean = getBenchmarkKodean();
  const acuan = getBenchmarkAcuan();
  const flags = getBenchmarkFlags();

  const list: BenchmarkDatasetV7[] = [];

  for (const [id, s] of Object.entries(samples)) {
    const a = acuan[id];
    const k = kodean[id] || {};
    const f = flags[id] || [];

    if (!a) continue;

    const emptyList = a['Daftar elemen kosong']
      ? a['Daftar elemen kosong'].split(',').map(x => x.trim()).filter(Boolean)
      : [];

    list.push({
      id,
      title: s.judul || a.Judul,
      sourceGroup: s.kelompok_sumber || a['Kelompok sumber'],
      format: a.Status_Format || s.pengodean,
      portalOrTool: s.pengodean,
      scores: k,
      expectedSkorA: a['Skor A (usulan)'],
      expectedMqiBiner: a['MQI biner'],
      expectedMqiDiperluas: a['MQI diperluas'],
      expectedKategoriBiner: a['Kategori (biner)'],
      expectedKategoriDiperluas: a['Kategori (diperluas)'],
      expectedSkorAInti: a['Skor A inti (E01-E26)'],
      expectedMqiBinerInti: a['MQI biner inti (E01-E26)'],
      expectedMqiDiperluasInti: a['MQI diperluas inti (E01-E26)'],
      expectedKategoriInti: a['Kategori inti (diperluas)'],
      expectedSkorEkstensi: a['Skor ekstensi (E27-E32 saja)'],
      categoryPercentages: {
        informasiUmum: a['Informasi umum'],
        identifikasi: a['Identifikasi'],
        deskripsi: a['Deskripsi'],
        cakupan: a['Cakupan'],
        ketelitian: a['Ketelitian'],
        kontak: a['Kontak'],
        metaMetadata: a['Meta-metadata'],
        pemrosesan: a['Pemrosesan'],
      },
      emptyElementsCount: a['n elemen kosong (nilai 0)'],
      emptyElementsList: emptyList,
      expectedFlags: f,
      rawFileName: s.nama_berkas_mentah,
    });
  }

  return list;
}
