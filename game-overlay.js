// Portfolio Game Overlay - Plane Clicker Game
// Transparent canvas overlay with flying plane

document.addEventListener('DOMContentLoaded', () => {
    // Game configuration
    const config = {
        planeSize: 40,           // Small plane size in pixels
        planeSpeed: 2.5,         // Movement speed (pixels per frame)
        planeSizeMobile: 28,     // Even smaller on mobile
        edgePadding: 50,         // Keep within bounds with padding
        respawnDelay: 500,       // Delay before plane respawns (ms)
        minFlyHeight: 80,        // Minimum height from top (avoid navbar)
        maxFlyHeightPercent: 0.85 // Maximum height as percentage of viewport (85%)
    };

    // Audio context for explosion sound
    let audioContext = null;
    
    // Initialize audio context on first user interaction
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }
    
    // Play explosion sound
    function playExplosionSound() {
        if (!audioContext) return;
        
        try {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            // Create noise buffer for explosion effect
            const bufferSize = audioContext.sampleRate * 0.5; // 0.5 seconds
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            // Fill with white noise
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = audioContext.createBufferSource();
            noise.buffer = buffer;
            
            // Filter to make it sound more like an explosion
            const filter = audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1000;
            
            // Gain envelope for explosion effect
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            // Connect nodes
            noise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Play sound
            noise.start();
            noise.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio play failed:', e);
        }
    }

    // DOM elements
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score-value');
    const gameOverlay = document.getElementById('game-overlay');

    if (!canvas || !gameOverlay) {
        console.log('Game overlay elements not found, skipping game initialization');
        return;
    }

    // Game state
    let score = 0;
    let plane = null;
    let animationId = null;
    let isMobile = window.innerWidth <= 768;

    // Canvas setup
    function resizeCanvas() {
        // Prefer CSS --vh for mobile-safe viewport height (set in script.js)
        const vhVar = getComputedStyle(document.documentElement).getPropertyValue('--vh');
        const vh = vhVar ? parseFloat(vhVar) : (window.innerHeight * 0.01);
        canvas.width = window.innerWidth;
        canvas.height = Math.round(vh * 100); // vh * 100 => actual viewport height in px
        isMobile = window.innerWidth <= 768;
    }

    // Plane class with random direction
    class Plane {
        constructor() {
            this.size = isMobile ? config.planeSizeMobile : config.planeSize;
            this.direction = this.getRandomDirection();
            this.speed = config.planeSpeed + (Math.random() * 1.5);
            this.angle = 0;
            this.opacity = 0;
            this.spawnAnimation = 0;
            this.glowIntensity = 15;
            
            // Set initial position based on direction
            this.setInitialPosition();
        }

        getRandomDirection() {
            const directions = ['left', 'right', 'top', 'bottom'];
            return directions[Math.floor(Math.random() * directions.length)];
        }

        setInitialPosition() {
            const padding = this.size + 20;
            const minY = config.minFlyHeight;
            const maxY = canvas.height * config.maxFlyHeightPercent;
            
            switch(this.direction) {
                case 'right':
                    this.x = -padding;
                    this.y = minY + Math.random() * (maxY - minY);
                    this.rotation = 0;
                    break;
                case 'left':
                    this.x = canvas.width + padding;
                    this.y = minY + Math.random() * (maxY - minY);
                    this.rotation = Math.PI;
                    break;
                case 'bottom':
                    this.x = Math.random() * canvas.width;
                    this.y = -padding;
                    this.rotation = Math.PI / 2;
                    break;
                case 'top':
                    this.x = Math.random() * canvas.width;
                    this.y = canvas.height + padding;
                    this.rotation = -Math.PI / 2;
                    break;
            }
        }

        update() {
            // Move plane based on direction
            switch(this.direction) {
                case 'right':
                    this.x += this.speed;
                    break;
                case 'left':
                    this.x -= this.speed;
                    break;
                case 'bottom':
                    this.y += this.speed;
                    break;
                case 'top':
                    this.y -= this.speed;
                    break;
            }

            // Bobbing animation
            this.angle += 0.05;
            
            // Apply bobbing perpendicular to movement direction
            const bobAmount = Math.sin(this.angle) * 0.5;
            if (this.direction === 'right' || this.direction === 'left') {
                this.y += bobAmount;
            } else {
                this.x += bobAmount;
            }

            // Fade in animation
            if (this.spawnAnimation < 1) {
                this.spawnAnimation += 0.03;
                this.opacity = Math.min(this.spawnAnimation, 1);
            } else {
                this.opacity = 1;
                this.glowIntensity = 15 + Math.sin(this.angle * 2) * 5;
            }

            // Check if off-screen
            const padding = this.size + 30;
            const offScreen = (
                (this.direction === 'right' && this.x > canvas.width + padding) ||
                (this.direction === 'left' && this.x < -padding) ||
                (this.direction === 'bottom' && this.y > canvas.height + padding) ||
                (this.direction === 'top' && this.y < -padding)
            );

            return !offScreen;
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            ctx.shadowBlur = this.glowIntensity;
            ctx.shadowColor = '#00f3ff';

            // Draw plane using simple shapes (always facing right, rotated by context)
            // Main body
            ctx.fillStyle = '#00f3ff';
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size * 0.6, this.size * 0.25, 0, 0, Math.PI * 2);
            ctx.fill();

            // Wings
            ctx.fillStyle = '#00b8c4';
            ctx.beginPath();
            ctx.moveTo(-this.size * 0.3, 0);
            ctx.lineTo(this.size * 0.1, -this.size * 0.4);
            ctx.lineTo(this.size * 0.2, -this.size * 0.4);
            ctx.lineTo(this.size * 0.1, 0);
            ctx.fill();

            // Tail
            ctx.fillStyle = '#9d00ff';
            ctx.beginPath();
            ctx.moveTo(-this.size * 0.4, -this.size * 0.1);
            ctx.lineTo(-this.size * 0.6, -this.size * 0.2);
            ctx.lineTo(-this.size * 0.6, this.size * 0.1);
            ctx.fill();

            // Engine glow
            ctx.fillStyle = '#ff00ff';
            ctx.globalAlpha = this.opacity * 0.7;
            ctx.beginPath();
            ctx.arc(-this.size * 0.5, 0, this.size * 0.15, 0, Math.PI * 2);
            ctx.fill();

            // Contrail
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.moveTo(-this.size * 0.6, 0);
            ctx.lineTo(-this.size * 1.5, Math.sin(this.angle) * 5);
            ctx.stroke();

            ctx.restore();
        }

        isPointInside(x, y) {
            // Calculate distance from plane center
            const dx = x - this.x;
            const dy = y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= this.size * 0.8;
        }
    }

    // Animation loop
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw plane
        if (plane) {
            const stillFlying = plane.update();
            plane.draw(ctx);

            if (!stillFlying) {
                plane = null;
                setTimeout(spawnPlane, config.respawnDelay + Math.random() * 1500);
            }
        }

        animationId = requestAnimationFrame(animate);
    }

    // Spawn new plane
    function spawnPlane() {
        if (!plane) {
            plane = new Plane();
        }
    }

    // Handle pointer event on canvas
    function handlePointerEvent(e) {
        // Initialize audio on first interaction
        initAudio();
        
        // Don't prevent default to allow scrolling through
        
        if (!plane) return;

        // Get pointer position relative to canvas
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        // Check if we have valid coordinates
        if (typeof clientX === 'undefined' || typeof clientY === 'undefined') return;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Check if plane was clicked
        if (plane.isPointInside(x, y)) {
            e.preventDefault(); // Only prevent if we hit the plane
            
            // Play explosion sound
            playExplosionSound();
            
            // Add score
            score++;
            scoreElement.textContent = score;

            // Visual feedback
            showClickFeedback(x, y);

            // Remove plane and spawn new one after delay
            plane = null;
            setTimeout(spawnPlane, config.respawnDelay);
            
            // Save score to localStorage
            try {
                localStorage.setItem('portfolioPlaneScore', score.toString());
            } catch (e) {
                // Ignore localStorage errors
            }
        }
    }

    // Visual feedback when plane is clicked
    function showClickFeedback(x, y) {
        // Create floating score text
        const feedback = document.createElement('div');
        feedback.className = 'click-feedback';
        feedback.innerHTML = '<i class="fas fa-plus"></i> 1';
        feedback.style.left = x + 'px';
        feedback.style.top = y + 'px';
        gameOverlay.appendChild(feedback);

        // Animate and remove
        if (typeof gsap !== 'undefined') {
            gsap.to(feedback, {
                y: -60,
                opacity: 0,
                scale: 1.2,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => {
                    if (feedback.parentNode) {
                        feedback.remove();
                    }
                }
            });
        } else {
            // Fallback without GSAP
            let opacity = 1;
            let translateY = 0;
            const animate = () => {
                opacity -= 0.02;
                translateY -= 1;
                feedback.style.opacity = opacity;
                feedback.style.transform = `translateY(${translateY}px) scale(1.2)`;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    if (feedback.parentNode) {
                        feedback.remove();
                    }
                }
            };
            animate();
        }

        // Create explosion particles
        for (let i = 0; i < 6; i++) {
            createParticle(x, y, i);
        }

        // Score animation
        if (typeof gsap !== 'undefined') {
            gsap.to(scoreElement, {
                scale: 1.3,
                color: '#ff00ff',
                duration: 0.15,
                yoyo: true,
                repeat: 1,
                ease: "power2.out",
                onComplete: () => {
                    scoreElement.style.color = '';
                }
            });
        }
    }

    // Create particle explosion
    function createParticle(x, y, index) {
        const particle = document.createElement('div');
        particle.className = 'game-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        gameOverlay.appendChild(particle);

        const angle = (Math.PI * 2 * index) / 6;
        const distance = 25 + Math.random() * 15;

        if (typeof gsap !== 'undefined') {
            gsap.to(particle, {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                opacity: 0,
                scale: 0,
                duration: 0.5 + Math.random() * 0.3,
                ease: "power2.out",
                onComplete: () => {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                }
            });
        } else {
            // Fallback without GSAP
            let progress = 0;
            const animate = () => {
                progress += 0.05;
                const currentX = Math.cos(angle) * distance * progress;
                const currentY = Math.sin(angle) * distance * progress;
                const opacity = 1 - progress;
                const scale = 1 - progress;
                
                particle.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
                particle.style.opacity = opacity;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                }
            };
            animate();
        }
    }

    // Load saved score
    function loadScore() {
        try {
            const saved = localStorage.getItem('portfolioPlaneScore');
            if (saved) {
                score = parseInt(saved, 10);
                scoreElement.textContent = score;
            }
        } catch (e) {
            // Ignore localStorage errors
        }
    }

    // Reset score
    function resetScore() {
        score = 0;
        scoreElement.textContent = score;
        try {
            localStorage.removeItem('portfolioPlaneScore');
        } catch (e) {
            // Ignore localStorage errors
        }
        
        // Visual feedback
        if (typeof gsap !== 'undefined') {
            gsap.to(scoreElement, {
                scale: 1.5,
                color: '#ff00ff',
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    scoreElement.style.color = '';
                }
            });
        }
    }

    // Add reset button listener
    const resetBtn = document.getElementById('reset-score-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            resetScore();
        });
    }

    // Initialize
    function init() {
        resizeCanvas();
        loadScore();
        animate();

        // Event listeners
        window.addEventListener('resize', resizeCanvas);

        // Pointer events for both mouse and touch
        canvas.addEventListener('pointerdown', handlePointerEvent);
        
        // Also support touch events for better mobile compatibility
        canvas.addEventListener('touchstart', handlePointerEvent, { passive: false });

        // Start first plane after a short delay
        setTimeout(spawnPlane, 1500);
    }

    // Start the game
    init();
});
