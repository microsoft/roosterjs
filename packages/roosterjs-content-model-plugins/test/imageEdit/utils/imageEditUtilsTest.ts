import {
    checkIfImageWasResized,
    getPx,
    isASmallImage,
    isRTL,
    rotateCoordinate,
    setFlipped,
    setSize,
    setWrapperSizeDimensions,
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

        it('should flip horizontally/vertically ', () => {
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
            setWrapperSizeDimensions(wrapper, image, 10, 10);
            expect(wrapper.style.width).toBe('12px');
            expect(wrapper.style.height).toBe('12px');
        });

        it('without border style', () => {
            const wrapper = document.createElement('span');
            const image = document.createElement('img');
            setWrapperSizeDimensions(wrapper, image, 10, 10);
            expect(wrapper.style.width).toBe('10px');
            expect(wrapper.style.height).toBe('10px');
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

    describe('isRTL', () => {
        it(' not isRTL', () => {
            const image = document.createElement('img');
            const result = isRTL(image);
            expect(result).toBeFalsy();
        });
    });
});
