import { Calendar, Shirt, Trophy, ClipboardList, Gift, AlertTriangle, Flame, Check } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import './Promo.css';

const BENEFITS = [
  { text: 'FREE 12-Month Gym Membership', value: '₱15,000 value', Icon: Calendar },
  { text: "FREE Amigo's Dryfit Gym Shirt", value: '₱600 value', Icon: Shirt },
  { text: 'FREE Certified Personal Trainer Assignment', value: 'From Day 1', Icon: Trophy },
  { text: 'FREE Personalized Fitness Program', value: 'Custom to your goals', Icon: ClipboardList },
];

const VALUE_CARDS = [
  { Icon: Calendar, num: '12', label: 'Months Free\nMembership' },
  { Icon: Shirt, num: 'FREE', label: 'Dryfit\nGym Shirt' },
  { Icon: Trophy, num: '1-on-1', label: 'Personal\nTrainer' },
  { Icon: AlertTriangle, num: 'Limited', numSmall: true, label: '20 Slots\nOnly' },
];

export default function Promo() {
  const { ref: leftRef, visible: leftVisible } = useReveal();
  const { ref: rightRef, visible: rightVisible } = useReveal();

  return (
    <section id="promo" className="promo">
      <div className="section-container">
        <div className="promo__card">

          <div className="promo__ring" aria-hidden="true" />
          <div className="promo__ring promo__ring--2" aria-hidden="true" />

          {/* Left: Content */}
          <div ref={leftRef} className={`promo__content reveal-left ${leftVisible ? 'visible' : ''}`}>
            <div className="promo__badge">
              <Flame size={14} strokeWidth={2} />
              Limited Time Offer
            </div>

            <h2 className="promo__title">
              BACK TO THE<br />
              GYM<br />
              <span className="gold">STARTER PACK</span>
            </h2>

            <p className="promo__desc">
              Sign up for any Personal Training Package and unlock a massive bundle of freebies
              worth over <strong style={{ color: 'var(--primary)' }}>₱15,600</strong>. Only 20 slots available — don&apos;t miss out.
            </p>

            <ul className="promo__benefits">
              {BENEFITS.map((b, i) => (
                <li
                  key={i}
                  className={`promo__benefit reveal ${leftVisible ? 'visible' : ''}`}
                  style={{ transitionDelay: `${i * 80 + 200}ms` }}
                >
                  <div className="promo__benefit-check">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <div>
                    <span className="promo__benefit-text">{b.text}</span>
                    <span className="promo__benefit-value">{b.value}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="promo__slots">
              <span className="promo__slots-dot" />
              <span>Only 20 slots — Limited availability</span>
            </div>

            <a
              href="#contact"
              className="btn-primary"
              onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              Claim Your Slot Now
            </a>
          </div>

          {/* Right: Value cards */}
          <div ref={rightRef} className={`promo__cards-wrap reveal-right ${rightVisible ? 'visible' : ''}`}>
            <div className="promo__value-hero">
              <div className="promo__value-icon">
                <Gift size={36} strokeWidth={1.5} />
              </div>
              <div className="promo__value-label">Total Bundle Value</div>
              <div className="promo__value-number">₱15,600<span>+</span></div>
              <div className="promo__value-sub">In Free Bonuses</div>
            </div>

            <div className="promo__value-grid">
              {VALUE_CARDS.map(({ Icon, num, numSmall, label }, i) => (
                <div className="promo__value-item" key={i}>
                  <div className="promo__vi-icon">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <div className={`promo__vi-num ${numSmall ? 'promo__vi-num--sm' : ''}`}>{num}</div>
                  <div className="promo__vi-label">{label.split('\n').map((l, j) => <span key={j}>{l}<br /></span>)}</div>
                </div>
              ))}
            </div>

            <p className="promo__terms">*Terms and conditions apply. Valid while slots last.</p>
          </div>

        </div>
      </div>
    </section>
  );
}
