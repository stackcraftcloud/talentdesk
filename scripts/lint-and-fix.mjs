import { execSync } from 'child_process';

function run(command) {
  try {
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { success: true, output: output.trim() };
  } catch (error) {
    const output = `${error.stdout || ''}${error.stderr || ''}`.trim();
    return { success: false, output };
  }
}

function logSection(title) {
  console.log(`\n=== ${title} ===\n`);
}

logSection('Auto-fixing lint issues');
const fixResult = run('npm run lint:fix');
if (fixResult.output) {
  console.log(fixResult.output);
}

logSection('Checking for remaining lint issues');
const lintResult = run('npm run lint');

if (lintResult.output) {
  console.log(lintResult.output);
}

if (lintResult.success) {
  logSection('Result');
  console.log('Lint passed. No remaining issues.');
  process.exit(0);
}

logSection('Result');
console.log('Auto-fix completed, but manual fixes are still required.');
console.log('Review the ESLint output above and fix remaining violations.');
process.exit(1);
