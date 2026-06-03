import { useState, useEffect } from 'react';
import Grade from './components/Grade.jsx';
import Teclado from './components/Teclado.jsx';
import { escolherPalavra, TAMANHO, MAX_TENTATIVAS } from './palavras.js';

export default function Jogo() {
  const [secreta, setSecreta] = useState(escolherPalavra);
  const [tentativas, setTentativas] = useState([]);
  const [tentativaAtual, setTentativaAtual] = useState('');

  const venceu = tentativas[tentativas.length - 1] === secreta;
  const perdeu = !venceu && tentativas.length >= MAX_TENTATIVAS;
  const fimDeJogo = venceu || perdeu;

  function digitar(letra) {
    if (fimDeJogo) return;
    if (tentativaAtual.length < TAMANHO) {
      setTentativaAtual(tentativaAtual + letra);
    }
  }

  function apagar() {
    if (fimDeJogo) return;
    setTentativaAtual(tentativaAtual.slice(0, -1));
  }

  function enviar() {
    if (fimDeJogo) return;
    if (tentativaAtual.length !== TAMANHO) return;
    setTentativas([...tentativas, tentativaAtual]);
    setTentativaAtual('');
  }

  function onTecla(tecla) {
    if (tecla === 'ENTER') enviar();
    else if (tecla === 'APAGAR') apagar();
    else digitar(tecla);
  }

  // Suporte ao teclado físico.
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

  function reiniciar() {
    setSecreta(escolherPalavra());
    setTentativas([]);
    setTentativaAtual('');
  }

  let status;
  if (venceu) {
    status = 'Você acertou! 🎉';
  } else if (perdeu) {
    status = 'Fim de jogo! A palavra era ' + secreta;
  } else {
    status = 'Tentativa ' + (tentativas.length + 1) + ' de ' + MAX_TENTATIVAS;
  }

  return (
    <div className="jogo">
      <h1>TERMO</h1>
      <Grade
        tentativas={tentativas}
        tentativaAtual={tentativaAtual}
        secreta={secreta}
      />
      <div className="status">{status}</div>
      <Teclado
        tentativas={tentativas}
        secreta={secreta}
        onTecla={onTecla}
        desabilitado={fimDeJogo}
      />
      {fimDeJogo && (
        <button className="reiniciar" onClick={reiniciar}>
          Novo jogo
        </button>
      )}
    </div>
  );
}
