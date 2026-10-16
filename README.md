# My Portfolio Website

## Editing content

All content lives in `src/content/site.json`; images live in `public/images/`.
Edit them by hand, or use the built-in admin at `/Jason/#/admin-LFG`:

1. Create a fine-grained GitHub token limited to this repo with **Contents: read and write**.
2. Open `#/admin-LFG`, paste the token, sign in.
3. Add, edit, reorder or delete profile links, experience, projects, the About text, and images, then **Save changes**.

Saving commits to `main`; the existing GitHub Pages workflow rebuilds and deploys (about a minute).
The token stays in your browser and is only sent to `api.github.com`.
