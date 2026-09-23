# Legal source texts

Unverified source material for the three legal pages (`/aviso-legal/`,
`/politica-de-privacidad/`, `/politica-de-cookies/`), moved unchanged from
`apps/web/src/lib/legal/` in phase 2. **Nothing in `apps/web` reads these
files.** The actual pages (`PlantillaLegal.tsx`) render the real NAP from
`@site/content`'s `business` plus hand-written `[pendiente]` placeholders for
every section's legal text — the client's lawyer/gestor drafts the real
copy directly into the page component, not from these `.md` files.

**Known conflict, pending the owner's confirmation:** these documents give a
different NIF, razón social and contact email than
`packages/content/src/data/business.ts`:

- `business.ts` → `email: 'gabriel.pavivasa@gmail.com'`
- These `.md` files → `pavialbufera@gmail.com` (and a razón social / NIF not
  present anywhere else in the codebase)

Do not resolve this silently by editing either side — see the phase 2
report's "questions" for the recommendation. Whoever writes the final legal
copy needs to know which email/razón social is actually correct.
