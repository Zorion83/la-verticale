# La Verticale — Landing Page

Landing page statique pour la newsletter **La Verticale**.
Fichier unique `index.html` — aucune dépendance, aucun build nécessaire.

---

## Brancher Beehiiv

1. Connecte-toi sur [app.beehiiv.com](https://app.beehiiv.com)
2. **Settings → Publication Details → Embed Form**
3. Copie le code `<script>` ou `<iframe>` généré
4. Dans `index.html`, cherche le commentaire :
   ```
   // BEEHIIV_EMBED_CODE_HERE //
   ```
5. Remplace le bloc `.fallback-form` par ton code Beehiiv
6. Sauvegarde et déploie

---

## Déployer sur Cloudflare Pages depuis GitHub

### Prérequis
- Un compte [GitHub](https://github.com) (gratuit)
- Un compte [Cloudflare](https://dash.cloudflare.com) (gratuit)

### Étape 1 — Pousser le code sur GitHub

```bash
# Dans le dossier landing/
git init
git add .
git commit -m "Initial commit - La Verticale landing page"

# Crée un dépôt sur github.com, puis :
git remote add origin https://github.com/TON_USERNAME/la-verticale.git
git branch -M main
git push -u origin main
```

### Étape 2 — Connecter à Cloudflare Pages

1. Va sur [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages**
2. Clique **Create application → Pages → Connect to Git**
3. Autorise Cloudflare à accéder à ton GitHub
4. Sélectionne le dépôt `la-verticale`
5. Configure le build :
   - **Framework preset** : `None`
   - **Build command** : *(laisser vide)*
   - **Build output directory** : `/` (ou `.`)
6. Clique **Save and Deploy**

Cloudflare Pages déploie automatiquement à chaque `git push` sur `main`.

### Étape 3 — Ajouter ton domaine personnalisé (optionnel)

1. Dans Cloudflare Pages → ton projet → **Custom domains**
2. Clique **Set up a custom domain**
3. Entre ton domaine (ex. `laverticale.fr`)
4. Suis les instructions pour pointer ton DNS vers Cloudflare Pages

Le SSL est automatique et gratuit.

---

## Structure du projet

```
landing/
├── index.html      # Page complète (HTML + CSS + JS inline)
├── .gitignore      # Fichiers ignorés par Git
└── README.md       # Ce fichier
```

---

## Personnaliser

| Ce que tu veux changer | Où chercher dans index.html |
|---|---|
| Nombre de lecteurs | `2 400+` dans la section `#proof` |
| Tagline | Balise `<h1>` et `<meta name="description">` |
| Témoignages | Blocs `.testimonial` |
| Couleur or | Variable CSS `--gold: #e8c547` |
| SIRET / mentions légales | Footer + lien `Mentions légales` |
