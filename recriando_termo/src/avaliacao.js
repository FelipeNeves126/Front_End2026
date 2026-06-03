// Compara uma tentativa com a palavra secreta e devolve o status de cada letra:
// 'correta'  -> letra certa na posição certa (verde)
// 'presente' -> letra existe na palavra, mas em outra posição (amarelo)
// 'ausente'  -> letra não existe na palavra (cinza)
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
