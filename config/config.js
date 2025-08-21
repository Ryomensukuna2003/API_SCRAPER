import dotenv from "dotenv";
dotenv.config();

export const appConfig = {
    PORT: process.env.PORT || 3000,
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/mydb?schema=public",
    GITHUB_TOKEN: process.env.GITHUB_TOKEN
}