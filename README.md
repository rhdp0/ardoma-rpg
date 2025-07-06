# Ardoma RPG - Sistema de Criação de Fichas

Este projeto é um **sistema digital para criar fichas de personagem** do Ardoma RPG, totalmente baseado nas regras oficiais descritas no livro **Ardoma RPG V3**.

## 🎯 O que é Ardoma RPG?

Ardoma RPG é um jogo de interpretação de papéis (RPG) em que os jogadores são **Condutores Espirituais**, pessoas capazes de firmar contratos com entidades chamadas **Ardomas** — seres espirituais que concedem poderes especiais, mas exigem preços a serem pagos.

> É inspirado no sistema Fate, mas com regras próprias de criação de personagens, combate e evolução.

---

## ✅ O que o Sistema Faz?

- Permite ao usuário criar a ficha de personagem via formulário web.
- Calcula automaticamente:
  - HP (Pontos de Vida)
  - PR (Pontos de Recarga)
  - PA (Pontos de Ação)
  - Recuperação de PR
- Gera campos para preencher:
  - Nome
  - Raça
  - Nível
  - Atributos
  - Ardoma inicial (e suas informações)
  - Contratos e desvantagens
  - Vantagens
  - Itens e Anotações
- Exporta a ficha em PDF.
- Layout pronto para impressão.

---

## 💻 Nova Estrutura (Node.js + Express + React)

Com a expansão do projeto, adicionamos um pequeno backend em **Node.js** com **Express** e uma estrutura preparada para um frontend em **React**. A API oferece rotas para:

1. **Login** (`POST /login`) – retorna um token fictício.
2. **Criação e salvamento de fichas** (`POST /characters` e `GET /characters/:id`).
3. **Oráculos** (`GET /oracles/campaign` e `GET /oracles/masterless`).
4. **Rolagem de dados** (`GET /dice/:sides/:count`).

Os dados são mantidos em memória apenas para demonstração. Para algo em produção, configure um banco de dados (PostgreSQL ou MongoDB) e ajuste os modelos.

Para iniciar o servidor durante o desenvolvimento:

```bash
npm install
npm run dev
```

Isso executará `server/index.js` com nodemon.

Abra `client/index.html` em um navegador para testar a tela de login usando React.

---

## 🚀 Como Funciona o Cálculo?

### 1. Atributos

O jogador distribui os valores **4, 3, 2, 1, 0 e -1** entre os atributos:

- **FOR** – Força física
- **CON** – Constituição (resistência física)
- **DES** – Destreza (agilidade)
- **INT** – Inteligência (estratégia, conhecimento)
- **ESP** – Espírito (poder espiritual, recarga de PR)
- **CAR** – Carisma (persuasão, manipulação)

---

### 2. Raças

Cada raça oferece bônus e efeitos específicos:

- **Humano** → +1 em qualquer atributo. Começa com uma Ardoma extra.
- **Vey’rei** → -1 PR no custo de uma ativação por cena. Vulneráveis à corrupção espiritual.
- **Drakkarim** → Convertem custos de Ardomas em bônus temporários (+2). Risco de surto espiritual.
- **Oskari** → Canalizam uma Ardoma sem custo 1x/dia. Limitados a 2 Ardomas permanentes.

---

### 3. HP (Pontos de Vida)

- HP inicial: **CON × 10**
- Para níveis acima do 1: HP = CON × [10 + (Nível – 1) × 3]


- Se CON ≤ 0, HP mínimo = 10

**Exemplos:**

| Nível | CON | HP  |
|-------|-----|-----|
| 1     | 4   | 40  |
| 2     | 4   | 52  |
| 3     | 4   | 64  |

---

### 4. PR (Pontos de Recarga)

Nova fórmula oficial: PR = (Nível × (1 + ESP)) + 2


- Se ESP ≤ 0, considera ESP = 0 na fórmula.

**Exemplos:**

| Nível | ESP | PR  |
|-------|-----|-----|
| 1     | 0   | 3   |
| 1     | 4   | 7   |
| 3     | 2   | 11  |

---

### 5. Recuperação de PR

Após cada **turno** ou cena, o Condutor recupera: 1 PR + 1 PR extra a cada 2 pontos no atributo escolhido


- O atributo é escolhido no momento da criação do personagem entre:
  - **CON** ou
  - **INT**

**Exemplos:**

| Atributo (CON ou INT) | PR Recuperado |
|------------------------|---------------|
| -1 a 1                 | 1             |
| 2 a 3                  | 2             |
| 4 a 5                  | 3             |
| 6 a 7                  | 4             |
| 8                      | 5             |

---

### 6. PA (Pontos de Ação)

- Todos possuem **4 PA** por rodada.
- Cada ação (atacar, ativar Ardoma, correr etc.) consome de 1 a 4 PA.
- No início de cada rodada, os PA são restaurados.

---

### 7. Estresse

- Personagem começa com **3 caixas de estresse**: (1), (2), (3).
- Podem ser usadas para:
  - Aumentar o resultado de testes
  - Ativar Ardomas sem pagar custo
- Recuperação ocorre em descanso ou cenas narrativas.

---

### 8. Ardomas

São entidades espirituais com quem o Condutor firma contratos.

#### Tipos:

- **Sopro** → efeito passivo contínuo
- **Fangue** → arma espiritual
- **Veia** → habilidade ativa
- **Sintoma** → fusão do Condutor com a Ardoma
- **Eco** → manifestação física
- **Véu** → manipulação do ambiente ou regras espirituais

#### Cada Ardoma possui:

- Nome
- Tipo
- Estágio
- Efeito/Poder
- Custo de Ativação (PR + condição narrativa)
- Contrato / Desvantagem
- Condição de Evolução

  
