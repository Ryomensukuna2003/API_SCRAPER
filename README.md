# GitHub Repository Scanner for API Keys

This is a node program that scans GitHub repositories for API keys and other sensitive information in commit history.

## Flow of Code

1. **Initialization**: The program initializes by loading environment variables and setting up the database connection.

2. **Token Verification**: Verifies the GitHub PAT to increase rate limit.

3. **Strategy Execution**: One by one it starts scanning for API keys and sensitive information using predefined regex patterns.

4. **Commit Analysis**: For each commit found, it analyzes the changes to identify potential secrets.

5. **Logging Findings**: Any sensitive information discovered is logged to a database for further review.

6. **Periodic Scanning**: The program is designed to run periodically every 5 minutes, ensuring continuous monitoring for API leaks.

> **Note**: This program is deployed on Render and Render won't allow long-running processes. So workaround for this is to setup a GitHub Action that constantly pings at endpoint.