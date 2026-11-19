import bahiaGeoRaw from './bahia-geo.json';
import { BAHIA_MUNICIPALITIES_DATA, type MunicipalityCase } from './educareData';

/** Mesorregião do IBGE com um nome curto para a tela. */
const NOME_REGIAO: Record<string, string> = {
  'Metropolitana de Salvador': 'Metropolitana de Salvador',
  'Nordeste Baiano': 'Nordeste Baiano',
  'Centro Norte Baiano': 'Centro-Norte Baiano',
  'Centro Sul Baiano': 'Centro-Sul Baiano',
  'Sul Baiano': 'Sul Baiano',
  'Extremo Oeste Baiano': 'Extremo Oeste Baiano',
  'Vale São-Franciscano da Bahia': 'Vale do São Francisco',
};

export interface MunicipioBahia {
  id: string;
  name: string;
  /** Mesorregião (IBGE) */
  region: string;
}

/**
 * Os 417 municípios da Bahia, em ordem alfabética.
 * O Grupo Educare já atendeu mais de 400 deles, então o mapa mostra todos como atendidos.
 */
export const MUNICIPIOS_BAHIA: MunicipioBahia[] = (bahiaGeoRaw as any).features
  .map((f: any) => ({
    id: String(f.properties.codarea),
    name: String(f.properties.name || ''),
    region: NOME_REGIAO[f.properties.meso] || f.properties.meso || 'Bahia',
  }))
  .sort((a: MunicipioBahia, b: MunicipioBahia) => a.name.localeCompare(b.name, 'pt-BR'));

export const MUNICIPIOS_ATENDIDOS_BAHIA = '400+';

export function nomeRegiao(meso: string) {
  return NOME_REGIAO[meso] || meso || 'Bahia';
}

/** Converte um município do mapa no formato usado pelos painéis e pela proposta. */
export function municipioCase(m: MunicipioBahia): MunicipalityCase {
  const destaque = BAHIA_MUNICIPALITIES_DATA[m.id];
  if (destaque) return { ...destaque, region: m.region };
  return {
    id: m.id,
    name: m.name,
    region: m.region,
    highlighted: false,
    contractDate: '',
    schoolsCount: 0,
    studentsImpacted: 0,
    teachersTrained: 0,
    primaryProject: 'alfa-educa',
    projects: [],
    status: 'Ativo',
    folderTitle: '',
    folderCover: '',
    videoTitle: '',
    videoThumbnail: '',
    metrics: { satisfaction: '' },
  };
}
