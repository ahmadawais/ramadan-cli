import ora from "ora";
import pc from "picocolors";

interface NpmPackage {
  "dist-tags": {
    latest: string;
  };
}

export async function updateCommand(currentVersion: string): Promise<void> {
  const spinner = ora("Checking for updates...").start();

  try {
    const response = await fetch("https://registry.npmjs.org/ramadan-cli");

    if (!response.ok) {
      throw new Error("Failed to fetch package information");
    }

    const data = (await response.json()) as NpmPackage;
    const latestVersion = data["dist-tags"].latest;

    spinner.stop();

    if (latestVersion === currentVersion) {
      console.log(
        pc.green(`✓ You're using the latest version (${currentVersion})`),
      );
      return;
    }

    const updateAvailable = compareVersions(currentVersion, latestVersion) < 0;

    if (updateAvailable) {
      console.log(
        pc.yellow(
          `\n📦 Update available: ${currentVersion} → ${latestVersion}`,
        ),
      );
      console.log(pc.cyan(`\n  Run the following command to update:\n`));
      console.log(pc.cyan(`  npm install -g ramadan-cli@latest`));
      console.log(pc.cyan(`  or`));
      console.log(pc.cyan(`  pnpm add -g ramadan-cli@latest\n`));
    } else {
      console.log(
        pc.green(`✓ You're using the latest version (${currentVersion})`),
      );
    }
  } catch (error) {
    spinner.fail("Failed to check for updates");
    const message = error instanceof Error ? error.message : String(error);
    console.error(pc.red(`Error: ${message}`));
  }
}

/**
 * Compare semantic versions
 * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split(".").map((p) => Number.parseInt(p, 10));
  const parts2 = v2.split(".").map((p) => Number.parseInt(p, 10));

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 < part2) return -1;
    if (part1 > part2) return 1;
  }

  return 0;
}
