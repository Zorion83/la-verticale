# Guide — Séquence d'onboarding La Verticale dans n8n

Ce guide explique comment importer et configurer le workflow `workflow-sequençage-newsletter.json` dans n8n, étape par étape.

---

## Pré-requis

- Un compte n8n (cloud sur [n8n.io](https://n8n.io) ou auto-hébergé — la version cloud gratuite suffit pour démarrer)
- Un compte Gmail avec un mot de passe d'application généré (voir étape 2)
- Un compte Beehiiv actif avec ta newsletter

---

## Étape 1 — Importer le workflow dans n8n

1. Connecte-toi à ton instance n8n
2. Dans le menu gauche, clique sur **Workflows**
3. Clique sur le bouton **Import** (icône nuage en haut à droite, ou menu ⋮ > Import)
4. Sélectionne le fichier `workflow-sequençage-newsletter.json`
5. Le workflow s'ouvre avec 7 nœuds connectés en ligne

---

## Étape 2 — Configurer les credentials SMTP Gmail

Gmail ne laisse pas utiliser ton mot de passe habituel pour l'envoi SMTP. Il faut un **mot de passe d'application**.

### Générer un mot de passe d'application Google

1. Va sur [myaccount.google.com/security](https://myaccount.google.com/security)
2. Active la **validation en deux étapes** si ce n'est pas déjà fait
3. Cherche **Mots de passe des applications** (ou va sur [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords))
4. Crée un mot de passe pour "Autre (nom personnalisé)" → tape "n8n La Verticale"
5. Google génère un mot de passe de 16 caractères — **copie-le maintenant**, il ne sera plus affiché

### Créer les credentials dans n8n

1. Dans n8n, va dans **Settings > Credentials** (menu gauche en bas)
2. Clique **Add Credential**
3. Cherche **SMTP** et sélectionne-le
4. Remplis les champs :
   - **Host** : `smtp.gmail.com`
   - **Port** : `465`
   - **SSL/TLS** : activé (oui)
   - **User** : ton adresse Gmail complète (ex: `laverticale@gmail.com`)
   - **Password** : le mot de passe d'application de 16 caractères
5. Clique **Save** — le nom par défaut sera utilisé, tu peux le renommer "Gmail SMTP — La Verticale"
6. Note l'**ID** du credential (visible dans l'URL ou le détail)

### Lier les credentials aux nœuds Send Email

Dans le workflow, clique sur chacun des 3 nœuds "Email" (J0, J3, J7) :
1. Dans le champ **Credential for SMTP**, sélectionne le credential Gmail que tu viens de créer
2. Remplace `VOTRE-EMAIL@gmail.com` par ton adresse Gmail réelle
3. Remplace `VOTRE-PRENOM` par ton prénom (signature en bas des emails)

---

## Étape 3 — Remplacer les liens dans les emails

Ouvre chaque nœud "Email" et remplace les placeholders suivants :

| Placeholder | Valeur à mettre |
|---|---|
| `LIEN-DERNIERE-EDITION` | URL de ta dernière édition sur Beehiiv |
| `LIEN-OFFRE-PREMIUM` | URL de ta page d'abonnement premium Beehiiv |
| `LIEN-ESSAI-GRATUIT-14-JOURS` | URL de l'offre d'essai Beehiiv (Settings > Paid Subscriptions > Free Trial) |
| `LIEN-DESABONNEMENT` | URL de désabonnement Beehiiv (disponible dans tes settings Beehiiv) |
| `LIEN-BEEHIIV` | URL de ta newsletter sur Beehiiv |

Pour l'email J3, remplace aussi :
- `TITRE-OPPORTUNITE-1/2/3` : titres courts d'analyses premium récentes
- `DESCRIPTION-COURTE-OPPORTUNITE-1/2/3` : 1-2 phrases de teaser pour chaque analyse

Pour l'email J7, remplace :
- `AVANTAGE-PREMIUM-SUPPLEMENTAIRE` : un avantage spécifique de ton offre (ex: accès à un Discord privé, modèle Excel, etc.)

---

## Étape 4 — Configurer le Webhook Beehiiv

### Récupérer l'URL du webhook dans n8n

1. Dans le workflow, clique sur le premier nœud **"Webhook — Nouvel Abonné Beehiiv"**
2. Dans l'onglet **Webhook URLs**, tu vois deux URLs :
   - **Test URL** : pour tester manuellement
   - **Production URL** : à copier pour Beehiiv (format : `https://[ton-instance].n8n.cloud/webhook/beehiiv-new-subscriber`)
3. Copie la **Production URL**

### Configurer le webhook dans Beehiiv

1. Dans Beehiiv, va dans **Settings > Integrations > Webhooks**
2. Clique **Add Endpoint**
3. Colle l'URL du webhook n8n
4. Dans **Events**, coche **subscriber.created**
5. Sauvegarde

---

## Étape 5 — Tester le workflow

### Test manuel depuis n8n

1. Ouvre le workflow dans n8n
2. Clique sur le nœud Webhook, puis **Listen for test event**
3. Dans un autre onglet, envoie une requête POST de test vers la **Test URL** :
   ```json
   {
     "email": "test@example.com",
     "first_name": "Test",
     "last_name": "Abonné"
   }
   ```
   Tu peux utiliser [Reqbin](https://reqbin.com) ou Postman pour ça.
4. Vérifie que le nœud "Set" extrait bien l'email et le prénom
5. Vérifie que l'email J0 part bien (checke ta boîte de réception)

### Test depuis Beehiiv

1. Inscris-toi à ta newsletter avec une adresse email de test
2. Vérifie dans n8n (onglet **Executions**) que le workflow s'est déclenché
3. Vérifie la réception de l'email de bienvenue

---

## Étape 6 — Activer le workflow

Une fois les tests validés :

1. Dans n8n, clique sur le bouton **Inactive** en haut à droite du workflow
2. Il passe à **Active** — le workflow tourne maintenant en production
3. Chaque nouvel abonné Beehiiv déclenchera automatiquement la séquence

---

## Fonctionnement des nœuds "Wait"

Les nœuds **Attente 3 jours** et **Attente 4 jours** mettent l'exécution en pause réelle. Chaque abonné a sa propre exécution indépendante. n8n garde les exécutions en attente même si tu redémarres l'instance.

> **Important** : avec le plan gratuit n8n cloud, les exécutions en attente sont conservées. Si tu utilises n8n en auto-hébergé, assure-toi que la base de données est persistante.

---

## Maintenance — Mise à jour de l'email J3

L'email J3 contient des teasers d'analyses premium. Ces contenus vieillissent. Deux options :

1. **Simple** : mettre à jour manuellement les placeholders dans le nœud J3 chaque semaine
2. **Automatisé** : connecter n8n à une feuille Google Sheets ou Notion où tu stockes tes dernières analyses, et utiliser un nœud HTTP Request pour les récupérer dynamiquement avant l'envoi

---

## Résumé des placeholders restants à configurer

```
VOTRE-EMAIL@gmail.com           → ton adresse Gmail d'envoi
VOTRE-PRENOM                    → ton prénom (apparaît dans la signature)
LIEN-DERNIERE-EDITION           → URL dernière édition Beehiiv
LIEN-OFFRE-PREMIUM              → URL page abonnement premium
LIEN-ESSAI-GRATUIT-14-JOURS     → URL offre d'essai Beehiiv
LIEN-DESABONNEMENT              → URL désabonnement Beehiiv
LIEN-BEEHIIV                    → URL ta newsletter
TITRE-OPPORTUNITE-1/2/3         → titres des analyses premium (email J3)
DESCRIPTION-COURTE-1/2/3        → teasers des analyses (email J3)
AVANTAGE-PREMIUM-SUPPLEMENTAIRE → avantage supplémentaire (email J7)
```
