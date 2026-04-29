import { generateDataURL } from '../../../lib/imageEdit/utils/generateDataURL';
import { itChromeOnly } from 'roosterjs-content-model-dom/test/testUtils';

describe('generateDataURL', () => {
    itChromeOnly('generate image url', () => {
        const dataUri =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAANElEQVR4AezSsQkAAAjEQHH/oZ0hjdVZPwhHdh7Ok4SMC1cSSGN14UoCaawuXEkgjdWVuA4AAP//YI5Y5AAAAAZJREFUAwAKXgAzAC3ppgAAAABJRU5ErkJggg==';
        spyOn(HTMLCanvasElement.prototype, 'toDataURL').and.returnValue(dataUri);
        const editInfo = {
            src: 'test',
            widthPx: 20,
            heightPx: 20,
            naturalWidth: 10,
            naturalHeight: 10,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0.1,
            bottomPercent: 0,
            angleRad: 0,
        };
        const image = document.createElement('img');
        const url = generateDataURL(image, editInfo);
        expect(url).toBe(dataUri);
    });

    itChromeOnly('generate image url - draw image - error', () => {
        const editInfo = {
            src: 'test',
            widthPx: 0,
            heightPx: 0,
            naturalWidth: 0,
            naturalHeight: 0,
            leftPercent: 0,
            rightPercent: 0,
            topPercent: 0.1,
            bottomPercent: 0,
            angleRad: 0,
        };
        const image = document.createElement('img');
        image.width = 0; // Force error
        image.height = 0;
        image.src = 'https://th.bing.com/th/id/OIP.kJCCjl_yUweRlj94AdU-egHaFK?rs=1&pid=ImgDetMain';
        const url = generateDataURL(image, editInfo);
        expect(url).toBe('data:,');
    });
});
