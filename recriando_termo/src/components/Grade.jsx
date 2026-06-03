import Linha from './Linha.jsx';
import { MAX_TENTATIVAS } from '../palavras.js';

export default function Grade({ tentativas, tentativaAtual, secreta }) {
  const linhas = [];

  for (let i = 0; i < MAX_TENTATIVAS; i++) {
    if (i < tentativas.length) {
      // Tentativas já enviadas (coloridas).
      linhas.push(
        <Linha key={i} tentativa={tentativas[i]} enviada={true} secreta={secreta} />
      );
    } else if (i === tentativas.length) {
      // A linha que o jogador está digitando agora.
      linhas.push(
        <Linha key={i} tentativa={tentativaAtual} enviada={false} secreta={secreta} />
      );
    } else {
      // Linhas ainda vazias.
      linhas.push(
        <Linha key={i} tentativa="" enviada={false} secreta={secreta} />
      );
    }
  }

  return <div className="grade">{linhas}</div>;
}
