/**
 * KOMPAS - Dynamic Rules Configuration Module (v7)
 * Loads, validates, and provides rules, weights, definitions, sample datasets,
 * benchmark values, quality flags, and open decisions from JSON.
 *
 * Implements Principle B: "Semua aturan dan angka yang dapat berubah harus dibaca dari JSON v7.
 * Jangan menuliskan angka atau aturan secara permanen di dalam kode."
 */

import defaultRulesJson from '../data/rules_v7.json';
import { MQICategory } from '../types/audit';

export type AssessmentMode = 'O' | 'U' | 'M';

export interface CategoryWeightsConfig {
  'Informasi umum': number;
  'Identifikasi': number;
  'Deskripsi': number;
  'Cakupan': number;
  'Ketelitian': number;
  'Kontak': number;
  'Meta-metadata': number;
  'Pemrosesan': number;
  [key: string]: number;
}

export interface MQICategoryThreshold {
  min: number;
  kategori: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Very Poor';
}

export interface ElementConfigItem {
  id: string; // E01 - E32
  kategori: string;
  bobot: number;
  nama: string;
  inti: boolean; // true for E01-E26, false for E27-E32
  definisi?: string;
  kriteria1?: string;
  kriteria05?: string;
  kriteria0?: string;
  mode?: AssessmentMode;
}

export interface DatasetSampleConfig {
  judul: string;
  kelompok_sumber: string;
  pengodean: string;
  nama_berkas_mentah: string;
}

export interface DatasetAcuanConfig {
  ID: string;
  Judul: string;
  'Kelompok sumber': string;
  Status_Format: string;
  'Skor A (usulan)': number;
  'MQI biner': number;
  'MQI diperluas': number;
  'Kategori (biner)': string;
  'Kategori (diperluas)': string;
  'Informasi umum': number;
  'Identifikasi': number;
  'Deskripsi': number;
  'Cakupan': number;
  'Ketelitian': number;
  'Kontak': number;
  'Meta-metadata': number;
  'Pemrosesan': number;
  'n elemen kosong (nilai 0)': number;
  'Daftar elemen kosong': string;
  'Skor ekstensi (E27-E32 saja)': number;
  'Skor A inti (E01-E26)': number;
  'MQI biner inti (E01-E26)': number;
  'MQI diperluas inti (E01-E26)': number;
  'Kategori inti (diperluas)': string;
}

export interface FlagDefinitionItem {
  penanda: string;
  definisi: string;
}

export interface KompasRulesConfigV7 {
  versi_aturan: string;
  sumber: string;
  catatan: string;
  bobot_kategori_skema_A: CategoryWeightsConfig;
  ambang_kategori_mqi: MQICategoryThreshold[];
  elemen: ElementConfigItem[];
  sampel: Record<string, DatasetSampleConfig>;
  kodean: Record<string, Record<string, number>>;
  acuan: Record<string, DatasetAcuanConfig>;
  penanda_definisi: Record<string, FlagDefinitionItem>;
  penanda_acuan: Record<string, string[]>;
}

// Configurable Open Decisions (Section L from Handover)
export interface OpenDecisionsConfig {
  // 1. Pembagian mode O / U / M (Default proposed: M for 7 interpretation elements, U for machine proposal, O for deterministic)
  assessmentModes: Record<string, AssessmentMode>;
  // 2. Nilai awal untuk elemen manual yang terisi (default 0.5, usulan)
  initialManualValue: number;
  // 3. Ambang kelulusan U2 (default 90%, usulan)
  u2PassingThresholdPercent: number;
  // 4. Strategi pemilihan blok kontak E19/E20 ('best_block' vs 'first_block')
  contactBlockStrategy: 'best_block' | 'first_block';
  // ISO scope words list for E28
  scopeWords: string[];
  // Generic service label keywords for E32
  serviceLabelKeywords: string[];
}

export const DEFAULT_OPEN_DECISIONS: OpenDecisionsConfig = {
  assessmentModes: {
    E01: 'U', // Bahasa metadata
    E02: 'O', // Nama standar
    E03: 'O', // Tautan akses
    E04: 'M', // Judul informatif (Wajib manual)
    E05: 'O', // Tanggal sitasi
    E06: 'O', // Identifier unik
    E07: 'M', // Abstrak (Wajib manual)
    E08: 'M', // Tujuan (Wajib manual)
    E09: 'M', // Kata kunci (Wajib manual)
    E10: 'O', // Kategori topik
    E11: 'U', // Lisensi / batasan
    E12: 'O', // Katalog fitur
    E13: 'U', // Bounding box
    E14: 'O', // Cakupan temporal
    E15: 'U', // Sistem referensi koordinat
    E16: 'O', // Akurasi posisi
    E17: 'U', // Akurasi tematik / laporan kualitas
    E18: 'O', // Skala / resolusi
    E19: 'O', // Organisasi
    E20: 'O', // Sarana kontak
    E21: 'O', // Peran (role)
    E22: 'O', // Tanggal metadata
    E23: 'O', // Frekuensi pembaruan
    E24: 'M', // Pernyataan lineage (Wajib manual)
    E25: 'M', // Sumber data (Wajib manual)
    E26: 'M', // Langkah proses (Wajib manual)
    E27: 'O', // Representasi spasial
    E28: 'U', // Lingkup metadata (MD_Scope)
    E29: 'O', // Katalog simbol
    E30: 'O', // Skema aplikasi
    E31: 'O', // Kepatuhan KUGI
    E32: 'U', // Metadata layanan
  },
  initialManualValue: 0.5,
  u2PassingThresholdPercent: 90.0,
  contactBlockStrategy: 'best_block',
  scopeWords: [
    'dataset',
    'series',
    'featuretype',
    'service',
    'application',
    'tile',
    'model',
    'software',
    'fieldsession',
  ],
  serviceLabelKeywords: [
    'ogc wms service',
    'ogc wfs service',
    'raw',
    'imagewms',
    'portal satu peta kkp',
    'satu peta kkp',
  ],
};

// Internal active configuration holder (in-memory)
let activeConfig: KompasRulesConfigV7 = defaultRulesJson as unknown as KompasRulesConfigV7;
let activeOpenDecisions: OpenDecisionsConfig = { ...DEFAULT_OPEN_DECISIONS };

// Category mapping helper
export const CATEGORY_NAME_TO_KEY: Record<string, MQICategory> = {
  'Informasi umum': 'CAT_GENERAL',
  'Identifikasi': 'CAT_IDENTIFICATION',
  'Deskripsi': 'CAT_DESCRIPTION',
  'Cakupan': 'CAT_EXTENT',
  'Ketelitian': 'CAT_ACCURACY',
  'Kontak': 'CAT_CONTACT',
  'Meta-metadata': 'CAT_METAMETADATA',
  'Pemrosesan': 'CAT_PROCESSING',
};

export const CATEGORY_KEY_TO_NAME: Record<MQICategory, string> = {
  CAT_GENERAL: 'Informasi umum',
  CAT_IDENTIFICATION: 'Identifikasi',
  CAT_DESCRIPTION: 'Deskripsi',
  CAT_EXTENT: 'Cakupan',
  CAT_ACCURACY: 'Ketelitian',
  CAT_CONTACT: 'Kontak',
  CAT_METAMETADATA: 'Meta-metadata',
  CAT_PROCESSING: 'Pemrosesan',
};

/**
 * Validate that an object has the necessary structure for KOMPAS Rules JSON
 */
export function validateRulesConfig(json: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!json || typeof json !== 'object') {
    return { isValid: false, errors: ['JSON konfigurasi kosong atau bukan objek.'] };
  }

  if (!json.versi_aturan || typeof json.versi_aturan !== 'string') {
    errors.push('Key "versi_aturan" wajib ada dan bertipe string.');
  }

  if (!json.bobot_kategori_skema_A || typeof json.bobot_kategori_skema_A !== 'object') {
    errors.push('Key "bobot_kategori_skema_A" wajib ada.');
  } else {
    const requiredCategories = [
      'Informasi umum',
      'Identifikasi',
      'Deskripsi',
      'Cakupan',
      'Ketelitian',
      'Kontak',
      'Meta-metadata',
      'Pemrosesan',
    ];
    let sumWeight = 0;
    for (const cat of requiredCategories) {
      if (typeof json.bobot_kategori_skema_A[cat] !== 'number') {
        errors.push(`Kategori "${cat}" dalam bobot_kategori_skema_A harus berupa angka.`);
      } else {
        sumWeight += json.bobot_kategori_skema_A[cat];
      }
    }
    if (Math.abs(sumWeight - 100) > 0.01) {
      errors.push(`Total bobot_kategori_skema_A harus 100 (terhitung: ${sumWeight}).`);
    }
  }

  if (!Array.isArray(json.ambang_kategori_mqi)) {
    errors.push('Key "ambang_kategori_mqi" wajib berupa array ambang mutu.');
  }

  if (!Array.isArray(json.elemen) || json.elemen.length < 26) {
    errors.push('Key "elemen" wajib berupa array minimal 26 elemen (E01-E26).');
  }

  if (!json.kodean || typeof json.kodean !== 'object') {
    errors.push('Key "kodean" wajib berupa objek pemetaan dataset ke nilai elemen.');
  }

  if (!json.acuan || typeof json.acuan !== 'object') {
    errors.push('Key "acuan" wajib berupa objek nilai acuan pengujian.');
  }

  if (!json.penanda_definisi || typeof json.penanda_definisi !== 'object') {
    errors.push('Key "penanda_definisi" wajib berupa objek definisi bendera F01-F14.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Load custom JSON rules at runtime
 */
export function loadCustomConfig(jsonString: string): { success: boolean; errors?: string[]; version?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    const validation = validateRulesConfig(parsed);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }
    activeConfig = parsed as KompasRulesConfigV7;
    return { success: true, version: parsed.versi_aturan };
  } catch (err: any) {
    return { success: false, errors: [`JSON parsing error: ${err?.message || 'Format JSON tidak valid'}`] };
  }
}

/**
 * Reset config back to bundled v7 default
 */
export function resetToDefaultConfig(): void {
  activeConfig = defaultRulesJson as unknown as KompasRulesConfigV7;
  activeOpenDecisions = { ...DEFAULT_OPEN_DECISIONS };
}

/**
 * Get active configuration
 */
export function getActiveConfig(): KompasRulesConfigV7 {
  return activeConfig;
}

/**
 * Get open decisions configuration
 */
export function getOpenDecisions(): OpenDecisionsConfig {
  return activeOpenDecisions;
}

/**
 * Update open decisions (e.g. O/U/M modes, contact strategy)
 */
export function updateOpenDecisions(updates: Partial<OpenDecisionsConfig>): void {
  activeOpenDecisions = { ...activeOpenDecisions, ...updates };
}

/**
 * Get current rule version
 */
export function getRuleVersion(): string {
  return activeConfig.versi_aturan;
}

/**
 * Get 32 elements list
 */
export function getConfigElements(): ElementConfigItem[] {
  return activeConfig.elemen;
}

/**
 * Get core 26 elements list
 */
export function getCore26Elements(): ElementConfigItem[] {
  return activeConfig.elemen.filter(e => e.inti);
}

/**
 * Get extension 6 elements list (E27-E32)
 */
export function getExtension6Elements(): ElementConfigItem[] {
  return activeConfig.elemen.filter(e => !e.inti);
}

/**
 * Get category weights for Skema A
 */
export function getCategoryWeights(): CategoryWeightsConfig {
  return activeConfig.bobot_kategori_skema_A;
}

/**
 * Get category thresholds
 */
export function getCategoryThresholds(): MQICategoryThreshold[] {
  return activeConfig.ambang_kategori_mqi;
}

/**
 * Determine quality tier based on score and active thresholds
 */
export function evaluateQualityTier(score: number): 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Very Poor' {
  const thresholds = activeConfig.ambang_kategori_mqi;
  for (const t of thresholds) {
    if (score >= t.min) {
      return t.kategori;
    }
  }
  return 'Very Poor';
}

/**
 * Get benchmark datasets dictionary (15 datasets)
 */
export function getBenchmarkSamples(): Record<string, DatasetSampleConfig> {
  return activeConfig.sampel;
}

/**
 * Get benchmark scores dictionary
 */
export function getBenchmarkKodean(): Record<string, Record<string, number>> {
  return activeConfig.kodean;
}

/**
 * Get benchmark reference calculation values
 */
export function getBenchmarkAcuan(): Record<string, DatasetAcuanConfig> {
  return activeConfig.acuan;
}

/**
 * Get quality flags definitions
 */
export function getQualityFlagsDefinition(): Record<string, FlagDefinitionItem> {
  return activeConfig.penanda_definisi;
}

/**
 * Get expected triggered flags per dataset
 */
export function getBenchmarkFlags(): Record<string, string[]> {
  return activeConfig.penanda_acuan;
}
