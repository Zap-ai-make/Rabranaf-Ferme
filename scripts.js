// Configuration et variables globales
const config = {
    carousel: {
        interval: 3000,
        maxRandomDelay: 3000
    },
    chatbot: {
        // Configuration du chatbot (externalisée dans chatbot-config.js)
        get config() {
            return window.CHATBOT_CONFIG || {
                WEBHOOK_URL: 'API_ENDPOINT_HERE',
                TIMEOUT: 30000,
                LOADING_MESSAGE: "Assistant en cours de réflexion...",
                FALLBACK_RESPONSES: {},
                DEFAULT_ERROR_MESSAGE: "Service temporairement indisponible"
            };
        }
    }
};

// Utilitaires
const utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Menu hamburger
const initMobileMenu = () => {
    const btn = document.querySelector('.box');
    const navLinks = document.querySelector('.nav-links');
    
    if (!btn || !navLinks) return;
    
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Fermer le menu après un clic sur un lien
    navLinks.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            btn.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
};

// Bouton retour en haut
const initBackToTop = () => {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    const handleScroll = utils.debounce(() => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }, 100);

    window.addEventListener('scroll', handleScroll);
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

// Animations GSAP pour les cartes
const initCardAnimations = () => {
    const cards = document.querySelectorAll(".card");
    
    cards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(card, { scale: 1.05, duration: 0.3, ease: "power1.out" });
            }
        });

        card.addEventListener("mouseleave", () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(card, { scale: 1, duration: 0.3, ease: "power1.out" });
            }
        });
    });
};

// Chatbot
const initChatbot = () => {
    const chatContainer = document.querySelector("#chat-container");
    const chatToggle = document.querySelector("#chat-toggle");
    const chatClose = document.querySelector("#chat-close");
    const chatNotification = document.querySelector("#chat-notification");
    const chatHistory = document.querySelector("#chat-history");
    const chatInput = document.querySelector("#chat-input");
    const chatSend = document.querySelector("#chat-send");

    if (!chatContainer || !chatToggle || !chatClose) return;

    const notificationMessage = "Bonjour ! Comment puis-je vous aider ? 😊";
    
    // Afficher la notification si pas encore vue
    const notificationSeen = localStorage.getItem("chatbotNotificationSeen");
    if (!notificationSeen && chatNotification) {
        setTimeout(() => {
            chatNotification.style.display = "block";
        }, 3000);
    }

    // Fonction pour obtenir la réponse du chatbot
    const getChatbotResponse = async (userMessage) => {
        try {
            return await callChatAPI(userMessage);
        } catch (error) {
            return getFallbackResponse(userMessage);
        }
    };

    // Fonction pour appeler l'API du chatbot
    const callChatAPI = async (userMessage) => {
        const chatConfig = config.chatbot.config;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), chatConfig.TIMEOUT);


        try {
            // Construire les données à envoyer
            const payload = {
                [chatConfig.REQUEST_FORMAT?.messageField || 'message']: userMessage,
                [chatConfig.REQUEST_FORMAT?.timestampField || 'timestamp']: new Date().toISOString(),
                [chatConfig.REQUEST_FORMAT?.sourceField || 'source']: 'rabranaf-website'
            };

            // Ajouter les champs additionnels si configurés
            if (chatConfig.REQUEST_FORMAT?.additionalFields) {
                Object.assign(payload, chatConfig.REQUEST_FORMAT.additionalFields);
            }

            const response = await fetch(chatConfig.WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            
            // Cas spécial : si la réponse est directement une chaîne
            if (typeof data === 'string') {
                return data;
            }
            
            // Extraire la réponse de l'API
            const responseFields = chatConfig.RESPONSE_FORMAT?.responseFields || ['response', 'message', 'text', 'answer', 'reply'];
            for (const field of responseFields) {
                if (data[field] && typeof data[field] === 'string') {
                    return data[field];
                }
            }
            
            // Chercher dans les autres champs disponibles
            for (const [key, value] of Object.entries(data)) {
                if (typeof value === 'string' && value.trim().length > 0) {
                    return value;
                }
            }
            
            
            return "Désolé, je n'ai pas pu traiter votre demande.";
            
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    };

    // Fonction de fallback en cas d'erreur
    const getFallbackResponse = (userMessage) => {
        const chatConfig = config.chatbot.config;
        const message = userMessage.toLowerCase().trim();
        
        
        // Recherche de mots-clés dans le message
        for (const [keyword, response] of Object.entries(chatConfig.FALLBACK_RESPONSES)) {
            if (message.includes(keyword)) {
                return response;
            }
        }
        
        return chatConfig.DEFAULT_ERROR_MESSAGE;
    };

    // Fonction pour envoyer un message
    const sendMessage = async () => {
        const userMessage = chatInput.value.trim();
        if (userMessage === "") return;

        // Désactiver l'input pendant le traitement
        chatInput.disabled = true;
        chatSend.disabled = true;

        // Afficher le message de l'utilisateur
        chatHistory.innerHTML += `<div class="user-message">${userMessage}</div>`;
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // Afficher l'indicateur de chargement
        const loadingId = 'loading-' + Date.now();
        const chatConfig = config.chatbot.config;
        chatHistory.innerHTML += `<div class="bot-message loading-message" id="${loadingId}">${chatConfig.LOADING_MESSAGE}</div>`;
        chatHistory.scrollTop = chatHistory.scrollHeight;

        try {
            // Obtenir la réponse du chatbot
            const botResponse = await getChatbotResponse(userMessage);
            
            // Supprimer le message de chargement
            const loadingElement = document.getElementById(loadingId);
            if (loadingElement) {
                loadingElement.remove();
            }
            
            // Afficher la réponse
            chatHistory.innerHTML += `<div class="bot-message">${botResponse}</div>`;
            
        } catch (error) {
            // Supprimer le message de chargement
            const loadingElement = document.getElementById(loadingId);
            if (loadingElement) {
                loadingElement.remove();
            }
            
            // Afficher un message d'erreur
            chatHistory.innerHTML += `<div class="bot-message error-message">❌ Une erreur s'est produite. Veuillez réessayer.</div>`;
        }

        // Réactiver l'input
        chatInput.disabled = false;
        chatSend.disabled = false;
        chatInput.value = "";
        chatInput.focus();
        chatHistory.scrollTop = chatHistory.scrollHeight;
    };

    // Ouvrir le chatbot
    chatToggle.addEventListener("click", () => {
        chatContainer.style.display = "block";
        chatToggle.style.display = "none";
        
        if (chatNotification) {
            chatNotification.style.display = "none";
        }

        if (!localStorage.getItem("chatbotOpened") && chatHistory) {
            chatHistory.innerHTML += `<div class="bot-message">${notificationMessage}</div>`;
            localStorage.setItem("chatbotOpened", "true");
        }

        localStorage.setItem("chatbotNotificationSeen", "true");
    });

    // Fermer le chatbot
    chatClose.addEventListener("click", () => {
        chatContainer.style.display = "none";
        chatToggle.style.display = "block";
    });

    // Envoyer avec le bouton
    if (chatSend) {
        chatSend.addEventListener("click", sendMessage);
    }

    // Envoyer avec Entrée
    if (chatInput) {
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendMessage();
        });
    }
};

// Carrousel
const initCarousels = () => {
    const carousels = document.querySelectorAll(".slider-container");

    carousels.forEach((carousel, carouselIndex) => {
        const slider = carousel.querySelector(".slider");
        const slides = carousel.querySelectorAll(".slide");
        const pagination = carousel.querySelector(".pagination");
        
        if (!slider || slides.length === 0 || !pagination) {
            console.error(`Erreur : Impossible de trouver les éléments du carrousel ${carouselIndex + 1}`);
            return;
        }

        let index = 0;
        const totalSlides = slides.length;

        // Dupliquer la première image pour une transition fluide
        const firstClone = slides[0].cloneNode(true);
        slider.appendChild(firstClone);

        // Création des points de pagination
        pagination.innerHTML = "";
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement("span");
            dot.addEventListener("click", () => goToSlide(i));
            pagination.appendChild(dot);
        }

        const dots = pagination.querySelectorAll("span");

        const updateSlider = () => {
            if (index >= totalSlides) {
                slider.style.transition = "none";
                slider.style.transform = "translateX(0)";
                index = 0;
                setTimeout(() => {
                    slider.style.transition = "transform 0.5s ease-in-out";
                    slide();
                }, 50);
            } else {
                slider.style.transform = `translateX(${-index * 100}%)`;
            }

            dots.forEach(dot => dot.classList.remove("active"));
            if (index < totalSlides && dots[index]) {
                dots[index].classList.add("active");
            }
        };

        const slide = () => {
            index++;
            updateSlider();
        };

        const goToSlide = (i) => {
            index = i;
            updateSlider();
        };

        // Initialiser la première slide
        if (dots[0]) dots[0].classList.add("active");
        updateSlider();

        // Démarrage avec délai aléatoire pour désynchroniser
        const randomDelay = Math.floor(Math.random() * config.carousel.maxRandomDelay);
        setTimeout(() => {
            setInterval(slide, config.carousel.interval);
        }, randomDelay);
    });
};

// Google Maps
const initMap = () => {
    const mapElement = document.getElementById("google-map");
    if (!mapElement || typeof google === 'undefined') return;

    const map = new google.maps.Map(mapElement, {
        center: { lat: 12.3342, lng: -1.6267 },
        zoom: 15,
    });

    if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
        new google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: { lat: 12.3342, lng: -1.6267 },
            title: "Nous sommes ici !",
        });
    }
};

// Animations GSAP
const initGSAPAnimations = () => {
    if (typeof gsap === 'undefined') return;

    // Animation de la section héroïque
    gsap.from(".hero-content h1", {
        y: -50,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power2.out"
    });

    gsap.from(".hero-content p", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        delay: 0.8,
        ease: "power2.out"
    });

    gsap.from(".cta-button, .cta-button2", {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        delay: 1,
        ease: "back.out(1.7)"
    });

    // Parallax video
    gsap.to(".hero-background video", {
        scale: 1.5,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.4
        }
    });

    // Animation des éléments au scroll
    gsap.utils.toArray("h2, h3, p:not(footer p, .hero-content p)").forEach(element => {
        gsap.from(element, {
            opacity: 0,
            y: 50,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Parallax carrousels
    gsap.utils.toArray(".slider-container").forEach(img => {
        gsap.to(img, {
            y: -50,
            ease: "none",
            scrollTrigger: {
                trigger: img,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Animation des cartes de services
    gsap.utils.toArray(".card").forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 1,
            delay: index * 0.2,
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Animations spécifiques aux pages
    initPageSpecificAnimations();
};

// Animations spécifiques par page
const initPageSpecificAnimations = () => {
    if (typeof gsap === 'undefined') return;

    // Page Contact
    const contactElements = {
        h1: ".contact h1",
        intro: ".contact .intro",
        form: ".contact-form",
        info: ".contact-info"
    };

    Object.entries(contactElements).forEach(([key, selector]) => {
        const element = document.querySelector(selector);
        if (element) {
            const animations = {
                h1: { y: -50, opacity: 0, duration: 1, ease: "power2.out" },
                intro: { y: 50, opacity: 0, duration: 1, delay: 0.5, ease: "power2.out" },
                form: { scale: 0.8, opacity: 0, duration: 1, delay: 1, ease: "back.out(1.7)" },
                info: { opacity: 0, x: -50, duration: 1, delay: 1.5, ease: "power2.out" }
            };
            gsap.from(element, animations[key]);
        }
    });

    // Page À propos
    const aboutElements = {
        h1: ".about h1",
        intro: ".about .intro",
        text: ".about-text",
        image: ".about-image img"
    };

    Object.entries(aboutElements).forEach(([key, selector]) => {
        const element = document.querySelector(selector);
        if (element) {
            const animations = {
                h1: { y: -50, opacity: 0, duration: 1, ease: "power2.out" },
                intro: { opacity: 0, y: 50, duration: 1, delay: 0.5, ease: "power2.out" },
                text: { opacity: 0, x: -50, duration: 1, delay: 1, ease: "power2.out" },
                image: { opacity: 0, x: 50, duration: 1, delay: 1.2, ease: "power2.out" }
            };
            gsap.from(element, animations[key]);
        }
    });
};

// Gestion des formulaires
const initFormHandling = () => {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (event) => {
            // Ne pas empêcher l'envoi si c'est vers un webhook réel
            if (form.action === "#") {
                event.preventDefault();
                alert('Merci pour votre message ! Nous vous répondrons sous peu.');
                form.reset();
            }
        });
    }
};

// Initialisation générale
const init = () => {
    // Initialiser tous les modules
    initMobileMenu();
    initBackToTop();
    initCardAnimations();
    initChatbot();
    initCarousels();
    initFormHandling();
    
    // Initialiser GSAP si disponible
    if (typeof gsap !== 'undefined') {
        initGSAPAnimations();
    }
};

// Attendre que le DOM soit chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Exposer initMap globalement pour Google Maps
window.initMap = initMap;