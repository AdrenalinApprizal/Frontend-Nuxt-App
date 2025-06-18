# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Create an account at [vercel.com](https://vercel.com)
2. **Backend Services**: Ensure your backend APIs are deployed and accessible
3. **GitHub Repository**: Your code should be in a Git repository

## Environment Variables

Set these environment variables in your Vercel dashboard:

### Production URLs
```bash
NUXT_PUBLIC_API_BASE_URL=https://your-backend-api.vercel.app/api
NUXT_PUBLIC_API_AUTH_URL=https://your-backend-api.vercel.app/api/auth
NUXT_PUBLIC_GROUP_API_URL=https://your-backend-api.vercel.app/api
NUXT_PUBLIC_NOTIFICATION_API_URL=https://your-backend-api.vercel.app/api
NUXT_PUBLIC_FILE_SERVICE_URL=https://your-backend-api.vercel.app
NUXT_PUBLIC_PRESENCE_SERVICE_URL=https://your-backend-api.vercel.app/api
```

### WebSocket URLs
```bash
NUXT_PUBLIC_WS_MESSAGES_URL=wss://your-backend-api.vercel.app
NUXT_PUBLIC_WS_PRESENCE_URL=wss://your-backend-api.vercel.app
```

### Environment
```bash
NODE_ENV=production
```

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**:
   - **Framework Preset**: Nuxt.js
   - **Root Directory**: `Frontend-Nuxt-App` (if not root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.output/public`

3. **Set Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all the environment variables listed above

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically deploy on every push to your main branch

## Post-Deployment

### 1. Verify Deployment
- Check that all pages load correctly
- Test authentication flow
- Verify WebSocket connections work
- Test file uploads and API calls

### 2. Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Configure DNS records as shown

### 3. Performance Monitoring
- Enable Vercel Analytics in your dashboard
- Monitor Core Web Vitals and performance metrics

## Troubleshooting

### Common Issues:

1. **API Connection Errors**:
   - Verify environment variables are set correctly
   - Check that backend URLs are accessible
   - Ensure CORS is configured on your backend

2. **WebSocket Connection Failed**:
   - Use `wss://` instead of `ws://` for production
   - Check WebSocket endpoint availability

3. **Build Errors**:
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs in Vercel dashboard

4. **SSR Errors**:
   - Ensure server-side compatible code
   - Check if client-only code is properly wrapped

### Environment-Specific Issues:

- **Development**: Uses localhost URLs
- **Production**: Uses production URLs from environment variables

## Project Structure

```
Frontend-Nuxt-App/
├── app.vue                 # Main app component
├── nuxt.config.ts         # Nuxt configuration
├── vercel.json            # Vercel deployment config
├── package.json           # Dependencies and scripts
├── .env.example           # Environment variables template
├── composables/           # Vue composables
├── components/            # Vue components
├── pages/                 # Route pages
├── middleware/            # Route middleware
├── plugins/               # Nuxt plugins
├── server/                # Server API routes
└── public/                # Static assets
```

## Notes

- The app uses SSR (Server-Side Rendering) for better SEO and performance
- WebSocket connections are established client-side
- Authentication state is managed with Pinia store
- File uploads are handled through the file service API
- The app includes real-time chat functionality with presence indicators
