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

export { analyzeCommit, verifyToken, searchStrategy, delay };