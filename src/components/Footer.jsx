import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

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
  const telefoneFormatado = formatarTelefone(configSede?.telefone);

  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-400 text-xs py-8 px-4 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* COLUNA 1: ASSOCIAÇÃO */}
        <div className="space-y-2">
          <h3 className="text-white font-black uppercase text-sm tracking-wider">Associação Nagashima</h3>
          <p className="text-zinc-500 leading-relaxed">
            Formando campeões dentro e fora do tatame. Tradição, respeito e disciplina no Judô e Artes Marciais.
          </p>
        </div>

        {/* COLUNA 2: CONTATOS */}
        <div className="space-y-2">
          <h3 className="text-white font-black uppercase text-sm tracking-wider">Contatos & Sede</h3>
          
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

        {/* COLUNA 3: CRÉDITOS DO CRIADOR (ACIMA Á DIREITA) */}
        <div className="space-y-1 text-left md:text-right">
          <p className="font-extrabold text-red-500 uppercase tracking-wide text-xs">
            Criador: Josué Guimarães
          </p>
          <p className="text-zinc-400 font-semibold text-[11px]">
            Contato: (84) 99451-1117
          </p>
        </div>

      </div>

      {/* RODAPÉ INFERIOR: DIREITOS RESERVADOS CENTRALIZADO */}
      <div className="max-w-7xl mx-auto border-t border-zinc-900 mt-8 pt-4 text-center text-zinc-600 text-[11px]">
        © {new Date().getFullYear()} Associação Nagashima de Artes Marciais, Esporte e Cultura. Todos os direitos reservados.
      </div>
    </footer>
  );
}
