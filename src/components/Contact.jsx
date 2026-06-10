import { useState } from 'react';
import { MapPin, Smartphone, Mail, Camera, Clock } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import './Contact.css';

const CONTACT_ITEMS = [
  { Icon: MapPin,     label: 'Address',         value: '129 Kamias Rd, Diliman, Quezon City, Philippines 1101' },
  { Icon: Smartphone, label: 'Phone / WhatsApp', value: '+63 976 660 5132', href: 'tel:+639766605132' },
  { Icon: Mail,       label: 'Email',            value: 'promosandfranchiseamigosfgmc@gmail.com', href: 'mailto:promosandfranchiseamigosfgmc@gmail.com' },
  { Icon: Camera,     label: 'Instagram',        value: '@amigosfgmcpromosandfranchise' },
  { Icon: Clock,      label: 'Hours',            value: 'Always Open — 24 / 7' },
];

const INTERESTS = [
  'Personal Training Package',
  'Gym Membership Only',
  'Back to Gym Promo',
  'Franchise Information',
  'Group Classes',
  'General Inquiry',
];

export default function Contact() {
  const { ref: leftRef, visible: leftVisible } = useReveal();
  const { ref: rightRef, visible: rightVisible } = useReveal();
  const [status, setStatus] = useState('idle'); // idle | success

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('success');
    e.target.reset();
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <section id="contact" className="contact">
      <div className="section-container">
        <div className="contact__grid">

          {/* Left: Info */}
          <div ref={leftRef} className={`contact__info reveal-left ${leftVisible ? 'visible' : ''}`}>
            <div className="section-tag">Get In Touch</div>
            <h2 className="section-heading contact__heading">
              READY TO START<br />
              YOUR <span className="gold">JOURNEY?</span>
            </h2>
            <p className="contact__intro">
              Message us today and we&apos;ll help you from Day 1. No pressure, no judgment — just real guidance and real results.
            </p>

            <div className="contact__items">
              {CONTACT_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className={`contact__item reveal ${leftVisible ? 'visible' : ''}`}
                  style={{ transitionDelay: `${i * 80 + 100}ms` }}
                >
                  <div className="contact__item-icon">
                    <item.Icon size={18} strokeWidth={1.75} />
                  </div>
                  <div>
                    <div className="contact__item-label">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="contact__item-value contact__item-value--link">
                        {item.value}
                      </a>
                    ) : (
                      <div className="contact__item-value">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div ref={rightRef} className={`contact__form-wrap reveal-right ${rightVisible ? 'visible' : ''}`}>
            <h3 className="contact__form-title">SEND A MESSAGE</h3>
            <p className="contact__form-sub">We&apos;ll get back to you within 24 hours.</p>

            {status === 'success' ? (
              <div className="contact__success">
                <div className="contact__success-icon">✓</div>
                <h4>Message Sent!</h4>
                <p>Thank you! We&apos;ll reach out to you shortly to get your journey started.</p>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" className="form-input" placeholder="Juan dela Cruz" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input type="tel" className="form-input" placeholder="+63 912 345 6789" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" placeholder="juan@email.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">I&apos;m Interested In</label>
                  <select className="form-input form-select">
                    <option value="">Select an option</option>
                    {INTERESTS.map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Message (Optional)</label>
                  <textarea
                    className="form-input form-textarea"
                    placeholder="Tell us about your fitness goals..."
                    rows={4}
                  />
                </div>
                <button type="submit" className="btn-primary contact__submit">
                  Send Message
                  <span>→</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
