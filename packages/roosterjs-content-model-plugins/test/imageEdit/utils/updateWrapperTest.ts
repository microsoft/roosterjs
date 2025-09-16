import { createImageWrapper } from '../../../lib/imageEdit/utils/createImageWrapper';
import { ImageEditOptions } from '../../../lib/imageEdit/types/ImageEditOptions';
import { initEditor } from '../../TestHelper';
import { updateWrapper } from '../../../lib/imageEdit/utils/updateWrapper';

describe('updateWrapper', () => {
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

        expect(wrapper.style.marginLeft).toBe('0px');
        expect(wrapper.style.marginRight).toBe('0px');
        expect(wrapper.style.marginTop).toBe('0px');
        expect(wrapper.style.marginBottom).toBe('5px');
        expect(wrapper.style.transform).toBe(`rotate(0rad)`);
        expect(wrapper.style.verticalAlign).toBe(`text-bottom`);

        expect(wrapper.style.width).toBe('20px');
        expect(wrapper.style.height).toBe('12px');
        expect(wrapper.style.textAlign).toBe('left');

        expect(imageClone.style.width).toBe('20px');
        expect(imageClone.style.height).toBe('13.3333px');
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

        expect(wrapper.style.marginLeft).toBe('0px');
        expect(wrapper.style.marginRight).toBe('0px');
        expect(wrapper.style.marginTop).toBe('0px');
        expect(wrapper.style.marginBottom).toBe('5px');
        expect(wrapper.style.transform).toBe(`rotate(0rad)`);
        expect(wrapper.style.verticalAlign).toBe(`text-bottom`);

        expect(wrapper.style.width).toBe('20px');
        expect(wrapper.style.height).toBe('12px');
        expect(wrapper.style.textAlign).toBe('right');

        expect(imageClone.style.width).toBe('20px');
        expect(imageClone.style.height).toBe('13.3333px');
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
        expect(wrapper.style.width).toBe('24px'); // visibleWidth (20) + borderWidth (4: 2*2px)
        expect(wrapper.style.height).toBe('24px'); // visibleHeight (20) + borderWidth (4: 2*2px)

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
        expect(wrapper.style.width).toBe('20px');
        expect(wrapper.style.height).toBe('20px');

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
        expect(wrapper.style.width).toBe('20px'); // 18px + 2px border
        expect(wrapper.style.height).toBe('20px'); // 18px + 2px border

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
        expect(imageClone.style.width).toBe('50px'); // Should remain unchanged
        expect(imageClone.style.height).toBe('40px'); // Should remain unchanged
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
        expect(imageClone.style.width).toBe('20px'); // Should be originalWidth
        expect(imageClone.style.height).toBe('22.22px'); // Should be originalHeight
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
        const originalClientWidth = Object.getOwnPropertyDescriptor(wrapper, 'clientWidth');

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
        expect(imageClone.style.width).toBe('100px');
        expect(imageClone.style.height).toBe('100px');
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
        expect(imageClone.style.width).toBe('20px'); // Should be originalWidth
        expect(imageClone.style.height).toBe('22.22px'); // Should be originalHeight
        // 2. Resize processing happened (because && !isRotating is true)
        expect(clientWidthAccessed).toBe(true);

        image.remove();
    });
});
