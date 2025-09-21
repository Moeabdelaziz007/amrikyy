# Contributing to AuraOS

We welcome contributions to AuraOS! This document provides guidelines for contributing to the project.

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run development server: `npm run dev`

## Code Style

- **TypeScript/JavaScript**: We use ESLint and Prettier for code formatting
- **Python**: We use Black and Ruff for code formatting
- **Commits**: Follow conventional commit format (`feat:`, `fix:`, `docs:`, etc.)

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following our code style guidelines
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Run linting: `npm run lint`
7. Commit your changes with a descriptive message
8. Push to your fork and create a pull request

## Pull Request Requirements

- [ ] Code follows project style guidelines
- [ ] Tests pass (minimum 70% coverage)
- [ ] Documentation is updated if needed
- [ ] PR description clearly explains the changes
- [ ] Two approving reviews required for merge

## Design System

- Use Neon color palette (Electric Green #39FF14, Cyber Blue #00E5FF, Vivid Purple #9D00FF)
- Apply Glassmorphism effects for cards and controls
- Follow Cyberpunk aesthetic with appropriate fonts and effects
- Ensure accessibility standards (WCAG AA+) are met

## Testing

- Write unit tests for new functions
- Add integration tests for API endpoints
- Include E2E tests for critical user flows
- Test accessibility with screen readers

## Questions?

Feel free to open an issue for discussion or reach out to the maintainers.

Thank you for contributing! 🚀
