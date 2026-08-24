import React from 'react';
import { User, Calendar, Home, Lock, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenLogin, configSede }) {
  const numeroWhatsApp = configSede?.telefone ? configSede.telefone.replace(/\D/g, '') : '';

  return (
    <header className="bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* REDES SOCIAIS E WHATSAPP NO MESMO LUGAR */}
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-500 hidden sm:inline">
            Acesse nossas redes:
          </span>
          <div className="flex items-center gap-2">
            {configSede?.facebook ? (
              <a
                href={configSede.facebook}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-[#1877F2] hover:bg-zinc-900 transition-all duration-300 hover:scale-110"
                title="Facebook"
              >
                <Facebook size={17} />
              </a>
            ) : (
              <span className="p-1.5 text-zinc-600 hover:text-[#1877F2] transition-colors cursor-pointer hover:scale-110">
                <Facebook size={17} />
              </span>
            )}

            {configSede?.instagram ? (
              <a
                href={configSede.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-[#E4405F] hover:bg-zinc-900 transition-all duration-300 hover:scale-110"
                title="Instagram"
              >
                <Instagram size={17} />
              </a>
            ) : (
              <span className="p-1.5 text-zinc-600 hover:text-[#E4405F] transition-colors cursor-pointer hover:scale-110">
                <Instagram size={17} />
              </span>
            )}

            {configSede?.youtube ? (
              <a
                href={configSede.youtube}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-[#FF0000] hover:bg-zinc-900 transition-all duration-300 hover:scale-110"
                title="YouTube"
              >
                <Youtube size={17} />
              </a>
            ) : (
              <span className="p-1.5 text-zinc-600 hover:text-[#FF0000] transition-colors cursor-pointer hover:scale-110">
                <Youtube size={17} />
              </span>
            )}

            {/* ÍCONE DO WHATSAPP JUNTO AOS OUTROS */}
            <a
              href={`https://wa.me/55${numeroWhatsApp || '84988880000'}?text=Olá,%20gostaria%20de%20mais%20informações%20sobre%20a%20Associação%20Nagashima!`}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-[#25D366] hover:bg-zinc-900 transition-all duration-300 hover:scale-110"
              title="WhatsApp"
            >
              <MessageCircle size={17} />
            </a>
          </div>
        </div>

        {/* MENU DE NAVEGAÇÃO */}
        <nav className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
              activePage === 'home'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Home size={14} /> Início
          </button>

          <button
            onClick={() => setActivePage('atletas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
              activePage === 'atletas'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <User size={14} /> Atletas
          </button>

          <button
            onClick={() => setActivePage('eventos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
              activePage === 'eventos'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Calendar size={14} /> Eventos
          </button>

          <button
            onClick={onOpenLogin}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-all ml-1"
            title="Acesso Restrito / Admin"
          >
            <Lock size={15} />
          </button>
        </nav>
      </div>
    </header>
  );
}
