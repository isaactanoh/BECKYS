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
 * - Performance optimizations
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========================================
    // NAVIGATION
    // ========================================

    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navClose = document.getElementById('navClose');
    const header = document.getElementById('header');
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);

    function toggleMenu(isOpen) {
        if (!navMenu) return;
        
        if (isOpen) {
            navMenu.classList.add('nav--open');
            menuOverlay.classList.add('menu-overlay--active');
            document.body.style.overflow = 'hidden';
            if (mobileToggle) {
                mobileToggle.setAttribute('aria-expanded', 'true');
                mobileToggle.innerHTML = '<i class="fas fa-times"></i>';
            }
        } else {
            navMenu.classList.remove('nav--open');
            menuOverlay.classList.remove('menu-overlay--active');
            document.body.style.overflow = '';
            if (mobileToggle) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    }

    // Mobile menu toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = navMenu.classList.contains('nav--open');
            toggleMenu(!isOpen);
        });

        // Close menu with dedicated close button
        if (navClose) {
            navClose.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleMenu(false);
            });
        }

        // Close menu on link click
        navMenu.querySelectorAll('.nav__link').forEach(function(link) {
            link.addEventListener('click', function() {
                toggleMenu(false);
            });
        });

        // Close menu when clicking on overlay
        menuOverlay.addEventListener('click', function() {
            toggleMenu(false);
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('nav--open')) {
                toggleMenu(false);
            }
        });
    }

    // Header scroll effect with debounce
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(function() {
            if (header) {
                if (window.scrollY > 50) {
                    header.classList.add('header--scrolled');
                } else {
                    header.classList.remove('header--scrolled');
                }
            }
        });
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

                // Close all other FAQs
                faqQuestions.forEach(function(q) {
                    if (q !== question) {
                        q.classList.remove('active');
                        q.nextElementSibling.style.maxHeight = null;
                    }
                });

                // Toggle current FAQ
                if (!isActive) {
                    this.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    this.classList.remove('active');
                    answer.style.maxHeight = null;
                }
            });
        });

        // Auto-open FAQ if hash matches
        if (window.location.hash) {
            const targetId = window.location.hash.replace('#', '');
            const targetQuestion = document.querySelector(`[data-faq="${targetId}"]`);
            if (targetQuestion) {
                setTimeout(function() {
                    targetQuestion.click();
                }, 500);
            }
        }
    }

    // ========================================
    // CHAT BOT
    // ========================================

    const chatToggle = document.getElementById('chatToggle');
    const chatContainer = document.getElementById('chatContainer');
    const chatClose = document.getElementById('chatClose');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatBot = document.querySelector('.chat-bot');

    // Enhanced bot responses with more business information
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
        'services': 'We offer a comprehensive range of cleaning services including:\n• Residential Cleaning\n• Commercial Cleaning\n• Deep Cleaning\n• Sofa Cleaning\n• Move In/Out Cleaning\n• Carpet Cleaning\n• Window Cleaning\n• Specialty Cleaning',
        'service': 'We offer residential, commercial, deep cleaning, sofa cleaning, move in/out, carpet, window, and specialty services. Which one are you interested in?',
        'residential': 'Our residential cleaning service covers dusting, vacuuming, mopping, kitchen cleaning, bathroom sanitization, bed making, and trash removal. We offer one-time, weekly, bi-weekly, and monthly schedules.',
        'commercial': 'Our commercial cleaning service keeps your office or business space spotless. We offer flexible scheduling including daily, weekly, or monthly cleanings. Perfect for offices, shops, and businesses.',
        'deep cleaning': 'Deep cleaning is our most thorough service! It includes everything in standard cleaning plus inside appliances, cabinet fronts, grout and tile scrubbing, baseboards, window tracks, and more. Recommended every 3-6 months.',
        'sofa': 'Our sofa cleaning service uses specialized steam cleaning equipment to remove stains, dirt, and allergens. We also offer upholstery and mattress cleaning.',
        'move in': 'Our move-in/move-out cleaning service ensures your new home is spotless before you arrive or your old place is ready for the next occupants. Includes full deep clean, inside appliances, cabinets, and windows.',
        'move out': 'Yes, we offer move-out cleaning! We\'ll make sure your old place is spotless. Includes full deep clean of all rooms, appliances, and fixtures.',
        'carpet': 'We offer professional carpet cleaning using eco-friendly products and advanced steam cleaning equipment. Removes deep-seated dirt, stains, and allergens.',
        'window': 'Our window washing service leaves your windows streak-free and sparkling. Includes inside and outside cleaning, sills, frames, and screens.',
        'specialty': 'Our specialty services include post-construction cleanup, event cleaning, mattress cleaning, pressure washing, odor removal, and emergency cleaning.',
        'post construction': 'Post-construction cleaning is our specialty! We handle all the dust, debris, and mess after renovation or construction projects.',
        'price': 'Our pricing depends on the size of your space, type of cleaning, and frequency. Contact us for a free quote! We offer competitive rates and discounts for recurring services.',
        'cost': 'Pricing varies based on the service type, property size, and cleaning frequency. Contact us for a free quote! We\'re transparent about our pricing.',
        'quote': 'You can get a free quote by visiting our Contact page, calling us at 054 297 7602, or messaging us on WhatsApp. We\'ll provide a no-obligation estimate.',
        'pricing': 'Our pricing is transparent and competitive. We offer:\n• One-time cleanings\n• Weekly/bi-weekly/monthly recurring services with discounts\n• Deep cleaning packages\n• Custom quotes for large spaces\nContact us for your free quote!',
        'discount': 'Yes, we offer discounted rates for recurring services! Weekly and bi-weekly cleanings come with special reduced rates. Monthly packages are also available.',
        'package': 'Yes, we offer special monthly packages! Contact us for more details about our recurring service discounts.',
        'payment': 'We accept mobile money (MTN, Vodafone, AirtelTigo), bank transfers, and cash. Payment is due after service completion.',
        'pay': 'We accept MTN Mobile Money, Vodafone Cash, AirtelTigo Money, bank transfers, and cash. All payment methods are secure and convenient.',
        'schedule': 'You can schedule a cleaning by calling 054 297 7602, using our online booking form on the Contact page, or messaging us on WhatsApp. We\'re available 7 days a week!',
        'book': 'Visit our Contact page and fill out the booking form, or call us directly at 054 297 7602. We\'ll confirm your appointment within 24 hours.',
        'booking': 'To book a service, fill out our booking form on the Contact page, call us at 054 297 7602, or message us on WhatsApp. We\'ll get back to you within 24 hours.',
        'availability': 'We\'re available Monday through Sunday, 7:00 AM to 8:00 PM. We also work on public holidays with early booking recommended.',
        'time': 'We\'re open from 7:00 AM to 8:00 PM, seven days a week. We\'re flexible and can accommodate your preferred schedule.',
        'hours': 'Our business hours are Monday to Sunday, 7:00 AM to 8:00 PM. We\'re available for bookings throughout the week.',
        'when': 'We operate 7 days a week, from 7:00 AM to 8:00 PM. Contact us to find a time that works for you!',
        'holiday': 'Yes, we work on public holidays! Availability may be limited, so we recommend booking early for holiday cleanings.',
        'weekend': 'Yes, we\'re available on weekends! We operate 7 days a week to accommodate your schedule.',
        'area': 'We serve the Greater Accra Region and surrounding areas, including Accra, Tema, and neighboring communities.',
        'location': 'We proudly serve the Greater Accra Region of Ghana. Contact us to check if we cover your specific area.',
        'serving': 'We serve homes and businesses throughout the Greater Accra Region, including Accra, Tema, and surrounding areas in Ghana.',
        'accra': 'Yes, we serve Accra and the entire Greater Accra Region! We cover all major areas in and around Accra.',
        'products': 'We use eco-friendly, non-toxic cleaning products that are safe for your family, pets, and the environment. Our products are biodegradable and free from harsh chemicals.',
        'eco': 'Yes, we prioritize eco-friendly cleaning! Our products are non-toxic, biodegradable, and safe for children and pets. We also use microfiber cloths to reduce waste.',
        'safe': 'Absolutely! Our cleaning products are child-safe and pet-friendly. We also offer fragrance-free options for sensitive individuals.',
        'equipment': 'We bring all necessary equipment including high-quality vacuums, steam cleaners, mops, and microfiber cloths. You don\'t need to provide anything.',
        'supply': 'No, you don\'t need to provide any supplies! We bring everything needed for a complete cleaning service.',
        'trust': 'All our cleaners are thoroughly vetted, background-checked, and professionally trained. Your safety and security are our top priorities.',
        'insurance': 'Yes, we are fully insured and bonded. You can have peace of mind knowing our services are protected.',
        'vetted': 'Every team member undergoes thorough background checks and extensive training. We only hire the most trustworthy and skilled professionals.',
        'trained': 'All our cleaning professionals receive comprehensive training in cleaning techniques, safety protocols, and customer service.',
        'satisfaction': 'Your satisfaction is our priority! If you\'re not happy, contact us within 24 hours and we\'ll re-clean at no charge. We stand behind our work.',
        'guarantee': 'We offer a 100% Satisfaction Guarantee! If you\'re not completely satisfied, we\'ll make it right. Our goal is to exceed your expectations.',
        'happy': 'We strive for 100% customer satisfaction. Our 4.9-star rating speaks to our commitment to excellence.',
        'not satisfied': 'If you\'re not satisfied, contact us within 24 hours. We\'ll return and re-clean at no extra cost. Your satisfaction is guaranteed!',
        'tips': 'Here are some cleaning tips:\n• Regularly wipe down surfaces\n• Vacuum high-traffic areas twice a week\n• Clean your kitchen and bathroom weekly\n• Schedule a deep clean every 3-6 months\n• Use microfiber cloths for streak-free cleaning',
        'cleaning tips': 'Some helpful tips:\n• Always dust before you vacuum\n• Use microfiber cloths for streak-free cleaning\n• Don\'t forget to clean your cleaning tools\n• Open windows for ventilation when cleaning\n• Let us handle the heavy cleaning!',
        'how often': 'For most homes, we recommend weekly regular cleaning with a deep clean every 3-6 months. For offices, we recommend weekly or bi-weekly maintenance.',
        'frequency': 'We offer one-time, daily, weekly, bi-weekly, and monthly cleaning schedules. Choose what works best for your lifestyle and budget.',
        'what to expect': 'When you book with us, you can expect:\n• Punctual arrival\n• Professional service\n• Thorough cleaning\n• Eco-friendly products\n• 100% satisfaction guarantee\n• Friendly, trustworthy team',
        'first time': 'For first-time clients, we recommend starting with a deep cleaning to get your space to a pristine baseline. Then we can maintain it with regular cleanings.',
        'contact': 'You can reach us by:\n• Phone: 054 297 7602\n• Email: thebeckscleaningservices@gmail.com\n• WhatsApp: 054 297 7602\n• Contact page on our website\n• Instagram: @becks_cleaningservices',
        'phone': 'Our phone number is 054 297 7602. Feel free to call or WhatsApp us! We\'re available 7 days a week.',
        'email': 'You can email us at thebeckscleaningservices@gmail.com. We\'ll respond within 24 hours.',
        'whatsapp': 'You can reach us on WhatsApp at 054 297 7602. We respond quickly to messages!',
        'instagram': 'Follow us on Instagram @becks_cleaningservices for cleaning tips, special offers, and before/after photos!',
        'tiktok': 'Check us out on TikTok @beckscleaning_services for satisfying cleaning videos and transformations!',
        'social': 'We\'re active on:\n• Instagram: @becks_cleaningservices\n• TikTok: @beckscleaning_services\n• WhatsApp: 054 297 7602\nFollow us for updates and tips!',
        'address': 'We\'re based in Accra, serving the Greater Accra Region. We come to your location for all our cleaning services.',
        'business hours': 'We\'re open Monday through Sunday, 7:00 AM to 8:00 PM. We\'re flexible to accommodate your schedule.',
        'help': 'I\'m here to help! You can ask me about:\n• Our cleaning services\n• Pricing and quotes\n• Scheduling and booking\n• Service areas\n• Products and safety\n• Company information\n• FAQs\n• Contact details',
        'questions': 'Feel free to ask me anything about our cleaning services, pricing, scheduling, products, or company. I\'m here to help!',
        'support': 'I\'m your virtual support assistant. I can help with questions about our services, booking, pricing, company info, and more.',
        'default': 'I\'m not sure I understand that question. You can always call us at 054 297 7602, email us at thebeckscleaningservices@gmail.com, or visit our Contact page for more help. What would you like to know about our cleaning services?'
    };

    function getBotResponse(message) {
        const msg = message.toLowerCase().trim();
        
        // Check for exact matches first
        for (const [key, response] of Object.entries(botResponses)) {
            if (msg === key || msg.startsWith(key + ' ') || msg.includes(' ' + key + ' ')) {
                return response;
            }
        }
        
        // Check for keyword matches
        const keywords = {
            'service': 'services',
            'cleaning': 'services',
            'price': 'price',
            'cost': 'cost',
            'quote': 'quote',
            'book': 'book',
            'booking': 'book',
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
            'supplies': 'supply',
            'team': 'team',
            'company': 'company',
            'about': 'about',
            'hours': 'hours',
            'time': 'time',
            'area': 'area',
            'location': 'location',
            'accra': 'accra',
            'pay': 'payment',
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
            'commercial': 'commercial',
            'office': 'commercial',
            'home': 'residential',
            'house': 'residential',
            'apartment': 'residential'
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
    // DRAGGABLE CHAT BOT
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

    // Only initialize if there are gallery items
    if (galleryItems.length > 0) {
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
    }

    function openLightbox(index) {
        if (!lightbox || !lightboxImg || galleryImages.length === 0) return;
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
                    const delay = parseInt(target.dataset.delay) || 0;
                    setTimeout(function() {
                        target.classList.add('reveal--visible');
                    }, delay);
                    revealObserver.unobserve(target);
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
    // FORMS
    // ========================================

    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    // Prevent selecting a past date in the booking date picker
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.setAttribute('min', yyyy + '-' + mm + '-' + dd);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const service = document.getElementById('service');
            const address = document.getElementById('address');
            const date = document.getElementById('date');
            const time = document.getElementById('time');

            // Basic validation
            let isValid = true;
            const requiredFields = [name, email, phone, service, address, date, time];
            
            requiredFields.forEach(function(field) {
                if (field && !field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else if (field) {
                    field.classList.remove('error');
                }
            });

            if (!isValid) {
                if (formError) {
                    formError.classList.add('form-message--visible');
                    setTimeout(function() {
                        formError.classList.remove('form-message--visible');
                    }, 5000);
                }
                return;
            }

            if (email && !email.value.includes('@')) {
                alert('Please enter a valid email address.');
                email.classList.add('error');
                return;
            }

            if (date && date.value) {
                const todayStr = new Date().toISOString().split('T')[0];
                if (date.value < todayStr) {
                    alert('Please choose today or a future date.');
                    date.classList.add('error');
                    return;
                }
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
            submitBtn.disabled = true;

            // Submit to Netlify
            const formData = new FormData(contactForm);
            
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(function() {
                // Success
                contactForm.style.display = 'none';
                if (formSuccess) {
                    formSuccess.classList.add('form-message--visible');
                }
                setTimeout(function() {
                    window.location.href = 'thankyou.html';
                }, 2000);
            })
            .catch(function(error) {
                console.error('Form submission error:', error);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                if (formError) {
                    formError.classList.add('form-message--visible');
                    setTimeout(function() {
                        formError.classList.remove('form-message--visible');
                    }, 5000);
                }
            });
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
    // BACK TO TOP BUTTON
    // ========================================
    
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(function() {
                if (window.scrollY > 400) {
                    backToTopBtn.classList.add('floating-btn--top--visible');
                } else {
                    backToTopBtn.classList.remove('floating-btn--top--visible');
                }
            });
        }, { passive: true });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // DEVELOPMENT LOGS
    // ========================================

    if (window.console && window.location.hostname === 'localhost') {
        console.log('🚀 Becks Cleaning Service - Website Loaded Successfully');
        console.log('🤖 Chatbot: Enhanced with more responses and draggable');
        console.log('🖼️ Gallery: Lightbox with swipe support');
        console.log('📱 Mobile Menu: Fully responsive with social icons');
    }

});