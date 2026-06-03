import { avaliarTentativa } from '../avaliacao.js';

const LINHAS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

// Para cada letra já tentada, descobre o melhor status alcançado.
// Prioridade: correta (verde) > presente (amarelo) > ausente (cinza).
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
              <button
                className="tecla tecla-larga"
                onClick={() => onTecla('ENTER')}
                disabled={desabilitado}
              >
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
              <button
                className="tecla tecla-larga"
                onClick={() => onTecla('APAGAR')}
                disabled={desabilitado}
              >
                ⌫
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
