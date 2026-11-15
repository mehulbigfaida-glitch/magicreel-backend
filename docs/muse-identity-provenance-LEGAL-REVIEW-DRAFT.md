# MagicReel Muse Identity & Provenance — Technical and Legal Review Draft

**Status: IMPLEMENTATION DRAFT — PROVISIONAL — FOR INDIAN IP COUNSEL REVIEW**

## Current evidence chain
- Customer accepts a versioned declaration before paid generation. The consent record stores exact wording/version, acceptance time, account, reference asset ID, model and prompt version.
- The selected candidate and generated production assets are recorded against the saved Muse.
- The provenance manifest records account/Muse identifiers, creation and issue timestamps, consent record/version, selected candidate, asset identifiers, model and prompt version.
- SHA-256 fingerprints are computed over downloaded image bytes for the source reference, collage (when available), selected candidate and four saved Muse assets.
- The manifest is serialized using deterministic key ordering and hashed with SHA-256.
- When the configured Ed25519 key pair is available, the manifest hash is digitally signed. The certificate stores the signature, public key and signing-key fingerprint. The code verifies that the configured public/private key pair matches before issuing a signature.
- Public verification recomputes the manifest hash and verifies the Ed25519 signature. It reports a hash mismatch, valid signature, invalid signature or unsigned/hash-only record.
- An authenticated owner-only endpoint returns the full manifest and recorded consent evidence for the customer's evidence file.

## Current limitations
- Certificates remain provisional. A hash-only record may be issued when the signing key is not configured; it is explicitly marked unsigned.
- The signing key must be provisioned and protected in Railway secrets. The private key must never be returned by an API or committed to source control.
- The current issue timestamp is the application/database timestamp. There is not yet an independent RFC 3161/OpenTimestamps timestamp proof or external append-only anchor.
- SHA-256 image fingerprints identify the exact bytes fetched at generation time. They do not independently prove who took a photograph, who appears in it, or who owns rights in it.
- The public endpoint deliberately does not disclose customer account IDs, original source photos, consent text or private Cloudinary URLs.
- A manifest hash and signature show integrity and issuer attestation; they do not decide copyrightability, authorship, ownership, licensing or exclusivity.

## Questions for counsel
1. Confirm appropriate customer declarations, adult likeness consent, source-photo rights and commercial use permissions.
2. Confirm rights allocation between customer, MagicReel and image-generation providers, including provider/API terms.
3. Approve or replace all certificate and verification language; do not call this government registration or guaranteed exclusive ownership.
4. Advise on privacy, retention, withdrawal, deletion, revocation, complaint and takedown requirements.
5. Advise whether trusted third-party timestamping, digital signatures, C2PA, notarisation or an independent public ledger is appropriate and proportionate.
6. Advise on evidence and procedure for any Indian copyright, design, trademark or other IPR filing.
7. Review separate licence/assignment terms and rights retained by MagicReel for hosting, processing, security and support.

## Customer-facing notice (draft)
This MagicReel record documents the creation history, recorded permissions and asset fingerprints associated with a Muse in the identified account. It is not a government-issued IPR registration, legal opinion, or guarantee of copyright, exclusive ownership of a facial identity, or protection against independently generated similar images. Formal rights depend on applicable law, source permissions, human contribution and the terms of the generation services used.

## Release gate
Do not describe the record as a copyright certificate, IPR registration, proof of exclusive ownership or guarantee that others cannot use a similar model. Customer-facing legal claims and licence terms remain subject to Indian IP counsel review.
