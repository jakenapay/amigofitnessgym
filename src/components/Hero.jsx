import { useEffect, useRef } from 'react';
import './Hero.css';

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const getPrimary = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#F5C518';

    class Particle {
      constructor() { this.init(); }
      init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.r = Math.random() * 1.8 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.alpha = Math.random() * 0.35 + 0.05;
      }
      move() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.init();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = getPrimary();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const init = () => {
      resize();
      particles = [];
      const n = Math.min(90, Math.floor((canvas.width * canvas.height) / 10000));
      for (let i = 0; i < n; i++) particles.push(new Particle());
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.move(); p.draw(); });
      animId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting) cancelAnimationFrame(animId); else render(); },
      { threshold: 0 }
    );

    init();
    render();
    observer.observe(canvas);
    window.addEventListener('resize', init);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <section id="hero" className="hero">
      <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />

      <div className="hero__content">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          Now Open &middot; 7 Branches &amp; Growing
        </div>

        <h1 className="hero__title">
          <span className="hero__title-line hero__title-line--solid">AMIGO&apos;S</span>
          <span className="hero__title-line hero__title-line--outline">FITNESS</span>
          <span className="hero__title-line hero__title-line--solid">GYM</span>
        </h1>

        <p className="hero__location">Kamias &bull; Quezon City &bull; Philippines</p>

        <p className="hero__tagline">
          Making fitness <em>simple, fun,</em> and accessible for everyone.<br />
          Modern equipment &mdash; friendly trainers &mdash; zero judgment.
        </p>

        <div className="hero__actions">
          <a href="#promo" className="btn-primary" onClick={e => { e.preventDefault(); document.querySelector('#promo')?.scrollIntoView({ behavior: 'smooth' }); }}>
            View Promos
          </a>
          <a href="#contact" className="btn-outline" onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Get Started
          </a>
        </div>
      </div>

      <div className="hero__scroll-indicator" aria-hidden="true">
        <div className="hero__scroll-line" />
        <span>Scroll Down</span>
      </div>

      {/* Animated diagonal stripes (brand element) */}
      <div className="hero__stripes" aria-hidden="true">
        <div className="hero__stripe" />
        <div className="hero__stripe" />
      </div>
    </section>
  );
}
