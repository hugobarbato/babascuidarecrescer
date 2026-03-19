# Cuidar & Crescer — Site Institucional

Site institucional da **Cuidar & Crescer**, agência de babás especializada em cuidado e desenvolvimento infantil. Permite que famílias solicitem orçamentos personalizados e entrem em contato diretamente.

---

## Funcionalidades

- **Orçamento online** — calculadora interativa para todos os serviços (Nanny Cuidar, Nanny Desenvolver, Vale Night, Eventos, Viagens e Mensalista)
- **Formulário de contato** — envio de e-mail automático com cópia para a empresa
- **reCAPTCHA v3** — proteção anti-bot invisível com validação server-side
- **E-mails transacionais** — templates HTML responsivos via Resend, com detalhamento do orçamento e botão de WhatsApp

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Estilização | Tailwind CSS + shadcn/ui |
| Formulários | React Hook Form + Zod |
| Backend | Express + TypeScript (tsx) |
| E-mail | Resend API |
| Validação | Zod (schema compartilhado entre front e back) |

## Estrutura

```
├── client/          # React (Vite)
│   ├── src/
│   │   ├── pages/       # home.tsx, contact.tsx, service-detail.tsx
│   │   ├── components/  # layout/, quote/, ui/
│   │   └── lib/         # constants.ts, types.ts, quote-calculator.ts
├── server/          # Express
│   ├── routes.ts        # endpoints /api/send-contact e /api/send-quote
│   ├── email.ts         # templates e envio via Resend
│   └── recaptcha.ts     # verificação server-side reCAPTCHA v3
└── shared/
    └── schema.ts        # schemas Zod compartilhados
```

## Rodando localmente

**Pré-requisitos:** Node.js 22+

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Preencha as chaves no .env

# Desenvolvimento (hot reload)
npm run dev

# Build de produção
npm run build
npm start
```

## Variáveis de ambiente

Crie um `.env` a partir do `.env.example`:

| Variável | Descrição |
|----------|-----------|
| `RESEND_API_KEY` | Chave da API Resend para envio de e-mails |
| `COMPANY_EMAIL` | E-mail que recebe cópia dos formulários |
| `RESEND_FROM_EMAIL` | Remetente dos e-mails (ex: `Cuidar & Crescer <noreply@dominio.com>`) |
| `VITE_RECAPTCHA_SITE_KEY` | Site key pública do reCAPTCHA v3 |
| `RECAPTCHA_SECRET_KEY` | Secret key do reCAPTCHA v3 (apenas servidor) |

---

Desenvolvido para [Cuidar & Crescer](https://www.instagram.com/babascuidarecrescer/) · Santos, SP
