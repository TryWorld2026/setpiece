# Legal documents

This folder holds the documents that ship with Setpiece and are linked from Settings → About and the download page.

## Status

`EULA.md` and `PRIVACY.md` are Alpha drafts. They describe the current local-first application accurately, but they
are not yet final commercial terms. The following must be confirmed before charging for an official build:

- the legal entity that operates Setpiece, its registered address and a dedicated contact route;
- the governing law, venue and any mandatory consumer-law wording;
- the paid-license scope, refund policy, taxes and invoice process;
- whether a separate data processing agreement is needed for business customers;
- the final trademark position for `Setpiece` and `造境`;
- any filing, ICP, privacy or export requirements that apply to the operator and distribution regions.

Do not call these documents final, and do not invent an entity, address or contact email to fill the gaps. The public
website is a static download site; the application has no Setpiece account system or cloud project store.

## Where they appear

- `legal/EULA.md` and `legal/PRIVACY.md` are copied into the desktop app as `legal/`.
- `site/download/public/legal/eula/` and `site/download/public/legal/privacy/` are the public HTML versions.
- `packages/openfilm/studio/ui/src/components/settings/SettingsModal.tsx` links to the public pages.

The source code remains available under the MIT License. The EULA must not be read as limiting rights granted by that
license or by any third-party component's license.
