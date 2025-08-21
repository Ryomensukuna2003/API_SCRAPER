import { searchStrategies } from "../utils/searchStrategies.js";
import { analyzeCommit } from "./findingService.js";
import { red, green, blue, yellow, reset } from "../utils/colors.js";
import { appConfig } from "../config/config.js";
import { delay } from "../utils/utils.js";

const searchStrategy = async (strategy) => {
    console.log(blue + `\n🔍 Running strategy: ${strategy.name}` + reset);

    try {
        await delay(5000); // Increased rate limiting between strategies to 5 seconds

        const res = await fetch(strategy.url, {
            headers: {
                "User-Agent": "Security-Research-Bot",
                "Accept": "application/vnd.github.v3+json",
                "Authorization": `token ${appConfig.GITHUB_TOKEN}`
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
                red + `Found secrets in ${secretsFound} commits!` + reset :
                green + `No secrets found in this batch` + reset
            );
        }

    } catch (error) {
        console.log(red + `❌ Strategy error: ${error.message}` + reset);
    }
};


export const runAllStrategies = async () => {
    console.log(blue + "Starting API leak scan" + reset);

    for (const strategy of searchStrategies) {
        await searchStrategy(strategy);
    }

    console.log(green + "\n ------------------ Scan completed! Check Database for results. ------------------" + reset);
};
