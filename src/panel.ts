import { App, Modal, Plugin, Notice } from 'obsidian';
import {
  createPolygon,
  createRect,
  createEllipse,
  ShapeCoords,
} from './imageMap';

const NS = 'http://www.w3.org/2000/svg';

/**
 * Modal panel used to edit image maps. Users can draw polygons, rectangles
 * and ellipses directly on top of the selected image. The coordinates are
 * saved to a side JSON file inside the vault.
 */
export default class ImagePanel extends Modal {
  plugin: Plugin;
  img: HTMLImageElement;
  svg!: SVGSVGElement;
  coords: ShapeCoords = { polygons: [], rects: [], ellipses: [] };
  tool: 'polygon' | 'rect' | 'ellipse' | null = null;
  currentPoints: string[] = [];
  tempEl: SVGElement | null = null;

  constructor(app: App, plugin: Plugin, img: HTMLImageElement) {
    super(app);
    this.plugin = plugin;
    this.img = img;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h2', { text: 'Edit Image Map' });

    const toolbar = createDiv({ cls: 'image-map-toolbar' });
    contentEl.appendChild(toolbar);
    const polyBtn = document.createElement('button');
    polyBtn.textContent = 'Polygon';
    polyBtn.addEventListener('click', () => (this.tool = 'polygon'));
    toolbar.appendChild(polyBtn);
    const rectBtn = document.createElement('button');
    rectBtn.textContent = 'Rectangle';
    rectBtn.addEventListener('click', () => (this.tool = 'rect'));
    toolbar.appendChild(rectBtn);
    const ellBtn = document.createElement('button');
    ellBtn.textContent = 'Ellipse';
    ellBtn.addEventListener('click', () => (this.tool = 'ellipse'));
    toolbar.appendChild(ellBtn);
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => this.saveCoords());
    toolbar.appendChild(saveBtn);

    const container = createDiv({ cls: 'image-map-editor-container' });
    contentEl.appendChild(container);
    const imgEl = document.createElement('img');
    imgEl.src = this.img.src;
    container.appendChild(imgEl);
    imgEl.style.maxWidth = '100%';
    imgEl.style.display = 'block';

    this.svg = document.createElementNS(NS, 'svg');
    this.svg.classList.add('image-map-editor');
    this.svg.setAttribute('viewBox', '0 0 100 100');
    this.svg.setAttribute('preserveAspectRatio', 'none');
    container.appendChild(this.svg);

    this.svg.addEventListener('mousedown', (evt) => this.onMouseDown(evt));
  }

  onMouseDown(evt: MouseEvent) {
    if (this.tool === 'rect') {
      this.startRect(evt);
    } else if (this.tool === 'ellipse') {
      this.startEllipse(evt);
    } else if (this.tool === 'polygon') {
      this.addPolygonPoint(evt);
    }
  }

  getSvgCoords(evt: MouseEvent) {
    const rect = this.svg.getBoundingClientRect();
    const x = ((evt.clientX - rect.left) / rect.width) * 100;
    const y = ((evt.clientY - rect.top) / rect.height) * 100;
    return { x, y };
  }

  startRect(evt: MouseEvent) {
    const start = this.getSvgCoords(evt);
    const rectEl = createRect(start.x, start.y, 0, 0);
    rectEl.classList.add('image-map-shape');
    this.svg.appendChild(rectEl);

    const move = (e: MouseEvent) => {
      const cur = this.getSvgCoords(e);
      const x = Math.min(start.x, cur.x);
      const y = Math.min(start.y, cur.y);
      const width = Math.abs(cur.x - start.x);
      const height = Math.abs(cur.y - start.y);
      rectEl.setAttribute('x', String(x));
      rectEl.setAttribute('y', String(y));
      rectEl.setAttribute('width', String(width));
      rectEl.setAttribute('height', String(height));
    };

    const up = (e: MouseEvent) => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      const end = this.getSvgCoords(e);
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      const w = Math.abs(end.x - start.x);
      const h = Math.abs(end.y - start.y);
      rectEl.setAttribute('x', String(x));
      rectEl.setAttribute('y', String(y));
      rectEl.setAttribute('width', String(w));
      rectEl.setAttribute('height', String(h));
      this.coords.rects?.push([x, y, w, h]);
      this.addRectHandles(x, y, w, h);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }

  startEllipse(evt: MouseEvent) {
    const start = this.getSvgCoords(evt);
    const ell = createEllipse(start.x, start.y, 0, 0);
    ell.classList.add('image-map-shape');
    this.svg.appendChild(ell);

    const move = (e: MouseEvent) => {
      const cur = this.getSvgCoords(e);
      ell.setAttribute('rx', String(Math.abs(cur.x - start.x)));
      ell.setAttribute('ry', String(Math.abs(cur.y - start.y)));
    };

    const up = (e: MouseEvent) => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      const end = this.getSvgCoords(e);
      const rx = Math.abs(end.x - start.x);
      const ry = Math.abs(end.y - start.y);
      this.coords.ellipses?.push([start.x, start.y, rx, ry]);
      this.addEllipseHandles(start.x, start.y);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  }

  addPolygonPoint(evt: MouseEvent) {
    const p = this.getSvgCoords(evt);
    this.currentPoints.push(`${p.x},${p.y}`);
    if (!this.tempEl) {
      this.tempEl = createPolygon(this.currentPoints.join(' '));
      this.tempEl.classList.add('image-map-shape');
      this.svg.appendChild(this.tempEl);
    } else {
      (this.tempEl as SVGPolygonElement).setAttribute('points', this.currentPoints.join(' '));
    }

    if (evt.detail === 2) {
      this.coords.polygons?.push(this.currentPoints.join(' '));
      this.addPolygonHandles(this.currentPoints);
      this.currentPoints = [];
      this.tempEl = null;
    }
  }

  addRectHandles(x: number, y: number, w: number, h: number) {
    const points = [
      [x, y],
      [x + w, y],
      [x, y + h],
      [x + w, y + h],
    ];
    points.forEach(([cx, cy]) => this.addHandle(cx, cy));
  }

  addEllipseHandles(cx: number, cy: number) {
    this.addHandle(cx, cy);
  }

  addPolygonHandles(points: string[]) {
    points.forEach((pt) => {
      const [x, y] = pt.split(',').map(Number);
      this.addHandle(x, y);
    });
  }

  addHandle(cx: number, cy: number) {
    const h = document.createElementNS(NS, 'circle');
    h.setAttribute('cx', String(cx));
    h.setAttribute('cy', String(cy));
    h.setAttribute('r', '2');
    h.classList.add('image-map-handle');
    this.svg.appendChild(h);
  }

  async saveCoords() {
    const json = JSON.stringify(this.coords, null, 2);
    const base = this.img.src.split('/').pop() || 'image';
    const file = `${base}.map.json`;
    try {
      await (this.plugin.app.vault.adapter as any).write(file, json);
      new Notice(`Image map saved to ${file}`);
    } catch (e) {
      console.error('Failed to save coordinates', e);
      new Notice('Failed to save coordinates');
    }
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
