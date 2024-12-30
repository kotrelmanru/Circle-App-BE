import joi from "joi";

const schemaRegister = joi.object({
   fullname: joi.string().required().min(5),
   email: joi.string().email().required(),
   password: joi.string().required().min(8),
});

export default schemaRegister;
