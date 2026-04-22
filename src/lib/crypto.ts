import crypto from 'crypto';

// Gunakan ENCRYPTION_KEY dari .env
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// FAIL-SAFE: Jangan biarkan aplikasi jalan di produksi tanpa kunci yang benar
if (!ENCRYPTION_KEY && process.env.NODE_ENV === 'production') {
  throw new Error('KEAMANAN KRITIS: ENCRYPTION_KEY tidak ditemukan di environment produksi!');
}

// Fallback hanya untuk development (PENTING: Ganti di .env segera)
const KEY = ENCRYPTION_KEY || 'kunci_rahasia_desa_32_karak_1234'; 
const IV_LENGTH = 16; 

/**
 * Hash NIK (Satu Arah dengan Pepper/Secret)
 * Menggunakan HMAC-SHA256 agar hash tidak bisa ditebak tanpa kunci rahasia
 * Digunakan sebagai Unique Key (nik_hash)
 */
export function hashNIK(nik: string): string {
  if (!nik) return '';
  return crypto
    .createHmac('sha256', KEY)
    .update(nik)
    .digest('hex');
}

/**
 * Enkripsi (Dua Arah - Bisa Diterjemahkan)
 * Digunakan untuk kolom nik_enc, kk_enc, dan name_enc
 */
export function encrypt(text: string): string {
  if (!text) return '';
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(KEY), iv);
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
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
  } catch (error) {
    console.error('Dekripsi Gagal:', error);
    return '*** DATA TERKUNCI ***';
  }
}
