import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { User, Calendar, Settings, LogOut, Plus, Trash2, Trophy, Medal } from 'lucide-react';

export function formatarDataBR(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

export default function AdminPanel({ onLogout, atletas, eventos, configSede, setConfigSede }) {
  const [aba, setAba] = useState('atletas');

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
  const [categoriasEvento, setCategoriasEvento] = useState('');
  const [descricaoEvento, setDescricaoEvento] = useState('');
  const [observacoesEvento, setObservacoesEvento] = useState('');

  const handleSalvarAtleta = async (e) => {
    e.preventDefault();
    if (!nome) return alert('Digite o nome do atleta');

    try {
      await addDoc(collection(db, 'atletas'), {
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
          bronze: Number(bronze) || 0
        }
      });

      // Limpar formulário
      setNome('');
      setIdade('');
      setPeso('');
      setCaracteristicas('');
      setTitulos('');
      setFoto('');
      setFotoCorpo('');
      setOuro(0);
      setPrata(0);
      setBronze(0);

      alert('Atleta salvo com sucesso no banco de dados!');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar atleta no banco de dados.');
    }
  };

  const handleExcluirAtleta = async (id) => {
    if (confirm('Deseja realmente excluir este atleta?')) {
      try {
        await deleteDoc(doc(db, 'atletas', id));
      } catch (err) {
        alert('Erro ao excluir atleta.');
      }
    }
  };

  const handleSalvarEvento = async (e) => {
    e.preventDefault();
    if (!nomeEvento || !dataEvento) return alert('Preencha o nome e a data do evento');

    try {
      await addDoc(collection(db, 'eventos'), {
        nome: nomeEvento,
        data: dataEvento,
        local: localEvento,
        categorias: categoriasEvento,
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

      alert('Evento salvo com sucesso!');
    } catch (err) {
      alert('Erro ao salvar evento.');
    }
  };

  const handleExcluirEvento = async (id) => {
    if (confirm('Deseja realmente excluir este evento?')) {
      try {
        await deleteDoc(doc(db, 'eventos', id));
      } catch (err) {
        alert('Erro ao excluir evento.');
      }
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase text-white tracking-wider">Painel Administrativo</h2>
          <p className="text-xs text-zinc-400">Gerenciamento oficial em nuvem da Associação Nagashima</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setAba('atletas')} 
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${aba === 'atletas' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
          >
            Atletas ({atletas.length})
          </button>
          <button 
            onClick={() => setAba('eventos')} 
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${aba === 'eventos' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
          >
            Eventos ({eventos.length})
          </button>
          <button 
            onClick={onLogout} 
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-2 rounded-lg ml-2 transition-all"
            title="Sair"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {aba === 'atletas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSalvarAtleta} className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-4">
            <h3 className="text-sm font-extrabold uppercase text-white flex items-center gap-2">
              <Plus size={16} className="text-red-500" /> Cadastrar Novo Atleta
            </h3>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Nome Completo</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white focus:border-red-600 outline-none" required />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">Idade</label>
                <input type="number" value={idade} onChange={e => setIdade(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white focus:border-red-600 outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">Peso (ex: 75kg)</label>
                <input type="text" value={peso} onChange={e => setPeso(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white focus:border-red-600 outline-none" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Graduação / Faixa</label>
              <select value={graduacao} onChange={e => setGraduacao(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white focus:border-red-600 outline-none">
                <option value="Faixa Branca">Faixa Branca</option>
                <option value="Faixa Cinza">Faixa Cinza</option>
                <option value="Faixa Azul">Faixa Azul</option>
                <option value="Faixa Amarela">Faixa Amarela</option>
                <option value="Faixa Laranja">Faixa Laranja</option>
                <option value="Faixa Verde">Faixa Verde</option>
                <option value="Faixa Roxa">Faixa Roxa</option>
                <option value="Faixa Marrom">Faixa Marrom</option>
                <option value="Faixa Preta (1º ao 5º Dan)">Faixa Preta</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Link da Foto de Perfil (URL)</label>
              <input type="text" value={foto} onChange={e => setFoto(e.target.value)} placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Link da Foto em Pé (URL)</label>
              <input type="text" value={fotoCorpo} onChange={e => setFotoCorpo(e.target.value)} placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800">
              <div>
                <label className="text-[10px] font-bold text-yellow-500 block mb-1">🥇 Ouro</label>
                <input type="number" value={ouro} onChange={e => setOuro(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-300 block mb-1">🥈 Prata</label>
                <input type="number" value={prata} onChange={e => setPrata(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-amber-600 block mb-1">🥉 Bronze</label>
                <input type="number" value={bronze} onChange={e => setBronze(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Estilo de Luta & Observações</label>
              <textarea value={caracteristicas} onChange={e => setCaracteristicas(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white focus:border-red-600 outline-none h-16" />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Principais Títulos</label>
              <textarea value={titulos} onChange={e => setTitulos(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white focus:border-red-600 outline-none h-16" />
            </div>

            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold p-3 rounded-lg text-xs uppercase transition-all shadow-lg shadow-red-600/30">
              Salvar Atleta no Banco
            </button>
          </form>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-extrabold uppercase text-white">Atletas Salvos na Nuvem</h3>
            <div className="space-y-3">
              {atletas.map(a => (
                <div key={a.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-white text-sm">{a.nome}</h4>
                    <p className="text-xs text-zinc-400">{a.graduacao} • {a.idade} anos • {a.peso}</p>
                  </div>

                  <button onClick={() => handleExcluirAtleta(a.id)} className="text-red-500 hover:text-red-400 p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {aba === 'eventos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSalvarEvento} className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-4">
            <h3 className="text-sm font-extrabold uppercase text-white flex items-center gap-2">
              <Plus size={16} className="text-red-500" /> Cadastrar Novo Evento
            </h3>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Nome do Evento</label>
              <input type="text" value={nomeEvento} onChange={e => setNomeEvento(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white focus:border-red-600 outline-none" required />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Data do Evento</label>
              <input type="date" value={dataEvento} onChange={e => setDataEvento(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white focus:border-red-600 outline-none" required />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Local</label>
              <input type="text" value={localEvento} onChange={e => setLocalEvento(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Categorias Permissíveis</label>
              <input type="text" value={categoriasEvento} onChange={e => setCategoriasEvento(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white focus:border-red-600 outline-none" />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Descrição</label>
              <textarea value={descricaoEvento} onChange={e => setDescricaoEvento(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white focus:border-red-600 outline-none h-16" />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Observações Importantes</label>
              <textarea value={observacoesEvento} onChange={e => setObservacoesEvento(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-white focus:border-red-600 outline-none h-16" />
            </div>

            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold p-3 rounded-lg text-xs uppercase transition-all shadow-lg shadow-red-600/30">
              Salvar Evento no Banco
            </button>
          </form>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-extrabold uppercase text-white">Eventos Salvos na Nuvem</h3>
            <div className="space-y-3">
              {eventos.map(e => (
                <div key={e.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-white text-sm">{e.nome}</h4>
                    <p className="text-xs text-zinc-400">📅 {formatarDataBR(e.data)} • 📍 {e.local}</p>
                  </div>

                  <button onClick={() => handleExcluirEvento(e.id)} className="text-red-500 hover:text-red-400 p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
