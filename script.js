// ==========================================
// 1. CRAZY AURA ANIMATION (Floating Glow)
// ==========================================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let width, height;

// Color palette: Cyan and Pink
const colors = ['#00f0ff', '#ff007f', '#b026ff'];

function init() {
    width = canvas.width = window.innerWidth; 
    height = canvas.height = window.innerHeight;
    particles = [];
    
    // Amount of aura particles based on screen size
    const particleCount = Math.floor((width * height) / 10000);
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width, 
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3, 
            vy: (Math.random() * -0.5) - 0.2, // Drift upward
            radius: Math.random() * 2.5 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.5 + 0.3
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
        // Move
        p.x += p.vx; 
        p.y += p.vy;
        
        // Wrap around screen seamlessly
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        
        // Draw with intense glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        
        // Add shadow for the "aura" effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.globalAlpha = p.alpha;
        
        ctx.fill();
        
        // Reset shadow so it doesn't break performance
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
    });
    
    requestAnimationFrame(draw);
}

window.addEventListener('resize', init);
init(); 
draw();

// [Keep all your existing Task Manager, Exam, and Pomodoro logic below this line!]