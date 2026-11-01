/**
 * KOMPAS - Metadata Quality Validator & Placeholder Detection
 */

export const PLACEHOLDER_STRINGS = [
  'belum ada',
  'belum ditentukan',
  'tidak ada',
  'tbd',
  'to be determined',
  'to be defined',
  'unknown',
  'n/a',
  'na',
  'none',
  'null',
  'undefined',
  'test',
  'testing',
  'dummy',
  'sample',
  'example',
  'lorem ipsum',
  'asdf',
  'xxx',
  'temp',
  'temporary',
  'isi di sini',
  'placeholder',
];

/**
 * Checks if a string or object value represents a placeholder or generic stub.
 */
export function isPlaceholderValue(val: unknown): boolean {
  if (val === null || val === undefined) return true;
  if (typeof val === 'string') {
    const trimmed = val.trim().toLowerCase();
    if (trimmed.length === 0) return true;
    if (PLACEHOLDER_STRINGS.includes(trimmed)) return true;
    if (/^[xX\-_.*#\s]+$/.test(trimmed) && trimmed.length > 2) return true;
    if (trimmed.startsWith('contoh') || trimmed.startsWith('template')) return true;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return true;
    return val.every(item => isPlaceholderValue(item));
  }
  if (typeof val === 'object') {
    const keys = Object.keys(val as object);
    if (keys.length === 0) return true;
  }
  return false;
}

/**
 * Validates an email address and ensures it is not a generic placeholder email.
 */
export function isValidContactEmail(email?: string): { valid: boolean; reason?: string } {
  if (!email || isPlaceholderValue(email)) {
    return { valid: false, reason: 'Alamat email tidak tersedia atau masih berupa placeholder.' };
  }
  const clean = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(clean)) {
    return { valid: false, reason: `Format sintaks email "${email}" tidak valid.` };
  }
  const placeholderDomains = ['example.com', 'test.com', 'domain.com', 'dummy.com', 'none.com', 'mailinator.com', 'sample.org'];
  const domain = clean.split('@')[1];
  if (placeholderDomains.includes(domain) || clean.startsWith('admin@example') || clean.startsWith('user@')) {
    return { valid: false, reason: `Alamat email menggunakan domain contoh/placeholder ("${domain}").` };
  }
  return { valid: true };
}

/**
 * Validates bounding box coordinates for marine geospatial extents.
 */
export function validateBBox(
  west?: number,
  south?: number,
  east?: number,
  north?: number
): { valid: boolean; reason?: string } {
  if (west === undefined || south === undefined || east === undefined || north === undefined) {
    return { valid: false, reason: 'Salah satu batas koordinat (West/South/East/North) tidak terdefinisi.' };
  }
  if (isNaN(west) || isNaN(south) || isNaN(east) || isNaN(north)) {
    return { valid: false, reason: 'Koordinat bounding box mengandung nilai bukan angka (NaN).' };
  }
  if (west < -180 || west > 180 || east < -180 || east > 180) {
    return { valid: false, reason: `Rentang bujur (longitude) di luar batas valid [-180, 180]: West=${west}, East=${east}.` };
  }
  if (south < -90 || south > 90 || north < -90 || north > 90) {
    return { valid: false, reason: `Rentang lintang (latitude) di luar batas valid [-90, 90]: South=${south}, North=${north}.` };
  }
  if (west > east) {
    return { valid: false, reason: `Batas barat (${west}) lebih besar dari batas timur (${east}).` };
  }
  if (south > north) {
    return { valid: false, reason: `Batas selatan (${south}) lebih besar dari batas utara (${north}).` };
  }
  // Check for suspicious zero-box
  if (west === 0 && east === 0 && south === 0 && north === 0) {
    return { valid: false, reason: 'Bounding box bernilai nol murni (0, 0, 0, 0), indikasi koordinat belum dikonfigurasi.' };
  }
  return { valid: true };
}

/**
 * Validates an ISO 8601 date string.
 */
export function isValidDateString(dateStr?: string): { valid: boolean; reason?: string } {
  if (!dateStr || isPlaceholderValue(dateStr)) {
    return { valid: false, reason: 'Tanggal tidak tersedia atau bernilai placeholder.' };
  }
  const clean = dateStr.trim();
  // Check for common bad dates like 0000-00-00
  if (clean.startsWith('0000') || clean === '1970-01-01') {
    return { valid: false, reason: `Tanggal "${clean}" terdeteksi sebagai nilai bawaan sistem (default/epoch).` };
  }
  const timestamp = Date.parse(clean);
  if (isNaN(timestamp)) {
    return { valid: false, reason: `Sintaks tanggal "${clean}" bukan format ISO 8601 atau YYYY-MM-DD yang dapat diurai.` };
  }
  return { valid: true };
}
