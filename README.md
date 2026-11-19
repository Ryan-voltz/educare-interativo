# Grupo Educare — Mapa Interativo de Atuação Municipal (Undime 2026)

Aplicação web interativa e de alta fidelidade desenvolvida especificamente para exibição no estande do **Grupo Educare** durante o evento da **Undime** (União dos Dirigentes Municipais de Educação).

Permite que a equipe de atendimento (Vitória e consultores pedagógicos) apresente a capilaridade, projetos educacionais, métricas de alfabetização/IDEB e materiais didáticos para gestores, secretários de educação e prefeitos municipais da Bahia e do Brasil.

---

## 🚀 Links e Acesso Imediato

- **Deploy em Produção (Vercel):** `https://snappy-tungsten-c54262b.tmp.now`
- **Link para Vincular à Conta Definitiva Vercel:** `https://vercel.com/claim-deployment?code=94668a77-c775-4326-b7d6-7216c5b91bcc` (sem custo de domínio)

---

## ✏️ Como atualizar os dados do estande

- **WhatsApp da Vitória (QR code e botões):** `src/config/contato.ts` → `VITORIA_WHATSAPP` (só dígitos, com 55 + DDD).
- **Contratos por estado:** `src/data/educareData.ts` → `BRASIL_STATES_DATA` e `TOTAL_CONTRATOS_BRASIL`. A divisão por estado é **estimada**; com os números oficiais, mude `CONTRATOS_ESTADOS_ESTIMADOS` para `false`.
- **Municípios da Bahia:** o mapa mostra os 417 municípios como atendidos (mais de 400). O número de contratos aparece só por estado, na visão Brasil.
- **Logos:** `public/brand/` (Grupo Educare, vinda do site oficial, e Atacado GE).

---

## 🌟 Funcionalidades Implementadas

1. **Identidade Visual Fiel:**
   - Reprodução exata do slide/banner de referência: logo do Grupo Educare (com as folhas/páginas coloridas), azul marinho institucional, azul de destaque, laranja e verde.
   - Card lateral com contador animado **"400+ municípios atendidos na Bahia"** e os 3 pilares estratégicos:
     - 📖 **Projetos educacionais:** Coleções pedagógicas, alfabetização e laboratórios maker.
     - 👥 **Diálogo com gestores:** Formação continuada e assessoria técnica às secretarias.
     - 🎯 **Propostas alinhadas:** Customização total para as necessidades de cada rede.

2. **Mapa Interativo da Bahia:**
   - Malha geográfica municipal oficial do IBGE com todos os 417 municípios baianos.
   - Todos os municípios em azul Educare: mais de 400 redes baianas atendidas.
   - Suporte a toque (tablet/iPad/touchscreen), zoom com botões (+/-) e pan (arrastar).
   - Tooltip instantâneo ao passar o cursor ou tocar em qualquer cidade.

3. **Visão de Expansão Nacional (Brasil):**
   - Alternador rápido no topo: `[ Bahia ]` e `[ Nacional ]`.
   - Mapeamento de 10 estados com presença ou projetos do Grupo Educare.

4. **Gaveta de Detalhes do Município (Drawer Lateral):**
   - Nome, mesorregião e data de início da parceria (ex: "Desde 2021").
   - Indicadores de impacto: Escolas atendidas, alunos beneficiados, professores capacitados e evolução no IDEB / alfabetização.
   - Depoimento real/recomendação de coordenadores pedagógicos.
   - Botão direto de contato WhatsApp preenchido para o consultor do estande.

5. **Modais Interativos de Conteúdo:**
   - 📄 **Folder Pedagógico Interativo (PDF):** Visualizador de catálogo com navegação por páginas, matriz de competências da BNCC, conteúdos por bimestre e botão para download do PDF.
   - 🎬 **Player de Vídeo Demonstrativo:** Apresentação prática dos projetos nas escolas, com controles de reprodução e depoimentos.

6. **Filtros e Busca Inteligente:**
   - Campo de pesquisa rápida por nome da cidade com auto-foco no mapa.
   - Filtros por segmento: *Todos, Alfabetização, Robótica Maker, Socioemocional e Gestão*.

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** React 19 + TypeScript + Vite
- **Estilização:** Tailwind CSS v4
- **Projeção Geográfica:** D3-Geo (Mercator Projection otimizada para o polígono da Bahia e Brasil)
- **Dados Cartográficos:** GeoJSON vetorial com malha oficial do IBGE
- **Ícones:** Lucide React

---

## 💻 Execução Local

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em modo de desenvolvimento
npm run dev

# 3. Gerar build de produção
npm run build
```

---

## 🌐 Publicação Permanente na Vercel

Para vincular ao seu time ou conta permanente da Vercel com um subdomínio customizado (ex: `educare-bahia.vercel.app`):

```bash
# 1. Fazer login na Vercel CLI (gratuito)
npx vercel login

# 2. Publicar em produção
npx vercel --prod
```
