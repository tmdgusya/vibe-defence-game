# Issue Template

# ISSUE: [Brief Issue Title]

## Metadata
- **Reporter**: [Your Name]
- **Date Reported**: [YYYY-MM-DD]
- **Last Updated**: [YYYY-MM-DD]
- **Status**: [Open|In Progress|In Review|Resolved|Closed|Reopened]
- **Priority**: [Critical|High|Medium|Low]
- **Type**: [Bug|Feature|Improvement|Question|Task]
- **Assignee**: [Person responsible]
- **Labels**: [tag1,tag2,tag3]
- **Related Issue ID**: [GitHub issue number if applicable]

## 1. Issue Summary
### One-Sentence Summary
[Brief, clear description of the issue]

### Impact Assessment
- **Users Affected**: [Number or percentage of users]
- **Severity**: [Blocking/Major/Minor/Trivial]
- **Business Impact**: [Revenue/user experience/technical debt]

## 2. Issue Classification
### Type Details
**Bug**: [Describe what's broken vs. expected behavior]
**Feature**: [New capability requested]
**Improvement**: [Enhancement to existing functionality]
**Question**: [Clarification needed]
**Task**: [Work item without bug/feature nature]

### Reproducibility (for bugs)
- **Can Reproduce**: [Always|Sometimes|Rarely|Unable]
- **First Seen**: [Version or date]
- **Frequency**: [Every time|X% of cases|Random]

## 3. Environment & Context
### Affected Components
- [ ] **Game Engine**: [Unity version, Unreal version, etc.]
- [ ] **Platform**: [Windows/Mac/iOS/Android/Web]
- [ ] **System**: [Specific game system affected]
- [ ] **Network**: [Online/Offline/Multiplayer component]

### System Configuration
```json
{
  "platform": "Windows 11",
  "game_version": "1.2.3",
  "device": "Gaming PC",
  "memory": "16GB",
  "graphics": "RTX 3080"
}
```

### Reproduction Steps
1. [Step 1: Clear, specific action]
2. [Step 2: Clear, specific action]
3. [Step 3: Clear, specific action]
4. [Step 4: Observe issue]

### Expected Behavior
[Describe what should happen]

### Actual Behavior
[Describe what actually happens]

## 4. Technical Details
### Error Messages
```
[Copy-paste exact error messages with stack traces]
```

### Logs & Diagnostics
[Attach or link to relevant log files, crash reports, etc.]

### Code Context
```csharp
// Relevant code snippet where issue occurs
public void ProblematicMethod() {
    // Highlight problematic line
    throw new Exception("Error message");
}
```

### Performance Impact
- **CPU Usage**: [Increase/decrease, numbers if available]
- **Memory Usage**: [Increase/decrease, numbers if available]
- **Frame Rate**: [Impact on FPS, numbers if available]
- **Load Times**: [Impact on loading times]

## 5. Visual Evidence
### Screenshots
[Attach screenshots showing the issue]
- **Before**: [Screenshot of expected state]
- **After**: [Screenshot showing problem]

### Videos
[Link to screen recording showing reproduction]
- **Reproduction Video**: [Link]
- **Explanation**: [What the video shows]

### Diagrams
[Any flowcharts or architectural diagrams that help explain]

## 6. Root Cause Analysis
### Hypothesis
[Best guess at what's causing the issue]

### Investigation Notes
- **Test 1**: [What was tested, results]
- **Test 2**: [What was tested, results]
- **Test 3**: [What was tested, results]

### Related Issues
- **Issue #123**: [Related problem]
- **Commit abc123**: [Change that may have introduced issue]
- **PR #456**: [Related pull request]

## 7. Solution Strategy
### Proposed Solutions
#### Option 1: [Solution Name]
- **Approach**: [How to implement]
- **Pros**: [Advantages]
- **Cons**: [Disadvantages]
- **Effort**: [Story points or hours]

#### Option 2: [Solution Name]
- **Approach**: [How to implement]
- **Pros**: [Advantages]
- **Cons**: [Disadvantages]
- **Effort**: [Story points or hours]

### Recommended Solution
**Chosen Option**: [Option number/name]
**Reasoning**: [Why this solution is preferred]

## 8. Implementation Plan
### Development Tasks
- [ ] **Task 1**: [Description] - [Assignee] - [Story points]
- [ ] **Task 2**: [Description] - [Assignee] - [Story points]
- [ ] **Task 3**: [Description] - [Assignee] - [Story points]

### Testing Requirements
- [ ] **Unit Tests**: [What needs testing]
- [ ] **Integration Tests**: [What needs testing]
- [ ] **Manual Testing**: [What needs manual verification]
- [ ] **Performance Tests**: [What needs performance validation]

### Dependencies
- [ ] **Feature A**: [Must be completed first]
- [ ] **Team B**: [Input needed from other team]

## 9. Verification & Acceptance
### Definition of Done
- [ ] Code is implemented and tested
- [ ] All tests pass (unit, integration, manual)
- [ ] Documentation is updated
- [ ] Performance impact is acceptable
- [ ] No regressions introduced

### Test Scenarios
1. [Test case 1: Steps to verify fix]
2. [Test case 2: Edge case testing]
3. [Test case 3: Regression testing]

### Rollback Plan
**If Fix Causes Problems:**
- **How to Rollback**: [Steps to revert change]
- **Impact of Rollback**: [What users would experience]

## 10. Communication Plan
### Stakeholder Notifications
- **Users**: [How and when to notify users]
- **Internal Teams**: [Who needs to know]
- **Management**: [Status reporting requirements]

### Release Notes
**Draft Release Note**:
[What will be communicated to users about this fix/feature]

## 11. Related Documents
- [Technical Spec](../specs/SPEC-RELATED.md)
- [PRD](../prd/PRD-RELATED.md)
- [Architecture Decision](../adr/001-decision.md)
- [GitHub Issue](https://github.com/org/repo/issues/123)

## 12. Follow-up Actions
### Monitoring
- **Metrics to Watch**: [Performance indicators post-fix]
- **Duration**: [How long to monitor]
- **Alerts**: [What should trigger investigation]

### Learning
- **Process Improvements**: [How to prevent similar issues]
- **Documentation Updates**: [What docs need updating]
- **Team Training**: [Any knowledge gaps identified]

## 13. Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| v1.0 | [YYYY-MM-DD] | [Name] | Issue reported |
| v1.1 | [YYYY-MM-DD] | [Name] | Added root cause analysis |

---

## Usage Instructions

1. Copy this template to `/docs/issues/` with naming: `ISSUE-[TYPE]-[ID]-[YYYY-MM-DD].md`
2. Create corresponding GitHub Issue for tracking
3. Link GitHub issue number in metadata
4. Update status as issue progresses

## Issue Management Process

### Bug Reporting
1. **Discovery**: Issue found during testing/production
2. **Documentation**: Complete this template
3. **Triage**: Team reviews and prioritizes
4. **Assignment**: Developer assigned to fix
5. **Implementation**: Fix developed and tested
6. **Verification**: QA validates fix
7. **Release**: Fix deployed to production

### Feature Requests
1. **Request**: User/team proposes feature
2. **Analysis**: Product team evaluates
3. **PRD Creation**: Requirements documented
4. **Prioritization**: Added to roadmap
5. **Development**: Implemented in sprint
6. **Release**: Feature goes live

## Priority Guidelines

### Critical (P0)
- Game crashes or data loss
- Security vulnerabilities
- Blocking revenue generation
- **SLA**: Fix within 24 hours

### High (P1)
- Major functionality broken
- Performance degradation
- High user impact
- **SLA**: Fix within 1 week

### Medium (P2)
- Minor functionality issues
- Inconvenience but workaround exists
- Low user impact
- **SLA**: Fix within 2 weeks

### Low (P3)
- Cosmetic issues
- Minor improvements
- Nice to have
- **SLA**: Fix when time permits

## Quality Standards

- Clear, reproducible steps provided
- All required sections completed
- Screenshots/logs attached for bugs
- Acceptance criteria clearly defined
- Follow-up actions documented