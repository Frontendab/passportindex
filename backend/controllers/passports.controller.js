const asyncHandler = require("express-async-handler");
const Passport = require("../models/passports.model");
const { mongoose } = require("mongoose");
const countries = require("../countries.json");


const get_nationalities = asyncHandler(async(req, res) => {
    const nationalities = await Passport.find({}, "name_passport");
    res.status(200).json({
        status: "success",
        length: nationalities.length,
        data: nationalities
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

    const visa_requirements = await Promise.all(
        passport.visa_requirements.map(async (item) => {
            const iso2 = item.icon.split("flag-icon-")[1].toUpperCase();

            const passport_by_name = await Passport.findOne({
                name_passport: item.name.toUpperCase()
            });

            return {
                _id: passport_by_name?._id,
                icon: iso2,
                name: item.name,
                visa_type: item.visa_type,
                color: item.color
            };
        })
    );

    passport["visa_requirements"] = visa_requirements;

    res.status(200).json({
        status: "success",
        data: passport,
    });

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
        const name = item.icon.split("flag-icon-")[1].toUpperCase();
        color_map[name] = item.color;
    });

    res.status(200).json({
        status: "success",
        data: color_map,
        countries
    });
});

module.exports = {
    get_nationalities,
    get_passport_by_id,
    get_map_data,
};