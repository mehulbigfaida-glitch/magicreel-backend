# MakeMyMuse — Exclusive Use License Framework (Draft for Legal Review)

Status: DRAFT ONLY — not issued, not accepted, and not legal advice.
Version: 0.1

## Purpose
Document a proposed license framework for a Muse created through the MakeMyMuse workflow. The product must not issue an exclusive license until the terms are reviewed and approved by counsel and the creation record has passed the product's internal screening gate.

## Proposed grant
Subject to the final approved agreement, MakeMyMuse may grant the customer an exclusive commercial license to use the specific approved final Muse asset and the documented customer-approved derivative assets for fashion, advertising, marketing, ecommerce, social media, brand ambassador, and promotional activities.

## Scope and limitations
- The license applies to the specific identified asset(s) and recorded derivatives, not to the underlying AI model, provider technology, reference photo, or third-party materials.
- The license does not transfer ownership of the image-generation model, model weights, platform code, or infrastructure.
- Exclusivity is asset-specific and does not mean that every facial characteristic is globally unique or that similar images cannot be independently generated.
- The license does not promise copyright registration, patent protection, trademark rights, or protection against all third-party claims.
- The license does not authorize impersonation, fraud, unlawful use, or use that violates platform/provider terms.

## Proposed exclusivity conditions
1. User confirms the reference is an adult and that they own it or have the required permission and consent.
2. MakeMyMuse records the reference asset hash, prompt version/hash, generation endpoint/model, creation batch, candidate hashes, selection, refinement history, approval event, and final asset hash.
3. Internal screening flags near-duplicate outputs within the MakeMyMuse catalog. The screening is a limited internal comparison and is not a global uniqueness test.
4. The final asset passes the internal screening review and is not already licensed to another customer.
5. Customer accepts the final approved license terms.
6. MakeMyMuse records a license ID, terms version, acceptance timestamp, covered asset hashes, license scope, and status.

## Proposed license record fields
- License ID and creation/session ID
- Customer account ID
- Terms version and terms hash
- License scope, territory, duration, exclusivity and permitted use
- Covered asset IDs and hashes
- Internal screening status and date
- User acceptance event and timestamp
- Issuer identity and certificate signature, if signing keys are configured
- Revocation/termination status and reason, where applicable

## Current product state
The Creation Record documents the creation process and asset integrity. It is not a license. License status must remain CREATION_RECORD_ONLY_LICENSE_TERMS_PENDING until counsel-approved terms and the licensing gate are implemented.
