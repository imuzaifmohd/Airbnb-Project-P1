const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");   // requiring for using views folder
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

// For using public folder for css and js
app.use(express.static(path.join(__dirname, "/public")));

// for using ejsMate
app.engine("ejs", ejsMate);

// for using method override
app.use(methodOverride("_method"));

// So that jo data aara req ke andar vo parse ho paye  
app.use(express.urlencoded({ extended: true }));

// For using views folder and ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Creating the mongoDB connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(()=>{
        console.log("Connection Successful");
    })
    .catch(err => console.log(err));

// ..........................................................

const validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    
    if(result.error) {
        let errMsg = result.error.details.map((el) => el.message ).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
}




// Index Route
// Get /listings -> show all listings
app.get("/listings", wrapAsync(async (req, res)=>{
    const allListings = await Listing.find({});

    res.render("listings/index.ejs", {allListings});
}));


// Create Route: New Listing
// Step 1) GET      /listings/new -> Renders Form -> Submit ->
// Step 2) POST     /listings     -> Gets inputes from form and creates new listing

// Create Route Step 1) GET      /listings/new 
app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs");
 });
 
// Step 2) POST     /listings     -> Gets inputes from form and creates new listing
// app.post("/listings", async (req, res)=>{
//     // let {title, description, image, price, location, country} = req.body;
    
//     // Second way to have value of all these title, description, etc..
//     // by doing listing[title] in name in the form
//     try{
//         let listing = req.body.listing;
//         let newListing = new Listing(listing);    
//         await newListing.save();
//         res.redirect("listings");    
//     } catch(err){
//         next(err);
//     }
// });




app.post(
    "/listings", validateListing, 
    wrapAsync(async (req, res)=>{

        // Commenting these few lines of code as beacuse we are using joi so we dont need
        // these 3 lines of code that we were using 
        // if(!req.body.listing){      // means if request ki body ke andar listing nahi hai
        //     throw new ExpressError(400, "Send Valid Data for listing");
        // }
        
        // Commented thsese lines of code as because these lines of coded is used to write
        // server side schema validation and for that we are now going to use joi npm
        // package to do all the work 
        // if(!newListing.title){
        //     throw new ExpressError(400, "Title is Missing");
        // }
        // if(!newListing.description){
        //     throw new ExpressError(400, "Description is Missing");
        // }
        // if(!newListing.price){
        //     throw new ExpressError(400, "Price is Missing");
        // }
        // if(!newListing.country){
        //     throw new ExpressError(400, "Country is Missing");
        // }
        // if(!newListing.location){
        //     throw new ExpressError(400, "Location is Missing");
        // }
        
        // So for doing the server side schema validation we made a file schema.js
        // beside app.js

        
        let listing = req.body.listing;
        let newListing = new Listing(listing);    

        await newListing.save();
        res.redirect("listings");    
    })
);




// Read ( Show route ) -> GET  /listings/:id
// the a href tag will be present on the /listings page of index.ejs 
// which will begin the show route
app.get("/listings/:id", wrapAsync(async (req, res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));



// Update Route: Edit & Upate Route
// Step 1) GET   /listings/:id/edit   -> edit form -> submit
// Step 2) PUT   /listings/:id        -> Update

// Step 1) /listings/:id/edit   -> edit form -> submit
app.get("/listings/:id/edit", wrapAsync(async ( req, res )=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// Step 2) PUT  /listings/:id        -> Update
app.put("/listings/:id",
    validateListing, 
    wrapAsync(async (req, res)=>{
    // if(!req.body.listing){      // means if request ki body ke andar listing nahi hai
    //     throw new ExpressError(400, "Send Valid Data for listing");
    // }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    // deconstructing req.body.listing and converting the object
    // in it into individula values
    res.redirect(`/listings/${id}`);
}));         




// DELETE Route: /listings/:id
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");

}));















// ..........................................................
// app.get("/testListing", async (req, res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calcutta, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successful Testing");
// });    

app.get("/", (req, res)=>{
    res.send("Hi, i am root");
});



// Purpose: app.all("*", ...) is a special method in Express that matches all HTTP methods 
// (GET, POST, PUT, DELETE, etc.) for any route (* is a wildcard for all routes so it means
// for all paths). It will catch every type of request regardless of HTTP method.
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
    // throw new ExpressError(404, "Page Not Found!");
});


app.use((err, req, res, next)=>{
    let {statusCode = 500, message="Something went wrong"} = err;
    res.status(statusCode).render("listings/error.ejs", { err }); 
})

app.listen(8080, ()=>{
    console.log("app is listening on port 8080");
});