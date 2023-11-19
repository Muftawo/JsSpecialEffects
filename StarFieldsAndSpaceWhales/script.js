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


// ctx.fillStyle = getGradient(ctx, canvas.width, canvas.height);
ctx.strokeStyle = 'white';

class Particle {
    constructor(effect) {
        this.effect = effect;
        this.maxRadius = parameters.particleMaxRadius;
        this.minRadius = parameters.particleMinRadius;
        this.radius = Math.floor(Math.random() * this.maxRadius + this.minRadius);

        this.imageSize = this.radius * 5;
        this.halfImageSize = this.imageSize * 0.5;

        this.setCordinates();

        this.setVelocity();

        // mouse push velocity
        this.pushX = 0;
        this.pushY = 0;
        this.friction = parameters.particleMouseFriction;

        this.image = document.getElementById('star');

    }

    setCordinates() {
        this.x = this.imageSize + Math.random() * (this.effect.width + this.effect.maxDistance * 2);
        this.y = this.imageSize + Math.random() * (this.effect.height - this.imageSize * 2);
    }

    setVelocity() {
        this.vx = Math.random() * parameters.particleMaxVelocity - parameters.particleMinVelocity;
        this.vy = Math.random() * parameters.particleMaxVelocity - parameters.particleMinVelocity;
    }

    draw(context) {
        // context.fillStyle = `hsl(${this.x * 0.5}, 100% , 50%)`;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
    }
    changeRadius() {
        // this.radius += (Math.random() < 0.5 ? -1 : 1);
        // this.radius = Math.max(this.minRadius, Math.min(this.maxRadius, this.radius));
        // this.radius = parameters.radius;//Math.random() * this.maxRadius + this.minRadius;
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

    onFrameCollision() {
        //horizontal collision
        if (this.x < this.radius) {
            this.x = this.radius;
            this.vx *= -1;
        } else if (this.x > this.effect.width - this.radius) {
            this.x = this.effect.width - this.radius;
            this.vx *= -1;
        }

        //vertical collision
        if (this.y < this.radius) {
            this.y = this.radius;
            this.vy *= -1;
        } else if (this.y > this.effect.height - this.radius) {
            this.y = this.effect.height - this.radius;
            this.vy *= -1;
        }
    }


    update() {
        this.onMousePressed();

        // move position
        this.x += (this.pushX *= this.friction) + this.vx;
        this.y += (this.pushY *= this.friction);

        this.onFrameCollision();

    }

    reset() {
        this.setCordinates()
    }
}

class Whale {
    constructor(effect) {
        this.effect = effect;
        this.x = this.effect.width * 0.5;
        this.y = this.effect.height * 0.5;
        this.image = document.getElementById('whale1');
    }
    draw(context) {
        context.drawImage(this.image, this.x, this.y)
    }
}

class Effect {
    constructor(canvas, context, numberOfParticles) {
        this.canvas = canvas;
        this.context = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = numberOfParticles ?? parameters.numberOfParticlesDefault; // change this later to user input 
        this.createParticles();
        this.whale = new Whale(this);

        this.maxDistance = parameters.particleConnectionMaxDistance;

        this.mouse = {
            x: 0,
            y: 0,
            pressed: false,
            radius: parameters.mouseRadius
        }
        window.addEventListener('resize', e => {
            this.resize(e.target.window.innerWidth, e.target.innerHeight);
        })
        window.addEventListener('mousemove', e => {
            if (this.mouse.pressed) {
                this.mouse.x = e.x;
                this.mouse.y = e.y;

            }
        })
        window.addEventListener('mousedown', e => {
            this.mouse.pressed = true;
            this.mouse.x = e.x;
            this.mouse.y = e.y;

        })
        window.addEventListener('mouseup', e => {
            this.mouse.pressed = false;
        })


    }
    createParticles() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this));
        }
    }
    handleParticles(context) {
        this.whale.draw(context)

        this.connectParticles(context);
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        });
    }
    connectParticles(context) {
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);
                if (distance < this.maxDistance) {
                    context.save();
                    const opacity = 1 - (distance / this.maxDistance);
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
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.width = width;
        this.height = height;
        
        
        this.whale.x = this.width * 0.5;
        this.whale.y = this.height * 0.5;

        this.context.strokeStyle = 'white';

        this.particles.forEach(
            particle => {
                particle.reset();
            })

    }

}


const effect = new Effect(canvas, ctx, parameters.numberOfParticles);


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx);
    requestAnimationFrame(animate);

}

animate();