/**
 * Parse coordinates from either data attributes or frontmatter.
 * If the image contains a `data-coordinates` JSON string, it is used.
 * Otherwise, if a `data-map` key is present and matching data exists in
 * frontmatter under `imageMaps`, that data is returned.
 */
export function parseCoordinates(img, frontmatter) {
    const json = img.getAttribute('data-coordinates');
    if (json) {
        try {
            return JSON.parse(json);
        }
        catch (e) {
            console.error('📐 Invalid data-coordinates JSON. Check your syntax or frontmatter.', e);
        }
    }
    const key = img.getAttribute('data-map');
    if (key && frontmatter && frontmatter.imageMaps && frontmatter.imageMaps[key]) {
        return frontmatter.imageMaps[key];
    }
    return null;
}
const NS = 'http://www.w3.org/2000/svg';
/**
 * Create an SVG polygon element from a series of points.
 *
 * @param points - Space separated list of "x,y" coordinate pairs
 * @returns The polygon element
 */
export function createPolygon(points) {
    const el = document.createElementNS(NS, 'polygon');
    el.setAttribute('points', points);
    return el;
}
/**
 * Create an SVG rectangle element.
 *
 * @param x - Top-left X coordinate
 * @param y - Top-left Y coordinate
 * @param width - Width of the rectangle
 * @param height - Height of the rectangle
 * @returns The rectangle element
 */
export function createRect(x, y, width, height) {
    const el = document.createElementNS(NS, 'rect');
    el.setAttribute('x', String(x));
    el.setAttribute('y', String(y));
    el.setAttribute('width', String(width));
    el.setAttribute('height', String(height));
    return el;
}
/**
 * Create an SVG ellipse element.
 *
 * @param cx - Center X coordinate
 * @param cy - Center Y coordinate
 * @param rx - Radius on the X axis
 * @param ry - Radius on the Y axis
 * @returns The ellipse element
 */
export function createEllipse(cx, cy, rx, ry) {
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
export function shapesToSVG(def) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    def.polygons?.forEach((pts) => {
        const poly = createPolygon(pts);
        poly.classList.add('image-map-shape');
        svg.appendChild(poly);
    });
    def.rects?.forEach(([x, y, w, h]) => {
        const rect = createRect(x, y, w, h);
        rect.classList.add('image-map-shape');
        svg.appendChild(rect);
    });
    def.ellipses?.forEach(([cx, cy, rx, ry]) => {
        const ell = createEllipse(cx, cy, rx, ry);
        ell.classList.add('image-map-shape');
        svg.appendChild(ell);
    });
    return svg;
}
/**
 * Wrap the image in a container and append an SVG overlay.
 */
export function overlayImage(img, coords, externalSvg) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('image-map-container');
    img.parentElement?.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    const overlayEl = document.createElement('div');
    overlayEl.classList.add('image-map-overlay');
    if (externalSvg)
        overlayEl.innerHTML = externalSvg;
    overlayEl.appendChild(shapesToSVG(coords));
    wrapper.appendChild(overlayEl);
    return wrapper;
}
