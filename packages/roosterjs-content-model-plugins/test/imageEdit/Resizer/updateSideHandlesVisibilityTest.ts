import { updateSideHandlesVisibility } from '../../../lib/imageEdit/Resizer/updateSideHandlesVisibility';

describe('updateSideHandlesVisibility', () => {
    it('should hide handle ', () => {
        const handle1 = document.createElement('div');
        handle1.dataset['y'] = 'n';
        handle1.dataset['x'] = '';
        updateSideHandlesVisibility([handle1], true);
        expect(handle1.style.display).toBe('none');
    });

    it('should not side hide handle ', () => {
        const handle1 = document.createElement('div');
        handle1.dataset['y'] = 'n';
        handle1.dataset['x'] = '';
        updateSideHandlesVisibility([handle1], false);
        expect(handle1.style.display).toBe('');
    });

    it('should not hide corner handle ', () => {
        const handle1 = document.createElement('div');
        handle1.dataset['y'] = 'n';
        handle1.dataset['x'] = 'w';
        updateSideHandlesVisibility([handle1], true);
        expect(handle1.style.display).toBe('');
    });
});
