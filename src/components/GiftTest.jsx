// PixGeneratorFixedEmail.jsx
import { useState } from "react";
import QRCode from "qrcode";

/* ----------------- Helpers ----------------- */
function isEmail(s) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);
}
function normalize(str = "", max = 99) {
  const noEmoji = str.replace(/([\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}])/gu, "");
  return noEmoji
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s.\-]/g, "")
    .toUpperCase()
    .slice(0, max);
}
function crc16(payload) {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : (crc << 1);
      crc &= 0xFFFF;
    }

    
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}
const tlv = (id, value) => id + String(value.length).padStart(2, "0") + value;


 function buildPixPayload({ key, amount, merchantName, merchantCity }) {
  if (!isEmail(key)) {
    throw new Error("Chave Pix inválida: precisa ser um e-mail válido.");
  }

  const name = normalize(merchantName || "RECEBEDOR", 25);
  const city = normalize(merchantCity || "SAO PAULO", 15);

  // 26 - Merchant Account Information (somente GUI + chave)
  const gui = tlv("00", "br.gov.bcb.pix");
  const chave = tlv("01", key.trim());
  const t26 = tlv("26", gui + chave);

  // Campos principais
  const t00 = tlv("00", "01");     // formato EMV
  // SEM t01 aqui (Point of Initiation Method)
  const t52 = tlv("52", "0000");
  const t53 = tlv("53", "986");
  const t54 = (amount != null && !isNaN(amount))
    ? tlv("54", Number(amount).toFixed(2))
    : "";
  const t58 = tlv("58", "BR");
  const t59 = tlv("59", name);
  const t60 = tlv("60", city);

  // TXID *** (estático, super comum)
  const t62 = tlv("62", tlv("05", "***"));

  const semCRC = t00 + t26 + t52 + t53 + t54 + t58 + t59 + t60 + t62 + "6304";
  const crc = crc16(semCRC);
  return semCRC + crc;
}


// /* ----------------- Build BR Code ----------------- */
// function buildPixPayload({ key, amount, merchantName, merchantCity, txid, description }) {
//   if (!isEmail(key)) throw new Error("Chave Pix inválida: precisa ser um e-mail válido.");
//   const name = normalize(merchantName || "RECEBEDOR", 25);
//   const city = normalize(merchantCity || "SAO PAULO", 15);
//   // const _txid = (txid || ("T" + Date.now())).replace(/\s/g, "").replace(/[^A-Za-z0-9]/g, "").slice(0, 25);

// // const desc = ""; // ou só se amount == null
// const _txid = ("T" + Date.now().toString().slice(-8)).replace(/\D/g, "");

//   const gui = tlv("00", "br.gov.bcb.pix");
//   const chave = tlv("01", key.trim());
//   let desc = amount === null ? description ? normalize(description, 50) :  "" : "";
//   const fitMAI = (d) => {
//     const dTlv = d ? tlv("02", d) : "";
//     const value26 = gui + chave + dTlv;
//     return { value26, len: value26.length };
//   };
//   let { value26, len } = fitMAI(desc);
//   if (len > 99) {
//     while (desc.length > 0 && fitMAI(desc).len > 99) desc = desc.slice(0, -1);
//     const again = fitMAI(desc);
//     value26 = again.len <= 99 ? again.value26 : fitMAI("").value26;
//   }
//   const t26 = tlv("26", value26);

//   const t00 = tlv("00", "01");
//   const t01 = tlv("01", "11"); // estático
//   const t52 = tlv("52", "0000");
//   const t53 = tlv("53", "986");
//   const t54 = (amount != null && !isNaN(amount)) ? tlv("54", Number(amount).toFixed(2)) : "";
//   const t58 = tlv("58", "BR");
//   const t59 = tlv("59", name);
//   const t60 = tlv("60", city);
//   const t62 = tlv("62", tlv("05", _txid));
//   const semCRC = t00 + t01 + t26 + t52 + t53 + t54 + t58 + t59 + t60 + t62 + "6304";
//   const crc = crc16(semCRC);
//   return semCRC + crc;
// }

/* --------------- Componente (usa email fixo) -------------- */
/**
 * Props opcionais:
 * - fixedEmail (string) — sua chave Pix (email). DEFAULT: "seu@email.com"
 * - defaultAmount (number or null) — valor inicial. null = aberto.
 * - merchantName, merchantCity, defaultDesc
 */
export default function PixGeneratorFixedEmail({
  fixedEmail = "bruna.vieira.t@hotmail.com",
  defaultAmount = 50,
  merchantName = "BRUNA",
  merchantCity = "SAO PAULO",
  defaultDesc = "PRESENTE CASAMENTO"
}) {
  const [amount, setAmount] = useState(defaultAmount == null ? "" : String(defaultAmount));
  const [txid, setTxid] = useState("");
  const [description, setDescription] = useState(defaultDesc);
  const [brcode, setBrcode] = useState("");
  const [qr, setQr] = useState("");
  const [error, setError] = useState("");

  const generate = async ({ autoTxid = true } = {}) => {
    try {
      setError("");
      setBrcode("");
      setQr("");
      if (!isEmail(fixedEmail)) throw new Error("Chave fixa inválida: verifique o e-mail informado no componente.");
      const value = amount === "" ? null : Number(amount.replace(",", "."));
      if (amount !== "" && (isNaN(value) || value <= 0)) throw new Error("Valor inválido. Use número maior que 0 ou deixe vazio para valor em aberto.");
      const finalTxid = autoTxid ? `T${Date.now().toString().slice(-10)}` : (txid || `T${Date.now().toString().slice(-6)}`);
      // const payload = buildPixPayload({
      //   key: fixedEmail.trim(),
      //   amount: value,
      //   merchantName,
      //   merchantCity,
      //   txid: finalTxid,
      //   description
      // });
      const payload = buildPixPayload({
      key: fixedEmail.trim(),
      amount: value,
      merchantName,
      merchantCity
  // TXID/description não entram aqui
});

      setBrcode(payload);
      const dataUrl = await QRCode.toDataURL(payload, { margin: 1, width: 256 });
      setQr(dataUrl);
    } catch (e) {
      setError(e.message || "Erro ao gerar PIX");
    }
  };

  const copyCode = async () => {
    if (!brcode) return;
    await navigator.clipboard.writeText(brcode);
    // alert("PIX (copia e cola) copiado!");
  };

  return (
    <div className="w-full lg:w-[520px] mx-auto border border-gray-200 rounded-lg p-4">
      <h3 style={{ marginTop: 0 }}>Gerar PIX (chave fixa: e-mail)</h3>

      <div style={{ marginBottom: 8 }}>
        <strong>Chave (fixa):</strong> <span>{fixedEmail}</span>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div  style={{ display: "flex", alignItems:"center"}}>
          <label>Valor (R$) </label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="ex.: 50,00" style={{ width: "80%", padding: 3, marginLeft: 15, border:"1px solid silver" }} />
        </div>
        {/* <div>
          <label>TXID (opcional)</label>
          <input value={txid} onChange={(e) => setTxid(e.target.value)} placeholder="ou gerado automaticamente" style={{ width: "100%", padding: 8 }} />
        </div> */}
      </div>

      <label style={{ display: "block", marginTop: 8 }}>Descrição</label>
      {/* <input value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%", padding: 8 }} /> */}
      <p >{description} </p>

      <div style={{ display: "flex", justifyContent:"center", gap: 8, marginTop: 12 }}>
        <button onClick={() => generate({ autoTxid: true })} style={{ padding: "10px 14px", borderRadius: 8, background: "#10b981", color: "#fff", border: 0 }}>
          Gerar PIX 
        </button>
        {/* <button onClick={() => generate({ autoTxid: false })} style={{ padding: "10px 14px", borderRadius: 8, background: "#06b6d4", color: "#fff", border: 0 }}>
          Gerar PIX (usar TXID informado)
        </button> */}
      </div>

      {error && <div style={{ marginTop: 10, color: "#b91c1c", fontWeight: 600 }}>{error}</div>}

      {brcode && (
        <div style={{ marginTop: 14, display: "grid", justifyItems: "center", gap: 10 }}>
          {qr ? <img alt="QR Pix" src={qr} /> : <span>Gerando QR…</span>}
          <code style={{ whiteSpace: "pre-wrap", wordBreak: "break-all", fontSize: 12 }}>{brcode}</code>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={copyCode} style={{ padding: "8px 12px", borderRadius: 8, background: "#10b981", color: "#fff", border: 0 }}>
              Copiar chave PIX
            </button>
            {qr && <a href={qr} download="pix-qr.png" style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", textDecoration: "none" }}>Baixar QR</a>}
          </div>
        </div>
      )}

      {/* <p style={{ fontSize: 12, color: "#6b7280", marginTop: 12 }}>
        Observação: use um e-mail que esteja cadastrado como sua chave Pix no banco. Se algum app acusar "inválido", teste deixar descrição vazia e deixe txid curto; Nubank pode exibir aviso se a chave foi desativada no app.
      </p> */}
    </div>
  );
}
