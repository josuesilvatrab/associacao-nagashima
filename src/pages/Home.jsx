import React from 'react';
import { Award, Users, Heart } from 'lucide-react';

export default function Home({ setActivePage }) {
  return (
    <div className="bg-nagashima-light min-h-screen">
      {/* Hero Section */}
      <section className="bg-nagashima-dark text-white py-20 px-4 border-b-4 border-nagashima-red">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <span className="bg-nagashima-red/20 text-nagashima-red border border-nagashima-red text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            Projeto Comunitário & Social
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
            Disciplina, Tradição e <span className="text-nagashima-red">Comunidade</span>
          </h1>
          <p className="text-nagashima-silver max-w-2xl mx-auto text-lg">
            Formando não apenas atletas de alto rendimento nas artes marciais, mas cidadãos comprometidos com o respeito e o impacto social.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <button 
              onClick={() => setActivePage('atletas')}
              className="bg-nagashima-red hover:bg-red-700 text-white font-bold px-6 py-3 rounded-md shadow-lg transition"
            >
              Conheça os Atletas
            </button>
            <button 
              onClick={() => setActivePage('eventos')}
              className="border border-white/20 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-md transition"
            >
              Próximos Eventos
            </button>
          </div>
        </div>
      </section>

      {/* Pilares do Projeto */}
      <section className="py-16 max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="p-3 bg-red-50 text-nagashima-red rounded-lg mb-4">
            <Award size={32} />
          </div>
          <h3 className="font-bold text-xl text-nagashima-gray mb-2">Formação Técnica</h3>
          <p className="text-gray-600 text-sm">Treinamento contínuo focado na excelência das artes marciais e no aperfeiçoamento das técnicas.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="p-3 bg-red-50 text-nagashima-red rounded-lg mb-4">
            <Users size={32} />
          </div>
          <h3 className="font-bold text-xl text-nagashima-gray mb-2">Inclusão Social</h3>
          <p className="text-gray-600 text-sm">Espaço aberto para jovens e adultos da comunidade ampliarem suas oportunidades através do esporte.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="p-3 bg-red-50 text-nagashima-red rounded-lg mb-4">
            <Heart size={32} />
          </div>
          <h3 className="font-bold text-xl text-nagashima-gray mb-2">Valores & Cultura</h3>
          <p className="text-gray-600 text-sm">Respeito, humildade e perseverança aplicados dentro e fora do tatame no dia a dia.</p>
        </div>
      </section>
    </div>
  );
}