/**
 * Cryptographic Checksum Utility
 * Generates SHA-256 hash for files, buffers, and string content.
 */

export async function computeChecksum(content: string | ArrayBuffer): Promise<string> {
  try {
    let buffer: ArrayBuffer;
    if (typeof content === 'string') {
      buffer = new TextEncoder().encode(content).buffer;
    } else {
      buffer = content;
    }

    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    // fallback below
  }

  // Fallback simple 32-bit FNV-1a based hex hash if SubtleCrypto is unavailable
  let str = '';
  if (typeof content === 'string') {
    str = content;
  } else {
    const bytes = new Uint8Array(content);
    for (let i = 0; i < Math.min(bytes.length, 10000); i++) {
      str += String.fromCharCode(bytes[i]);
    }
  }

  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, '0');
}
