import { generateDataURL } from '../../../lib/imageEdit/utils/generateDataURL';
import { itChromeOnly } from 'roosterjs-content-model-dom/test/testUtils';

describe('generateDataURL', () => {
    itChromeOnly('generate image url', () => {
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
        image.src = 'https://th.bing.com/th/id/OIP.kJCCjl_yUweRlj94AdU-egHaFK?rs=1&pid=ImgDetMain';
        const url = generateDataURL(image, editInfo);
        expect(url).toBe(
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAChJREFUOE9jZKAyYKSyeQyjBlIeoqNhOBqGZITAaLIhI9DQtIzAMAQASMYAFTvklLAAAAAASUVORK5CYII='
        );
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
        expect(url).toBe(
            'https://th.bing.com/th/id/OIP.kJCCjl_yUweRlj94AdU-egHaFK?rs=1&pid=ImgDetMain'
        );
    });
});
