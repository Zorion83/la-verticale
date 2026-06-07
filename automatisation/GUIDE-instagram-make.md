# Guide Complet — Instagram Automation via Make.com
## La Verticale — Newsletter Finance

---

## Vue d'ensemble de l'architecture

```
n8n (génération du texte) → Make.com (webhook) → Instagram Graph API (publication)
```

Les deux workflows n8n génèrent le texte via OpenAI et l'envoient à Make.com. Make.com se charge de publier sur Instagram via l'API Meta officielle.

---

## PARTIE 1 — Prérequis

### 1.1 Compte Instagram Business (obligatoire)

Instagram n'autorise l'API de publication que sur les **comptes Business ou Creator**.

1. Ouvrez l'app Instagram
2. Allez dans **Paramètres > Compte > Passer à un compte professionnel**
3. Choisissez **Entreprise** (pas Créateur)
4. Catégorie suggérée : **Médias/Actualités** ou **Finance**

### 1.2 Page Facebook reliée (obligatoire)

L'API Instagram Graph exige une Page Facebook liée à votre compte Instagram.

1. Créez une Page Facebook si vous n'en avez pas (facebook.com/pages/create)
2. Dans Instagram : **Paramètres > Compte > Page liée > Connecter une page Facebook**
3. Sélectionnez votre page

### 1.3 Compte Meta for Developers

1. Allez sur [developers.facebook.com](https://developers.facebook.com)
2. Connectez-vous avec votre compte Facebook
3. Cliquez **Commencer** si c'est votre première visite
4. Acceptez les conditions d'utilisation

---

## PARTIE 2 — Créer l'application Meta

### 2.1 Nouvelle application

1. Sur developers.facebook.com → **Mes Applications → Créer une application**
2. Type : **Autre** (puis Suivant)
3. Type d'application : **Entreprise**
4. Nom : `La Verticale Instagram Bot`
5. Email de contact : votre email
6. Compte Business : sélectionnez votre compte Meta Business (créez-en un si besoin sur business.facebook.com)
7. Cliquez **Créer l'application**

### 2.2 Ajouter le produit Instagram Graph API

1. Dans le tableau de bord de votre app, section **Ajouter des produits**
2. Trouvez **Instagram Graph API** → cliquez **Configurer**
3. Dans le menu gauche, vous verrez maintenant **Instagram** apparaître

### 2.3 Obtenir un token d'accès permanent

**Étape A — Token temporaire (pour tester)**

1. Allez sur [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
2. Sélectionnez votre application dans le menu déroulant
3. Cliquez **Générer un token d'accès**
4. Cochez les permissions :
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`
   - `pages_show_list`
5. Cliquez **Générer**
6. Copiez le token (valide 1h, pour les tests uniquement)

**Étape B — Token longue durée (60 jours)**

Faites une requête HTTP GET sur cette URL (remplacez les valeurs) :

```
https://graph.facebook.com/v19.0/oauth/access_token
  ?grant_type=fb_exchange_token
  &client_id=VOTRE_APP_ID
  &client_secret=VOTRE_APP_SECRET
  &fb_exchange_token=TOKEN_TEMPORAIRE_60_JOURS
```

Votre App ID et App Secret se trouvent dans : **Tableau de bord de l'app → Paramètres → Général**

**Étape C — Récupérer l'ID du compte Instagram**

```
GET https://graph.facebook.com/v19.0/me/accounts?access_token=VOTRE_TOKEN_LONGUE_DUREE
```

Notez le `id` de votre page Facebook. Puis :

```
GET https://graph.facebook.com/v19.0/{PAGE_ID}?fields=instagram_business_account&access_token=VOTRE_TOKEN
```

Notez l'`id` retourné dans `instagram_business_account` — c'est votre **Instagram Business Account ID**.

> **Note** : Pour la production, un token permanent nécessite de passer en mode Live l'application Meta et d'utiliser le flux OAuth complet. Pour une utilisation personnelle/test, le token 60 jours renouvelé manuellement suffit.

---

## PARTIE 3 — Configurer Make.com

### 3.1 Créer un compte Make.com

1. Allez sur [make.com](https://make.com)
2. Créez un compte gratuit (1 000 opérations/mois incluses)
3. Vérifiez votre email

### 3.2 Créer le scénario principal

**Nom du scénario** : `La Verticale — Post Instagram`

#### Étape 1 : Module Webhook (déclencheur)

1. Cliquez **+ Créer un nouveau scénario**
2. Cliquez sur le cercle de démarrage → cherchez **Webhooks**
3. Choisissez **Custom webhook**
4. Cliquez **Add** → donnez un nom : `n8n-instagram-trigger`
5. Cliquez **Save** → Make.com génère une URL webhook
6. **Copiez cette URL** — c'est la valeur `VOTRE_WEBHOOK_MAKE_ICI` à coller dans les deux workflows n8n
7. Cliquez **OK**

Make.com attend maintenant une requête pour détecter la structure. Déclenchez une fois votre workflow n8n (avec le bouton "Exécuter" en mode test) pour que Make.com enregistre la structure JSON.

Structure attendue du payload entrant :
```json
{
  "caption": "Le texte du post Instagram généré par GPT...",
  "source": "newsletter",
  "generated_at": "2026-05-31T07:00:00.000Z",
  "workflow": "newsletter-to-instagram"
}
```

#### Étape 2 : Module HTTP — Créer le média Instagram (étape 1/2)

La publication Instagram en API se fait en 2 appels. Premier appel : créer le conteneur média.

1. Cliquez **+** après le webhook
2. Cherchez **HTTP** → **Make a request**
3. Configurez :
   - **URL** : `https://graph.facebook.com/v19.0/VOTRE_INSTAGRAM_ACCOUNT_ID/media`
   - **Method** : POST
   - **Body type** : Application/x-www-form-urlencoded
   - **Fields** :
     - `image_url` → `https://VOTRE_IMAGE_PAR_DEFAUT.jpg` (URL publique d'une image par défaut, hébergée sur Cloudinary ou Imgur gratuit)
     - `caption` → `{{1.caption}}` (valeur du webhook, champ "caption")
     - `access_token` → `VOTRE_TOKEN_META_ICI`

> **Important** : Instagram exige une image ou une vidéo. Hébergez une image par défaut de marque "La Verticale" sur un service gratuit (Cloudinary free tier, Imgur, ou GitHub raw). Pour des images dynamiques, voir la section "Aller plus loin" en bas de ce guide.

4. Cliquez **OK**

#### Étape 3 : Module HTTP — Publier le média (étape 2/2)

1. Cliquez **+** après l'étape 2
2. **HTTP → Make a request**
3. Configurez :
   - **URL** : `https://graph.facebook.com/v19.0/VOTRE_INSTAGRAM_ACCOUNT_ID/media_publish`
   - **Method** : POST
   - **Body type** : Application/x-www-form-urlencoded
   - **Fields** :
     - `creation_id` → `{{2.id}}` (l'ID retourné par l'étape 2)
     - `access_token` → `VOTRE_TOKEN_META_ICI`
4. Cliquez **OK**

#### Étape 4 (optionnel) : Notification de confirmation

1. Cliquez **+** après l'étape 3
2. Cherchez **Email** → **Send an email** (Make.com dispose d'un module email intégré)
3. Ou utilisez **Slack** / **Gmail** si connecté
4. Message : `Post Instagram publié avec succès ! ID: {{3.id}}`

### 3.3 Activer le scénario

1. En bas de l'éditeur, activez le toggle **Scheduling**
2. Le scénario s'active en mode **Instant** (déclenché par le webhook)
3. Cliquez **Save** (icône disquette)
4. Activez le scénario avec le toggle en haut à droite

---

## PARTIE 4 — Configurer n8n

### 4.1 Installer n8n (si pas encore fait)

**Option A — Cloud n8n.cloud (recommandé, gratuit 14 jours puis ~20€/mois)**
- Créez un compte sur [n8n.cloud](https://n8n.cloud)

**Option B — Self-hosted gratuit avec Docker**
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```
Accédez à http://localhost:5678

**Option C — Self-hosted avec npm**
```bash
npm install n8n -g
n8n start
```

### 4.2 Importer les workflows

1. Dans n8n, allez dans **Workflows → Import from file**
2. Importez `workflow-newsletter-to-instagram.json`
3. Importez `workflow-veille-instagram.json`

### 4.3 Configurer la credential OpenAI

1. Allez dans **Settings → Credentials → New**
2. Cherchez **OpenAI**
3. Nom : `OpenAI API Key`
4. Collez votre clé API OpenAI (depuis [platform.openai.com/api-keys](https://platform.openai.com/api-keys))
5. Sauvegardez

> Crédit de démarrage OpenAI : 5$ offerts à la création du compte, suffisant pour plusieurs centaines de posts.

### 4.4 Configurer les placeholders dans les workflows

**Workflow 1 (Newsletter → Instagram)** :

Ouvrez le node **"Récupérer Dernière Édition Beehiiv"** et remplacez :
- `VOTRE_SLUG_EDITION_ICI` → le slug de votre édition Beehiiv (ex: `edition-42-analyse-marche`)
  
  > Astuce : Copiez l'URL de votre dernière newsletter publiée sur Beehiiv. La partie après `/p/` est le slug.

Ouvrez le node **"Envoyer vers Make.com"** et remplacez :
- `VOTRE_WEBHOOK_MAKE_ICI` → l'URL webhook Make.com copiée à l'étape 3.2

**Workflow 2 (Veille → Instagram)** :

Ouvrez le node **"Envoyer vers Make.com"** et remplacez :
- `VOTRE_WEBHOOK_MAKE_ICI` → la même URL webhook Make.com

### 4.5 Relier la credential OpenAI aux nodes

Dans chaque workflow, cliquez sur le node **"OpenAI — Créer Post Instagram"** :
1. Dans le champ **Credential** → sélectionnez `OpenAI API Key`
2. Sauvegardez le workflow

### 4.6 Activer les workflows

1. Ouvrez chaque workflow
2. Cliquez le toggle **Inactive → Active** en haut à droite
3. Le Workflow 2 (veille) se déclenchera automatiquement à 7h les jours de semaine

---

## PARTIE 5 — Tester l'ensemble

### Test du Workflow 1 (Newsletter)

1. Ouvrez `workflow-newsletter-to-instagram` dans n8n
2. Mettez l'URL Beehiiv d'une édition existante
3. Cliquez **"Exécuter le workflow"** (bouton en bas)
4. Vérifiez que chaque node passe au vert
5. Contrôlez dans Make.com que le webhook a bien reçu les données
6. Vérifiez votre compte Instagram (peut prendre 1-2 minutes)

### Test du Workflow 2 (Veille)

1. Ouvrez `workflow-veille-instagram` dans n8n
2. Cliquez **"Exécuter le workflow"**
3. Contrôlez le node "Parser et Filtrer Articles" : vous devez voir 3-5 articles
4. Vérifiez le texte généré par OpenAI dans le node "Formater Post"
5. Vérifiez la réception Make.com et la publication Instagram

---

## PARTIE 6 — Récapitulatif des valeurs à remplacer

| Fichier | Placeholder | Valeur à mettre |
|---------|------------|-----------------|
| workflow-newsletter-to-instagram.json | `VOTRE_SLUG_EDITION_ICI` | Slug URL Beehiiv de l'édition |
| workflow-newsletter-to-instagram.json | `VOTRE_WEBHOOK_MAKE_ICI` | URL webhook Make.com |
| workflow-newsletter-to-instagram.json | `VOTRE_CREDENTIAL_OPENAI_ID` | Auto-rempli par n8n après création |
| workflow-veille-instagram.json | `VOTRE_WEBHOOK_MAKE_ICI` | URL webhook Make.com |
| workflow-veille-instagram.json | `VOTRE_CREDENTIAL_OPENAI_ID` | Auto-rempli par n8n après création |
| Make.com scénario | `VOTRE_INSTAGRAM_ACCOUNT_ID` | ID compte Instagram Business |
| Make.com scénario | `VOTRE_TOKEN_META_ICI` | Token Meta longue durée |
| Make.com scénario | `https://VOTRE_IMAGE_PAR_DEFAUT.jpg` | URL publique image de marque |

---

## PARTIE 7 — Aller plus loin (optionnel)

### Images dynamiques avec Canva + Make.com

Pour générer automatiquement une image avec le texte du post :
1. Créez un template Canva avec un texte variable
2. Utilisez le module **Canva** dans Make.com (connecteur disponible)
3. Passez la caption comme variable dans le template

### Renouveler le token Meta automatiquement

Les tokens Meta 60 jours doivent être renouvelés. Pour automatiser :
1. Créez un scénario Make.com séparé, déclenché tous les 50 jours
2. Faites un appel HTTP à l'endpoint d'exchange de token
3. Stockez le nouveau token dans un **Data Store** Make.com
4. Référencez le Data Store dans le scénario principal

### Ajouter une étape de validation manuelle

Si vous voulez valider chaque post avant publication :
1. Dans Make.com, ajoutez un module **Gmail** ou **Slack** entre le webhook et la publication
2. Envoyez-vous le texte généré
3. Ajoutez une condition : publier seulement si vous répondez "OK"
4. Utilisez le module **Webhooks → Webhook response** pour attendre votre validation

### Statistiques et suivi

Make.com permet de stocker les données dans un **Google Sheets** :
1. Ajoutez un module **Google Sheets → Add a Row** à la fin du scénario
2. Colonnes suggérées : Date, Source, Caption, Post ID Instagram, Likes (à récupérer via un scénario séparé)

---

## PARTIE 8 — Dépannage

| Problème | Cause probable | Solution |
|----------|---------------|----------|
| Erreur 400 sur l'API Instagram | Token expiré | Regénérez un token longue durée |
| Erreur 190 | Permission manquante | Vérifiez `instagram_content_publish` dans le token |
| Erreur "Media type not supported" | image_url invalide | Vérifiez que l'URL image est publiquement accessible (HTTP 200) |
| RSS vide dans le Workflow 2 | URL RSS périmée | Les Echos RSS : `https://www.lesechos.fr/rss/rss_une.xml` BFM : `https://rss.bfmtv.com/articles/economie/` |
| OpenAI error 429 | Quota dépassé | Attendez la réinitialisation ou ajoutez des crédits sur platform.openai.com |
| n8n webhook Beehiiv ne se déclenche pas | URL webhook mal configurée | Dans Beehiiv : Settings → Integrations → Webhooks → collez l'URL n8n |

---

*Guide créé pour La Verticale — Newsletter Finance Française*
*Dernière mise à jour : 31 mai 2026*
