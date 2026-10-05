# CV maintenance

Confirmed on 2026-10-05: keep the CV general, in English and Italian, with
one A4 page per PDF and the original `public/images/profile-pic.jpeg`.
The October 5 refinement uses 10pt body text, concise project descriptions
and a consistent first-person summary. Keep all six selected projects.
The owner requested restoring Java in the existing skill lists. Do not infer
Java work experience or projects from this entry.

## Sources and privacy

- Public summaries: `public/resume/cv.md`, `cv.it.md`, and `cv-{en,it}.tex`.
- Full CV: ignored `private-src/cv-{en,it}.{md,tex}`.
- Assistant: `PROFILE_PUBLIC` in `app/api/chat/route.ts` and the ignored
  `private-src/chat-profile.md`.
- Public skill labels: `lib/i18n/translations/{en,it}.json`.

Keep professional roles separate from personal projects. Go, Python and
Swift are evidenced by personal projects. The current project selection is
Maestro, GymTree, claude-local-docs, Miniform, Therapist and the portfolio.
Describe Therapist as experimental. Keep detailed employer scope and
metrics in the full CV only.

Cockpit navigation lists every CV section in the menu. Experience contains
four employers; GymTree belongs to personal projects. The homepage offers
a direct public PDF link; full downloads continue to require access.

## Compile and verify

Use Tectonic from each source directory, so the relative photo path resolves:

```sh
(cd private-src && tectonic cv-en.tex && tectonic cv-it.tex)
(cd public/resume && tectonic cv-en.tex && tectonic cv-it.tex)
```

For each PDF, check `pdfinfo` reports one page, extract the text with
`pdftotext`, then render with `pdftoppm` and inspect the whole page for
clipping, spacing, accents and readable text. Keep private renders under
the ignored `private-src/` directory. Only after verification, run:

```sh
bun run encrypt:private
bun run check
bun run build
```

Never add private plaintext or private rendered previews to Git. The
encrypted `.enc` files are the deployable full CV and assistant profile.

## Encryption key configuration

The owner chose the same passphrase for access and encryption on 2026-10-05.
`CV_ACCESS_PASSWORD` holds that passphrase. `CV_DECRYPT_KEY` remains a
base64-encoded 32-byte AES key, derived with Node's `scryptSync` from the
passphrase and the base64-decoded random 32-byte `CV_DECRYPT_SALT`.
Derivation parameters: `N: 131072`, `r: 8`, `p: 1`,
`maxmem: 256 * 1024 * 1024`, output length 32 bytes.

Keep the passphrase, salt and derived key in local/Vercel environment
configuration, never in Git. The runtime reads the derived key; it does not
derive it on each request. Changing the encryption key requires re-encrypting
all seven blobs and deploying them with the matching production key.
`load-encrypted.ts` resolves reads within the three literal asset directories
so Next's tracing stays bounded. Keep `outputFileTracingIncludes` in place.

## Download filename

`cvDownloadFilename` in `lib/constants/site.ts` produces
`matteo-dante-cv-YYYY-MM-DD.pdf` using the current date in `Europe/Rome`.
The links set it at click time; the full PDF endpoint sets the same name
in `Content-Disposition`. Locale and access checks still select the
appropriate document. The source filenames and static public URLs remain
stable. The date denotes download day, not the date of a content revision.
For public PDFs, `next.config.ts` sets `Content-Disposition: inline` without
a filename. Vercel otherwise adds the source filename, which browsers prefer
over the dated `download` attribute. Verify the actual saved filename after
deployment, as this default header is absent from the local Next server.
