import hotelModel from "../model/hotels.js";
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import cloudinary from "../helpers/cloudinary.js";
import axios from 'axios';


export const createHotel = async (req, res) => {
    try {
        const { name, located, review, price, meta } = req.body;
        const { country, state, city, address, latitude, longitude } = located;
        const image = req.file ? req.file.path : null

        if (!name || !country || !state || !city || !latitude || !longitude || !review || !price || !meta || !image) {
            return res.status(400).json({ message: 'Invalid payload' });
        }

        const cityCoordinates = await getCityCoordinates(city, country);
        if (!cityCoordinates) {
            return res.status(400).json({ message: 'Unable to geocode city' });
        }

        const distance = calculateDistance(cityCoordinates.lat, cityCoordinates.lng, latitude, longitude);

        let hotel = await hotelModel.create({ 
            name, 
            located: { country, state, city, address, latitude, longitude },
            distance: `${distance.toFixed(2)} km from ${city}`, 
            review, 
            price, 
            meta, 
            image 
        });

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(image);

        return res.status(200).json({ message: 'Hotel created successfully', hotel:hotel,imageUrl: result.secure_url });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Hotel not created', error });
    }
}; 



// *******Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; 
    return distance;
};

const getCityCoordinates = async (city, country) => {
    const apiKey = process.env.API_KEY_OPEN_CAGE_DATA;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city + ',' + country)}&key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const location = data.results[0].geometry;
            return { lat: location.lat, lng: location.lng };
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};


export const getHotelsByRating = async (req, res) => {
    try {
        const { country } = req.query; // Extract country from query parameters

        if (!country) {
            return res.status(400).json({ message: "Country parameter is required" });
        }
        let hotels = await hotelModel.find({ "located.country": { $regex: `^${country}$`, $options: 'i' } }).sort({ "review.rating": -1 }).limit(10);
        return res.status(200).json({ hotels: hotels });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "*****Unable to fetch top-rated hotels*****" });
    }
};



export const getHotelsByPrice = async (req, res) => {
    try {
        const { country } = req.query;

        if (!country) {
            return res.status(400).json({ message: "Country parameter is required" });
        }
        let hotels = await hotelModel.find({ "located.country": { $regex: `^${country}$`, $options: 'i' } }).sort({ "price": 1 }).limit(10);
        return res.status(200).json({ hotels: hotels });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "*****Unable to fetch hotels by lowest price*****" });
    }
};


//--------------------------------------------------------------------------------------



export const getHotel = async (req,res) => {
    try{
        let hotelId = req.params.id
        let hotel = await hotelModel.findById(hotelId)
        return res.status(200).json({hotel:hotel})

    }catch(error) {
        console.log(error);
        return res.status(400).json({message: "error"})
    }
}


export const updateHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;

        const hotel = await hotelModel.findById(hotelId);

        if (!hotel) {
            return res.status(400).json({ message: "Hotel not found" });
        }

        const { name, located,review,price,meta } = req.body;
        const { country, state, city, address, latitude, longitude } = located;
        const newImage = req.file ? req.file.path : hotel.image;

        const cityCoordinates = await getCityCoordinates(city, country);
        if (!cityCoordinates) {
            return res.status(400).json({ message: 'Unable to geocode city' });
        }

        const distance = calculateDistance(cityCoordinates.lat, cityCoordinates.lng, latitude, longitude);

        const data = {
        name,
        located:{ country, state, city, address, latitude, longitude },
        distance: `${distance.toFixed(2)} km from ${city}`,
        review,
        price,
        meta,
        image:newImage
    }

        if (newImage && hotel.image) {
            const oldImagePath = path.join('uploads/', '..', hotel.image);
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error('Failed to delete old image:', err);
                }
            });
        }


        const updatedHotel = await hotelModel.findByIdAndUpdate(hotelId, data, { new: true });

        return res.status(200).json({ message: "Updated successfully", updatedHotel: updatedHotel });
    } catch (error) {
        console.log(error,'error**');
        return res.status(400).json({ message: 'Hotel not updated', error: error });
    }
};



// export const updateHotel = async (req,res) => {
//     try{
//         let hotel_Id = req.params.id
//         let hotel = await hotelModel.findById(hotel_Id)
//         if (!hotel) {
//             return res.status(400).json({message:"no hotel found"})
//         }


//         let updated_hotel = await hotelModel.findByIdAndUpdate(hotel_Id,req.body,{
//             new:true
//         })

//         return res.status(200).json({message: "updated successfully", updatedHotel: updated_hotel})

//     }catch(error){
//         console.log(error);
//         return res.status(400).json({message: "***************error***************"})
//     }
// }

export const deleteHotel = async (req,res) => {
    try {
        let hotel_Id = req.params.id
        await hotelModel.findByIdAndDelete(hotel_Id)
        return res.status(200).json({message: "deleted successfully"})

    } catch (error) {
        return res.status(400).json({message: "not deleted"})
    }
}



//-------------------------------- by The Nominatim API from OpenStreetMap (working)    (VIATOR**) --------------------------------------------------------------------

export const getAllHotels = async (req, res) => {
    console.log('9999999999999999999999999999999999');
    
    const { city, checkin_date, checkout_date } = req.query;

    if (!city ) {
        return res.status(400).json({ error: 'City, check-in date, and check-out date are required' });
    }

    try {
        // Perform a text search for hotels in the specified city
        const hotelResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: `hotels in ${city}, Himachal Pradesh`,
                format: 'json',
                addressdetails: 1
            }
        });

        // Filter results to ensure the city is valid
        const filteredHotels = hotelResponse.data.filter(hotel => {
            return hotel.display_name.toLowerCase().includes(city.toLowerCase());
        });

        res.json({ city, hotels: filteredHotels });
    } catch (error) {
        console.error('Error fetching hotels:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'An error occurred while fetching hotels' });
    }
};




//------------------------------------------------------------------------------------



// export const getAllHotels = async (req, res) => {
//     const { city, checkin_date, checkout_date } = req.query;
//     console.log(city,'city*****',checkin_date,'checkin_date******',checkout_date,'checkout_date******');
    

//     // Validate input parameters
//     if (!city || !checkin_date || !checkout_date) {
//         return res.status(400).json({ error: 'City, check-in date, and check-out date are required' });
//     }

//     try {
//         // Perform a text search for hotels in the specified city
//         const hotelResponse = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
//             params: {
//                 query: `hotels in ${city}`,
//                 key: "AIzaSyA0xTr1XKxofyzNolww3xesJ7Dy0h9am08"
//             }
//         });

//         //********-----------You must enable Billing on the Google Cloud Project at https://console.cloud.google.com/project/_/billing/enable Learn more at https://developers.google.com/m    

//         console.log(hotelResponse,'hotelResponse***');
        

//         // Extract and return hotel results
//         const hotels = hotelResponse.data.results;
//         console.log(hotels,'hotels******');
        
//         res.json(hotels);
//     } catch (error) {
//         // Log and return error information
//         console.error('Error fetching hotels:', error.response ? error.response.data : error.message);
//         res.status(500).json({ error: 'An error occurred while fetching hotels' });
//     }
// };















// export const HotelsBYCity = async (req, res) => {
    
//     const city = req.query.city;

    
  
//     if (!city) {
//       return res.status(400).json({ error: 'City parameter is required' });
//     }
  
//     try {
//       const response = await axios.get('https://amadeus-api.p.rapidapi.com/v2/shopping/hotel-search', {
//         headers: {
//           'X-RapidAPI-Host': 'amadeus-api.p.rapidapi.com',
//           'X-RapidAPI-Key': "7af34ec21amshf5b77d344e10327p10d9ebjsn8f583dc46a16"
//         },
//         params: {
//           cityCode: city, // Use the correct parameter for city code or name
//           checkInDate: '2024-08-15',
//           checkOutDate: '2024-08-16',
//           rooms: '1',
//           adults: '1',
//           children: '0'
//         }
//       });

      
  
//       res.json(response.data);
//     } catch (error) {
//       console.error('Error fetching hotels:', error);
//       res.status(500).json({ error: 'Error fetching hotels' });
//     }
//   }