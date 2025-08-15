gsap.set(".some-element", { x: 0 });

const enableLoadingScreen = true; // <-- set to true to enable

document.addEventListener('DOMContentLoaded', () => {
    if (enableLoadingScreen) {
        new LoadingScreen();
    } else {
        initPortfolio(); // directly start your site without loading screen
    }
});

// Enhanced Loading Screen Animation
class LoadingScreen {
    constructor() {
        this.counter = 0;
        this.target = 100;
        this.increment = 0.5;
        this.loadingScreen = document.getElementById('loadingScreen');
        this.loadingCounter = document.getElementById('loadingCounter');
        this.loadingProgress = document.getElementById('loadingProgress');
        
        this.init();
    }
    
    init() {
        this.animateCounter();
        
        setTimeout(() => {
            this.hideLoader();
        }, 2000);
    }
    
    animateCounter() {
        const updateCounter = () => {
            if (this.counter < this.target) {
                this.counter += this.increment;
                if (this.counter > this.target) this.counter = this.target;
                
                this.loadingCounter.textContent = Math.floor(this.counter);
                this.loadingProgress.style.width = this.counter + '%';
                
                if (this.counter < 20) {
                    this.increment = 0.3;
                } else if (this.counter < 50) {
                    this.increment = 0.8;
                } else if (this.counter < 80) {
                    this.increment = 0.4;
                } else if (this.counter < 95) {
                    this.increment = 0.2;
                } else {
                    this.increment = 0.1;
                }
                
                requestAnimationFrame(updateCounter);
            } else {
                this.loadingCounter.textContent = '100';
                this.loadingProgress.style.width = '100%';
            }
        };
        
        updateCounter();
    }
    
    hideLoader() {
        gsap.to(this.loadingScreen, {
            opacity: 0,
            duration: 0.0,
            ease: "power2.out",
            onComplete: () => {
                this.loadingScreen.classList.add('hidden');
                document.body.style.overflow = 'visible';
                initPortfolio();
            }
        });
    }
}

// Enhanced Navigation with Horizontal Line Animation
class EnhancedNavigation {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.navOverlay = document.getElementById('navOverlay');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.navLine = document.getElementById('navLine');
        this.navHeader = document.querySelector('.nav-header');
        this.navFooter = document.querySelector('.nav-footer');
        this.isOpen = false;
        this.activeIndex = 0;
        
        this.init();
    }
    
    init() {
        this.hamburger.addEventListener('click', () => this.toggle());
        
        this.navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                this.setActive(index);
                this.close();
            });
            
            link.addEventListener('mouseenter', () => {
                this.animateLineToLink(index);
            });
        });
        
        const navContent = document.querySelector('.nav-content');
        navContent.addEventListener('mouseleave', () => {
            this.setActive(this.activeIndex);
        });
        
        this.setActive(0);
    }
    
    animateLineToLink(index) {
        const targetLink = this.navLinks[index];
        const linkRect = targetLink.getBoundingClientRect();
        const containerRect = document.querySelector('.nav-content').getBoundingClientRect();
        
        const relativeLeft = linkRect.left - containerRect.left;
        const relativeTop = (linkRect.top - containerRect.top) + (linkRect.height / 2);
        const linkWidth = linkRect.width;
        
        gsap.to(this.navLine, {
            opacity: 1,
            width: linkWidth,
            x: relativeLeft,
            y: relativeTop,
            duration: 0.6,
            ease: "power3.out"
        });
    }
    
    setActive(index) {
        this.activeIndex = index;
        this.animateLineToLink(index);
        
        this.navLinks.forEach((link, i) => {
            link.classList.toggle('active', i === index);
        });
    }
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    
    open() {
        this.isOpen = true;
        document.body.classList.add('nav-open');
        this.hamburger.classList.add('active');
        this.navOverlay.classList.add('active');
        
        gsap.set(this.navOverlay, { opacity: 0 });
        gsap.to(this.navOverlay, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out"
        });
        
        gsap.set([this.navHeader, ...this.navLinks, this.navFooter], {
            y: -100,
            opacity: 0
        });
        
        gsap.set(this.navLine, {
            width: 0,
            opacity: 0
        });
        
        const timeline = gsap.timeline();
        
        timeline.to(this.navHeader, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out"
        })
        .to(this.navLinks, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            onComplete: () => {
                setTimeout(() => {
                    this.animateLineToLink(this.activeIndex);
                }, 400);
            }
        }, "-=0.3")
        .to(this.navFooter, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.4");
    }
    
    close() {
        this.isOpen = false;
        document.body.classList.remove('nav-open');
        this.hamburger.classList.remove('active');
        
        const timeline = gsap.timeline();
        
        timeline.to(this.navFooter, {
            y: -50,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in"
        })
        .to(this.navLinks, {
            y: -100,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.in"
        }, "-=0.2")
        .to(this.navHeader, {
            y: -100,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in"
        }, "-=0.3")
        .to(this.navLine, {
            opacity: 0,
            width: 0,
            duration: 0.3,
            ease: "power2.in"
        }, 0);
        
        gsap.to(this.navOverlay, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: 0.3,
            onComplete: () => {
                this.navOverlay.classList.remove('active');
            }
        });
    }
}

// Enhanced Custom Cursor with Multiple Hover States
class EnhancedCursor {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');
        this.follower = document.querySelector('.custom-cursor-follower');
        this.init();
    }
    
    init() {
        if (!this.cursor || !this.follower) return;
        
        document.addEventListener('mousemove', (e) => {
            gsap.to(this.cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            });
            
            gsap.to(this.follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        // Draggable elements (projects track)
        const draggableElements = '.projects-track';
        document.querySelectorAll(draggableElements).forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover-drag');
                this.follower.classList.add('hover-drag');
                this.cursor.querySelector('span').textContent = 'Drag';
                
                gsap.to(this.cursor, {
                    scale: 1.2,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover-drag');
                this.follower.classList.remove('hover-drag');
                this.cursor.querySelector('span').textContent = 'VIEW';
                
                gsap.to(this.cursor, {
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            });
        });

        // Link elements (nav-social, featured-link, contact-btn, social-link)
        const linkElements = '.nav-social, .featured-link, .contact-btn, .social-link';
        document.querySelectorAll(linkElements).forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover-link');
                this.follower.classList.add('hover-link');
                this.cursor.querySelector('span').textContent = 'CLICK';
                
                gsap.to(this.cursor, {
                    scale: 1.3,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover-link');
                this.follower.classList.remove('hover-link');
                this.cursor.querySelector('span').textContent = 'VIEW';
                
                gsap.to(this.cursor, {
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            });
        });

        // Interactive elements (bento-card, hamburger, nav-link, project-card, header-arrow, nav-dot)
        const interactiveElements = '.bento-card, .hamburger, .nav-link, .header-arrow, .nav-dot';
        document.querySelectorAll(interactiveElements).forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover-interactive');
                this.follower.classList.add('hover-interactive');
                
                gsap.to(this.cursor, {
                    scale: 1.5,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover-interactive');
                this.follower.classList.remove('hover-interactive');
                
                gsap.to(this.cursor, {
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            });
        });
    }
}

// Enhanced Projects Slider (keeping existing functionality)
class EnhancedProjectsSlider {
    constructor() {
        this.track = document.getElementById('projectsTrack');
        this.wrapper = document.querySelector('.projects-wrapper');
        this.cards = document.querySelectorAll('.project-card');
        this.dotsContainer = document.getElementById('navigationDots');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        this.currentIndex = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startScrollLeft = 0;
        this.cardWidth = 0;
        this.maxScroll = 0;
        this.dragThreshold = 50;
        
        this.init();
    }
    
    init() {
        this.calculateDimensions();
        this.createDots();
        this.addEventListeners();
        this.updateView();
        
        window.addEventListener('resize', () => {
            this.calculateDimensions();
            this.createDots();
            this.updateView();
        });
    }
    
    calculateDimensions() {
        if (this.cards.length === 0) return;
        
        const card = this.cards[0];
        const style = getComputedStyle(this.track);
        const gap = parseFloat(style.gap) || 16;
        
        this.cardWidth = card.offsetWidth + gap;
        this.containerWidth = this.wrapper.offsetWidth;
        
        if (window.innerWidth <= 768) {
            this.maxScroll = Math.max(0, (this.cards.length - 1) * this.cardWidth);
            this.visibleCards = 1;
        } else {
            this.maxScroll = Math.max(0, (this.cards.length * this.cardWidth) - this.containerWidth);
            this.visibleCards = Math.floor(this.containerWidth / this.cardWidth);
        }
    }
    
    createDots() {
        if (window.innerWidth > 768) {
            this.dotsContainer.style.display = 'none';
            return;
        }
        
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < this.cards.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'nav-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
        
        this.dotsContainer.style.display = 'flex';
    }
    
    addEventListeners() {
        this.wrapper.addEventListener('touchstart', (e) => this.handleStart(e), { passive: false });
        this.wrapper.addEventListener('touchmove', (e) => {
            if (this.isDragging) e.preventDefault();
            this.handleMove(e);
        }, { passive: false });
        this.wrapper.addEventListener('touchend', this.handleEnd.bind(this));
        
        this.wrapper.addEventListener('mousedown', this.handleStart.bind(this));
        this.wrapper.addEventListener('mousemove', this.handleMove.bind(this));
        this.wrapper.addEventListener('mouseup', this.handleEnd.bind(this));
        this.wrapper.addEventListener('mouseleave', this.handleEnd.bind(this));
        
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.addEventListener('click', () => {
                gsap.to(this.prevBtn, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 });
                this.slide('prev');
            });
            
            this.nextBtn.addEventListener('click', () => {
                gsap.to(this.nextBtn, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 });
                this.slide('next');
            });
        }
        
        this.wrapper.addEventListener('contextmenu', (e) => e.preventDefault());
        this.updateButtonVisibility();
        window.addEventListener('resize', () => this.updateButtonVisibility());
    }
    
    handleStart(e) {
        this.isDragging = true;
        this.startX = this.getX(e);
        this.startScrollLeft = this.currentIndex * this.cardWidth;
        
        this.track.style.transition = 'none';
        this.wrapper.style.cursor = 'grabbing';
        document.body.classList.add('no-select');
    }
    
    handleMove(e) {
        if (!this.isDragging) return;
        
        const currentX = this.getX(e);
        const diffX = this.startX - currentX;
        const newScrollLeft = this.startScrollLeft + diffX;
        
        let boundedScroll;
        if (newScrollLeft < 0) {
            boundedScroll = newScrollLeft * 0.3;
        } else if (newScrollLeft > this.maxScroll) {
            boundedScroll = this.maxScroll + (newScrollLeft - this.maxScroll) * 0.3;
        } else {
            boundedScroll = newScrollLeft;
        }
        
        this.track.style.transform = `translateX(-${boundedScroll}px)`;
    }
    
    handleEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.wrapper.style.cursor = 'grab';
        document.body.classList.remove('no-select');
        
        const currentX = this.getX(e) || this.startX;
        const diffX = this.startX - currentX;
        
        if (Math.abs(diffX) > this.dragThreshold) {
            if (diffX > 0) {
                this.slide('next');
            } else {
                this.slide('prev');
            }
        } else {
            this.updateView();
        }
    }
    
    getX(e) {
        return e.type.includes('mouse') ? e.clientX : 
               (e.touches?.[0]?.clientX || e.changedTouches?.[0]?.clientX);
    }
    
    slide(direction) {
        const maxIndex = window.innerWidth <= 768 ? 
                        this.cards.length - 1 : 
                        Math.max(0, this.cards.length - this.visibleCards);
        
        if (direction === 'next') {
            this.currentIndex = Math.min(this.currentIndex + 1, maxIndex);
        } else {
            this.currentIndex = Math.max(this.currentIndex - 1, 0);
        }
        
        this.updateView();
    }
    
    goToSlide(index) {
        if (window.innerWidth <= 768) {
            this.currentIndex = Math.min(Math.max(0, index), this.cards.length - 1);
        } else {
            const maxIndex = Math.max(0, this.cards.length - this.visibleCards);
            this.currentIndex = Math.min(index * this.visibleCards, maxIndex);
        }
        this.updateView();
    }
    
    updateView() {
        const translateX = Math.min(this.currentIndex * this.cardWidth, this.maxScroll);
        
        this.track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.track.style.transform = `translateX(-${translateX}px)`;
        
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.nav-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
        
        this.updateButtonStates();
    }
    
    updateButtonStates() {
        if (this.prevBtn && this.nextBtn) {
            const maxIndex = window.innerWidth <= 768 ? 
                            this.cards.length - 1 : 
                            Math.max(0, this.cards.length - this.visibleCards);
            
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
            this.nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.5' : '1';
        }
    }
    
    updateButtonVisibility() {
        if (this.prevBtn && this.nextBtn) {
            if (window.innerWidth > 768) {
                this.prevBtn.style.display = 'flex';
                this.nextBtn.style.display = 'flex';
            } else {
                this.prevBtn.style.display = 'none';
                this.nextBtn.style.display = 'none';
            }
        }
    }
}

// Main Portfolio Initialization with Enhanced Bento Grid Animations
function initPortfolio() {
    // Disable dragging on all images
    document.querySelectorAll('img').forEach(img => {
        img.setAttribute('draggable', 'false');
    });

    // Initialize GSAP animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Set initial states
    gsap.set("header", { y: -100, opacity: 0 });
    gsap.set(".hero h1", { y: 100, opacity: 0, scale: 0.8 });
    gsap.set(".memoji", { scale: 0, rotation: -45, opacity: 0 });
    gsap.set(".bento-card", { y: 60, opacity: 0, scale: 0.9, rotation: 2 });
    gsap.set(".projects-header", { x: -100, opacity: 0 });
    gsap.set(".project-card", { y: 100, opacity: 0, rotation: 2 });
    
    // Create main timeline
    const tl = gsap.timeline();
    
    // Header animation
    tl.to("header", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "back.out(1.2)"
    })
    // Hero title animation
    .to(".hero h1", {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power3.out"
    }, "-=0.5")
    // Memoji animation
    .to(".memoji", {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)"
    }, "-=0.8");
    
    // Enhanced Bento Grid Animations
    ScrollTrigger.create({
        trigger: ".bento-section",
        start: "top 50%",
        onEnter: () => {
            // Animate bento cards in a staggered wave pattern
            const bentoCards = document.querySelectorAll('.bento-card');
            
            // Create different animation sequences for different card types
            const profileCard = document.querySelector('.bento-profile');
            const skillCards = document.querySelectorAll('.bento-skill');
            const featuredCard = document.querySelector('.bento-featured');
            const contactCard = document.querySelector('.bento-contact');
            const socialCard = document.querySelector('.bento-social');
            
            const masterTimeline = gsap.timeline();
            
            // Profile card - main entrance
            masterTimeline.to(profileCard, {
                y: 0,
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 1,
                ease: "back.out(1.4)"
            })
            
            // Skill cards - cascading from left to right
            .to(skillCards, {
                y: 0,
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.8,
                stagger: {
                    amount: 0.3,
                    from: "start"
                },
                ease: "back.out(1.2)"
            }, "-=0.6")
            
            // Contact card
            .to(contactCard, {
                y: 0,
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.5)"
            }, "-=0.4")
            
            // Featured card - dramatic entrance
            .to(featuredCard, {
                y: 0,
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 1.2,
                ease: "power3.out"
            }, "-=0.3")
            
            // Social card
            .to(socialCard, {
                y: 0,
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.8,
                ease: "back.out(1.1)"
            }, "-=0.5");
            
            
            // Icon animations
            gsap.to(".skill-icon", {
                rotation: 360,
                duration: 2,
                ease: "power4.out",
                stagger: 0.2,
                delay: 0.3
            });
        }
    });
    
    // Projects section animations
    gsap.to(".projects-header", {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".projects",
            start: "top 70%",
        }
    });
    
    gsap.to(".project-card", {
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".projects-track",
            start: "top 80%",
        }
    });
    
    // Continuous floating animation for memoji
    gsap.to(".memoji", {
        y: "-=20",
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut"
    });
    
    
    // Initialize enhanced components
    new EnhancedNavigation();
    new EnhancedCursor();
    new EnhancedProjectsSlider();
    
    // Mobile image switching
    function switchImgForMobile() {
        const memojiImg = document.querySelector("#memoji img.default");
        if (window.innerWidth <= 768 && memojiImg) {
            memojiImg.style.transform = "none";
        }
    }
    
    switchImgForMobile();
    window.addEventListener("resize", switchImgForMobile);
}

// Start loading screen when page loads
document.addEventListener('DOMContentLoaded', () => {
    new LoadingScreen();
});