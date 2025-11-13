# Wedding React Template — Bruna & Douglas (green/wood)

**Tema:** verde + branco + madeira, com acentos azul-claro.  
**Stack:** React + Vite + TailwindCSS.  
**Pagamentos:** links do Inter Empresas (Pix + Cartão).  
**RSVP:** Netlify Forms (sem backend) — ou substitua por Google Forms (iframe).

## ⚙️ Como rodar
1) Instale as dependências:
   ```bash
   npm i
   ```

2) Rode em modo desenvolvimento:
   ```bash
   npm run dev
   ```

3) Build de produção:
   ```bash
   npm run build
   npm run preview
   ```

## 🚀 Deploy no Netlify ou Vercel
- Netlify: crie um site a partir do repositório ou arraste a pasta após o `npm run build` (pasta `dist`).  
- Vercel: conecte o repositório; framework **Vite** será detectado automaticamente.

## 🧩 Onde editar
- `src/App.jsx` → altere `siteConfig` (nomes, data, Pix, WhatsApp, Maps).  
- `giftsData` → defina os presentes (`title`, `price`, `category`, `image`, `paymentHref`).  
- Para usar arquivos externos (`/src/data/*.json`):
  ```js
  import giftsData from './data/gifts.json'
  import siteConfig from './data/site-config.json'
  ```

## ✍️ Observações
- Tipografia cursiva: **Great Vibes** (Google Fonts) já incluída.
- As imagens de exemplo usam Unsplash (livres para uso). Substitua como quiser.
- Para **Google Forms**: substitua o formulário Netlify por um `<iframe>` do seu Forms.

