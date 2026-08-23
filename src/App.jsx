import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AdminPanel, { formatarDataBR } from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import logoImg from './assets/logo.jpg';
import { User, MapPin, Clock, Calendar, Filter, Layers, AlertCircle } from 'lucide-react';

const FAIXAS_JUDO = [
  { nome: 'Faixa Branca', hex: '#FFFFFF', borda: '#CCCCCC' },
  { nome: 'Faixa Cinza', hex: '#9CA3AF', borda: '#6B7280' },
  { nome: 'Faixa Azul', hex: '#2563EB', borda: '#1D4ED8' },
  { nome: 'Faixa Amarela', hex: '#FACC15', borda: '#EAB308' },
  { nome: 'Faixa Laranja', hex: '#F97316', borda: '#EA580C' },
  { nome: 'Faixa Verde', hex: '#16A34A', borda: '#15803D' },
  { nome: 'Faixa Roxa', hex: '#9333EA', borda: '#7E22CE' },
  { nome: 'Faixa Marrom', hex: '#78350F', borda: '#451A03' },
  { nome: 'Faixa Preta (1º ao 5º Dan)', hex: '#121212', borda: '#3F3F46' },
  { nome: 'Faixa Coral (6º ao 8º Dan)', hex: 'coral', borda: '#DC2626' },
  { nome: 'Faixa Vermelha (9º e 10º Dan)', hex: '#DC2626', borda: '#991B1B' }
];

function ImagemFaixa({ nomeFaixa }) {
  const faixa = FAIXAS_JUDO.find(f => f.nome === nomeFaixa) || FAIXAS_JUDO[0];

  if (faixa.hex === 'coral') {
    return (
      <div className="flex items-center gap-2">
        <svg width="100" height="16" viewBox="0 0 100 16" fill="none" className="shadow rounded">
          <rect x="1" y="1" width="98" height="14" rx="2" fill="#DC2626" stroke="#991B1B" strokeWidth="1"/>
          <rect x="18" y="1" width="14" height="14" fill="#FFFFFF"/>
          <rect x="46" y="1" width="14" height="14" fill="#FFFFFF"/>
          <rect x="74" y="1" width="14" height="14" fill="#FFFFFF"/>
        </svg>
        <span className="text-[11px] font-bold text-white">{nomeFaixa}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <svg width="90" height="16" viewBox="0 0 90 16" fill="none" className="shadow rounded">
        <rect x="1" y="1" width="88" height="14" rx="2" fill={faixa.hex} stroke={faixa.borda} strokeWidth="1.5"/>
        <line x1="1" y1="8" x2="89" y2="8" stroke={faixa.hex === '#FFFFFF' ? '#999999' : '#FFFFFF'} strokeWidth="0.5" strokeDasharray="3 2" opacity="0.4"/>
      </svg>
      <span className="text-[11px] font-bold text-zinc-200">{nomeFaixa}</span>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [filtroFaixa, setFiltroFaixa] = useState('Todas');
  const [filtroIdade, setFiltroIdade] = useState('Todas');

  const [atletas, setAtletas] = useState(() => {
    const saved = localStorage.getItem('nagashima_atletas');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        nome: 'Pablo',
        idade: 22,
        peso: '75kg',
        graduacao: 'Faixa Preta (1º ao 5º Dan)',
        caracteristicas: 'Especialista em Harai Goshi e Seoi Nage. Excelente tempo de reação no kumi-kata.',
        titulos: 'Campeão Estadual 2025, Vice-campeão Brasileiro 2024',
        foto: '',
        fotoCorpo: '',
        medalhas: { ouro: 5, prata: 2, bronze: 1 }
      }
    ];
  });

  const [eventos, setEventos] = useState(() => {
    const saved = localStorage.getItem('nagashima_eventos');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        nome: 'Copa Nagashima de Artes Marciais',
        data: '2026-10-15',
        local: 'Ginásio Municipal',
        tipo: 'Campeonato Interno',
        categorias: 'Infantil, Juvenil e Adulto',
        graduacoesPermitidas: 'Todas as faixas',
        descricao: 'Torneio oficial para ranqueamento interno da academia.',
        observacoes: '',
        realizado: false
      }
    ];
  });

  const [configSede, setConfigSede] = useState(() => {
    const saved = localStorage.getItem('nagashima_sede');
    return saved ? JSON.parse(saved) : {
      endereco: 'R. Saturno, 102, 59106-220',
      bairroCidade: 'Igapó - Natal/RN',
      horarioJudo: 'Segundas, Quartas e Sextas: 19h00 às 20h30',
      horarioGeral: 'Terças e Quintas (Infantil): 18h00 às 19h00',
      facebook: '',
      instagram: '',
      youtube: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('nagashima_atletas', JSON.stringify(atletas));
  }, [atletas]);

  useEffect(() => {
    localStorage.setItem('nagashima_eventos', JSON.stringify(eventos));
  }, [eventos]);

  useEffect(() => {
    localStorage.setItem('nagashima_sede', JSON.stringify(configSede));
  }, [configSede]);

  const handleOpenLogin = () => {
    if (isAuthenticated) {
      setActivePage('admin');
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginOpen(false);
    setActivePage('admin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActivePage('home');
  };

  const faixasDisponiveis = FAIXAS_JUDO.filter(f => {
    const nomeBase = f.nome.split(' ')[1] || f.nome;
    return atletas.some(a => a.graduacao.toLowerCase().includes(nomeBase.toLowerCase()));
  });

  const atletasFiltrados = atletas.filter(a => {
    const atendeFaixa = filtroFaixa === 'Todas' || a.graduacao.toLowerCase().includes(filtroFaixa.toLowerCase());
    const idadeNum = Number(a.idade);
    let atendeIdade = true;

    if (filtroIdade === 'infantil') atendeIdade = idadeNum <= 12;
    if (filtroIdade === 'juvenil') atendeIdade = idadeNum >= 13 && idadeNum <= 17;
    if (filtroIdade === 'adulto') atendeIdade = idadeNum >= 18 && idadeNum <= 29;
    if (filtroIdade === 'master') atendeIdade = idadeNum >= 30;

    return atendeFaixa && atendeIdade;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col justify-between">
      <div>
        {/* Passando o configSede para conectar as redes sociais */}
        <Navbar 
          activePage={activePage} 
          setActivePage={setActivePage} 
          onOpenLogin={handleOpenLogin} 
          configSede={configSede}
        />

        <main className="max-w-7xl mx-auto px-4 py-6">
          {activePage === 'home' && (
            <div className="space-y-12">
              <section className="relative rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-red-950/40 border border-zinc-800 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden">
                <div className="max-w-2xl space-y-4 text-center md:text-left">
                  <span className="inline-block bg-red-600/20 text-red-500 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-red-600/30">
                    Tradição & Disciplina
                  </span>

                  <div className="space-y-1">
                    <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-wider" style={{ fontFamily: "'Shojumaru', 'Cinzel', serif" }}>
                      Associação Nagashima
                    </h1>
                    <p className="text-xs sm:text-sm font-semibold tracking-widest text-red-500 uppercase">
                      Artes Marciais, Esporte e Cultura
                    </p>
                  </div>

                  <h2 className="text-lg md:text-2xl font-bold uppercase tracking-tight text-zinc-200 pt-2">
                    Formando Campeões Dentro e Fora do Tatame
                  </h2>
                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                    Portal oficial da Associação Nagashima. Acompanhe o progresso dos nossos atletas, exames de faixa e próximos campeonatos.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                    <button 
                      onClick={() => setActivePage('atletas')}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg uppercase text-xs tracking-wider transition-all shadow-lg shadow-red-600/30"
                    >
                      Ver Atletas
                    </button>
                    <button 
                      onClick={() => setActivePage('eventos')}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-3 rounded-lg uppercase text-xs tracking-wider transition-all border border-zinc-700"
                    >
                      Próximos Eventos
                    </button>
                  </div>
                </div>

                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-red-600 bg-white p-2 shadow-2xl flex-shrink-0">
                  <img 
                    src={logoImg} 
                    alt="Logo Nagashima" 
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-red-600/50 transition-colors space-y-2">
                  <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
                    🥋 Exames de Faixa
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Acompanhe as datas oficiais de graduação e evolução dos alunos do dojo.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-red-600/50 transition-colors space-y-2">
                  <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
                    🏆 Quadro de Medalhas
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Histórico de conquistas estaduais e nacionais dos atletas cadastrados.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-red-600/50 transition-colors space-y-2">
                  <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
                    <MapPin size={18} className="text-red-500" /> Nossa Sede
                  </h3>
                  <p className="text-zinc-300 text-xs font-semibold">{configSede.endereco}</p>
                  <p className="text-zinc-400 text-xs">{configSede.bairroCidade}</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-red-600/50 transition-colors space-y-2">
                  <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
                    <Clock size={18} className="text-red-500" /> Horários de Treino
                  </h3>
                  <p className="text-zinc-300 text-xs font-semibold">{configSede.horarioJudo}</p>
                  <p className="text-zinc-400 text-xs">{configSede.horarioGeral}</p>
                </div>
              </section>
            </div>
          )}

          {activePage === 'admin' && isAuthenticated && (
            <AdminPanel 
              onLogout={handleLogout} 
              atletas={atletas} 
              setAtletas={setAtletas} 
              eventos={eventos} 
              setEventos={setEventos}
              configSede={configSede}
              setConfigSede={setConfigSede}
            />
          )}

          {/* ABA PÚBLICA DE ATLETAS */}
          {activePage === 'atletas' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <User className="text-red-500" /> Atletas Cadastrados na Associação
                </h2>
                <span className="text-xs text-zinc-500">Passe o mouse no card para ver o perfil expandido</span>
              </div>

              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex flex-wrap items-center justify-start gap-6 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-1.5">
                    <Layers size={14} className="text-red-500" /> Faixa:
                  </span>
                  
                  <select 
                    value={filtroFaixa} 
                    onChange={e => setFiltroFaixa(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-white text-xs font-semibold rounded-lg p-2 focus:border-red-600 outline-none shadow-inner"
                  >
                    <option value="Todas">Todas as Faixas ({atletas.length})</option>
                    {faixasDisponiveis.map(f => {
                      const nomeCurto = f.nome.split(' ')[1] || f.nome;
                      const totalNaFaixa = atletas.filter(a => a.graduacao.toLowerCase().includes(nomeCurto.toLowerCase())).length;
                      return (
                        <option key={f.nome} value={nomeCurto}>
                          {nomeCurto} ({totalNaFaixa})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-1.5">
                    <Filter size={14} className="text-red-500" /> Categoria:
                  </span>
                  
                  <select 
                    value={filtroIdade} 
                    onChange={e => setFiltroIdade(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-white text-xs font-semibold rounded-lg p-2 focus:border-red-600 outline-none shadow-inner"
                  >
                    <option value="Todas">Todas as Categorias</option>
                    <option value="infantil">Infantil (até 12 anos)</option>
                    <option value="juvenil">Juvenil (13 a 17 anos)</option>
                    <option value="adulto">Adulto (18 a 29 anos)</option>
                    <option value="master">Master (30+ anos)</option>
                  </select>
                </div>
              </div>

              {atletasFiltrados.length === 0 ? (
                <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 text-sm">
                  Nenhum atleta encontrado para os filtros selecionados.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {atletasFiltrados.map(a => (
                    <div 
                      key={a.id} 
                      className="group bg-zinc-900 border border-zinc-800 hover:border-red-600 rounded-2xl p-6 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-600/10 cursor-pointer overflow-hidden"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {a.foto ? (
                            <img 
                              src={a.foto} 
                              alt={a.nome} 
                              className="w-16 h-16 rounded-full object-cover border-2 border-red-600 group-hover:scale-105 transition-transform shadow-md" 
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center font-bold text-lg text-white">
                              {a.nome.substring(0, 2).toUpperCase()}
                            </div>
                          )}

                          <div className="space-y-1">
                            <h3 className="font-extrabold text-lg text-white group-hover:text-red-500 transition-colors">
                              {a.nome}
                            </h3>
                            <ImagemFaixa nomeFaixa={a.graduacao} />
                            <p className="text-xs text-zinc-400 font-medium pt-0.5">
                              {a.idade} anos • {a.peso}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-extrabold bg-zinc-950/60 px-3 py-1.5 rounded-lg border border-zinc-800">
                          <span className="text-yellow-500">🥇 {a.medalhas?.ouro || 0}</span>
                          <span className="text-zinc-300">🥈 {a.medalhas?.prata || 0}</span>
                          <span className="text-amber-600">🥉 {a.medalhas?.bronze || 0}</span>
                        </div>
                      </div>

                      <div className="mt-3 border-t border-zinc-800/80 pt-3 text-xs text-zinc-300">
                        <strong className="text-red-500 font-bold">Conquistas:</strong> {a.titulos || 'Atleta em formação'}
                      </div>

                      <div className="max-h-0 opacity-0 group-hover:max-h-[500px] group-hover:opacity-100 transition-all duration-500 ease-in-out border-t border-red-600/40 mt-4 pt-4 text-xs">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                          <div className="space-y-3 flex-1 text-left">
                            <div>
                              <strong className="text-red-500 uppercase font-bold tracking-wider block mb-1">
                                🎯 Estilo de Luta & Características:
                              </strong>
                              <p className="text-zinc-300 leading-relaxed text-xs">
                                {a.caracteristicas || 'Nenhuma observação técnica cadastrada.'}
                              </p>
                            </div>

                            <div>
                              <strong className="text-red-500 uppercase font-bold tracking-wider block mb-1">
                                📜 Títulos & Conquistas:
                              </strong>
                              <p className="text-zinc-300 leading-relaxed text-xs">
                                {a.titulos || 'Atleta cadastrado na associação.'}
                              </p>
                            </div>
                          </div>

                          {a.fotoCorpo ? (
                            <div className="w-full sm:w-48 h-64 rounded-xl overflow-hidden border-2 border-red-600/80 shadow-2xl flex-shrink-0 bg-zinc-950">
                              <img src={a.fotoCorpo} alt={`Perfil em pé ${a.nome}`} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-full sm:w-48 h-64 rounded-xl border border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600 text-center p-3 flex-shrink-0">
                              <User size={24} className="opacity-40 mb-1" />
                              <span className="text-[10px]">Sem foto em pé</span>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ABA PÚBLICA DE EVENTOS */}
          {activePage === 'eventos' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase text-white tracking-wider flex items-center gap-2">
                <Calendar className="text-red-500" /> Calendário de Eventos & Torneios
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {eventos.map(e => (
                  <div key={e.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3 shadow-xl hover:border-red-600/50 transition-colors">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-bold text-lg text-white">{e.nome}</h3>
                        <p className="text-xs text-zinc-400 mt-1">📍 <strong>Local:</strong> {e.local}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {e.realizado ? (
                          <span className="bg-red-950/90 text-red-400 border border-red-800/80 text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-sm">
                            EVENTO ENCERRADO
                          </span>
                        ) : (
                          <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-800/80 text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-sm animate-pulse">
                            📅 {formatarDataBR(e.data)}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300">🥋 <strong>Categorias:</strong> {e.categorias}</p>
                    <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800 pt-3">{e.descricao}</p>

                    {e.observacoes && (
                      <div className="mt-2 p-3 bg-yellow-950/40 border border-yellow-600/50 rounded-lg text-yellow-300 text-xs flex items-start gap-2 shadow-inner">
                        <AlertCircle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold uppercase text-[11px] text-yellow-400">Observação Importante:</strong>
                          <span>{e.observacoes}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />

      <Footer />
    </div>
  );
}