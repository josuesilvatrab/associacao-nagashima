import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AdminPanel, { formatarDataBR } from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import logoImg from './assets/logo.jpg';
import { User, MapPin, Clock, Calendar, Filter, Layers, AlertCircle, ChevronDown, ChevronUp, Search, Bell, ExternalLink, Award, GraduationCap, Trophy, Info, ArrowLeft, Phone } from 'lucide-react';
import { db } from './firebase';
import { collection, onSnapshot, doc } from 'firebase/firestore';

const AVATAR_PADRAO = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

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

function BotaoVoltar({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white px-4 py-2 rounded-xl text-xs font-extrabold uppercase border border-zinc-800 transition-all mb-4 shadow-md group cursor-pointer"
    >
      <ArrowLeft size={16} className="text-red-500 group-hover:-translate-x-1 transition-transform" /> Voltar ao Início
    </button>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [buscaNome, setBuscaNome] = useState('');
  const [filtroFaixa, setFiltroFaixa] = useState('Todas');
  const [filtroIdade, setFiltroIdade] = useState('Todas');
  const [atletaExpandido, setAtletaExpandido] = useState(null);

  const [atletas, setAtletas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [avisos, setAvisos] = useState([]);
  const [apoiadores, setApoiadores] = useState([]);
  const [exames, setExames] = useState([]);
  const [quemSomos, setQuemSomos] = useState({ historia: '', missao: '', visao: '', valores: '' });

  const [configSede, setConfigSede] = useState({
    bannerTag: 'Tradição & Disciplina',
    bannerTitulo: 'Associação Nagashima',
    bannerSlogan: 'Artes Marciais, Esporte e Cultura',
    bannerSubtitulo: 'Formando Campeões Dentro e Fora do Tatame',
    bannerDescricao: 'Portal oficial da Associação Nagashima. Acompanhe o progresso dos nossos atletas, exames de faixa e próximos campeonatos.',
    bannerLogo: '',
    endereco: 'R. Saturno, 102, 59106-220',
    bairroCidade: 'Igapó - Natal/RN',
    horarioJudo: 'Segundas, Quartas e Sextas: 19h00 às 20h30',
    horarioGeral: 'Terças e Quintas (Infantil): 18h00 às 19h00',
    telefone: '', email: '', facebook: '', instagram: '', youtube: ''
  });

  useEffect(() => {
    const unsubAtletas = onSnapshot(collection(db, "atletas"), (snapshot) => {
      setAtletas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubEventos = onSnapshot(collection(db, "eventos"), (snapshot) => {
      setEventos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubAvisos = onSnapshot(collection(db, "avisos"), (snapshot) => {
      setAvisos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubApoiadores = onSnapshot(collection(db, "apoiadores"), (snapshot) => {
      setApoiadores(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubExames = onSnapshot(collection(db, "exames"), (snapshot) => {
      setExames(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubQuemSomos = onSnapshot(doc(db, "configuracoes", "quemSomos"), (docSnap) => {
      if (docSnap.exists()) setQuemSomos(docSnap.data());
    });

    const unsubSede = onSnapshot(doc(db, "configuracoes", "sede"), (snapshotDoc) => {
      if (snapshotDoc.exists()) setConfigSede(snapshotDoc.data());
    });

    return () => {
      unsubAtletas(); unsubEventos(); unsubAvisos(); unsubApoiadores();
      unsubExames(); unsubQuemSomos(); unsubSede();
    };
  }, []);

  const handleOpenLogin = () => {
    if (isAuthenticated) setActivePage('admin');
    else setIsLoginOpen(true);
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

  const toggleExpandirAtleta = (id) => {
    setAtletaExpandido(atletaExpandido === id ? null : id);
  };

  const faixasDisponiveis = FAIXAS_JUDO.filter(f => {
    const nomeBase = f.nome.split(' ')[1] || f.nome;
    return atletas.some(a => a.graduacao?.toLowerCase().includes(nomeBase.toLowerCase()));
  });

  const atletasFiltrados = atletas.filter(a => {
    const atendeNome = buscaNome.trim() === '' || a.nome?.toLowerCase().includes(buscaNome.toLowerCase());
    const atendeFaixa = filtroFaixa === 'Todas' || a.graduacao?.toLowerCase().includes(filtroFaixa.toLowerCase());
    const idadeNum = Number(a.idade);
    let atendeIdade = true;

    if (filtroIdade === 'infantil') atendeIdade = idadeNum <= 12;
    if (filtroIdade === 'juvenil') atendeIdade = idadeNum >= 13 && idadeNum <= 17;
    if (filtroIdade === 'adulto') atendeIdade = idadeNum >= 18 && idadeNum <= 29;
    if (filtroIdade === 'master') atendeIdade = idadeNum >= 30;

    return atendeNome && atendeFaixa && atendeIdade;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col justify-between">
      <div>
        <Navbar 
          activePage={activePage} 
          setActivePage={setActivePage} 
          onOpenLogin={handleOpenLogin} 
          configSede={configSede}
        />

        <main className="max-w-7xl mx-auto px-4 py-6">
          {activePage === 'home' && (
            <div className="space-y-12">
              <section className="relative rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-red-950/40 border border-zinc-800 p-6 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden">
                <div className="max-w-2xl space-y-4 text-center md:text-left">
                  <span className="inline-block bg-red-600/20 text-red-500 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-red-600/30">
                    {configSede.bannerTag || 'Tradição & Disciplina'}
                  </span>

                  <div className="space-y-1">
                    <h1 className="text-2xl sm:text-5xl font-black uppercase text-white tracking-wider" style={{ fontFamily: "'Shojumaru', cursive, serif" }}>
                      {configSede.bannerTitulo || 'Associação Nagashima'}
                    </h1>
                    <p className="text-xs sm:text-sm font-semibold tracking-widest text-red-500 uppercase">
                      {configSede.bannerSlogan || 'Artes Marciais, Esporte e Cultura'}
                    </p>
                  </div>

                  <h2 className="text-base sm:text-2xl font-bold uppercase tracking-tight text-zinc-200 pt-2">
                    {configSede.bannerSubtitulo || 'Formando Campeões Dentro e Fora do Tatame'}
                  </h2>
                  <p className="text-zinc-400 text-xs sm:text-base leading-relaxed">
                    {configSede.bannerDescricao || 'Portal oficial da Associação Nagashima. Acompanhe o progresso dos nossos atletas, exames de faixa e próximos campeonatos.'}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                    <button onClick={() => setActivePage('atletas')} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg uppercase text-xs tracking-wider transition-all shadow-lg shadow-red-600/30 w-full sm:w-auto">
                      Ver Atletas
                    </button>
                    <button onClick={() => setActivePage('eventos')} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-3 rounded-lg uppercase text-xs tracking-wider transition-all border border-zinc-700 w-full sm:w-auto">
                      Próximos Eventos
                    </button>
                  </div>
                </div>

                <div className="w-36 h-36 sm:w-64 sm:h-64 rounded-full border-4 border-red-600 bg-white p-2 shadow-2xl flex-shrink-0">
                  <img src={configSede.bannerLogo || logoImg} alt="Logo Banner" className="w-full h-full object-contain rounded-full" />
                </div>
              </section>

              {avisos.length > 0 && (
                <section className="bg-zinc-900 border border-red-600/30 rounded-2xl p-6 shadow-xl space-y-4">
                  <h2 className="text-sm font-black uppercase text-red-500 tracking-wider flex items-center gap-2">
                    <Bell size={18} /> Comunicados Importantes do Dojo
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {avisos.map(a => (
                      <div key={a.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-1">
                        <h3 className="font-bold text-white text-sm">{a.titulo}</h3>
                        <p className="text-xs text-zinc-300 leading-relaxed">{a.conteudo}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* CARDS RÁPIDOS DA HOME */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div onClick={() => setActivePage('quemSomos')} className="bg-zinc-900 border border-zinc-800 hover:border-red-600 p-5 rounded-xl space-y-2 cursor-pointer transition-all group">
                  <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 group-hover:text-red-500 transition-colors">
                    <Info size={18} className="text-red-500" /> Quem Somos
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Conheça a história, visão e valores da Associação Nagashima.
                  </p>
                </div>

                <div onClick={() => setActivePage('exames')} className="bg-zinc-900 border border-zinc-800 hover:border-red-600 p-5 rounded-xl space-y-2 cursor-pointer transition-all group">
                  <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 group-hover:text-red-500 transition-colors">
                    🥋 Exames de Faixa
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Datas oficiais de graduação e evolução dos alunos do dojo.
                  </p>
                </div>

                <div onClick={() => setActivePage('conquistas')} className="bg-zinc-900 border border-zinc-800 hover:border-red-600 p-5 rounded-xl space-y-2 cursor-pointer transition-all group">
                  <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2 group-hover:text-red-500 transition-colors">
                    🏆 Quadro de Medalhas
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Histórico de conquistas estaduais e nacionais dos atletas.
                  </p>
                </div>

                <a href="https://maps.google.com/?q=R.+Saturno,+102,+Igapo,+Natal+RN" target="_blank" rel="noopener noreferrer" className="bg-zinc-900 border border-zinc-800 hover:border-red-600 p-5 rounded-xl space-y-2 cursor-pointer transition-all group block">
                  <h3 className="text-sm font-bold text-white uppercase flex items-center justify-between group-hover:text-red-500 transition-colors">
                    <span className="flex items-center gap-2"><MapPin size={18} className="text-red-500" /> Nossa Sede</span>
                    <ExternalLink size={14} className="text-zinc-500" />
                  </h3>
                  <p className="text-zinc-300 text-xs font-semibold hover:underline">{configSede.endereco}</p>
                  <p className="text-zinc-400 text-xs">{configSede.bairroCidade}</p>
                </a>

                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl space-y-2">
                  <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                    <Clock size={18} className="text-red-500" /> Horários
                  </h3>
                  <p className="text-zinc-300 text-xs font-semibold">{configSede.horarioJudo}</p>
                </div>
              </section>

              {/* SEÇÃO DE PATROCINADORES OFICIAIS */}
              <section className="pt-6 border-t border-zinc-900 space-y-6">
                <div className="text-center space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-red-600 tracking-wider">
                    PATROCINADORES OFICIAIS
                  </h2>
                  <p className="text-xs text-zinc-400">Apoiadores oficiais da Associação Nagashima</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {apoiadores.map(ap => (
                    <a key={ap.id} href={ap.siteUrl || ap.mapsUrl || '#'} target="_blank" rel="noopener noreferrer" className="bg-zinc-900 border border-zinc-800 hover:border-red-600/80 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-xl">
                      <div className="h-20 flex items-center justify-center w-full mb-4">
                        {ap.logoUrl ? <img src={ap.logoUrl} alt={ap.nome} className="max-h-full max-w-full object-contain" /> : <span className="font-extrabold text-base text-zinc-500 uppercase">{ap.nome}</span>}
                      </div>

                      <div className="border-t border-zinc-800/80 pt-3 w-full text-left space-y-2">
                        <h3 className="font-extrabold text-sm text-red-500 group-hover:text-red-400 transition-colors flex items-center justify-between">
                          {ap.nome}
                          {(ap.siteUrl || ap.mapsUrl) && <ExternalLink size={12} className="text-zinc-500 group-hover:text-red-400" />}
                        </h3>
                        {ap.descricao && <p className="text-xs text-zinc-300 leading-relaxed">{ap.descricao}</p>}
                        {ap.celular && (
                          <p className="text-[11px] text-zinc-400 flex items-center gap-1.5 pt-1">
                            <Phone size={12} className="text-red-500 flex-shrink-0" />
                            <span>{ap.celular}</span>
                          </p>
                        )}
                        {ap.endereco && (
                          <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                            <MapPin size={12} className="text-red-500 flex-shrink-0" />
                            <span>{ap.endereco}</span>
                          </p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* PÁGINA PÚBLICA QUEM SOMOS */}
          {activePage === 'quemSomos' && (
            <div className="max-w-4xl mx-auto space-y-6 py-2">
              <BotaoVoltar onClick={() => setActivePage('home')} />

              <h2 className="text-2xl font-black uppercase text-white tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-3">
                <Info className="text-red-500" /> Quem Somos - Associação Nagashima
              </h2>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div>
                  <h3 className="font-extrabold text-red-500 uppercase text-sm mb-2">Nossa História & Filosofia</h3>
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {quemSomos.historia || 'Conteúdo em atualização pelo painel administrativo.'}
                  </p>
                </div>

                {quemSomos.missao && (
                  <div className="border-t border-zinc-800/80 pt-4">
                    <h3 className="font-extrabold text-red-500 uppercase text-xs mb-1">Missão</h3>
                    <p className="text-zinc-300 text-xs sm:text-sm">{quemSomos.missao}</p>
                  </div>
                )}

                {quemSomos.visao && (
                  <div className="border-t border-zinc-800/80 pt-4">
                    <h3 className="font-extrabold text-red-500 uppercase text-xs mb-1">Visão</h3>
                    <p className="text-zinc-300 text-xs sm:text-sm">{quemSomos.visao}</p>
                  </div>
                )}

                {quemSomos.valores && (
                  <div className="border-t border-zinc-800/80 pt-4">
                    <h3 className="font-extrabold text-red-500 uppercase text-xs mb-1">Valores</h3>
                    <p className="text-zinc-300 text-xs sm:text-sm">{quemSomos.valores}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activePage === 'admin' && isAuthenticated && (
            <div className="space-y-4">
              <BotaoVoltar onClick={() => setActivePage('home')} />
              <AdminPanel onLogout={handleLogout} atletas={atletas} setAtletas={setAtletas} eventos={eventos} setEventos={setEventos} avisos={avisos} configSede={configSede} setConfigSede={setConfigSede} />
            </div>
          )}

          {activePage === 'atletas' && (
            <div className="space-y-6">
              <BotaoVoltar onClick={() => setActivePage('home')} />

              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <User className="text-red-500" /> Atletas Cadastrados na Associação
                </h2>
                <span className="text-xs text-zinc-500">Toque no card para expandir o perfil</span>
              </div>

              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row flex-wrap items-stretch md:items-center justify-between gap-4 shadow-lg">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={16} className="absolute left-3 top-3 text-zinc-500" />
                  <input type="text" placeholder="Pesquisar atleta por nome..." value={buscaNome} onChange={e => setBuscaNome(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:border-red-600 outline-none" />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center justify-between sm:justify-start gap-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-1.5"><Layers size={14} className="text-red-500" /> Faixa:</span>
                    <select value={filtroFaixa} onChange={e => setFiltroFaixa(e.target.value)} className="bg-zinc-950 border border-zinc-800 text-white text-xs font-semibold rounded-lg p-2 focus:border-red-600 outline-none w-full sm:w-auto">
                      <option value="Todas">Todas ({atletas.length})</option>
                      {faixasDisponiveis.map(f => {
                        const nomeCurto = f.nome.split(' ')[1] || f.nome;
                        const totalNaFaixa = atletas.filter(a => a.graduacao?.toLowerCase().includes(nomeCurto.toLowerCase())).length;
                        return <option key={f.nome} value={nomeCurto}>{nomeCurto} ({totalNaFaixa})</option>;
                      })}
                    </select>
                  </div>

                  <div className="flex items-center justify-between sm:justify-start gap-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-1.5"><Filter size={14} className="text-red-500" /> Categoria:</span>
                    <select value={filtroIdade} onChange={e => setFiltroIdade(e.target.value)} className="bg-zinc-950 border border-zinc-800 text-white text-xs font-semibold rounded-lg p-2 focus:border-red-600 outline-none w-full sm:w-auto">
                      <option value="Todas">Todas as Categorias</option>
                      <option value="infantil">Infantil (até 12 anos)</option>
                      <option value="juvenil">Juvenil (13 a 17 anos)</option>
                      <option value="adulto">Adulto (18 a 29 anos)</option>
                      <option value="master">Master (30+ anos)</option>
                    </select>
                  </div>
                </div>
              </div>

              {atletasFiltrados.length === 0 ? (
                <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 text-sm">
                  Nenhum atleta encontrado para os filtros selecionados.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  {atletasFiltrados.map(a => {
                    const isExpanded = atletaExpandido === a.id;
                    const fotoExibir = a.foto && a.foto.trim() !== '' ? a.foto : AVATAR_PADRAO;

                    return (
                      <div key={a.id} onClick={() => toggleExpandirAtleta(a.id)} className={`bg-zinc-900 border ${isExpanded ? 'border-red-600' : 'border-zinc-800'} rounded-2xl p-5 transition-all duration-300 shadow-xl cursor-pointer overflow-hidden`}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4 w-full sm:w-auto">
                            <img src={fotoExibir} alt={a.nome} className="w-16 h-16 rounded-full object-cover border-2 border-red-600 shadow-md flex-shrink-0" />
                            <div className="space-y-1">
                              <h3 className="font-extrabold text-lg text-white">{a.nome}</h3>
                              <ImagemFaixa nomeFaixa={a.graduacao} />
                              <p className="text-xs text-zinc-400 font-medium pt-0.5">{a.idade} anos • {a.peso}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                            <div className="flex items-center gap-2 text-xs font-extrabold bg-zinc-950/80 px-3 py-1.5 rounded-lg border border-zinc-800">
                              <span className="text-yellow-500">🥇 {a.medalhas?.ouro || 0}</span>
                              <span className="text-zinc-300">🥈 {a.medalhas?.prata || 0}</span>
                              <span className="text-amber-600">🥉 {a.medalhas?.bronze || 0}</span>
                            </div>
                            <button className="text-zinc-400 hover:text-white p-1">{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</button>
                          </div>
                        </div>

                        <div className="mt-3 border-t border-zinc-800/80 pt-3 text-xs text-zinc-300">
                          <strong className="text-red-500 font-bold">Conquistas:</strong> {a.titulos || 'Atleta em formação'}
                        </div>

                        {isExpanded && (
                          <div className="border-t border-red-600/40 mt-4 pt-4 text-xs">
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                              <div className="space-y-3 flex-1 text-left w-full">
                                <div>
                                  <strong className="text-red-500 uppercase font-bold tracking-wider block mb-1">🎯 Estilo de Luta e Tokui (Golpe Favorito):</strong>
                                  <p className="text-zinc-300 leading-relaxed text-xs">{a.caracteristicas || 'Nenhuma observação técnica cadastrada.'}</p>
                                </div>
                                <div>
                                  <strong className="text-red-500 uppercase font-bold tracking-wider block mb-1">📜 Títulos & Conquistas:</strong>
                                  <p className="text-zinc-300 leading-relaxed text-xs">{a.titulos || 'Atleta cadastrado na associação.'}</p>
                                </div>
                              </div>
                              {a.fotoCorpo ? (
                                <div className="w-full sm:w-48 h-64 rounded-xl overflow-hidden border-2 border-red-600/80 shadow-2xl flex-shrink-0 bg-zinc-950">
                                  <img src={a.fotoCorpo} alt={`Perfil em pé ${a.nome}`} className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="w-full sm:w-48 h-36 rounded-xl border border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600 text-center p-3 flex-shrink-0">
                                  <User size={24} className="opacity-40 mb-1" />
                                  <span className="text-[10px]">Sem foto em pé</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activePage === 'eventos' && (
            <div className="space-y-6">
              <BotaoVoltar onClick={() => setActivePage('home')} />

              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wider flex items-center gap-2">
                <Calendar className="text-red-500" /> Calendário de Eventos & Torneios
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {eventos.map(e => (
                  <div key={e.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 space-y-3 shadow-xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-white">{e.nome}</h3>
                        <p className="text-xs text-zinc-400 mt-1">📍 <strong>Local:</strong> {e.local}</p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-1 flex-shrink-0">
                        {e.realizado ? <span className="bg-red-950/90 text-red-400 border border-red-800/80 text-[10px] sm:text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-sm">EVENTO ENCERRADO</span> : <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-800/80 text-[10px] sm:text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-sm">📅 {formatarDataBR(e.data)}</span>}
                        {e.participaremos !== false ? <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-800/80 text-[9px] sm:text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm">✅ Iremos Participar</span> : <span className="bg-red-950/90 text-red-400 border border-red-800/80 text-[9px] sm:text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm">❌ Não Participaremos</span>}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300">🥋 <strong>Categorias:</strong> {e.categorias}</p>
                    <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800 pt-3">{e.descricao}</p>
                    {e.observacoes && (
                      <div className="mt-2 p-3 bg-yellow-950/40 border border-yellow-600/50 rounded-lg text-yellow-300 text-xs flex items-start gap-2 shadow-inner">
                        <AlertCircle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div><strong className="block font-bold uppercase text-[11px] text-yellow-400">Observação Importante:</strong><span>{e.observacoes}</span></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PÁGINA DE CONQUISTAS */}
          {activePage === 'conquistas' && (() => {
            const totalOuro = atletas.reduce((acc, a) => acc + (Number(a.medalhas?.ouro) || 0), 0);
            const totalPrata = atletas.reduce((acc, a) => acc + (Number(a.medalhas?.prata) || 0), 0);
            const totalBronze = atletas.reduce((acc, a) => acc + (Number(a.medalhas?.bronze) || 0), 0);
            const totalGeral = totalOuro + totalPrata + totalBronze;

            return (
              <div className="space-y-6">
                <BotaoVoltar onClick={() => setActivePage('home')} />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-800 pb-4 gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wider flex items-center gap-2">
                      <Award className="text-red-500" /> Quadro de Medalhas & Conquistas
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">Estatísticas acumuladas dos atletas da Associação Nagashima</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 px-5 py-2.5 rounded-xl text-right">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase block">Total Geral</span>
                    <span className="text-lg font-black text-amber-500">🏆 {totalGeral} Medalhas</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between shadow-xl">
                    <div><span className="text-xs font-bold text-zinc-400 uppercase block">Medalhas de Ouro</span><span className="text-3xl font-black text-yellow-500 mt-1 block">{totalOuro}</span></div>
                    <span className="text-4xl">🥇</span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between shadow-xl">
                    <div><span className="text-xs font-bold text-zinc-400 uppercase block">Medalhas de Prata</span><span className="text-3xl font-black text-zinc-300 mt-1 block">{totalPrata}</span></div>
                    <span className="text-4xl">🥈</span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between shadow-xl">
                    <div><span className="text-xs font-bold text-zinc-400 uppercase block">Medalhas de Bronze</span><span className="text-3xl font-black text-amber-600 mt-1 block">{totalBronze}</span></div>
                    <span className="text-4xl">🥉</span>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="text-base font-extrabold uppercase text-white tracking-wider flex items-center gap-2">
                    <Trophy size={18} className="text-yellow-500" /> Top 5 Atletas em Destaque
                  </h3>
                  <div className="space-y-3">
                    {[...atletas].sort((a, b) => {
                      const totalA = (Number(a.medalhas?.ouro) || 0) + (Number(a.medalhas?.prata) || 0) + (Number(a.medalhas?.bronze) || 0);
                      const totalB = (Number(b.medalhas?.ouro) || 0) + (Number(b.medalhas?.prata) || 0) + (Number(b.medalhas?.bronze) || 0);
                      return totalB - totalA;
                    }).slice(0, 5).map((a, index) => {
                      const totalAtleta = (Number(a.medalhas?.ouro) || 0) + (Number(a.medalhas?.prata) || 0) + (Number(a.medalhas?.bronze) || 0);
                      return (
                        <div key={a.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-4 shadow-lg">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-black text-red-600">#{index + 1}</span>
                            <div>
                              <button onClick={() => setActivePage('atletas')} className="font-extrabold text-sm text-white hover:text-red-500 transition-colors text-left block">{a.nome}</button>
                              <span className="text-xs text-zinc-400">{a.graduacao}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold text-amber-500 text-xs sm:text-sm block">{totalAtleta} Medalhas</span>
                            <div className="text-[10px] font-bold text-zinc-400 flex items-center gap-2 mt-0.5">
                              <span>🥇 {a.medalhas?.ouro || 0}</span><span>🥈 {a.medalhas?.prata || 0}</span><span>🥉 {a.medalhas?.bronze || 0}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* PÁGINA DE EXAMES */}
          {activePage === 'exames' && (
            <div className="space-y-6">
              <BotaoVoltar onClick={() => setActivePage('home')} />

              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-3">
                <GraduationCap className="text-red-500" /> Exames de Faixa & Graduação
              </h2>
              <div className="space-y-6">
                {exames.map(ex => (
                  <div key={ex.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800/80 pb-3 gap-2">
                      <div>
                        <h3 className="font-extrabold text-base sm:text-lg text-white">Data do Exame: {formatarDataBR(ex.data)}</h3>
                        <p className="text-xs text-zinc-400 mt-1">
                          📍 <strong>Local:</strong> {ex.local}
                          {ex.mapsUrl && <a href={ex.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline ml-2 inline-flex items-center gap-1">(Abrir no Google Maps <ExternalLink size={10} />)</a>}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-zinc-300 uppercase">Graduações & Cobranças do Exame:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ex.graduacoes?.map((g, idx) => (
                          <div key={idx} className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl">
                            <p className="font-extrabold text-xs text-red-500">{g.faixa}</p>
                            <p className="text-xs text-zinc-400 mt-1">{g.cobranca}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {ex.gokyuImage && (
                      <div className="pt-3 border-t border-zinc-800/80">
                        <h4 className="text-xs font-bold text-zinc-300 uppercase mb-2">Tabela de Referência Go-Kyu:</h4>
                        <img src={ex.gokyuImage} alt="Gokyu Referencia" className="max-w-md w-full rounded-xl border border-zinc-800 shadow-lg" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLoginSuccess={handleLoginSuccess} />
      <Footer configSede={configSede} />
    </div>
  );
}
