# Deployment Instructions untuk Vercel

## Environment Variables yang Harus Diset di Vercel

Setelah mengupload kode ke Vercel, anda perlu mengatur environment variables berikut di dashboard Vercel:

### Server-side Variables (untuk proxy handler)
```
API_BASE_URL=https://your-backend-api.com/api
GROUP_API_BASE_URL=https://your-backend-api.com/api  
NOTIFICATION_API_BASE_URL=https://your-backend-api.com/api
FILE_SERVICE_BASE_URL=https://your-backend-api.com
PRESENCE_SERVICE_BASE_URL=https://your-backend-api.com/api
```

### Client-side Variables (untuk frontend)
```
NUXT_PUBLIC_API_BASE_URL=https://your-backend-api.com/api
NUXT_PUBLIC_API_AUTH_URL=https://your-backend-api.com/api/auth
NUXT_PUBLIC_GROUP_API_BASE_URL=https://your-backend-api.com/api
NUXT_PUBLIC_NOTIFICATION_API_BASE_URL=https://your-backend-api.com/api
NUXT_PUBLIC_FILE_SERVICE_BASE_URL=https://your-backend-api.com
NUXT_PUBLIC_PRESENCE_SERVICE_BASE_URL=https://your-backend-api.com/api
NODE_ENV=production
```

## Langkah Deploy ke Vercel

1. **Replace URLs**: Ganti `https://your-backend-api.com` dengan URL backend API yang sebenarnya
2. **Push ke GitHub**: Commit dan push semua perubahan ke repository GitHub
3. **Deploy di Vercel**:
   - Connect repository GitHub ke Vercel
   - Set environment variables di Vercel dashboard
   - Deploy

## Troubleshooting

### 500 Error pada /chat/messages
- Pastikan semua environment variables sudah diset dengan benar
- Pastikan backend API dapat diakses dari Vercel
- Check Vercel function logs untuk error details

### Icons Tampil Sebagai Tanda Tanya
- Sudah diperbaiki dengan konfigurasi icon bundle yang lebih komprehensif
- Icons sekarang di-bundle di server dan client untuk memastikan tersedia di production

### Date-fns Errors  
- Sudah diperbaiki dengan mengganti semua date-fns dengan native JavaScript date utilities
- Menggunakan `utils/dateUtils.ts` dan `plugins/date-utils.client.ts`

## Files yang Dimodifikasi untuk Production

- `.env` - Updated untuk production URLs
- `nuxt.config.ts` - Icon configuration diperbaiki
- `package.json` - Added @iconify-json/mdi
- `vercel.json` - Vercel deployment configuration
- Semua date formatting sudah menggunakan native JS, tidak ada dependency pada date-fns

## Testing Locally

Untuk test build production secara lokal:
```bash
npm run build
npm run preview
```
