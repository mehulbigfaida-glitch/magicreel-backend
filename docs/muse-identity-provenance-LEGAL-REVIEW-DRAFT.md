# MagicReel Muse Identity & Provenance — Legal Review Draft

**Status: DRAFT FOR INDIAN IP COUNSEL REVIEW — NOT APPROVED FOR CUSTOMER LEGAL RELIANCE**

## Purpose
MagicReel records the account that commissioned a Muse, the customer consent version accepted during generation, selected candidate, source and generated asset identifiers, generation model and prompt version, creation timestamps, and a SHA-256 hash of the canonical provenance manifest.

## What the record attests
- A Muse generation workflow was completed within the identified MagicReel account.
- The recorded account accepted the specified consent wording.
- The manifest records the selected candidate and generated asset identifiers.
- The displayed manifest hash can be compared with the issuer-held manifest to detect changes to that manifest.

## What the record does not attest
- It is not a government-issued copyright, design, trademark, patent or other IPR registration.
- It does not establish that an AI-generated face is copyrightable or exclusively owned.
- It does not establish that no similar or identical-looking synthetic face exists elsewhere.
- It does not prove that the customer owns or has rights in the uploaded source photograph beyond the customer declaration.
- It is not a legal opinion, guarantee of enforceability, or substitute for consent/release documentation.

## Current technical scope
- Certificate IDs use the MR-MUSE prefix and a unique Muse identifier fragment.
- The manifest includes account ID, Muse ID/name, selected candidate number, consent record/version, source/collage/candidate asset IDs, generated asset IDs, model identifier and prompt version.
- SHA-256 is calculated over the JSON manifest string created by the backend.
- Public verification returns certificate ID, status, issue date, manifest hash, Muse display name and legal notice. It does not expose the account ID, source image, consent text or private asset URLs.
- Certificates are marked PROVISIONAL pending counsel review.

## Questions for counsel before production/legal launch
1. Who should be identified as author, owner, applicant or licensee for each class of output under Indian copyright law and applicable international law?
2. What rights can MagicReel validly grant or assign to the customer, given the model-provider/API terms and the degree of human creative contribution?
3. Is the current customer declaration adequate for source-image rights, adult likeness consent, commercial use, AI transformation and any third-party rights?
4. What wording should describe the certificate without overstating copyright, authorship, ownership, exclusivity or evidentiary effect?
5. Should customers be offered a separate signed licence/assignment, and what rights should MagicReel retain to host, process, secure and support the Muse?
6. What retention, deletion, withdrawal, revocation, complaint and takedown procedures are required?
7. What additional evidence is advisable: original file hashes, signed consent, identity verification, trusted timestamps, digital signatures, C2PA credentials or independent timestamp anchoring?
8. Should public verification expose only a hash/status, or also the Muse name and issuer details, and what privacy consent is required?
9. What is the correct process and evidence package for any Indian copyright application, design application or other appropriate IPR filing?
10. Which provisions need to differ for a Muse derived from a real person's reference photo versus a wholly synthetic fictional identity?

## Proposed customer-facing disclaimer
This MagicReel record documents the creation history and recorded asset lineage of a Muse in the identified account. It is not a government-issued IPR registration, legal opinion, or guarantee of copyright, exclusive ownership of a facial identity, or protection against independently generated similar images. Formal rights depend on applicable law, source permissions, human contribution and the terms of the generation services used.

## Release gate
Do not describe the record as an IPR certificate, copyright certificate, proof of exclusive ownership or guarantee that others cannot use a similar model until Indian IP counsel has reviewed and approved the wording, customer agreement, rights chain, provider terms and evidence procedure.
