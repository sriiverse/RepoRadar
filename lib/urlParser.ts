export interface ParsedRepo {
  owner: string;
  repo: string;
}

export function parseGitHubUrl(input: string): ParsedRepo | null {
  const trimmed = input.trim();

  // Pattern: owner/repo (shorthand)
  const shorthand = trimmed.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
  if (shorthand) {
    return { owner: shorthand[1], repo: shorthand[2] };
  }

  // Pattern: https://github.com/owner/repo or github.com/owner/repo
  const urlPattern = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+?)(?:\.git|\/.*)?$/
  );
  if (urlPattern) {
    return { owner: urlPattern[1], repo: urlPattern[2] };
  }

  return null;
}
