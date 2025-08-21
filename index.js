import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { appConfig } from "./config/config.js"
import { verifyToken } from "./services/verifyToken.js";
import { runAllStrategies } from "./services/strategies.js";

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

import { red, reset } from "./utils/colors.js"
dotenv.config();


// Main execution
const main = async () => {
    if (!appConfig.GITHUB_TOKEN) {
        console.log(red + "❌ GITHUB_TOKEN not found in environment variables" + reset);
        return;
    }

    const tokenValid = await verifyToken();
    if (!tokenValid) {
        console.log(red + "❌ Invalid or expired GitHub token" + reset);
        return;
    }

    await runAllStrategies();
};

// Run immediately
main();

// Run every 10 minutes
setInterval(main, 10 * 60 * 1000);

app.get("/", (req, res) => {
    res.send("API Leak Scanner is running!");
});

app.listen(appConfig.PORT, () => {
    console.log(`Server is running on http://localhost:${appConfig.PORT}`);
});