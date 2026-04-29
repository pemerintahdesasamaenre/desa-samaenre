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

const IV_LENGTH = 12; // GCM standar menggunakan 12 byte IV

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
 * Enkripsi (Dua Arah - AES-256-GCM)
 */
export function encrypt(text: string): string {
  if (!text) return '';
  const key = getEncryptionKeyBuffer();
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Format: iv:authTag:ciphertext
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Dekripsi (Menerjemahkan Balik + Verifikasi Integritas)
 */
export function decrypt(text: string): string {
  if (!text || !text.includes(':')) return text;

  try {
    const key = getEncryptionKeyBuffer();
    const parts = text.split(':');
    
    // Support format baru (GCM: 3 parts)
    if (parts.length === 3) {
      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encryptedText = parts[2];
      
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    }
    
    // Support legacy format (CBC: 2 parts) - Opsional jika ada data lama
    if (parts.length === 2) {
      const iv = Buffer.from(parts[0], 'hex');
      const encryptedText = Buffer.from(parts[1], 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    }

    return text;
  } catch (error) {
    console.error('Dekripsi Gagal:', error);
    return '*** DATA TERKUNCI / TERMANIPULASI ***';
  }
}
