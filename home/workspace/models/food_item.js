var mongoose = require('mongoose');

var foodItemSchema = new mongoose.Schema({
    name:String,
    cuisine:String,
    course:String, 
    price:Number,
    restaurant_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Restaurant"
    },
    order_count:Number,
    description:String, 
    imgurl:String
    
     
});

var FoodItem = mongoose.model("FoodItem",foodItemSchema);
module.exports = FoodItem;