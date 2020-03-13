var mongoose = require('mongoose');
var passportLocalMongoose= require('passport-local-mongoose');
var customerSchema = new mongoose.Schema({
  
  username:String,
  lname:String,
  address:String,
  street:String,
  city:String,
  state:String,
  phone:Number,
  email:String,
  password:String,
  //new
  orders:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Order" 
    
  }]
  
   
});

customerSchema.plugin(passportLocalMongoose);
var Customer = mongoose.model("Customer",customerSchema);
module.exports = Customer;