const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: String,
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  artistName: { type: String, required: true },
  category: { type: mongoose.Schema.ObjectId, ref: 'Category', required: true },
  productType: { type: String, enum: ['painting', 'sketch'], default: 'painting' },
  shortDescription: String,
  description: String,
  price: { type: Number, required: true },
  salePrice: { type: Number, default: 0 },
  stock: { type: Number, default: 1 },
  sku: { type: String, unique: true },
  featured: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
  tags: [String],
  images: [{ url: String, publicId: String, alt: String, isPrimary: Boolean }],
  variants: [{ size: String, frame: String, material: String, extraPrice: Number, stock: Number }],
  careInstructions: String,
  shippingInfo: String,
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    console.log('Clearing existing categories and products...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    
    console.log('Creating categories...');
    const categoriesData = [
      { name: 'Oil Paintings', slug: 'oil-paintings', description: 'Rich, textured masterpieces.', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800' },
      { name: 'Watercolor', slug: 'watercolor', description: 'Fluid, ethereal artworks.', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800' },
      { name: 'Pencil Sketches', slug: 'sketches', description: 'Detailed graphite studies.', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800' },
      { name: 'Abstract', slug: 'abstract', description: 'Bold personal interpretations.', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800' }
    ];

    const insertedCats = [];
    for (const cat of categoriesData) {
      const c = await Category.create(cat);
      insertedCats.push(c);
      console.log(`- Category Created: ${c.name}`);
    }

    const findCatId = (slug) => insertedCats.find(c => c.slug === slug)._id;

    console.log('Creating products...');
    const productsData = [
      {
        title: 'Golden Hour at the Ghats',
        slug: 'golden-hour-ghats',
        artistName: 'Anand Dev',
        category: findCatId('oil-paintings'),
        productType: 'painting',
        shortDescription: 'Capturing the spiritual essence of Varanasi.',
        description: 'Vibrant masterpiece of the evening Aarti ceremony.',
        price: 85000,
        sku: 'OIL-VAR-001',
        featured: true,
        status: 'active',
        images: [{ url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=1200', isPrimary: true }],
        variants: [{ size: '24x36"', frame: 'Gold', material: 'Canvas', extraPrice: 5000, stock: 1 }]
      },
      {
        title: 'Monsoon Echoes',
        slug: 'monsoon-echoes',
        artistName: 'Sarah Chen',
        category: findCatId('watercolor'),
        productType: 'painting',
        shortDescription: 'Rainy Kyoto street.',
        description: 'Watercolor using wet-on-wet technique.',
        price: 24500,
        sku: 'WTR-KYO-002',
        bestseller: true,
        status: 'active',
        images: [{ url: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&q=80&w=1200', isPrimary: true }]
      },
      {
        title: 'The Sculptor\'s Hands',
        slug: 'sculptors-hands',
        artistName: 'Julian Vane',
        category: findCatId('sketches'),
        productType: 'sketch',
        shortDescription: 'Hyper-realistic graphite study.',
        description: '40-hour graphite study of aging hands.',
        price: 12000,
        sku: 'SKT-HND-003',
        status: 'active',
        images: [{ url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200', isPrimary: true }]
      },
      {
        title: 'Neon Dreams',
        slug: 'neon-dreams',
        artistName: 'Mikael Sund',
        category: findCatId('abstract'),
        productType: 'painting',
        shortDescription: 'Explosive abstract work.',
        description: 'Acrylics and spray paint abstract.',
        price: 42000,
        sku: 'ABS-NEO-004',
        featured: true,
        status: 'active',
        images: [{ url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1200', isPrimary: true }]
      }
    ];

    for (const prod of productsData) {
      const p = await Product.create(prod);
      console.log(`- Product Created: ${p.title}`);
    }

    console.log('Checking Admin Account...');
    const adminEmail = 'admin@artisan.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('AdminPass123', 12);
      await User.create({ name: 'Artisan Admin', email: adminEmail, passwordHash, role: 'admin' });
      console.log('- Admin Account Created: admin@artisan.com / AdminPass123');
    } else {
      console.log('- Admin Account already exists.');
    }

    console.log('Seeding Success!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Failed:', error);
    process.exit(1);
  }
};

seedData();
