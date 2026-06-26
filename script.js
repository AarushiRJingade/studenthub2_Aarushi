// ==========================================
// BACKGROUND ANIMATION LOGIC (Moving Network)
// ==========================================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    
    // Determine particle count based on screen size to prevent lag
    const particleCount = Math.floor((width * height) / 15000);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 1.5 + 0.5
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw particles and lines
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        
        // Move particle
        p.x += p.vx;
        p.y += p.vy;
        
        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        // Draw Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.6)'; // Red dots
        ctx.fill();
        
        // Connect close particles with lines
        for (let j = i + 1; j < particles.length; j++) {
            let p2 = particles[j];
            let dx = p.x - p2.x;
            let dy = p.y - p2.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                // Opacity based on distance
                ctx.strokeStyle = `rgba(239, 68, 68, ${0.2 - (dist/120)*0.2})`; 
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', initCanvas);

// Start Animation
initCanvas();
animate();


// ==========================================
// 1. TASK MANAGER LOGIC
// ==========================================
let tasks = JSON.parse(localStorage.getItem('studenthub_tasks_final')) || [];

function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = '';
    
    if(tasks.length === 0) {
        list.innerHTML = `<div class="text-zinc-600 text-center py-4 text-sm tracking-widest uppercase slide-in">No active tasks</div>`;
        return;
    }

    tasks.forEach((task, index) => {
        list.innerHTML += `
            <li class="slide-in group flex items-start justify-between gap-3 p-4 bg-dark-bg/50 rounded-xl glow-hover border border-dark-border cursor-pointer" onclick="toggleTask(${index})">
                <div class="flex items-start gap-3 overflow-hidden">
                    <div class="mt-0.5 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-accent-500 border-accent-500' : 'border-zinc-700 group-hover:border-accent-500'}">
                        ${task.completed ? '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ''}
                    </div>
                    <span class="flex-grow font-medium transition-all ${task.completed ? 'line-through text-zinc-600' : 'text-zinc-200 group-hover:text-white'}">${task.text}</span>
                </div>
                <button onclick="deleteTask(event, ${index})" class="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-accent-400 p-2 rounded-lg transition-all hover:bg-accent-950/30">
                    Delete
                </button>
            </li>
        `;
    });
}

function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    if (text) {
        tasks.push({ text: text, completed: false });
        localStorage.setItem('studenthub_tasks_final', JSON.stringify(tasks));
        input.value = '';
        renderTasks();
    }
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('studenthub_tasks_final', JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(event, index) {
    event.stopPropagation();
    tasks.splice(index, 1);
    localStorage.setItem('studenthub_tasks_final', JSON.stringify(tasks)); 
    renderTasks();
}

document.getElementById('taskInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });


// ==========================================
// 2. ASSIGNMENT TRACKER LOGIC
// ==========================================
let assignments = JSON.parse(localStorage.getItem('studenthub_assignments_final')) || [];

function renderAssignments() {
    const list = document.getElementById('assignmentList');
    list.innerHTML = '';
    
    if(assignments.length === 0) {
        list.innerHTML = `<div class="text-zinc-600 text-center py-4 text-sm tracking-widest uppercase slide-in">System Clear</div>`;
        return;
    }

    assignments.sort((a, b) => new Date(a.date) - new Date(b.date));

    assignments.forEach((item, index) => {
        const dateObj = new Date(item.date);
        const dateString = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const isPast = dateObj < new Date().setHours(0,0,0,0);
        
        let dateColor = isPast ? "text-accent-400 bg-accent-950/30 border-accent-900/50" : "text-zinc-400 bg-dark-bg border-dark-border";

        list.innerHTML += `
            <li class="slide-in group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-dark-bg/50 rounded-xl glow-hover border border-dark-border transition-all">
                <div class="flex flex-col mb-3 sm:mb-0">
                    <span class="bg-zinc-800 text-zinc-400 border border-zinc-700 text-xs font-bold w-fit px-2 py-1 rounded-md mb-1 uppercase">${item.course}</span>
                    <span class="font-semibold text-zinc-200">${item.title}</span>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-xs font-bold px-3 py-1.5 rounded-lg border ${dateColor}">
                        ${dateString}
                    </span>
                    <button onclick="deleteAssignment(${index})" class="text-zinc-600 hover:text-accent-400 p-2 rounded-lg transition-all">
                        Delete
                    </button>
                </div>
            </li>
        `;
    });
}

function addAssignment() {
    const course = document.getElementById('courseInput').value.trim();
    const title = document.getElementById('assignmentInput').value.trim();
    const date = document.getElementById('dateInput').value;

    if (course && title && date) {
        assignments.push({ course: course, title: title, date: date });
        localStorage.setItem('studenthub_assignments_final', JSON.stringify(assignments));
        document.getElementById('courseInput').value = '';
        document.getElementById('assignmentInput').value = '';
        document.getElementById('dateInput').value = '';
        renderAssignments();
    }
}

function deleteAssignment(index) {
    assignments.splice(index, 1);
    localStorage.setItem('studenthub_assignments_final', JSON.stringify(assignments));
    renderAssignments();
}

renderTasks();
renderAssignments();