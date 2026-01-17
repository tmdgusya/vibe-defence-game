let hasEdited = false;
const cooldownMs = 15_000;
let lastRunAt = 0;

export const QualityCheck = async ({ $, client, project }: any) => {
  return {
    'tool.execute.after': async (input: any) => {
      const editTools = [
        'write',
        'edit',
        'replace_content',
        'create_text_file',
      ];

      if (!editTools.includes(input.tool)) {
        return;
      }

      const filePath =
        input.args?.filePath ||
        input.args?.file_path ||
        input.file_path ||
        input.filePath ||
        null;

      if (!filePath || !filePath.match(/\/src\/.*\.(ts|tsx)$/)) {
        return;
      }

      hasEdited = true;
    },

    event: async ({ event }: any) => {
      if (event.type !== 'session.idle') return;
      if (!hasEdited) return;

      const now = Date.now();
      if (now - lastRunAt < cooldownMs) return;

      lastRunAt = now;
      hasEdited = false;

      const outputFile = `/tmp/opencode-eslint-${Date.now()}.log`;
      await $`sh -c ${'npx eslint src/ 2>&1 | head -50 > ' + outputFile}`;

      const eslintOutput = await $`cat ${outputFile}`.quiet();
      const eslintText =
        eslintOutput.stdout?.toString() ||
        eslintOutput.stderr?.toString() ||
        '';

      const prettierFile = `/tmp/opencode-prettier-${Date.now()}.log`;
      await $`sh -c ${'npx prettier --check src/ 2>&1 | head -50 > ' + prettierFile}`;

      const prettierOutput = await $`cat ${prettierFile}`.quiet();
      const prettierText =
        prettierOutput.stdout?.toString() ||
        prettierOutput.stderr?.toString() ||
        '';

      const hasEslintIssues =
        eslintText.trim() !== '' && !eslintText.includes('no problems');
      const hasPrettierIssues =
        prettierText.trim() !== '' &&
        !prettierText.includes('All matched files');

      let message = `Post-turn quality check completed.\n\n`;

      if (hasEslintIssues) {
        message += `--- ESLINT OUTPUT ---\n${eslintText}\n--- END ESLINT ---\n\n`;
      }

      if (hasPrettierIssues) {
        message += `--- PRETTIER OUTPUT ---\n${prettierText}\n--- END PRETTIER ---\n\n`;
      }

      if (!hasEslintIssues && !hasPrettierIssues) {
        message += `✅ No ESLint or Prettier issues found.\n`;
      }

      if (hasEslintIssues || hasPrettierIssues) {
        message += `\nAttempting auto-fix...\n`;

        try {
          await $`npx eslint src/ --fix`.quiet();
          await $`npx prettier --write src/`.quiet();

          message += `✅ Auto-fix applied. Please verify the changes.\n`;
        } catch (error) {
          message += `⚠️ Auto-fix encountered errors: ${error}\n`;
        }
      }

      const sessionID = event.properties.sessionID;
      if (sessionID) {
        await client.session.prompt({
          path: { id: sessionID },
          body: {
            parts: [{ type: 'text', text: message }],
          },
        });
      }
    },
  };
};
