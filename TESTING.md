# Procédure de test

## Préparation

1. Copiez `.env.example` vers `.env` si nécessaire, puis renseignez `DATABASE_URL`, `JWT_SECRET` et les identifiants Cloudinary.
2. Installez les dépendances : `npm.cmd install`.
3. Appliquez la base et chargez les données :

```powershell
npx.cmd prisma migrate dev
npm.cmd run db:seed
```

4. Démarrez l'application : `npm.cmd run dev`.
5. Ouvrez `http://localhost:3000`.

## Comptes de démonstration

| Rôle | Email | Mot de passe |
| --- | --- | --- |
| Admin | `admin@bakeryflow.test` | `BakeryFlow2026!` |
| Client 1 | `lea@bakeryflow.test` | `BakeryFlow2026!` |
| Client 2 | `hugo@bakeryflow.test` | `BakeryFlow2026!` |

## Scénarios

### Authentification et accès

1. Créez un compte depuis `/inscription`, puis connectez-vous : vous arrivez sur `/customers`.
2. Connectez-vous avec l'admin : vous arrivez sur `/dashboard`.
3. Avec un client, ouvrez `/dashboard` : redirection attendue.
4. Avec un admin, ouvrez `/customers` : redirection attendue.

### Menu, panier et commande

1. Sur l'accueil, vérifiez les cinq plats et filtrez par catégorie.
2. Ajoutez des plats au panier, puis validez la commande en étant connecté comme client.
3. Vérifiez la confirmation, puis `/customers/orders` et le détail de la commande.

### Chat

1. Connectez-vous avec `lea@bakeryflow.test` : sa commande seed lui donne accès à `/customers/chat`.
2. Ouvrez en parallèle `/dashboard/orders`, puis la discussion de sa commande avec l'admin.
3. Envoyez un message depuis chaque session et vérifiez la réception en temps réel.
4. Avec `hugo@bakeryflow.test` (sans commande), l'accès au chat doit être refusé.

### Administration

1. Dans `/dashboard/products`, créez, modifiez puis supprimez un plat.
2. Dans `/dashboard/categories`, créez et modifiez une catégorie ; supprimez uniquement une catégorie vide.
3. Dans `/dashboard/orders`, filtrez/recherchez une commande puis faites progresser son statut.
4. Vérifiez les statistiques, clients, avis et la discussion associée à une commande.

## Contrôles techniques

```powershell
npx.cmd prisma validate
npx.cmd tsc --noEmit
npm.cmd run lint
npm.cmd run build
```
