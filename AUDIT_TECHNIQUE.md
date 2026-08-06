# Audit technique factuel — BakeryFlow

Date de l'audit : 5 août 2026. Portée : totalité des fichiers source versionnés du répertoire `bakeryflow` (hors dépendances générées). Ce document décrit le code observé, pas des besoins supposés.

## 1. Vue d'ensemble et architecture

BakeryFlow est une application Next.js 16 (App Router) avec React 19 et TypeScript. Le rendu est hybride : les pages serveur lisent Prisma directement pour les tableaux de bord et les espaces protégés ; les composants client appellent les routes API ou une Server Action. La persistance relationnelle est MySQL (compatible TiDB si l'URL le vise), via Prisma 6. Le processus Node `server.ts` enveloppe Next.js dans un serveur HTTP custom et y attache Socket.IO 4.

Flux de déploiement observé : navigateur -> serveur HTTP Node/Next -> routes/pages/Server Action -> Prisma -> MySQL/TiDB ; pour images : routes API -> SDK Cloudinary -> Cloudinary. Socket.IO utilise le même serveur HTTP, pas une route Next. Les variables nécessaires sont `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, ainsi que facultativement `NEXT_PUBLIC_APP_URL` et `PORT`.

Organisation significative :

- `src/app` : pages App Router, layouts et routes API.
- `src/components` : UI partagée et composants administration/client.
- `src/features` : panier, commande, produits, authentification et espace client.
- `src/lib` : Prisma, JWT, contrôle d'accès, Cloudinary, upload et cycle des commandes.
- `src/schemas` : validations Zod des produits et catégories ; `src/types` : vues de types Prisma.
- `prisma/schema.prisma`, migrations et `seed.ts` : contrat de données et jeux de démonstration.
- `server.ts` : Socket.IO et serveur custom.

Le proxy Next (`src/proxy.ts`) protège uniquement `/dashboard/**` et `/customers/**` : absence ou JWT invalide redirige vers `/login`; un `CLIENT` est exclu de `/dashboard`, un `ADMIN`/`SUPER_ADMIN` de `/customers`. Les routes API appliquent leurs propres contrôles lorsqu'ils existent.

## 2. Acteurs et droits constatés

| Acteur | Source de vérité | Droits réellement codés |
|---|---|---|
| Visiteur non authentifié | absence de cookie `token` | consulte accueil, produits disponibles, catégories et pages statiques ; peut s'inscrire et se connecter ; peut composer un panier local ; à la validation du panier voit la modale d'authentification. |
| Client (`CLIENT`) | enum `user_role`, rôle par défaut à l'inscription | passe commande, consulte uniquement ses commandes/détails, son profil et ses avis ; peut discuter seulement après au moins une commande ; crée des avis sur les produits qu'il a reçus ; édite/supprime uniquement ses propres messages. |
| Administrateur (`ADMIN`) | enum, comptes seed | accès dashboard : produits, catégories, commandes, clients, avis, messages, statistiques et paramètres de profil ; crée/modifie/supprime produits, catégories vides, avis ; active/désactive des utilisateurs ; fait progresser les statuts ; voit/tient toute conversation. |
| Super-administrateur (`SUPER_ADMIN`) | enum seulement | traité partout exactement comme `ADMIN` par `isAdmin`, proxy, Socket.IO et interface. Aucun droit supplémentaire, aucun écran ou endpoint de gestion/attribution de ce rôle n'est implémenté. |

L'inscription publique ne crée que des comptes `CLIENT` : le corps reçu ne contient pas de rôle et Prisma applique son défaut. La désactivation est vérifiée lors de la connexion; elle n'invalide pas un JWT déjà posé et `getCurrentUser` ne recontrôle pas `isActive`.

## 3. Modèle de données Prisma (classes métier persistées)

Convention : tous les identifiants sont des `Int` auto-incrémentés. Aucune classe TypeScript métier à méthodes n'est définie : les objets métier sont des modèles Prisma, enrichis de fonctions/modules ci-dessous.

| Modèle / responsabilité | Champs (type, clé/contrainte) | Relations et cardinalités |
|---|---|---|
| `user` — identité, rôle, accès | `id:Int @id`; `firstName:String`; `lastName:String`; `email:String @unique`; `phone:String @unique`; `password:String` (hash bcrypt); `avatar:String?`; `role:user_role @default(CLIENT)`; `createdAt:DateTime @default(now())`; `updatedAt:DateTime @updatedAt`; `isActive:Boolean @default(true)` | 1 user -> 0..1 `cart`; 1 -> 0..1 `conversation`; 1 -> 0..* `notification`, `order`, `review`. |
| `category` — classement du catalogue | `id:Int @id`; `name:String @unique` | 1 catégorie -> 0..* `product`; un produit -> 1 catégorie obligatoire. |
| `product` — article vendable | `id`; `name:String`; `description:String @db.Text`; `price:Int`; `image:String`; `status:product_status @default(AVAILABLE)`; `categoryId:Int`; `createdAt`; `updatedAt`; `imagePublicId:String?` | FK `categoryId` indexée; 1 produit -> 0..* `cartitem`, `orderitem`, `review`. |
| `order` — commande client | `id`; `userId:Int`; `status:order_status @default(PENDING)`; `totalPrice:Int`; `createdAt`; `updatedAt @updatedAt` | FK `userId` indexée. Une commande appartient à 1 user et contient 0..* `orderitem` (aucune contrainte schéma impose au moins un article). |
| `orderitem` — ligne et prix historique | `id`; `orderId:Int`; `productId:Int`; `quantity:Int`; `unitPrice:Int` | FKs indexées vers exactement 1 `order` et 1 `product`; 1 commande/produit -> 0..* lignes. |
| `review` — avis | `id`; `userId:Int`; `productId:Int`; `rating:Int`; `comment:String @db.Text`; `createdAt` | FKs indexées. 1 user et 1 product -> 0..* avis. Ni unicité `(userId, productId)` ni contrainte de plage de note au niveau Prisma. |
| `conversation` — fil privé client/équipe | `id`; `userId:Int @unique` | relation 1:0..1 avec `user`; 1 conversation -> 0..* `message`. Une conversation est par client, pas par commande. |
| `message` — message de chat | `id`; `conversationId:Int`; `senderId:Int`; `content:String`; `isRead:Boolean @default(false)`; `createdAt` | FK indexée uniquement vers conversation. `senderId` est un entier sans relation/FK Prisma vers `user`. |
| `cart` — panier persistant prévu | `id`; `userId:Int @unique`; `createdAt` | 1:0..1 avec user; 1 -> 0..* `cartitem`. |
| `cartitem` — ligne du panier persistant | `id`; `cartId:Int`; `productId:Int`; `quantity:Int` | FKs indexées vers cart et product. Aucun unique `(cartId, productId)` ni contrôle quantité. |
| `notification` — notification persistante prévue | `id`; `userId:Int`; `title:String`; `content:String`; `isRead:Boolean @default(false)`; `createdAt` | FK indexée vers 1 user. Aucun appel Prisma à ce modèle n'a été trouvé dans l'application. |

Enums : `user_role={CLIENT,ADMIN,SUPER_ADMIN}`, `product_status={AVAILABLE,UNAVAILABLE}`, `order_status={PENDING,CONFIRMED,PREPARING,READY,DELIVERED,CANCELLED}`. Les migrations ajoutent `isActive`, `imagePublicId` et `order.updatedAt`; deux migrations nommées différemment ajoutent `updatedAt` à `order` (`20260801163656` et `20260801164151`), point à vérifier contre l'historique réellement appliqué.

## 4. Fonctions métier, règles et états

### Commandes et panier

Le panier actif est le store Zustand `useCartStore`, persisté dans `localStorage` sous `bakeryflow-cart`, pas les tables `cart/cartitem`. `addItem` construit l'identifiant `productId` + options, incrémente ou ajoute; `removeOne`, `removeLine`, `clearCart`, `openDrawer`, `closeDrawer`, `totalItems` et `totalPrice` agissent localement. `computeLineTotal` calcule `(prix + modificateurs) × quantité`. Les types prévoient `options`, mais aucun écran ne propose des options et la création de commande refuse tout `priceModifier != 0`.

`createOrder(items)` est une Server Action : JWT obligatoire, rôle strictement `CLIENT`, panier non vide, quantités entières >=1, produits tous existants et `AVAILABLE`. Elle relit les prix côté serveur (les montants client sont ignorés), crée dans une transaction `order(PENDING)` puis les `orderitem`, crée une conversation si absente et supprime les éventuels `cartitem` du panier Prisma. Elle retourne `{success, orderId, totalPrice}` ou une erreur. Le drawer vide le store local seulement après succès et affiche la confirmation.

### Les deux parcours d'authentification, dont la connexion inline

Les pages `/login` **et** `/inscription` montent le même composant `AuthForm`; elles ne sont pas deux implémentations distinctes. `useAuthForm` alterne les panneaux `LoginForm` et `RegisterForm`. L'inscription appelle `POST /api/users` puis affiche « Compte créé » et revient au panneau connexion; la connexion appelle `POST /api/auth/login`, reçoit le cookie HTTP-only et redirige la page entière vers `/customers` pour le rôle CLIENT, `/dashboard` pour les deux autres rôles. La validation front de ces pages vérifie nom/prénom 2..30, téléphone regex `[0-9+\\s().-]` 6..20, email par regex et mot de passe 8..20; l'API reste l'autorité et accepte, pour l'inscription, jusqu'à 72 caractères. La case « Se souvenir de moi », le lien « Mot de passe oublié ? » et les icônes Facebook/Google/TikTok ont `href="#"` ou aucun état métier : ils n'implémentent pas de fonctionnalité de mémorisation, récupération de mot de passe ou connexion sociale.

Il existe aussi une **connexion/inscription inline** dans `AuthGate`, déclenchée exclusivement lorsqu'un visiteur clique « Valider ma commande » dans `CartDrawer`. Le drawer reste ouvert et le store/panier est conservé. `LoginInline` demande email/mot de passe, appelle la même route `/api/auth/login` avec credentials, puis refetch son propre `useCurrentUser` et appelle `onAuthSuccess`; `RegisterInline` demande prénom, nom, email, téléphone, mot de passe, appelle `/api/users`, puis bascule vers le login inline — il ne connecte pas automatiquement. Le sequence diagram correspondant est : `CartDrawer -> useCurrentUser (absent) -> AuthGate -> LoginInline -> POST login -> cookie JWT -> GET me -> callback -> tentative createOrder`.

Transitions imposées par `allowedTransitions`/`canChangeStatus` : `PENDING -> CONFIRMED|CANCELLED`; `CONFIRMED -> PREPARING|CANCELLED`; `PREPARING -> READY`; `READY -> DELIVERED`; `DELIVERED` et `CANCELLED` terminaux. Seul admin/super-admin les modifie. Le statut courant est réaffiché parmi les options mais l'API refuserait une transition vers lui-même.

### Authentification, profil et sécurité

`generateToken`/`verifyToken` signent/vérifient JWT avec `JWT_SECRET`, durée 7 jours. `POST /api/auth/login` valide email + mot de passe, compare bcrypt, bloque un compte inactif puis pose le cookie HTTP-only `token`, `sameSite=lax`, `secure` en production, `path=/`, max-age 7 jours. `POST /api/auth/logout` supprime le cookie. `getCurrentUser` vérifie JWT puis relit l'utilisateur; `requireUser` renvoie 401 et `requireAdmin` ajoute le contrôle de rôle (403).

Le profil permet à tout utilisateur connecté de modifier seulement son propre prénom, nom, téléphone, avatar URL et éventuellement mot de passe (rehash bcrypt). L'email est visible mais non modifiable. Avatar : fichier image, non vide, <=5 Mo, envoyé à Cloudinary dossier `bakeryflow/avatars`, puis l'URL doit être sauvée par la mise à jour profil.

### Catalogue, avis et messagerie

Catalogue public : seules les fiches `AVAILABLE` sont renvoyées au client, triées par création décroissante; filtrage optionnel `categoryId`. `getAverageRating(reviews)` retourne une moyenne arrondie à une décimale ou `null`.

Avis : authentification requise, note entière 1..5, commentaire 3..1000, produit positif entier. L'API vérifie l'existence d'au moins une ligne de commande livrée de ce produit pour l'auteur; elle ne limite pas le nombre d'avis. Seule l'administration les supprime.

Socket.IO authentifie chaque handshake par JWT soit dans `auth.token`, soit dans le cookie. Chaque socket rejoint `user_{id}`; admins peuvent rejoindre `admin_inbox`; un client ne rejoint que sa conversation, admin/super-admin toutes. `send_message` (1..2000 caractères) persiste puis émet `new_message` au salon, `inbox_updated` aux admins et, si l'expéditeur est admin, `message_notification` au client. `mark_read` ne marque que les messages de l'autre partie. `edit_message` et `delete_message` refusent tout message dont `senderId` n'est pas l'utilisateur connecté. Les événements clients sont : `join_admin_inbox`, `join_conversation`, `send_message`, `mark_read`, `edit_message`, `delete_message`; événements serveur : `joined`, `new_message`, `messages_read`, `message_updated`, `message_deleted`, `inbox_updated`, `message_notification`, `error`.

## 5. API Routes

| Route / méthodes | Accès, entrées et validation | Sortie / modèles |
|---|---|---|
| `/api/auth/login` GET | public; GET diagnostic | `{message:"API Login OK"}`. |
| `/api/auth/login` POST | public; JSON `email` email valide, `password` min 1 | bcrypt + `user`; 401 identifiants, 403 inactif; cookie JWT et utilisateur minimal. |
| `/api/auth/logout` POST | aucun contrôle | supprime `token`, message succès. |
| `/api/auth/me` GET | JWT utilisateur requis | identité publique `id, firstName,lastName,email,role` depuis `user`. |
| `/api/users` POST | public; prénom/nom 2..30, email <=191, téléphone 6..20, mot de passe 8..72 | crée `user CLIENT`, hash bcrypt; 201 sans mot de passe. 400 Zod, 409 email/téléphone unique. |
| `/api/users` GET | admin | liste users sans password/avatar, avec rôle et `isActive`. |
| `/api/users/:id` PATCH | admin; JSON `{isActive:boolean}` | met à jour `user.isActive`; route ne valide pas syntaxe/existence de l'id et ne restreint pas la cible au client. |
| `/api/products` GET | public; query facultative `categoryId` | produits `AVAILABLE` + catégorie + notes des avis, ordre décroissant. |
| `/api/products` POST | admin; multipart nom >=2, description >=10, prix >0, catégorie >0, statut enum, image obligatoire | upload Cloudinary puis crée `product`; 201. |
| `/api/products/:id` PATCH | admin; même multipart; image facultative | remplace éventuellement l'asset Cloudinary, actualise `product`; 404 absent. |
| `/api/products/:id` DELETE | admin | détruit éventuellement asset puis `product`; 404 absent, 500 pour autre erreur. |
| `/api/categories` GET | public | toutes `category`, nom croissant. |
| `/api/categories` POST | admin; JSON `name` trim 2..50 | crée catégorie. Les erreurs Zod/unicité sont renvoyées génériquement 500. |
| `/api/categories/:id` PATCH | admin; même JSON | actualise catégorie; erreurs (id invalide/unique/absente) génériques 500. |
| `/api/categories/:id` DELETE | admin | compte `product`; 409 si non vide, sinon supprime. |
| `/api/orders/:id` PATCH | admin; JSON `{status}` enum | valide commande, enum et transition; retourne commande mise à jour. |
| `/api/customer/profile` GET/PUT | tout utilisateur connecté; PUT JSON prénom/nom 2..80, téléphone 6..30, password facultatif >=8, avatar URL nullable <=1000 | lit/met à jour uniquement l'utilisateur courant, sans email/password; 409 téléphone. |
| `/api/customer/avatar` POST | tout utilisateur connecté; multipart image, image MIME, <=5 Mo | upload Cloudinary avatars; retourne `{url}`, n'écrit pas `user.avatar`. |
| `/api/upload` POST | admin; multipart image MIME, <=5 Mo | upload produit Cloudinary, retourne `secure_url, public_id`; aucun appel front trouvé. |
| `/api/reviews` POST | tout utilisateur connecté; JSON produit, note 1..5, commentaire 3..1000 | vérifie achat livré, crée `review`. |
| `/api/reviews/:id` DELETE | admin; id entier positif | supprime review, 204; 404 si inconnue. |
| `/api/chat` GET | utilisateur connecté non-admin, au moins une commande | lit/crée la conversation du client avec 50 derniers messages ascendants. |
| `/api/chat/:conversationId` GET | utilisateur connecté | vérifie ownership pour client ou rôle admin; lit tous messages ascendants, marque lus ceux de l'autre, retourne conversation/messages. |

La création de commande n'est pas une API Route : c'est la Server Action `createOrder` appelée par `CartDrawer`.

## 6. Pages, données et actions

### Publiques

| Chemin | Contenu réel / actions |
|---|---|
| `/` | landing : Hero, navigation, `ProductGrid`, footer; charge `/api/products`, filtre les catégories déduites des produits, ajoute panier, ouvre le drawer et commande. |
| `/login` et `/inscription` | affichent les formulaires/auth overlay; inscription via `/api/users`, connexion via `/api/auth/login`, redirection CLIENT -> `/customers`, sinon `/dashboard`. |
| `/logout` | page de déconnexion (appel logout côté page/composant). |
| `/bye` | écran après déconnexion. |
| `/find-us`, `/faqs`, `/coming-soon` | pages de contenu/statique. La page Premium indique explicitement que statistiques avancées et rapports détaillés seront disponibles plus tard. |

### Espace client, protégé par proxy

| Chemin | Données/actions |
|---|---|
| `/customers` | résumé : commandes totale/en cours/livrées, dépenses des livrées, avis, messages non lus, quatre dernières commandes; liens commandes/chat/avis. |
| `/customers/orders` | commandes propres, lignes/produits, date, statut, total, lien détail. |
| `/customers/orders/:id` | commande appartenant au JWT, lignes, quantités, prix historiques, statut et total; sinon 404. |
| `/customers/chat` | exige au moins une commande; trouve/crée conversation puis `ChatWithChef`. |
| `/customers/profile` | charge profil courant puis `ProfileForm`: avatar Cloudinary, coordonnées et mot de passe. |
| `/customers/reviews` | déduit les produits de commandes livrées et utilise `ReviewForm`. |

### Administration, protégée par proxy

| Chemin | Données/actions |
|---|---|
| `/dashboard` | cartes (clients actifs, commandes jour, CA de toutes livrées, commandes en cours, messages non lus, 5 dernières commandes) et graphiques : ventes 14 jours (toutes commandes), répartition par statut, top 5 quantités vendues, revenu des livrées sur 6 mois. |
| `/dashboard/products`, `/new`, `/:id`, `/:id/edit` | liste complète, création, détail, modification/suppression; `ProductForm` -> APIs produits, image picker. |
| `/dashboard/categories`, `/:id/edit` | liste + nombre de produits, création, édition/suppression via APIs catégories. |
| `/dashboard/orders` | filtre statut, recherche numéro/prénom/nom/email/téléphone, statistiques sur le jeu filtré, tableau. |
| `/dashboard/orders/:id` | client, lignes, résumé, sélecteur de transition et timeline; lien chat. |
| `/dashboard/orders/:id/chat` | conversation du client de la commande; crée le fil s'il n'existe pas. |
| `/dashboard/messages` | inbox : conversations, dernier message, nombre non lu côté équipe, recherche client; chat temps réel. |
| `/dashboard/customers` | liste des seuls `CLIENT`, coordonnées, date, bouton activer/désactiver. |
| `/dashboard/reviews` | liste des avis, moyenne et suppression. |
| `/dashboard/settings` | même `ProfileForm` pour l'administrateur connecté. |
| `/dashboard/premium` | contenu promotionnel seulement, aucune capacité Premium effective. |

## 7. Composants et fonctions applicatives importants

- `ProductGrid` / `useProducts` : fetch, chargement/erreur/refetch, filtre client par catégorie; `ProductCard` ajoute au store et lance l'animation `flyToCart` vers `CartButton`.
- `CartDrawer`, `CartItems`, `CartEmpty`, `CartButton`, `OrderConfirmation` : UI du panier; valident avec `createOrder`; `AuthGate` conserve le panier et offre login/inscription inline avant la commande. `useFocusTrap` y contraint la navigation Tab, Échap ferme et le scroll body est bloqué pendant l'ouverture.
- `ProductForm` et `CategoryForm` : React Hook Form + Zod; multipart produit / JSON catégorie. `ImagePicker` accepte png/jpeg/webp côté navigateur (l'API accepte tout MIME `image/*`).
- `OrderStatusSelect` est le composant client qui utilise `allowedTransitions` et PATCH status. `OrderFilters` et `OrderSearch` écrivent les query params; `OrderTable`, `OrderCustomerCard`, `OrderItemsTable`, `OrderSummary`, `OrderTimeline` rendent les données serveur.
- `DashboardStats`, `getChartData`, graphiques Recharts : agrégations Prisma détaillées dans la section pages, sans endpoint dédié.
- `ChatWithChef` + `useChat` : chargent `/api/chat/:id`, connectent Socket.IO, rejoignent le fil, fusionnent historique/événements, envoient, éditent/suppriment leurs propres messages et marquent lus. `Inbox` rejoint `admin_inbox` et rafraîchit sur `inbox_updated`; `MessageNotifier` du client affiche le message admin hors chat.
- `ProfileForm`, `ReviewForm`, `CustomerStatusButton`, `DeleteReviewButton`, `DeleteProductButton` portent les mutations détaillées dans les APIs.
- `Navbar`/`UserMenu` récupèrent `/api/auth/me`; le menu déconnecte avec `/api/auth/logout`.

## 8. Scénarios UML prêts à dessiner

Cas d'utilisation Client : consulter catalogue/catégorie; gérer panier local; s'inscrire; se connecter/déconnecter; passer commande; consulter historique/détail; consulter/modifier profil et avatar; discuter (après une commande); marquer messages lus; modifier/supprimer son message; publier avis (après livraison).

Cas d'utilisation Admin/Super-admin : se connecter; consulter dashboard/statistiques; administrer produits (image Cloudinary), catégories, commandes et cycle de statut; consulter/activer/désactiver clients; consulter/supprimer avis; consulter/répondre aux conversations; modifier son profil/avatar.

Séquences majeures : (1) authentification : formulaire -> login API -> bcrypt/Prisma -> JWT cookie -> redirection; (2) commande : store -> AuthGate si besoin -> Server Action -> JWT/Prisma transaction -> confirmation; (3) message : hook -> socket auth -> room -> persistance message -> broadcasts/notification; (4) changement statut : select -> PATCH -> règles transition -> Prisma -> refresh; (5) upload : formulaire -> multipart route -> Cloudinary -> URL/publicId -> Prisma produit ou URL profil.

Diagramme de composants : navigateur React/Next, Next App Router (pages + routes + Server Action), serveur HTTP custom/Socket.IO, Prisma Client, MySQL/TiDB, Cloudinary, JWT/cookie. Diagramme de déploiement : client navigateur, processus Node avec port `PORT` (3000 défaut), base distante `DATABASE_URL`, Cloudinary SaaS; `NEXT_PUBLIC_APP_URL` est l'origine CORS/socket.

Diagramme d'états commande : `PENDING` initial -> `CONFIRMED` -> `PREPARING` -> `READY` -> `DELIVERED`; annulation depuis `PENDING` ou `CONFIRMED`; `DELIVERED`/`CANCELLED` finaux.

## 9. Interactions utilisateur détaillées

**Visiteur/client.** Le visiteur navigue entre accueil, à venir, FAQ et nous trouver; il consulte le catalogue disponible, filtre visuellement par catégorie et ouvre/ferme le panier. Il peut ajouter le même article (incrément), retirer une unité, retirer une ligne ou vider le panier. Au clic de validation : si session absente, il choisit connexion ou inscription dans la modale inline; après connexion client, le code tente de reprendre la validation et de créer la commande, puis d'afficher la confirmation. Il peut aussi s'inscrire/se connecter via les pages dédiées, dont le formulaire est le même composant. Un client connecté ouvre son tableau de bord, explore ses commandes et seulement ses détails, va au profil pour charger un avatar puis enregistrer ses coordonnées/mot de passe, ouvre le chat si une commande existe, envoie/modifie/supprime ses messages et voit les messages admin/non lus. Enfin il sélectionne un produit livré, 1 à 5 étoiles et un commentaire pour publier un avis.

**Administrateur/super-administrateur.** Il navigue dans le tableau de bord, observe les cartes/graphiques et les cinq commandes récentes. Il crée une catégorie, la renomme ou la supprime si elle est vide; crée un produit avec image, le consulte, le modifie (y compris disponibilité/image) ou demande sa suppression. Il filtre les commandes par état et recherche client/numéro; ouvre une commande, lit son client, ses lignes et total, fait progresser l'état vers l'une des transitions proposées, voit la timeline et ouvre la discussion du client. Il consulte l'inbox, cherche une conversation, écrit/édite/supprime ses propres messages et voit les compteurs de non-lus. Il consulte les clients `CLIENT` et active/désactive chaque compte, consulte la moyenne/liste des avis et en supprime un, et modifie enfin son propre profil. La page Premium ne déclenche aucune fonctionnalité Premium.

## 10. Dépendances réellement déclarées et utilisées

| Dépendance | Usage repéré |
|---|---|
| `next`, `react`, `react-dom`, `typescript` | framework App Router, rendu client/serveur et typage. |
| `@prisma/client`, `prisma` | accès MySQL/TiDB, schéma, migrations et seed. |
| `bcrypt`, `jsonwebtoken` | hash/comparaison des mots de passe; émission/vérification JWT. |
| `socket.io`, `socket.io-client` | temps réel serveur et hooks/composants chat. |
| `cloudinary` | téléversement, remplacement et suppression des images. |
| `zod`, `react-hook-form`, `@hookform/resolvers` | schémas de validation et formulaires catégories/produits. |
| `zustand` | store persistant du panier local. |
| `recharts` | quatre graphiques du dashboard. |
| `framer-motion`, `motion-dom`, `motion-utils` | animations de navigation, chat, panier et formulaires. |
| `lucide-react`, `react-icons` | icônes UI. |
| `uuid` | déclaré dans `package.json`, aucun import trouvé dans `src`, `server.ts` ou `prisma`. |
| `cross-env`, `ts-node` | scripts npm de démarrage/build/seed. |
| `tailwindcss`, `@tailwindcss/postcss`, `postcss` | styles utilitaires et traitement CSS. |
| `eslint`, `eslint-config-next`, paquets `@types/*` | qualité statique et définitions TypeScript de développement. |

## 11. Incohérences, limites et points à ne pas représenter comme acquis

1. `cart`, `cartitem` et `notification` sont dans Prisma mais ne portent pas le flux normal : panier UI local uniquement; `cartitem` est seulement supprimé à la commande; `notification` est inutilisé. Ne pas dessiner une synchronisation persistante du panier ni des notifications en table.
2. `message.senderId` n'a pas de FK Prisma vers `user`; les règles de propriété sont dans Socket.IO, pas au niveau du schéma.
3. Aucun paiement, adresse, livraison géographique, stock, code promo, variantes réellement sélectionnables, OAuth/social login, réinitialisation de mot de passe, ni gestion d'administration des rôles n'existe dans le code. Le terme « livraison » est un état de commande, pas un module logistique.
4. Le menu utilisateur client pointe vers `/customers/messages`, page inexistante; la messagerie réelle est `/customers/chat`.
5. Le proxy protège les pages, mais plusieurs pages dashboard interrogent Prisma sans refaire un contrôle de rôle; la barrière de page dépend donc du proxy. Les APIs de mutation possèdent `requireAdmin`.
6. `POST /api/customer/avatar` autorise tout connecté, y compris admin; les anciens avatars Cloudinary ne sont jamais supprimés. `/api/upload` existe mais aucun appel frontend n'a été trouvé.
7. Supprimer un produit référencé par des lignes commande/panier/avis peut échouer sur les contraintes FK : l'API aura alors 500 après avoir possiblement supprimé l'image Cloudinary. Les catégories, elles, sont explicitement protégées si non vides.
8. Les statistiques de ventes sur 14 jours additionnent toutes les commandes, y compris annulées/non livrées; les chiffres d'affaires explicitement nommés sont restreints à `DELIVERED`.
9. La conversation est par client, mais une page de chat est atteignable depuis une commande : ce n'est pas une conversation par commande.
10. Le flux inline présente un défaut de reprise dans le code lu : `AuthGate` refetch l'utilisateur dans **son** hook, mais `CartDrawer` possède une autre instance de `useCurrentUser`. Le callback appelle immédiatement la fermeture puis `handleCheckout` capturé avec `user === null`; il peut donc rouvrir la modale au lieu d'atteindre `createOrder`. C'est différent des pages de connexion, qui redirigent/rechargent entièrement et fonctionnent indépendamment.
11. La compilation `npm.cmd run build` a dépassé 120 s sans sortie dans l'environnement d'audit et a été interrompue par le délai; elle n'établit donc ni succès ni échec de build. Aucun code applicatif n'a été modifié par cet audit; seul ce document a été ajouté.
