import Joi from "joi";

const loginSchema = Joi.object({
   email: Joi.string().email().required(),
   password: Joi.string().required().min(8),
});

export default loginSchema;
