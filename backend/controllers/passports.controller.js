import asyncHandler from "express-async-handler";
import countries from "../countries.json" with { type: "json" };
import { prisma } from "../config/db.js";

const get_nationalities = asyncHandler(async(req, res) => {
    const nationalities = await prisma.passport.findMany({
        select: {
            id: true,
            name_passport: true
        }
    });
    res.status(200).json({
        status: "success",
        length: nationalities.length,
        data: nationalities
    })
});

const get_passport_by_id = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const passport = await prisma.passport.findUnique({
        where: {
            id
        },
        include: {
            visa_requirements: true
        }
    });

    
    if (!passport)
        return res.status(404).json({
            status: "error",
            message: "Passport not found!"
        });

    const visa_requirements = await Promise.all(
        passport.visa_requirements.map(async (item) => {
            const iso2 = item.icon.split("flag-icon-")[1].toUpperCase();
            const passport_by_name = await prisma.passport.findUnique({
                where: {
                    name_passport: item.name.toUpperCase()
                }
            });
            return {
                id: passport_by_name.id,
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

    const passport = await prisma.passport.findUnique({
        where: {
            id
        },
        include: {
            visa_requirements: true
        }
    });

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

export {
    get_nationalities,
    get_passport_by_id,
    get_map_data,
};