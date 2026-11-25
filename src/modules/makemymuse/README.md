# MakeMyMuse backend module

This is the product boundary for MakeMyMuse. Product-specific routes, controllers, services, workflows, repositories, jobs, validators, and types must live here. Shared infrastructure may be reused through adapters.

## Separation rule
Do not import MagicReel product-specific generation workflows, billing business logic, or Muse selection code directly. Prefer shared infrastructure adapters for auth, storage/Cloudinary, queueing, logging, and payments.

## Status
Architecture scaffold only. The current MagicReel backend contains existing Muse-generation endpoints and database models, but this folder is the intended boundary for the standalone MakeMyMuse product. The creation flow has not yet been fully implemented as a separate backend service.
