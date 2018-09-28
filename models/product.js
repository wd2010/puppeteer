import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema=new Schema({
  id : { type: Number, index: true },
  img: String,
  url: String,
  title: String,
  price: String,
})

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel

