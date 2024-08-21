import cloudinary from "../helpers/cloudinary.js"
import packageModel from "../model/packages.js"
import fs from 'fs';
import path from 'path';

import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

export const createPackage = async (req, res, next) => {
    try {
        const { title, package_type, description, duration, destination, origin, price, day_plan, review, meta } = req.body;
        const files = req.files; 

        if (!title || !description || !duration || !destination || !origin || !price || !day_plan) {
            return res.status(400).json({ message: 'Invalid payload' });
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
//         const { title, package_type, description, duration, destination, origin, price, day_plan, review, meta } = req.body
//         const image = req.file ? req.file.path : null
//         if (!title || !description || !duration || !destination || !origin || !price || !day_plan) {
//             return res.status(400).json({ message: 'invalid payload' })
//         }
//         let Package = await packageModel.create({ title, package_type, description, duration: `${duration} days`, destination, origin, price, day_plan, review, meta, image })

//         // Upload image to Cloudinary
//         const result = await cloudinary.uploader.upload(image);

//         let updatedPackage =  await packageModel.findByIdAndUpdate(Package._id, {image_url: result.secure_url}, {new: true})

//         return res.status(200).json({ message: 'package created successfully', package: updatedPackage })
//     } catch (error) {

//         next(error);
//     }
// }

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
//     console.log('___updatedPackage**', req.body);

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
//         const newImage = req.file ? req.file.path : holidayPackage.image;

       

//         if (newImage && holidayPackage.image) {
//             const oldImagePath = path.join('uploads/', '..', holidayPackage.image);
//             fs.unlink(oldImagePath, (err) => {
//                 if (err) {
//                     console.error('Failed to delete old image:', err);
//                 }
//             });
//         }
//         const result = await cloudinary.uploader.upload(newImage);

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
//             image: newImage,
//             image_url: result.secure_url 

//         };


//         const updatedPackage = await packageModel.findByIdAndUpdate(packageId, data, { new: true });



//         return res.status(200).json({ message: "Updated successfully", updated_package: updatedPackage, imageUrl: result.secure_url });

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
        
        // Handle new thumbnail and images
        const newThumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0].path : holidayPackage.image.thumbnail;
        const newImages = req.files['images'] ? req.files['images'].map(file => file.path) : holidayPackage.image.images;

        // Remove old thumbnail image if updated
        if (newThumbnail && holidayPackage.image.thumbnail && newThumbnail !== holidayPackage.image.thumbnail) {
            const oldThumbnailPath = path.join('uploads/', path.basename(holidayPackage.image.thumbnail));
            try {
                await unlinkAsync(oldThumbnailPath);
            } catch (err) {
                console.error('Failed to delete old thumbnail image:', err);
            }
        }

        // Upload new thumbnail image if present
        let thumbnailUrl = holidayPackage.image_url.thumbnail_url;
        if (newThumbnail) {
            const thumbnailResult = await cloudinary.uploader.upload(newThumbnail);
            thumbnailUrl = thumbnailResult.secure_url;
        }

        // Remove old images if updated
        if (newImages.length > 0 && holidayPackage.image.images.length > 0) {
            const oldImagePaths = holidayPackage.image.images.map(img => path.join('uploads/', path.basename(img)));
            for (const oldImagePath of oldImagePaths) {
                try {
                    await unlinkAsync(oldImagePath);
                } catch (err) {
                    console.error('Failed to delete old image:', err);
                }
            }
        }

        // Upload new images and get URLs
        const imageUrls = await Promise.all(newImages.map(async file => {
            const result = await cloudinary.uploader.upload(file);
            return result.secure_url;
        }));

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
                thumbnail: newThumbnail || holidayPackage.image.thumbnail,
                images: newImages || holidayPackage.image.images
            },
            image_url: {
                thumbnail_url: thumbnailUrl || holidayPackage.image_url.thumbnail_url,
                images_url: imageUrls || holidayPackage.image_url.images_url
            }
        };

        // Update package
        const updatedPackage = await packageModel.findByIdAndUpdate(packageId, data, { new: true });

        return res.status(200).json({ message: "Updated successfully", updated_package: updatedPackage });
    } catch (error) {
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
        return res.status(400).json({ message: " deleted successfully" })
    } catch (error) {
        next(error);
    }
}

//{"title": "Amazing Goa Tour", "description": "Experience the best of Goa in 3 days","duration": "3 ","destination": "Goa","origin": "Delhi","price": 50000,"day_plan": {"a":"a","b": "a"},"meta": "meta data"}