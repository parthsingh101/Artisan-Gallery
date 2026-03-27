const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

async function testFetch() {
  await mongoose.connect(MONGODB_URI);
  
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
    title: String,
    slug: String,
    status: String
  }));

  const slug = 'neon-dreams';
  console.log(`Testing fetch for slug: "${slug}"`);
  
  const product = await Product.findOne({ slug, status: "active" }).lean();
  
  if (product) {
    console.log('SUCCESS: Product found!');
    console.log(product);
  } else {
    console.log('FAILURE: Product not found with status "active"');
    const raw = await Product.findOne({ slug }).lean();
    if (raw) {
      console.log('Product exists but status is:', raw.status);
    } else {
      console.log('Product does not exist with this slug at all.');
    }
  }
  
  await mongoose.connection.close();
}

testFetch();
