import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import './Stats.css';

const STATS = [
  { value: 7,    suffix: '+', label: 'Branches & Growing' },
  { value: 3200, suffix: '+', label: 'Happy Members' },
  { value: '24/7',  suffix: '', label: 'Always Open' },
  { value: 100,  suffix: '%', label: 'No-Judgment Zone' },
];

function CountUp({ target, suffix, active }) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current || typeof target !== 'number') return;
    started.current = true;
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(ease * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target]);

  if (typeof target !== 'number') return <>{target}{suffix}</>;
  return <>{display.toLocaleString()}{suffix}</>;
}

export default function Stats() {
  const { ref, visible } = useReveal({ threshold: 0.3 });

  return (
    <section className="stats" ref={ref}>
      <div className="section-container">
        <div className="stats__grid">
          {STATS.map((s, i) => (
            <div key={i} className={`stats__item reveal ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="stats__number">
                <CountUp target={s.value} suffix={s.suffix} active={visible} />
              </div>
              <div className="stats__label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
