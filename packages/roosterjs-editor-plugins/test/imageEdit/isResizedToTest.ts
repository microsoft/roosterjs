import ImageEditInfo from '../../lib/plugins/ImageEdit/types/ImageEditInfo';
import isResizedTo from '../../lib/plugins/ImageEdit/api/isResizedTo';

const EDIT_INFO = 'editingInfo';

describe('isResizedTo', () => {
    function runTest(element: HTMLImageElement, percentage: number, isResized: boolean) {
        const result = isResizedTo(element, percentage);
        expect(result).toBe(isResized);
    }

    it('is Not Resized', () => {
        const image = document.createElement('img');
        image.style.width = '100px';
        image.style.height = '100px';
        const editInfo: ImageEditInfo = {
            naturalWidth: 100,
            naturalHeight: 100,
            leftPercent: 0,
            topPercent: 0,
            rightPercent: 0,
            bottomPercent: 0,
            src: 'test',
            widthPx: 100,
            heightPx: 100,
            angleRad: 0,
        };
        image.dataset[EDIT_INFO] = JSON.stringify(editInfo);
        runTest(image, 0.5, false);
    });

    it('is Resized, but not 40%', () => {
        const image = document.createElement('img');
        image.style.width = '100px';
        image.style.height = '100px';
        const editInfo: ImageEditInfo = {
            naturalWidth: 100,
            naturalHeight: 100,
            leftPercent: 0,
            topPercent: 0,
            rightPercent: 0,
            bottomPercent: 0,
            src: 'test',
            widthPx: 50,
            heightPx: 50,
            angleRad: 0,
        };
        image.dataset[EDIT_INFO] = JSON.stringify(editInfo);
        runTest(image, 0.4, false);
    });

    it('is Resized to 50%', () => {
        const image = document.createElement('img');
        image.style.width = '100px';
        image.style.height = '100px';
        const editInfo: ImageEditInfo = {
            naturalWidth: 100,
            naturalHeight: 100,
            leftPercent: 0,
            topPercent: 0,
            rightPercent: 0,
            bottomPercent: 0,
            src: 'test',
            widthPx: 50,
            heightPx: 50,
            angleRad: 0,
        };
        image.dataset[EDIT_INFO] = JSON.stringify(editInfo);
        runTest(image, 0.5, true);
    });
});
