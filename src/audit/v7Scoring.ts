/**
 * KOMPAS - Quantitative Scoring Engine v7
 *
 * Implements:
 * 1. Skor Utama 32 Elemen (E01–E32):
 *    - Skor A (Bobot Kategori 0–100)
 *    - MQI Biner (Formula Hasara 2026, nilai > 0 dihitung 1)
 *    - MQI Diperluas (Gradasi 3-tingkat 1, 0.5, 0 tanpa bobot kategori)
 *    - MQI Ketat (Hanya nilai 1)
 * 2. Skor Inti 26 Elemen (E01–E26):
 *    - Skor A Inti, MQI Biner Inti, MQI Diperluas Inti (sebanding dengan paper MQI asli)
 * 3. Skor Ekstensi (E27–E32 saja):
 *    - Indikator kelengkapan elemen tambahan ISO 19115-3 / MDB
 * 4. Skor 8 Kategori:
 *    - Skor persentase (0–100) tiap kategori
 * 5. Daftar Elemen Kosong (Nilai 0):
 *    - Diurutkan berdasarkan dampak bobot descending (Bobot 3, lalu 2, lalu 1)
 *
 * All configurations (category weights, element weights, thresholds) are read
 * dynamically from configLoader.
 */

import {
  getActiveConfig,
  getConfigElements,
  getCore26Elements,
  getExtension6Elements,
  getCategoryWeights,
  evaluateQualityTier,
  CATEGORY_NAME_TO_KEY,
  ElementConfigItem,
} from './configLoader';
import { MQICategory } from '../types/audit';

export interface V7ScoreResult {
  // Main 32-Element Scores
  skorA: number; // Skema A bobot kategori 0-100
  mqiBiner: number; // Hasara 2026 binary 0-100
  mqiDiperluas: number; // 3-level graduated 0-100
  mqiKetat: number; // Strict 1-only 0-100
  kategoriBiner: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Very Poor';
  kategoriDiperluas: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Very Poor';

  // 8 Category Scores
  categoryScores: Record<string, number>; // 0 - 100 percentage
  categoryFractions: Record<string, number>; // 0 - 1.0 fraction
  categoryContributions: Record<string, number>; // weighted contribution to Skor A

  // Core 26-Element Scores (for direct paper comparison)
  skorAInti: number;
  mqiBinerInti: number;
  mqiDiperluasInti: number;
  kategoriInti: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Very Poor';

  // Extension E27-E32 Score
  skorEkstensi: number; // 0 - 100 percentage

  // Weights & Totals
  totalWeight32: number; // 69
  totalWeight26: number; // 58
  totalWeightExt: number; // 11

  // Item counts
  countScore1: number;
  countScore05: number;
  countScore0: number;

  // Empty elements sorted by weight descending
  emptyElements: {
    id: string;
    name: string;
    category: string;
    weight: number;
  }[];

  // Rule Version
  versiAturan: string;
}

/**
 * Calculate full V7 scores given an element score map (id -> value 1, 0.5, 0)
 */
export function calculateV7Scores(scores: Record<string, number>): V7ScoreResult {
  const elements = getConfigElements();
  const catWeights = getCategoryWeights();
  const config = getActiveConfig();

  // Group elements by category
  const categoriesList = [
    'Informasi umum',
    'Identifikasi',
    'Deskripsi',
    'Cakupan',
    'Ketelitian',
    'Kontak',
    'Meta-metadata',
    'Pemrosesan',
  ];

  // 1. Calculate 32-element Category Fractions and Skor A
  const categoryScores: Record<string, number> = {};
  const categoryFractions: Record<string, number> = {};
  const categoryContributions: Record<string, number> = {};
  let totalSkorA = 0;

  for (const catName of categoriesList) {
    const catWeight = catWeights[catName] ?? 0;
    const catElements = elements.filter(e => e.kategori === catName);

    let catWeightedScore = 0;
    let catMaxWeight = 0;

    for (const el of catElements) {
      const val = scores[el.id] ?? 0;
      catWeightedScore += el.bobot * val;
      catMaxWeight += el.bobot;
    }

    const fraction = catMaxWeight > 0 ? catWeightedScore / catMaxWeight : 0;
    const scorePct = fraction * 100;
    const contribution = fraction * catWeight;

    categoryFractions[catName] = fraction;
    categoryScores[catName] = scorePct;
    categoryContributions[catName] = contribution;
    totalSkorA += contribution;
  }

  // 2. Calculate 32-element MQI Biner, Diperluas, Ketat
  let totalWeighted32 = 0;
  let totalBinerWeighted32 = 0;
  let totalKetatWeighted32 = 0;
  let totalMaxWeight32 = 0;

  let count1 = 0;
  let count05 = 0;
  let count0 = 0;

  const emptyElementsList: { id: string; name: string; category: string; weight: number }[] = [];

  for (const el of elements) {
    const val = scores[el.id] ?? 0;
    totalWeighted32 += el.bobot * val;
    totalBinerWeighted32 += el.bobot * (val > 0 ? 1 : 0);
    totalKetatWeighted32 += el.bobot * (val === 1 ? 1 : 0);
    totalMaxWeight32 += el.bobot;

    if (val === 1) count1++;
    else if (val === 0.5) count05++;
    else {
      count0++;
      emptyElementsList.push({
        id: el.id,
        name: el.nama,
        category: el.kategori,
        weight: el.bobot,
      });
    }
  }

  // Sort empty elements by weight descending, then by ID ascending
  emptyElementsList.sort((a, b) => {
    if (b.weight !== a.weight) return b.weight - a.weight;
    return a.id.localeCompare(b.id, undefined, { numeric: true });
  });

  const mqiBiner = totalMaxWeight32 > 0 ? (totalBinerWeighted32 / totalMaxWeight32) * 100 : 0;
  const mqiDiperluas = totalMaxWeight32 > 0 ? (totalWeighted32 / totalMaxWeight32) * 100 : 0;
  const mqiKetat = totalMaxWeight32 > 0 ? (totalKetatWeighted32 / totalMaxWeight32) * 100 : 0;

  const kategoriBiner = evaluateQualityTier(mqiBiner);
  const kategoriDiperluas = evaluateQualityTier(mqiDiperluas);

  // 3. Calculate Core 26-Element Scores
  const coreElements = elements.filter(e => e.inti);
  let totalSkorAInti = 0;
  let totalWeighted26 = 0;
  let totalBinerWeighted26 = 0;
  let totalMaxWeight26 = 0;

  for (const catName of categoriesList) {
    const catWeight = catWeights[catName] ?? 0;
    const catCoreElements = coreElements.filter(e => e.kategori === catName);

    let catWeightedScore26 = 0;
    let catMaxWeight26 = 0;

    for (const el of catCoreElements) {
      const val = scores[el.id] ?? 0;
      catWeightedScore26 += el.bobot * val;
      catMaxWeight26 += el.bobot;
    }

    const fraction26 = catMaxWeight26 > 0 ? catWeightedScore26 / catMaxWeight26 : 0;
    totalSkorAInti += fraction26 * catWeight;
  }

  for (const el of coreElements) {
    const val = scores[el.id] ?? 0;
    totalWeighted26 += el.bobot * val;
    totalBinerWeighted26 += el.bobot * (val > 0 ? 1 : 0);
    totalMaxWeight26 += el.bobot;
  }

  const mqiBinerInti = totalMaxWeight26 > 0 ? (totalBinerWeighted26 / totalMaxWeight26) * 100 : 0;
  const mqiDiperluasInti = totalMaxWeight26 > 0 ? (totalWeighted26 / totalMaxWeight26) * 100 : 0;
  const kategoriInti = evaluateQualityTier(mqiDiperluasInti);

  // 4. Calculate Extension E27-E32 Score
  const extElements = elements.filter(e => !e.inti);
  let totalWeightedExt = 0;
  let totalMaxWeightExt = 0;

  for (const el of extElements) {
    const val = scores[el.id] ?? 0;
    totalWeightedExt += el.bobot * val;
    totalMaxWeightExt += el.bobot;
  }

  const skorEkstensi = totalMaxWeightExt > 0 ? (totalWeightedExt / totalMaxWeightExt) * 100 : 0;

  return {
    skorA: totalSkorA,
    mqiBiner,
    mqiDiperluas,
    mqiKetat,
    kategoriBiner,
    kategoriDiperluas,
    categoryScores,
    categoryFractions,
    categoryContributions,
    skorAInti: totalSkorAInti,
    mqiBinerInti,
    mqiDiperluasInti,
    kategoriInti,
    skorEkstensi,
    totalWeight32: totalMaxWeight32,
    totalWeight26: totalMaxWeight26,
    totalWeightExt: totalMaxWeightExt,
    countScore1: count1,
    countScore05: count05,
    countScore0: count0,
    emptyElements: emptyElementsList,
    versiAturan: config.versi_aturan,
  };
}
