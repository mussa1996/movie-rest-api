import jwt from 'jsonwebtoken'
import User from '../model/userModel.js'
import nodemailer from 'nodemailer'
require("dotenv").config();
const _=require('lodash')

exports.createUser = async(req,res,next)=>{
    // let transport=nodemailer.createTransport({
    //     service:'gmail',
    //     auth:{
    //         user:process.env.EMAIL,
    //         pass:process.env.PASSWORD
    //     }
    // })
    const {email,password}=req.body;
    const token=jwt.sign({email,password},process.env.JWT_ACC_ACTIVATE,{expiresIn:'20m'});
    // const mailOption = {
    //     from: process.env.EMAIL,
    //     to: email,
    //     subject: 'Account Activation Link',
    //     html:`
    //     <h2>please click on given link to activate you account</h2>
    //     <p>${process.env.CLIENT_URL}/authentication/activate/${token}</p>
    //     `
    // }; 
//     transport.sendMail(mailOption,function (error, data) {
//         if(error){
//             return res.json({
//                 error:error
//             })
//         }
//         return res.json({message:'Email has been sent, Please activate your email',user});
    
//  }); 
    const user = new User({
        email:req.body.email,
        password:req.body.password
    })
    
    try {
    
        
       const data = await user.save()
       const token = await user.generateAuthToken()
      
       res.send({
           message:"created successfully",
           user: data,
           token:token
       })
       
    } catch (error) {
        res.status(400).send(error.message)
    }
}

// exports.loginUser = async(req,res)=>{
//    try {
//        const user = await User.findByCredentials(req.body.email, req.body.password)
//        const token = await user.generateAuthToken()
//        console.log(user)
//        res.send({user, token})
//    } catch (error) {
//        res.send(error.message)
//    }
// }
exports.loginUser = async(req,res,next)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
       console.log(user)
        res.send({message:"Login successfully",user, token,})

    } catch (error) {
        res.status(404).send(error.message)
    }
 }

exports.logout = async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send();
    } catch (error) {
        res.status(500).send()
    }
}
exports.forgetPassword=(req,res)=>{
    try {
        const {email}=req.body;
        User.findOne({email},(err,user)=>{
            if(err || !user){
return res.status(400).json({error:"user of this email does not exists"})
            }
            
            const token=jwt.sign({_id: user._id},process.env.RESET_PASSWORD_ID,{expiresIn:'20m'});
            req.token = token
            req.user = user
            let transport=nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:process.env.EMAIL,
                    pass:process.env.PASSWORD
                }
            })
    const mailOption= {
        from:process.env.EMAIL,
        to: email,
        subject: 'Account Activation Link',
        html:`
        <h2>please click on given link to resent your password</h2>
        <a href="http://localhost:3001/Resetpassword/" ${token} >Click here to reset Password</a>
        `
    };
    const userData={
        user,
        resentLink:token
    }
    console.log(userData)
    // // user.resentLink=token
   
    return User.updateOne({_id: user._id},userData, (err,success)=>{
        if(err){
            return res.status(400).json({error:err})
                        }
                        else{
                            // console.log(transport)
                            transport.sendMail(mailOption,function (error, data) {
                                if(error){
                                    return res.json({
                                        error:err
                                    })
                                }
                                return res.json({message:'Email has been sent, kindly follow the instructions',userData});
                            
                         }); 
                        }
    })
        })
    } catch (error) {
    
        
    }
}
exports.activateAccount=(req,res)=>{
    const {token}=req.body
    if(token){
        jwt.verify(token,process.env.JWT_ACC_ACTIVATE,function(err,decodedToken){
            if(err){
                return res.status(400).json({error:'Incorrect or Expired link'})
            }
            const {email,password}=decodedToken
            User.findOne({email}).exec((err,user)=>{
                if(user){
                    return res.status(400).json({error:"user of this email does not exists"}) 
                }
                let newUser=new User({email,password});
                newUser.save((err,success)=>{
                    if(err){
                        console.log("Error in signup while account activation",err);
                        return res.status(400).json({error:'Error activating account'})
                    }
                    res.json({
                        message:"signup success!!"
                    })
                })
            })
        });
    }
    else{
        return res.json({error:"something went wrong!!!"})
    }
}
exports.deleteUser =async (req,res)=>{
    const user = await User.deleteOne({_id:req.params.id})
    res.status(200).json("delete successfully")
}
exports.resetPassword=(req,res)=>{
        const{resentLink,newPassword}=req.body;
        if(resentLink){
            jwt.verify(resentLink,process.env.RESET_PASSWORD_ID,function(error,decodedToken){
                if(error){
                    return res.json({
                        error:"incorrect token or it is expired"
                    })
                }
                User.findOne({resentLink},(err,user)=>{
                    if(err || !user){
                        return res.status(400).json({error:' user of this token does not exists'})
                    }
                    const obj={
                        ...user,
                        password:newPassword
                    }
                    user=_.extend(user,obj);
                    // res.json({user})
                    user.save((err,result)=>{
                        if(result){
                            return res.status(200).json({message:'Your password has been changed'});
                            
                                        }
                                        else{
                                            
                                            return res.status(400).json({error:"reset password error"}) 
                                            
                                         
                                        }
                    })
                })
            })
        }
        else{
            return res.status(400).json({error:'Authentication Error'})
        }
}