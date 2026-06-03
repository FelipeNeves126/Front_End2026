import Celula from './Celula.jsx';
import { avaliarTentativa } from '../avaliacao.js';
import { TAMANHO } from '../palavras.js';

export default function Linha({ tentativa, enviada, secreta }) {
  // Completa a tentativa com espaços para sempre ter TAMANHO células.
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
