# @microsoft/spfx-cli

## `spfx list-templates`

Lists all available templates from configured sources. The default GitHub source is always included; use `--local-source` and `--remote-source` to add more.

```bash
spfx list-templates
```

### Optional flags

| Flag | Default | Description |
|------|---------|-------------|
| `--spfx-version VERSION` | repo default branch | Branch/tag in the default template repo to use (e.g. `1.22`, `1.23-rc.0`) |
| `--template-url URL` | `https://github.com/SharePoint/spfx` | Custom GitHub template repository (default source) |
| `--local-source PATH` | — | Path to a local template folder to include (repeatable) |
| `--remote-source URL` | — | Additional public GitHub repo to include as a template source (repeatable) |

### Environment variables

| Variable | Description |
|----------|-------------|
| `SPFX_TEMPLATE_REPO_URL` | Equivalent to `--template-url` |

### Examples

Include a local template folder alongside the default source:

```bash
spfx list-templates --local-source ./my-templates
```

Include an additional GitHub repository:

```bash
spfx list-templates --remote-source https://github.com/my-org/my-templates
```

Target a specific SPFx version branch:

```bash
spfx list-templates --spfx-version 1.22
```
