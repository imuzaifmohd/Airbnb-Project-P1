const mongoose = require("mongoose");


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


const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://bit.ly/4cMyoa2",
        set: (v) => v === "" ? "https://bit.ly/4cMyoa2" : v, 
                                                // here we used Virtuals
    },                                            // from mongoose docs
    price: Number,                      // Also v represents the value of
    location: String,               // string that is entered by
    country: String
})
// default was for because when there is not giving any value through 
// vs code too, And set is when the form is submitted and also therefore
// a value also came to us in a string but the string was null string




const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;













    