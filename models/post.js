import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema=new Schema({
  id : { type: Number, index: true },
  post_url: { type: String, index: true },
  img: { type: String, index: true },
  video: String,
  likes: String,
  content: String,
  create_time: String,
  img_down: {type : Boolean, default: false},
  video_down: {type : Boolean, default: false}
})

const PostModel = mongoose.model('Post', postSchema);

export default PostModel

