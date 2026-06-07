# ⚙️ Stack technique

## Plateforme newsletter
**Beehiiv** (recommandé) — Gratuit jusqu'à 2 500 abonnés
- Gestion abonnés gratuits/payants intégrée
- Referral program natif
- Analytics poussés (taux ouverture, clics, revenus)
- Lien : https://beehiiv.com

Alternative : **Substack** (plus simple, mais 10% de commission sur les paiements)

---

## Stack automatisation (n8n en local)

### Workflow 1 — Veille automatique
**Déclencheur** : Toutes les 24h
**Actions** :
1. Scraper les flux RSS des sources clés (Les Echos, BFM Business, Bloomberg FR)
2. Filtrer par mots-clés pertinents
3. Envoyer un digest dans Notion/Google Sheets pour sélection manuelle

### Workflow 2 — Curation LinkedIn
**Déclencheur** : Après publication newsletter
**Actions** :
1. Extraire la section "3 News" de l'édition
2. Reformater en post LinkedIn
3. Envoyer en brouillon (validation manuelle avant post)

### Workflow 3 — Tracking abonnés
**Déclencheur** : Webhook Beehiiv (nouvel abonné)
**Actions** :
1. Ajouter dans Google Sheets (tracking source acquisition)
2. Envoyer email de bienvenue personnalisé J+1

---

## Sources de veille
- Les Echos — https://www.lesechos.fr/rss
- BFM Business — https://www.bfmtv.com/rss/economie/
- L'Usine Nouvelle — https://www.usinenouvelle.com/rss
- Maddyness — https://www.maddyness.com/feed/
- Le Revenu — https://www.lerevenu.com/rss.xml

---

## Outils complémentaires
| Outil | Usage | Prix |
|---|---|---|
| Notion | Organisation éditions + idées | Gratuit |
| Canva | Visuels pour réseaux sociaux | Gratuit |
| n8n (local) | Automatisation workflows | Gratuit |
| Beehiiv | Envoi newsletter | Gratuit jusqu'à 2 500 |
| Stripe | Paiements (via Beehiiv) | % sur transaction |
