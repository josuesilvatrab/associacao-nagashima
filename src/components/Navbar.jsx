import React, { useState } from 'react';
import { User, Calendar, Home, Lock, Facebook, Instagram, Youtube, MessageCircle, Info, GraduationCap, Menu, X } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenLogin, configSede }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tratamento do número do WhatsApp
  const apenasNumeros = configSede?.telefone ? configSede.telefone.replace(/\D/g, '') : '';
  const numeroValido = apenasNumeros.length >= 10 ? apenasNumeros : '84988880000';
  const urlWhatsapp = `https://api.whatsapp.com/send?phone=55${numeroValido}&text=Olá,%20gostaria%20de%20mais%20informações!`;

  const handleNavClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-zinc-950/95 backdrop-blur-md border-b border-zinc-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* REDES SOCIAIS E WHATSAPP */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-500 hidden md:inline">
            Redes:
          </span>
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* FACEBOOK */}
            {configSede?.facebook ? (
              <a
                href={configSede.facebook}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-[#1877F2] hover:bg-zinc-900 transition-all duration-300 hover:scale-110"
                title="Facebook"
              >
                <Facebook size={18} />
              </a>
            ) : (
              <span className="p-1.5 text-zinc-600 opacity-50 cursor-not-allowed" title="Facebook não cadastrado">
                <Facebook size={18} />
              </span>
            )}

            {/* INSTAGRAM */}
            {configSede?.instagram ? (
              <a
                href={configSede.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-[#E4405F] hover:bg-zinc-900 transition-all duration-300 hover:scale-110"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
            ) : (
              <span className="p-1.5 text-zinc-600 opacity-50 cursor-not-allowed" title="Instagram não cadastrado">
                <Instagram size={18} />
              </span>
            )}

            {/* YOUTUBE */}
            {configSede?.youtube ? (
              <a
                href={configSede.youtube}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-[#FF0000] hover:bg-zinc-900 transition-all duration-300 hover:scale-110"
                title="YouTube"
              >
                <Youtube size={18} />
              </a>
            ) : (
              <span className="p-1.5 text-zinc-600 opacity-50 cursor-not-allowed" title="YouTube não cadastrado">
                <Youtube size={18} />
              </span>
            )}

            {/* WHATSAPP CORRIGIDO (API OFICIAL) */}
            <a
              href={urlWhatsapp}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-[#25D366] hover:bg-zinc-900 transition-all duration-300 hover:scale-110"
              title="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* BOTÃO HAMBÚRGUER (MOBILE) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-300 hover:text-white bg-zinc-900 rounded-lg border border-zinc-800"
          aria-label="Abrir Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex items-center gap-1.5">
          <button
            onClick={() => handleNavClick('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
              activePage === 'home' ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Home size={14} /> Início
          </button>

          <button
            onClick={() => handleNavClick('quemSomos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
              activePage === 'quemSomos' ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Info size={14} /> Quem Somos
          </button>

          <button
            onClick={() => handleNavClick('atletas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
              activePage === 'atletas' ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <User size={14} /> Atletas
          </button>

          <button
            onClick={() => handleNavClick('eventos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
              activePage === 'eventos' ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Calendar size={14} /> Eventos
          </button>

          <button
            onClick={() => handleNavClick('exames')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
              activePage === 'exames' ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <GraduationCap size={14} /> Exames
          </button>

          <button
            onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-all ml-1"
            title="Acesso Admin"
          >
            <Lock size={15} />
          </button>
        </nav>
      </div>

      {/* MENU MOBILE DROPDOWN */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex flex-col gap-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black uppercase transition-all ${
              activePage === 'home' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-300'
            }`}
          >
            <Home size={18} /> Início
          </button>

          <button
            onClick={() => handleNavClick('quemSomos')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black uppercase transition-all ${
              activePage === 'quemSomos' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-300'
            }`}
          >
            <Info size={18} /> Quem Somos
          </button>

          <button
            onClick={() => handleNavClick('atletas')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black uppercase transition-all ${
              activePage === 'atletas' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-300'
            }`}
          >
            <User size={18} /> Atletas
          </button>

          <button
            onClick={() => handleNavClick('eventos')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black uppercase transition-all ${
              activePage === 'eventos' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-300'
            }`}
          >
            <Calendar size={18} /> Eventos
          </button>

          <button
            onClick={() => handleNavClick('exames')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black uppercase transition-all ${
              activePage === 'exames' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-300'
            }`}
          >
            <GraduationCap size={18} /> Exames de Faixa
          </button>

          <button
            onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black uppercase bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          >
            <Lock size={18} /> Painel Administrativo
          </button>
        </nav>
      )}
    </header>
  );
}
