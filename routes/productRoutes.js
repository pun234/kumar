import express from "express";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  updateProductController,
  productFiltersController,
  productCountController,
  productListController,
  searchProductController,
  realtedProductController,
  productCategoryController,
  braintreeTokenController,
  braintreePaymentController
  
} from "../controllers/productController.js";
import { Adminsign, CompulsorySign } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
router.post(
  "/create-product",
  CompulsorySign,
  Adminsign,
  formidable(),
  createProductController
);
//routes
router.put(
  "/update-product/:pid",
  CompulsorySign,
  Adminsign,
  formidable(),
  updateProductController
);

//get products
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete("/delete-product/:pid", deleteProductController);


router.post("/product-filters", productFiltersController);


router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

// search
router.get("/search/:keyword", searchProductController);


router.get("/related-product/:pid/:cid", realtedProductController);

router.get("/product-categotry/:slug", productCategoryController);

router.get("/braintree/token",braintreeTokenController)
 
router.post("/braintree/payment",CompulsorySign,braintreePaymentController)
export default router;