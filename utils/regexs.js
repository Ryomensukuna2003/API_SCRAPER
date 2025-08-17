// More comprehensive and accurate regex patterns
const regexes = [
    // AWS
    { name: "AWS Access Key", regex: /AKIA[0-9A-Z]{16}/g },
    { name: "AWS Secret Access Key", regex: /(?:aws_secret_access_key|AWS_SECRET_ACCESS_KEY)\s*[:=]\s*['"]?([A-Za-z0-9/+=]{40})['"]?/g },
    
    // Google
    { name: "Google API Key", regex: /AIza[0-9A-Za-z_-]{35}/g },
    { name: "Google OAuth", regex: /ya29\.[0-9A-Za-z_-]+/g },
    
    // GitHub
    { name: "GitHub Personal Access Token", regex: /ghp_[0-9a-zA-Z]{36}/g },
    { name: "GitHub OAuth Token", regex: /gho_[0-9a-zA-Z]{36}/g },
    { name: "GitHub App Token", regex: /ghu_[0-9a-zA-Z]{36}/g },
    { name: "GitHub Refresh Token", regex: /ghr_[0-9a-zA-Z]{76}/g },
    
    // Stripe
    { name: "Stripe Publishable Key", regex: /pk_live_[0-9a-zA-Z]{24}/g },
    { name: "Stripe Secret Key", regex: /sk_live_[0-9a-zA-Z]{24}/g },
    { name: "Stripe Restricted Key", regex: /rk_live_[0-9a-zA-Z]{24}/g },
    
    // Slack
    { name: "Slack Bot Token", regex: /xoxb-\d{12}-\d{12}-[a-zA-Z0-9]{24}/g },
    { name: "Slack User Token", regex: /xoxp-\d{12}-\d{12}-\d{12}-[a-zA-Z0-9]{32}/g },
    { name: "Slack Webhook", regex: /https:\/\/hooks\.slack\.com\/services\/T[0-9A-Z]+\/B[0-9A-Z]+\/[0-9A-Za-z]{24}/g },
    
    // Discord
    { name: "Discord Bot Token", regex: /[MN][A-Za-z\d]{23}\.[\w-]{6}\.[\w-]{27}/g },
    { name: "Discord Webhook", regex: /https:\/\/discord(?:app)?\.com\/api\/webhooks\/\d{17,19}\/[\w-]{68}/g },
    
    // Other Services
    { name: "Mailgun API Key", regex: /key-[0-9a-zA-Z]{32}/g },
    { name: "SendGrid API Key", regex: /SG\.[0-9A-Za-z_-]{22}\.[0-9A-Za-z_-]{43}/g },
    { name: "Twilio Account SID", regex: /AC[a-z0-9]{32}/g },
    { name: "Twilio Auth Token", regex: /SK[a-z0-9]{32}/g },
    { name: "PayPal Token", regex: /access_token\$production\$[0-9a-z]{16}\$[0-9a-f]{32}/g },
    { name: "Square Access Token", regex: /EAAA[a-zA-Z0-9]{60}/g },
    
    // JWT Tokens
    { name: "JWT Token", regex: /eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/g },
    
    // AI Service API Keys
    { name: "OpenAI API Key", regex: /sk-[a-zA-Z0-9]{48}/g },
    { name: "OpenAI Organization Key", regex: /org-[a-zA-Z0-9]{24}/g },
    { name: "Google Gemini API Key", regex: /AIza[0-9A-Za-z_-]{35}/g },
    { name: "Anthropic Claude API Key", regex: /sk-ant-api03-[a-zA-Z0-9_-]{95}/g },
    { name: "Claude Session Key", regex: /sk-ant-sid01-[a-zA-Z0-9_-]{43}/g },
    { name: "Cohere API Key", regex: /co\.[a-zA-Z0-9]{39}/g },
    { name: "Hugging Face Token", regex: /hf_[a-zA-Z0-9]{37}/g },
    { name: "Replicate API Key", regex: /r8_[a-zA-Z0-9]{40}/g },
    { name: "Stability AI API Key", regex: /sk-[a-zA-Z0-9]{48}/g },
    
    // Generic patterns that might catch others
    { name: "Possible API Key", regex: /['"](sk|pk|ak|api|token|key)_[a-zA-Z0-9_-]{20,}['"]/g },
];

// Environment variable patterns
const envRegexes = [
    { name: "Database URL", regex: /DATABASE_URL\s*=\s*['"]?[^'\s]+['"]?/g },
    { name: "API Key Variable", regex: /API_KEY\s*=\s*['"]?[A-Za-z0-9_-]{16,}['"]?/g },
    { name: "Secret Key Variable", regex: /SECRET_KEY\s*=\s*['"]?[A-Za-z0-9_-]{16,}['"]?/g },
    { name: "JWT Secret", regex: /JWT_SECRET\s*=\s*['"]?[A-Za-z0-9_-]{16,}['"]?/g },
    { name: "MongoDB URI", regex: /mongodb(\+srv)?:\/\/[^\s'"]+/g },
    { name: "PostgreSQL URI", regex: /postgres(ql)?:\/\/[^\s'"]+/g },
    { name: "OpenAI Key Variable", regex: /OPENAI_API_KEY\s*=\s*['"]?sk-[a-zA-Z0-9]{48}['"]?/g },
    { name: "Gemini Key Variable", regex: /GEMINI_API_KEY\s*=\s*['"]?AIza[0-9A-Za-z_-]{35}['"]?/g },
    { name: "Claude Key Variable", regex: /CLAUDE_API_KEY\s*=\s*['"]?sk-ant-[a-zA-Z0-9_-]{95,}['"]?/g },
    { name: "AI API Key Variable", regex: /(OPENAI|CLAUDE|GEMINI|ANTHROPIC)_API_KEY\s*=\s*['"]?[A-Za-z0-9_-]{20,}['"]?/g },
    { name: "Redis URL", regex: /redis:\/\/[^\s'"]+/g },
];


export { regexes, envRegexes };