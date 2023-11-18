// setup 
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// console.log(ctx);
// console.log(canvas);

parameters = {
    numberOfParticles: null,
    numberOfParticlesDefault: 200,
    particleMaxRadius: 12,
    particleMinRadius: 1,
    particleConnectionMaxDistance: 100,
    particleMaxVelocity: 2,
    particleMinVelocity: 0.5,
    particleMouseFriction: 0.9,

    mouseRadius: 150,

}

function getGradient(context, width, height) {

    gradientColors = {
        top: 'white',
        middle: 'gold',
        bottom: 'orangered'
    }
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, gradientColors.top);
    gradient.addColorStop(0.5, gradientColors.middle);
    gradient.addColorStop(1, gradientColors.bottom);

    return gradient
}


ctx.fillStyle = getGradient(ctx, canvas.width, canvas.height);
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

    onMousePressed() {
        if (this.effect.mouse.pressed) {
            const dx = this.x - this.effect.mouse.x;
            const dy = this.y - this.effect.mouse.y;
            const distance = Math.hypot(dx, dy);
            const force = this.effect.mouse.radius / distance;

            if (distance < this.effect.mouse.radius) {
                const angle = Math.atan2(dy, dx);
                this.pushX += Math.cos(angle) * force;
                this.pushY += Math.sin(angle) * force;

            }
        }
    }
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