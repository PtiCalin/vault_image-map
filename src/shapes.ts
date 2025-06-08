export interface Point {
  x: number;
  y: number;
}

export interface BaseShape {
  id: string;
  type: 'polygon' | 'rect' | 'ellipse';
}

export interface PolygonShape extends BaseShape {
  type: 'polygon';
  points: Point[];
}

export interface RectShape extends BaseShape {
  type: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EllipseShape extends BaseShape {
  type: 'ellipse';
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export type Shape = PolygonShape | RectShape | EllipseShape;
