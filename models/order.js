var mongoose = require('mongoose');
var orderSchema=new mongoose.Schema({
   
   
  
   cart:{type:Object,required:true},
   amount:Number, // price
  
   customer_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Customer"
   } ,//complicated from customer.js
   
  
   order_date:{
      type:Date,
      default:Date.now
   },
   quantity:Number //complicated
});
 
var Order = mongoose.model("Order",orderSchema);

module.exports = Order;




 // there was name and also payementId and address but i did not add that
   //I added food items but he had done the cart
   
   // foodItems: [{
      // type:mongoose.Schema.Types.ObjectId,
      // ref:"FoodItem"
   // }],
    //orderTime:Number,  
   //deliveryStatus:String,
    //PROBABLY NOT NECESSARY
   
   // restaurant_id:{
   //    type:mongoose.Schema.Types.ObjectId,
   //    ref:"Restaurant"
   // }, //complicated from restaurant.js