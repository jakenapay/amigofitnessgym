import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Facilities from './components/Facilities';
import Promo from './components/Promo';
import Features from './components/Features';
import Careers from './components/Careers';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <About />
        <Facilities />
        <Promo />
        <Features />
        <Careers />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
