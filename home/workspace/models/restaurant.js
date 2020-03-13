var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var restaurantSchema = new mongoose.Schema({
    email:String,
    username:String,
    address:String, //make changes in this
    phone :Number,
    password:String, 
    city:String, 
    state:String,
    cuisine:String, 
    res_type:String,
    imgurl:String,
    foodItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"FoodItem" 
    }]
});

restaurantSchema.plugin(passportLocalMongoose);
var Restaurant = mongoose.model("Restaurant",restaurantSchema);

module.exports = Restaurant;
 