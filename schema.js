const Joi =require("joi")
module.exports.listingSchema=Joi.object({

    title:Joi.string().required,
    description:Joi.string().required,
    price:Joi.number().min(0).required,
    location:Joi.string().required,
    country:Joi.string().required,
    image:Joi.string().allow("",null),

});

module.exports.reviewSchema=Joi.object({
  review:Object({
  rating:Joi.number().required().min(1).max(5),
  comment:Joi.string().required(),
  }),
});