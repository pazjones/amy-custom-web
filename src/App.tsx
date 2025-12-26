import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ArrowRight, Instagram, Mail, Menu, X, Shirt, Brush, ShieldCheck, Send, ExternalLink, MessageCircle } from 'lucide-react';
import type { Artwork } from "./types";
import { INITIAL_ARTWORKS, AVATAR_URL } from './constants';
import AdminPanel from "./AdminPanel";

// --- ICONOS ---
const TikTokIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md h-24 flex items-center px-6 md:px-12">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link to="/" className="brand-logo font-black text-black">amy.custom</Link>
          <div className="hidden md:flex gap-10 text-[13px] font-black uppercase tracking-widest text-black">
            <Link to="/">Colección</Link>
            <a href="#servicios">Servicios</a>
            <Link to="/admin" className="text-gray-300">Admin</Link>
          </div>
          <button className="md:hidden text-black" onClick={() => setIsMenuOpen(true)}><Menu size={28} /></button>
        </div>
      </nav>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/95 text-white z-[9999] flex flex-col p-12">
          <div className="flex justify-between items-center mb-16">
            <span className="brand-logo font-black">amy.custom</span>
            <button onClick={() => setIsMenuOpen(false)}><X size={36} /></button>
          </div>
          <div className="flex flex-col gap-8 text-4xl font-black uppercase tracking-tighter">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
            <a href="#servicios" onClick={() => setIsMenuOpen(false)}>Servicios</a>
            <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link>
          </div>
        </div>
      )}
    </>
  );
};

const Gallery: React.FC<{ artworks: Artwork[] }> = ({ artworks }) => (
  <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
    {artworks.map(art => (
      <Link key={art.id} to={`/artwork/${art.id}`} className="group block">
        <div className="aspect-[3/4] bg-gray-100 rounded-[50px] overflow-hidden mb-10 relative border border-gray-100 shadow-sm group-hover:shadow-3xl transition-all duration-700">
          <img src={art.previewUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 blur-md" alt={art.title} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <span className="bg-black/20 backdrop-blur-md text-white/80 px-6 py-3 rounded-full font-black uppercase tracking-[0.4em] text-[10px] border border-white/10">Preview</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
             <div className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3">Ver Detalle <ArrowRight size={16} /></div>
          </div>
        </div>
        <div className="flex justify-between items-end px-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-pink-500 mb-2 block">{art.category}</span>
            <h3 className="font-black text-3xl tracking-tighter text-black uppercase">{art.title}</h3>
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

  if (!artwork) return <div className="pt-56 text-center font-black text-black text-2xl uppercase tracking-widest">Obra no encontrada</div>;

  const paypalMeLink = `https://www.paypal.me/amycustom/${artwork.price}`;
  const whatsappNumber = "56979518383";
  const whatsappMessage = encodeURIComponent(`¡Hola Amy! Acabo de realizar el pago de US$${artwork.price} por la obra "${artwork.title.toUpperCase()}". Aquí adjunto mi comprobante para recibir el archivo digital.`);
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="pt-40 pb-32 px-6 max-w-7xl mx-auto animate-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-20 hover:text-black transition-colors">
        <ChevronLeft size={20} /> Volver a la colección
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-28 items-start">
        <div className="relative rounded-[70px] overflow-hidden shadow-3xl bg-white border border-gray-100">
          <img src={artwork.previewUrl} className="w-full h-auto blur-md opacity-90 scale-105" alt={artwork.title} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-6 text-center">
             <span className="text-4xl md:text-6xl font-black text-white/20 tracking-[1em] rotate-12 uppercase">AMY CUSTOM</span>
             <span className="bg-black/40 backdrop-blur-xl border border-white/10 text-white px-10 py-5 rounded-full font-black uppercase tracking-[0.5em] text-xs">Protección Visual</span>
          </div>
        </div>

        <div className="lg:sticky lg:top-40">
          <span className="text-sm font-black text-pink-500 uppercase tracking-[0.5em] mb-8 block">{artwork.category}</span>
          <h2 className="text-6xl md:text-[7rem] font-black tracking-tighter mb-10 text-black leading-[0.8] uppercase">{artwork.title}</h2>
          
          <div className="flex flex-col gap-4 py-10 border-y border-gray-100 mb-14">
             <span className="text-2xl font-black text-gray-400 uppercase tracking-widest">PRECIO DEL ARCHIVO</span>
             <span className="text-7xl font-black tracking-tighter text-black">US ${artwork.price.toFixed(2)}</span>
          </div>

          <div className="flex flex-col gap-6">
            <a 
              href={paypalMeLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-4 bg-[#0070ba] text-white py-8 rounded-[30px] font-black uppercase tracking-[0.2em] text-lg shadow-xl hover:bg-[#005ea6] transition-all transform hover:-translate-y-1"
            >
              1. Pagar con PayPal
              <ExternalLink size={22} className="opacity-50" />
            </a>

            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-4 bg-[#25D366] text-white py-8 rounded-[30px] font-black uppercase tracking-[0.2em] text-lg shadow-xl hover:bg-[#128C7E] transition-all transform hover:-translate-y-1"
            >
              2. Confirmar en WhatsApp
              <MessageCircle size={24} />
            </a>
          </div>

          <div className="mt-12 p-8 bg-gray-50 rounded-[40px] border border-gray-100">
             <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
               <ShieldCheck size={20} className="text-green-500" /> Compra Protegida
             </div>
             <p className="text-sm text-gray-400 font-bold leading-relaxed uppercase tracking-tighter">
               PROCESO: Realiza el pago en PayPal y luego presiona confirmar para enviarme tu comprobante. Te enviaré el archivo original de alta resolución por este mismo chat.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [artworks] = useState<Artwork[]>(INITIAL_ARTWORKS);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === "@Negrita2000") setIsAdminAuthenticated(true);
  };

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <header className="pt-56 pb-24 px-6 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-12 border-4 border-gray-50 shadow-2xl">
                  <img src={AVATAR_URL} alt="Amy" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 leading-[0.9]">amy.custom</h1>
                <p className="text-xl md:text-3xl font-bold text-gray-500 max-w-3xl leading-relaxed uppercase tracking-tighter">Ilustración digital con alma.</p>
              </header>
              <Gallery artworks={artworks} />
              <section id="servicios" className="py-40 bg-black text-white px-6 text-center">
                <span className="text-pink-500 font-black uppercase tracking-[0.5em] mb-8 block">Proyectos Especiales</span>
                <h2 className="text-6xl md:text-8xl font-black uppercase mb-16 tracking-tighter">Comisiones</h2>
                <a href="mailto:amandajones.arts@gmail.com" className="inline-block bg-white text-black px-16 py-8 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform">Contactar por Email</a>
              </section>
            </>
          } />
          <Route path="/artwork/:id" element={<ArtworkDetail artworks={artworks} />} />
          <Route path="/admin" element={
            !isAdminAuthenticated ? (
              <div className="pt-56 max-w-md mx-auto px-6">
                <form onSubmit={handleAdminLogin} className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
                  <input type="password" value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} placeholder="Contraseña" className="w-full px-6 py-4 rounded-2xl border mb-6 text-center font-bold outline-none" />
                  <button type="submit" className="w-full py-5 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs">Entrar</button>
                </form>
              </div>
            ) : (
              <AdminPanel artworks={artworks} onLogout={() => setIsAdminAuthenticated(false)} />
            )
          } />
        </Routes>
        <footer className="py-20 text-center border-t border-gray-50">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">© 2025 Amy Custom • Viña del Mar, Chile</p>
        </footer>
      </div>
    </Router>
  );
}