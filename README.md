# Rabranaf Ferme

Site web vitrine pour Rabranaf Ferme - Une ferme spécialisée dans l'élevage et la vente de produits fermiers.

## 🌟 Fonctionnalités

- **Site responsive** - Adapté à tous les appareils
- **Animations fluides** - Powered by GSAP
- **Carrousels interactifs** - Présentation des produits
- **Chatbot intégré** - Assistance client automatisée
- **Formulaire de contact** - Intégration webhook
- **Carte interactive** - Localisation Google Maps

## 🏗️ Technologies utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Variables CSS, Flexbox, Grid
- **JavaScript ES6+** - Fonctionnalités modernes
- **GSAP** - Animations avancées
- **Google Maps API** - Géolocalisation

## 📁 Structure du projet

```
Rabranaf/
├── index.html              # Page d'accueil
├── about.html              # À propos
├── contact.html            # Contact
├── services.html           # Services
├── services/               # Pages de services détaillées
│   ├── service-volaille.html
│   ├── service-produits-derives.html
│   ├── service-bovins.html
│   ├── service-viande.html
│   └── service-traiteur.html
├── images/                 # Ressources images
├── styles.css              # Styles principaux
├── responsive.css          # Styles responsive
├── scripts.js              # JavaScript principal
└── components/             # Composants réutilisables
    ├── navigation.html
    ├── footer.html
    └── chatbot.html
```


   
3. **Lancer le site**
   - Ouvrir `index.html` dans un navigateur
   - Ou utiliser un serveur local (Live Server, etc.)

## ⚙️ Configuration

### Chatbot
Les réponses du chatbot peuvent être modifiées dans `scripts.js` :

```javascript
const config = {
    chatbot: {
        responses: {
            "bonjour": " message personnalisé",
            // ... autres réponses
        }
    }
};
```

### Formulaire de contact
L'URL du webhook est configurable dans `contact.html` :

```html
<form action="WEBHOOK_URL" method="post">
```

## 🎨 Personnalisation

### Variables CSS
Les couleurs et espacements sont centralisés dans `styles.css` :

```css
:root {
    --primary-green: #4caf50;
    --accent-yellow: #ffeb3b;
    --text-dark: #333;
    /* ... autres variables */
}
```

### Animations
Les animations GSAP sont configurables dans `scripts.js` via la fonction `initGSAPAnimations()`.

## 📱 Responsive Design

Le site est optimisé pour :
- **Desktop** : > 768px
- **Tablet** : 768px - 1024px  
- **Mobile** : < 768px

## 🌍 Navigateurs supportés

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 80+

## 📞 Contact

**Rabranaf Ferme**
- 📍 Rue Hama Arba Diallo, Ouagadougou, Burkina Faso
- ☎️ +226 75657200
- ✉️ RabranafFerme@gmail.com

## 📄 Licence

Ce projet est sous licence privée. Tous droits réservés © 2025 Rabranaf Ferme.
