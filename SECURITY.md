# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of AuraOS seriously. If you discover a security vulnerability, please follow these steps:

1. **Do not** create a public GitHub issue for the vulnerability
2. Email security concerns to: [security@auraos.dev] or create a private security advisory
3. Include as much information as possible:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Security Measures

- All secrets and API keys must be stored in environment variables
- Firebase service account keys should never be committed to the repository
- All API endpoints implement proper authentication and authorization
- Input validation is enforced on all user inputs
- HTTPS is enforced in production environments
- Regular security audits are performed using CodeQL and other tools

## Response Timeline

- We will acknowledge receipt of your vulnerability report within 48 hours
- We will provide a detailed response within 7 days
- We will work on a fix and coordinate disclosure timing with you

Thank you for helping keep AuraOS secure!
