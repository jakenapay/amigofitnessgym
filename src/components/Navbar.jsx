import { useState, useEffect } from 'react';
import logo from '../assets/amigo.png';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Promos', href: '#promo' },
  { label: 'Why Us', href: '#features' },
  { label: 'Careers', href: '#careers' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <a href="#hero" className="navbar__logo" onClick={() => handleNavClick('#hero')}>
          <img src={logo} alt="Amigo's Fitness Gym" className="navbar__logo-img" />
        </a>

        <ul className="navbar__links">
          {NAV_LINKS.slice(0, -1).map(link => (
            <li key={link.href}>
              <a href={link.href} onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="navbar__cta"
              onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
            >
              Join Now
            </a>
          </li>
        </ul>

        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <img src={logo} alt="Amigo's Fitness Gym" className="mobile-menu__logo" />
        <ul>
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <a href={link.href} onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
