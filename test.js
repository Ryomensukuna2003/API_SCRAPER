import fetch from "node-fetch";

console.log("Testing GitHub API...");

try {
    const response = await fetch("https://api.github.com/events", {
        headers: { "User-Agent": "test" }
    });
    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Data type:", typeof data);
    console.log("Is array:", Array.isArray(data));
    if (Array.isArray(data)) {
        console.log("Array length:", data.length);
        console.log("First event type:", data[0]?.type);
    } else {
        console.log("Response:", JSON.stringify(data, null, 2));
    }
} catch (error) {
    console.log("Error:", error.message);
}
