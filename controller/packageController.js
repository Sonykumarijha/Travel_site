import cloudinary from "../helpers/cloudinary.js"
import packageModel from "../model/packages.js"
import fs from 'fs';
import path from 'path';

import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const unlinkAsync = promisify(fs.unlink);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const createPackage = async (req, res, next) => {
    try {
        const { title, package_type, description, duration, destination, origin, price, day_plan, review, meta } = req.body;
        const files = req.files;

        if (!title || !description || !duration || !destination || !origin || !price || !day_plan) {
            return res.status(400).json({ message: 'Invalid payload' });
        }
       

        let existingPackage = await packageModel.findOne({
            title: title,
            package_type:package_type,
            origin:origin,
            destination:destination
                     
        });
        
        //console.log(Object.keys(existingPackage).length,'***');

        if (existingPackage != null) {
            return res.status(400).json({message: "Package is already existed"})
        }

        // Upload thumbnail and images to Cloudinary
        let thumbnailUrl = '';
        let imagesUrls = [];

        if (files.thumbnail) {
            const thumbnailResult = await cloudinary.uploader.upload(files.thumbnail[0].path);
            thumbnailUrl = thumbnailResult.secure_url;
        }

        if (files.images && files.images.length > 0) {
            for (const file of files.images) {
                const imageResult = await cloudinary.uploader.upload(file.path);
                imagesUrls.push(imageResult.secure_url);
            }
        }

        // Create package
        const newPackage = await packageModel.create({
            title,
            package_type,
            description,
            duration: `${duration} days`,
            destination,
            origin,
            price,
            day_plan,
            review,
            meta,
            image: {
                thumbnail: files.thumbnail ? files.thumbnail[0].path : null,
                images: files.images ? files.images.map(file => file.path) : []
            },
            image_url: {
                thumbnail_url: thumbnailUrl,
                images_url: imagesUrls
            }
        });

        return res.status(200).json({ message: 'Package created successfully', package: newPackage });
    } catch (error) {
        next(error);
    }
};

// export const createPackage = async (req, res, next) => {
//     try {
//         const { title, package_type, description, duration, destination, origin, price, day_plan, review, meta } = req.body;
//         const files = req.files;

//         if (!title || !description || !duration || !destination || !origin || !price || !day_plan) {
//             return res.status(400).json({ message: 'Invalid payload' });
//         }

//         // Upload thumbnail and images to Cloudinary
//         let thumbnailUrl = '';
//         let imagesUrls = [];

//         if (files.thumbnail) {
//             const thumbnailResult = await cloudinary.uploader.upload(files.thumbnail[0].path);
//             thumbnailUrl = thumbnailResult.secure_url;
//         }

//         if (files.images && files.images.length > 0) {
//             for (const file of files.images) {
//                 const imageResult = await cloudinary.uploader.upload(file.path);
//                 imagesUrls.push(imageResult.secure_url);
//             }
//         }

//         // Create package
//         const newPackage = await packageModel.create({
//             title,
//             package_type,
//             description,
//             duration: `${duration} days`,
//             destination,
//             origin,
//             price,
//             day_plan,
//             review,
//             meta,
//             image: {
//                 thumbnail: files.thumbnail ? files.thumbnail[0].path : null,
//                 images: files.images ? files.images.map(file => file.path) : []
//             },
//             image_url: {
//                 thumbnail_url: thumbnailUrl,
//                 images_url: imagesUrls
//             }
//         });

//         return res.status(200).json({ message: 'Package created successfully', package: newPackage });
//     } catch (error) {
//         next(error);
//     }
// };


export const getPackage = async (req, res, next) => {
    try {
        let packageId = req.params.id
        if (!packageId) {
            return res.status(400).json({ message: " package Id is required" })
        }
        let holidayPackage = await packageModel.findById(packageId)
        if (!holidayPackage) {
            return res.status(400).json({ message: "Package is not exist with this id" })
        }

        return res.status(200).json({ package: holidayPackage })
    } catch (error) {
        next(error);
    }
}

export const getAllPackages = async (req, res, next) => {
    try {
        let holidayPackages = await packageModel.find().sort({ createdAt: -1 })
        return res.status(200).json({ packages: holidayPackages })
    } catch (error) {
        next(error);
    }
}

export const getPackagesByType = async (req, res, next) => {
    try {
        const { packagetype } = req.query

        let PackagesByType = await packageModel.find({ package_type: { $regex: new RegExp(`^${packagetype}$`, 'i') } })
        return res.status(200).json({ [`${packagetype} packages`]: PackagesByType })
    } catch (error) {
        next(error);
    }
}

export const getPackagesByDestination = async (req, res, next) => {
    try {
        const { destination } = req.query

        let PackagesByDestination = await packageModel.find({
            destination: { $regex: new RegExp(`^${destination}$`, 'i') }
        });
        return res.status(200).json({ packages: PackagesByDestination })
    } catch (error) {
        next(error);
    }
}


// export const updatedPackage = async (req, res, next) => {

//     try {
//         const packageId = req.params.id;

//         if (!packageId) {
//             return res.status(400).json({ message: "Package ID is required" });
//         }

//         const holidayPackage = await packageModel.findById(packageId);
//         if (!holidayPackage) {
//             return res.status(404).json({ message: "No package exists with this ID" });
//         }

//         const { title, package_type, description, duration, destination, origin, price, day_plan, review, meta } = req.body;

//         // Handle new thumbnail and images
//         const newThumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].path : holidayPackage.image.thumbnail;
//         const newImages = req.files['images'] ? req.files['images'].map(file => file.path) : holidayPackage.image.images;

//         // Remove old thumbnail image if updated

//         if (newThumbnail && holidayPackage.image.thumbnail) {

//             const oldImagePath = path.join('uploads/', '..', holidayPackage.image.thumbnail);
//             fs.unlink(oldImagePath, (err) => {
//                 if (err) {
//                     console.error('Failed to delete old image:', err);
//                 }
//             });
//         }

//         // Upload new thumbnail image if present
//         let thumbnailUrl = holidayPackage.image_url.thumbnail_url;
//         if (newThumbnail) {
//             const thumbnailResult = await cloudinary.uploader.upload(newThumbnail);
//             thumbnailUrl = thumbnailResult.secure_url;
//         }

//         // Remove old images if updated
//         if (newImages.length > 0 && holidayPackage.image.images.length > 0) {

//             const oldImagePaths = holidayPackage.image.images.map(img => path.join('uploads/', path.basename(img)));
//             for (const oldImagePath of oldImagePaths) {
//                 try {
//                     await unlinkAsync(oldImagePath);
//                 } catch (err) {
//                     console.error('Failed to delete old image:', err);
//                 }
//             }
//         }

//         // Upload new images and get URLs
//         const imageUrls = await Promise.all(newImages.map(async file => {
//             const result = await cloudinary.uploader.upload(file);
//             return result.secure_url;
//         }));

//         const data = {
//             title: title || holidayPackage.title,
//             package_type: package_type || holidayPackage.package_type,
//             description: description || holidayPackage.description,
//             duration: duration || holidayPackage.duration,
//             destination: destination || holidayPackage.destination,
//             origin: origin || holidayPackage.origin,
//             price: price || holidayPackage.price,
//             day_plan: day_plan || holidayPackage.day_plan,
//             review: review || holidayPackage.review,
//             meta: meta || holidayPackage.meta,
//             image: {
//                 thumbnail: newThumbnail || holidayPackage.image.thumbnail,
//                 images: newImages || holidayPackage.image.images
//             },
//             image_url: {
//                 thumbnail_url: thumbnailUrl || holidayPackage.image_url.thumbnail_url,
//                 images_url: imageUrls || holidayPackage.image_url.images_url
//             }
//         };

//         // Update package
//         const updatedPackage = await packageModel.findByIdAndUpdate(packageId, data, { new: true });

//         return res.status(200).json({ message: "Updated successfully", updated_package: updatedPackage });
//     } catch (error) {
//         next(error);
//     }
// };


export const updatedPackage = async (req, res, next) => {
    try {
        const packageId = req.params.id;
        if (!packageId) {
            return res.status(400).json({ message: "Package ID is required" });
        }
        const holidayPackage = await packageModel.findById(packageId);
        if (!holidayPackage) {
            return res.status(404).json({ message: "No package exists with this ID" });
        }

        const { title, package_type, description, duration, destination, origin, price, day_plan, review, meta } = req.body;
        let newThumbnail = holidayPackage.image.thumbnail;  // Default to existing thumbnail
        let newImages = holidayPackage.image.images;  // Default to existing images
        let thumbnailUrl = holidayPackage.image_url.thumbnail_url;  // Default to existing thumbnail URL
        let imageUrls = holidayPackage.image_url.images_url;  // Default to existing image URLs

        // Handle new thumbnail image if provided
        if (req.files && req.files['thumbnail']) {
            newThumbnail = req.files['thumbnail'][0].path;
            const thumbnailResult = await cloudinary.uploader.upload(newThumbnail);
            thumbnailUrl = thumbnailResult.secure_url;
            
            const oldThumbnailPath = path.resolve(__dirname, '../uploads', path.basename(holidayPackage.image.thumbnail));
            console.log('Attempting to delete old thumbnail:', oldThumbnailPath);
            if (fs.existsSync(oldThumbnailPath)) {
                await unlinkAsync(oldThumbnailPath);
            } else {
                console.log('File does not exist:', oldThumbnailPath);
            }
        }

        // Handle new images if provided
        if (req.files && req.files['images']) {
            const oldImagePaths = holidayPackage.image.images.map(img => path.resolve(__dirname, '../uploads', path.basename(img)));
            for (const oldImagePath of oldImagePaths) {
                console.log('Attempting to delete old image:', oldImagePath);
                if (fs.existsSync(oldImagePath)) {
                    await unlinkAsync(oldImagePath);
                } else {
                    console.log('File does not exist:', oldImagePath);
                }
            }

            const newImageFiles = req.files['images'];
            imageUrls = await Promise.all(newImageFiles.map(async file => {
                const result = await cloudinary.uploader.upload(file.path);
                return result.secure_url;
            }));
            newImages = newImageFiles.map(file => file.path);
        }

        const data = {
            title: title || holidayPackage.title,
            package_type: package_type || holidayPackage.package_type,
            description: description || holidayPackage.description,
            duration: duration || holidayPackage.duration,
            destination: destination || holidayPackage.destination,
            origin: origin || holidayPackage.origin,
            price: price || holidayPackage.price,
            day_plan: day_plan || holidayPackage.day_plan,
            review: review || holidayPackage.review,
            meta: meta || holidayPackage.meta,
            image: {
                thumbnail: newThumbnail,
                images: newImages
            },
            image_url: {
                thumbnail_url: thumbnailUrl,
                images_url: imageUrls
            }
        };

        // Update package
        const updatedPackage = await packageModel.findByIdAndUpdate(packageId, data, { new: true });
        return res.status(200).json({ message: "Updated successfully", updated_package: updatedPackage });
    } catch (error) {
        console.error('Error updating package:', error.message);
        next(error);
    }
};




export const deletePackage = async (req, res, next) => {
    try {
        let packageId = req.params.id
        if (!packageId) {
            return res.status(400).json({ message: "package id is required" })
        }
        await packageModel.findByIdAndDelete(packageId)
        return res.status(200).json({ message: " deleted successfully" })
    } catch (error) {
        next(error);
    }
}

export const getCount = async (req, res, next) => {
    try {
        let packages = await packageModel.find();

        let totalPackageCount = packages.length;
        let honeymoonPackageCount = 0;
        let adventurousPackageCount = 0;
        let religiousPackageCount = 0;
        let festivePackageCount = 0;
        let historicalPackageCount = 0;
        let offsitePackageCount = 0;




        packages.forEach(element => {
            switch (element.package_type) {
                case 'honeymoon':
                    honeymoonPackageCount++;
                    break;
                case 'adventurous':
                    adventurousPackageCount++;
                    break;
                case 'religious':
                    religiousPackageCount++;
                    break;
                case 'festive':
                    festivePackageCount++;
                    break;
                case 'historical':
                    historicalPackageCount++;
                    break;
                case 'offsite':
                    offsitePackageCount++;
                    break;
                default:
                    break;
            }
        });

        return res.status(200).json({
            totalPackageCount,
            honeymoonPackageCount,
            adventurousPackageCount,
            religiousPackageCount,
            festivePackageCount,
            historicalPackageCount,
            offsitePackageCount
        });
    } catch (error) {
        next(error);
    }
}