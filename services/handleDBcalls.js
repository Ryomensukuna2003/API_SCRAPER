import { PrismaClient } from "../generated/prisma/index.js";
import dotenv from "dotenv";
import { red, reset } from "../utils/colors.js"

dotenv.config();


const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const handleDataEntry = async (API_KEY_DATA) => {
    try {
        // First check if the key already exists
        const existingKey = await prisma.aPI_KEY.findUnique({
            where: {
                key: API_KEY_DATA.key
            }
        });

        if (existingKey) {
            console.log(`API key already exists in database: ${API_KEY_DATA.api_name}`);
            return existingKey;
        }

        // If key doesn't exist, create new entry
        const apiKeyEntry = await prisma.aPI_KEY.create({
            data: {
                key: API_KEY_DATA.key,
                FoundAt: API_KEY_DATA.FoundAt,
                api_name: API_KEY_DATA.api_name,
                commit_url: API_KEY_DATA.commit_url
            }
        });

        console.log(`✅ New API key saved to database: ${API_KEY_DATA.api_name}`);
        return apiKeyEntry;

    } catch (error) {
        if (error.code === 'P2002') {
            // Unique constraint violation
            console.log(`⚠️  Duplicate key detected: ${API_KEY_DATA.api_name} (already in database)`);
        } else {
            console.error(red + `❌ Error saving API key to database: ${error.message}` + reset);
        }
        return null;
    }
};