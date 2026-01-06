# 🚀 Quick Start Guide

Get your PhotoEditor up and running in 5 minutes!

## Step 1: Install Dependencies (1 min)

```bash
npm install
```

## Step 2: Set Up Database (2 min)

**Option A: MongoDB Atlas (Cloud - Easiest)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (M0 Free)
4. Get connection string

**Option B: Local MongoDB**

1. Install MongoDB
2. Start service: `mongod`

## Step 3: Configure Environment (1 min)

Create `.env.local` file:

```env
MONGODB_URI=mongodb://localhost:27017/photo-editor
NEXTAUTH_SECRET=my-super-secret-key-12345
NEXTAUTH_URL=http://localhost:3000
```

Replace MongoDB URI if using Atlas.

## Step 4: Start Application (1 min)

```bash
npm run dev
```

Open: http://localhost:3000

## Step 5: Use the App! ✨

1. **Sign Up** - Create your account
2. **Upload** - Add your first image
3. **Edit** - Apply cool filters
4. **Save** - Download your masterpiece

## That's it! 🎉

You now have a fully functional photo editor!

---

### Need Help?

- Read [SETUP.md](SETUP.md) for detailed instructions
- Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for features
- See [README.md](README.md) for full documentation

### Common Issues

**Can't connect to MongoDB?**

- Check if MongoDB is running
- Verify connection string in `.env.local`

**Port 3000 in use?**

- Run: `npm run dev -- -p 3001`

**Authentication not working?**

- Restart dev server after changing `.env.local`
- Clear browser cookies

Happy editing! 🎨
