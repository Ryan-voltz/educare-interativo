/**
 * Número de contratos fornecidos pelo Grupo Educare em cada município.
 *
 * ⚠ OS NÚMEROS ABAIXO SÃO FICTÍCIOS (dados de exemplo), só para a
 * apresentação funcionar até chegar a lista oficial.
 *
 * COMO PREENCHER: troque cada número pela quantidade real de contratos e
 * mude CONTRATOS_FICTICIOS para `false`; o aviso "dados de exemplo" some da tela.
 * Se um município ficar `null`, a tela mostra "em atualização".
 * A chave é o código IBGE do município (não altere).
 * Para incluir um município novo, adicione uma linha com o código IBGE dele.
 */
export const CONTRATOS_FICTICIOS = true;

export const CONTRATOS_POR_MUNICIPIO: Record<string, number | null> = {
  '2927408': 1, // Salvador
  '2910800': 1, // Feira de Santana
  '2933307': 2, // Vitória da Conquista
  '2918407': 2, // Juazeiro
  '2903201': 2, // Barreiras
  '2913606': 2, // Ilhéus
  '2914802': 1, // Itabuna
  '2925303': 5, // Porto Seguro
  '2918001': 1, // Jequié
  '2900702': 6, // Alagoinhas
  '2931350': 3, // Teixeira de Freitas
  '2929206': 1, // Santo Antônio de Jesus
  '2919553': 1, // Luís Eduardo Magalhães
  '2917508': 1, // Jacobina
  '2914604': 2, // Irecê
  '2911709': 2, // Guanambi
  '2924009': 5, // Paulo Afonso
  '2904605': 6, // Brumado
  '2904001': 1, // Bom Jesus da Lapa
  '2930709': 5, // Simões Filho
  '2905701': 2, // Camaçari
  '2919207': 5, // Lauro de Freitas
  '2910727': 3, // Eunápolis
  '2930501': 2, // Serrinha
  '2930105': 4, // Senhor do Bonfim
  '2932903': 6, // Valença
  '2916401': 2, // Itapetinga
  '2909802': 1, // Cruz das Almas
  '2928802': 2, // Santo Amaro
  '2913903': 3, // Ipiaú
  '2928703': 3, // Santo Estêvão
  '2928901': 2, // São Gonçalo dos Campos
  '2926301': 2, // Riachão do Jacuípe
  '2908408': 2, // Conceição do Coité
  '2927200': 3, // Ruy Barbosa
  '2914000': 1, // Ipirá
  '2926707': 1, // Rio Real
  '2910057': 3, // Dias d'Ávila
  '2906501': 1, // Candeias
  '2921005': 3, // Mata de São João
  '2925204': 3, // Pojuca
  '2930758': 6, // Sobradinho
};

export function contratosDo(codigoIbge: string): number | null {
  const v = CONTRATOS_POR_MUNICIPIO[codigoIbge];
  return typeof v === 'number' ? v : null;
}
