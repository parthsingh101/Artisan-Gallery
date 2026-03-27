# 🚀 Artisan Gallery: Production Deployment Guide

Follow this guide for a secure and optimized deployment of the **Artisan Gallery** platform to **Vercel**.

## 1. Required Environment Variables

Add these to your **Vercel Project Settings > Environment Variables**:

| Variable | Description | Example/Format |
| :--- | :--- | :--- |
| `MONGODB_URI` | Production MongoDB Connection String | `mongodb+srv://...` |
| `NEXTAUTH_SECRET` | Used to encrypt NextAuth JWT tokens | A long random string |
| `NEXTAUTH_URL` | The base URL of your site | `https://your-domain.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `dipebh9...` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `287215...` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `AgHIGW...` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Public Cloud Name (for client-side) | Same as above |

> [!IMPORTANT]
> Ensure `NEXTAUTH_URL` does NOT have a trailing slash.

---

## 2. Vercel Deployment Checklist

1. **GitHub Connection**: Push the code to a final repository on GitHub.
2. **Project Creation**: Import the project into Vercel.
3. **Configure Env Vars**: Input all variables from the table above.
4. **Database Whitelist**: 
   - If using MongoDB Atlas, go to **Network Access**.
   - Add `0.0.0.0/0` (Allow access from anywhere) or use the [Vercel MongoDB Integration](https://vercel.com/integrations/mongodbatlas) for a more secure dedicated tunnel.
5. **Initial Build**: Run the first deploy. Vercel will automatically handle `npm install` and `next build`.
6. **Verify Admin Access**: 
   - Log in with your admin credentials.
   - Verify that the Dashboard displays real-time stats correctly.
   - Test an image upload to verify Cloudinary connectivity.

---

## 3. Production Safety & Reliability Notes

### 🔒 Security Check
- **Middleware**: The current `middleware.js` protects sensitive routes (`/admin`, `/account`, `/checkout`).
- **Secret Rotation**: Rotate `NEXTAUTH_SECRET` if it is ever compromised.

### 📦 Image Optimization
- `next.config.mjs` is configured with `remotePatterns` for Cloudinary and Unsplash.
- Images uploaded to Cloudinary are served via CDN for maximum performance.

### 🗄️ Database Strategy
- The app uses a connection-caching pattern in `lib/db.js`. This prevents "Too Many Connections" errors on Vercel's serverless functions during traffic spikes.

### 🚧 App Router Caveats
- **Dynamic Routes**: Pages with `export const dynamic = "force-dynamic"` (like Product Details) will refresh on every visit, ensuring stock levels are always accurate.
- **Client Components**: Interactivity in the Cart and Gallery is handled by small, focused Client Components and dynamic context providers.

---

## 4. Final Verification Stats
- **Total Product Limit**: 12 (Paginated)
- **Session Duration**: 30 Days
- **Artisan Role**: Required for Admin Access
