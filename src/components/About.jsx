import { Zap, Trophy, Users, MapPin, Dumbbell } from 'lucide-react';
import logo from '../assets/amigo png logo.png';
import { useReveal } from '../hooks/useReveal';
import './About.css';

const FEATURES = [
  {
    icon: Zap,
    title: 'Modern Equipment',
    desc: 'State-of-the-art machines from top brands — Athletic Legacy cable systems, commercial dumbbells, squat racks, and more.',
  },
  {
    icon: Trophy,
    title: 'Expert Trainers',
    desc: 'Certified personal trainers who craft personalized programs and guide you from Day 1 to your goals.',
  },
  {
    icon: Users,
    title: 'No-Judgment Space',
    desc: 'A welcoming community for all fitness levels. Everyone belongs here — come as you are.',
  },
  {
    icon: MapPin,
    title: '7 Convenient Branches',
    desc: 'Multiple locations across Quezon City so there\'s always an Amigo\'s near you.',
  },
];

export default function About() {
  const { ref: leftRef, visible: leftVisible } = useReveal();
  const { ref: rightRef, visible: rightVisible } = useReveal();

  return (
    <section id="about" className="about">
      <div className="section-container about__inner">

        {/* Visual side */}
        <div ref={leftRef} className={`about__visual reveal-left ${leftVisible ? 'visible' : ''}`}>
          <div className="about__badge">
            <span className="about__badge-num">7</span>
            <span className="about__badge-text">Branches<br />& Growing</span>
          </div>

          <div className="about__img-main">
            <div className="about__img-overlay" />
            <div className="about__img-pattern" />
            <div className="about__img-text">
              <img src={logo} alt="Amigo's Fitness Gym" className="about__img-logo-img" />
            </div>
          </div>

          <div className="about__img-accent">
            <div className="about__img-accent-inner">
              <Dumbbell size={36} strokeWidth={1.5} style={{ color: 'var(--primary)' }} />
              <span className="about__img-accent-label">Premium<br />Equipment</span>
            </div>
          </div>
        </div>

        {/* Text side */}
        <div ref={rightRef} className={`about__text reveal-right ${rightVisible ? 'visible' : ''}`}>
          <div className="section-tag">Our Story</div>
          <h2 className="section-heading">
            MORE THAN<br />
            <span className="gold">JUST A GYM</span>
          </h2>
          <p className="about__desc">
            Amigo&apos;s Fitness Gym is a premium fitness destination built for real people who want real results.
            From the moment you walk in, you&apos;ll feel the difference — modern gear, motivated coaches,
            and an atmosphere that pushes you to be your best self every single day.
          </p>

          <div className="about__features">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`about__feature reveal ${rightVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 100 + 100}ms` }}
              >
                <div className="about__feature-icon"><f.icon size={18} strokeWidth={1.75} /></div>
                <div>
                  <h4 className="about__feature-title">{f.title}</h4>
                  <p className="about__feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
