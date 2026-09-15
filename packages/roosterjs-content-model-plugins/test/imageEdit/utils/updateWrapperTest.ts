import { createImageWrapper } from '../../../lib/imageEdit/utils/createImageWrapper';
import { ImageEditOptions } from '../../../lib/imageEdit/types/ImageEditOptions';
import { initEditor } from '../../TestHelper';
import { updateWrapper } from '../../../lib/imageEdit/utils/updateWrapper';

describe('updateWrapper', () => {
    function expectPixelValue(value: string, expected: number) {
        expect(value).toMatch(/^-?\d+(?:\.\d+)?px$/);
        expect(parseFloat(value)).toBeCloseTo(expected, 4);
    }

    const editor = initEditor('wrapper_test');
    const options: ImageEditOptions = {
        borderColor: '#DB626C',
        minWidth: 10,
        minHeight: 10,
        preserveRatio: true,
        disableRotate: false,
        disableSideResize: false,
        onSelectState: ['resize'],
    };

    // Base template - should not be mutated directly
    const baseEditInfo = {
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

    // Working copy that gets reset before each test
    let editInfo = { ...baseEditInfo };

    beforeEach(() => {
        // Reset editInfo to a fresh copy before each test
        editInfo = { ...baseEditInfo };
    });
    const htmlOptions = {
        borderColor: '#DB626C',
        rotateHandleBackColor: 'white',
        isSmallImage: false,
        disableSideResize: false,
    };

    it('should update size', () => {
        const image = document.createElement('img');
        document.body.appendChild(image);

        const testEditInfo = { ...editInfo, heightPx: 12 }; // Create a copy with modified height

        const { wrapper, imageClone, resizers } = createImageWrapper(
            editor,
            image,
            options,
            testEditInfo,
            htmlOptions,
            ['resize']
        );
        updateWrapper(
            testEditInfo,
            options,
            image,
            imageClone,
            wrapper,
            resizers,
            undefined,
            false,
            false
        );

        expectPixelValue(wrapper.style.marginLeft, 0);
        expectPixelValue(wrapper.style.marginRight, 0);
        expectPixelValue(wrapper.style.marginTop, 0);
        expectPixelValue(wrapper.style.marginBottom, 5);
        expect(wrapper.style.transform).toBe(`rotate(0rad)`);
        expect(wrapper.style.verticalAlign).toBe(`text-bottom`);

        expectPixelValue(wrapper.style.width, 20);
        expectPixelValue(wrapper.style.height, 12);
        expect(wrapper.style.textAlign).toBe('left');

        expectPixelValue(imageClone.style.width, 20);
        expectPixelValue(imageClone.style.height, 13.3333);
        expect(imageClone.style.position).toBe('absolute');
        image.remove();
    });

    it('RTL - should update size', () => {
        const image = document.createElement('img');
        document.body.appendChild(image);

        const testEditInfo = { ...editInfo, heightPx: 12 }; // Create a copy with modified height

        const { wrapper, imageClone, resizers } = createImageWrapper(
            editor,
            image,
            options,
            testEditInfo,
            htmlOptions,
            ['resize']
        );
        updateWrapper(testEditInfo, options, image, imageClone, wrapper, resizers, undefined, true);

        expectPixelValue(wrapper.style.marginLeft, 0);
        expectPixelValue(wrapper.style.marginRight, 0);
        expectPixelValue(wrapper.style.marginTop, 0);
        expectPixelValue(wrapper.style.marginBottom, 5);
        expect(wrapper.style.transform).toBe(`rotate(0rad)`);
        expect(wrapper.style.verticalAlign).toBe(`text-bottom`);

        expectPixelValue(wrapper.style.width, 20);
        expectPixelValue(wrapper.style.height, 12);
        expect(wrapper.style.textAlign).toBe('right');

        expectPixelValue(imageClone.style.width, 20);
        expectPixelValue(imageClone.style.height, 13.3333);
        expect(imageClone.style.position).toBe('absolute');
        expect(imageClone.style.position).toBe('absolute');
        image.remove();
    });

    it('should handle bordered images correctly for doubleCheckResize', () => {
        const image = document.createElement('img');
        image.style.borderStyle = 'solid';
        image.style.borderWidth = '2px';
        document.body.appendChild(image);

        const testEditInfo = { ...editInfo }; // Create a copy to avoid mutation

        const { wrapper, imageClone, resizers } = createImageWrapper(
            editor,
            image,
            options,
            testEditInfo,
            htmlOptions,
            ['resize']
        ); // Set wrapper size to simulate clientWidth/clientHeight including borders
        wrapper.style.width = '24px'; // 20px image + 4px border (2px on each side)
        wrapper.style.height = '24px'; // 20px image + 4px border (2px on each side)

        // Mock clientWidth and clientHeight to return values that include borders
        Object.defineProperty(wrapper, 'clientWidth', {
            value: 24,
            configurable: true,
        });
        Object.defineProperty(wrapper, 'clientHeight', {
            value: 24,
            configurable: true,
        });

        updateWrapper(
            testEditInfo,
            options,
            image,
            imageClone,
            wrapper,
            resizers,
            undefined,
            false,
            false
        );

        // The wrapper size should include borders (set by setWrapperSizeDimensions)
        expectPixelValue(wrapper.style.width, 24); // visibleWidth (20) + borderWidth (4: 2*2px)
        expectPixelValue(wrapper.style.height, 24); // visibleHeight (20) + borderWidth (4: 2*2px)

        image.remove();
    });

    it('should handle images without borders correctly', () => {
        const image = document.createElement('img');
        document.body.appendChild(image);

        const testEditInfo = { ...editInfo }; // Create a copy to avoid mutation

        const { wrapper, imageClone, resizers } = createImageWrapper(
            editor,
            image,
            options,
            testEditInfo,
            htmlOptions,
            ['resize']
        ); // Mock clientWidth and clientHeight
        Object.defineProperty(wrapper, 'clientWidth', {
            value: 20,
            configurable: true,
        });
        Object.defineProperty(wrapper, 'clientHeight', {
            value: 20,
            configurable: true,
        });

        updateWrapper(
            editInfo,
            options,
            image,
            imageClone,
            wrapper,
            resizers,
            undefined,
            false,
            false
        );

        // The wrapper size should match visible dimensions exactly
        expectPixelValue(wrapper.style.width, 20);
        expectPixelValue(wrapper.style.height, 20);

        image.remove();
    });

    it('should handle rotation correctly with borders', () => {
        const image = document.createElement('img');
        image.style.borderStyle = 'solid';
        image.style.borderWidth = '1px';
        image.style.width = '18px'; // Original image dimensions
        image.style.height = '18px';
        document.body.appendChild(image);

        const rotatedEditInfo = {
            ...editInfo,
            angleRad: Math.PI / 4, // 45 degrees
        };

        const { wrapper, imageClone, resizers } = createImageWrapper(
            editor,
            image,
            options,
            rotatedEditInfo,
            htmlOptions,
            ['resize']
        );

        updateWrapper(
            rotatedEditInfo,
            options,
            image,
            imageClone,
            wrapper,
            resizers,
            undefined,
            false,
            true
        );

        // During rotation with borders, wrapper should use image.style dimensions + border
        expectPixelValue(wrapper.style.width, 20); // 18px + 2px border
        expectPixelValue(wrapper.style.height, 20); // 18px + 2px border

        image.remove();
    });

    it('should not update cloned image size during rotation', () => {
        const image = document.createElement('img');
        document.body.appendChild(image);

        const testEditInfo = { ...editInfo }; // Create a copy to avoid mutation

        const { wrapper, imageClone, resizers } = createImageWrapper(
            editor,
            image,
            options,
            testEditInfo,
            htmlOptions,
            ['resize']
        );

        // Set initial size on cloned image
        imageClone.style.width = '50px';
        imageClone.style.height = '40px';

        // Call updateWrapper with isRotating = true
        updateWrapper(
            testEditInfo,
            options,
            image,
            imageClone,
            wrapper,
            resizers,
            undefined,
            false,
            true
        );

        // During rotation, cloned image size should NOT be updated
        expectPixelValue(imageClone.style.width, 50); // Should remain unchanged
        expectPixelValue(imageClone.style.height, 40); // Should remain unchanged
        expect(imageClone.style.position).toBe('absolute'); // Position should still be set

        image.remove();
    });

    it('should update cloned image size when not rotating', () => {
        const image = document.createElement('img');
        document.body.appendChild(image);

        const testEditInfo = { ...editInfo }; // Create a copy to avoid mutation

        const { wrapper, imageClone, resizers } = createImageWrapper(
            editor,
            image,
            options,
            testEditInfo,
            htmlOptions,
            ['resize']
        );

        // Set initial size on cloned image
        imageClone.style.width = '50px';
        imageClone.style.height = '40px';

        // Call updateWrapper with isRotating = false
        updateWrapper(
            testEditInfo,
            options,
            image,
            imageClone,
            wrapper,
            resizers,
            undefined,
            false,
            false
        );

        // When not rotating, cloned image size should be updated to original dimensions
        expectPixelValue(imageClone.style.width, 20); // Should be originalWidth
        expectPixelValue(imageClone.style.height, 22.2222); // Should be originalHeight
        expect(imageClone.style.position).toBe('absolute');

        image.remove();
    });

    it('should not process resizers during rotation', () => {
        const image = document.createElement('img');
        document.body.appendChild(image);

        const { wrapper, imageClone, resizers } = createImageWrapper(
            editor,
            image,
            options,
            editInfo,
            htmlOptions,
            ['resize']
        );

        // Set a flag to track if resize processing happens
        let resizeProcessed = false;

        // Mock clientWidth to detect access
        Object.defineProperty(wrapper, 'clientWidth', {
            get: () => {
                resizeProcessed = true;
                return 20;
            },
            configurable: true,
        });

        updateWrapper(
            editInfo,
            options,
            image,
            imageClone,
            wrapper,
            resizers,
            undefined,
            false,
            true
        );

        // During rotation, resizer logic should not execute, so clientWidth shouldn't be accessed
        expect(resizeProcessed).toBe(false);

        image.remove();
    });

    it('should process resizers when not rotating', () => {
        const image = document.createElement('img');
        document.body.appendChild(image);

        const { wrapper, imageClone, resizers } = createImageWrapper(
            editor,
            image,
            options,
            editInfo,
            htmlOptions,
            ['resize']
        );

        // Set a flag to track if resize processing happens
        let resizeProcessed = false;

        // Mock clientWidth and clientHeight to detect access
        Object.defineProperty(wrapper, 'clientWidth', {
            get: () => {
                resizeProcessed = true;
                return 20;
            },
            configurable: true,
        });
        Object.defineProperty(wrapper, 'clientHeight', {
            value: 20,
            configurable: true,
        });

        // Call updateWrapper with isRotating = false
        updateWrapper(
            editInfo,
            options,
            image,
            imageClone,
            wrapper,
            resizers,
            undefined,
            false,
            false
        );

        // When not rotating, resizer logic should execute, so clientWidth should be accessed
        expect(resizeProcessed).toBe(true);

        image.remove();
    });

    it('should process resizers with border correction when not rotating', () => {
        const image = document.createElement('img');
        image.style.borderStyle = 'solid';
        image.style.borderWidth = '3px';
        document.body.appendChild(image);

        const { wrapper, imageClone, resizers } = createImageWrapper(
            editor,
            image,
            options,
            editInfo,
            htmlOptions,
            ['resize']
        );

        // Track the dimensions passed to getActualWrapperDimensions
        let actualDimensionsUsed = false;

        // Mock clientWidth and clientHeight to include borders
        Object.defineProperty(wrapper, 'clientWidth', {
            get: () => {
                actualDimensionsUsed = true;
                return 26; // 20px + 6px border (3px each side)
            },
            configurable: true,
        });
        Object.defineProperty(wrapper, 'clientHeight', {
            value: 26, // 20px + 6px border (3px each side)
            configurable: true,
        });

        // Call updateWrapper with isRotating = false
        updateWrapper(
            editInfo,
            options,
            image,
            imageClone,
            wrapper,
            resizers,
            undefined,
            false,
            false
        );

        // Verify that the border correction logic was engaged
        expect(actualDimensionsUsed).toBe(true);

        image.remove();
    });

    it('should handle both rotation conditions correctly in single call', () => {
        const image = document.createElement('img');
        document.body.appendChild(image);

        const { wrapper, imageClone, resizers } = createImageWrapper(
            editor,
            image,
            options,
            editInfo,
            htmlOptions,
            ['resize']
        );

        // Set initial sizes
        imageClone.style.width = '100px';
        imageClone.style.height = '100px';

        let clientWidthAccessed = false;
        Object.defineProperty(wrapper, 'clientWidth', {
            get: () => {
                clientWidthAccessed = true;
                return 20;
            },
            configurable: true,
        });

        // Test with rotation = true: should skip both image size update AND resize processing
        updateWrapper(
            editInfo,
            options,
            image,
            imageClone,
            wrapper,
            resizers,
            undefined,
            false,
            true
        );

        // Verify both conditions worked:
        // 1. Image size was not updated (because of !isRotating condition)
        expectPixelValue(imageClone.style.width, 100);
        expectPixelValue(imageClone.style.height, 100);
        // 2. Resize processing was skipped (because of && !isRotating condition)
        expect(clientWidthAccessed).toBe(false);

        // Reset and test with rotation = false
        clientWidthAccessed = false;
        Object.defineProperty(wrapper, 'clientHeight', {
            value: 20,
            configurable: true,
        });

        updateWrapper(
            editInfo,
            options,
            image,
            imageClone,
            wrapper,
            resizers,
            undefined,
            false,
            false
        );

        // Verify both conditions worked:
        // 1. Image size was updated (because !isRotating is true)
        expectPixelValue(imageClone.style.width, 20); // Should be originalWidth
        expectPixelValue(imageClone.style.height, 22.2222); // Should be originalHeight
        // 2. Resize processing happened (because && !isRotating is true)
        expect(clientWidthAccessed).toBe(true);

        image.remove();
    });
});
