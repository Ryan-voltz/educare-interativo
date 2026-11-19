import { geoArea } from 'd3-geo';

/**
 * O d3-geo trabalha em coordenadas esféricas e exige anéis no sentido horário.
 * Os GeoJSON do IBGE vêm no sentido anti-horário (padrão RFC 7946), e o d3
 * interpreta cada município como "o planeta inteiro menos o município",
 * desenhando um retângulo cheio. Esta função inverte os anéis afetados.
 */
export function rewindForD3<T extends { features: any[] }>(fc: T): T {
  const features = fc.features.map((f) => {
    if (!f.geometry || geoArea(f) <= 2 * Math.PI) return f;
    const g = f.geometry;
    const rev = (rings: number[][][]) => rings.map((r) => [...r].reverse());
    const coordinates =
      g.type === 'Polygon'
        ? rev(g.coordinates)
        : g.type === 'MultiPolygon'
          ? g.coordinates.map((p: number[][][]) => rev(p))
          : g.coordinates;
    return { ...f, geometry: { ...g, coordinates } };
  });
  return { ...fc, features };
}
