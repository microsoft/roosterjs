import { filterInnerResizerHandles } from '../../../lib/imageEdit/utils/filterInnerResizerHandles';

describe('filterInnerResizerHandles', () => {
    it('should return empty array when input is empty', () => {
        const result = filterInnerResizerHandles([]);
        expect(result).toEqual([]);
    });

    it('should return inner div elements when resize handles have div as first child', () => {
        const innerDiv1 = document.createElement('div');
        const innerDiv2 = document.createElement('div');

        const resizeHandle1 = document.createElement('div');
        resizeHandle1.appendChild(innerDiv1);

        const resizeHandle2 = document.createElement('div');
        resizeHandle2.appendChild(innerDiv2);

        const result = filterInnerResizerHandles([resizeHandle1, resizeHandle2]);

        expect(result).toEqual([innerDiv1, innerDiv2]);
    });

    it('should filter out resize handles without first child', () => {
        const innerDiv = document.createElement('div');

        const resizeHandle1 = document.createElement('div');
        resizeHandle1.appendChild(innerDiv);

        const resizeHandle2 = document.createElement('div');
        // No child element

        const result = filterInnerResizerHandles([resizeHandle1, resizeHandle2]);

        expect(result).toEqual([innerDiv]);
    });

    it('should filter out resize handles where first child is not a div', () => {
        const innerDiv = document.createElement('div');
        const innerSpan = document.createElement('span');

        const resizeHandle1 = document.createElement('div');
        resizeHandle1.appendChild(innerDiv);

        const resizeHandle2 = document.createElement('div');
        resizeHandle2.appendChild(innerSpan);

        const result = filterInnerResizerHandles([resizeHandle1, resizeHandle2]);

        expect(result).toEqual([innerDiv]);
    });

    it('should filter out resize handles where first child is text node', () => {
        const innerDiv = document.createElement('div');
        const textNode = document.createTextNode('text');

        const resizeHandle1 = document.createElement('div');
        resizeHandle1.appendChild(innerDiv);

        const resizeHandle2 = document.createElement('div');
        resizeHandle2.appendChild(textNode);

        const result = filterInnerResizerHandles([resizeHandle1, resizeHandle2]);

        expect(result).toEqual([innerDiv]);
    });

    it('should handle resize handles with multiple children', () => {
        const innerDiv1 = document.createElement('div');
        const innerDiv2 = document.createElement('div');
        const secondChild = document.createElement('span');

        const resizeHandle1 = document.createElement('div');
        resizeHandle1.appendChild(innerDiv1);
        resizeHandle1.appendChild(secondChild);

        const resizeHandle2 = document.createElement('div');
        resizeHandle2.appendChild(innerDiv2);

        const result = filterInnerResizerHandles([resizeHandle1, resizeHandle2]);

        expect(result).toEqual([innerDiv1, innerDiv2]);
    });

    it('should handle mixed valid and invalid resize handles', () => {
        const innerDiv1 = document.createElement('div');
        const innerDiv2 = document.createElement('div');
        const innerSpan = document.createElement('span');

        const resizeHandle1 = document.createElement('div');
        resizeHandle1.appendChild(innerDiv1);

        const resizeHandle2 = document.createElement('div');
        // No child

        const resizeHandle3 = document.createElement('div');
        resizeHandle3.appendChild(innerSpan);

        const resizeHandle4 = document.createElement('div');
        resizeHandle4.appendChild(innerDiv2);

        const result = filterInnerResizerHandles([
            resizeHandle1,
            resizeHandle2,
            resizeHandle3,
            resizeHandle4,
        ]);

        expect(result).toEqual([innerDiv1, innerDiv2]);
    });
});
