import React from 'react';
import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-500 py-6 mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Contato Oficial da Academia */}
        <div className="flex flex-wrap items-center gap-4 text-zinc-400 justify-center md:justify-start">
          <span className="flex items-center gap-1.5">
            <Phone size={13} className="text-red-600" />
            (84) 98888-0000
          </span>
          <span className="flex items-center gap-1.5">
            <Mail size={13} className="text-red-600" />
            contato@nagashimadojo.com.br
          </span>
        </div>

        {/* Créditos do Desenvolvedor (Minimalista) */}
        <div className="text-center md:text-right text-[11px] text-zinc-500 font-mono tracking-tight">
          Desenvolvido por <strong className="text-zinc-300 font-sans">Josué Guimarães</strong> • (84) 99451-1117 • <span className="text-zinc-400">josuesilvatrab@gmail.com</span>
        </div>

      </div>
    </footer>
  );
}