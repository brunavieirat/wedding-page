import { useMemo, useState } from "react";
import { siteConfig } from "../utils/config";
import Button from "./Button";
import Container from "./Container";
import GiftCard from "./GiftCard";

const GiftsSection = ({ gifts }) => {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState();

  // const categories = [
  //   { id: 'all', label: 'Todos' },
  //   { id: 'experiencias', label: 'Experiências' },
  //   { id: 'hospedagem', label: 'Hospedagem' },
  //   { id: 'gastronomia', label: 'Gastronomia' },
  //   { id: 'casa', label: 'Casa' },
  //   { id: 'viagem', label: 'Viagem' },
  // ];

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return gifts.filter((g) => {
      const textOk = !text || `${g.title} ${g.description}`.toLowerCase().includes(text);
      const catOk = category === 'all' || g.category === category;
      const priceOk = maxPrice === undefined || g.price <= maxPrice;
      return textOk && catOk && priceOk;
    });
  }, [gifts, q, category, maxPrice]);

  return (
    <section id="presentes" className="py-16 bg-gradient-to-b from-sky-50/40 to-white">
      <Container>
        <h2 className="font-great-vibes text-5xl mb-4 text-emerald-900 text-center">Lista de Presentes</h2>
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3 grid md:grid-cols-4 gap-3 mb-6">
          <label className="grid gap-1">
            <span className="text-sm text-emerald-900">Buscar</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ex.: jantar..." className="border rounded-xl px-3 py-2 border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-600" />
          </label>
        
          <label className="grid gap-1">
            <span className="text-sm text-emerald-900">Preço máximo (R$)</span>
            <input type="number" min={0} value={maxPrice ?? ''} onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)} placeholder="ex.: 200" className="border rounded-xl px-3 py-2 border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-600" />
          </label>
            <label className="grid gap-1">
            {/* <span className="text-sm text-emerald-900">Categoria</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded-xl px-3 py-2 border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-600">
              {categories.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}
            </select> */}
          </label>
          <div className="flex items-end justify-end">
            <Button variant="outline" onClick={() => { setQ(''); setCategory('all'); setMaxPrice(undefined); }} className="w-full ml-auto">Limpar filtros</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((gift) => <GiftCard key={gift.id} gift={gift} />)}
        </div>
        <p className="text-slate-500 text-sm mt-4 text-center">Prefere Pix livre? Nossa chave: <span className="font-semibold text-emerald-700">{siteConfig.pixKey}</span></p>
      </Container>
    </section>
  );
};


export default GiftsSection;