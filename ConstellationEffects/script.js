// setup 
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log(ctx);
console.log(canvas);
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, 'white');
gradient.addColorStop(0.5, 'magenta');
gradient.addColorStop(1, 'blue');

ctx.fillStyle = gradient;
ctx.strokeStyle = 'white';
class Particle {
    constructor(effect) {
        this.effect = effect;
        this.maxRadius = 6;
        this.minRadius = 2;
        this.radius = Math.random() * this.maxRadius + this.minRadius;

        // particle cordinates
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);

        // particle velocity 
        this.vx = Math.random() * 2 - 0.5;
        this.vy = Math.random() * 2 - 0.5;

    }

    draw(context) {
        // context.fillStyle = `hsl(${this.x * 0.5}, 100% , 50%)`;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
    }

}

class Effect {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 20; // change this later to user input 
        this.createParticles();
    }
    createParticles() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this));
        }
    }
    handleParticles(context) {
        this.particles.forEach(particle => {
            particle.draw(context);
        });
    }

}


const effect = new Effect(canvas);
effect.handleParticles(ctx)

function animate() {

}