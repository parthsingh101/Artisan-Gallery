const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

async function debugProducts() {
  await mongoose.connect(MONGODB_URI);
  console.log('--- Product Debug ---');
  
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
    title: String,
    slug: String,
    status: String
  }));

  const products = await Product.find({}, 'title slug status').lean();
  products.forEach(p => {
    console.log(`Title: ${p.title} | Slug: ${p.slug} | Status: ${p.status}`);
  });
  
  await mongoose.connection.close();
}

debugProducts();
