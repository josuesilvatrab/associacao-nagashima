import React, { useState, useEffect } from 'react';
import { Lock, X, ShieldAlert } from 'lucide-react';
import logoImg from '../assets/logo.jpg';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(false);

  // Limpa os campos sempre que a janela modal for aberta ou fechada
  useEffect(() => {
    if (!isOpen) {
      setUsuario('');
      setSenha('');
      setErro(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (usuario === 'admin' && senha === '1234') {
      setErro(false);
      setUsuario('');
      setSenha('');
      onLoginSuccess();
    } else {
      setErro(true);
      setSenha(''); // Limpa a senha se errou
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-zinc-950 border-2 border-red-600/80 rounded-2xl p-8 shadow-2xl overflow-hidden">
        
        {/* Logo de Fundo Desfocada */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <img src={logoImg} alt="Background Logo" className="w-80 h-80 object-cover rounded-full filter blur-sm" />
        </div>

        {/* Botão Fechar */}
        <button 
          onClick={() => {
            setUsuario('');
            setSenha('');
            onClose();
          }} 
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-red-600/20 border border-red-600/50 rounded-full flex items-center justify-center mx-auto text-red-500">
              <Lock size={22} />
            </div>
            <h2 className="text-xl font-black uppercase text-white tracking-wider">Acesso Restrito</h2>
            <p className="text-xs text-zinc-400">Painel do Professor / Administrador</p>
          </div>

          {erro && (
            <div className="bg-red-950/60 border border-red-800 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
              <ShieldAlert size={16} className="flex-shrink-0" />
              <span>Usuário ou senha incorretos! (Padrão: admin / 1234)</span>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1 uppercase tracking-wider">Usuário</label>
              <input 
                type="text" 
                placeholder="Digite seu usuário..."
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                autoComplete="off"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 text-white rounded-lg p-3 text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1 uppercase tracking-wider">Senha</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                autoComplete="new-password"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 text-white rounded-lg p-3 text-sm outline-none transition-colors"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-600/30"
            >
              Entrar no Sistema
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}