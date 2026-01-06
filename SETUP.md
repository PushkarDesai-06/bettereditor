# Setup Guide for PhotoEditor

## Prerequisites

1. **Node.js**: Version 18 or higher

   - Download from: https://nodejs.org/

2. **MongoDB**: Either local or cloud instance

   - **Option A - Local MongoDB**:

     - Download from: https://www.mongodb.com/try/download/community
     - Install and start the service

   - **Option B - MongoDB Atlas (Cloud - Recommended)**:
     - Go to: https://www.mongodb.com/cloud/atlas
     - Create a free account
     - Create a new cluster (M0 Free tier)
     - Get your connection string

## Step-by-Step Setup

### 1. Install Dependencies

Open terminal in the project directory and run:

```bash
npm install
```

This will install all required packages:

- next, react, react-dom
- mongoose (MongoDB driver)
- next-auth (Authentication)
- bcryptjs (Password hashing)
- browser-image-compression (Image compression)
- react-icons (UI icons)
- tailwindcss (Styling)

### 2. Configure Environment Variables

Create a file named `.env.local` in the root directory with these values:

**For Local MongoDB:**

```env
MONGODB_URI=mongodb://localhost:27017/photo-editor
NEXTAUTH_SECRET=your-super-secret-key-change-this
NEXTAUTH_URL=http://localhost:3000
```

**For MongoDB Atlas (Cloud):**

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/photo-editor?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-super-secret-key-change-this
NEXTAUTH_URL=http://localhost:3000
```

**Important Notes:**

- Replace `username` and `password` with your MongoDB Atlas credentials
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- Generate a strong secret for `NEXTAUTH_SECRET` (any random string)
- Keep `.env.local` secure and NEVER commit it to Git (it's in .gitignore)

### 3. Start MongoDB (if using local installation)

**Windows:**

```bash
mongod
```

**Mac/Linux:**

```bash
sudo mongod
```

Or use MongoDB Compass GUI application.

### 4. Run the Development Server

```bash
npm run dev
```

The application will start at: http://localhost:3000

### 5. Create Your First Account

1. Open http://localhost:3000 in your browser
2. Click "Sign up"
3. Fill in your details:
   - Name
   - Email
   - Password (minimum 6 characters)
4. Click "Sign Up"
5. You'll be redirected to the sign-in page
6. Sign in with your credentials

### 6. Upload and Edit Your First Image

1. After signing in, you'll see the dashboard
2. Click "Upload Image"
3. Select an image file (max 5MB)
4. If the file is too large, choose a compression option
5. Add a title and tags (optional)
6. Click "Upload Image"
7. Click the edit icon on your uploaded image
8. Adjust filters using the sidebar
9. Click "Save" when done

## Troubleshooting

### Problem: MongoDB connection error

**Solution:**

- Check if MongoDB is running (local)
- Verify connection string in `.env.local`
- For Atlas: Check if your IP is whitelisted
- For Atlas: Verify username/password are correct

### Problem: Cannot start dev server

**Solution:**

- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`
- Check if port 3000 is already in use

### Problem: Authentication not working

**Solution:**

- Clear browser cookies
- Check `NEXTAUTH_SECRET` is set in `.env.local`
- Restart the dev server after changing `.env.local`

### Problem: Images not uploading

**Solution:**

- Check file size (must be under 5MB)
- Try compressing the image
- Check MongoDB connection
- Check browser console for errors

### Problem: Search not working

**Solution:**

- Ensure you've uploaded images with titles/tags
- Try exact matches first
- Check MongoDB indexes are created

## MongoDB Atlas Setup (Detailed)

1. **Create Account**

   - Go to mongodb.com/cloud/atlas
   - Sign up for free

2. **Create Cluster**

   - Choose "Shared" (M0 Free)
   - Select a region close to you
   - Click "Create Cluster"

3. **Create Database User**

   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password
   - Set role to "Read and write to any database"

4. **Whitelist IP Address**

   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP

5. **Get Connection String**
   - Go to "Database" (Clusters)
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Production Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to vercel.com
3. Import your repository
4. Add environment variables:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL)
5. Deploy

### Environment Variables for Production

```env
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_SECRET=different-secret-for-production
NEXTAUTH_URL=https://your-domain.com
```

## Testing the Application

### Test Checklist

- [ ] Sign up with new account
- [ ] Sign in with created account
- [ ] Upload an image (under 5MB)
- [ ] Upload an image (over 5MB) and compress
- [ ] Edit an image with filters
- [ ] Save edited image
- [ ] Add tags to an image
- [ ] Search by title
- [ ] Search by tag
- [ ] Delete an image
- [ ] Sign out
- [ ] Sign in again and verify images are still there

## Features to Test

1. **Photo Editor**

   - Adjust blur slider
   - Adjust brightness
   - Adjust contrast
   - Try all 9 filters
   - Reset filters
   - Save edited image

2. **Image Management**

   - Upload new image
   - Edit image title (click on title)
   - Edit image tags (click on tags)
   - Delete image

3. **Search**

   - Search by exact title
   - Search by partial title
   - Search by tag
   - Clear search

4. **Limits**
   - Try uploading 10th image (should work)
   - Try uploading 11th image (should show error)
   - Try uploading 6MB file (should offer compression)

## Getting Help

- Check the main README.md for more details
- Look at the error messages in browser console (F12)
- Check the terminal where `npm run dev` is running
- Verify MongoDB connection in MongoDB Compass

## Useful Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Clear Next.js cache
rm -rf .next

# Reinstall all dependencies
rm -rf node_modules package-lock.json && npm install
```

## Next Steps

After successfully setting up:

1. Customize the styling in `app/globals.css`
2. Add more filters to `components/PhotoEditor.tsx`
3. Extend user profile features
4. Add premium tier functionality
5. Implement image sharing
6. Add social features

Happy coding! 🎨
