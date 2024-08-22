import express from "express";

import validate from "../middlewares/validate.js";
import schema from "../schemas/customersSchema.js";

import controller from "../controllers/customersController.js";

const router = express.Router();

router.get("/",(req,res)=>{
    res.render('home')
});


router.post("/",validate(schema.register,'body'), await controller.customerRegistration);

export default router;