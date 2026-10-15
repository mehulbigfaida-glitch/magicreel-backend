# Direct Instagram publishing (experimental)

This implementation is isolated on `experiment/direct-instagram-publishing`.
Do not deploy it to production until the build, OAuth callback, image publishing,
Reels publishing, and rollback paths have been tested.

## Required backend environment variables

- `META_INSTAGRAM_APP_ID`: Meta app ID.
- `META_INSTAGRAM_APP_SECRET`: Meta app secret.
- `META_INSTAGRAM_REDIRECT_URI`: exact public callback URL for `GET /api/social/meta/callback`.
- `META_TOKEN_ENCRYPTION_KEY`: 32-byte random key represented as 64 hex characters.

Generate the encryption key locally with `openssl rand -hex 32`. Store it only in the backend secret manager. Never commit secrets or send them in chat.

## Meta app prerequisites

Configure Instagram Login for the Meta app, register the exact redirect URI, and request the Instagram Login permissions needed for professional-account basics and content publishing. The connected Instagram account must be an eligible professional account and must authorize MagicReel. Meta app mode, access level, review, and tester roles may affect who can connect.

## Flow

- Authenticated `GET /api/social/meta/connect` initiates OAuth with a random state and short-lived HttpOnly cookies.
- `GET /api/social/meta/callback` validates state, exchanges the code, obtains the long-lived token, encrypts it, and upserts the user's Instagram account.
- Publishing routes Instagram through Meta when a Meta token is present; Facebook and accounts without a Meta token continue through Zernio.
- Zernio remains in the code as the rollback provider.

## Safety / limitations

- Do not merge or deploy until the Prisma migration is reviewed and applied in a controlled environment.
- Access tokens are encrypted using AES-256-GCM. Losing `META_TOKEN_ENCRYPTION_KEY` makes stored Meta tokens unreadable; back it up in the approved secrets manager.
- Meta must be able to fetch the asset URL over public HTTPS. Private or expiring URLs may fail.
- Images are published as feed images; videos are published as Reels after processing status completes.
- This code has not been verified against a real Meta app or account yet. Validate current Meta app requirements, permissions, and API behavior before production use.
