const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  resolved: {type:Boolean, default:false},
  createdAt:{ type:Date,default: ()=> new Date()},
  updatedAt: { type:Date,default: ()=> new Date()},
  responses: [
  {
    name: String,
    answer: String,
    like:{ type: Number, default:0},
    dislike:{ type: Number, default:0},
  }
]
});

module.exports = mongoose.model('Question', questionSchema);
