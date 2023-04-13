import canRegenerateImage from '../../lib/plugins/ImageEdit/api/canRegenerateImage';

const IMG_SRC =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAALUlEQVQ4EWNgYGD4T2U8lAz8TyZACzKEl8k0Dz0OhpKBaGGB7hVi+QgvD0oDATe/bqDDw39VAAAAAElFTkSuQmCC';

describe('canRegenerateImage', () => {
    function runTest(element: HTMLImageElement, canRegenerate: boolean) {
        const result = canRegenerateImage(element);
        expect(result).toBe(canRegenerate);
    }

    it('should not regenerate', () => {
        runTest(null!, false);
    });

    it('should regenerate', async () => {
        const img = await loadImage(IMG_SRC);
        img.width = 100;
        img.height = 100;
        runTest(img, true);
    });
});

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>(resolve => {
        const img = document.createElement('img');
        const result = () => {
            img.onload = null;
            img.onerror = null;
            resolve(img);
        };
        img.onload = result;
        img.onerror = result;
        img.src = src;
    });
}
