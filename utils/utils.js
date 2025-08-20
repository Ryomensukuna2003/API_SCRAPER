import dotenv from "dotenv";
dotenv.config();
import { analyzeCommit } from "./findingService"

// Verify token before running
const red = '\x1b[31m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const blue = '\x1b[34m';
const reset = '\x1b[0m';

const verifyToken = async () => {
    try {
        const res = await fetch("https://api.github.com/rate_limit", {
            headers: {
                "Authorization": `token ${process.env.GITHUB_TOKEN}`
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

const searchStrategy = async (strategy) => {
    console.log(blue + `\n🔍 Running strategy: ${strategy.name}` + reset);

    try {
        await delay(5000); // Increased rate limiting between strategies to 5 seconds

        const res = await fetch(strategy.url, {
            headers: {
                "User-Agent": "Security-Research-Bot",
                "Accept": "application/vnd.github.v3+json",
                "Authorization": `token ${process.env.GITHUB_TOKEN}`
            }
        });

        if (!res.ok) {
            console.log(red + `❌ Search failed: ${res.status} ${res.statusText}` + reset);
            const errorData = await res.text();
            console.log(red + errorData + reset);
            return;
        }

        const data = await res.json();
        console.log(green + `📊 Found ${data.total_count} potential commits` + reset);

        if (data.items && data.items.length > 0) {
            console.log(yellow + `🔎 Analyzing first ${data.items.length} commits...` + reset);

            let secretsFound = 0;
            for (const item of data.items) {
                const foundSecret = await analyzeCommit(item.url);
                if (foundSecret) secretsFound++;
            }

            console.log(secretsFound > 0 ?
                red + `🚨 Found secrets in ${secretsFound} commits!` + reset :
                green + `✅ No secrets found in this batch` + reset
            );
        }

    } catch (error) {
        console.log(red + `❌ Strategy error: ${error.message}` + reset);
    }
};

export { verifyToken, searchStrategy };