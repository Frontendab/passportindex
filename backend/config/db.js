import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const waitForDB = async () => {
    let connected = false;

    while (!connected) {
        try {
            await prisma.$connect();
            connected = true;
            console.log("✅ DB connected");
        } catch (err) {
            console.log("⏳ Waiting for DB...");
            await new Promise(res => setTimeout(res, 2000));
        }
    }
};

export { prisma, waitForDB };