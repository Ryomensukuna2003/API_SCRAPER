import { handleDataEntry } from "./handleDBcalls.js";
import { green, reset } from "../utils/colors.js";

function formatIsoDate(isoString, options) {
    const date = new Date(isoString);

    if (options) {
        return new Intl.DateTimeFormat(options.locale || navigator.language, options).format(date); // Use Intl.DateTimeFormat if options provided
    } else {
        return date.toLocaleString(); // Fallback to toLocaleString()
    }
}

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

};


export { formatIsoDate, logFinding };