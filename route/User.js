import express from "express";
//import multer from "multer";
import fs from 'fs';
import path from 'path';
import { createUser, deleteUser, getAllUsers, getCount, getUser, login, resetNewPassword, resetPassword, updateUser, verifyOtp } from "../controller/userController.js";
import upload, { uploadSingleImage } from "../helpers/multer.js";

const router = express.Router()

// Multer configuration for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     },
// });

//const upload = multer({ storage });


router.post("/", uploadSingleImage.single('image'), createUser)
router.get("/id/:id", getUser)
router.put("/:id",uploadSingleImage.single('image'),updateUser)
router.delete("/:id", deleteUser)
router.post("/login",login)
router.post("/resetpassword",resetPassword)
router.post("/verifyotp", verifyOtp)
router.post("/resetnewpassword",resetNewPassword)
router.get("/allusers",getAllUsers)

router.get("/count",getCount)






export default router