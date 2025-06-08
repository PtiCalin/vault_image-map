import { overlayImage, ShapeCoords } from '../src/imageMap';

describe('overlayImage', () => {
  test('wraps img in container and inserts overlay', () => {
    document.body.innerHTML = '<div id="root"><img id="img" /></div>';
    const img = document.getElementById('img') as HTMLImageElement;
    const coords: ShapeCoords = { polygons: ['0,0 10,0 0,10'] };

    overlayImage(img, coords);

    const root = document.getElementById('root') as HTMLElement;
    const wrapper = root.firstElementChild as HTMLElement;
    expect(wrapper).not.toBeNull();
    expect(wrapper.classList.contains('image-map-container')).toBe(true);
    expect(wrapper.contains(img)).toBe(true);

    const overlay = wrapper.querySelector('.image-map-overlay');
    expect(overlay).not.toBeNull();
    expect(overlay?.querySelector('svg')).not.toBeNull();
  });
});
