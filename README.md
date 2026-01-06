# PhotoEditor - CSS-Based Photo Editor with Cloud Storage

A powerful, account-based photo editor built with Next.js, MongoDB, and CSS filters. Features a Photoshop-inspired interface with cloud storage capabilities.

## Features

### 🎨 Photo Editing

- **CSS-based filters**: Blur, Brightness, Contrast, Grayscale, Hue Rotate, Saturation, Sepia, Invert, Opacity
- **Real-time preview**: See changes instantly as you adjust filters
- **Save edited versions**: Export and save your edited images

### 👤 User Management

- **Secure authentication**: Email/password login with NextAuth
- **User sessions**: Persistent login sessions

### 💾 Image Management

- **Cloud storage**: Images stored in MongoDB
- **CRUD operations**: Full image management
- **Tags & Titles**: Organize with metadata

### 🔍 Search & Organization

- **Smart search**: Search by title and tags
- **Tag system**: Custom tags for organization

### 📊 Free Tier

- **10 images maximum**
- **5MB per file limit**
- **Smart compression**: Auto-compress oversized files

## Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create `.env.local`:

   ```env
   MONGODB_URI=mongodb://localhost:27017/photo-editor
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to http://localhost:3000

## Tech Stack

- Next.js 15
- MongoDB + Mongoose
- NextAuth.js
- Tailwind CSS
- TypeScript

## Usage

1. Create an account (Sign up)
2. Upload images (max 5MB)
3. Edit with CSS filters
4. Search by tags/title
5. Manage your gallery

## License

MIT License
