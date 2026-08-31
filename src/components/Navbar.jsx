import React, { useState, useEffect } from 'react';
import { User, Calendar, Home, Lock, Facebook, Instagram, Youtube, MessageCircle, Info, GraduationCap, Trophy, Menu, X, ChevronRight } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onOpenLogin, configSede }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Trava o scroll da página de fundo enquanto o menu mobile estiver aberto,
  // evitando que o usuário role o conteúdo por trás do overlay sem perceber.
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Tratamento do número do WhatsApp
  const apenasNumeros = configSede?.telefone ? configSede.telefone.replace(/\D/g, '') : '';
  const numeroValido = apenasNumeros.length >= 10 ? apenasNumeros : '84994511117';
  const urlWhatsapp = `https://api.whatsapp.com/send?phone=55${numeroValido}&text=Olá,%20gostaria%20de%20mais%20informações%20sobre%20o%20projeto%20Nagashima!`;

  const handleNavClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-zinc-950/95 backdrop-blur-md border-b border-zinc-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* LADO ESQUERDO: BOTÃO MENU NO MOBILE / REDES SOCIAIS NO PC */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-zinc-100 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-all flex items-center gap-2"
              aria-label="Abrir Menu"
            >
              <Menu size={20} className="text-red-500" />
              <span className="text-xs font-extrabold uppercase tracking-wider">Menu</span>
            </button>

            {/* REDES SOCIAIS (Exibe ícones sempre, com link ativo ou estado opaco se não cadastrado) */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-400">
              <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-500 mr-1">Redes:</span>
              
              {configSede?.facebook ? (
                <a href={configSede.facebook} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-zinc-400 hover:text-[#1877F2] hover:bg-zinc-900 transition-all">
                  <Facebook size={18} />
                </a>
              ) : (
                <span className="p-1.5 text-zinc-700 opacity-40 cursor-not-allowed" title="Facebook não cadastrado">
                  <Facebook size={18} />
                </span>
              )}

              {configSede?.instagram ? (
                <a href={configSede.instagram} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-zinc-400 hover:text-[#E4405F] hover:bg-zinc-900 transition-all">
                  <Instagram size={18} />
                </a>
              ) : (
                <span className="p-1.5 text-zinc-700 opacity-40 cursor-not-allowed" title="Instagram não cadastrado">
                  <Instagram size={18} />
                </span>
              )}

              {configSede?.youtube ? (
                <a href={configSede.youtube} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-zinc-400 hover:text-[#FF0000] hover:bg-zinc-900 transition-all">
                  <Youtube size={18} />
                </a>
              ) : (
                <span className="p-1.5 text-zinc-700 opacity-40 cursor-not-allowed" title="YouTube não cadastrado">
                  <Youtube size={18} />
                </span>
              )}

              <a href={urlWhatsapp} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-zinc-400 hover:text-[#25D366] hover:bg-zinc-900 transition-all">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* LADO DIREITO: NAVEGAÇÃO DESKTOP / BOTÃO ADMIN NO MOBILE */}
          <div className="flex items-center gap-2">
            <nav className="hidden lg:flex items-center gap-1.5">
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
                onClick={() => handleNavClick('conquistas')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
                  activePage === 'conquistas' ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Trophy size={14} /> Conquistas
              </button>
            </nav>

            <button
              onClick={onOpenLogin}
              className="p-2 text-zinc-300 hover:text-white bg-zinc-900 lg:bg-transparent rounded-xl border border-zinc-800 lg:border-none transition-all"
              title="Acesso Admin"
            >
              <Lock size={16} />
            </button>
          </div>

        </div>
      </header>

      {/* PAINEL LATERAL DESLIZANTE PARA CELULAR */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setMobileMenuOpen(false)} />

          <div className="relative w-4/5 max-w-sm bg-zinc-950 border-r border-zinc-800 h-full p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="font-black text-red-600 text-base uppercase tracking-wider" style={{ fontFamily: "'Shojumaru', cursive, serif" }}>
                    NAGASHIMA
                  </h2>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Navegação do Dojo</p>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-xl">
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-black uppercase transition-all ${
                    activePage === 'home' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-900/80 text-zinc-200 border border-zinc-800/80'
                  }`}
                >
                  <span className="flex items-center gap-3"><Home size={18} /> Início</span>
                  <ChevronRight size={16} className="opacity-60" />
                </button>

                <button
                  onClick={() => handleNavClick('quemSomos')}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-black uppercase transition-all ${
                    activePage === 'quemSomos' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-900/80 text-zinc-200 border border-zinc-800/80'
                  }`}
                >
                  <span className="flex items-center gap-3"><Info size={18} /> Quem Somos</span>
                  <ChevronRight size={16} className="opacity-60" />
                </button>

                <button
                  onClick={() => handleNavClick('atletas')}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-black uppercase transition-all ${
                    activePage === 'atletas' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-900/80 text-zinc-200 border border-zinc-800/80'
                  }`}
                >
                  <span className="flex items-center gap-3"><User size={18} /> Atletas</span>
                  <ChevronRight size={16} className="opacity-60" />
                </button>

                <button
                  onClick={() => handleNavClick('eventos')}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-black uppercase transition-all ${
                    activePage === 'eventos' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-900/80 text-zinc-200 border border-zinc-800/80'
                  }`}
                >
                  <span className="flex items-center gap-3"><Calendar size={18} /> Eventos</span>
                  <ChevronRight size={16} className="opacity-60" />
                </button>

                <button
                  onClick={() => handleNavClick('exames')}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-black uppercase transition-all ${
                    activePage === 'exames' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-900/80 text-zinc-200 border border-zinc-800/80'
                  }`}
                >
                  <span className="flex items-center gap-3"><GraduationCap size={18} /> Exames de Faixa</span>
                  <ChevronRight size={16} className="opacity-60" />
                </button>

                <button
                  onClick={() => handleNavClick('conquistas')}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-black uppercase transition-all ${
                    activePage === 'conquistas' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-900/80 text-zinc-200 border border-zinc-800/80'
                  }`}
                >
                  <span className="flex items-center gap-3"><Trophy size={18} /> Conquistas</span>
                  <ChevronRight size={16} className="opacity-60" />
                </button>
              </nav>
            </div>

            <div className="pt-6 border-t border-zinc-800 space-y-4">
              <button
                onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-xs font-extrabold uppercase bg-zinc-900 text-zinc-300 border border-zinc-800"
              >
                <Lock size={16} className="text-red-500" /> Painel Administrativo
              </button>

              {/* REDES SOCIAIS DENTRO DO MENU MOBILE */}
              <div className="flex items-center justify-center gap-3 pt-1">
                {configSede?.facebook ? (
                  <a href={configSede.facebook} target="_blank" rel="noreferrer" className="p-2.5 bg-zinc-900 rounded-xl text-zinc-400 hover:text-[#1877F2]">
                    <Facebook size={18} />
                  </a>
                ) : (
                  <span className="p-2.5 bg-zinc-900 rounded-xl text-zinc-700 opacity-40">
                    <Facebook size={18} />
                  </span>
                )}

                {configSede?.instagram ? (
                  <a href={configSede.instagram} target="_blank" rel="noreferrer" className="p-2.5 bg-zinc-900 rounded-xl text-zinc-400 hover:text-[#E4405F]">
                    <Instagram size={18} />
                  </a>
                ) : (
                  <span className="p-2.5 bg-zinc-900 rounded-xl text-zinc-700 opacity-40">
                    <Instagram size={18} />
                  </span>
                )}

                {configSede?.youtube ? (
                  <a href={configSede.youtube} target="_blank" rel="noreferrer" className="p-2.5 bg-zinc-900 rounded-xl text-zinc-400 hover:text-[#FF0000]">
                    <Youtube size={18} />
                  </a>
                ) : (
                  <span className="p-2.5 bg-zinc-900 rounded-xl text-zinc-700 opacity-40">
                    <Youtube size={18} />
                  </span>
                )}

                <a href={urlWhatsapp} target="_blank" rel="noreferrer" className="p-2.5 bg-zinc-900 rounded-xl text-zinc-400 hover:text-[#25D366]">
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
