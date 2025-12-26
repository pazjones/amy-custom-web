import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, ArrowRight, Instagram, Mail, Menu, X, Palette, Sparkles, Send, ShieldCheck, Shirt, Brush } from 'lucide-react';
import type { Artwork } from "./types";
import { INITIAL_ARTWORKS, AVATAR_URL } from './constants';
import AdminPanel from "./AdminPanel";



declare global {
  interface Window {
    paypal: any;
  }
}

// Icono personalizado para TikTok
const TikTokIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const PayPalButton: React.FC<{ artworkId: string }> = ({ artworkId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonId = "paypal-container-P9L8BLPS8V6N6";
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let isMounted = true;
    const loadPayPalScript = () => {
      if (window.paypal && window.paypal.HostedButtons) {
        renderButton();
        return;
      }
      const script = document.createElement('script');
      script.src = "https://www.paypal.com/sdk/js?client-id=BAAfJLtzlZrYl7vKrmAmYreQLKZPst6RyaKshgnd_7Pyds6fri0E4jNQK8MznlNcXE6narxpMnU2LtD5mo&components=hosted-buttons&disable-funding=venmo&currency=USD";
      script.async = true;
      script.onload = () => { if (isMounted) renderButton(); };
      script.onerror = () => { if (isMounted) setStatus('error'); };
      document.body.appendChild(script);
    };

    const renderButton = () => {
      if (!isMounted || !containerRef.current) return;
      try {
        containerRef.current.innerHTML = '';
        window.paypal.HostedButtons({ hostedButtonId: "P9L8BLPS8V6N6" }).render(`#${buttonId}`)
        .then(() => { if (isMounted) setStatus('ready'); })
        .catch((err: any) => { console.error("PayPal Error:", err); if (isMounted) setStatus('error'); });
      } catch (err) { if (isMounted) setStatus('error'); }
    };

    loadPayPalScript();
    return () => { isMounted = false; };
  }, [artworkId]);

  return (
    <div className="w-full mt-8">
      <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl shadow-gray-200/50 min-h-[200px] flex flex-col justify-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-8 h-8 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Conectando pasarela...</p>
          </div>
        )}
        {status === 'error' && <p className="text-center text-xs font-bold text-red-500">Error en la conexión. Reintenta.</p>}
        <div id={buttonId} ref={containerRef} className={status === 'ready' ? 'block animate-in' : 'hidden'} />
      </div>
    </div>
  );
};

const MobileMenu = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/95 text-white z-[9999] flex flex-col p-12 overflow-y-auto">
    <div className="flex justify-between items-center mb-16">
      <span className="brand-logo font-black">amy.custom</span>
      <button onClick={onClose}>
        <X size={36} />
      </button>
    </div>

    <div className="flex flex-col gap-8 text-4xl font-black uppercase tracking-tighter mb-12">
      <Link to="/" onClick={onClose}>Inicio</Link>
      <a href="#servicios" onClick={onClose}>Servicios</a>
      <Link to="/admin" onClick={onClose}>Admin</Link>
    </div>

    <div className="mt-auto border-t border-white/10 pt-10 pb-6">
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6">
        Sigue mi trabajo
      </p>
      <div className="flex gap-8">
        <a href="https://www.instagram.com/amy.custom" target="_blank">
          <Instagram size={32} />
        </a>
        <a href="https://www.tiktok.com/@.a..jones" target="_blank">
          <TikTokIcon size={32} />
        </a>
        <a href="mailto:amandajones.arts@gmail.com">
          <Mail size={32} />
        </a>
      </div>
    </div>
  </div>
);

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md h-24 flex items-center px-6 md:px-12">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link to="/" className="brand-logo font-black text-black">
            amy.custom
          </Link>

          <div className="hidden md:flex gap-10 text-[13px] font-black uppercase tracking-widest">
            <Link to="/">Colección</Link>
            <a href="#servicios">Servicios</a>
            <Link to="/admin" className="text-gray-300">Admin</Link>
          </div>

          <button
            className="md:hidden text-black"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {isMenuOpen && <MobileMenu onClose={() => setIsMenuOpen(false)} />}
    </>
  );
};


const Hero: React.FC = () => (
  <header className="pt-56 pb-24 px-6 flex flex-col items-center text-center bg-white">
    <div className="w-32 h-32 rounded-full overflow-hidden mb-12 border-4 border-gray-50 shadow-2xl">
      <img src={AVATAR_URL} alt="Amy" className="w-full h-full object-cover" />
    </div>
    <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 leading-[0.9]">
      amy.custom
    </h1>
    <p className="text-xl md:text-3xl font-bold text-gray-500 max-w-3xl leading-relaxed mt-4">
      Ilustración digital con alma. Transformo ideas en trazos vibrantes para dar vida a tus espacios y proyectos.
    </p>
    <div className="mt-16 animate-bounce text-black"><ArrowRight className="rotate-90" size={32} /></div>
  </header>
);

const CollectionHeader: React.FC = () => (
  <div className="max-w-7xl mx-auto px-6 pt-32 pb-12 text-center md:text-left">
    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-black">Explora la Colección</h2>
    <p className="text-xl text-gray-400 font-bold max-w-2xl">
      Obras digitales exclusivas con acabados premium. Listas para tu colección personal.
    </p>
  </div>
);

const Services: React.FC = () => (
  <section id="servicios" className="bg-white py-40 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div>
          <span className="text-sm font-black uppercase tracking-[0.4em] text-pink-500 mb-8 block">Comisiones Abiertas</span>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 text-black leading-none uppercase">Servicios a Medida</h2>
          <p className="text-2xl text-gray-500 leading-relaxed mb-12 font-medium">
            ¿Buscas una pieza única? Creamos arte personalizado que conecta con tu visión.
          </p>
          <ul className="space-y-10">
            <li className="flex items-start gap-6">
              <div className="p-5 bg-pink-50 rounded-[24px] text-pink-500 shadow-sm"><Shirt size={28} /></div>
              <div><h4 className="font-black text-2xl text-black mb-2 uppercase">ROPA CUSTOM</h4><p className="text-gray-400 text-lg">Prendas intervenidas con diseños exclusivos y personalizados.</p></div>
            </li>
            <li className="flex items-start gap-6">
              <div className="p-5 bg-blue-50 rounded-[24px] text-blue-500 shadow-sm"><Brush size={28} /></div>
              <div><h4 className="font-black text-2xl text-black mb-2 uppercase">ARTE EN DIBUJOS</h4><p className="text-gray-400 text-lg">Ilustraciones detalladas y piezas artísticas para tus proyectos.</p></div>
            </li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-[80px] p-10 md:p-16 flex flex-col justify-center items-center border border-gray-100 shadow-sm relative overflow-hidden group md:aspect-square">

           <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
           <div className="text-center relative z-10">
              <Send size={64} className="mx-auto mb-10 text-gray-200" />
              <h3 className="text-4xl font-black mb-6 text-black tracking-tighter">¿Tienes una idea?</h3>
              <p className="text-gray-400 mb-12 text-xl max-w-xs font-medium">Envíame un mensaje y creemos algo increíble juntos.</p>
              <a href="mailto:amandajones.arts@gmail.com" className="inline-block bg-black text-white px-14 py-6 rounded-full font-black uppercase tracking-[0.2em] text-sm hover:bg-gray-900 transform transition hover:-translate-y-1 shadow-lg">Enviar Mensaje</a>
           </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer: React.FC = () => (
  <footer className="bg-black text-white pt-32 pb-20 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-20 pb-20 border-b border-white/10">
        <div className="text-center md:text-left">
          <span className="brand-logo text-white block mb-8 font-black">amy.custom</span>
          <p className="text-gray-500 text-lg max-w-sm font-medium">Arte digital contemporáneo. Transformando el lienzo digital en experiencias visuales únicas.</p>
        </div>
        <div className="flex gap-10">
          <a href="https://www.instagram.com/amy.custom" target="_blank" rel="noopener noreferrer" className="p-5 bg-white/5 rounded-full hover:bg-white/10 transition-all hover:scale-110"><Instagram size={28} /></a>
          <a href="https://www.tiktok.com/@.a..jones" target="_blank" rel="noopener noreferrer" className="p-5 bg-white/5 rounded-full hover:bg-white/10 transition-all hover:scale-110"><TikTokIcon size={28} /></a>
          <a href="mailto:amandajones.arts@gmail.com" className="p-5 bg-white/5 rounded-full hover:bg-white/10 transition-all hover:scale-110"><Mail size={28} /></a>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center pt-12 gap-8">
        <p className="text-gray-600 text-sm font-bold">© 2025 Amy Custom. Todos los derechos reservados.</p>
        <div className="text-center md:text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 mb-2">Design & Art</p>
          <span className="text-xs font-black text-gray-500 tracking-widest uppercase"><a href="https://pazjones.com/" target="_blank">pazjones.com</a></span>
        </div>
      </div>
    </div>
  </footer>
);

const Gallery: React.FC<{ artworks: Artwork[] }> = ({ artworks }) => (
  <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
    {artworks.map(art => (
      <Link key={art.id} to={`/artwork/${art.id}`} className="group block">
        <div className="aspect-[3/4] bg-gray-100 rounded-[50px] overflow-hidden mb-10 relative border border-gray-100 shadow-sm group-hover:shadow-3xl transition-all duration-700">
          <img src={art.previewUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 blur-md" />
          <div className="absolute inset-0 watermark-overlay opacity-40" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <span className="bg-black/20 backdrop-blur-md text-white/80 px-6 py-3 rounded-full font-black uppercase tracking-[0.4em] text-[10px] border border-white/10">Preview Protegido</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
             <div className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3">Ver Detalle <ArrowRight size={16} /></div>
          </div>
        </div>
        <div className="flex justify-between items-end px-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-pink-500 mb-2 block">{art.category}</span>
            <h3 className="font-black text-3xl tracking-tighter text-black">{art.title}</h3>
          </div>
          <span className="font-black text-2xl text-gray-300 tracking-tighter">${art.price}</span>
        </div>
      </Link>
    ))}
  </section>
);

const ArtworkDetail: React.FC<{ artworks: Artwork[] }> = ({ artworks }) => {
  const { id } = useParams();
  const artwork = artworks.find(a => a.id === id);
  const navigate = useNavigate();

  if (!artwork) return <div className="pt-56 text-center font-black text-black text-2xl">Obra no encontrada</div>;

  return (
    <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto animate-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-20 hover:text-black transition-colors"><ChevronLeft size={20} /> Volver a la colección</button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-28 items-start">
        <div className="relative rounded-[70px] overflow-hidden shadow-3xl bg-white border border-gray-100 group">
          <img src={artwork.previewUrl} className="w-full h-auto blur-md opacity-90 scale-105" />
          <div className="absolute inset-0 watermark-overlay opacity-40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-6">
             <span className="text-4xl md:text-6xl font-black text-white/20 tracking-[1em] select-none whitespace-nowrap rotate-12">AMY CUSTOM</span>
             <span className="bg-black/40 backdrop-blur-xl border border-white/10 text-white px-10 py-5 rounded-full font-black uppercase tracking-[0.5em] text-xs">Preview Protegido</span>
          </div>
        </div>
        <div className="lg:sticky lg:top-40">
          <span className="text-sm font-black text-pink-500 uppercase tracking-[0.5em] mb-8 block">{artwork.category}</span>
          <h2 className="text-6xl md:text-[5.5rem] font-black tracking-tighter mb-10 text-black leading-[0.9]">{artwork.title}</h2>
          <div className="grid grid-cols-2 gap-10 mb-14">
             <div className="border-l-4 border-pink-500 pl-6"><p className="text-[11px] font-black uppercase text-gray-400 mb-1">Colección</p><p className="font-black text-black text-xl">{artwork.year}</p></div>
             <div className="border-l-4 border-pink-500 pl-6"><p className="text-[11px] font-black uppercase text-gray-400 mb-1">Archivo</p><p className="font-black text-black text-xl">{artwork.fileType}</p></div>
          </div>
          <p className="text-2xl text-gray-500 leading-relaxed mb-14 font-medium">{artwork.description}</p>
          <div className="flex flex-col gap-4 py-10 border-y border-gray-100 mb-14 text-center md:text-left">
             <span className="text-2xl font-black text-gray-400 uppercase tracking-widest">TOTAL A PAGAR</span>
             <span className="text-6xl md:text-7xl font-black tracking-tighter text-black">US {artwork.price.toFixed(2)}</span>
          </div>
          <PayPalButton artworkId={artwork.id} />
          <div className="mt-12 flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 justify-center">
             <ShieldCheck size={18} className="text-green-500" /> Pago Cifrado • Entrega Digital Inmediata
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [artworks] = useState<Artwork[]>(INITIAL_ARTWORKS);

  const ADMIN_PASSWORD = "@Negrita2000"; // ⚠️ cámbiala luego o muévela a env

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setAuthError(false);
      setAdminPasswordInput("");
    } else {
      setAuthError(true);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <CollectionHeader />
                <Gallery artworks={artworks} />
                <Services />
                <Footer />
              </>
            }
          />

          <Route
            path="/artwork/:id"
            element={<ArtworkDetail artworks={artworks} />}
          />

          <Route
            path="/admin"
            element={
              !isAdminAuthenticated ? (
                <div className="pt-56 max-w-md mx-auto px-6">
                  <form
                    onSubmit={handleAdminLogin}
                    className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 text-center"
                  >
                    <h2 className="text-3xl font-black mb-8">
                      Acceso Admin
                    </h2>

                    <input
                      type="password"
                      value={adminPasswordInput}
                      onChange={(e) =>
                        setAdminPasswordInput(e.target.value)
                      }
                      placeholder="Contraseña"
                      className="w-full px-6 py-4 rounded-2xl border border-gray-200 text-center font-bold mb-6"
                    />

                    <button
                      type="submit"
                      className="w-full py-5 bg-black text-white rounded-2xl font-bold hover:bg-gray-900 transition"
                    >
                      Entrar
                    </button>

                    {authError && (
                      <p className="text-red-500 mt-4 text-xs font-bold uppercase tracking-widest">
                        Acceso denegado
                      </p>
                    )}
                  </form>
                </div>
              ) : (
                <AdminPanel
                  artworks={artworks}
                  onLogout={handleAdminLogout}
                />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

