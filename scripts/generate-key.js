import crypto from 'crypto';

const key = crypto.randomBytes(32).toString('base64');

console.log('--- GENERATED ENCRYPTION KEY ---');
console.log(key);
console.log('--------------------------------');
console.log('Salin kunci di atas dan masukkan ke environment variable ENCRYPTION_KEY di produksi.');
console.log('Pastikan kunci ini disimpan dengan aman dan tidak dibagikan.');
