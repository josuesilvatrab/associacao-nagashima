import React, { useState } from 'react';
import { Plus, Minus, Edit, Trash2, User, Calendar, Award, LogOut, MapPin, Clock, AlertCircle, Share2 } from 'lucide-react';

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
        <svg width="110" height="18" viewBox="0 0 110 18" fill="none" className="shadow rounded">
          <rect x="1" y="1" width="108" height="16" rx="2" fill="#DC2626" stroke="#991B1B" strokeWidth="1"/>
          <rect x="20" y="1" width="16" height="16" fill="#FFFFFF"/>
          <rect x="52" y="1" width="16" height="16" fill="#FFFFFF"/>
          <rect x="84" y="1" width="16" height="16" fill="#FFFFFF"/>
          <line x1="1" y1="9" x2="109" y2="9" stroke="#000000" strokeWidth="0.5" strokeDasharray="3 2" opacity="0.3"/>
        </svg>
        <span className="text-xs font-bold text-white">{nomeFaixa}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <svg width="100" height="18" viewBox="0 0 100 18" fill="none" className="shadow rounded">
        <rect x="1" y="1" width="98" height="16" rx="2" fill={faixa.hex} stroke={faixa.borda} strokeWidth="1.5"/>
        <line x1="1" y1="9" x2="99" y2="9" stroke={faixa.hex === '#FFFFFF' ? '#999999' : '#FFFFFF'} strokeWidth="0.5" strokeDasharray="3 2" opacity="0.4"/>
      </svg>
      <span className="text-xs font-bold text-zinc-200">{nomeFaixa}</span>
    </div>
  );
}

export function formatarDataBR(dataIso) {
  if (!dataIso) return '';
  const partes = dataIso.split('-');
  if (partes.length !== 3) return dataIso;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

export default function AdminPanel({ onLogout, atletas, setAtletas, eventos, setEventos, configSede, setConfigSede }) {
  const [tab, setTab] = useState('atletas');
  const [editingAtletaId, setEditingAtletaId] = useState(null);
  const [editingEventoId, setEditingEventoId] = useState(null);

  const [expandedRow, setExpandedRow] = useState(null);
  const [showFormAtleta, setShowFormAtleta] = useState(false);
  const [showFormEvento, setShowFormEvento] = useState(false);

  const [formAtleta, setFormAtleta] = useState({
    nome: '', idade: '', peso: '', graduacao: 'Faixa Branca',
    caracteristicas: '', titulos: '', foto: '', fotoCorpo: '', ouro: 0, prata: 0, bronze: 0
  });

  const [formEvento, setFormEvento] = useState({
    nome: '', data: '', local: '', tipo: 'Campeonato', categorias: '', graduacoesPermitidas: '', descricao: '', observacoes: '', realizado: false
  });

  const [formSede, setFormSede] = useState(configSede);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormAtleta(prev => ({ ...prev, foto: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleImageCorpoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormAtleta(prev => ({ ...prev, fotoCorpo: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAtleta = (e) => {
    e.preventDefault();
    if (!formAtleta.nome) return;

    if (editingAtletaId) {
      setAtletas(atletas.map(a => a.id === editingAtletaId ? {
        ...a,
        ...formAtleta,
        foto: formAtleta.foto || a.foto,
        fotoCorpo: formAtleta.fotoCorpo || a.fotoCorpo,
        medalhas: { ouro: Number(formAtleta.ouro), prata: Number(formAtleta.prata), bronze: Number(formAtleta.bronze) }
      } : a));
      setEditingAtletaId(null);
    } else {
      setAtletas([...atletas, {
        id: Date.now(),
        ...formAtleta,
        medalhas: { ouro: Number(formAtleta.ouro), prata: Number(formAtleta.prata), bronze: Number(formAtleta.bronze) }
      }]);
    }

    setFormAtleta({ nome: '', idade: '', peso: '', graduacao: 'Faixa Branca', caracteristicas: '', titulos: '', foto: '', fotoCorpo: '', ouro: 0, prata: 0, bronze: 0 });
    setShowFormAtleta(false);
  };

  const handleEditAtleta = (atleta) => {
    setEditingAtletaId(atleta.id);
    setShowFormAtleta(true);
    setFormAtleta({
      nome: atleta.nome,
      idade: atleta.idade,
      peso: atleta.peso,
      graduacao: atleta.graduacao,
      caracteristicas: atleta.caracteristicas,
      titulos: atleta.titulos,
      foto: atleta.foto,
      fotoCorpo: atleta.fotoCorpo || '',
      ouro: atleta.medalhas.ouro,
      prata: atleta.medalhas.prata,
      bronze: atleta.medalhas.bronze
    });
  };

  const handleSaveEvento = (e) => {
    e.preventDefault();
    if (!formEvento.nome) return;

    if (editingEventoId) {
      setEventos(eventos.map(evt => evt.id === editingEventoId ? { ...evt, ...formEvento } : evt));
      setEditingEventoId(null);
    } else {
      setEventos([...eventos, { id: Date.now(), ...formEvento }]);
    }

    setFormEvento({ nome: '', data: '', local: '', tipo: 'Campeonato', categorias: '', graduacoesPermitidas: '', descricao: '', observacoes: '', realizado: false });
    setShowFormEvento(false);
  };

  const handleEditEvento = (evt) => {
    setEditingEventoId(evt.id);
    setShowFormEvento(true);
    setFormEvento({
      nome: evt.nome,
      data: evt.data,
      local: evt.local,
      tipo: evt.tipo || 'Campeonato',
      categorias: evt.categorias,
      graduacoesPermitidas: evt.graduacoesPermitidas,
      descricao: evt.descricao,
      observacoes: evt.observacoes || '',
      realizado: evt.realizado || false
    });
  };

  const handleSaveSede = (e) => {
    e.preventDefault();
    setConfigSede(formSede);
    alert('Configurações salvas com sucesso!');
  };

  const deleteItem = (id, type) => {
    if (type === 'atletas') setAtletas(atletas.filter(a => a.id !== id));
    if (type === 'eventos') setEventos(eventos.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between border-b border-zinc-800 flex-wrap gap-2">
        <div className="flex">
          <button
            type="button"
            onClick={() => setTab('atletas')}
            className={`px-5 py-3 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all border-b-2 ${
              tab === 'atletas' ? 'border-red-600 text-red-500 bg-zinc-900/50' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Gestão de Atletas
          </button>
          <button
            type="button"
            onClick={() => setTab('eventos')}
            className={`px-5 py-3 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all border-b-2 ${
              tab === 'eventos' ? 'border-red-600 text-red-500 bg-zinc-900/50' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Gestão de Eventos
          </button>
          <button
            type="button"
            onClick={() => setTab('sede')}
            className={`px-5 py-3 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all border-b-2 ${
              tab === 'sede' ? 'border-red-600 text-red-500 bg-zinc-900/50' : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Sede, Redes & Horários
          </button>
        </div>

        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-500 hover:text-white hover:bg-red-600/20 rounded-md transition-all border border-red-900/30 mb-2"
        >
          <LogOut size={14} /> Sair do Painel
        </button>
      </div>

      {/* ABA ATLETAS */}
      {tab === 'atletas' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
            <span className="font-bold text-sm text-white uppercase flex items-center gap-2">
              <User className="w-4 h-4 text-red-500" /> Cadastrar Novo Atleta
            </span>
            <button
              type="button"
              onClick={() => {
                if (showFormAtleta && editingAtletaId) setEditingAtletaId(null);
                setShowFormAtleta(!showFormAtleta);
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
            >
              {showFormAtleta ? <Minus size={14} /> : <Plus size={14} />}
              {showFormAtleta ? 'Fechar Formulário' : 'Novo Atleta'}
            </button>
          </div>

          {showFormAtleta && (
            <form onSubmit={handleSaveAtleta} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 font-bold block mb-1">Nome Completo</label>
                  <input 
                    type="text" placeholder="Ex: João Silva" value={formAtleta.nome} 
                    onChange={e => setFormAtleta({...formAtleta, nome: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white focus:border-red-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 font-bold block mb-1">Idade</label>
                  <input 
                    type="number" placeholder="Ex: 20" value={formAtleta.idade} 
                    onChange={e => setFormAtleta({...formAtleta, idade: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white focus:border-red-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 font-bold block mb-1">Peso</label>
                  <input 
                    type="text" placeholder="Ex: 75kg" value={formAtleta.peso} 
                    onChange={e => setFormAtleta({...formAtleta, peso: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white focus:border-red-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 font-bold block mb-1">Graduação / Faixa de Judô</label>
                  <select 
                    value={formAtleta.graduacao} onChange={e => setFormAtleta({...formAtleta, graduacao: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white focus:border-red-600 outline-none"
                  >
                    {FAIXAS_JUDO.map(f => (
                      <option key={f.nome} value={f.nome}>{f.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-800 pt-3">
                <div>
                  <label className="text-xs text-zinc-400 font-bold block mb-1">Foto Rosto / Avatar (Cabeçalho)</label>
                  <input 
                    type="file" accept="image/*" onChange={handleImageUpload}
                    className="bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-zinc-300 w-full file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-zinc-800 file:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-bold block mb-1">Foto Em Pé / Kimono (Portfólio Lado Direito)</label>
                  <input 
                    type="file" accept="image/*" onChange={handleImageCorpoUpload}
                    className="bg-zinc-950 border border-zinc-800 rounded p-2 text-xs text-zinc-300 w-full file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-zinc-800 file:text-white"
                  />
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-3">
                <label className="text-xs text-zinc-400 font-bold block mb-2 flex items-center gap-1">
                  <Award className="w-4 h-4 text-yellow-500" /> Quantidade de Medalhas
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] text-yellow-500 font-bold block mb-1">🥇 Ouro</label>
                    <input 
                      type="number" min="0" value={formAtleta.ouro} 
                      onChange={e => setFormAtleta({...formAtleta, ouro: e.target.value})}
                      className="w-full bg-zinc-950 border border-yellow-600/40 rounded p-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-300 font-bold block mb-1">🥈 Prata</label>
                    <input 
                      type="number" min="0" value={formAtleta.prata} 
                      onChange={e => setFormAtleta({...formAtleta, prata: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-500/40 rounded p-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-amber-600 font-bold block mb-1">🥉 Bronze</label>
                    <input 
                      type="number" min="0" value={formAtleta.bronze} 
                      onChange={e => setFormAtleta({...formAtleta, bronze: e.target.value})}
                      className="w-full bg-zinc-950 border border-amber-700/40 rounded p-2 text-sm text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 font-bold block mb-1">Características do Atleta</label>
                  <textarea 
                    placeholder="Ex: Ponto forte, guarda de preferência, observações do treinador..."
                    value={formAtleta.caracteristicas} onChange={e => setFormAtleta({...formAtleta, caracteristicas: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white focus:border-red-600 outline-none h-20"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-bold block mb-1">Títulos e Histórico</label>
                  <textarea 
                    placeholder="Ex: Campeão Estadual 2025, Vice-campeão Brasileiro 2024..."
                    value={formAtleta.titulos} onChange={e => setFormAtleta({...formAtleta, titulos: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white focus:border-red-600 outline-none h-20"
                  />
                </div>
              </div>

              <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded uppercase text-xs tracking-wider transition-all">
                {editingAtletaId ? 'Salvar Alterações' : '+ Salvar Atleta'}
              </button>
            </form>
          )}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-zinc-800 font-bold uppercase text-sm text-zinc-300">
              Matriz de Atletas Cadastrados
            </div>

            <div className="divide-y divide-zinc-800">
              {atletas.map((atleta) => {
                const isExpanded = expandedRow === atleta.id;
                return (
                  <div key={atleta.id}>
                    <div className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-800/40 transition-colors">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setExpandedRow(isExpanded ? null : atleta.id)}
                          className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow"
                        >
                          {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
                        </button>

                        {atleta.foto ? (
                          <img 
                            src={atleta.foto} 
                            alt={atleta.nome} 
                            className="w-16 h-16 rounded-full object-cover border-2 border-red-600 shadow-md hover:scale-105 transition-transform" 
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-base font-bold text-white shadow-md">
                            {atleta.nome.substring(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div className="space-y-1">
                          <h4 className="font-bold text-white text-base leading-tight">{atleta.nome}</h4>
                          <ImagemFaixa nomeFaixa={atleta.graduacao} />
                        </div>
                      </div>

                      <div className="hidden md:flex items-center gap-6 text-xs text-zinc-300">
                        <span><strong>Idade:</strong> {atleta.idade} anos</span>
                        <span><strong>Peso:</strong> {atleta.peso}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-bold">
                        <span className="text-zinc-400 font-bold">Medalhas:</span>
                        <span className="text-yellow-500">🥇 {atleta.medalhas.ouro}</span>
                        <span className="text-zinc-300">🥈 {atleta.medalhas.prata}</span>
                        <span className="text-amber-600">🥉 {atleta.medalhas.bronze}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEditAtleta(atleta)} className="p-2 text-zinc-400 hover:text-white"><Edit size={18} /></button>
                        <button onClick={() => deleteItem(atleta.id, 'atletas')} className="p-2 text-zinc-400 hover:text-red-500"><Trash2 size={18} /></button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-6 bg-zinc-950 border-t border-zinc-800 text-xs text-left">
                        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                          <div className="space-y-4 flex-1">
                            <div className="space-y-1">
                              <strong className="text-red-500 block uppercase font-bold tracking-wider">🥋 Faixa & Graduação Oficial:</strong>
                              <ImagemFaixa nomeFaixa={atleta.graduacao} />
                            </div>
                            <div>
                              <strong className="text-red-500 block mb-1 uppercase font-bold tracking-wider">🎯 Características e Estilo de Luta:</strong>
                              <p className="text-zinc-300 leading-relaxed text-sm">{atleta.caracteristicas || 'Nenhuma observação cadastrada.'}</p>
                            </div>
                            <div>
                              <strong className="text-red-500 block mb-1 uppercase font-bold tracking-wider">📜 Títulos e Principais Conquistas:</strong>
                              <p className="text-zinc-300 leading-relaxed text-sm">{atleta.titulos || 'Nenhum título cadastrado.'}</p>
                            </div>
                          </div>

                          {atleta.fotoCorpo ? (
                            <div className="w-full md:w-56 h-72 rounded-xl overflow-hidden border-2 border-red-600/60 shadow-2xl flex-shrink-0 bg-zinc-900">
                              <img 
                                src={atleta.fotoCorpo} 
                                alt={`Foto em pé de ${atleta.nome}`} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          ) : (
                            <div className="w-full md:w-56 h-72 rounded-xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-600 text-center p-4">
                              <User size={32} className="mb-2 opacity-50" />
                              <span>Nenhuma foto em pé cadastrada</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ABA EVENTOS */}
      {tab === 'eventos' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
            <span className="font-bold text-sm text-white uppercase flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" /> Cadastrar Novo Evento
            </span>
            <button
              type="button"
              onClick={() => {
                if (showFormEvento && editingEventoId) setEditingEventoId(null);
                setShowFormEvento(!showFormEvento);
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
            >
              {showFormEvento ? <Minus size={14} /> : <Plus size={14} />}
              {showFormEvento ? 'Fechar Formulário' : 'Novo Evento'}
            </button>
          </div>

          {showFormEvento && (
            <form onSubmit={handleSaveEvento} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 font-bold block mb-1">Nome do Evento</label>
                  <input 
                    type="text" placeholder="Ex: Copa Nagashima" value={formEvento.nome} 
                    onChange={e => setFormEvento({...formEvento, nome: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white focus:border-red-600 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-bold block mb-1">Data do Evento</label>
                  <input 
                    type="date" value={formEvento.data} 
                    onChange={e => setFormEvento({...formEvento, data: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white focus:border-red-600 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-bold block mb-1">Local</label>
                  <input 
                    type="text" placeholder="Ex: Ginásio Municipal" value={formEvento.local} 
                    onChange={e => setFormEvento({...formEvento, local: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white focus:border-red-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 font-bold block mb-1">Status do Evento</label>
                  <select 
                    value={formEvento.realizado ? 'sim' : 'nao'} 
                    onChange={e => setFormEvento({...formEvento, realizado: e.target.value === 'sim'})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white focus:border-red-600 outline-none font-bold"
                  >
                    <option value="nao">🟢 Próximo Evento (Não Ocorreu)</option>
                    <option value="sim">🔴 Evento Encerrado (Já Ocorreu)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 font-bold block mb-1">Categorias</label>
                  <input 
                    type="text" placeholder="Ex: Mirim, Infantil, Adulto" value={formEvento.categorias} 
                    onChange={e => setFormEvento({...formEvento, categorias: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white focus:border-red-600 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-bold block mb-1">Graduações Permitidas</label>
                  <input 
                    type="text" placeholder="Ex: Faixas Amarela a Preta" value={formEvento.graduacoesPermitidas} 
                    onChange={e => setFormEvento({...formEvento, graduacoesPermitidas: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white focus:border-red-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-bold block mb-1">Descrição Básica</label>
                <textarea 
                  placeholder="Detalhes adicionais do torneio..."
                  value={formEvento.descricao} onChange={e => setFormEvento({...formEvento, descricao: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white focus:border-red-600 outline-none h-16"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-yellow-500 block mb-1 flex items-center gap-1">
                  <AlertCircle size={14} /> Observações Importantes (Ex: Adiado, Alteração de Local)
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: EVENTO ADIADO para o próximo mês por motivos de manutenção no ginásio." 
                  value={formEvento.observacoes} 
                  onChange={e => setFormEvento({...formEvento, observacoes: e.target.value})}
                  className="w-full bg-zinc-950 border border-yellow-600/40 rounded p-2 text-sm text-yellow-200 focus:border-yellow-500 outline-none"
                />
              </div>

              <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded uppercase text-xs tracking-wider transition-all">
                {editingEventoId ? 'Salvar Alterações' : '+ Salvar Evento'}
              </button>
            </form>
          )}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-zinc-800 font-bold uppercase text-sm text-zinc-300">
              Matriz de Eventos Cadastrados
            </div>
            <div className="divide-y divide-zinc-800">
              {eventos.map((evt) => {
                const isExpanded = expandedRow === `evt-${evt.id}`;
                return (
                  <div key={evt.id}>
                    <div className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-800/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setExpandedRow(isExpanded ? null : `evt-${evt.id}`)}
                          className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                        >
                          {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm">{evt.nome}</h4>
                            {evt.realizado ? (
                              <span className="bg-red-950/80 text-red-400 border border-red-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
                                EVENTO ENCERRADO
                              </span>
                            ) : (
                              <span className="bg-green-950/80 text-green-400 border border-green-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
                                PROGRAMADO
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-zinc-400">{evt.local} • {formatarDataBR(evt.data)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEditEvento(evt)} className="p-1.5 text-zinc-400 hover:text-white"><Edit size={16} /></button>
                        <button onClick={() => deleteItem(evt.id, 'eventos')} className="p-1.5 text-zinc-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 bg-zinc-950 border-t border-zinc-800 text-xs text-left space-y-2">
                        <p><strong className="text-red-500">Categorias:</strong> <span className="text-zinc-300">{evt.categorias}</span></p>
                        <p><strong className="text-red-500">Graduações:</strong> <span className="text-zinc-300">{evt.graduacoesPermitidas}</span></p>
                        <p><strong className="text-red-500">Descrição:</strong> <span className="text-zinc-300">{evt.descricao}</span></p>
                        {evt.observacoes && (
                          <p className="p-2 bg-yellow-950/30 border border-yellow-600/40 rounded text-yellow-300 font-semibold">
                            ⚠️ <strong>Observação:</strong> {evt.observacoes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ABA DE CONFIGURAÇÕES DA SEDE, REDES & HORÁRIOS */}
      {tab === 'sede' && (
        <form onSubmit={handleSaveSede} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-6 shadow-xl">
          <h3 className="text-lg font-bold text-white uppercase flex items-center gap-2 border-b border-zinc-800 pb-3">
            <MapPin className="w-5 h-5 text-red-500" /> Cadastro de Endereço, Redes Sociais & Horários
          </h3>

          {/* NOVO BLOCO: REDES SOCIAIS */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-red-500 uppercase flex items-center gap-2">
              <Share2 size={16} /> Links das Redes Sociais (Barra Superior)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-zinc-400 font-bold block mb-1">Link do Facebook</label>
                <input 
                  type="url" placeholder="https://facebook.com/suapagina" value={formSede.facebook || ''} 
                  onChange={e => setFormSede({...formSede, facebook: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-white focus:border-red-600 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-bold block mb-1">Link do Instagram</label>
                <input 
                  type="url" placeholder="https://instagram.com/seuusuario" value={formSede.instagram || ''} 
                  onChange={e => setFormSede({...formSede, instagram: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-white focus:border-red-600 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-bold block mb-1">Link do YouTube</label>
                <input 
                  type="url" placeholder="https://youtube.com/@seucanal" value={formSede.youtube || ''} 
                  onChange={e => setFormSede({...formSede, youtube: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-white focus:border-red-600 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-zinc-800 pt-4">
            <h4 className="text-sm font-bold text-red-500 uppercase flex items-center gap-2">
              <MapPin size={16} /> Endereço Oficial da Sede
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-400 font-bold block mb-1">Rua / Logradouro e Número</label>
                <input 
                  type="text" value={formSede.endereco} 
                  onChange={e => setFormSede({...formSede, endereco: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-white focus:border-red-600 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-bold block mb-1">Bairro, Cidade e Estado</label>
                <input 
                  type="text" value={formSede.bairroCidade} 
                  onChange={e => setFormSede({...formSede, bairroCidade: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-white focus:border-red-600 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-zinc-800 pt-4">
            <h4 className="text-sm font-bold text-red-500 uppercase flex items-center gap-2">
              <Clock size={16} /> Horários de Treino
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-400 font-bold block mb-1">Dias e Horários - Turmas de Judô</label>
                <textarea 
                  value={formSede.horarioJudo} 
                  onChange={e => setFormSede({...formSede, horarioJudo: e.target.value})}
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-white focus:border-red-600 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-bold block mb-1">Dias e Horários - Outras Modalidades / Infantil</label>
                <textarea 
                  value={formSede.horarioGeral} 
                  onChange={e => setFormSede({...formSede, horarioGeral: e.target.value})}
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-sm text-white focus:border-red-600 outline-none"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded uppercase text-xs tracking-wider transition-all">
            Salvar Configurações Gerais
          </button>
        </form>
      )}
    </div>
  );
}