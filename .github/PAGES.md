# GitHub Pages deployment

The public entry point is https://oybek-muminov.github.io/EduStart/.
GitHub Pages publishes the `main` branch's root directory using its existing
branch deployment. The root `index.html` redirects to `./site/`, where the
static website lives. No build or npm installation is required.

The redirect uses `location.replace` to preserve query strings and fragments
without adding a browser history entry. A meta refresh supports navigation
without JavaScript, and visible UZ/RU/EN links provide a manual fallback.
Language pages and assets retain their existing paths under `/EduStart/site/`.

Pushes to `main` trigger the existing Pages deployment. Product ZIPs and
versioned release artifacts are separate deliverables. They are not used as
the publishing source. A future switch to a custom Pages workflow could
publish `site/` directly, but requires access to change the Pages source.

For local checks, run `node tools/serve-site.cjs`, then in another terminal run
`node tools/check-static.cjs`. The checker validates all seven assets and the
UZ/RU/EN links over HTTP. It rewrites `docs/QA-STATIC-v1.0.0.json`; run it in a
temporary copy when preserving historical QA evidence. These are static and
HTTP checks, not mobile or browser testing.

After deployment, confirm that the successful Pages run and the `github-pages`
deployment refer to the intended commit. Check that the root URL and
`/EduStart/index.html` return HTTP 200 with the redirect, then verify HTTP 200
for `/EduStart/site/` and all seven files under `/EduStart/site/`. Compare
their bytes with that commit's files and check the UZ/RU/EN language links.
