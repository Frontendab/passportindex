const asyncHandler = require("express-async-handler");
const Passport = require("../models/passports.model");
const { mongoose } = require("mongoose");

const get_nationalities = asyncHandler(async(req, res) => {
    const nationalities = await Passport.find({}, "name_passport");
    res.status(200).json({
        status: "success",
        length: nationalities.length,
        data: nationalities
    })
});

const get_passports = asyncHandler(async(req, res) => {
    const passports = await Passport.find({});

    if (!passports)
        return res.status(404).json({
            status: "error",
            message: "Doesn't found any passport"
        });

    res.status(200).json({
        status: "success",
        length: passports.length,
        data: passports
    })
});

const get_passport_by_id = asyncHandler(async(req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({
            status: "error",
            message: "Invalid object id!",
        });

    const passport = await Passport.findById(id);

    if (!passport)
        return res.status(404).json({
            status: "error",
            message: "Passport not found!"
        });

    res.status(200).json({
        status: "success",
        data: passport
    })
});

const get_map_data = asyncHandler(async(req, res) => {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({
            status: "error",
            message: "Invalid object id!",
        });

    const passport = await Passport.findById(id);

    if (!passport)
        return res.status(404).json({
            status: "error",
            message: "Passport not found!"
        });

    let color_map = {}

    passport.visa_requirements.forEach((item, _) => {
        const name = item.icon.split("flag-icon-")[1].toUpperCase()
        color_map[name] = item.color;
    });

    res.status(200).json({
        status: "success",
        data: color_map
    });
});

module.exports = {
    get_nationalities,
    get_passports,
    get_passport_by_id,
    get_map_data,
};