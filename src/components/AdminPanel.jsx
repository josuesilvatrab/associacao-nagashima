import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, doc, deleteDoc, updateDoc, setDoc, getDocs } from 'firebase/firestore';
import { Settings, LogOut, Plus, Trash2, Edit2, MapPin, Clock, Share2, Phone, Mail, Bell, HeartHandshake, GraduationCap, Info, Layout, Image } from 'lucide-react';

export function formatarDataBR(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

export default function AdminPanel({ onLogout, atletas, eventos, avisos, configSede, setConfigSede }) {
  const [activeTab, setActiveTab] = useState('atletas');
  const [editandoId, setEditandoId] = useState(null);

  // Form Atleta
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [graduacao, setGraduacao] = useState('Faixa Branca');
  const [caracteristicas, setCaracteristicas] = useState('');
  const [titulos, setTitulos] = useState('');
  const [foto, setFoto] = useState('');
  const [fotoCorpo, setFotoCorpo] = useState('');
  const [ouro, setOuro] = useState(0);
  const [prata, setPrata] = useState(0);
  const [bronze, setBronze] = useState(0);

  // Form Evento
  const [nomeEvento, setNomeEvento] = useState('');
  const [dataEvento, setDataEvento] = useState('');
  const [localEvento, setLocalEvento] = useState('');
  const [tipoEvento, setTipoEvento] = useState('Campeonato Interno');
  const [categoriasEvento, setCategoriasEvento] = useState('');
  const [graduacoesEvento, setGraduacoesEvento] = useState('Todas as faixas');
  const [descricaoEvento, setDescricaoEvento] = useState('');
  const [observacoesEvento, setObservacoesEvento] = useState('');
  const [participaremosEvento, setParticiparemosEvento] = useState(true);
  const [editandoEventoId, setEditandoEventoId] = useState(null);

  // Form Aviso
  const [tituloAviso, setTituloAviso] = useState('');
  const [conteudoAviso, setConteudoAviso] = useState('');
  const [editandoAvisoId, setEditandoAvisoId] = useState(null);

  // Form Quem Somos
  const [formQuemSomos, setFormQuemSomos] = useState({
    historia: '',
    missao: '',
    visao: '',
    valores: ''
  });

  // Form Sede e Banner
  const [formSede, setFormSede] = useState(configSede || {
    bannerTag: 'Tradição & Disciplina',
    bannerTitulo: 'Associação Nagashima',
    bannerSlogan: 'Artes Marciais, Esporte e Cultura',
    bannerSubtitulo: 'Formando Campeões Dentro e Fora do Tatame',
    bannerDescricao: 'Portal oficial da Associação Nagashima. Acompanhe o progresso dos nossos atletas, exames de faixa e próximos campeonatos.',
    bannerLogo: '',
    endereco: '',
    bairroCidade: '',
    horarioJudo: '',
    horarioGeral: '',
    telefone: '',
    email: '',
    facebook: '',
    instagram: '',
    youtube: ''
  });

  // State Apoiadores
  const [apoiadores, setApoiadores] = useState([]);
  const [nomeApoiador, setNomeApoiador] = useState('');
  const [celularApoiador, setCelularApoiador] = useState('');
  const [enderecoApoiador, setEnderecoApoiador] = useState('');
  const [mapsApoiador, setMapsApoiador] = useState('');
  const [siteApoiador, setSiteApoiador] = useState('');
  const [logoApoiador, setLogoApoiador] = useState('');
  const [descricaoApoiador, setDescricaoApoiador] = useState('');
  const [editandoApoiadorId, setEditandoApoiadorId] = useState(null);

  // State Exames
  const [exames, setExames] = useState([]);
  const [dataExame, setDataExame] = useState('');
  const [localExame, setLocalExame] = useState('');
  const [mapsExame, setMapsExame] = useState('');
  const [gokyuImage, setGokyuImage] = useState('');
  const [graduacoesExame, setGraduacoesExame] = useState([{ faixa: '', cobranca: '' }]);
  const [editandoExameId, setEditandoExameId] = useState(null);

  const fetchApoiadores = async () => {
    try {
      const snap = await getDocs(collection(db, 'apoiadores'));
      setApoiadores(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (e) {}
  };

  const fetchExames = async () => {
    try {
      const snap = await getDocs(collection(db, 'exames'));
      setExames(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (e) {}
  };

  const fetchQuemSomos = async () => {
    try {
      const snap = await getDocs(collection(db, 'configuracoes'));
      const quemSomosDoc = snap.docs.find(d => d.id === 'quemSomos');
      if (quemSomosDoc) setFormQuemSomos(quemSomosDoc.data());
    } catch (e) {}
  };

  useEffect(() => {
    fetchApoiadores();
    fetchExames();
    fetchQuemSomos();
  }, []);

  const handleFileUpload = (e, setFotoFn) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoFn(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalvarAtleta = async (e) => {
    e.preventDefault();
    if (!nome) return alert('Por favor, informe o nome do atleta.');

    const dadosAtleta = {
      nome,
      idade: Number(idade) || 0,
      peso,
      graduacao,
      caracteristicas,
      titulos,
      foto,
      fotoCorpo,
      medalhas: {
        ouro: Number(ouro) || 0,
        prata: Number(prata) || 0,
        bronze: Number(bronze) || 0,
      }
    };

    try {
      if (editandoId) {
        await updateDoc(doc(db, 'atletas', editandoId), dadosAtleta);
        setEditandoId(null);
      } else {
        await addDoc(collection(db, 'atletas'), dadosAtleta);
      }
      limparFormAtleta();
    } catch (err) {
      alert('Erro ao salvar atleta no banco de dados.');
    }
  };

  const handleEditarAtleta = (a) => {
    setEditandoId(a.id);
    setNome(a.nome || '');
    setIdade(a.idade || '');
    setPeso(a.peso || '');
    setGraduacao(a.graduacao || 'Faixa Branca');
    setCaracteristicas(a.caracteristicas || '');
    setTitulos(a.titulos || '');
    setFoto(a.foto || '');
    setFotoCorpo(a.fotoCorpo || '');
    setOuro(a.medalhas?.ouro || 0);
    setPrata(a.medalhas?.prata || 0);
    setBronze(a.medalhas?.bronze || 0);
  };

  const limparFormAtleta = () => {
    setEditandoId(null);
    setNome('');
    setIdade('');
    setPeso('');
    setGraduacao('Faixa Branca');
    setCaracteristicas('');
    setTitulos('');
    setFoto('');
    setFotoCorpo('');
    setOuro(0);
    setPrata(0);
    setBronze(0);
  };

  const handleExcluirAtleta = async (id) => {
    if (confirm('Deseja realmente remover este atleta?')) {
      await deleteDoc(doc(db, 'atletas', id));
    }
  };

  const handleSalvarEvento = async (e) => {
    e.preventDefault();
    if (!nomeEvento || !dataEvento) return alert('Preencha o nome e a data do evento.');

    const dadosEvento = {
      nome: nomeEvento,
      data: dataEvento,
      local: localEvento,
      tipo: tipoEvento,
      categorias: categoriasEvento,
      graduacoesPermitidas: graduacoesEvento,
      descricao: descricaoEvento,
      observacoes: observacoesEvento,
      participaremos: participaremosEvento
    };

    try {
      if (editandoEventoId) {
        await updateDoc(doc(db, 'eventos', editandoEventoId), dadosEvento);
      } else {
        await addDoc(collection(db, 'eventos'), { ...dadosEvento, realizado: false });
      }
      limparFormEvento();
    } catch (err) {
      alert('Erro ao salvar evento.');
    }
  };

  const handleEditarEvento = (ev) => {
    setEditandoEventoId(ev.id);
    setNomeEvento(ev.nome || '');
    setDataEvento(ev.data || '');
    setLocalEvento(ev.local || '');
    setTipoEvento(ev.tipo || 'Campeonato Interno');
    setCategoriasEvento(ev.categorias || '');
    setGraduacoesEvento(ev.graduacoesPermitidas || 'Todas as faixas');
    setDescricaoEvento(ev.descricao || '');
    setObservacoesEvento(ev.observacoes || '');
    setParticiparemosEvento(ev.participaremos !== undefined ? ev.participaremos : true);
  };

  const limparFormEvento = () => {
    setEditandoEventoId(null);
    setNomeEvento('');
    setDataEvento('');
    setLocalEvento('');
    setCategoriasEvento('');
    setGraduacoesEvento('Todas as faixas');
    setDescricaoEvento('');
    setObservacoesEvento('');
    setParticiparemosEvento(true);
  };

  const handleExcluirEvento = async (id) => {
    if (confirm('Deseja realmente excluir este evento?')) {
      await deleteDoc(doc(db, 'eventos', id));
    }
  };

  const handleSalvarAviso = async (e) => {
    e.preventDefault();
    if (!tituloAviso || !conteudoAviso) return alert('Preencha o título e o conteúdo do aviso.');

    try {
      if (editandoAvisoId) {
        await updateDoc(doc(db, 'avisos', editandoAvisoId), {
          titulo: tituloAviso,
          conteudo: conteudoAviso
        });
      } else {
        await addDoc(collection(db, 'avisos'), {
          titulo: tituloAviso,
          conteudo: conteudoAviso,
          dataCriacao: new Date().toISOString()
        });
      }
      limparFormAviso();
    } catch (err) {
      alert('Erro ao salvar aviso.');
    }
  };

  const handleEditarAviso = (aviso) => {
    setEditandoAvisoId(aviso.id);
    setTituloAviso(aviso.titulo || '');
    setConteudoAviso(aviso.conteudo || '');
  };

  const limparFormAviso = () => {
    setEditandoAvisoId(null);
    setTituloAviso('');
    setConteudoAviso('');
  };

  const handleExcluirAviso = async (id) => {
    if (confirm('Deseja excluir este aviso?')) {
      await deleteDoc(doc(db, 'avisos', id));
    }
  };

  const handleSalvarSede = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'configuracoes', 'sede'), formSede);
      if (setConfigSede) setConfigSede(formSede);
      alert('Configurações de Sede, Banner, Logo, Contatos e Redes Sociais salvas com sucesso!');
    } catch (err) {
      alert('Erro ao salvar configurações.');
    }
  };

  const handleSalvarQuemSomos = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'configuracoes', 'quemSomos'), formQuemSomos);
      alert('Informações de "Quem Somos" salvas com sucesso!');
    } catch (err) {
      alert('Erro ao salvar informações de Quem Somos.');
    }
  };

  // Funções Apoiadores
  const handleSalvarApoiador = async (e) => {
    e.preventDefault();
    if (!nomeApoiador) return alert('Informe o nome do apoiador.');

    const dadosApoiador = {
      nome: nomeApoiador,
      celular: celularApoiador,
      endereco: enderecoApoiador,
      mapsUrl: mapsApoiador,
      siteUrl: siteApoiador,
      logoUrl: logoApoiador,
      descricao: descricaoApoiador
    };

    try {
      if (editandoApoiadorId) {
        await updateDoc(doc(db, 'apoiadores', editandoApoiadorId), dadosApoiador);
      } else {
        await addDoc(collection(db, 'apoiadores'), dadosApoiador);
      }
      limparFormApoiador();
      fetchApoiadores();
    } catch (err) {
      alert('Erro ao salvar apoiador.');
    }
  };

  const handleEditarApoiador = (ap) => {
    setEditandoApoiadorId(ap.id);
    setNomeApoiador(ap.nome || '');
    setCelularApoiador(ap.celular || '');
    setEnderecoApoiador(ap.endereco || '');
    setMapsApoiador(ap.mapsUrl || '');
    setSiteApoiador(ap.siteUrl || '');
    setLogoApoiador(ap.logoUrl || '');
    setDescricaoApoiador(ap.descricao || '');
  };

  const limparFormApoiador = () => {
    setEditandoApoiadorId(null);
    setNomeApoiador('');
    setCelularApoiador('');
    setEnderecoApoiador('');
    setMapsApoiador('');
    setSiteApoiador('');
    setLogoApoiador('');
    setDescricaoApoiador('');
  };

  const handleExcluirApoiador = async (id) => {
    if (confirm('Deseja realmente remover este apoiador?')) {
      await deleteDoc(doc(db, 'apoiadores', id));
      fetchApoiadores();
    }
  };

  // Funções Exames (Com Edição)
  const addGraduacaoExameField = () => {
    setGraduacoesExame([...graduacoesExame, { faixa: '', cobranca: '' }]);
  };

  const handleGraduacaoExameChange = (index, field, value) => {
    const newGrads = [...graduacoesExame];
    newGrads[index][field] = value;
    setGraduacoesExame(newGrads);
  };

  const handleSalvarExame = async (e) => {
    e.preventDefault();
    if (!dataExame || !localExame) return alert('Preencha a data e o local do exame.');

    const dadosExame = {
      data: dataExame,
      local: localExame,
      mapsUrl: mapsExame,
      gokyuImage,
      graduacoes: graduacoesExame
    };

    try {
      if (editandoExameId) {
        await updateDoc(doc(db, 'exames', editandoExameId), dadosExame);
      } else {
        await addDoc(collection(db, 'exames'), dadosExame);
      }
      limparFormExame();
      fetchExames();
    } catch (err) {
      alert('Erro ao salvar exame de faixa.');
    }
  };

  const handleEditarExame = (ex) => {
    setEditandoExameId(ex.id);
    setDataExame(ex.data || '');
    setLocalExame(ex.local || '');
    setMapsExame(ex.mapsUrl || '');
    setGokyuImage(ex.gokyuImage || '');
    setGraduacoesExame(ex.graduacoes && ex.graduacoes.length > 0 ? ex.graduacoes : [{ faixa: '', cobranca: '' }]);
  };

  const limparFormExame = () => {
    setEditandoExameId(null);
    setDataExame('');
    setLocalExame('');
    setMapsExame('');
    setGokyuImage('');
    setGraduacoesExame([{ faixa: '', cobranca: '' }]);
  };

  const handleExcluirExame = async (id) => {
    if (confirm('Deseja excluir este exame de faixa?')) {
      await deleteDoc(doc(db, 'exames', id));
      fetchExames();
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER PAINEL */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h1 className="text-xl font-black uppercase text-white tracking-wider flex items-center gap-2">
            <Settings className="text-red-500" /> Painel Administrativo
          </h1>
          <p className="text-xs text-zinc-400">Gerenciamento do portal da Associação Nagashima</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('atletas')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase transition-all ${activeTab === 'atletas' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
          >
            Atletas ({atletas.length})
          </button>
          <button
            onClick={() => setActiveTab('eventos')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase transition-all ${activeTab === 'eventos' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
          >
            Eventos ({eventos.length})
          </button>
          <button
            onClick={() => setActiveTab('apoiadores')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase transition-all ${activeTab === 'apoiadores' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
          >
            Apoiadores ({apoiadores.length})
          </button>
          <button
            onClick={() => setActiveTab('exames')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase transition-all ${activeTab === 'exames' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
          >
            Exames de Faixa ({exames.length})
          </button>
          <button
            onClick={() => setActiveTab('quemSomos')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase transition-all ${activeTab === 'quemSomos' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
          >
            Quem Somos
          </button>
          <button
            onClick={() => setActiveTab('avisos')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase transition-all ${activeTab === 'avisos' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
          >
            Mural de Avisos ({avisos?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('sede')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase transition-all ${activeTab === 'sede' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
          >
            Sede & Redes
          </button>
          <button
            onClick={onLogout}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-2.5 rounded-lg ml-2 transition-all"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* ABA QUEM SOMOS */}
      {activeTab === 'quemSomos' && (
        <form onSubmit={handleSalvarQuemSomos} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl max-w-3xl mx-auto">
          <h2 className="font-extrabold uppercase text-white text-sm border-b border-zinc-800 pb-3 flex items-center gap-2">
            <Info className="text-red-500" /> Configuração da Página "Quem Somos"
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">História & Visão Ampla da Academia</label>
              <textarea value={formQuemSomos.historia} onChange={e => setFormQuemSomos({...formQuemSomos, historia: e.target.value})} rows="5" placeholder="Conte a história, trajetória e filosofia da Associação Nagashima..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-white focus:border-red-600 outline-none" required />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Missão</label>
              <textarea value={formQuemSomos.missao} onChange={e => setFormQuemSomos({...formQuemSomos, missao: e.target.value})} rows="2" placeholder="Qual é o propósito do dojo..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Visão</label>
              <textarea value={formQuemSomos.visao} onChange={e => setFormQuemSomos({...formQuemSomos, visao: e.target.value})} rows="2" placeholder="Aonde o dojo deseja chegar..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Valores</label>
              <textarea value={formQuemSomos.valores} onChange={e => setFormQuemSomos({...formQuemSomos, valores: e.target.value})} rows="2" placeholder="Respeito, Disciplina, Honra..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-white focus:border-red-600 outline-none" />
            </div>
          </div>

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold p-3 rounded-lg text-xs uppercase transition-all shadow-lg shadow-red-600/30">
            Salvar "Quem Somos" no Banco
          </button>
        </form>
      )}

      {/* ABA ATLETAS */}
      {activeTab === 'atletas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSalvarAtleta} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl h-fit">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="font-extrabold uppercase text-white text-sm flex items-center gap-2">
                <Plus size={16} className="text-red-500" />
                {editandoId ? 'Editar Atleta' : 'Cadastrar Novo Atleta'}
              </h2>
              {editandoId && (
                <button type="button" onClick={limparFormAtleta} className="text-[10px] text-zinc-400 hover:text-white underline">
                  Cancelar Edição
                </button>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Nome Completo</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Idade</label>
                <input type="number" value={idade} onChange={e => setIdade(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Peso</label>
                <input type="text" value={peso} onChange={e => setPeso(e.target.value)} placeholder="ex: 75kg" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Graduação / Faixa</label>
              <select value={graduacao} onChange={e => setGraduacao(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none">
                <option value="Faixa Branca">Faixa Branca</option>
                <option value="Faixa Cinza">Faixa Cinza</option>
                <option value="Faixa Azul">Faixa Azul</option>
                <option value="Faixa Amarela">Faixa Amarela</option>
                <option value="Faixa Laranja">Faixa Laranja</option>
                <option value="Faixa Verde">Faixa Verde</option>
                <option value="Faixa Roxa">Faixa Roxa</option>
                <option value="Faixa Marrom">Faixa Marrom</option>
                <option value="Faixa Preta (1º ao 5º Dan)">Faixa Preta (1º ao 5º Dan)</option>
                <option value="Faixa Coral (6º ao 8º Dan)">Faixa Coral (6º ao 8º Dan)</option>
                <option value="Faixa Vermelha (9º e 10º Dan)">Faixa Vermelha (9º e 10º Dan)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Foto de Rosto (Perfil)</label>
              <input type="file" accept="image/*" onChange={e => handleFileUpload(e, setFoto)} className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer" />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Foto em Pé (Corpo Inteiro)</label>
              <input type="file" accept="image/*" onChange={e => handleFileUpload(e, setFotoCorpo)} className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer" />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800">
              <div>
                <label className="text-[10px] font-bold text-yellow-500 block mb-1">🥇 Ouro</label>
                <input type="number" value={ouro} onChange={e => setOuro(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-300 block mb-1">🥈 Prata</label>
                <input type="number" value={prata} onChange={e => setPrata(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-amber-600 block mb-1">🥉 Bronze</label>
                <input type="number" value={bronze} onChange={e => setBronze(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Estilo de Luta e Tokui (Golpe Favorito)</label>
              <textarea value={caracteristicas} onChange={e => setCaracteristicas(e.target.value)} rows="2" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Principais Títulos</label>
              <textarea value={titulos} onChange={e => setTitulos(e.target.value)} rows="2" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold p-3 rounded-lg text-xs uppercase transition-all shadow-lg shadow-red-600/30">
              {editandoId ? 'Atualizar Atleta' : 'Salvar Atleta no Banco'}
            </button>
          </form>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-extrabold uppercase text-white text-sm">Atletas Cadastrados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {atletas.map(a => (
                <div key={a.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    {a.foto ? (
                      <img src={a.foto} alt={a.nome} className="w-12 h-12 rounded-full object-cover border border-red-600" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white text-xs">
                        {a.nome?.substring(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <h3 className="font-extrabold text-white text-sm">{a.nome}</h3>
                      <p className="text-[11px] text-zinc-400">{a.graduacao}</p>
                      <p className="text-[10px] text-zinc-500">{a.idade} anos • {a.peso}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 mt-auto">
                    <div className="flex items-center gap-2 text-[10px] font-bold">
                      <span className="text-yellow-500">🥇 {a.medalhas?.ouro || 0}</span>
                      <span className="text-zinc-300">🥈 {a.medalhas?.prata || 0}</span>
                      <span className="text-amber-600">🥉 {a.medalhas?.bronze || 0}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEditarAtleta(a)} className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleExcluirAtleta(a.id)} className="text-red-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-zinc-800">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA EVENTOS */}
      {activeTab === 'eventos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSalvarEvento} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl h-fit">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="font-extrabold uppercase text-white text-sm flex items-center gap-2">
                <Plus size={16} className="text-red-500" />
                {editandoEventoId ? 'Editar Evento' : 'Cadastrar Novo Evento'}
              </h2>
              {editandoEventoId && (
                <button type="button" onClick={limparFormEvento} className="text-[10px] text-zinc-400 hover:text-white underline">
                  Cancelar Edição
                </button>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Iremos Participar?</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setParticiparemosEvento(true)}
                  className={`p-2.5 rounded-lg text-xs font-extrabold uppercase transition-all border ${
                    participaremosEvento
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-white'
                  }`}
                >
                  ✅ Iremos Participar
                </button>
                <button
                  type="button"
                  onClick={() => setParticiparemosEvento(false)}
                  className={`p-2.5 rounded-lg text-xs font-extrabold uppercase transition-all border ${
                    !participaremosEvento
                      ? 'bg-red-600 border-red-500 text-white shadow-md shadow-red-600/30'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-white'
                  }`}
                >
                  ❌ Não Participaremos
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Nome do Evento</label>
              <input type="text" value={nomeEvento} onChange={e => setNomeEvento(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" required />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Data do Evento</label>
              <input type="date" value={dataEvento} onChange={e => setDataEvento(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" required />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Local</label>
              <input type="text" value={localEvento} onChange={e => setLocalEvento(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Categorias Permissíveis</label>
              <input type="text" value={categoriasEvento} onChange={e => setCategoriasEvento(e.target.value)} placeholder="ex: Infantil, Juvenil e Adulto" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Descrição</label>
              <textarea value={descricaoEvento} onChange={e => setDescricaoEvento(e.target.value)} rows="2" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Observações Importantes</label>
              <textarea value={observacoesEvento} onChange={e => setObservacoesEvento(e.target.value)} rows="2" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold p-3 rounded-lg text-xs uppercase transition-all shadow-lg shadow-red-600/30">
              {editandoEventoId ? 'Atualizar Evento' : 'Salvar Evento'}
            </button>
          </form>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-extrabold uppercase text-white text-sm">Eventos Cadastrados</h2>
            <div className="space-y-3">
              {eventos.map(e => (
                <div key={e.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-4 shadow-lg">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-white text-sm">{e.nome}</h3>
                      {e.participaremos !== false ? (
                        <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-800/80 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                          ✅ Iremos Participar
                        </span>
                      ) : (
                        <span className="bg-red-950/90 text-red-400 border border-red-800/80 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                          ❌ Não Participaremos
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">📅 {formatarDataBR(e.data)} • 📍 {e.local}</p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleEditarEvento(e)} className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleExcluirEvento(e.id)} className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-zinc-800">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA APOIADORES */}
      {activeTab === 'apoiadores' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSalvarApoiador} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl h-fit">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="font-extrabold uppercase text-white text-sm flex items-center gap-2">
                <HeartHandshake size={16} className="text-red-500" />
                {editandoApoiadorId ? 'Editar Apoiador' : 'Cadastrar Apoiador'}
              </h2>
              {editandoApoiadorId && (
                <button type="button" onClick={limparFormApoiador} className="text-[10px] text-zinc-400 hover:text-white underline">
                  Cancelar Edição
                </button>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Nome / Empresa</label>
              <input type="text" value={nomeApoiador} onChange={e => setNomeApoiador(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" required />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Contato Celular / WhatsApp</label>
              <input type="text" value={celularApoiador} onChange={e => setCelularApoiador(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Endereço</label>
              <input type="text" value={enderecoApoiador} onChange={e => setEnderecoApoiador(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Link do Google Maps</label>
              <input type="url" value={mapsApoiador} onChange={e => setMapsApoiador(e.target.value)} placeholder="https://maps.google.com/..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Link do Site ou Rede Social</label>
              <input type="url" value={siteApoiador} onChange={e => setSiteApoiador(e.target.value)} placeholder="https://..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Logo do Apoiador</label>
              <input type="file" accept="image/*" onChange={e => handleFileUpload(e, setLogoApoiador)} className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer" />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Descrição Curta</label>
              <textarea value={descricaoApoiador} onChange={e => setDescricaoApoiador(e.target.value)} rows="2" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold p-3 rounded-lg text-xs uppercase transition-all shadow-lg shadow-red-600/30">
              {editandoApoiadorId ? 'Atualizar Apoiador' : 'Salvar Apoiador'}
            </button>
          </form>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-extrabold uppercase text-white text-sm">Apoiadores Cadastrados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {apoiadores.map(ap => (
                <div key={ap.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    {ap.logoUrl ? (
                      <img src={ap.logoUrl} alt={ap.nome} className="w-12 h-12 rounded-lg object-contain bg-zinc-950 p-1 border border-zinc-800" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white text-xs">
                        {ap.nome?.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-extrabold text-white text-sm">{ap.nome}</h3>
                      <p className="text-[11px] text-zinc-400">{ap.celular}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleEditarApoiador(ap)} className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleExcluirApoiador(ap.id)} className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-zinc-800">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA EXAMES DE FAIXA */}
      {activeTab === 'exames' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSalvarExame} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl h-fit">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="font-extrabold uppercase text-white text-sm flex items-center gap-2">
                <GraduationCap size={16} className="text-red-500" />
                {editandoExameId ? 'Editar Exame de Faixa' : 'Cadastrar Exame de Faixa'}
              </h2>
              {editandoExameId && (
                <button type="button" onClick={limparFormExame} className="text-[10px] text-zinc-400 hover:text-white underline">
                  Cancelar Edição
                </button>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Data do Exame</label>
              <input type="date" value={dataExame} onChange={e => setDataExame(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" required />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Local do Exame</label>
              <input type="text" value={localExame} onChange={e => setLocalExame(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" required />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Link do Google Maps</label>
              <input type="url" value={mapsExame} onChange={e => setMapsExame(e.target.value)} placeholder="https://maps.google.com/..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-400">Graduações & Cobranças</label>
                <button type="button" onClick={addGraduacaoExameField} className="text-[11px] bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-2 py-1 rounded flex items-center gap-1">
                  <Plus size={12} /> Adicionar
                </button>
              </div>
              {graduacoesExame.map((g, idx) => (
                <div key={idx} className="space-y-1 bg-zinc-950 border border-zinc-800 p-2 rounded-lg">
                  <input
                    type="text"
                    placeholder="Faixa (ex: Faixa Amarela)"
                    value={g.faixa}
                    onChange={e => handleGraduacaoExameChange(idx, 'faixa', e.target.value)}
                    className="w-full bg-transparent text-xs text-white outline-none border-b border-zinc-800 pb-1"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Descrição da cobrança / taxa"
                    value={g.cobranca}
                    onChange={e => handleGraduacaoExameChange(idx, 'cobranca', e.target.value)}
                    className="w-full bg-transparent text-xs text-zinc-400 outline-none pt-1"
                    required
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Imagem do Go-Kyu</label>
              <input type="file" accept="image/*" onChange={e => handleFileUpload(e, setGokyuImage)} className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer" />
            </div>

            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold p-3 rounded-lg text-xs uppercase transition-all shadow-lg shadow-red-600/30">
              {editandoExameId ? 'Atualizar Exame' : 'Salvar Exame de Faixa'}
            </button>
          </form>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-extrabold uppercase text-white text-sm">Exames Cadastrados</h2>
            <div className="space-y-3">
              {exames.map(ex => (
                <div key={ex.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-4 shadow-lg">
                  <div>
                    <h3 className="font-extrabold text-white text-sm">Exame: {formatarDataBR(ex.data)}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">📍 {ex.local}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">{ex.graduacoes?.length || 0} faixa(s) programada(s)</p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleEditarExame(ex)} className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleExcluirExame(ex.id)} className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-zinc-800">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA MURAL DE AVISOS */}
      {activeTab === 'avisos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSalvarAviso} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl h-fit">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="font-extrabold uppercase text-white text-sm flex items-center gap-2">
                <Bell size={16} className="text-red-500" />
                {editandoAvisoId ? 'Editar Aviso' : 'Publicar Novo Aviso'}
              </h2>
              {editandoAvisoId && (
                <button type="button" onClick={limparFormAviso} className="text-[10px] text-zinc-400 hover:text-white underline">
                  Cancelar Edição
                </button>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Título do Aviso</label>
              <input type="text" value={tituloAviso} onChange={e => setTituloAviso(e.target.value)} placeholder="ex: Exame de Faixa em Novembro" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" required />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Conteúdo do Recado</label>
              <textarea value={conteudoAviso} onChange={e => setConteudoAviso(e.target.value)} rows="4" placeholder="Escreva os detalhes para os alunos e pais..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" required />
            </div>

            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold p-3 rounded-lg text-xs uppercase transition-all shadow-lg shadow-red-600/30">
              {editandoAvisoId ? 'Atualizar Aviso' : 'Publicar Aviso'}
            </button>
          </form>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-extrabold uppercase text-white text-sm">Avisos Ativos na Tela Inicial</h2>
            <div className="space-y-3">
              {avisos?.map(a => (
                <div key={a.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-start justify-between gap-4 shadow-lg">
                  <div>
                    <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                      <Bell size={14} className="text-red-500" /> {a.titulo}
                    </h3>
                    <p className="text-xs text-zinc-300 mt-2 leading-relaxed">{a.conteudo}</p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleEditarAviso(a)} className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleExcluirAviso(a.id)} className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-zinc-800">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA SEDE, BANNER & REDES */}
      {activeTab === 'sede' && (
        <form onSubmit={handleSalvarSede} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl max-w-3xl mx-auto">
          <h2 className="font-extrabold uppercase text-white text-sm border-b border-zinc-800 pb-3 flex items-center gap-2">
            <Layout className="text-red-500" /> Configurações de Sede, Banner Principal e Redes
          </h2>

          {/* BANNER PRINCIPAL (HOME) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-red-500 uppercase flex items-center gap-2">
              <Layout size={14} /> Textos e Logo do Banner Principal (Home)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Selo / Tag Superior</label>
                <input type="text" value={formSede.bannerTag || ''} onChange={e => setFormSede({...formSede, bannerTag: e.target.value})} placeholder="ex: Tradição & Disciplina" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Título Principal (Grande)</label>
                <input type="text" value={formSede.bannerTitulo || ''} onChange={e => setFormSede({...formSede, bannerTitulo: e.target.value})} placeholder="ex: Associação Nagashima" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Slogan Vermelho</label>
                <input type="text" value={formSede.bannerSlogan || ''} onChange={e => setFormSede({...formSede, bannerSlogan: e.target.value})} placeholder="ex: Artes Marciais, Esporte e Cultura" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Subtítulo em Destaque</label>
                <input type="text" value={formSede.bannerSubtitulo || ''} onChange={e => setFormSede({...formSede, bannerSubtitulo: e.target.value})} placeholder="ex: Formando Campeões Dentro e Fora do Tatame" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">Descrição Curta do Banner</label>
              <textarea value={formSede.bannerDescricao || ''} onChange={e => setFormSede({...formSede, bannerDescricao: e.target.value})} rows="2" placeholder="Portal oficial da Associação Nagashima..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            {/* CAMPO DE IMPORTAR FOTO DO BANNER */}
            <div className="pt-2">
              <label className="text-xs font-bold text-zinc-400 block mb-1 flex items-center gap-1.5">
                <Image size={14} className="text-red-500" /> Logo / Imagem Circular do Banner
              </label>
              <input type="file" accept="image/*" onChange={e => handleFileUpload(e, (res) => setFormSede({...formSede, bannerLogo: res}))} className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer" />
              {formSede.bannerLogo && (
                <div className="mt-2 flex items-center gap-3">
                  <img src={formSede.bannerLogo} alt="Preview Logo Banner" className="w-12 h-12 rounded-full object-contain border border-red-600 bg-white p-1" />
                  <span className="text-[11px] text-emerald-400 font-bold">✓ Imagem carregada</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h3 className="text-xs font-bold text-red-500 uppercase flex items-center gap-2">
              <Phone size={14} /> Contatos Principais
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Telefone / WhatsApp</label>
                <input type="text" value={formSede.telefone} onChange={e => setFormSede({...formSede, telefone: e.target.value})} placeholder="ex: (84) 98888-0000" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">E-mail Oficial</label>
                <input type="email" value={formSede.email} onChange={e => setFormSede({...formSede, email: e.target.value})} placeholder="ex: contato@nagashimadojo.com.br" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h3 className="text-xs font-bold text-red-500 uppercase flex items-center gap-2">
              <MapPin size={14} /> Endereço da Sede
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Rua e Número</label>
                <input type="text" value={formSede.endereco} onChange={e => setFormSede({...formSede, endereco: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Bairro e Cidade/UF</label>
                <input type="text" value={formSede.bairroCidade} onChange={e => setFormSede({...formSede, bairroCidade: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h3 className="text-xs font-bold text-red-500 uppercase flex items-center gap-2">
              <Clock size={14} /> Horários de Treino
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Horário Principal / Judô</label>
                <input type="text" value={formSede.horarioJudo} onChange={e => setFormSede({...formSede, horarioJudo: e.target.value})} placeholder="ex: Segundas, Quartas e Sextas: 19h00 às 20h30" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Horário Infantil / Geral</label>
                <input type="text" value={formSede.horarioGeral} onChange={e => setFormSede({...formSede, horarioGeral: e.target.value})} placeholder="ex: Terças e Quintas (Infantil): 18h00 às 19h00" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h3 className="text-xs font-bold text-red-500 uppercase flex items-center gap-2">
              <Share2 size={14} /> Redes Sociais
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Link do Instagram</label>
                <input type="text" value={formSede.instagram} onChange={e => setFormSede({...formSede, instagram: e.target.value})} placeholder="https://instagram.com/..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Link do Facebook</label>
                <input type="text" value={formSede.facebook} onChange={e => setFormSede({...formSede, facebook: e.target.value})} placeholder="https://facebook.com/..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Link do YouTube</label>
                <input type="text" value={formSede.youtube} onChange={e => setFormSede({...formSede, youtube: e.target.value})} placeholder="https://youtube.com/..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:border-red-600 outline-none" />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold p-3 rounded-lg text-xs uppercase transition-all shadow-lg shadow-red-600/30">
            Salvar Configurações no Banco
          </button>
        </form>
      )}
    </div>
  );
}
