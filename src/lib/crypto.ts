import crypto from 'crypto';

// Gunakan ENCRYPTION_KEY dari .env, atau fallback untuk development
// PENTING: Untuk AES-256, kunci HARUS tepat 32 karakter
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'kunci_rahasia_desa_32_karak_1234'; // Tepat 32 karakter
const IV_LENGTH = 16; // Untuk AES

/**
 * Hash NIK (Satu Arah)
 * Digunakan sebagai Unique Key (nik_hash) agar fitur Upsert jalan cepat
 */
export function hashNIK(nik: string): string {
  return crypto.createHash('sha256').update(nik).digest('hex');
}

/**
 * Enkripsi (Dua Arah - Bisa Diterjemahkan)
 * Digunakan untuk kolom nik_enc, kk_enc, dan name_enc
 */
export function encrypt(text: string): string {
  if (!text) return '';
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  // Hasil: iv (dalam hex) + : + data_terenkripsi (dalam hex)
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Dekripsi (Menerjemahkan Balik)
 * Khusus untuk dipanggil di level Admin agar bisa baca data asli
 */
export function decrypt(text: string): string {
  if (!text || !text.includes(':')) return text;

  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
  } catch (error) {
    console.error('Dekripsi Gagal:', error);
    return '*** DATA TERKUNCI ***';
  }
}
