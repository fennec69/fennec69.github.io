# Site Web Vitrine Feniks Lab

Site web statique pour présenter Feniks Lab et ses applications.

## Structure du projet

```
website/
├── index.html          # Page principale
├── css/
│   └── style.css      # Styles basés sur le design system Feniks
├── js/
│   └── app.js         # Logique JavaScript (i18n, rendu des apps)
├── data/
│   └── apps.json      # Données des applications
├── i18n/
│   ├── fr.json        # Traductions françaises
│   └── en.json        # Traductions anglaises
├── assets/
│   ├── logos/         # Logos des applications
│   └── screenshots/   # Captures d'écran des applications
└── README.md          # Ce fichier
```

## Ajouter une nouvelle application

### 1. Ajouter les assets

#### Logo
- Placez le logo dans `assets/logos/`
- Nom du fichier : `{app-id}.png` (ex: `meditation.png`)
- Format recommandé : PNG, 512x512px

#### Captures d'écran
- Créez un dossier dans `assets/screenshots/` avec le nom de l'app (ex: `meditation/`)
- Placez les captures d'écran dans ce dossier
- Nommez-les : `1.png`, `2.png`, `3.png`, etc.
- Format recommandé : PNG ou JPG, 1080x1920px (portrait) ou 1920x1080px (landscape)

### 2. Ajouter les données dans `data/apps.json`

Ajoutez un nouvel objet dans le tableau `apps` :

```json
{
  "id": "mon-app",
  "name": {
    "fr": "Nom de l'app en français",
    "en": "App name in English"
  },
  "description": {
    "fr": "Description longue en français...",
    "en": "Long description in English..."
  },
  "shortDescription": {
    "fr": "Description courte en français",
    "en": "Short description in English"
  },
  "logo": "assets/logos/mon-app.png",
  "screenshots": [
    "assets/screenshots/mon-app/1.png",
    "assets/screenshots/mon-app/2.png",
    "assets/screenshots/mon-app/3.png"
  ],
  "links": {
    "appStore": "https://apps.apple.com/...",
    "googlePlay": "https://play.google.com/...",
    "web": "https://mon-app.web.app"
  },
  "published": true
}
```

**Champs :**
- `id` : Identifiant unique de l'application (utilisé pour les classes CSS et les données)
- `name` : Nom de l'application (FR/EN)
- `description` : Description longue (FR/EN)
- `shortDescription` : Description courte affichée sur la card (FR/EN) - optionnel, utilise `description` si absent
- `logo` : Chemin vers le logo depuis la racine du site
- `screenshots` : Tableau des chemins vers les captures d'écran
- `links` : Liens vers les stores et la version web
  - Laissez vide (`""`) si le lien n'est pas encore disponible
  - Le lien sera affiché comme désactivé
- `published` : `true` pour afficher l'app, `false` pour la masquer

### 3. Ajouter les traductions (optionnel)

Si vous ajoutez de nouveaux textes spécifiques à l'application, ajoutez-les dans :
- `i18n/fr.json`
- `i18n/en.json`

## Développement local

### Prérequis
- Un serveur web local (Python, Node.js, PHP, etc.)

### Avec Python
```bash
cd website
python3 -m http.server 8000
```
Puis ouvrez http://localhost:8000

### Avec Node.js (http-server)
```bash
npm install -g http-server
cd website
http-server
```

### Avec PHP
```bash
cd website
php -S localhost:8000
```

## Déploiement sur OVH Starter

1. **Préparer les fichiers**
   - Assurez-vous que tous les fichiers sont prêts
   - Vérifiez que les chemins des assets sont corrects

2. **Uploader les fichiers**
   - Connectez-vous à votre espace OVH
   - Utilisez FTP ou le gestionnaire de fichiers
   - Uploadez tout le contenu du dossier `website/` dans le répertoire `www/` ou `public_html/`

3. **Structure sur le serveur**
   ```
   www/
   ├── index.html
   ├── css/
   ├── js/
   ├── data/
   ├── i18n/
   └── assets/
   ```

4. **Vérifications**
   - Testez que le site fonctionne
   - Vérifiez que les images se chargent
   - Testez le changement de langue
   - Vérifiez les liens vers les stores

## Personnalisation

### Couleurs
Les couleurs sont définies dans `css/style.css` via les variables CSS :
- `--primary-color` : Couleur primaire (#68A373)
- `--background-color` : Couleur de fond (#98B39F)
- `--surface-color` : Couleur de surface (#98B39F)

### Typographie
La police Poppins est chargée depuis Google Fonts. Pour changer, modifiez :
- Le lien dans `index.html`
- La propriété `font-family` dans `css/style.css`

## Support

Pour toute question, contactez : contact@fenikslabs.app

