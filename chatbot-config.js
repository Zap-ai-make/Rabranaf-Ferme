// Configuration du système de chatbot intelligent

const CHATBOT_CONFIG = {
    // URL de l'API du chatbot
    WEBHOOK_URL: 'https://swabo.app.n8n.cloud/webhook/36c7f73b-7783-4b06-9920-0c2b97ebd6a8',
    
    // Timeout pour les requêtes (en millisecondes)
    TIMEOUT: 30000, // 30 secondes
    
    // Message affiché pendant le traitement
    LOADING_MESSAGE: 'Assistant en cours de réflexion...',
    
    // Paramètres de retry
    RETRY_ATTEMPTS: 2,
    RETRY_DELAY: 1000, // 1 seconde
    
    // Structure des données envoyées à l'API
    REQUEST_FORMAT: {
        // Champs envoyés dans la requête
        messageField: 'message',        // Message de l'utilisateur
        timestampField: 'timestamp',    // Horodatage de la requête
        sourceField: 'source',          // Source de la requête
        
        // Champs additionnels optionnels
        additionalFields: {
            userAgent: navigator.userAgent,
            language: navigator.language || 'fr'
        }
    },
    
    // Format de réponse attendu de l'API
    RESPONSE_FORMAT: {
        // Ordre de priorité pour extraire la réponse
        responseFields: ['response', 'message', 'text', 'answer', 'reply']
    },
    
    // Réponses de secours en cas d'indisponibilité
    FALLBACK_RESPONSES: {
        'bonjour': 'Bonjour et bienvenue à la ferme Rabranaf ! Comment puis-je vous aider ? 😊',
        'hello': 'Hello and welcome to Rabranaf farm! How can I help you? 😊',
        'horaires': 'Nous sommes ouverts du lundi au samedi de 8h à 18h, fermés le dimanche.',
        'heures': 'Nos horaires : Lundi-Samedi 8h-18h, Dimanche fermé.',
        'ouverture': 'Nous ouvrons à 8h du matin et fermons à 18h.',
        'contact': 'Vous pouvez nous contacter au +226 75657200 ou par email à RabranafFerme@gmail.com',
        'telephone': 'Notre numéro de téléphone : +226 75657200',
        'email': 'Notre email : RabranafFerme@gmail.com',
        'adresse': 'Nous sommes situés Rue Hama Arba Diallo, Ouagadougou, Burkina Faso',
        'localisation': 'Rue Hama Arba Diallo, Ouagadougou, Burkina Faso',
        'produits': 'Nous proposons des bovins, viandes fraîches, volailles, produits dérivés (lait, fromage, œufs) et services traiteur.',
        'services': 'Nos services : vente de bovins, viandes, volailles, produits laitiers et traiteur.',
        'bovins': 'Nous vendons des vaches, moutons, chèvres, bœufs, chameaux et agneaux de qualité.',
        'viande': 'Nos viandes : carcasses d\'animaux, poulet, pintade, canard, pigeon et gésiers.',
        'volaille': 'Volailles disponibles : poulet, pintade, canard, pigeon, tous élevés fermiers.',
        'lait': 'Produits dérivés : lait frais, fromages artisanaux, yaourts, beurre, œufs et crème fraîche.',
        'fromage': 'Nous produisons des fromages artisanaux selon les méthodes traditionnelles.',
        'traiteur': 'Notre service traiteur propose des plats aux saveurs fermières avec des produits frais.',
        'commande': 'Pour passer commande, contactez-nous au +226 75657200 ou via WhatsApp.',
        'livraison': 'Renseignez-vous sur nos modalités de livraison en nous contactant directement.',
        'prix': 'Pour connaître nos tarifs, veuillez nous contacter au +226 75657200.',
        'merci': 'Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions. 😊',
        'au revoir': 'Merci de votre visite ! À bientôt sur rabranaf-ferme.com 👋',
        'aurevoir': 'À très bientôt ! Merci pour votre intérêt. 👋'
    },
    
    // Message d'erreur par défaut
    DEFAULT_ERROR_MESSAGE: 'Désolé, notre assistant n\'est pas disponible pour le moment. Vous pouvez nous contacter directement au +226 75657200 ou par email à RabranafFerme@gmail.com',
    
    // Mode debug (affiche les logs dans la console)
    DEBUG_MODE: false
};

// Export pour usage global
if (typeof window !== 'undefined') {
    window.CHATBOT_CONFIG = CHATBOT_CONFIG;
}