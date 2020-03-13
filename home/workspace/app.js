var passportLocalMongoose = require('passport-local-mongoose');
var expressSession = require('express-session');
var LocalStrategy = require('passport-local');
var LocalStrategy2 = require('passport-local');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var express = require('express');
var app=express();

const util = require('util')

var Restaurant = require('./models/restaurant.js');
var Customer = require('./models/customer.js');
var FoodItem = require('./models/food_item.js');
var Order  = require('./models/order.js');
var Cart = require('./models/cart.js');

mongoose.connect("mongodb://localhost:27017/zomato_app",{useNewUrlParser:true});


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.use(expressSession({
    secret:"This is for DBMS project",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());



//APPLICABLE EVERYWHERE


passport.use('customerLocal',new LocalStrategy(Customer.authenticate()));

passport.use('restaurantLocal',new LocalStrategy2(Restaurant.authenticate()));
// passport.serializeUser(Restaurant.serializeUser());
// passport.deserializeUser(Restaurant.deserializeUser());

passport.serializeUser(function(user, done) { 
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  if(user!=null)
    done(null,user);
});


app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})

app.get("/",function(req,res){
    res.render("landing");
})


/****************************CUSTOMER ROUTES*****************************/
app.get("/customer/register",function(req,res){
    
  res.render("customerRegister");
    
});




app.post("/customer/register",function(req,res)
{
 
        var newCustomerObj = new Customer({
              username:req.body.username,
              fname:req.body.username,
              lname:req.body.customer.lname,
              address:req.body.customer.address,
              street:req.body.customer.street,
              city:req.body.customer.city,
              state:req.body.customer.state,
              phone:req.body.customer.phone,
              email:req.body.customer.email,
              
            });
    Customer.register(newCustomerObj,req.body.password,function(err,newCustomer){
    
    // console.log(newCustomerObj.username+"AND "+req.body.customer.password)  ;
      if(err)
      {
          console.log("\nError: this is the error:"+err);
          
          return res.redirect("/");
      }
      else
      {
        //   console.log("New Customer Added");
        
         passport.authenticate("customerLocal")(req,res,function(){
             
                console.log("New Customer Added");
            //  console.log("Inside passport authenticate");
         res.redirect("/customer");   
        });
         
      }
  }); 
    
});


//Login route for customer
app.get("/customer/login",function(req,res){
   
  res.render("customerLogin");
    
});

app.post("/customer/login",passport.authenticate("customerLocal",{
    successRedirect:"/customer",
    failureRedirect:"/customer/login"
}),function(req,res){
  


});


app.get("/customer",function(req,res){
    // console.log("In customer"+req.user);
    Restaurant.find({},function(err,allRestaurants){
  
      if(err)      
      {
          console.log("ERROR!"+err);
      }
      else
      {
          res.render("customer",{restaurants:allRestaurants});
      }
    })
  
})

app.get("/success",function(req,res)
{
    // console.log("IN SUCCESS");
    // console.log("USER-->"+req.user);
    // console.log("HERE RESTAURANT"+req.restaurant)
    res.send("Success");
});


/****************************************************************/

/**********************Restaurant Routes *************************/

app.get("/restaurant/register",function(req,res){
    
  res.render("restaurantRegister");
    
});




app.post("/restaurant/register",function(req,res)
{
 
var newRestaurantObj = new Restaurant(
    {
        username:req.body.username,
     email:req.body.restaurant.email,
    
    address:req.body.restaurant.address,
    phone :req.body.restaurant.phone,
    state: req.body.restaurant.state,  
    city:req.body.restaurant.city,
    cuisine:req.body.restaurant.cuisine,
    res_type:req.body.restaurant.type,
    imgurl:req.body.restaurant.image,
    });
    
  Restaurant.register(newRestaurantObj,req.body.password,function(err,newRestaurant){
      
      if(err)
      {
          console.log("\nError: And new restaurant is="+newRestaurant+" \nthis is the error:"+err);
      }
      else
      {
        //   console.log("New restaurant Added");
        
        // console.log("HELLO IN ELSE") ;
        
         passport.authenticate("restaurantLocal")(req,res,function(){
             
        //  console.log("Inside passport authenticate");
        //  console.log("IN REGISTER"+req.user);
         res.render("restaurant");   
         
        }); 
         
      }
  }); 
    
});



//Login route for Restaurant
app.get("/restaurant/login",function(req,res){
   
  res.render("restaurantLogin");
    
});


app.post("/restaurant/login",passport.authenticate("restaurantLocal",{
    successRedirect:"/restaurant",
    failureRedirect:"/restaurant/login"
}),function(req,res){
  
// console.log("HERE"+req.user);
// console.log("HERE RESTAURANT"+req.restaurant)

});



app.get("/restaurant",isRestaurantLoggedIn,function(req,res){
  res.render("restaurant");  //I HAVE TO MAKE THIS
})

//TO get info on individual restaurants
app.get("/restaurant/:id",function(req,res){
    
    Restaurant.findById(req.params.id).populate("foodItems").exec(function(err,foundRestaurant){
        if(err)
        {
            console.log("Restaurant Not Found!!"+err);
        }
        else{
        
        // console.log(foundRestaurant);
        res.render("restaurantShow",{restaurant:foundRestaurant});
        }
    });
})


/****************************** ADD FOOD ITEMS **********************************/
app.get("/fooditems/new",isRestaurantLoggedIn,function(req,res)
{
    res.render("fooditem");
});

app.post("/fooditems/new",isRestaurantLoggedIn,function(req,res)
{
    
//     console.log("INSIDE POST");
//   FoodItem.create(req.body.food,function(req,res)
//   {
//       console.log(req.user);
      Restaurant.findById(req.user._id,function(err,foundRestaurant){
      
              if(err)
              {
                  console.log("ERROR!!"+err);
              }
              
              else
              {
                  FoodItem.create(req.body.food,function(err,newFoodItem){
                      if(err)
                      {
                          console.log("ERROR!"+err);
                      }
                      else{
                          newFoodItem.restaurant_id = req.user._id;
                          newFoodItem.save();
                          foundRestaurant.foodItems.push(newFoodItem);
                          foundRestaurant.save();
                          res.redirect("/restaurant");
                      }
                  })
              }
      }) ;
      
//   });
    
});

/********************************************************************************/


/***********************************CART ****************************************/
app.get("/add-to-cart/:id",function(req,res){
        // console.log("INSIDE ADDTO CART");
        var foodItemId = req.params.id;
        // console.log("FOOD ITEM-->"+foodItemId);
        var cart = new Cart(req.session.cart?req.session.cart:{});
        // console.log("\n CART-->"+cart);
        
        FoodItem.findById(foodItemId,function(err,foodItem){
            if(err)
            {   console.log("There is an error in adding to cart"+err);
                return res.redirect('/restaurant/'+foodItem.restaurant_id);   //I made changes here
            }
            // console.log("\nINSIDE FOOD ITEM FIND BY ID");
            
            cart.add(foodItem,foodItem._id); //see if it works
            // console.log("INSIDE CART"+cart);
            // console.log(util.inspect(cart, false, null, true /* enable colors */))
            req.session.cart=cart;
            // console.log("IN REQUEST SESSION CART"+req.session.cart);
            res.redirect('/restaurant/'+foodItem.restaurant_id);
            
            
        });
            
});


app.get("/reduce/:id",function(req,res){
    var foodItemId = req.params.id;
    var cart = new Cart(req.session.cart? req.session.cart:{});
    cart.reduceByOne(foodItemId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
    
});

app.get('/remove/:id',function(req,res){
  var foodItemId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart:{});
  
  cart.removeItem(foodItemId);
  req.session.cart = cart
  res.redirect('/shopping-cart');
});


app.get('/shopping-cart',function(req,res,next){
   
   
   if(!req.session.cart) 
   {
       console.log("IT SAYS YOU HAVE NOTHING IN CART");
     return res.render('shoppingcart',{foodItems:null}) ;
   }
   var cart = new Cart(req.session.cart);
    //  console.log(util.inspect(cart, false, null, true /* enable colors */))
   res.render('shoppingcart',{
       foodItems: cart.generateArray(),
       totalPrice: cart.totalPrice
   });
});


app.get('/checkout',isCustomerLoggedIn,function(req,res){
   if(!req.session.cart) 
   {
       return res.redirect('/shopping-cart');
   }
   
   var cart = new Cart(req.session.cart);
   Customer.findById(req.user._id,function(err,foundCustomer){
      
              if(err)
              {
                  console.log("ERROR!!"+err);
              }
              
              else
              {
                
                  var order = new Order({
                     customer_id:req.user._id,
                     cart:cart,
                     amt:cart.totalPrice,
                     quantity:cart.totalQty
                  });
                  
                  Order.create(order,function(err,newOrder){
                      if(err)
                      {
                          console.log("ERROR!"+err);
                          res.send("FAIL");
                      }
                      else{
                        
                          foundCustomer.orders.push(newOrder);
                          foundCustomer.save();
                          res.redirect("/customer");
                      }
                          
                
                  })
              }
      }) ;
    

});
/***********************************CART ****************************************/
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
    
});

function isCustomerLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/customer/login"); //SEE THIS
    
    
}

function isRestaurantLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/restaurant/login"); //SEE THIS
    
    
}


app.listen(process.env.PORT,process.env.IP,function()
{
    console.log("Server started");
})