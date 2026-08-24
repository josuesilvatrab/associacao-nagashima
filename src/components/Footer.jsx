import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';

// Função para formatar o número (ex: 84999451117 -> (84) 99945-1117)
function formatarTelefone(tel) {
  if (!tel) return '';
  const num = tel.replace(/\D/g, '');
  if (num.length === 11) {
    return `(${num.slice(0, 2)}) ${num.slice(2, 7)}-${num.slice(7)}`;
  }
  if (num.length === 10) {
    return `(${num.slice(0, 2)}) ${num.slice(2, 6)}-${num.slice(6)}`;
  }
  return tel;
}

export default function Footer({ configSede }) {
  const numeroWhatsApp = configSede?.telefone ? configSede.telefone.replace(/\D/g, '') : '';
  const telefoneFormatado = formatarTelefone(configSede?.telefone);

  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-400 text-xs py-8 px-4 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* COLUNA 1: ASSOCIAÇÃO */}
        <div className="space-y-2">
          <h3 className="text-white font-black uppercase text-sm tracking-wider">Associação Nagashima</h3>
          <p className="text-zinc-500 leading-relaxed">
            Formando campeões dentro e fora do tatame. Tradição, respeito e disciplina no Judô e Artes Marciais.
          </p>
        </div>

        {/* COLUNA 2: CONTATOS DINÂMICOS DO FIREBASE */}
        <div className="space-y-2">
          <h3 className="text-white font-black uppercase text-sm tracking-wider">Contatos</h3>
          
          {configSede?.telefone && (
            <p className="flex items-center gap-2 text-zinc-300">
              <Phone size={14} className="text-red-500" /> {telefoneFormatado}
            </p>
          )}

          {configSede?.email && (
            <p className="flex items-center gap-2 text-zinc-300">
              <Mail size={14} className="text-red-500" /> {configSede.email}
            </p>
          )}

          {configSede?.endereco && (
            <p className="flex items-center gap-2 text-zinc-400">
              <MapPin size={14} className="text-red-500" /> {configSede.endereco} - {configSede.bairroCidade}
            </p>
          )}
        </div>

        {/* COLUNA 3: REDES SOCIAIS DINÂMICAS */}
        <div className="space-y-3">
          <h3 className="text-white font-black uppercase text-sm tracking-wider">Siga Nossas Redes</h3>
          <div className="flex items-center gap-3">
            {configSede?.facebook && (
              <a href={configSede.facebook} target="_blank" rel="noreferrer" className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:text-[#1877F2] hover:bg-zinc-800 transition-all">
                <Facebook size={18} />
              </a>
            )}

            {configSede?.instagram && (
              <a href={configSede.instagram} target="_blank" rel="noreferrer" className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:text-[#E4405F] hover:bg-zinc-800 transition-all">
                <Instagram size={18} />
              </a>
            )}

            {configSede?.youtube && (
              <a href={configSede.youtube} target="_blank" rel="noreferrer" className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:text-[#FF0000] hover:bg-zinc-800 transition-all">
                <Youtube size={18} />
              </a>
            )}

            {numeroWhatsApp && (
              <a href={`https://wa.me/55${numeroWhatsApp}`} target="_blank" rel="noreferrer" className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:text-[#25D366] hover:bg-zinc-800 transition-all">
                <MessageCircle size={18} />
              </a>
            )}
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-zinc-900 mt-8 pt-4 text-center text-zinc-600 text-[11px]">
        © {new Date().getFullYear()} Associação Nagashima de Artes Marciais, Esporte e Cultura. Todos os direitos reservados.
      </div>
    </footer>
  );
}
