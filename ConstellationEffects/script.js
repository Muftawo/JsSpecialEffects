// setup 
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
parameters ={
    numberOfParticles: 400,
    particleConnectionMaxDistance : 100,

}


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
    changeRadius() {
        this.radius += (Math.random() < 0.5 ? -1 : 1);
        this.radius = Math.max(this.minRadius, Math.min(this.maxRadius, this.radius));

        // console.log(`radius ${this.radius} x = ${this.x} y ${this.y} vx ${this.vx} vy ${this.vy}`);
    }

    update() {
        this.x += this.vx;
        if (this.x > this.effect.width - this.radius || this.x < this.radius) {
            this.vx *= -1;
            this.changeRadius();
        }

        this.y += this.vy;
        if (this.y > this.effect.height - this.radius || this.y < this.radius) {
            this.vy *= -1;
            this.changeRadius();
        }
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
        this.connectParticles(context);
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        });
    }
    connectParticles(context) {
        const maxDistance = 100;
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);
                if (distance < maxDistance) {
                    context.save();
                    const opacity = 1 - (distance / maxDistance);
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[a].x, this.particles[a].y);
                    context.lineTo(this.particles[b].x, this.particles[b].y);
                    context.stroke();
                    context.restore();

                }
            }
        }
    }

}


const effect = new Effect(canvas);


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx);
    requestAnimationFrame(animate);

}

animate();