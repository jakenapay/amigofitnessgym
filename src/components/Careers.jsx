import { TrendingUp, Users, Award, Star, Check, Briefcase, MapPin, ArrowRight } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import './Careers.css';

const PERKS = [
  { Icon: TrendingUp, title: 'Performance-Based Income',    desc: 'Higher effort = higher income. No ceiling on what you can earn.' },
  { Icon: Users,      title: 'We Help You Get Clients',     desc: 'High client flow means you focus on coaching, not hunting leads.' },
  { Icon: Award,      title: 'Supportive Environment',      desc: 'A team that backs you — training, mentoring, and growth built in.' },
  { Icon: Star,       title: 'Be Part of a Growing Brand',  desc: '7 branches and expanding — your career grows as we grow.' },
];

const REQUIREMENTS = [
  'Passionate about fitness & helping others',
  'Confident talking and engaging with members',
  'Consistent, disciplined, and coachable',
  'With or without experience — we train the right people',
];

export default function Careers() {
  const { ref: headRef, visible: headVisible } = useReveal();
  const { ref: leftRef, visible: leftVisible } = useReveal();
  const { ref: rightRef, visible: rightVisible } = useReveal();

  return (
    <section id="careers" className="careers">
      <div className="section-container">

        <div ref={headRef} className={`careers__header reveal ${headVisible ? 'visible' : ''}`}>
          <div className="section-tag">Join Our Team</div>
          <h2 className="section-heading careers__title">
            BUILD YOUR CAREER<br />
            WITH <span className="gold">AMIGO&apos;S</span>
          </h2>
          <p className="careers__subtitle">
            We&apos;re growing fast and need passionate people to grow with us.
            No politics — just results, community, and real income.
          </p>
        </div>

        <div className="careers__card">
          <div className="careers__ring" aria-hidden="true" />
          <div className="careers__ring careers__ring--2" aria-hidden="true" />

          <div className="careers__card-inner">

            {/* Left: Job posting */}
            <div ref={leftRef} className={`careers__job reveal-left ${leftVisible ? 'visible' : ''}`}>
              <div className="careers__badge">
                <Briefcase size={13} strokeWidth={2.5} />
                Now Hiring
              </div>
              <h3 className="careers__job-title">PERSONAL<br />TRAINERS</h3>
              <p className="careers__job-desc">
                Coach members, drive PT sales, and help people change their lives.
                Performance-based pay — your effort directly equals your income.
              </p>

              <div className="careers__reqs">
                <p className="careers__reqs-label">We&apos;re looking for:</p>
                <ul className="careers__reqs-list">
                  {REQUIREMENTS.map((r, i) => (
                    <li key={i}>
                      <span className="careers__check-icon">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="careers__location">
                <MapPin size={14} strokeWidth={2} />
                Kamias Branch &amp; All 7 Locations
              </div>

              <a
                href="mailto:promosandfranchiseamigosfgmc@gmail.com?subject=Personal Trainer Application — Amigo's Fitness Gym"
                className="btn-primary careers__cta"
              >
                Apply Now
                <ArrowRight size={16} strokeWidth={2.5} />
              </a>
            </div>

            {/* Right: Perks */}
            <div ref={rightRef} className={`careers__perks reveal-right ${rightVisible ? 'visible' : ''}`}>
              <p className="careers__perks-label">Why Join Amigo&apos;s?</p>
              {PERKS.map(({ Icon, title, desc }) => (
                <div className="careers__perk" key={title}>
                  <div className="careers__perk-icon">
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  <div className="careers__perk-body">
                    <div className="careers__perk-title">{title}</div>
                    <div className="careers__perk-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        <p className={`careers__footer-note reveal ${leftVisible ? 'visible' : ''}`}>
          More positions opening soon &mdash; follow us on social media for updates.
        </p>

      </div>
    </section>
  );
}
