export const searchStrategies = [
    {
        name: "OpenAI API Keys",
        url: "https://api.github.com/search/commits?q=sk-+openai+author-date:>2024-08-15&sort=author-date&order=desc&per_page=5"
    },
    {
        name: "Claude API Keys", 
        url: "https://api.github.com/search/commits?q=sk-ant+anthropic+author-date:>2024-08-15&sort=author-date&order=desc&per_page=5"
    },
    {
        name: "Gemini API Keys",
        url: "https://api.github.com/search/commits?q=AIza+gemini+author-date:>2024-08-15&sort=author-date&order=desc&per_page=5"
    },
    {
        name: "General AI Keys",
        url: "https://api.github.com/search/commits?q=OPENAI_API_KEY+CLAUDE_API_KEY+author-date:>2024-08-15&sort=author-date&order=desc&per_page=5"
    },
    // Strategy 1: Search for recent commits with common secret keywords
    {
        name: "Recent API Key Commits",
        url: "https://api.github.com/search/commits?q=API_KEY+author-date:>2024-08-01&sort=author-date&order=desc&per_page=10"
    },
    {
        name: "Recent Secret Commits", 
        url: "https://api.github.com/search/commits?q=SECRET_KEY+author-date:>2024-08-01&sort=author-date&order=desc&per_page=10"
    },
    {
        name: "Recent .env Commits",
        url: "https://api.github.com/search/commits?q=filename:.env+author-date:>2024-08-01&sort=author-date&order=desc&per_page=10"
    },
    // Strategy 2: Search for specific patterns
    {
        name: "AWS Key Commits",
        url: "https://api.github.com/search/commits?q=AKIA+author-date:>2024-08-01&sort=author-date&order=desc&per_page=10"
    },
    {
        name: "GitHub Token Commits", 
        url: "https://api.github.com/search/commits?q=ghp_+author-date:>2024-08-01&sort=author-date&order=desc&per_page=10"
    }
];
