// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type { Terminal } from '@rushstack/terminal';
import {
  PublicGitHubRepositorySource,
  type SPFxTemplateRepositoryManager
} from '@microsoft/spfx-template-api';

export const DEFAULT_GITHUB_REPO: string = 'https://github.com/SharePoint/spfx';
export const SPFX_TEMPLATE_REPO_URL_ENV_VAR_NAME: string = 'SPFX_TEMPLATE_REPO_URL';

export const TEMPLATE_URL_DESCRIPTION: string = `URL of the GitHub template repository. Defaults to ${DEFAULT_GITHUB_REPO}.`;
export const SPFX_VERSION_DESCRIPTION: string =
  'The branch name in the template repository to use (e.g., "1.22", "1.23-rc.0"). ' +
  "Defaults to the repository's default branch (main).";

/**
 * Parses a GitHub (or GHE) URL that may contain a `/tree/<ref>` path segment.
 * Returns the clean repository URL (without `.git` or trailing slashes) and the optional branch ref.
 */
export function parseGitHubUrlAndRef(rawUrl: string): { repoUrl: string; urlBranch: string | undefined } {
  const normalized: string = rawUrl.trim().replace(/\/+$/, '');
  // Match https://<host>/owner/repo[.git]/tree/<ref> — host-agnostic to support GHE.
  // Only the first path segment after /tree/ is captured as the ref. This means branch
  // names containing slashes (e.g. `feature/foo`) cannot be expressed via a /tree/ URL;
  // use the --spfx-version flag to specify such refs directly.
  const treeMatch: RegExpMatchArray | null = normalized.match(
    /^(?<repo>https?:\/\/[^/]+\/[^/]+\/[^/]+?)(?:\.git)?\/tree\/(?<ref>[^/]+)/
  );
  if (treeMatch?.groups) {
    const { repo, ref } = treeMatch.groups as { repo: string; ref: string };
    return { repoUrl: repo, urlBranch: ref };
  }
  return { repoUrl: normalized.replace(/\.git$/, ''), urlBranch: undefined };
}

/**
 * Parses the default GitHub source URL, emits a warning if `--template-url` contains a `/tree/`
 * branch that conflicts with `--spfx-version`, then registers a `PublicGitHubRepositorySource`
 * on the given manager. Used by both `create` and `list-templates`.
 */
export function addDefaultGitHubSource(
  manager: SPFxTemplateRepositoryManager,
  rawUrl: string,
  spfxVersion: string | undefined,
  terminal: Terminal
): void {
  const { repoUrl, urlBranch } = parseGitHubUrlAndRef(rawUrl);

  if (spfxVersion !== undefined && urlBranch !== undefined) {
    terminal.writeWarningLine(
      `--template-url contains a branch ('/tree/${urlBranch}'). ` +
        `--spfx-version "${spfxVersion}" will take precedence.`
    );
  }
  const ref: string | undefined = spfxVersion ?? urlBranch;

  terminal.writeLine(`Using GitHub template source: ${repoUrl}${ref ? ` (branch: ${ref})` : ''}`);
  manager.addSource(new PublicGitHubRepositorySource(repoUrl, ref, terminal));
}
