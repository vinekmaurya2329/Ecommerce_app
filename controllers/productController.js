import fs, { readFileSync } from 'fs';
import productModel from '../models/productModel.js';
import slugify from 'slugify'

export const createProductController = async(req,res)=>{
     try {
        const {name,slug,description,price,quantity,category,shipping}= req.fields;
        const {photo}= req.files
        //  validation

        switch (true) {
            case !name:return res.status(500).send({error:'name is required '})
            case !description:return res.status(500).send({error:'description is required '})
            case !price:return res.status(500).send({error:'price is required '})
            case !category:return res.status(500).send({error:'category is required '})
            // case !shipping:return res.status(500).send({error:'shipping is required '})
            case !quantity:return res.status(500).send({error:'quantity is required '})
            case photo && photo.size >1000000:return res.status(500).send({error:'photo is required && photo must be less then 1mb '})
        }
        const products = new productModel({...req.fields, slug:slugify(name)})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
     } await products.save();
     res.status(201).send({
        success:true,
        message:'product created successfully',
        products
     })
     }catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in creating product',
            error
        })
     }

}
//  get product 
export const getProductController =async (req,res)=>{
try {
    const products = await productModel.find({}).select("-photo").limit(12).sort({createdAt:-1})
    res.status(200).send({
        success:true,
        totalProduct: products.length,
        message:'all product ',
        products
    })
} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:'error in geting product',
        error
    })
}
}

// get single product

export const getSingleProductController =async (req,res)=>{
try {
    
const product =await productModel.findOne({slug:req.params.slug}).select("-photo")
res.status(200).send({
    success: true,
    message:'single product fetched successfully',
    product

})

} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false ,
        message:'error while get single product ',
        error
    })
}
}
//  get product photo
 export const productPhotoController = async(req,res)=>{
try {
    const product = await productModel.findById(req.params.pid).select("photo")
    if(product.photo.data){
        res.set('Content-type',product.photo.contentType);
        return res.status(200).send(product.photo.data)
    }
} catch (error) {
    console.log(error) 
    res.status(500).send({
        success:false,
        message:'error while fetching photo',
        error
    })
}
 }

//  delete product 
export const deleteProductController = async(req,res)=>{
try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo")
    res.status(200).send({
        success:true,
        message:'product deleted successfully'
    })
} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:'error while deleting product ',
        error
    })
}
}

//  update product 
export const updateProductController =async  (req,res)=>{

    try {
        const {name,slug,description,price,quantity,category,shipping}= req.fields;
        const {photo}= req.files
        //  validation

        switch (true) {
            case !name:return res.status(500).send({error:'name is required '})
            case !description:return res.status(500).send({error:'description is required '})
            case !price:return res.status(500).send({error:'price is required '})
            case !category:return res.status(500).send({error:'category is required '})
            // case !shipping:return res.status(500).send({error:'shipping is required '})
            case !quantity:return res.status(500).send({error:'quantity is required '})
            case photo && photo.size >1000000:return res.status(500).send({error:'photo is required && photo must be less then 1MB '})
        }
        const products =await productModel.findByIdAndUpdate(req.params.pid,{...req.fields, slug:slugify(name)},{new:true})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
     } await products.save();
     res.status(201).send({
        success:true,
        message:'product updated successfully',
        products
     })
     }catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in updating product',
            error
        })

}};

// filters - -  - - 

export const productFiltersController =async (req,res)=>{
    try {
        const {checked,radio}=req.body;
const args ={}
if(checked.length>0) args.category =checked
if(radio.length) args.price = {$gte: radio[0],$lte:radio[1]}
const products =await productModel.find(args);
res.status(200).send({
    succes:true,
    products
});
} catch (error) {
        consolel.log(error)
        res.status(400).send({
            success:false,
            message:'error while filtring products',
            error
        })
    }
}

//  count  product 
//  export const productCountController = async (req,res)=>{
// try {
//     const total  = await productModel.find({}).estimatedDocumentCount();
//     res.status(200).send({
//         success:true,
//         total,
//     })
// } catch (error) {
//     console.log(error)
//     res.status(400).send({
//         message:'error in product count ',
//         error,
//         success:false
//     })
// }
// };

// product list controller
// export const productListController = async (res,res)=>{
// try {
//     const perPage = 6;
//     const page = req.params.page ? req.params.page : 1
//     const products = await productModel.find({}).select("-photo").skip((page-1) * perPage).limit(perPage).sort({createdAt: -1}); 
//     res.status(200).send({
//         success:true,
//         products,
//     })
// } catch (error) {
//    console.log(error) 
//    res.status(400).send({
//     success:false,
//     message:'error in per page ctrl',
//     error
//    })
// }
// }

// search product 
export const searchProductController =async(req,res)=>{
try {
    const {keyword} =req.params
    const results = await productModel.find({
        $or:[
            {name:{$regex: keyword,$options:"i"}},
            {description:{$regex: keyword,$options:"i"}}

        ]
    }).select("-photo");
    res.json(results);
} catch (error) {
    console.log(error)
    res.status(400).send({
        success:false,
        message:'Error in search product',
        error
    })
}
}