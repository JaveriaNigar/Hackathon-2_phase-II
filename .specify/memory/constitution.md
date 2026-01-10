<!--
Sync Impact Report:
- Version change: 0.1.0 → 1.0.0
- Modified principles: All principles newly defined for the project
- Added sections: Core Principles (6), Additional Constraints, Development Workflow, Governance
- Removed sections: None
- Templates requiring updates: N/A (new constitution)
- Follow-up TODOs: None
-->

# Hackathon II Todo Full-Stack Web App Constitution

## Core Principles

### I. Spec-Driven Development
All development must follow a spec-first approach: Specifications written → Feature approved → Implementation begins; Every code change must reference relevant specs; Requirements changes must update specs first before implementation.

### II. Full-Stack Integration
The application follows a monorepo approach with integrated frontend and backend: Next.js 16+ frontend with TypeScript and Tailwind CSS; FastAPI backend with Python 3.13+ and SQLModel ORM; Shared development context for cross-cutting changes.

### III. Test-First (NON-NEGOTIABLE)
TDD mandatory for all features: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced; Both backend API tests and frontend component tests required.

### IV. Security-First Design
Security considerations from the start: All API endpoints require JWT token authentication after user login; Each user can only access and modify their own tasks; Input validation and sanitization required for all user inputs.

### V. Multi-User Isolation
User data separation and privacy: Each user account has isolated task data; No cross-user data access allowed; User authentication and authorization implemented with Better Auth.

### VI. Persistent Data Management
Reliable data storage and retrieval: Neon Serverless PostgreSQL for persistent storage; Proper database schema design and migration strategies; Data backup and recovery considerations.

## Additional Constraints

Technology stack requirements:
- Frontend: Next.js 16+, TypeScript, Tailwind CSS, App Router
- Backend: FastAPI, Python 3.13+, SQLModel ORM
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth with JWT tokens
- Containerization: Docker Compose for local development

Performance standards:
- API response times under 500ms for standard operations
- Frontend page load times under 3 seconds
- Support for at least 100 concurrent users in testing environment

## Development Workflow

Spec-driven process:
- Read spec: @specs/[feature].md
- Implement backend: @backend/CLAUDE.md
- Implement frontend: @frontend/CLAUDE.md
- Test feature & iterate

Code review requirements:
- All pull requests require at least one reviewer
- Code must pass all tests before merging
- Spec compliance verification required
- Security considerations review for all new features

Quality gates:
- All automated tests must pass
- Code coverage must not decrease
- Linting and formatting checks must pass
- Spec alignment verification

## Governance

This constitution supersedes all other development practices for this project. All team members must adhere to these principles and guidelines. Amendments to this constitution require documentation of the change, team approval, and migration plan for existing codebase if needed.

All pull requests and code reviews must verify compliance with these principles. Complexity must be justified with clear benefits to the project. Use this constitution as the primary guidance document for all development decisions.

**Version**: 1.0.0 | **Ratified**: 2026-01-06 | **Last Amended**: 2026-01-06
