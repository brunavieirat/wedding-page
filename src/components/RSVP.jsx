import { useState } from "react";
import Container from "./Container";
import Button from "./Button";
import { siteConfig } from "../utils/config";

const RSVP = ({ pixKey, mapsHref, whatsappHref }) => {
  const [qty, setQty] = useState(1);
  const [guests, setGuests] = useState([{ name: "", age: "" }]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxdvMpLx4bW6ILDWmRGWiNjYn5RizyZejAeX7J4W0akqjeE7QPSSuoNJSM4-FwCrklj_w/exec"; // <-- cole sua URL aqui

  const handleQtyChange = (e) => {
    const n = parseInt(e.target.value, 10) || 1;
    setQty(n);
    setGuests((prev) => {
      const clone = [...prev];
      if (n > clone.length) {
        // adiciona vazios
        return [...clone, ...Array.from({ length: n - clone.length }, () => ({ name: "", age: "" }))];
      } else {
        // reduz
        return clone.slice(0, n);
      }
    });
  };

  const updateGuest = (index, field, value) => {
    setGuests((prev) => {
      const clone = [...prev];
      clone[index] = { ...clone[index], [field]: value };
      return clone;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validação simples
    for (let i = 0; i < guests.length; i++) {
      if (!guests[i].name?.trim()) {
        alert(`Preencha o nome da pessoa ${i + 1}`);
        return;
      }
      if (!guests[i].age?.toString().trim()) {
        alert(`Preencha a idade da pessoa ${i + 1}`);
        return;
      }
    }

    setIsSending(true);
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        qty,
        guests, // [{name, age}, ...]
        message,
        // você pode adicionar mais campos aqui se quiser (ex: mensagem)
      };

      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Apps Script público aceita sem CORS
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // como "no-cors" não retorna status, consideramos sucesso se não quebrou:
      setSent(true);
    } catch (err) {
      console.error(err);
      alert("Houve um erro ao enviar. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="rsvp" className="py-16 bg-gradient-to-b from-emerald-50 to-white">
      <Container>
        <div className="text-center mb-10">
          <h2 className="font-great-vibes text-5xl text-emerald-900 mb-2">Sobre o evento</h2>
          <p className="text-slate-700 max-w-3xl mx-auto">
            Almoço intimista para a família, Sábado <strong>06 de dezembro às 13h</strong>.<br />
            Esperamos você para celebrar conosco esse momento tão especial! ♥
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-emerald-900 text-white rounded-2xl p-8 flex flex-col justify-center items-center bg-[url('/img/IMG_0977.jpg')] bg-cover bg-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/75" />
            <div className="relative center z-10 text-center">
              <h3 className="font-great-vibes text-black text-4xl mb-4 font-semibold">Detalhes</h3>
              <p className="text-black"> Data: {siteConfig.couple.dateLabel}</p>
              <p className="text-black m-1 ">Local: {siteConfig.couple.local}
                <br></br> {siteConfig.couple.cityArea}</p>
               <Button href={mapsHref} target="_blank" variant="outline" className="m-5">Como chegar</Button>
             {/* <p className="text-black mb-2">Chave Pix:</p>
              <code className="bg-white/80 text-emerald-900 px-3 py-1 rounded-lg font-semibold">
              {pixKey}</code>
              <div className="mt-4">
              
                
              </div> */}

              {/* <p className="text-black mb-3 font-semibold">“Nada de formalidades: só amor, risadas e bons momentos.” </p> */}
            </div>
          </div>

          <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-emerald-900 mb-3">Confirmação de Presença</h3>

            {!sent ? (
              <form className="grid gap-3" onSubmit={handleSubmit}>
                {/* Quantidade de pessoas */}
                <label className="text-sm text-slate-700">Quantas pessoas vão?
                  <select
                    value={qty}
                    onChange={handleQtyChange}
                    className="mt-1 w-full border rounded-xl px-3 py-2 border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>

                {/* Campos dinâmicos para cada pessoa */}
                <div className="grid gap-4 mt-2">
                  {guests.map((g, i) => (
                    <div key={i} className="grid md:grid-cols-2 gap-3 border border-emerald-100 rounded-xl p-3">
                      <div>
                        <label className="text-sm text-slate-700">Nome da pessoa {i + 1}
                          <input
                            required
                            placeholder={`Nome da pessoa ${i + 1}`}
                            value={g.name}
                            onChange={(e) => updateGuest(i, "name", e.target.value)}
                            className="mt-1 w-full border rounded-xl px-3 py-2 border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="text-sm text-slate-700">Idade
                          <input
                            required
                            type="number"
                            min="0"
                            placeholder="Idade"
                            value={g.age}
                            onChange={(e) => updateGuest(i, "age", e.target.value)}
                            className="mt-1 w-full border rounded-xl px-3 py-2 border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mensagem opcional (se quiser manter) */}
                <textarea
                  name="mensagem"
                  rows={3}
                  placeholder="Mensagem aos noivos (opcional)"
                  className="border rounded-xl px-3 py-2 border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                />

                <Button type="submit" disabled={isSending}>
                  {isSending ? "Enviando..." : "Confirmar presença"}
                </Button>

                <Button href={whatsappHref} className="text-center border-transparent" variant="outline" target="_blank">Falar com os noivos</Button>
              </form>
            ) : (
              <div className="text-emerald-700 font-medium">
                Obrigado! Sua presença foi confirmada 🎉
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default RSVP;
