import { Zap, UserCheck, Star, MapPin, ClipboardList, Clock } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import './Features.css';

const FEATURES = [
  {
    num: '01',
    Icon: Zap,
    title: 'Premium Equipment',
    desc: 'Top-tier machines from Athletic Legacy and commercial-grade suppliers — cable systems, dumbbells, squat racks, leg press, and more. Everything you need to push your limits.',
  },
  {
    num: '02',
    Icon: UserCheck,
    title: 'Certified Trainers',
    desc: "Our coaches build custom programs around your goals. Whether you're a beginner or an athlete, you'll have a personal trainer guiding every session.",
  },
  {
    num: '03',
    Icon: Star,
    title: 'Zero Judgment',
    desc: 'Walk in as you are. Our community is inclusive, supportive, and welcoming to all fitness levels. We lift each other up — literally and figuratively.',
  },
  {
    num: '04',
    Icon: MapPin,
    title: '7 Locations',
    desc: "With 7 branches and counting across Quezon City, convenience is never an excuse to skip the gym. An Amigo's is always nearby.",
  },
  {
    num: '05',
    Icon: ClipboardList,
    title: 'Structured Programs',
    desc: 'No guesswork. We provide complete fitness programs and nutritional guidance so every session has a purpose and every rep counts toward your goal.',
  },
  {
    num: '06',
    Icon: Clock,
    title: 'Open 24 / 7',
    desc: "Your schedule is your own. Amigo's is always open — early mornings, late nights, holidays. We're here whenever motivation strikes.",
  },
];

export default function Features() {
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { ref: gridRef, visible: gridVisible } = useReveal({ threshold: 0.05 });

  return (
    <section id="features" className="features">
      <div className="section-container">
        <div className="features__header" ref={headerRef}>
          <div className={`reveal ${headerVisible ? 'visible' : ''}`}>
            <div className="section-tag">Why Choose Amigo&apos;s</div>
          </div>
          <h2 className={`section-heading features__title reveal ${headerVisible ? 'visible' : ''}`} style={{ transitionDelay: '100ms' }}>
            THE AMIGO&apos;S<br />
            <span className="gold">DIFFERENCE</span>
          </h2>
          <p className={`features__desc reveal ${headerVisible ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
            We don&apos;t just build bodies &mdash; we build confidence, discipline, and a community
            that supports you every step of the way.
          </p>
        </div>

        <div className="features__grid" ref={gridRef}>
          {FEATURES.map((f, i) => (
            <div
              key={f.num}
              className={`feature-card reveal ${gridVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="feature-card__num">{f.num}</div>
              <div className="feature-card__icon-wrap">
                <f.Icon size={22} strokeWidth={1.75} />
              </div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
              <div className="feature-card__bottom-bar" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
