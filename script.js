// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    updatePhilippineTime();
    setInterval(updatePhilippineTime, 1000);
    
    initializeNavigation();
    initializeVaults();
    initializeTechTree();
    initializeModal();
    initializeCarousel();
    initializeScrollPrompt();
    initializeContactForm();
    animateCounters();
});

// ========== PHILIPPINE TIME ==========
function updatePhilippineTime() {
    const timeElement = document.getElementById('philippine-time');
    if (!timeElement) return;
    
    const options = {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    const formatter = new Intl.DateTimeFormat('en-PH', options);
    const time = formatter.format(new Date());
    timeElement.querySelector('span').textContent = time;
}

// ========== NAVIGATION ==========
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.dataset.section;
            document.getElementById(sectionId).classList.add('active');
            
            // Update menu indicator
            const index = Array.from(navLinks).indexOf(this) + 1;
            document.querySelector('.menu-indicator').textContent = 
                `00${index} // 00${navLinks.length}`;
            
            // Scroll to top of section
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
}

// ========== TRANSPARENCY VAULTS ==========
function initializeVaults() {
    const vaults = document.querySelectorAll('.vault-card');
    
    vaults.forEach(vault => {
        const toggle = vault.querySelector('.vault-toggle');
        const items = vault.querySelector('.vault-items');
        
        toggle.addEventListener('click', function() {
            const isHidden = items.style.display === 'none' || !items.style.display;
            
            // Close all other vaults first
            document.querySelectorAll('.vault-items').forEach(v => {
                v.style.display = 'none';
            });
            document.querySelectorAll('.vault-toggle').forEach(t => {
                t.textContent = 'ACCESS VAULT +';
            });
            
            // Open this vault
            if (isHidden) {
                items.style.display = 'block';
                this.textContent = 'CLOSE VAULT −';
            } else {
                items.style.display = 'none';
                this.textContent = 'ACCESS VAULT +';
            }
        });
        
        // Handle data links
        const links = vault.querySelectorAll('.data-link');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Special handling for "Key Officials" link
                if (this.textContent.includes('Key Officials')) {
                    document.getElementById('officials-modal').style.display = 'flex';
                } else {
                    // For other links, show a notification
                    alert(`Viewing: ${this.textContent}\n(This would open the actual document in production)`);
                }
            });
        });
    });
}

// ========== MODAL ==========
function initializeModal() {
    const modal = document.getElementById('officials-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (!modal || !closeBtn) return;
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// ========== TECH TREE ==========
function initializeTechTree() {
    const nodes = document.querySelectorAll('.tree-node');
    const researchContent = document.getElementById('research-content');
    
    // Draw connections between nodes
    drawNodeConnections();
    
    nodes.forEach(node => {
        node.addEventListener('click', function() {
            // Remove active class from all nodes
            nodes.forEach(n => n.classList.remove('active'));
            
            // Add active class to clicked node
            this.classList.add('active');
            
            // Load research content based on node
            const area = this.dataset.area;
            loadResearchContent(area);
        });
    });
}

function drawNodeConnections() {
    const svg = document.querySelector('.tree-connections');
    if (!svg) return;
    
    const nodes = document.querySelectorAll('.tree-node');
    if (nodes.length < 2) return;
    
    // Clear previous connections
    svg.innerHTML = '';
    
    // Get positions of all nodes
    const positions = [];
    nodes.forEach(node => {
        const rect = node.getBoundingClientRect();
        const container = document.querySelector('.tech-tree').getBoundingClientRect();
        
        positions.push({
            x: rect.left + rect.width/2 - container.left,
            y: rect.top + rect.height/2 - container.top
        });
    });
    
    // Draw lines connecting nodes in a network pattern
    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            // Only connect certain nodes to avoid visual clutter
            if (shouldConnect(i, j)) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', positions[i].x);
                line.setAttribute('y1', positions[i].y);
                line.setAttribute('x2', positions[j].x);
                line.setAttribute('y2', positions[j].y);
                line.setAttribute('stroke', 'rgba(0, 168, 255, 0.2)');
                line.setAttribute('stroke-width', '1');
                svg.appendChild(line);
            }
        }
    }
}

function shouldConnect(i, j) {
    // Simple logic to create a network pattern
    return Math.abs(i - j) <= 2 || (i === 0 && j === 7) || (i === 3 && j === 6);
}

function loadResearchContent(area) {
    const contentArea = document.getElementById('research-content');
    const contentMap = {
        'space': `
            <h3>Space Technology & Satellite Development</h3>
            <p>ASTI's Space Technology program focuses on developing small satellites and ground receiving stations.</p>
            <h4>Key Projects:</h4>
            <ul>
                <li>Maya Satellite Series</li>
                <li>Diwata Microsatellite Program</li>
                <li>Ground Receiving Station Development</li>
            </ul>
        `,
        'wireless': `
            <h3>Wireless Communications Research</h3>
            <p>Developing wireless technologies for connectivity in underserved areas.</p>
            <h4>Research Areas:</h4>
            <ul>
                <li>5G and Beyond Technologies</li>
                <li>Rural Connectivity Solutions</li>
                <li>IoT Communication Protocols</li>
            </ul>
        `,
        'ai': `
            <h3>Artificial Intelligence & Machine Learning</h3>
            <p>Advanced AI research for various applications in agriculture, disaster management, and industry.</p>
            <h4>Applications:</h4>
            <ul>
                <li>Crop Yield Prediction</li>
                <li>Disaster Risk Assessment</li>
                <li>Natural Language Processing for Filipino Languages</li>
            </ul>
        `,
        'smart-cities': `
            <h3>Smart Cities Technologies</h3>
            <p>Developing integrated solutions for urban challenges.</p>
            <h4>Key Technologies:</h4>
            <ul>
                <li>Smart Traffic Management</li>
                <li>Environmental Monitoring Systems</li>
                <li>Public Safety Solutions</li>
            </ul>
        `,
        'emerging': `
            <h3>Emerging Technologies</h3>
            <p>Exploring cutting-edge technologies with future applications.</p>
            <h4>Research Areas:</h4>
            <ul>
                <li>Quantum Computing Applications</li>
                <li>Blockchain for Government Services</li>
                <li>Advanced Materials Research</li>
            </ul>
        `,
        'robotics': `
            <h3>Robotics & Automation</h3>
            <p>Developing robotic systems for industrial and service applications.</p>
            <h4>Projects:</h4>
            <ul>
                <li>Agricultural Robotics</li>
                <li>Underwater ROV Development</li>
                <li>Automated Inspection Systems</li>
            </ul>
        `,
        'pedro': `
            <h3>PEDRO Center</h3>
            <p>Philippine Earth Data Resource Observation Center</p>
            <h4>Capabilities:</h4>
            <ul>
                <li>Satellite Data Reception and Processing</li>
                <li>Environmental Monitoring</li>
                <li>Disaster Risk Reduction Support</li>
            </ul>
        `,
        'philsensors': `
            <h3>PhilSensors</h3>
            <p>Philippine Sensor Network for Environmental Monitoring</p>
            <h4>Network Features:</h4>
            <ul>
                <li>Real-time Environmental Data Collection</li>
                <li>Air and Water Quality Monitoring</li>
                <li>Weather Station Network</li>
            </ul>
        `
    };
    
    if (contentMap[area]) {
        contentArea.innerHTML = `<div class="research-detail">${contentMap[area]}</div>`;
    } else {
        contentArea.innerHTML = '<div class="research-placeholder"><p>// RESEARCH DATA LOADING</p><div class="pulse-dot"></div></div>';
    }
}

// ========== CAROUSEL ==========
function initializeCarousel() {
    const prevBtn = document.querySelector('.control-prev');
    const nextBtn = document.querySelector('.control-next');
    const carousel = document.querySelector('.news-carousel');
    
    if (!prevBtn || !nextBtn || !carousel) return;
    
    // Clone cards for infinite effect (simplified)
    const cards = carousel.children;
    if (cards.length === 0) return;
    
    let currentIndex = 0;
    
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = cards.length - 1;
        }
        scrollToCard(currentIndex);
    });
    
    nextBtn.addEventListener('click', function() {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        scrollToCard(currentIndex);
    });
    
    function scrollToCard(index) {
        const cardWidth = cards[0].offsetWidth + 30; // including gap
        carousel.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
        });
    }
}

// ========== SCROLL PROMPT ==========
function initializeScrollPrompt() {
    const scrollPrompt = document.querySelector('.scroll-prompt');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollY / maxScroll) * 100;
        
        // Update scroll line height based on scroll position
        const line = scrollPrompt.querySelector('.scroll-line');
        if (line) {
            line.style.height = (60 * (scrollPercent / 100)) + 'px';
        }
    });
    
    scrollPrompt.addEventListener('click', function() {
        window.scrollTo({
            top: window.scrollY + window.innerHeight,
            behavior: 'smooth'
        });
    });
}

// ========== CONTACT FORM ==========
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulate form submission
        const button = this.querySelector('button');
        const originalText = button.textContent;
        
        button.textContent = 'TRANSMITTING...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = 'MESSAGE SENT ✓';
            button.style.backgroundColor = '#00ff88';
            button.style.color = '#000';
            
            // Reset form
            this.reset();
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.backgroundColor = '';
                button.style.color = '';
            }, 3000);
        }, 1500);
    });
}

// ========== ANIMATED COUNTERS ==========
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.id === 'projects-count' ? '47' :
                              counter.id === 'researchers-count' ? '156' :
                              counter.id === 'facilities-count' ? '23' : '0');
        
        let current = 0;
        const increment = target / 50; // Divide animation into steps
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 30);
    });
}

// ========== RESIZE HANDLER ==========
window.addEventListener('resize', function() {
    // Redraw tech tree connections on resize
    drawNodeConnections();
});

// ========== LOADING ANIMATION ==========
window.addEventListener('load', function() {
    const loader = document.querySelector('.loading-indicator');
    let percent = 0;
    
    const interval = setInterval(() => {
        percent += Math.floor(Math.random() * 10) + 5;
        if (percent >= 100) {
            percent = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                loader.style.opacity = '0';
            }, 500);
        }
        loader.textContent = `- LOADING ${percent}% -`;
    }, 100);
});