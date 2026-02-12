# Pre-push checklist

Use this before your first push (and when in doubt):

- [ ] `.env` is **not** listed in `git status` (it must be ignored)
- [ ] No API keys, passwords, or tokens in any committed file
- [ ] `.env.example` is committed (template only, no real keys)

Quick check:
```bash
git status
git check-ignore -v .env   # should say .env is ignored
```
