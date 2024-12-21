const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

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

// Doing this another way below the commented code
// Listing.insertMany(initData.data).then((res)=>{
//     console.log(res);
// }).catch((err)=>{
//     console.log(err);
// })

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialised");
}

initDB();














