import React, { useState } from 'react';
import { User, Calendar, Home, Lock, Facebook, Instagram, Youtube, MessageCircle, Info, GraduationCap, Menu, X } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenLogin, configSede }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const numeroWhatsApp = configSede?.telefone ? configSede.telefone.replace(/\D/g, '') : '';

  const handleNavClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false); // Fecha o menu mobile ao clicar
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
            {configSede?.facebook && (
              <a href={configSede.facebook} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-zinc-400 hover:text-[#1877F2] transition-all">
                <Facebook size={18} />
              </a>
            )}
            {configSede?.instagram && (
              <a href={configSede.instagram} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-zinc-400 hover:text-[#E4405F] transition-all">
                <Instagram size={18} />
              </a>
            )}
            {configSede?.youtube && (
              <a href={configSede.youtube} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-zinc-400 hover:text-[#FF0000] transition-all">
                <Youtube size={18} />
              </a>
            )}
            <a
              href={`https://wa.me/55${numeroWhatsApp || '84988880000'}?text=Olá,%20gostaria%20de%20mais%20informações!`}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-[#25D366] transition-all"
              title="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* BOTÃO HAMBÚRGUER (APENAS MOBILE) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-300 hover:text-white bg-zinc-900 rounded-lg border border-zinc-800"
          aria-label="Abrir Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* MENU DESKTOP (DISPLAYS EM TELAS MÉDIAS/GRANDES) */}
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

      {/* MENU MOBILE DROPDOWN (GAVETA EXPANSÍVEL NO CELULAR) */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
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
