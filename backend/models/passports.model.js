const mongoose = require("mongoose");
const { Schema } = mongoose;

const visa_requirements = new Schema(
    {
        _id: {
            type: String,
            require: true,
        },
        icon: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        visa_type: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
    }
)

const passport_schema = new Schema(
    {
        name_passport: {
            type: String,
            required: "Name passport is required!",
            trim: true
        },
        cover: {
            type: String,
            required: "Cover image's link is required!",
            trim: true
        },
        visa_requirements: {
            type: [visa_requirements],
            default: [],
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Passport = mongoose.model("Passports", passport_schema);

module.exports = Passport;