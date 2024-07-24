import express from "express";
import multer from "multer";
import fs from 'fs';
import path from 'path';
import { createUser, deleteUser, getUser, login, updateUser } from "../controller/userController.js";

const router = express.Router()

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });


router.post("/", upload.single('image'), createUser)
router.get("/:id", getUser)
router.put("/:id",upload.single('image'),updateUser)
router.delete("/:id", deleteUser)
router.post("/login",login)





export default router