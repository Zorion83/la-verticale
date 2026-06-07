# Ghost Deployment — La Verticale
**Date :** 2026-06-07
**Statut :** Validé

## Contexte
La Verticale est une newsletter freemium sur crypto/éco/IA. Stack actuelle :
- Beehiiv (newsletter) → remplacé par Ghost
- n8n sur mini-PC Windows (automation)
- Notion (base de données éditions)
- Cloudflare Pages + GitHub (landing page statique)
- Raspberry Pi (serveur auto-hébergé, DonchianBot + Caddy + Homepage)

## Décision : Scénario A — Ghost remplace tout
Ghost auto-hébergé sur le Pi gère :
- Site vitrine + landing page
- Blog articles éducatifs (SEO)
- Newsletter (envoi via Brevo SMTP)
- Gestion abonnés (gratuit/premium)

Beehiiv est retiré une fois Ghost opérationnel.

## Architecture

### Infrastructure Pi
- `/srv/compose/ghost/docker-compose.yml` — Ghost 5 Alpine + MySQL 8
- `/srv/data/ghost/content` — fichiers médias, thèmes
- `/srv/data/ghost/mysql` — base de données
- Réseau Docker : `proxy` (externe, partagé avec Caddy)
- Port exposé : 2368 (accès local `http://192.168.1.197:2368`)

### Email
- Provider : Brevo (SMTP gratuit, 300 emails/jour)
- SMTP host : smtp-relay.brevo.com:587
- Migration vers Amazon SES quand > 300 abonnés

### Domaine (à venir)
Quand le domaine laverticale.fr est acheté :
1. Pointer DNS vers IP Pi (ou Cloudflare Tunnel)
2. Mettre à jour `GHOST_URL` dans `.env`
3. Mettre à jour Caddyfile pour HTTPS automatique

## Thème
Design dark/gold conservé (inspiré de la landing page actuelle).
Thème Ghost custom à créer dans `/srv/data/ghost/content/themes/laverticale/`.

## Impact n8n
- Workflow Notion → Telegram → statut "Publie" : adapter pour déclencher Ghost Admin API
- Endpoint : `POST /ghost/api/admin/posts/` avec JWT auth
- Beehiiv webhook remplacé par Ghost webhook membre

## Freemium
- Gratuit : newsletter + articles éducatifs
- Premium (à terme) : newsletter premium + outil d'analyse
- Gestion tiers natifs dans Ghost (Members + Tiers)

## URLs importantes
- Admin Ghost : http://192.168.1.197:2368/ghost
- Site : http://192.168.1.197:2368
- API Admin : http://192.168.1.197:2368/ghost/api/admin/

## TODO restants
- [ ] Créer compte Brevo et renseigner SMTP dans .env
- [ ] Acheter domaine laverticale.fr
- [ ] Créer thème dark/gold custom
- [ ] Adapter workflow n8n
- [ ] Supprimer compte Beehiiv
