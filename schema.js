const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().allow("", null), 
        image: Joi.string(), 
    }).required()
})

// const Joi = require('joi');

// const schema1= Joi.object({
//     title: Joi.string()
//         .required(),
    
//     description: Joi.string()
//         .required(),

//     location: Joi.string()
//         .required(),

//     country: Joi.string()
//         .required(),

//     price: Joi.string()
//         .required()
//         .min(0),

//     // image: Joi.string()
//     //     .allow("", null),
// })


// module.exports = schema1;