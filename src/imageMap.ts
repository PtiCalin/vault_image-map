export interface ShapeCoords {
  polygons?: string[];
  rects?: [number, number, number, number][];
  ellipses?: [number, number, number, number][];
}

/**
 * Parse coordinates from either data attributes or frontmatter.
 * If the image contains a `data-coordinates` JSON string, it is used.
 * Otherwise, if a `data-map` key is present and matching data exists in
 * frontmatter under `imageMaps`, that data is returned.
 */
export function parseCoordinates(
  img: HTMLElement,
  frontmatter?: any,
): ShapeCoords | null {
  const json = img.getAttribute('data-coordinates');
  if (json) {
    try {
      return JSON.parse(json) as ShapeCoords;
    } catch (e) {
      console.error('Invalid data-coordinates JSON', e);
    }
  }
  const key = img.getAttribute('data-map');
  if (key && frontmatter && frontmatter.imageMaps && frontmatter.imageMaps[key]) {
    return frontmatter.imageMaps[key] as ShapeCoords;
  }
  return null;
}

const NS = 'http://www.w3.org/2000/svg';

export function createPolygon(points: string): SVGPolygonElement {
  const el = document.createElementNS(NS, 'polygon');
  el.setAttribute('points', points);
  return el;
}

export function createRect(
  x: number,
  y: number,
  width: number,
  height: number,
): SVGRectElement {
  const el = document.createElementNS(NS, 'rect');
  el.setAttribute('x', String(x));
  el.setAttribute('y', String(y));
  el.setAttribute('width', String(width));
  el.setAttribute('height', String(height));
  return el;
}

export function createEllipse(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
): SVGEllipseElement {
  const el = document.createElementNS(NS, 'ellipse');
  el.setAttribute('cx', String(cx));
  el.setAttribute('cy', String(cy));
  el.setAttribute('rx', String(rx));
  el.setAttribute('ry', String(ry));
  return el;
}

/**
 * Build an SVG overlay from a set of shape coordinates.
 */
export function shapesToSVG(def: ShapeCoords): SVGSVGElement {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('preserveAspectRatio', 'none');

  def.polygons?.forEach((pts) => svg.appendChild(createPolygon(pts)));
  def.rects?.forEach(([x, y, w, h]) => svg.appendChild(createRect(x, y, w, h)));
  def.ellipses?.forEach(([cx, cy, rx, ry]) =>
    svg.appendChild(createEllipse(cx, cy, rx, ry)),
  );

  return svg;
}
