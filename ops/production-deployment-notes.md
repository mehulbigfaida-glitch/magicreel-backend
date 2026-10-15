# Production deployment notes

The direct Meta Instagram schema change was applied manually to the existing production database. Prisma migration history must be baselined separately before enabling `prisma migrate deploy` for this database. Railway production pre-deploy command is intentionally configured to run only a harmless confirmation command while that baseline is pending.
