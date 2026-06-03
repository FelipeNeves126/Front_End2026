# Tutorial: TERMO

Neste tutorial você vai construir o **TERMO** — a versão brasileira do Wordle — usando React. Você precisa descobrir uma palavra secreta de 5 letras em até 6 tentativas. A cada palpite, cada letra ganha uma cor: verde se está na posição certa, amarelo se existe na palavra mas em outro lugar, e cinza se não existe.

Este tutorial assume que você já entende o básico de React (componentes, props e estado com `useState`). Se ainda não estiver confortável com isso, vale construir antes o [Jogo da Forca](#) — ele cobre todos esses fundamentos com calma. Aqui vamos um pouco além: você também vai aprender sobre **estado derivado mais elaborado**, **algoritmos dentro de componentes** e o Hook **`useEffect`** para reagir ao teclado físico.

> **Nota**
>
> Este tutorial foi pensado para quem aprende fazendo. Vá digitando o código você mesmo sempre que puder — copiar e colar funciona, mas digitar fixa muito melhor.

O tutorial está dividido em:

- [Configuração](#configuração) — o ponto de partida.
- [Visão geral](#visão-geral) — como o jogo é estruturado.
- [Construindo a grade](#construindo-a-grade) — `Celula`, `Linha` e `Grade`.
- [Digitando palpites](#digitando-palpites) — estado e teclado na tela.
- [Avaliando as cores](#avaliando-as-cores) — o coração do jogo.
- [Finalizando](#finalizando) — vitória, derrota, teclado físico e reiniciar.

## O que você vai construir?

Um jogo de adivinhação de palavras com:

- Uma **grade** de 6 linhas por 5 colunas.
- Um **teclado na tela** que também colore as letras já usadas.
- Suporte ao **teclado físico** do computador.
- Detecção de **vitória e derrota** e um botão para jogar de novo.

## Configuração

Crie um projeto com [Vite](https://vite.dev/) (você precisa do [Node.js](https://nodejs.org/) instalado):

```bash
npm create vite@latest termo -- --template react
cd termo
npm install
npm run dev
```

Ou, se preferir não instalar nada, use o [CodeSandbox](https://codesandbox.io/) ou o [StackBlitz](https://stackblitz.com/) com o modelo React.

Vamos organizar o projeto em vários arquivos. A estrutura final será esta:

```
src/
├── main.jsx
├── Jogo.jsx
├── palavras.js
├── avaliacao.js
├── styles.css
└── components/
    ├── Grade.jsx
    ├── Linha.jsx
    ├── Celula.jsx
    └── Teclado.jsx
```

Não precisa criar todos agora — vamos construindo aos poucos.

## Visão geral

Antes de escrever código, vale entender como o jogo "pensa". Três informações descrevem completamente o estado de uma partida:

1. **A palavra secreta** (ex.: `'TERMO'`).
2. **As tentativas já enviadas** (uma lista de palavras, ex.: `['JOGAR', 'VERDE']`).
3. **A tentativa que está sendo digitada agora** (ex.: `'TER'`).

Tudo o mais — se o jogador venceu, se perdeu, quais cores mostrar — pode ser **calculado** a partir dessas três coisas. Esse é o princípio do **estado derivado**: guardamos o mínimo possível e derivamos o resto.

Vamos começar definindo as palavras. Crie o arquivo `src/palavras.js`:

```js
export const PALAVRAS = [
  'TERMO', 'JOGAR', 'LIVRO', 'PRAIA', 'VERDE',
  'NOITE', 'CAMPO', 'FESTA', 'MUNDO', 'PEDRA',
  'FORTE', 'GRADE', 'LETRA', 'PALCO', 'RITMO',
  'SONHO', 'VIDRO', 'ZEBRA', 'FRUTA', 'NUVEM',
];

export const TAMANHO = 5;
export const MAX_TENTATIVAS = 6;

export function escolherPalavra() {
  return PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)];
}
```

Mantemos as palavras em MAIÚSCULAS e sem acentos para simplificar — lidar com acentos fica como desafio no final.

## Construindo a grade

Vamos construir a grade de baixo para cima: primeiro a célula, depois a linha, depois a grade inteira.

### A célula

Uma célula mostra uma letra (ou nada) e tem uma cor dependendo do seu status. Crie `src/components/Celula.jsx`:

```jsx
export default function Celula({ letra, status }) {
  return <div className={`celula ${status}`}>{letra}</div>;
}
```

Repare que o `status` (por exemplo `'correta'`, `'presente'`, `'ausente'`) entra direto como classe CSS. Toda a aparência da cor vai morar no CSS — o componente só decide *qual* classe usar.

### A linha

Uma linha tem 5 células. Ela recebe uma `tentativa` (a palavra digitada ou enviada), a `secreta`, e se já foi `enviada`. Crie `src/components/Linha.jsx`:

```jsx
import Celula from './Celula.jsx';
import { avaliarTentativa } from '../avaliacao.js';
import { TAMANHO } from '../palavras.js';

export default function Linha({ tentativa, enviada, secreta }) {
  const letras = tentativa.padEnd(TAMANHO).split('');
  const avaliacao = enviada ? avaliarTentativa(tentativa, secreta) : [];

  return (
    <div className="linha">
      {letras.map((letra, i) => {
        let status;
        if (enviada) {
          status = avaliacao[i];
        } else {
          status = letra.trim() ? 'preenchida' : 'vazia';
        }
        return <Celula key={i} letra={letra.trim()} status={status} />;
      })}
    </div>
  );
}
```

Alguns truques aqui:

- `tentativa.padEnd(TAMANHO)` completa a palavra com espaços até ter 5 caracteres. Assim, `'TER'` vira `'TER  '` e sempre temos 5 células, mesmo que o jogador só tenha digitado parte.
- Se a linha já foi `enviada`, calculamos as cores com `avaliarTentativa` (que escreveremos já já). Se não, a célula está apenas `'preenchida'` (tem letra) ou `'vazia'`.
- A função `avaliarTentativa` ainda não existe — vamos criá-la na seção [Avaliando as cores](#avaliando-as-cores). Por enquanto o import vai dar erro; tudo bem, já voltamos nele.

### A grade

A grade decide o que cada uma das 6 linhas deve mostrar. Crie `src/components/Grade.jsx`:

```jsx
import Linha from './Linha.jsx';
import { MAX_TENTATIVAS } from '../palavras.js';

export default function Grade({ tentativas, tentativaAtual, secreta }) {
  const linhas = [];

  for (let i = 0; i < MAX_TENTATIVAS; i++) {
    if (i < tentativas.length) {
      linhas.push(
        <Linha key={i} tentativa={tentativas[i]} enviada={true} secreta={secreta} />
      );
    } else if (i === tentativas.length) {
      linhas.push(
        <Linha key={i} tentativa={tentativaAtual} enviada={false} secreta={secreta} />
      );
    } else {
      linhas.push(
        <Linha key={i} tentativa="" enviada={false} secreta={secreta} />
      );
    }
  }

  return <div className="grade">{linhas}</div>;
}
```

A lógica é direta: as linhas com índice menor que o número de tentativas já foram **enviadas**; a linha logo abaixo é a que está sendo **digitada**; e as demais ficam **vazias**.

## Digitando palpites

Agora vamos ao componente principal, que guarda o estado e amarra tudo. Crie `src/Jogo.jsx`:

```jsx
import { useState } from 'react';
import Grade from './components/Grade.jsx';
import { escolherPalavra, TAMANHO } from './palavras.js';

export default function Jogo() {
  const [secreta, setSecreta] = useState(escolherPalavra);
  const [tentativas, setTentativas] = useState([]);
  const [tentativaAtual, setTentativaAtual] = useState('');

  function digitar(letra) {
    if (tentativaAtual.length < TAMANHO) {
      setTentativaAtual(tentativaAtual + letra);
    }
  }

  function apagar() {
    setTentativaAtual(tentativaAtual.slice(0, -1));
  }

  function enviar() {
    if (tentativaAtual.length !== TAMANHO) return;
    setTentativas([...tentativas, tentativaAtual]);
    setTentativaAtual('');
  }

  return (
    <div className="jogo">
      <h1>TERMO</h1>
      <Grade
        tentativas={tentativas}
        tentativaAtual={tentativaAtual}
        secreta={secreta}
      />
    </div>
  );
}
```

Veja como mapeamos exatamente as três informações da [Visão geral](#visão-geral) em três variáveis de estado: `secreta`, `tentativas` e `tentativaAtual`.

As três funções (`digitar`, `apagar`, `enviar`) seguem a regra de ouro do React: nunca modificam o estado direto, sempre criam um valor novo (`tentativaAtual + letra`, `[...tentativas, tentativaAtual]`). Em `enviar`, só aceitamos a palavra se ela tiver as 5 letras.

> **Nota**
>
> Passamos `escolherPalavra` (sem parênteses) para o `useState`. Assim o React chama a função só uma vez, na primeira renderização, para definir o valor inicial — é o chamado *inicializador preguiçoso*.

### O teclado na tela

Ainda não dá pra digitar nada. Vamos criar o teclado. Por enquanto, sem cores. Crie `src/components/Teclado.jsx`:

```jsx
const LINHAS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

export default function Teclado({ onTecla, desabilitado }) {
  return (
    <div className="teclado">
      {LINHAS.map((linha, i) => {
        const ultima = i === LINHAS.length - 1;
        return (
          <div key={i} className="teclado-linha">
            {ultima && (
              <button className="tecla tecla-larga" onClick={() => onTecla('ENTER')} disabled={desabilitado}>
                Enter
              </button>
            )}
            {linha.split('').map((letra) => (
              <button
                key={letra}
                className="tecla"
                onClick={() => onTecla(letra)}
                disabled={desabilitado}
              >
                {letra}
              </button>
            ))}
            {ultima && (
              <button className="tecla tecla-larga" onClick={() => onTecla('APAGAR')} disabled={desabilitado}>
                ⌫
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

O teclado não conhece as regras do jogo — ele só avisa o pai "essa tecla foi pressionada" através da prop `onTecla`. As teclas especiais mandam os textos `'ENTER'` e `'APAGAR'`.

Agora conecte o teclado no `Jogo`. Adicione a função que traduz a tecla na ação certa e renderize o `Teclado`:

```jsx
// ...dentro de Jogo, junto das outras funções:
function onTecla(tecla) {
  if (tecla === 'ENTER') enviar();
  else if (tecla === 'APAGAR') apagar();
  else digitar(tecla);
}
```

```jsx
// ...no return, depois da <Grade />:
<Teclado onTecla={onTecla} />
```

Não esqueça de importar o `Teclado` no topo:

```jsx
import Teclado from './components/Teclado.jsx';
```

Agora você já consegue digitar letras e ver elas aparecerem na grade. Mas ao enviar uma tentativa, as letras não ganham cor — porque a função `avaliarTentativa` ainda não existe. Vamos resolver isso agora.

## Avaliando as cores

Esta é a parte mais importante (e mais sutil) do jogo. A regra ingênua seria: "verde se a letra está na posição certa, amarelo se está na palavra, cinza caso contrário". O problema aparece com **letras repetidas**.

Imagine a palavra secreta `ZEBRA` e o palpite `ARARA`. Existe só **um** `A` em `ZEBRA`, e ele combina com o último `A` de `ARARA` (verde). Os outros dois `A` de `ARARA` não deveriam virar amarelo — não há mais `A` "sobrando" na palavra secreta.

A solução é trabalhar em **duas passadas**, controlando quantas vezes cada letra ainda está disponível. Crie `src/avaliacao.js`:

```js
export function avaliarTentativa(tentativa, secreta) {
  const resultado = Array(tentativa.length).fill('ausente');

  // Conta quantas vezes cada letra aparece na palavra secreta.
  const restantes = {};
  for (const letra of secreta) {
    restantes[letra] = (restantes[letra] || 0) + 1;
  }

  // 1ª passada: marca as letras corretas (verde) e "consome" essas letras.
  for (let i = 0; i < tentativa.length; i++) {
    if (tentativa[i] === secreta[i]) {
      resultado[i] = 'correta';
      restantes[tentativa[i]]--;
    }
  }

  // 2ª passada: marca as presentes (amarelo), respeitando o que sobrou.
  for (let i = 0; i < tentativa.length; i++) {
    if (resultado[i] === 'correta') continue;
    const letra = tentativa[i];
    if (restantes[letra] > 0) {
      resultado[i] = 'presente';
      restantes[letra]--;
    }
  }

  return resultado;
}
```

Por que duas passadas? Porque os verdes têm prioridade. Só depois de reservar todas as letras certas é que distribuímos os amarelos com o que sobrou. Cada vez que usamos uma letra (verde ou amarela), descontamos de `restantes`, garantindo que uma mesma letra da palavra não seja "contada" duas vezes.

Assim que você salvar esse arquivo, o import lá na `Linha` passa a funcionar — envie uma tentativa e veja as cores aparecerem!

### Colorindo o teclado

No Termo, o teclado vai ficando colorido conforme você descobre as letras. Vamos calcular o melhor status de cada tecla a partir de todas as tentativas enviadas.

Atualize `src/components/Teclado.jsx`:

```jsx
import { avaliarTentativa } from '../avaliacao.js';

const LINHAS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

function statusDasTeclas(tentativas, secreta) {
  const mapa = {};
  const prioridade = { ausente: 0, presente: 1, correta: 2 };

  for (const tentativa of tentativas) {
    const avaliacao = avaliarTentativa(tentativa, secreta);
    tentativa.split('').forEach((letra, i) => {
      const novo = avaliacao[i];
      if (mapa[letra] === undefined || prioridade[novo] > prioridade[mapa[letra]]) {
        mapa[letra] = novo;
      }
    });
  }

  return mapa;
}

export default function Teclado({ tentativas, secreta, onTecla, desabilitado }) {
  const status = statusDasTeclas(tentativas, secreta);

  return (
    <div className="teclado">
      {LINHAS.map((linha, i) => {
        const ultima = i === LINHAS.length - 1;
        return (
          <div key={i} className="teclado-linha">
            {ultima && (
              <button className="tecla tecla-larga" onClick={() => onTecla('ENTER')} disabled={desabilitado}>
                Enter
              </button>
            )}
            {linha.split('').map((letra) => (
              <button
                key={letra}
                className={`tecla ${status[letra] || ''}`}
                onClick={() => onTecla(letra)}
                disabled={desabilitado}
              >
                {letra}
              </button>
            ))}
            {ultima && (
              <button className="tecla tecla-larga" onClick={() => onTecla('APAGAR')} disabled={desabilitado}>
                ⌫
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

A função `statusDasTeclas` percorre todas as tentativas e, para cada letra, guarda o **melhor** status já obtido. Usamos um objeto `prioridade` para comparar: uma letra que já foi verde em alguma tentativa nunca "volta" a ser amarela. Depois, basta concatenar esse status na classe do botão (`${status[letra] || ''}`).

Lembre de passar as novas props ao usar o `Teclado` no `Jogo`:

```jsx
<Teclado
  tentativas={tentativas}
  secreta={secreta}
  onTecla={onTecla}
  desabilitado={fimDeJogo}
/>
```

(`fimDeJogo` vem na próxima seção.)

## Finalizando

### Vitória, derrota e status

De volta ao `Jogo.jsx`, vamos derivar o resultado. Logo depois das declarações de estado, adicione:

```jsx
const venceu = tentativas[tentativas.length - 1] === secreta;
const perdeu = !venceu && tentativas.length >= MAX_TENTATIVAS;
const fimDeJogo = venceu || perdeu;
```

- `venceu`: a **última** tentativa enviada é igual à palavra secreta.
- `perdeu`: o jogador usou todas as tentativas sem acertar.
- `fimDeJogo`: atalho para "acabou".

Importe também o `MAX_TENTATIVAS`:

```jsx
import { escolherPalavra, TAMANHO, MAX_TENTATIVAS } from './palavras.js';
```

Agora impeça novas jogadas depois do fim. Adicione `if (fimDeJogo) return;` no início de `digitar`, `apagar` e `enviar`. E monte uma mensagem de status:

```jsx
let status;
if (venceu) {
  status = 'Você acertou! 🎉';
} else if (perdeu) {
  status = 'Fim de jogo! A palavra era ' + secreta;
} else {
  status = 'Tentativa ' + (tentativas.length + 1) + ' de ' + MAX_TENTATIVAS;
}
```

Mostre o status e um botão de reiniciar (que só aparece no fim):

```jsx
function reiniciar() {
  setSecreta(escolherPalavra());
  setTentativas([]);
  setTentativaAtual('');
}
```

```jsx
// no return, entre a Grade e o Teclado:
<div className="status">{status}</div>
```

```jsx
// no return, depois do Teclado:
{fimDeJogo && (
  <button className="reiniciar" onClick={reiniciar}>
    Novo jogo
  </button>
)}
```

O `{fimDeJogo && (...)}` é uma forma comum de **renderização condicional** em React: se `fimDeJogo` for falso, nada é renderizado; se for verdadeiro, o botão aparece.

### Suporte ao teclado físico

Clicar nas teclas funciona, mas todo mundo espera poder digitar de verdade. Para reagir a eventos do navegador (como o pressionar de uma tecla), usamos o Hook **`useEffect`**, que permite "sincronizar" o componente com sistemas externos ao React.

Importe o `useEffect` e adicione este efeito dentro do `Jogo`:

```jsx
import { useState, useEffect } from 'react';
```

```jsx
useEffect(() => {
  function aoPressionar(evento) {
    if (evento.key === 'Enter') {
      enviar();
    } else if (evento.key === 'Backspace') {
      apagar();
    } else {
      const letra = evento.key.toUpperCase();
      if (letra.length === 1 && letra >= 'A' && letra <= 'Z') {
        digitar(letra);
      }
    }
  }
  window.addEventListener('keydown', aoPressionar);
  return () => window.removeEventListener('keydown', aoPressionar);
});
```

Dois pontos importantes:

- O efeito **retorna uma função de limpeza** (`return () => ...`). O React a executa antes de rodar o efeito de novo (e quando o componente sai da tela). Sem isso, ficaríamos empilhando vários ouvintes de `keydown`.
- Como não passamos uma lista de dependências, o efeito roda depois de cada renderização. Isso garante que `aoPressionar` sempre enxergue o estado mais recente (`tentativaAtual` atualizado). Existem formas mais otimizadas, mas para um jogo pequeno esta é simples e correta.

### Os estilos

Por fim, crie `src/styles.css` com o tema do Termo (fundo escuro, células coloridas):

```css
* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: #6e5c6e;
  color: #fff;
  min-height: 100vh;
}

.jogo { max-width: 360px; margin: 0 auto; padding: 16px; text-align: center; }
h1 { letter-spacing: 6px; margin: 12px 0 20px; }

.grade { display: grid; gap: 6px; justify-content: center; margin-bottom: 16px; }
.linha { display: grid; grid-template-columns: repeat(5, 56px); gap: 6px; }

.celula {
  width: 56px; height: 56px;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; font-weight: bold; text-transform: uppercase;
  border: 2px solid #564f5b; border-radius: 4px;
}
.celula.vazia { background: transparent; }
.celula.preenchida { border-color: #948a9c; }
.celula.correta { background: #3aa394; border-color: #3aa394; }
.celula.presente { background: #d3ad69; border-color: #d3ad69; }
.celula.ausente { background: #312a2c; border-color: #312a2c; }

.status { margin: 12px 0; min-height: 24px; font-size: 18px; }

.teclado { display: flex; flex-direction: column; gap: 6px; align-items: center; }
.teclado-linha { display: flex; gap: 6px; }

.tecla {
  min-width: 30px; height: 48px; padding: 0 8px;
  font-size: 14px; font-weight: bold; color: #fff;
  background: #564f5b; border: none; border-radius: 4px;
  cursor: pointer; text-transform: uppercase;
}
.tecla-larga { min-width: 52px; }
.tecla.correta { background: #3aa394; }
.tecla.presente { background: #d3ad69; }
.tecla.ausente { background: #312a2c; }
.tecla:disabled { cursor: not-allowed; opacity: 0.7; }

.reiniciar {
  margin-top: 16px; padding: 10px 24px;
  font-size: 16px; font-weight: bold; cursor: pointer;
  border: none; border-radius: 4px; background: #3aa394; color: #fff;
}
```

E garanta que o `src/main.jsx` carrega tudo:

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import Jogo from './Jogo.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Jogo />
  </StrictMode>
);
```

Pronto — você tem um Termo jogável!

## Resumo

Construindo o Termo, você praticou:

- **Composição de componentes**: `Jogo` → `Grade` → `Linha` → `Celula`, cada um com uma responsabilidade.
- **Estado mínimo + estado derivado**: guardamos só `secreta`, `tentativas` e `tentativaAtual`; vitória, derrota e cores são calculadas.
- **Componentes "burros"**: `Celula`, `Linha`, `Teclado` só recebem props e desenham; toda a lógica mora no `Jogo` e em `avaliacao.js`.
- **Um algoritmo dentro do app**: a avaliação em duas passadas, que trata letras repetidas corretamente.
- **`useEffect` com limpeza**: para integrar o jogo a um evento do navegador (o teclado físico).

## Desafios

1. **Validar palavras.** Só aceite tentativas que estejam em uma lista de palavras válidas, mostrando um aviso quando a palavra não existir.
2. **Acentos.** Permita palavras com acento, normalizando as letras (tratar `Á` como `A`, `Ç` como `C`) na hora de comparar, mas exibindo a forma acentuada.
3. **Animações.** Faça as células "virarem" ao revelar a cor, ou tremerem quando a palavra for inválida.
4. **Compartilhar resultado.** Gere aquele quadradinho de emojis (🟩🟨⬜) para o jogador copiar e compartilhar.
5. **Estatísticas.** Conte vitórias, sequência atual e distribuição de tentativas. (Como artifacts no Claude não usam `localStorage`, guarde em estado; num projeto local, `localStorage` funciona.)
6. **Modo dueto.** Descubra duas palavras ao mesmo tempo, como no "Dueto" do Termo.

Boa diversão!
