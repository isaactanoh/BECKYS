/**
 * ========================================
 * BECKS CLEANING SERVICE - MAIN JAVASCRIPT
 * ========================================
 * Handles all interactive functionality including:
 * - Navigation (mobile menu, scroll effects)
 * - FAQ accordion
 * - Chat bot (enhanced with draggable feature)
 * - Gallery lightbox
 * - Form submissions
 * - Scroll animations
 * - Floating buttons
 * - Performance optimizations
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========================================
    // NAVIGATION
    // ========================================

    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const header = document.getElementById('header');

    // Mobile menu toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.toggle('nav--open');
            this.setAttribute('aria-expanded', isOpen);
            this.innerHTML = isOpen ?
                '<i class="fas fa-times"></i>' :
                '<i class="fas fa-bars"></i>';
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu on link click
        navMenu.querySelectorAll('.nav__link').forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('nav--open');
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
            });
        });
    }

    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
        }
    }, { passive: true });

    // ========================================
    // FAQ ACCORDION
    // ========================================

    const faqQuestions = document.querySelectorAll('.faq-item__question');
    if (faqQuestions.length) {
        faqQuestions.forEach(function(question) {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const isActive = this.classList.contains('active');

                faqQuestions.forEach(function(q) {
                    if (q !== question) {
                        q.classList.remove('active');
                        q.nextElementSibling.style.maxHeight = null;
                    }
                });

                if (!isActive) {
                    this.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    this.classList.remove('active');
                    answer.style.maxHeight = null;
                }
            });
        });

        if (window.location.hash) {
            const targetId = window.location.hash.replace('#', '');
            const targetQuestion = document.querySelector(`[data-faq="${targetId}"]`);
            if (targetQuestion) {
                targetQuestion.click();
            }
        }
    }

    // ========================================
    // CHAT BOT - FULLY FIXED & DRAGGABLE
    // ========================================

    const chatToggle = document.getElementById('chatToggle');
    const chatContainer = document.getElementById('chatContainer');
    const chatClose = document.getElementById('chatClose');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatBot = document.querySelector('.chat-bot');

    // Enhanced bot responses
    const botResponses = {
        'hello': 'Hello! 👋 Welcome to Becks Cleaning Service. How can I assist you today?',
        'hi': 'Hi there! 👋 I\'m Becky, your cleaning assistant. What can I help you with?',
        'hey': 'Hey! 👋 Great to see you. How can I make your day cleaner and brighter?',
        'good morning': 'Good morning! ☀️ How can I help you start your day with a clean space?',
        'good afternoon': 'Good afternoon! 🌤️ What cleaning service can I help you with today?',
        'good evening': 'Good evening! 🌙 I\'m here to help with all your cleaning needs.',
        'company': 'Becks Cleaning Service was founded in 2018 by Miss Rebecca. We\'re a trusted cleaning company serving the Greater Accra Region with professional, eco-friendly cleaning solutions.',
        'who are you': 'I\'m Becky, your virtual cleaning assistant for Becks Cleaning Service. I\'m here to help answer your questions about our services!',
        'about': 'Becks Cleaning Service is a professional cleaning company based in Accra, Ghana. We specialize in residential, commercial, deep cleaning, sofa cleaning, and specialty services.',
        'mission': 'Our mission is to provide exceptional cleaning services that make a real difference in people\'s lives by creating clean, healthy, and comfortable environments.',
        'values': 'Our core values are: Quality, Care, Eco-Friendliness, Trust, Reliability, and Customer Satisfaction.',
        'founder': 'Our founder is Miss Rebecca, who started the company in 2018. She began her cleaning career while supporting her education and turned her passion into a thriving business.',
        'team': 'Our team consists of thoroughly vetted, professionally trained, and insured cleaning professionals.',
        'years': 'We\'ve been serving the Greater Accra Region since 2018, with over 7 years of experience.',
        'experience': 'With over 7 years of experience, we\'ve completed thousands of cleaning jobs and have built a reputation for excellence.',
        'services': 'We offer a comprehensive range of cleaning services including:\n• Residential Cleaning\n• Commercial Cleaning\n• Deep Cleaning\n• Sofa Cleaning\n• Specialty Cleaning',
        'service': 'We offer residential, commercial, deep cleaning, sofa cleaning, and specialty services. Which one are you interested in?',
        'residential': 'Our residential cleaning service covers dusting, vacuuming, mopping, kitchen cleaning, bathroom sanitization, bed making, and trash removal.',
        'commercial': 'Our commercial cleaning service keeps your office or business space spotless. We offer flexible scheduling including daily, weekly, or monthly cleanings.',
        'deep cleaning': 'Deep cleaning is our most thorough service! It includes everything in standard cleaning plus inside appliances, cabinet fronts, grout and tile scrubbing.',
        'sofa': 'Our sofa cleaning service uses specialized steam cleaning equipment to remove stains, dirt, and allergens.',
        'specialty': 'Our specialty services include post-construction cleanup, carpet cleaning, window washing, pressure washing, and more.',
        'carpet': 'We offer professional carpet cleaning using eco-friendly products and advanced equipment.',
        'window': 'Our window washing service leaves your windows streak-free and sparkling.',
        'post construction': 'Post-construction cleaning is our specialty! We handle all the dust, debris, and mess after renovation.',
        'move in': 'Our move-in/move-out cleaning service ensures your new home is spotless before you arrive.',
        'move out': 'Yes, we offer move-out cleaning! We\'ll make sure your old place is spotless.',
        'price': 'Our pricing depends on the size of your space, type of cleaning, and frequency. Contact us for a free quote!',
        'cost': 'Pricing varies based on the service type, property size, and cleaning frequency. Contact us for a free quote!',
        'quote': 'You can get a free quote by visiting our Contact page, calling us at 054 297 7602, or messaging us on WhatsApp.',
        'pricing': 'Our pricing is transparent and competitive. Contact us for a free quote!',
        'discount': 'Yes, we offer discounted rates for recurring services! Weekly and bi-weekly cleanings come with special reduced rates.',
        'package': 'Yes, we offer special monthly packages! Contact us for more details!',
        'payment': 'We accept mobile money (MTN, Vodafone, AirtelTigo), bank transfers, and cash.',
        'pay': 'We accept MTN Mobile Money, Vodafone Cash, AirtelTigo Money, bank transfers, and cash.',
        'schedule': 'You can schedule a cleaning by calling 054 297 7602, using our online booking form, or messaging us on WhatsApp.',
        'book': 'Visit our Contact page and fill out the booking form, or call us directly at 054 297 7602.',
        'booking': 'To book a service, fill out our booking form on the Contact page, or call us at 054 297 7602.',
        'availability': 'We\'re available Monday through Sunday, 7:00 AM to 8:00 PM.',
        'time': 'We\'re open from 7:00 AM to 8:00 PM, seven days a week.',
        'hours': 'Our business hours are Monday to Sunday, 7:00 AM to 8:00 PM.',
        'when': 'We operate 7 days a week, from 7:00 AM to 8:00 PM.',
        'holiday': 'Yes, we work on public holidays! Availability may be limited, so book early.',
        'weekend': 'Yes, we\'re available on weekends!',
        'area': 'We serve the Greater Accra Region and surrounding areas.',
        'location': 'We proudly serve the Greater Accra Region of Ghana.',
        'serving': 'We serve homes and businesses throughout the Greater Accra Region, including Accra, Tema, and surrounding areas.',
        'accra': 'Yes, we serve Accra and the entire Greater Accra Region!',
        'products': 'We use eco-friendly, non-toxic cleaning products that are safe for your family, pets, and the environment.',
        'eco': 'Yes, we prioritize eco-friendly cleaning! Our products are non-toxic, biodegradable, and safe for children and pets.',
        'safe': 'Absolutely! Our cleaning products are child-safe and pet-friendly.',
        'equipment': 'We bring all necessary equipment including high-quality vacuums, steam cleaners, mops, and microfiber cloths.',
        'supply': 'No, you don\'t need to provide any supplies! We bring everything needed.',
        'trust': 'All our cleaners are thoroughly vetted, background-checked, and professionally trained.',
        'insurance': 'Yes, we are fully insured and bonded.',
        'vetted': 'Every team member undergoes thorough background checks and extensive training.',
        'trained': 'All our cleaning professionals receive comprehensive training in cleaning techniques and safety protocols.',
        'satisfaction': 'Your satisfaction is our priority! If you\'re not happy, contact us within 24 hours and we\'ll re-clean at no charge.',
        'guarantee': 'We offer a 100% Satisfaction Guarantee! If you\'re not completely satisfied, we\'ll make it right.',
        'happy': 'We strive for 100% customer satisfaction.',
        'not satisfied': 'If you\'re not satisfied, contact us within 24 hours. We\'ll return and re-clean at no extra cost.',
        'tips': 'Here are some cleaning tips: Regularly wipe down surfaces, vacuum high-traffic areas twice a week, clean your kitchen and bathroom weekly, and schedule a deep clean every 3-6 months.',
        'cleaning tips': 'Some helpful tips: Always dust before you vacuum, use microfiber cloths for streak-free cleaning, and don\'t forget to clean your cleaning tools!',
        'how often': 'For most homes, we recommend weekly regular cleaning with a deep clean every 3-6 months.',
        'frequency': 'We offer one-time, daily, weekly, bi-weekly, and monthly cleaning schedules.',
        'what to expect': 'When you book with us, you can expect: punctual arrival, professional service, thorough cleaning, eco-friendly products, and 100% satisfaction.',
        'first time': 'For first-time clients, we recommend starting with a deep cleaning to get your space to a pristine baseline.',
        'contact': 'You can reach us by phone at 054 297 7602, email at thebeckscleaningservices@gmail.com, or through our Contact page.',
        'phone': 'Our phone number is 054 297 7602. Feel free to call or WhatsApp us!',
        'email': 'You can email us at thebeckscleaningservices@gmail.com.',
        'whatsapp': 'You can reach us on WhatsApp at 054 297 7602.',
        'instagram': 'Follow us on Instagram @becks_cleaningservices',
        'tiktok': 'Check us out on TikTok @beckscleaning_services',
        'social': 'We\'re active on Instagram (@becks_cleaningservices), TikTok (@beckscleaning_services), and WhatsApp.',
        'address': 'We\'re based in Accra, serving the Greater Accra Region.',
        'business hours': 'We\'re open Monday through Sunday, 7:00 AM to 8:00 PM.',
        'help': 'I\'m here to help! You can ask me about:\n• Our cleaning services\n• Pricing and quotes\n• Scheduling and booking\n• Service areas\n• Products and safety\n• Company information\n• FAQs',
        'questions': 'Feel free to ask me anything about our cleaning services, pricing, scheduling, products, or company.',
        'support': 'I\'m your virtual support assistant. I can help with questions about our services, booking, pricing, and more.',
        'default': 'I\'m not sure I understand that question. You can always call us at 054 297 7602 or visit our Contact page for more help.'
    };

    function getBotResponse(message) {
        const msg = message.toLowerCase().trim();
        
        for (const [key, response] of Object.entries(botResponses)) {
            if (msg.includes(key)) {
                return response;
            }
        }
        
        const keywords = {
            'service': 'services',
            'cleaning': 'services',
            'price': 'price',
            'cost': 'cost',
            'quote': 'quote',
            'book': 'book',
            'schedule': 'schedule',
            'contact': 'contact',
            'phone': 'phone',
            'email': 'email',
            'whatsapp': 'whatsapp',
            'instagram': 'instagram',
            'tiktok': 'tiktok',
            'safety': 'safe',
            'eco': 'eco',
            'products': 'products',
            'team': 'team',
            'company': 'company',
            'about': 'about',
            'hours': 'hours',
            'time': 'time',
            'area': 'area',
            'location': 'location',
            'accra': 'accra',
            'pay': 'pay',
            'payment': 'payment',
            'discount': 'discount',
            'guarantee': 'guarantee',
            'satisfaction': 'satisfaction',
            'tips': 'tips',
            'help': 'help',
            'support': 'support',
            'move': 'move in',
            'carpet': 'carpet',
            'window': 'window',
            'deep': 'deep cleaning',
            'sofa': 'sofa',
            'residential': 'residential',
            'commercial': 'commercial'
        };

        for (const [word, key] of Object.entries(keywords)) {
            if (msg.includes(word) && botResponses[key]) {
                return botResponses[key];
            }
        }

        return botResponses.default;
    }

    function addMessage(text, sender) {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-bot__message chat-bot__message--${sender}`;
        
        if (text.includes('\n')) {
            const lines = text.split('\n');
            lines.forEach(function(line, index) {
                if (index > 0) {
                    msgDiv.appendChild(document.createElement('br'));
                }
                msgDiv.appendChild(document.createTextNode(line));
            });
        } else {
            msgDiv.textContent = text;
        }
        
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        if (!chatInput) return;
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        chatInput.value = '';

        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-bot__message chat-bot__message--bot';
        typingDiv.textContent = '...';
        typingDiv.id = 'typingIndicator';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(function() {
            const typingIndicator = document.getElementById('typingIndicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            const response = getBotResponse(message);
            addMessage(response, 'bot');
        }, 600 + Math.random() * 400);
    }

    // Chat toggle
    if (chatToggle && chatContainer) {
        chatToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            chatContainer.classList.toggle('chat-bot__container--open');
            
            if (chatContainer.classList.contains('chat-bot__container--open')) {
                setTimeout(function() {
                    if (chatBot) {
                        const rect = chatBot.getBoundingClientRect();
                        const windowWidth = window.innerWidth;
                        const windowHeight = window.innerHeight;
                        
                        chatBot.classList.remove('chat-bot--left', 'chat-bot--top');
                        
                        if (rect.left < windowWidth / 2) {
                            chatBot.classList.add('chat-bot--left');
                        }
                        if (rect.top < windowHeight / 2) {
                            chatBot.classList.add('chat-bot--top');
                        }
                    }
                }, 50);
            }
        });
    }

    if (chatClose && chatContainer) {
        chatClose.addEventListener('click', function(e) {
            e.stopPropagation();
            chatContainer.classList.remove('chat-bot__container--open');
        });
    }

    if (chatSend && chatInput) {
        chatSend.addEventListener('click', function(e) {
            e.stopPropagation();
            sendMessage();
        });
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                sendMessage();
            }
        });
    }

    // ========================================
    // DRAGGABLE CHAT BOT - FIXED
    // ========================================

    if (chatBot) {
        let isDragging = false;
        let dragStartX, dragStartY, dragOffsetX, dragOffsetY;
        let wasDragged = false;

        function updateChatPosition() {
            const rect = chatBot.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            chatBot.classList.remove('chat-bot--left', 'chat-bot--top');
            
            if (rect.left < windowWidth / 2) {
                chatBot.classList.add('chat-bot--left');
            }
            
            if (rect.top < windowHeight / 2) {
                chatBot.classList.add('chat-bot--top');
            }
        }

        chatBot.addEventListener('mousedown', function(e) {
            if (!e.target.closest('.chat-bot__toggle')) return;
            
            e.preventDefault();
            wasDragged = false;
            isDragging = true;
            
            const rect = chatBot.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            
            chatBot.style.cursor = 'grabbing';
            chatBot.style.transition = 'none';
            chatBot.style.zIndex = '9999';
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            wasDragged = true;
            
            let x = e.clientX - dragOffsetX;
            let y = e.clientY - dragOffsetY;
            
            const maxX = window.innerWidth - chatBot.offsetWidth - 10;
            const maxY = window.innerHeight - chatBot.offsetHeight - 10;
            x = Math.max(10, Math.min(x, maxX));
            y = Math.max(10, Math.min(y, maxY));
            
            chatBot.style.left = x + 'px';
            chatBot.style.top = y + 'px';
            chatBot.style.right = 'auto';
            chatBot.style.bottom = 'auto';
            chatBot.style.transform = 'none';
        });

        document.addEventListener('mouseup', function(e) {
            if (isDragging) {
                isDragging = false;
                chatBot.style.cursor = 'grab';
                chatBot.style.transition = 'var(--transition-normal)';
                chatBot.style.zIndex = '999';
                
                updateChatPosition();
                
                if (!wasDragged) {
                    if (chatContainer) {
                        chatContainer.classList.toggle('chat-bot__container--open');
                    }
                }
            }
        });

        // Touch events for mobile
        chatBot.addEventListener('touchstart', function(e) {
            if (!e.target.closest('.chat-bot__toggle')) return;
            
            const touch = e.touches[0];
            wasDragged = false;
            isDragging = true;
            
            const rect = chatBot.getBoundingClientRect();
            dragOffsetX = touch.clientX - rect.left;
            dragOffsetY = touch.clientY - rect.top;
            
            chatBot.style.transition = 'none';
            chatBot.style.zIndex = '9999';
        }, { passive: true });

        document.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            wasDragged = true;
            
            const touch = e.touches[0];
            let x = touch.clientX - dragOffsetX;
            let y = touch.clientY - dragOffsetY;
            
            const maxX = window.innerWidth - chatBot.offsetWidth - 10;
            const maxY = window.innerHeight - chatBot.offsetHeight - 10;
            x = Math.max(10, Math.min(x, maxX));
            y = Math.max(10, Math.min(y, maxY));
            
            chatBot.style.left = x + 'px';
            chatBot.style.top = y + 'px';
            chatBot.style.right = 'auto';
            chatBot.style.bottom = 'auto';
            chatBot.style.transform = 'none';
        }, { passive: false });

        document.addEventListener('touchend', function(e) {
            if (isDragging) {
                isDragging = false;
                chatBot.style.transition = 'var(--transition-normal)';
                chatBot.style.zIndex = '999';
                
                updateChatPosition();
                
                if (!wasDragged) {
                    if (chatContainer) {
                        chatContainer.classList.toggle('chat-bot__container--open');
                    }
                }
            }
        }, { passive: true });

        window.addEventListener('resize', updateChatPosition);
        setTimeout(updateChatPosition, 100);
    }

    // ========================================
    // GALLERY LIGHTBOX
    // ========================================

    const galleryItems = document.querySelectorAll('.gallery-grid__item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');

    let currentIndex = 0;
    let galleryImages = [];
    let touchStartX = 0;

    galleryItems.forEach(function(item, index) {
        const img = item.querySelector('img');
        if (img) {
            galleryImages.push({
                src: img.src,
                alt: img.alt || 'Gallery image'
            });
        }
        item.addEventListener('click', function() {
            currentIndex = index;
            openLightbox(currentIndex);
        });
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                currentIndex = index;
                openLightbox(currentIndex);
            }
        });
    });

    function openLightbox(index) {
        if (!lightbox || !lightboxImg) return;
        const image = galleryImages[index];
        if (!image) return;
        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
        lightbox.classList.add('lightbox--open');
        document.body.style.overflow = 'hidden';
        updateCounter(index);
        setTimeout(function() {
            lightboxImg.focus();
        }, 100);
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('lightbox--open');
        document.body.style.overflow = '';
    }

    function updateCounter(index) {
        if (!lightboxCounter) return;
        lightboxCounter.textContent = `${index + 1} / ${galleryImages.length}`;
    }

    function showPrev() {
        if (galleryImages.length === 0) return;
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox(currentIndex);
    }

    function showNext() {
        if (galleryImages.length === 0) return;
        currentIndex = (currentIndex + 1) % galleryImages.length;
        openLightbox(currentIndex);
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrev);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNext);
    }

    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (!lightbox || !lightbox.classList.contains('lightbox--open')) return;
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        } else if (e.key === 'ArrowRight') {
            showNext();
        }
    });

    if (lightbox) {
        lightbox.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', function(e) {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    showNext();
                } else {
                    showPrev();
                }
            }
        }, { passive: true });
    }

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================

    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const delay = target.dataset.delay || 0;
                    setTimeout(function() {
                        target.classList.add('reveal--visible');
                    }, delay);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(function(el) {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(function(el) {
            el.classList.add('reveal--visible');
        });
    }

    // ========================================
    // ANIMATED COUNTERS
    // ========================================

    function animateCounters() {
        const counters = document.querySelectorAll('.hero__stat-number[data-count]');
        
        counters.forEach(function(counter) {
            const target = parseFloat(counter.getAttribute('data-count'));
            const isDecimal = target % 1 !== 0;
            const duration = 2000;
            const startTime = performance.now();
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = eased * target;
                
                if (isDecimal) {
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent = Math.floor(current);
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    if (isDecimal) {
                        counter.textContent = target.toFixed(1);
                    } else {
                        counter.textContent = target;
                    }
                }
            }
            
            // Use Intersection Observer to start animation when visible
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(updateCounter);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(counter);
        });
    }

    // ========================================
    // BACK TO TOP BUTTON
    // ========================================

    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('floating-btn--top--visible');
            } else {
                backToTopBtn.classList.remove('floating-btn--top--visible');
            }
        }, { passive: true });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // VIDEO FALLBACK
    // ========================================

    const heroVideo = document.getElementById('heroVideo');
    const heroSection = document.getElementById('hero');
    
    if (heroVideo) {
        // If video fails to load, show fallback
        heroVideo.addEventListener('error', function() {
            console.log('Video failed, using fallback image');
            if (heroSection) {
                heroSection.classList.add('hero--fallback');
            }
        });
        
        // Check if video is stuck loading
        setTimeout(function() {
            if (heroVideo.readyState === 0) {
                console.log('Video timed out, using fallback image');
                if (heroSection) {
                    heroSection.classList.add('hero--fallback');
                }
            }
        }, 5000);
    }

    // ========================================
    // FORMS
    // ========================================

    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const message = document.getElementById('message');

            let isValid = true;
            [name, email, phone, message].forEach(function(field) {
                if (field && !field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#b91c1c';
                } else if (field) {
                    field.style.borderColor = '';
                }
            });

            if (!isValid) {
                alert('Please fill in all required fields.');
                return;
            }

            if (email && !email.value.includes('@')) {
                alert('Please enter a valid email address.');
                email.style.borderColor = '#b91c1c';
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';

            setTimeout(function() {
                contactForm.style.display = 'none';
                formSuccess.classList.add('success-message--visible');
                submitBtn.textContent = originalText;

                setTimeout(function() {
                    window.location.href = 'thankyou.html';
                }, 2000);
            }, 1200);
        });
    }

    const bookingForm = document.getElementById('bookingForm');
    const bookingSuccess = document.getElementById('bookingSuccess');

    if (bookingForm && bookingSuccess) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const requiredFields = bookingForm.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(function(field) {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#b91c1c';
                    const existingError = field.parentElement.querySelector('.error-message');
                    if (!existingError) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'This field is required';
                        errorMsg.style.color = '#b91c1c';
                        errorMsg.style.fontSize = '0.8rem';
                        errorMsg.style.marginTop = '4px';
                        field.parentElement.appendChild(errorMsg);
                    }
                } else {
                    field.style.borderColor = '';
                    const errorMsg = field.parentElement.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });

            if (!isValid) {
                return;
            }

            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Booking...';

            setTimeout(function() {
                bookingForm.style.display = 'none';
                bookingSuccess.classList.add('success-message--visible');
                submitBtn.textContent = originalText;

                setTimeout(function() {
                    window.location.href = 'thankyou.html';
                }, 2000);
            }, 1200);
        });
    }

    // ========================================
    // SET CURRENT YEAR
    // ========================================

    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ========================================
    // LAZY LOADING
    // ========================================

    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // ========================================
    // SMOOTH SCROLL
    // ========================================

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                history.pushState(null, null, targetId);
            }
        });
    });

    // ========================================
    // INIT ANIMATED COUNTERS
    // ========================================

    animateCounters();

    // ========================================
    // CONSOLE LOG
    // ========================================

    if (window.console && window.location.hostname === 'localhost') {
        console.log('🚀 Becks Cleaning Service - Website Loaded Successfully');
        console.log('🤖 Chatbot: Fixed and draggable');
        console.log('🖼️ Gallery: Lightbox with swipe support');
        console.log('📱 Fully responsive on all devices');
    }

});