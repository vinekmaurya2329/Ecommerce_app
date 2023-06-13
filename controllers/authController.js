import userModel from "../models/userModel.js";
import { comparePassword , hashPassword } from "../helper/authHelper.js";
import JWT from 'jsonwebtoken';




export const  registerController = async (req,res)=>{
try{
const {name,email,phone,address,password,answer} =req.body;
if(!name){
    return res.send ({message:"name is required"})
}
if(!email){
    return res.send ({message:"email is required"})
}
if(!password){
    return res.send ({message:"password is required"})
}
if(!phone){
    return res.send ({message:"phone no. is required"})
}
if(!address){
    return res.send ({message:"address is required"})
}
if(!answer){ 
    return res.send ({message:"answer is required"})
}
//  check user ---
const existinguser = await userModel.findOne({email})
//  existing user ---
if(existinguser){
    return res.status(200).send({
        success:false,
        message:'user already register || please login ',
    })
}
//  register user 
const hashedPassword = await hashPassword(password)
const user  =  await new userModel({name,email,phone,address,password:hashedPassword,answer}).save();
res.status(201).send({
    success:true,
    message:'user register successfully',
    user,
})
}
catch(error){
    console.log(error);
    res.status(500).send({
        success:false,
        message:'error in user  registration',
       error,
    })

} 
}

//  Post Login 
export const loginController = async (req,res)=>{
    try{
const {email ,password} =req.body;
// validation ---
if(!email || !password){
return res.status(404).send({
    success:false,
    message:'Invalid email or Password',
})
}
// check user 
const user  = await userModel.findOne({email})
if(!user){
    return res.status(404).send({
        success:false,
        message:'Email is not register',

    })
}
const match = await comparePassword(password,user.password)
if(!match){
    return res.status(200).send({
        success:false,
        message: 'Invalid Password'
    });
}
// token ---

const token  = await JWT.sign({_id:user._id},`${process.env.JWT_SECRET}`,{ expiresIn:'7d'});
res.status(200).send({
    success:true,
    message:' login Successfully',
    user:{
        _id:user._id,
        name:user.name,
        email:user.email,
        phone:user.phone,
        address:user.address,
        role:user.role
    },
    token, 
})

    }
    catch(error){
        console.log(error)
        res.status(500).send({
success:false,
message:" error in login",
error,
        })
    }
 };

//   forgot passsword
export const forgotPasswordController =async (req,res)=>{
try{
const{email,answer,newPassword}= req.body
if(!email){
    res.status(400).send({message:'email is required'})
}
if(!answer){
    res.status(400).send({message:'answer is required'})
}
if(!newPassword){
    res.status(400).send({message:'newPassword is required'})
}
// check
const user =await userModel.findOne({email,answer})
// validation 
if(!user){
    res.status(404).send({
        success:false,
        message:'wrong email or answer'
    })
}
const hashed = await hashPassword(newPassword);
await userModel.findByIdAndUpdate(user._id,{password:hashed})
res.status(200).send({
    success:true,
    message:'Password Reset SuccessFully'
})
}catch(error){
res.status(500).send({
    success:false,
    message:'something went wrong',
})
}
}
//   test controller --
export const testController = (req,res)=>{
    try{
          res.send('procted route');
    }catch(error){
        console.log(error);
        res.send({error})
    }
  
};

// update profile 
export const updateProfileController =async (req,res)=>{
    try {
        const {name,email,phone,password,address}= req.body;
        const user= await userModel.findById(req.user._id)
        // password check
        if(password && password.length < 6) {
            return res.json({error:'password is required and 6 character long '})
        }
        const hashedPassword = password ? await hashPassword(password): undefined;
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{ name:name || user.name,password:hashedPassword || user.password,phone:phone || user.phone,address:address|| user.address},{new:true});
        res.status(200).send({
            success:true,
            message:'profile updated successfully',
            updatedUser
        })
   
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:'error while updating profile ',
            error
        })
    }

};

// //  odrers 
// export const getOrderController =async (req,res)=>{
//     try {
//         const  orders = await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name")
//         res.json(orders);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success:false,
//             message:'error while getting order',
//             error
//         })
//     }
// }
