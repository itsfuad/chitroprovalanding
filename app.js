const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let particlesArray = [];

let adjustX = -canvas.width;
let adjustY = -canvas.height;

let imageData;
const logo = new Image();
logo.src = "image.png";
logo.height = canvas.height/4;
logo.width = canvas.width/4;

ctx.fillStyle = 'white';
ctx.font = '16px Now';
ctx.textAlign = "center";

logo.onload = () => {
   // ctx.translate(canvas.width/2, canvas.height/2);
    //ctx.fillText("Artist Brothers", canvas.width/2, canvas.height/2);
    ctx.drawImage(logo, canvas.width/2 - 100, canvas.height/2 - 100, 200, 200);
    //ctx.drawImage(logo, 0,0, canvas.width, canvas.height);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    createParticles();
}


imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

console.log(imageData);

const mouse = {
    x: null,
    y: null, 
    radius: 100
}

window.addEventListener('mousemove', (evt) => {
    mouse.x = evt.x;
    mouse.y = evt.y;
    //console.log(mouse.y, mouse. y);
});

window.addEventListener('touchmove', (evt) => {
    mouse.x = evt.touches[0].clientX;
    mouse.y = evt.touches[0].clientY;
    //console.log(mouse.y, mouse. y);
});

window.addEventListener('touchend', (evt) => {
    mouse.x = 0;
    mouse.y = 0;
    //console.log(mouse.y, mouse. y);
});

window.onresize = () => {
    location.reload();
}

class Particle{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.baseX = this.x;
        this.baseY = this.y;
        this.velocity = 0.1;
        this.size = 1;
        this.density = (Math.random()*30) + 5;
    }
    draw(){
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;
        if (distance < mouse.radius){
            //this.size = 3;
            this.x -= directionX;
            this.y -= directionY;
        }
        else{
            if (this.x != this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            }
            if (this.y != this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy/10;
            }
        }
    }
}


function createParticles(){
    console.log("Hey");
   /*
    for(let i = 0; i < 400; i++){
        particlesArray.push(new Particle(Math.random()*canvas.width, Math.random()*canvas.height))
    }
    */
   for (let y = 0; y < imageData.height; y++){
       for( let x = 0; x < imageData.width; x++){
           if (imageData.data[(y*4*imageData.width) + (x*4) + 3] > 128){
               let positionX = x;
               let positionY = y;
               console.log(y);
               particlesArray.push(new Particle(positionX * 6 + adjustX * 2.5, positionY * 6 + adjustY * 2.5));
            }
        }
    }
    animation();
}

function animation(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < particlesArray.length; i++){
        particlesArray[i].draw();
        particlesArray[i].update();
    }
    //ctx.drawImage(logo, 0,0, canvas.width, canvas.height);
    connect();
    requestAnimationFrame(animation);
}

//createParticles();

function connect(){
    let opacity = 1;
    for (let a = 0; a < particlesArray.length; a++){
        for (let b = 0; b < particlesArray.length; b++){
            //let dx = mouse.x - this.x;
            //let dy = mouse.y - this.y;
            //let distance = Math.sqrt(dx*dx + dy*dy);
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            
            if (distance < 8){
                opacity = 1 - (distance/10);
                ctx.strokeStyle = 'rgba(255,255,255,'+opacity+')';
                ctx.lineWidth = 0.5;
                ctx.beginPath()
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

//createParticles();