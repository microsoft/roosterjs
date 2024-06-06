import { updateHandleCursor } from '../../../lib/imageEdit/utils/updateHandleCursor';
describe('updateHandleCursor', () => {
    it('should set cursor', () => {
        const handle1 = document.createElement('div');

        handle1.dataset['x'] = 'e';
        handle1.dataset['y'] = 'n';

        updateHandleCursor([handle1], 0);
        expect(handle1.style.cursor).toBe('ne-resize');
    });
});
