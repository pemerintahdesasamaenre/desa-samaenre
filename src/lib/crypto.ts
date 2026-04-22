import crypto from 'crypto';

// Gunakan ENCRYPTION_KEY dari .env
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

/**
 * Validasi dan ambil kunci enkripsi dalam bentuk Buffer (32 byte)
 */
function getEncryptionKeyBuffer(): Buffer {
  if (!ENCRYPTION_KEY) {
    if (process.env.NODE_ENV === 'production') {
      const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || process.env.CI;
      if (!isBuildPhase) {
        throw new Error('KEAMANAN KRITIS: ENCRYPTION_KEY tidak ditemukan di environment produksi!');
      }
    }
    // Fallback development (32 karakter)
    return Buffer.from('kunci_rahasia_desa_32_karak_1234');
  }

  // Coba parse sebagai base64 (hasil script generate-key)
  let keyBuffer = Buffer.from(ENCRYPTION_KEY, 'base64');
  
  // Jika bukan base64 valid atau panjangnya bukan 32 byte, coba sebagai string mentah
  if (keyBuffer.length !== 32) {
    keyBuffer = Buffer.from(ENCRYPTION_KEY);
  }

  if (keyBuffer.length !== 32) {
    throw new Error(`KEAMANAN KRITIS: ENCRYPTION_KEY harus berukuran tepat 32 byte (ditemukan ${keyBuffer.length} byte).`);
  }

  return keyBuffer;
}

const IV_LENGTH = 16; 

/**
 * Hash NIK (Satu Arah dengan Pepper/Secret)
 */
export function hashNIK(nik: string): string {
  if (!nik) return '';
  const key = getEncryptionKeyBuffer();
  return crypto
    .createHmac('sha256', key)
    .update(nik)
    .digest('hex');
}

/**
 * Enkripsi (Dua Arah - Bisa Diterjemahkan)
 */
export function encrypt(text: string): string {
  if (!text) return '';
  const key = getEncryptionKeyBuffer();
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Dekripsi (Menerjemahkan Balik)
 */
export function decrypt(text: string): string {
  if (!text || !text.includes(':')) return text;

  try {
    const key = getEncryptionKeyBuffer();
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
  } catch (error) {
    console.error('Dekripsi Gagal:', error);
    if (error instanceof Error && error.message.includes('ENCRYPTION_KEY')) {
      throw error;
    }
    return '*** DATA TERKUNCI ***';
  }
}
