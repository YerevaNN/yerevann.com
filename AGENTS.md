# Agent Instructions

## Git and WSL

- Work in WSL for Git operations against this Windows folder.
- WSL path:

```sh
/mnt/c/Users/hrant/Documents/YerevaNN website
```

- Repository remote:

```sh
git@github.com:YerevaNN/yerevann.com.git
```

- Main branch:

```sh
main
```

Use this baseline before making changes:

```sh
cd '/mnt/c/Users/hrant/Documents/YerevaNN website'
git status --short --branch
git pull --ff-only
```

After editing, commit and push from WSL:

```sh
cd '/mnt/c/Users/hrant/Documents/YerevaNN website'
git status --short
git add .
git commit -m 'Describe the update'
git push origin main
```

Notes:

- The WSL SSH key is authenticated with GitHub and can push to the repo.
- Do not use HTTPS remotes unless credentials are explicitly configured.
- Keep the `CNAME` file as `yerevann.com`; GitHub Pages uses it for the custom domain.
- This is a static GitHub Pages site served from the repository root on `main`.
