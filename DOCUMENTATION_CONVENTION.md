# Documentation Convention for Defense Game Project

## Overview

This document establishes strict conventions for all project documentation to ensure consistency, clarity, and effective asynchronous collaboration among team members.

## Document Categories & Naming Conventions

### 1. Product Requirements Documents (PRDs)
- **Location**: `/docs/prd/`
- **Naming**: `PRD-[FEATURE]-[YYYY-MM-DD].md`
- **Examples**:
  - `PRD-TOWER-DEFENSE-2024-01-15.md`
  - `PRD-ENEMY-SYSTEM-2024-01-20.md`

### 2. Technical Specifications
- **Location**: `/docs/specs/`
- **Naming**: `SPEC-[COMPONENT]-[VERSION].md`
- **Examples**:
  - `SPEC-GAME-ENGINE-v1.0.md`
  - `SPEC-NETWORKING-v2.1.md`

### 3. Strategy Documents
- **Location**: `/docs/strategy/`
- **Naming**: `STRATEGY-[DOMAIN]-[YYYY-MM-DD].md`
- **Examples**:
  - `STRATEGY-MONETIZATION-2024-01-15.md`
  - `STRATEGY-PLATFORM-EXPANSION-2024-02-01.md`

### 4. Development Guides
- **Location**: `/docs/guides/`
- **Naming**: `GUIDE-[TOPIC]-[LEVEL].md`
- **Examples**:
  - `GUIDE-SETUP-BEGINNER.md`
  - `GUIDE-DEPLOYMENT-ADVANCED.md`

### 5. Meeting Notes & Decisions
- **Location**: `/docs/meetings/`
- **Naming**: `MEETING-[YYYY-MM-DD]-[TOPIC].md`
- **Examples**:
  - `MEETING-2024-01-15-SPRINT-PLANNING.md`
  - `MEETING-2024-01-20-REVIEW.md`

### 6. Issues & Bug Reports
- **Location**: `/docs/issues/` (and GitHub Issues)
- **Naming**: `ISSUE-[TYPE]-[ID]-[YYYY-MM-DD].md`
- **Examples**:
  - `ISSUE-BUG-001-2024-01-15.md`
  - `ISSUE-FEATURE-002-2024-01-16.md`

## Document Structure Templates

### PRD Template
```markdown
# PRD: [Feature Name]

## Metadata
- **Author**: [Name]
- **Date Created**: [YYYY-MM-DD]
- **Last Updated**: [YYYY-MM-DD]
- **Status**: [Draft|In Review|Approved|Implemented]
- **Priority**: [Critical|High|Medium|Low]
- **Estimate**: [Story Points|Hours]

## 1. Executive Summary
[One-paragraph overview]

## 2. Problem Statement
### Current State
### Pain Points
### Impact Assessment

## 3. Proposed Solution
### Core Features
### User Stories
### Acceptance Criteria

## 4. Technical Requirements
### Dependencies
### Constraints
### Performance Requirements

## 5. Success Metrics
### KPIs
### Measurement Methods

## 6. Timeline & Milestones
### Phase 1: [Description] - [Date]
### Phase 2: [Description] - [Date]

## 7. Risk Assessment
### Technical Risks
### Business Risks
### Mitigation Strategies

## 8. Stakeholders
### Primary
### Secondary
### Approval Required
```

### Technical Spec Template
```markdown
# Technical Specification: [Component Name]

## Metadata
- **Author**: [Name]
- **Date**: [YYYY-MM-DD]
- **Version**: [vX.X]
- **Status**: [Draft|Review|Approved]

## 1. Overview
### Purpose
### Scope

## 2. Architecture
### System Design
### Data Flow
### API Design

## 3. Implementation Details
### Core Components
### Algorithms
### Data Structures

## 4. Integration Points
### Internal APIs
### External Dependencies

## 5. Testing Strategy
### Unit Tests
### Integration Tests
### Performance Tests

## 6. Deployment Considerations
### Environment Requirements
### Rollback Strategy
```

## File Organization Structure

```
/docs
├── README.md                    # Documentation index
├── templates/                   # Document templates
│   ├── prd-template.md
│   ├── spec-template.md
│   └── issue-template.md
├── prd/                        # Product Requirements
├── specs/                      # Technical Specifications
├── strategy/                   # Strategic Documents
├── guides/                     # How-to Guides
├── meetings/                   # Meeting Notes
├── issues/                     # Issue Documentation
└── archive/                    # Old/Deprecated Docs
```

## Writing Guidelines

### 1. Formatting Standards
- Use Markdown (.md) format
- Follow GitHub Flavored Markdown
- Use ATX-style headers (# ## ###)
- Use bullet points for lists
- Code blocks for technical content

### 2. Content Standards
- **Clarity**: Write for async readers - be explicit
- **Completeness**: Include all relevant context
- **Consistency**: Use same terminology throughout
- **Actionability**: Include next steps and owners
- **Traceability**: Reference related documents

### 3. Metadata Requirements
Every document MUST include:
- Author name
- Creation date
- Last update date
- Current status
- Priority (if applicable)

## Workflow & Process

### 1. Document Creation
1. Copy appropriate template from `/docs/templates/`
2. Follow naming conventions
3. Complete all required sections
4. Create PR for review

### 2. Review Process
1. Technical specs require peer review
2. PRDs require product owner approval
3. Strategy docs require stakeholder sign-off
4. Maintain review comments in PR

### 3. Version Control
- Use semantic versioning for specs
- Archive outdated documents
- Keep change history in commit messages
- Tag releases with documentation versions

### 4. Maintenance
- Review documents monthly
- Update status when completed
- Archive obsolete documents
- Cross-link related docs

## Tool Integration

### GitHub Integration
- Use GitHub Issues for bug tracking
- Use Projects for task management
- Use PR templates for consistency
- Use labels for categorization

### Documentation Tools
- Primary: Markdown in repository
- Secondary: Wiki for collaborative editing
- Diagrams: Mermaid for technical diagrams
- API Docs: OpenAPI/Swagger for APIs

## Quality Standards

### Document Quality Checklist
- [ ] Template followed completely
- [ ] All required sections filled
- [ ] Metadata accurate and complete
- [ ] Links to related documents
- [ ] Clear action items and owners
- [ ] Review process completed

### Common Pitfalls to Avoid
- Incomplete information
- Unclear ownership
- Missing timelines
- Vague requirements
- Outdated status

## Emergency Documentation

For urgent issues, use prefix `[EMERGENCY]` in document title and:
1. Create immediately in `/docs/issues/`
2. Follow up with proper documentation later
3. Ensure cross-team communication

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| v1.0 | 2024-01-11 | [Lead] | Initial convention framework |
```