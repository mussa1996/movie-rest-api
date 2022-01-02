import mongoose from "mongoose";
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },  //required:true means that the field is required
    description: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
   
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
const movie=mongoose.model('movie',movieSchema);
module.exports=movie;
