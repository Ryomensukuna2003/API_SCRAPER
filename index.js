import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { regexes, envRegexes } from "./utils/regexs.js";
import { searchStrategies } from "./utils/searchStrategies.js";
import { handleDataEntry } from "./utils/handleDBcalls.js";

dotenv.config();

const red = '\x1b[31m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const blue = '\x1b[34m';
const reset = '\x1b[0m';

const __dirname = path.resolve();
const logFilePath = path.join(__dirname, "leak_log.txt");

// Initialize log file
if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, "", "utf8");
}

function formatIsoDate(isoString, options) {
    const date = new Date(isoString);

    if (options) {
        return new Intl.DateTimeFormat(options.locale || navigator.language, options).format(date); // Use Intl.DateTimeFormat if options provided
    } else {
        return date.toLocaleString(); // Fallback to toLocaleString()
    }
}


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const analyzeCommit = async (commitUrl) => {
    try {
        await delay(3000); // Increased rate limiting to 3 seconds

        const commitRes = await fetch(commitUrl, {
            headers: {
                "User-Agent": "Security-Research-Bot",
                "Accept": "application/vnd.github.v3+json",
                "Authorization": `token ${process.env.GITHUB_TOKEN}`
            }
        });

        if (!commitRes.ok) {
            console.log(yellow + `⚠️  Commit fetch failed: ${commitRes.status}` + reset);
            return;
        }

        const commitData = await commitRes.json();

        if (!commitData.files) return;

        let foundSecrets = false;

        for (const file of commitData.files) {
            // Skip very large files
            if (file.additions > 1000) continue;

            // Flag .env files immediately
            if (file.filename.match(/\.env(\..+)?$/)) {
                console.log(red + `🚨 .env file found: ${file.filename}` + reset);
                logFinding("ENV_FILE", `${file.filename} in ${commitData.html_url}`);
                foundSecrets = true;
            }

            if (file.patch) {
                // Check all our patterns
                [...regexes, ...envRegexes].forEach(pattern => {
                    const matches = file.patch.match(pattern.regex);
                    if (matches) {
                        console.log(red + `🔑 ${pattern.name} found in ${file.filename}` + reset);
                        console.log(blue + `🔗 ${commitData.html_url}` + reset);

                        // Log with FULL secret to file (DANGEROUS!)
                        logFinding(pattern.name, commitData.html_url, matches[0]);
                        foundSecrets = true;
                    }
                });
            }
        }

        return foundSecrets;
    } catch (error) {
        console.log(yellow + `⚠️  Error analyzing commit: ${error.message}` + reset);
    }
};


const logFinding = async (type, url, fullSecret = "") => {
    // Log to console with sample only (safer)
    console.log(green + `📝 fullSecret: ${fullSecret}` + reset);

    // Log to file with full secret (DANGEROUS - be careful!)
    const entry = `[${formatIsoDate(new Date().toISOString())}] ${type}: ${url}${fullSecret ? ` | FULL: ${fullSecret}` : ''}\n`;
    const API_KEY_DATA={
        key: fullSecret,
        FoundAt: formatIsoDate(new Date().toISOString()),
        api_name: type,
        commit_url: url
    }

    await handleDataEntry(API_KEY_DATA);

    fs.appendFileSync(logFilePath, entry, "utf8");
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

const runAllStrategies = async () => {
    console.log(blue + "🚀 Starting comprehensive API leak scan..." + reset);
    console.log(blue + `📝 Logs will be written to: ${logFilePath}` + reset);

    for (const strategy of searchStrategies) {
        await searchStrategy(strategy);
    }

    console.log(green + "\n✅ Scan completed! Check leak_log.txt for results." + reset);
};

// Verify token before running
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

// Main execution
const main = async () => {
    if (!process.env.GITHUB_TOKEN) {
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