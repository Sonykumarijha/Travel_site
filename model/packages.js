import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        }
    },
    {
        _id: false,
        timestamps: true
    }
);

const packageSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        package_type: {
            type: String,
            enum: ['honeymoon', 'adventurous', 'religious', 'festive', 'historical', 'offsite'],
            default: 'adventurous',
            required: false
        },
        image: {
            thumbnail: {
                type: String,  
                required: false
            },
            images: {
                type: [String],  
                required: false,
                validate: {
                    validator: function (value) {
                        return value.length <= 10;  
                    },
                    message: 'You can only upload up to 10 images.'
                }
            }
        },
        image_url: {
            thumbnail_url: {
                type: String,  
                required: false,
                default: ''
            },
            images_url: {
                type: [String],  
                required: false,
                default: []
            }
        },

        description: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            require: true
        },
        destination: {
            type: String,
            require: true
        },
        origin: {
            type: String,
            require: true
        },
        no_of_guest: {
            type: Number,
            default: 2
        },
        price: {
            type: Number,
            require: true
        },
        day_plan: {
            type: Object,
            require: true
        },
        review: {
            type: reviewSchema,
            required: false,
            default: []
        },
        meta: {
            type: Object,
            required: false,
        },

    },

    {
        versionKey: false,
        timestamps: true
    }
)

const packageModel = mongoose.model("Package", packageSchema)
export default packageModel