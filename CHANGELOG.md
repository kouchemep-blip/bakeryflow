# Changelog

## Réparation complète — 2026-08-04

- Correction de tous les écarts entre les noms Prisma générés et le code TypeScript.
- Ajout de `@updatedAt` aux entités `user`, `product` et `order`.
- Sécurisation par rôle des pages et API admin/client.
- Validation Zod des entrées d'inscription, catégories et produits.
- Correction de la création de commande transactionnelle, des prix serveur et de l'historique.
- Réparation du chat Socket.IO : cookie de session, contrôle d'accès, conversation et accès après commande.
- Ajout du profil client, des statistiques réelles du dashboard et de la liste des clients.
- Suppression du chargement de police Google distant afin de permettre le build hors ligne.
- Ajout du seed Prisma idempotent et du script `npm run db:seed`.
- Ajout de la documentation de test et de démarrage.

## Nouveaux fichiers

- `prisma/seed.ts`
- `TESTING.md`
- `CHANGELOG.md`
- `.env.example`
