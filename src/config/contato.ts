/**
 * Contatos do estande.
 *
 * Para trocar o WhatsApp da Vitória, altere apenas VITORIA_WHATSAPP:
 * somente dígitos, com DDI 55 + DDD + número (ex.: 5541998362159).
 * O QR code e todos os botões de WhatsApp do app usam este valor.
 */
export const VITORIA_WHATSAPP = '5541998362159';

export const VITORIA_NOME = 'Vitória';

export const MENSAGEM_PADRAO =
  'Olá, Vitória! Vim pelo estande do Grupo Educare e quero saber sobre o recurso PDDE.';

/** Monta o link wa.me para a Vitória, com mensagem opcional já preenchida. */
export function whatsappLink(mensagem: string = MENSAGEM_PADRAO): string {
  return `https://wa.me/${VITORIA_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
}

/** Número formatado para exibição: +55 41 9836-2159 */
export function telefoneFormatado(): string {
  const d = VITORIA_WHATSAPP;
  const ddi = d.slice(0, 2);
  const ddd = d.slice(2, 4);
  const resto = d.slice(4);
  const meio = resto.length - 4;
  return `+${ddi} ${ddd} ${resto.slice(0, meio)}-${resto.slice(meio)}`;
}
