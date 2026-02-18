// RPG Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Fix mobile 100vh issues by setting a CSS variable --vh based on window.innerHeight
    function setVh() {
        document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
    }
    setVh();
    window.addEventListener('resize', setVh);
    // ========== CUSTOM CURSOR ==========
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);
    
    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (!isMobile) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        document.addEventListener('mousedown', () => {
            cursor.classList.add('click');
        });
        
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('click');
        });
        
        const hoverElements = document.querySelectorAll('a, button, .character-card, .quest-card, .skill-branch, .btn-select-character, .btn-view-quest, .btn-start-adventure, .btn-accept-quest, .btn-upgrade-skills, .btn-reset-tree, .btn-send-scroll, .btn-clear-scroll, .rpg-contact-link');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    } else {
        cursor.style.display = 'none';
    }
    
    // ========== RPG CHARACTER SELECTION ==========
    const characterCards = document.querySelectorAll('.character-card');
    const selectButtons = document.querySelectorAll('.btn-select-character');
    const gameStartSection = document.getElementById('gameStartSection');
    const selectedClassName = document.getElementById('selectedClassName');
    const startAdventureBtn = document.getElementById('startAdventure');
    
    let selectedCharacter = null;
    
    // Character selection functionality
    selectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const characterClass = this.getAttribute('data-class');
            selectCharacter(characterClass);
        });
    });
    
    // Character card click functionality
    characterCards.forEach(card => {
        card.addEventListener('click', function() {
            const characterClass = this.getAttribute('data-class');
            selectCharacter(characterClass);
        });
    });
    
    function selectCharacter(characterClass) {
        // Remove selected class from all cards
        characterCards.forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selected class to chosen card
        const selectedCard = document.querySelector(`.character-card[data-class="${characterClass}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
            
            // Scroll to selected card
            selectedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Update selected character
        selectedCharacter = characterClass;
        
        // Update display text
        let displayName = '';
        switch(characterClass) {
            case 'paladin':
                displayName = 'Full-Stack Paladin';
                break;
            case 'ranger':
                displayName = 'Frontend Ranger';
                break;
            case 'wizard':
                displayName = 'Backend Wizard';
                break;
        }
        
        selectedClassName.textContent = displayName;
        
        // Show game start section with animation
        gameStartSection.style.display = 'block';
        gameStartSection.style.animation = 'fadeIn 0.5s ease-out';
        
        // Show notification
        showNotification(`Selected: ${displayName}`, 'success');
    }
    
    // Start adventure button
    if (startAdventureBtn) {
        startAdventureBtn.addEventListener('click', function() {
            if (!selectedCharacter) {
                showNotification('Please select a character class first!', 'error');
                return;
            }
            
            // Add loading animation
            this.innerHTML = '<span class="btn-text">Loading Adventure...</span><span class="btn-icon">⏳</span>';
            this.disabled = true;
            
            // Simulate loading with sound effects
            setTimeout(() => {
                // Navigate to projects section (first quest)
                document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
                
                // Reset button
                this.innerHTML = '<span class="btn-text">Begin Your Quest</span><span class="btn-icon">🚀</span>';
                this.disabled = false;
                
                // Show quest start notification
                showNotification('Quest Started! Your adventure begins...', 'success');
                
                // Add RPG sound effect (would be implemented with audio API)
                playRPGSound('quest_start');
            }, 1500);
        });
    }
    
    // RPG Sound Effects (placeholder for audio implementation)
    function playRPGSound(soundType) {
        // This would be implemented with Howler.js or Web Audio API
        console.log(`Playing RPG sound: ${soundType}`);
        // Example: new Audio(`sounds/${soundType}.mp3`).play();
    }
    
    // ========== RPG QUEST INTERACTION ==========
    const questCards = document.querySelectorAll('.quest-card');
    const viewQuestButtons = document.querySelectorAll('.btn-view-quest');
    const acceptNewQuestBtn = document.getElementById('acceptNewQuest');
    
    // Quest card hover effects
    questCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            playRPGSound('card_hover');
        });
        
        card.addEventListener('click', function() {
            const questId = this.getAttribute('data-quest');
            viewQuestDetails(questId);
        });
    });
    
    // View quest button functionality
    viewQuestButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click event
            const questId = this.getAttribute('data-quest');
            viewQuestDetails(questId);
        });
    });
    
    function viewQuestDetails(questId) {
        let questName = '';
        let questDescription = '';
        
        switch(questId) {
            case 'merchant-guild':
                questName = 'Merchant Guild Mission';
                questDescription = 'E-commerce platform for Samah Clothing with Firebase integration';
                break;
            case 'transport-network':
                questName = 'Transport Network Quest';
                questDescription = 'Real-time tracking app for Trotro vehicles in Ghana';
                break;
            case 'probability-challenge':
                questName = 'Probability Calculation Challenge';
                questDescription = 'Sports betting engine using Poisson distribution models';
                break;
        }
        
        // Show quest details modal (would be implemented)
        showNotification(`Viewing quest: ${questName}`, 'success');
        playRPGSound('quest_view');
        
        // In a full implementation, this would open a modal with detailed quest info
        console.log(`Quest Details: ${questName} - ${questDescription}`);
    }
    
    // Accept new quest button
    if (acceptNewQuestBtn) {
        acceptNewQuestBtn.addEventListener('click', function() {
            // Show loading state
            this.innerHTML = '<span class="btn-text">Scanning for Quests...</span><span class="btn-icon">🔍</span>';
            this.disabled = true;
            
            // Simulate quest scanning
            setTimeout(() => {
                // Reset button
                this.innerHTML = '<span class="btn-text">Accept New Quest</span><span class="btn-icon">⚔️</span>';
                this.disabled = false;
                
                // Show quest available notification
                showNotification('🎯 New quest available: Contact Guild Mission!', 'success');
                playRPGSound('quest_available');
                
                // Scroll to contact section
                setTimeout(() => {
                    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }, 2000);
        });
    }
    
    // ========== RPG SKILL TREE INTERACTION ==========
    const skillNodes = document.querySelectorAll('.skill-node');
    const upgradeSkillsBtn = document.getElementById('upgradeSkills');
    const resetTreeBtn = document.getElementById('resetTree');
    
    // Skill node click functionality
    skillNodes.forEach(node => {
        node.addEventListener('click', function() {
            const skillId = this.getAttribute('data-skill');
            viewSkillDetails(skillId);
        });
    });
    
    function viewSkillDetails(skillId) {
        let skillName = '';
        let skillDescription = '';
        
        switch(skillId) {
            case 'html-css':
                skillName = 'HTML/CSS Artistry';
                skillDescription = 'Mastery of semantic HTML and modern CSS techniques';
                break;
            case 'javascript':
                skillName = 'JavaScript Sorcery';
                skillDescription = 'Advanced ES6+ features and modern frameworks';
                break;
            case 'react':
                skillName = 'React Framework';
                skillDescription = 'Component-based architecture and state management';
                break;
            case 'nodejs':
                skillName = 'Node.js Wizardry';
                skillDescription = 'Server-side JavaScript and backend development';
                break;
            case 'firebase':
                skillName = 'Firebase Alchemy';
                skillDescription = 'Real-time database and authentication systems';
                break;
            case 'api':
                skillName = 'API Conjuring';
                skillDescription = 'RESTful API design and integration';
                break;
            case 'git':
                skillName = 'Git & GitHub Lore';
                skillDescription = 'Version control and collaborative workflows';
                break;
            case 'vscode':
                skillName = 'VS Code Forge';
                skillDescription = 'Development environment and extensions';
                break;
            case 'playwright':
                skillName = 'Playwright Automation';
                skillDescription = 'Browser automation and testing';
                break;
        }
        
        // Show skill details
        showNotification(`🔍 ${skillName}: ${skillDescription}`, 'success');
        playRPGSound('skill_view');
        
        // Add visual feedback
        const clickedNode = document.querySelector(`.skill-node[data-skill="${skillId}"]`);
        if (clickedNode) {
            clickedNode.style.transform = 'scale(1.05)';
            clickedNode.style.boxShadow = '0 0 20px rgba(76, 201, 240, 0.5)';
            
            setTimeout(() => {
                clickedNode.style.transform = '';
                clickedNode.style.boxShadow = '';
            }, 500);
        }
    }
    
    // Upgrade skills button
    if (upgradeSkillsBtn) {
        upgradeSkillsBtn.addEventListener('click', function() {
            // Show loading state
            this.innerHTML = '<span class="btn-text">Upgrading Skills...</span><span class="btn-icon">⚡</span>';
            this.disabled = true;
            
            // Simulate skill upgrade
            setTimeout(() => {
                // Find learning skills and "upgrade" them
                const learningSkills = document.querySelectorAll('.skill-node.learning');
                if (learningSkills.length > 0) {
                    // Upgrade first learning skill
                    const firstSkill = learningSkills[0];
                    firstSkill.classList.remove('learning');
                    firstSkill.classList.add('unlocked');
                    
                    const statusElement = firstSkill.querySelector('.node-status');
                    if (statusElement) {
                        statusElement.textContent = '✅ Mastered';
                        statusElement.style.background = 'rgba(76, 201, 240, 0.2)';
                        statusElement.style.color = '#4cc9f0';
                        statusElement.style.border = '1px solid rgba(76, 201, 240, 0.3)';
                    }
                    
                    // Increase progress
                    const progressFill = firstSkill.querySelector('.progress-fill');
                    const progressValue = firstSkill.querySelector('.progress-value');
                    if (progressFill && progressValue) {
                        const currentWidth = parseInt(progressFill.style.width);
                        const newWidth = Math.min(currentWidth + 15, 100);
                        progressFill.style.width = `${newWidth}%`;
                        progressValue.textContent = `${newWidth}%`;
                    }
                    
                    showNotification('🎉 Skill upgraded! Your abilities have improved.', 'success');
                    playRPGSound('skill_upgrade');
                } else {
                    showNotification('🎓 All skills already mastered!', 'success');
                }
                
                // Reset button
                this.innerHTML = '<span class="btn-text">Upgrade Skills</span><span class="btn-icon">⬆️</span>';
                this.disabled = false;
            }, 1500);
        });
    }
    
    // Reset tree button
    if (resetTreeBtn) {
        resetTreeBtn.addEventListener('click', function() {
            if (confirm('⚠️ Are you sure you want to reset your skill points? This cannot be undone.')) {
                // Show loading state
                this.innerHTML = '<span class="btn-text">Resetting Skills...</span><span class="btn-icon">🔄</span>';
                this.disabled = true;
                
                // Simulate reset
                setTimeout(() => {
                    // Reset all skills to learning state
                    skillNodes.forEach(node => {
                        node.classList.remove('unlocked');
                        node.classList.add('learning');
                        
                        const statusElement = node.querySelector('.node-status');
                        if (statusElement) {
                            statusElement.textContent = '📚 Learning';
                            statusElement.style.background = 'rgba(255, 215, 0, 0.2)';
                            statusElement.style.color = '#ffd700';
                            statusElement.style.border = '1px solid rgba(255, 215, 0, 0.3)';
                        }
                        
                        // Reset progress to 50%
                        const progressFill = node.querySelector('.progress-fill');
                        const progressValue = node.querySelector('.progress-value');
                        if (progressFill && progressValue) {
                            progressFill.style.width = '50%';
                            progressValue.textContent = '50%';
                        }
                    });
                    
                    showNotification('🔄 Skill tree has been reset. Time to learn again!', 'success');
                    playRPGSound('tree_reset');
                    
                    // Reset button
                    this.innerHTML = '<span class="btn-text">Reset Skill Points</span><span class="btn-icon">🔄</span>';
                    this.disabled = false;
                }, 1000);
            }
        });
    }
    
    // ========== RPG CONTACT FORM FUNCTIONALITY ==========
    const contactForm = document.querySelector('.rpg-contact-form');
    const sendScrollBtn = document.querySelector('.btn-send-scroll');
    const clearScrollBtn = document.querySelector('.btn-clear-scroll');
    
    if (contactForm) {
        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const adventurerName = document.getElementById('adventurerName').value;
            const scrollAddress = document.getElementById('scrollAddress').value;
            const questType = document.getElementById('questType').value;
            const questDetails = document.getElementById('questDetails').value;
            const rewardOffer = document.getElementById('rewardOffer').value;
            
            // Validate form
            if (!adventurerName || !scrollAddress || !questType || !questDetails) {
                showNotification('Please fill in all required fields, brave adventurer!', 'error');
                playRPGSound('error');
                return;
            }
            
            // Show loading state
            if (sendScrollBtn) {
                sendScrollBtn.innerHTML = '<span class="btn-text">Sending Raven...</span><span class="btn-icon"><i class="fas fa-spinner fa-spin"></i></span>';
                sendScrollBtn.disabled = true;
            }
            
            // Simulate sending scroll (in real app, this would be an API call)
            setTimeout(() => {
                // Reset button
                if (sendScrollBtn) {
                    sendScrollBtn.innerHTML = '<span class="btn-text">Seal and Send Scroll</span><span class="btn-icon"><i class="fas fa-fire"></i></span>';
                    sendScrollBtn.disabled = false;
                }
                
                // Show success message
                showNotification('📜 Your quest proposal has been sent! The guild will respond within 24 hours.', 'success');
                playRPGSound('quest_submit');
                
                // Reset form
                contactForm.reset();
                
                // Log form data (in real app, this would be sent to server)
                console.log('Quest Proposal Submitted:', {
                    adventurerName,
                    scrollAddress,
                    questType,
                    questDetails,
                    rewardOffer,
                    timestamp: new Date().toISOString()
                });
            }, 2000);
        });
    }
    
    // Clear scroll button
    if (clearScrollBtn) {
        clearScrollBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear the scroll? All your writing will be lost.')) {
                contactForm.reset();
                showNotification('Scroll has been cleared. Ready for a new quest proposal!', 'success');
                playRPGSound('scroll_clear');
            }
        });
    }
    
    // Form field focus effects
    const formFields = document.querySelectorAll('.rpg-contact-form input, .rpg-contact-form select, .rpg-contact-form textarea');
    
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            playRPGSound('field_focus');
        });
        
        field.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // ========== THEME TOGGLE ==========
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Get current theme from localStorage or system preference
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Apply theme on load
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Apply new theme
            document.documentElement.setAttribute('data-theme', newTheme);
            
            // Save to localStorage
            localStorage.setItem('theme', newTheme);
            
            // Show notification
            showNotification(`Switched to ${newTheme} mode`, 'success');
            
            // RPG theme change effect
            playRPGSound('theme_change');
        });
    }
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
        }
    });
    
    // ========== NAVIGATION ==========
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav item based on scroll position
        updateActiveNavItem();
    });
    
    // Mobile menu toggle - Start Menu style
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navLinks.classList.contains('active');
            
            if (isActive) {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                menuToggle.style.boxShadow = 'var(--glow-primary)';
                menuToggle.setAttribute('aria-expanded', 'false');
            } else {
                navLinks.classList.add('active');
                menuToggle.innerHTML = '<i class="fas fa-times"></i>';
                menuToggle.style.boxShadow = 'var(--glow-accent)';
                menuToggle.setAttribute('aria-expanded', 'true');
            }
            
            // Add cyberpunk sound effect
            try {
                playRPGSound('menu_toggle');
            } catch (e) {
                // Sound not available, ignore
            }
        });
    }
    
    // Close mobile menu when clicking a link
    if (navItems && navItems.length > 0) {
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Close mobile menu
                if (window.innerWidth <= 768 && navLinks) {
                    navLinks.classList.remove('active');
                    if (menuToggle) {
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                        menuToggle.style.boxShadow = 'var(--glow-primary)';
                        menuToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && navLinks && navLinks.classList.contains('active')) {
            // Check if click is outside navbar
            const navbar = document.querySelector('.navbar');
            if (navbar && !navbar.contains(e.target)) {
                navLinks.classList.remove('active');
                if (menuToggle) {
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    menuToggle.style.boxShadow = 'var(--glow-primary)';
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (menuToggle) {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                menuToggle.style.boxShadow = 'var(--glow-primary)';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Update active nav item function
    function updateActiveNavItem() {
        const scrollPosition = window.scrollY + 100;
        
        navItems.forEach(item => {
            const section = document.querySelector(item.getAttribute('href'));
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            }
        });
    }
    
    // ========== SMOOTH SCROLLING ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (window.innerWidth <= 768 && navLinks) {
                    navLinks.classList.remove('active');
                    if (menuToggle) {
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                        menuToggle.style.boxShadow = 'var(--glow-primary)';
                    }
                }
                
                // Scroll to target
                const navHeight = navbar ? navbar.offsetHeight : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // ========== PROJECT CARDS ANIMATION ==========
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // ========== FORM VALIDATION & SUBMISSION ==========
    const contactFormAlt = document.querySelector('.contact-form');

    if (contactFormAlt) {
        const inputs = contactFormAlt.querySelectorAll('input, textarea');
        const submitBtn = contactFormAlt.querySelector('button[type="submit"]');
        
        // Input focus effects
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
            
            // Validate on input
            input.addEventListener('input', () => {
                validateInput(input);
            });
        });
        
        // Form submission
        contactFormAlt.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate all inputs
            let isValid = true;
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                showNotification('Please fill in all required fields correctly.', 'error');
                return;
            }
            
            // Get form data
                const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
            }
            
            try {
                // Simulate API call (replace with actual API endpoint)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Success
                showNotification('🎉 Thank you for your message! I\'ll get back to you within 24 hours.', 'success');
                this.reset();
                
                // Reset focus states
                inputs.forEach(input => {
                    input.parentElement.classList.remove('focused');
                });
                
            } catch (error) {
                showNotification('❌ Something went wrong. Please try again or email me directly.', 'error');
            } finally {
                // Reset button state
                if (submitBtn) {
                    submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                    submitBtn.disabled = false;
                }
            }
        });
        
        // Input validation function
        function validateInput(input) {
            const parent = input.parentElement;
            const errorElement = parent.querySelector('.error-message') || createErrorElement(parent);
            
            if (input.hasAttribute('required') && !input.value.trim()) {
                errorElement.textContent = 'This field is required';
                parent.classList.add('error');
                return false;
            }
            
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    errorElement.textContent = 'Please enter a valid email address';
                    parent.classList.add('error');
                    return false;
                }
            }
            
            // Clear error
            errorElement.textContent = '';
            parent.classList.remove('error');
            return true;
        }
        
        function createErrorElement(parent) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            parent.appendChild(errorElement);
            return errorElement;
        }
    }
    
    // ========== NOTIFICATION SYSTEM ==========
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-remove after 5 seconds
        const autoRemove = setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }
    
    // ========== SCROLL ANIMATIONS ==========
    const sections = document.querySelectorAll('.rpg-hero, .rpg-quests, .rpg-skill-tree, .rpg-contact-guild');
    
    const sectionObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, sectionObserverOptions);
    
    sections.forEach(section => sectionObserver.observe(section));
    
    // ========== SKILLS ANIMATION ==========
    const skillItems = document.querySelectorAll('.skill-item');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    skillItems.forEach(item => observer.observe(item));
    
    // ========== TYPEWRITER EFFECT FOR HERO ==========
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing after a delay
        setTimeout(typeWriter, 1000);
    }
    
    // ========== INITIAL ACTIVE NAV ITEM ==========
    updateActiveNavItem();
    
    // ========== CONSOLE LOG FOR FUN ==========
    console.log('%c👋 Welcome to my portfolio!', 'color: #4361ee; font-size: 18px; font-weight: bold;');
    console.log('%cBuilt with passion and attention to detail.', 'color: #6c757d; font-size: 14px;');
});

// ========== ADDITIONAL CSS FOR JS FEATURES ==========
const additionalCSS = `
    /* Mobile menu active state */
    .nav-links.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        padding: 2rem;
        box-shadow: var(--shadow-lg);
        border-radius: 0 0 var(--radius) var(--radius);
    }
    
    /* Form error states */
    .form-group.error input,
    .form-group.error textarea {
        border-color: #ef4444 !important;
    }
    
    .error-message {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.5rem;
    }
    
    /* Notification system */
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: var(--radius);
        box-shadow: var(--shadow-xl);
        padding: 1rem 1.5rem;
        z-index: 9999;
        transform: translateX(100%);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        max-width: 400px;
        border-left: 4px solid #4361ee;
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification-success {
        border-left-color: #10b981;
    }
    
    .notification-error {
        border-left-color: #ef4444;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background-color 0.2s;
    }
    
    .notification-close:hover {
        background-color: #f3f4f6;
    }
    
    /* Skills animation */
    .skill-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .skill-item.animate {
        opacity: 1;
        transform: translateY(0);
    }
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);