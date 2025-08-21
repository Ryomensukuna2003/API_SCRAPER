// Verify token before running
import { appConfig } from "../config/config.js";
import { red, green, reset } from "../utils/colors.js";

export const verifyToken = async () => {
    try {
        const res = await fetch("https://api.github.com/rate_limit", {
            headers: {
                "Authorization": `token ${appConfig.GITHUB_TOKEN}`
            }
        });

        const data = await res.json();
        console.log(green + `✅ Token verified. Rate limit: ${data.rate.remaining}/${data.rate.limit}` + reset);
        return true;
    } catch (error) {
        console.log(red + `❌ Token verification failed: ${error.message}` + reset);
        return false;
    }
};