import { itChromeOnly } from 'roosterjs-content-model-dom/test/testUtils';
import {
    checkIfImageWasResized,
    getPx,
    isASmallImage,
    rotateCoordinate,
    setFlipped,
    setSize,
    setWrapperSizeDimensions,
    getActualWrapperDimensions,
} from '../../../lib/imageEdit/utils/imageEditUtils';

describe('imageEditUtils', () => {
    describe('getPx', () => {
        it('should return in px', () => {
            const result = getPx(30);
            expect(result).toBe('30px');
        });
    });

    describe('isASmallImage', () => {
        it('is small', () => {
            const result = isASmallImage(10, 10);
            expect(result).toBeTruthy();
        });

        it('is not small', () => {
            const result = isASmallImage(100, 100);
            expect(result).toBeFalsy();
        });
    });

    describe('rotateCoordinate', () => {
        it('should calculate rotation ', () => {
            const result = rotateCoordinate(10, 10, Math.PI);
            expect(result).toEqual([-10, -10.000000000000002]);
        });
    });

    describe('setFlipped', () => {
        it('should flip horizontally ', () => {
            const element = document.createElement('div');
            setFlipped(element, true, false);
            expect(element.style.transform).toBe('scale(-1, 1)');
        });

        it('should flip vertically ', () => {
            const element = document.createElement('div');
            setFlipped(element, false, true);
            expect(element.style.transform).toBe('scale(1, -1)');
        });

        itChromeOnly('should flip horizontally/vertically ', () => {
            const element = document.createElement('div');
            setFlipped(element, true, true);
            expect(element.style.transform).toBe('scale(-1, -1)');
        });
    });

    describe('setWrapperSizeDimensions', () => {
        it('with border style', () => {
            const wrapper = document.createElement('span');
            const image = document.createElement('img');
            image.style.borderStyle = 'dotted';
            image.style.borderWidth = '1px';
            setWrapperSizeDimensions(wrapper, image, 10, 10, false);
            expect(wrapper.style.width).toBe('12px');
            expect(wrapper.style.height).toBe('12px');
        });

        it('without border style', () => {
            const wrapper = document.createElement('span');
            const image = document.createElement('img');
            setWrapperSizeDimensions(wrapper, image, 10, 10, false);
            expect(wrapper.style.width).toBe('10px');
            expect(wrapper.style.height).toBe('10px');
        });

        it('with border style during rotation', () => {
            const wrapper = document.createElement('span');
            const image = document.createElement('img');
            image.style.borderStyle = 'dotted';
            image.style.borderWidth = '1px';
            image.style.width = '20px';
            image.style.height = '15px';

            // During rotation, should use image.style dimensions instead of provided width/height
            setWrapperSizeDimensions(wrapper, image, 10, 10, true);
            expect(wrapper.style.width).toBe('22px'); // 20 + 2 (border width)
            expect(wrapper.style.height).toBe('17px'); // 15 + 2 (border width)
        });

        it('with border style but no explicit border width', () => {
            const wrapper = document.createElement('span');
            const image = document.createElement('img');
            image.style.borderStyle = 'dotted';
            // No borderWidth set, should default to 2px
            setWrapperSizeDimensions(wrapper, image, 10, 10, false);
            expect(wrapper.style.width).toBe('12px'); // 10 + 2 (default border width)
            expect(wrapper.style.height).toBe('12px'); // 10 + 2 (default border width)
        });

        it('without border style during rotation', () => {
            const wrapper = document.createElement('span');
            const image = document.createElement('img');
            setWrapperSizeDimensions(wrapper, image, 10, 10, true);
            expect(wrapper.style.width).toBe('10px');
            expect(wrapper.style.height).toBe('10px');
        });
    });

    describe('getActualWrapperDimensions', () => {
        it('should return original dimensions when image has no border', () => {
            const image = document.createElement('img');
            const result = getActualWrapperDimensions(image, 100, 80);
            expect(result).toEqual({ width: 100, height: 80 });
        });

        it('should subtract border width when image has border style and explicit width', () => {
            const image = document.createElement('img');
            image.style.borderStyle = 'solid';
            image.style.borderWidth = '3px';
            const result = getActualWrapperDimensions(image, 100, 80);
            expect(result).toEqual({ width: 94, height: 74 }); // 100-6, 80-6
        });

        it('should subtract default border width when image has border style but no explicit width', () => {
            const image = document.createElement('img');
            image.style.borderStyle = 'dotted';
            // No borderWidth set, should default to 2px
            const result = getActualWrapperDimensions(image, 100, 80);
            expect(result).toEqual({ width: 98, height: 78 }); // 100-2, 80-2
        });

        it('should handle zero wrapper dimensions', () => {
            const image = document.createElement('img');
            image.style.borderStyle = 'solid';
            image.style.borderWidth = '1px';
            const result = getActualWrapperDimensions(image, 0, 0);
            expect(result).toEqual({ width: -2, height: -2 }); // 0-2, 0-2
        });

        it('should handle various border styles', () => {
            const image = document.createElement('img');
            image.style.borderStyle = 'dashed';
            image.style.borderWidth = '5px';
            const result = getActualWrapperDimensions(image, 200, 150);
            expect(result).toEqual({ width: 190, height: 140 }); // 200-10, 150-10
        });
    });

    describe('setSize', () => {
        it('should set size', () => {
            const element = document.createElement('div');
            setSize(element, 10, 10, 10, 10, 10, 10);
            expect(element.style.left).toBe('10px');
            expect(element.style.top).toBe('10px');
            expect(element.style.right).toBe('10px');
            expect(element.style.bottom).toBe('10px');
            expect(element.style.width).toBe('10px');
            expect(element.style.height).toBe('10px');
        });
    });

    describe('checkIfImageWasResized', () => {
        it('was resized', () => {
            const image = document.createElement('img');
            image.style.width = '10px';
            image.style.height = '10px';
            const result = checkIfImageWasResized(image);
            expect(result).toBeTruthy();
        });

        it('was resized', () => {
            const image = document.createElement('img');
            const result = checkIfImageWasResized(image);
            expect(result).toBeFalsy();
        });
    });
});
