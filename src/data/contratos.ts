/**
 * Número de contratos fornecidos pelo Grupo Educare em cada município.
 *
 * ⚠ OS NÚMEROS ABAIXO SÃO FICTÍCIOS (dados de exemplo), só para a
 * apresentação funcionar até chegar a lista oficial. Somam ~1.300, a parte
 * estimada da Bahia nos ~2.000 contratos nacionais informados pelo cliente.
 *
 * COMO PREENCHER: troque cada número pela quantidade real de contratos e
 * mude CONTRATOS_FICTICIOS para `false`; o aviso "dados de exemplo" some da tela.
 * Se um município ficar `null`, a tela mostra "em atualização".
 * A chave é o código IBGE do município (não altere).
 * Para incluir um município novo, adicione uma linha com o código IBGE dele.
 */
export const CONTRATOS_FICTICIOS = true;

export const CONTRATOS_POR_MUNICIPIO: Record<string, number | null> = {
  '2927408': 94, // Salvador
  '2910800': 41, // Feira de Santana
  '2933307': 84, // Vitória da Conquista
  '2918407': 21, // Juazeiro
  '2903201': 33, // Barreiras
  '2913606': 26, // Ilhéus
  '2914802': 12, // Itabuna
  '2925303': 32, // Porto Seguro
  '2918001': 11, // Jequié
  '2900702': 29, // Alagoinhas
  '2931350': 13, // Teixeira de Freitas
  '2929206': 14, // Santo Antônio de Jesus
  '2919553': 28, // Luís Eduardo Magalhães
  '2917508': 46, // Jacobina
  '2914604': 15, // Irecê
  '2911709': 19, // Guanambi
  '2924009': 37, // Paulo Afonso
  '2904605': 51, // Brumado
  '2904001': 35, // Bom Jesus da Lapa
  '2930709': 27, // Simões Filho
  '2905701': 83, // Camaçari
  '2919207': 12, // Lauro de Freitas
  '2910727': 47, // Eunápolis
  '2930501': 22, // Serrinha
  '2930105': 16, // Senhor do Bonfim
  '2932903': 15, // Valença
  '2916401': 23, // Itapetinga
  '2909802': 45, // Cruz das Almas
  '2928802': 18, // Santo Amaro
  '2913903': 35, // Ipiaú
  '2928703': 37, // Santo Estêvão
  '2928901': 26, // São Gonçalo dos Campos
  '2926301': 33, // Riachão do Jacuípe
  '2908408': 12, // Conceição do Coité
  '2927200': 12, // Ruy Barbosa
  '2914000': 19, // Ipirá
  '2926707': 39, // Rio Real
  '2910057': 28, // Dias d'Ávila
  '2906501': 23, // Candeias
  '2921005': 35, // Mata de São João
  '2925204': 29, // Pojuca
  '2930758': 23, // Sobradinho
};

export function contratosDo(codigoIbge: string): number | null {
  const v = CONTRATOS_POR_MUNICIPIO[codigoIbge];
  return typeof v === 'number' ? v : null;
}
