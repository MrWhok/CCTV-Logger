const router=require('express').Router();
const {User}=require('../models/user');
const joi=require('joi');
const bcrypt=require('bcrypt');

router.post('/',async(req,res)=>{
    try{
        const {error}=validateLogin(req.body);
        if(error) 
            return res.status(400).send(error.details[0].message);


        const user=await User.findOne({email:req.body.email});
        if(!user) 
            return res.status(400).send("Invalid email");

        const validpassword=await bcrypt.compare(
            req.body.password,user.password
        );
        if(!validpassword)
            return res.status(400).send("Invalid password");

        const token=user.generateAuthToken();
        res.status(200).send({data:token,message:"Logged in successfully"});
    }catch(error){
        res.status(500).send({message:"Internal Server Error"});
    }
});


const validateLogin=(data)=>{
    const schema=joi.object({
        email:joi.string().email().required().label('Email'),
        password:joi.string().min(6).required().label('Password'),
    });
    return schema.validate(data);
}

module.exports=router;