import { Target, Dumbbell, Zap, Activity, Flame, ShowerHead } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import './Facilities.css';

const FACILITIES = [
  {
    id: 'court',
    label: 'Multi-Sport',
    name: 'Indoor Basketball Court',
    Icon: Target,
    gradient: 'linear-gradient(140deg, #1a1200 0%, #2a1f00 50%, #0d0a00 100%)',
    color: '#F5B800',
    large: true,
  },
  {
    id: 'weights',
    label: 'Iron Zone',
    name: 'Free Weights & Dumbbells',
    Icon: Dumbbell,
    gradient: 'linear-gradient(140deg, #0a0f0a 0%, #121a10 50%, #080d08 100%)',
    color: '#5CB85C',
    large: false,
  },
  {
    id: 'cable',
    label: 'Strength',
    name: 'Cable Attachments',
    Icon: Zap,
    gradient: 'linear-gradient(140deg, #0f0a00 0%, #1a1200 50%, #0a0800 100%)',
    color: '#F5C518',
    large: false,
  },
  {
    id: 'cardio',
    label: 'Cardio Zone',
    name: 'Treadmills & Cardio Machines',
    Icon: Activity,
    gradient: 'linear-gradient(140deg, #00080a 0%, #001018 50%, #000608 100%)',
    color: '#00C2FF',
    large: true,
  },
  {
    id: 'functional',
    label: 'Functional',
    name: 'Training Studio',
    Icon: Flame,
    gradient: 'linear-gradient(140deg, #0a0000 0%, #180500 50%, #0a0000 100%)',
    color: '#FF5722',
    large: false,
  },
  {
    id: 'locker',
    label: 'Amenities',
    name: 'Lockers & Showers',
    Icon: ShowerHead,
    gradient: 'linear-gradient(140deg, #00050a 0%, #000c18 50%, #000408 100%)',
    color: '#607D8B',
    large: false,
  },
];

function FacilityCard({ facility, delay, visible }) {
  const { Icon } = facility;
  return (
    <div
      className={`facility-card ${facility.large ? 'facility-card--large' : ''} reveal ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className="facility-card__bg"
        style={{ background: facility.gradient }}
        aria-hidden="true"
      >
        <div className="facility-card__glow" style={{ background: `radial-gradient(ellipse at 40% 50%, ${facility.color}18 0%, transparent 65%)` }} />
        <div className="facility-card__grid" />
        <span className="facility-card__icon" style={{ color: `${facility.color}22` }}>
          <Icon size={110} strokeWidth={0.75} />
        </span>
      </div>
      <div className="facility-card__overlay">
        <div className="facility-card__label">{facility.label}</div>
        <div className="facility-card__name">{facility.name}</div>
        <div className="facility-card__bar" />
      </div>
    </div>
  );
}

export default function Facilities() {
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { ref: gridRef, visible: gridVisible } = useReveal({ threshold: 0.05 });

  return (
    <section id="facilities" className="facilities">
      <div className="section-container">

        <div className="facilities__header" ref={headerRef}>
          <div className={`reveal-left ${headerVisible ? 'visible' : ''}`}>
            <div className="section-tag">World-Class Facilities</div>
            <h2 className="section-heading">
              EVERYTHING YOU NEED<br />
              <span className="gold">TO PERFORM</span>
            </h2>
          </div>
          <p className={`facilities__desc reveal-right ${headerVisible ? 'visible' : ''}`} style={{ transitionDelay: '100ms' }}>
            From heavy iron to full cardio zones, every inch of Amigo&apos;s is built to elevate your performance and push your limits.
          </p>
        </div>

        <div className="facilities__grid" ref={gridRef}>
          {FACILITIES.map((f, i) => (
            <FacilityCard key={f.id} facility={f} delay={i * 80} visible={gridVisible} />
          ))}
        </div>

      </div>
    </section>
  );
}
