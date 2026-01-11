# PRD Template

# PRD: [Feature Name]

## Metadata
- **Author**: [Your Name]
- **Date Created**: [YYYY-MM-DD]
- **Last Updated**: [YYYY-MM-DD]
- **Status**: [Draft|In Review|Approved|Implemented|Archived]
- **Priority**: [Critical|High|Medium|Low]
- **Estimate**: [Story Points|Days|Weeks]
- **Reviewers**: [Names]

## 1. Executive Summary
[Brief 2-3 sentence overview of the feature and its purpose]

## 2. Problem Statement
### Current State
[Describe the current situation or limitation]

### Pain Points
[List specific problems this solves]

### Impact Assessment
[Business/user impact if not addressed]

## 3. Proposed Solution
### Core Features
[List main features with brief descriptions]

### User Stories
```
As a [user type], I want [action], so that [benefit].
```

### Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

## 4. Game-Specific Requirements (Defense Games)
### Gameplay Mechanics
[How this feature affects tower defense gameplay]

### Balance Considerations
[Impact on game balance, difficulty, economy]

### Integration Points
[How this connects with existing systems]

## 5. Technical Requirements
### Dependencies
[List external or internal dependencies]

### Constraints
[Technical limitations or requirements]

### Performance Requirements
[Target performance metrics]

## 6. Success Metrics
### KPIs
[Key performance indicators to measure success]

### Measurement Methods
[How these metrics will be tracked]

## 7. Timeline & Milestones
### Phase 1: [Description] - [Date]
- [ ] Deliverable 1
- [ ] Deliverable 2

### Phase 2: [Description] - [Date]
- [ ] Deliverable 1
- [ ] Deliverable 2

## 8. Risk Assessment
| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|---------|---------------------|
| Risk 1 | High/Medium/Low | High/Medium/Low | [Strategy] |
| Risk 2 | High/Medium/Low | High/Medium/Low | [Strategy] |

## 9. Stakeholders
### Primary
- [Name] - [Role] - [Responsibility]
- [Name] - [Role] - [Responsibility]

### Secondary
- [Name] - [Role] - [Responsibility]

### Approval Required
- [ ] Product Owner
- [ ] Technical Lead
- [ ] Art Director
- [ ] QA Lead

## 10. Related Documents
- [Link to related PRD](./PRD-RELATED.md)
- [Link to technical spec](../specs/SPEC-RELATED.md)
- [Link to architecture decision](../adr/001-decision.md)

## 11. Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| v1.0 | [YYYY-MM-DD] | [Name] | Initial draft |
| v1.1 | [YYYY-MM-DD] | [Name] | Added technical requirements |

---

## Usage Instructions

1. Copy this template to `/docs/prd/` with proper naming: `PRD-[FEATURE]-[YYYY-MM-DD].md`
2. Replace bracketed placeholders [ ] with actual values
3. Complete all required sections before review
4. Update status as document progresses
5. Link related documents for traceability

## Review Process

1. **Draft Status**: Author completes document
2. **In Review Status**: Submit PR for team review
3. **Approved Status**: All stakeholders approve
4. **Implemented Status**: Feature is completed
5. **Archived Status**: Feature is obsolete

## Quality Checklist

- [ ] Template followed completely
- [ ] All required sections filled
- [ ] Metadata accurate and complete
- [ ] Clear success metrics defined
- [ ] Risks identified with mitigation
- [ ] Acceptance criteria testable
- [ ] Linked to related documents