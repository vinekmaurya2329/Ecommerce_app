import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddlewares.js';
import { createProductController, deleteProductController, getProductController, getSingleProductController,  productFiltersController,  productPhotoController, searchProductController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable';

const router = express.Router();

// router  
router.post('/create-product',requireSignIn,isAdmin,formidable() ,createProductController)

//  get product 
router.get('/get-product',getProductController)

// get product  single 
router.get('/get-product/:slug',getSingleProductController)

//  product photo 
router.get('/product-photo/:pid',productPhotoController)

//  delete product 
router.delete('/delete-product/:pid',deleteProductController)

//  update product 
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable() ,updateProductController)

// filter product
router.post('/product-filters',productFiltersController);

// product count 
// router.get('/product-count',productCountController);

// product per page
// router.get('/product-list/:page',productListController);

// search product
router.get('/search/:keyword',searchProductController)

export  default router