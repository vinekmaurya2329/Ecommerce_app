import CategoryModel from "../models/CategoryModel.js";
import slugify from "slugify";

// create category 
export const createCategoryController = async (req,res) =>{
try{
const {name}= req.body;
if(!name){
    return res.status(401).send({message:'name is reqired'})
}
const existingCategory = await CategoryModel.findOne({name})
if(existingCategory){
return res.status(200).send({ success:true, message:'category is already existis'})
}
const category = await new CategoryModel({name,slug:slugify(name)}).save()
res.status(201).send({success:true,message:'catergry created',category})


}catch(error){
console.log(error)

res.status(500).send({
    success:false,
    message:'error in category',
    error,
})
}
}
//  update  Category
export const updateCategoryController = async (req,res)=>{
    try{
        const {name}= req.body;
        const {id}= req.params;
const category = await CategoryModel.findByIdAndUpdate(id,{name, slug:slugify(name)},{new:true});
res.status(200).send({
    success:true,
    message:'category update successfully',
    category
})
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'error in update category'
        })
    }

}

//  get all  category 
export const categoryController = async (req,res)=>{
    try{
const category = await CategoryModel.find({});
res.status(200).send({
    success:true,
    message:'all category list',
    category
})
    }catch(error){
        console.log(error)
        res.status(500).send({
            sucess:false,
            message:'error while geting all category ',
            error
        })
    }

}
//  get  single caategory  

export const singleCategoryController = async (req,res)=>{
    try{
const category = await CategoryModel.findOne({slug:req.params.slug});
res.status(200).send({
    success:true,
    message:'get single category successfully',
    category
})
    }catch(error){
console.log(error)
res.status(500).send(
   { success:false,
    message:'error geting single category ',
error}
)
    }

}
// delete  category 
export const deleteCategoryController = async(req,res)=>{
    try{
const {id}= req.params
await CategoryModel.findByIdAndDelete(id)
res.status(200).send({
    success:true,
    message:'deleted category successfully',
})
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error while  deleting category ',
            error
        })
    }

}
