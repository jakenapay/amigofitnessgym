import { Link } from 'react-router-dom';
import logo from '../assets/amigo png logo.png';
import './Footer.css';

const scrollTo = (href) => {
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="section-container">
        <div className="footer__inner">

          <div className="footer__brand">
            <img src={logo} alt="Amigo's Fitness Gym" className="footer__logo-img" />
            <div className="footer__brand-right">
              <p className="footer__brand-desc">
                Making fitness simple, fun, and accessible for everyone. Modern equipment,
                friendly trainers, and a no-judgment space where real people achieve real results.
              </p>
            <div className="footer__socials">
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="footer__social" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="https://www.instagram.com/amigosfgmcpromosandfranchise" target="_blank" rel="noreferrer" className="footer__social" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://wa.me/639766605132" target="_blank" rel="noreferrer" className="footer__social" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.732.452 3.354 1.243 4.762L2.049 22l5.367-1.167A9.938 9.938 0 0012 22c5.523 0 10-4.477 10-10S17.522 2 11.999 2z"/></svg>
              </a>
            </div>
            </div>{/* end footer__brand-right */}
          </div>{/* end footer__brand */}

          <div className="footer__col">
            <h4 className="footer__col-title">Navigate</h4>
            <ul>
              {[['#about','About Us'],['#facilities','Facilities'],['#promo','Promotions'],['#features','Why Us'],['#careers','Careers'],['#contact','Contact']].map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={e => { e.preventDefault(); scrollTo(href); }}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Services</h4>
            <ul>
              {['Personal Training','Gym Membership','Group Classes','Franchise Info','Beginner Programs'].map(s => (
                <li key={s}>
                  <a href="#contact" onClick={e => { e.preventDefault(); scrollTo('#contact'); }}>{s}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Contact</h4>
            <ul>
              <li><a href="tel:+639766605132">+63 976 660 5132</a></li>
              <li><a href="mailto:promosandfranchiseamigosfgmc@gmail.com">Email Us</a></li>
              <li><a href="https://www.instagram.com/amigosfgmcpromosandfranchise" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="#" target="_blank" rel="noreferrer">Facebook</a></li>
              <li><span className="footer__always-open">Always Open — 24/7</span></li>
            </ul>
          </div>

        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {year} Amigo&apos;s Fitness Gym. All rights reserved.
            <span> &middot; 129 Kamias Rd, Diliman, Quezon City, Philippines</span>
          </p>
          <Link to="/login" className="footer__login-link">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
