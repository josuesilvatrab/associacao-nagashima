import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { User, Calendar, Settings, LogOut, Plus, Trash2, Edit2, MapPin, Clock, Share2, Phone, Mail } from 'lucide-react';

export function formatarDataBR(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

export default function AdminPanel({ onLogout, atletas, eventos, configSede, setConfigSede }) {
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

  // Form Sede & Redes & Contatos
  const [formSede, setFormSede] = useState(configSede || {
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

    try {
      await addDoc(collection(db, 'eventos'), {
        nome: nomeEvento,
        data: dataEvento,
        local: localEvento,
        tipo: tipoEvento,
        categorias: categoriasEvento,
        graduacoesPermitidas: graduacoesEvento,
        descricao: descricaoEvento,
        observacoes: observacoesEvento,
        realizado: false
      });

      setNomeEvento('');
      setDataEvento('');
      setLocalEvento('');
      setCategoriasEvento('');
      setDescricaoEvento('');
      setObservacoesEvento('');
    } catch (err) {
      alert('Erro ao salvar evento.');
    }
  };

  const handleExcluirEvento = async (id) => {
    if (confirm('Deseja realmente excluir este evento?')) {
      await deleteDoc(doc(db, 'eventos', id));
    }
  };

  const handleSalvarSede = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'configuracoes', 'sede'), formSede);
      if (setConfigSede) setConfigSede(formSede);
      alert('Configurações de Sede, Contatos e Redes Sociais salvas no banco de dados!');
    } catch (err) {
      alert('Erro ao salvar configurações da Sede.');
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
              <label className="text-xs font-bold text-zinc-400 block mb-1">Características & Estilo de Luta</label>
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

          {/* LISTA DE ATLETAS */}
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
            <h2 className="font-extrabold uppercase text-white text-sm flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Plus size={16} className="text-red-500" /> Cadastrar Novo Evento
            </h2>

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
              Salvar Evento
            </button>
          </form>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-extrabold uppercase text-white text-sm">Eventos Cadastrados</h2>
            <div className="space-y-3">
              {eventos.map(e => (
                <div key={e.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-4 shadow-lg">
                  <div>
                    <h3 className="font-extrabold text-white text-sm">{e.nome}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">📅 {formatarDataBR(e.data)} • 📍 {e.local}</p>
                  </div>

                  <button onClick={() => handleExcluirEvento(e.id)} className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-zinc-800">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA SEDE & REDES & CONTATOS */}
      {activeTab === 'sede' && (
        <form onSubmit={handleSalvarSede} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl max-w-2xl mx-auto">
          <h2 className="font-extrabold uppercase text-white text-sm border-b border-zinc-800 pb-3 flex items-center gap-2">
            <MapPin className="text-red-500" /> Configurações de Sede, Contatos e Redes
          </h2>

          {/* CONTATOS */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-red-500 uppercase flex items-center gap-2">
              <Phone size={14} /> Contatos Principais (Topo e Rodapé)
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

          {/* ENDEREÇO */}
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

          {/* HORÁRIOS */}
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

          {/* REDES SOCIAIS */}
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
