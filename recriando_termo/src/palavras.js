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
