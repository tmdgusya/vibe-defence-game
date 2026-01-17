# Claude Code Hooks for Oh My OpenCode

이 디렉토리는 Claude Code hooks를 포함하고 있습니다. Oh My OpenCode와 통합되어 자동으로 실행됩니다.

## 설치된 Hooks

### 1. `quality-check.sh` (PostToolUse)

**목적**: Write/Edit 작업 후 코드 품질 검사 및 자동 수정

**동작 방식**:

- TypeScript/React 파일 (`src/**/*.{ts,tsx}`) 수정 시 자동 실행
- ESLint → Prettier → TypeScript 순서로 검사
- 가능한 경우 자동 수정 (ESLint --fix, Prettier --write)

**커스터마이징**:

- 파일 패턴 변경: 라인 14의 정규식 수정
- 검사 도구 추가/제거: 각 섹션 주석 참고

---

### 2. `bash-logger.sh` (PreToolUse)

**목적**: 모든 Bash 명령어 실행 로그 기록

**동작 방식**:

- Bash 도구 사용 전에 실행
- 명령어와 설명을 `~/.opencode/bash-commands.log`에 기록
- 타임스탬프와 함께 저장

**로그 확인**:

```bash
cat ~/.opencode/bash-commands.log
tail -f ~/.opencode/bash-commands.log  # 실시간 모니터링
```

---

### 3. `file-protector.sh` (PreToolUse)

**목적**: 민감한 파일 보호 (수정 차단)

**동작 방식**:

- Write/Edit 작업 전에 실행
- 보호된 패턴과 매칭되면 작업 차단 (exit code 2)
- 현재 보호 대상:
  - `.env` (환경 변수)
  - `package-lock.json` (의존성 잠금)
  - `.git/` (Git 메타데이터)
  - `node_modules/` (의존성 패키지)
  - `dist/`, `build/` (빌드 출력물)

**커스터마이징**:

```bash
# 파일 편집: .opencode/hooks/file-protector.sh
# PROTECTED_PATTERNS 배열에 추가/제거
PROTECTED_PATTERNS=(
  ".env"
  "credentials.json"  # 추가 예시
  "secrets/"
)
```

---

## 설정 파일

### `oh-my-opencode.json`

Oh My OpenCode 설정 파일에서 hooks를 관리합니다:

```json
{
  "claude_code": {
    "enabled": true,
    "hooks": {
      "PreToolUse": [
        {
          "matcher": "Bash",
          "hooks": [
            { "type": "command", "command": ".opencode/hooks/bash-logger.sh" }
          ]
        }
      ],
      "PostToolUse": [
        {
          "matcher": "Edit|Write",
          "hooks": [
            { "type": "command", "command": ".opencode/hooks/quality-check.sh" }
          ]
        }
      ]
    }
  }
}
```

**Hook 비활성화**:

```json
{
  "disabled_hooks": ["quality-check"]
}
```

---

## Hook 작성 가이드

### Hook 구조

```bash
#!/bin/bash
# Hook 이름 - 설명

# JSON input 파싱
TOOL=$(jq -r '.tool_name // .tool' 2>/dev/null)
FILE_PATH=$(jq -r '.tool_input.file_path // ""' 2>/dev/null)

# 로직 작성
# ...

# Exit codes:
# 0 - 성공 (작업 허용)
# 2 - 차단 (PreToolUse에서만 유효)
exit 0
```

### 사용 가능한 Hook 이벤트

- **PreToolUse**: 도구 실행 전 (차단 가능)
- **PostToolUse**: 도구 실행 후
- **UserPromptSubmit**: 사용자 프롬프트 제출 시
- **Stop**: Claude 응답 완료 시
- **Notification**: 알림 발생 시
- **SessionStart**: 세션 시작 시
- **SessionEnd**: 세션 종료 시

### JSON Input 예시

#### Write/Edit 도구

```json
{
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/home/user/project/src/App.tsx",
    "content": "..."
  }
}
```

#### Bash 도구

```json
{
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test",
    "description": "Run unit tests"
  }
}
```

---

## 트러블슈팅

### Hook이 실행되지 않을 때

1. **실행 권한 확인**:

   ```bash
   chmod +x .opencode/hooks/*.sh
   ```

2. **jq 설치 확인**:

   ```bash
   which jq || sudo apt-get install jq
   ```

3. **설정 파일 검증**:

   ```bash
   cat .opencode/oh-my-opencode.json | jq .
   ```

4. **Hook 로그 확인**:
   ```bash
   # stderr로 출력된 메시지 확인
   tail -f ~/.opencode/bash-commands.log
   ```

### Quality Check 비활성화

일시적으로 비활성화:

```json
{
  "claude_code": {
    "hooks": {
      "PostToolUse": []
    }
  }
}
```

---

## 더 알아보기

- [Claude Code Hooks 문서](https://code.claude.com/docs/en/hooks-guide)
- [Oh My OpenCode 문서](https://ohmyopencode.com/)
- [Hook 예제 모음](https://github.com/anthropics/claude-code/tree/main/examples/hooks)

---

## 기여

새로운 hook을 추가하고 싶으신가요?

1. `.opencode/hooks/` 디렉토리에 `.sh` 파일 생성
2. 실행 권한 부여: `chmod +x your-hook.sh`
3. `oh-my-opencode.json`에 hook 등록
4. 테스트 후 이 README 업데이트
