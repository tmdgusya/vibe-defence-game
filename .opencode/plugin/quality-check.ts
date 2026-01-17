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

      const now = Date.now();
      if (now - lastRunAt < cooldownMs) return;

      lastRunAt = now;

      const testOutputFile = `/tmp/opencode-test-${Date.now()}.log`;
      await $`sh -c ${'npm run test:run > ' + testOutputFile + ' 2>&1 || true'}`;

      const testOutput = await $`cat ${testOutputFile}`.quiet();
      const testText =
        testOutput.stdout?.toString() || testOutput.stderr?.toString() || '';

      const typecheckFile = `/tmp/opencode-typecheck-${Date.now()}.log`;
      await $`sh -c ${'npm run type-check > ' + typecheckFile + ' 2>&1 || true'}`;

      const typecheckOutput = await $`cat ${typecheckFile}`.quiet();
      const typecheckText =
        typecheckOutput.stdout?.toString() ||
        typecheckOutput.stderr?.toString() ||
        '';

      const hasTestFailures =
        testText.trim() !== '' &&
        (testText.includes('FAIL') ||
          testText.includes('error') ||
          testText.includes('failed'));
      const hasTypeErrors = typecheckText.trim() !== '';

      let message = `Post-turn quality check completed.\n\n`;

      if (hasTestFailures) {
        message += `--- TEST OUTPUT ---\n${testText}\n--- END TEST OUTPUT ---\n\n`;
      }

      if (hasTypeErrors) {
        message += `--- TYPE CHECK OUTPUT ---\n${typecheckText}\n--- END TYPE CHECK OUTPUT ---\n\n`;
      }

      if (!hasTestFailures && !hasTypeErrors) {
        message += `✅ All tests passed and no type errors found.\n`;
      }

      const sessionID = input.session?.id;
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
