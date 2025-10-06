import { useEffect, useRef } from 'react';

const BackgroundAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: -1,
      y: -1,
      radius: 150,
    };

    window.addEventListener('mousemove', (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = -1;
      mouse.y = -1;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles: Particle[] = [];
    const particleCount = 50;

    class Particle {
      x: number;
      y: number;
      size: number;
      originalSize: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.originalSize = Math.random() * 1.5 + 1;
        this.size = this.originalSize;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = 'rgba(0, 191, 255, 0.5)';
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        if (mouse.x !== -1) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            this.size = 3;
            this.color = 'rgba(249, 115, 22, 0.8)'; // Orange
          } else {
            if (this.size > this.originalSize) this.size -= 0.1;
            this.color = 'rgba(0, 191, 255, 0.5)'; // Deep sky blue
          }
        } else {
          if (this.size > this.originalSize) this.size -= 0.1;
          this.color = 'rgba(0, 191, 255, 0.5)';
        }

        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
      }

      draw() {
        if (ctx) {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function init() {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }
    init();

    function animate() {
      if (ctx) {
        ctx.clearRect(0, 0, width, height);

        // Horizontal line
        const lineY = height * 0.1;
        let lineColor = 'rgba(0, 191, 255, 0.2)';
        if (mouse.x !== -1 && Math.abs(mouse.y - lineY) < 20) {
          lineColor = 'rgba(249, 115, 22, 0.5)';
        }
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(width, lineY);
        ctx.stroke();

        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
        }
        connect();
      }
      requestAnimationFrame(animate);
    }
    animate();

    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const distance =
            (particles[a].x - particles[b].x) * (particles[a].x - particles[b].x) +
            (particles[a].y - particles[b].y) * (particles[a].y - particles[b].y);

          if (distance < (width / 7) * (height / 7)) {
            opacityValue = 1 - distance / 20000;
            let strokeStyle = `rgba(0, 191, 255, ${opacityValue * 0.3})`;

            if (mouse.x !== -1) {
              const dxA = mouse.x - particles[a].x;
              const dyA = mouse.y - particles[a].y;
              const distanceA = Math.sqrt(dxA * dxA + dyA * dyA);
              const dxB = mouse.x - particles[b].x;
              const dyB = mouse.y - particles[b].y;
              const distanceB = Math.sqrt(dxB * dxB + dyB * dyB);

              if (distanceA < mouse.radius || distanceB < mouse.radius) {
                strokeStyle = `rgba(249, 115, 22, ${opacityValue * 0.6})`;
              }
            }

            if (ctx) {
              ctx.strokeStyle = strokeStyle;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particles[a].x, particles[a].y);
              ctx.lineTo(particles[b].x, particles[b].y);
              ctx.stroke();
            }
          }
        }
      }
    }
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
};

export default BackgroundAnimation;