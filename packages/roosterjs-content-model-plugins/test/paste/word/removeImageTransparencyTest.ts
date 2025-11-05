import { moveChildNodes } from 'roosterjs-content-model-dom';
import { removeImageTransparencyFromNode } from '../../../lib/paste/WordDesktop/removeImageTransparency';

describe('removeImageTransparencyFromNode', () => {
    let mockCanvas: HTMLCanvasElement;
    let mockCtx: CanvasRenderingContext2D;
    let mockImageData: ImageData;
    let originalCreateElement: typeof document.createElement;
    let mockEditor: any;

    beforeEach(() => {
        // Mock editor
        mockEditor = {
            triggerEvent: jasmine.createSpy('triggerEvent'),
        };

        // Mock canvas and context
        mockImageData = {
            data: new Uint8ClampedArray([
                // First pixel: fully transparent red
                255,
                0,
                0,
                0,
                // Second pixel: opaque blue
                0,
                0,
                255,
                255,
                // Third pixel: semi-transparent green
                0,
                255,
                0,
                128,
                // Fourth pixel: fully transparent white
                255,
                255,
                255,
                0,
            ]),
            width: 2,
            height: 2,
        } as ImageData;

        mockCtx = {
            drawImage: jasmine.createSpy('drawImage'),
            getImageData: jasmine.createSpy('getImageData').and.returnValue(mockImageData),
            putImageData: jasmine.createSpy('putImageData'),
            fillStyle: '',
            fillRect: jasmine.createSpy('fillRect'),
        } as any;

        mockCanvas = {
            getContext: jasmine.createSpy('getContext').and.returnValue(mockCtx),
            toDataURL: jasmine.createSpy('toDataURL').and.returnValue('data:image/png;base64,mock'),
            width: 0,
            height: 0,
        } as any;

        originalCreateElement = document.createElement;
        spyOn(document, 'createElement').and.callFake((tagName: string) => {
            if (tagName === 'canvas') {
                return mockCanvas;
            }
            return originalCreateElement.call(document, tagName);
        });
    });

    afterEach(() => {
        document.createElement = originalCreateElement;
    });

    it('should process loaded image and remove transparency', done => {
        const source = '<img src="test.png" width="100" height="100" />';

        const testDiv = document.createElement('div');
        testDiv.innerHTML = source;
        const testFragment = document.createDocumentFragment();
        moveChildNodes(testFragment, testDiv);

        const img = testFragment.querySelector('img') as HTMLImageElement;

        // Mock image properties
        Object.defineProperty(img, 'complete', { value: true, writable: true });
        Object.defineProperty(img, 'naturalWidth', { value: 100, writable: true });
        Object.defineProperty(img, 'naturalHeight', { value: 100, writable: true });
        Object.defineProperty(img, 'width', { value: 100, writable: true });
        Object.defineProperty(img, 'height', { value: 100, writable: true });

        // Call removeImageTransparencyFromNode with editor and get the callback function
        const callback = removeImageTransparencyFromNode(mockEditor);
        callback(null as any, img);

        // Since the image is already complete, processing should happen immediately
        setTimeout(() => {
            expect(mockCanvas.getContext).toHaveBeenCalledWith('2d', {});
            expect(mockCanvas.width).toBe(100);
            expect(mockCanvas.height).toBe(100);
            expect(mockCtx.drawImage as jasmine.Spy).toHaveBeenCalledWith(img, 0, 0, 100, 100);
            expect(mockCtx.getImageData).toHaveBeenCalledWith(0, 0, 100, 100);
            expect(mockCtx.putImageData).toHaveBeenCalled();
            expect(img.src).toBe('data:image/png;base64,mock');
            expect(mockEditor.triggerEvent).toHaveBeenCalledWith('contentChanged', {
                source: 'ImageTransparencyRemoved',
                data: img,
            });

            // Check that only fully transparent pixels were replaced with white
            expect(mockImageData.data[0]).toBe(255); // red -> white
            expect(mockImageData.data[1]).toBe(255); // green -> white
            expect(mockImageData.data[2]).toBe(255); // blue -> white
            expect(mockImageData.data[3]).toBe(255); // alpha -> opaque

            // Opaque pixel should remain unchanged
            expect(mockImageData.data[4]).toBe(0); // blue pixel red component
            expect(mockImageData.data[5]).toBe(0); // blue pixel green component
            expect(mockImageData.data[6]).toBe(255); // blue pixel blue component
            expect(mockImageData.data[7]).toBe(255); // blue pixel alpha component

            // Semi-transparent pixel should remain unchanged
            expect(mockImageData.data[8]).toBe(0); // green pixel red component
            expect(mockImageData.data[9]).toBe(255); // green pixel green component
            expect(mockImageData.data[10]).toBe(0); // green pixel blue component
            expect(mockImageData.data[11]).toBe(128); // green pixel alpha component (unchanged)

            // Fully transparent white pixel should become opaque white
            expect(mockImageData.data[12]).toBe(255); // white pixel red component
            expect(mockImageData.data[13]).toBe(255); // white pixel green component
            expect(mockImageData.data[14]).toBe(255); // white pixel blue component
            expect(mockImageData.data[15]).toBe(255); // white pixel alpha component

            done();
        }, 0);
    });

    it('should wait for image to load before processing', done => {
        const source = '<img src="test.png" width="100" height="100" />';

        const testDiv = document.createElement('div');
        testDiv.innerHTML = source;
        const testFragment = document.createDocumentFragment();
        moveChildNodes(testFragment, testDiv);

        const img = testFragment.querySelector('img') as HTMLImageElement;

        // Mock image as not complete
        Object.defineProperty(img, 'complete', { value: false, writable: true });
        Object.defineProperty(img, 'naturalWidth', { value: 0, writable: true });
        Object.defineProperty(img, 'naturalHeight', { value: 0, writable: true });

        // Call removeImageTransparencyFromNode with editor and get the callback function
        const callback = removeImageTransparencyFromNode(mockEditor);
        callback(null as any, img);

        // Processing should not happen immediately since image is not loaded
        expect(mockCanvas.getContext).not.toHaveBeenCalled();

        // Simulate image load
        Object.defineProperty(img, 'naturalWidth', { value: 100, writable: true });
        Object.defineProperty(img, 'naturalHeight', { value: 100, writable: true });

        // Trigger onload
        setTimeout(() => {
            if (img.onload) {
                img.onload({} as any);
            }

            expect(mockCanvas.getContext).toHaveBeenCalledWith('2d', {});
            expect(img.src).toBe('data:image/png;base64,mock');
            expect(img.onload).toBeNull();
            expect(img.onerror).toBeNull();
            done();
        }, 0);
    });

    it('should handle image load error', done => {
        const source = '<img src="invalid.png" width="100" height="100" />';

        const testDiv = document.createElement('div');
        testDiv.innerHTML = source;
        const testFragment = document.createDocumentFragment();
        moveChildNodes(testFragment, testDiv);

        const img = testFragment.querySelector('img') as HTMLImageElement;

        // Mock image as not complete
        Object.defineProperty(img, 'complete', { value: false, writable: true });
        Object.defineProperty(img, 'naturalWidth', { value: 0, writable: true });

        // Call removeImageTransparencyFromNode with editor and get the callback function
        const callback = removeImageTransparencyFromNode(mockEditor);
        callback(null as any, img);

        // Simulate image error
        setTimeout(() => {
            if (img.onerror) {
                img.onerror({} as any);
            }

            expect(mockCanvas.getContext).not.toHaveBeenCalled();
            expect(img.onload).toBeNull();
            expect(img.onerror).toBeNull();
            done();
        }, 0);
    });

    it('should skip processing when canvas context is not available', done => {
        const source = '<img src="test.png" width="100" height="100" />';

        const testDiv = document.createElement('div');
        testDiv.innerHTML = source;
        const testFragment = document.createDocumentFragment();
        moveChildNodes(testFragment, testDiv);

        const img = testFragment.querySelector('img') as HTMLImageElement;

        // Mock image properties
        Object.defineProperty(img, 'complete', { value: true, writable: true });
        Object.defineProperty(img, 'naturalWidth', { value: 100, writable: true });
        Object.defineProperty(img, 'naturalHeight', { value: 100, writable: true });

        // Mock getContext to return null
        mockCanvas.getContext = jasmine.createSpy('getContext').and.returnValue(null);

        // Call removeImageTransparencyFromNode with editor and get the callback function
        const callback = removeImageTransparencyFromNode(mockEditor);
        callback(null as any, img);

        setTimeout(() => {
            expect(mockCanvas.getContext).toHaveBeenCalledWith('2d', {});
            expect(img.src).toContain('test.png'); // Should remain unchanged
            done();
        }, 0);
    });

    it('should skip processing when image has no valid dimensions', done => {
        const source = '<img src="test.png" />';

        const testDiv = document.createElement('div');
        testDiv.innerHTML = source;
        const testFragment = document.createDocumentFragment();
        moveChildNodes(testFragment, testDiv);

        const img = testFragment.querySelector('img') as HTMLImageElement;

        // Mock image with zero dimensions
        Object.defineProperty(img, 'complete', { value: true, writable: true });
        Object.defineProperty(img, 'naturalWidth', { value: 0, writable: true });
        Object.defineProperty(img, 'naturalHeight', { value: 0, writable: true });
        Object.defineProperty(img, 'width', { value: 0, writable: true });
        Object.defineProperty(img, 'height', { value: 0, writable: true });
        Object.defineProperty(img, 'offsetWidth', { value: 0, writable: true });
        Object.defineProperty(img, 'offsetHeight', { value: 0, writable: true });

        // Call removeImageTransparencyFromNode with editor and get the callback function
        const callback = removeImageTransparencyFromNode(mockEditor);
        callback(null as any, img);

        setTimeout(() => {
            expect(mockCanvas.getContext).toHaveBeenCalledWith('2d', {});
            expect(mockCtx.drawImage).not.toHaveBeenCalled(); // Should not process
            expect(img.src).toContain('test.png'); // Should remain unchanged
            done();
        }, 0);
    });

    it('should ignore non-image elements', () => {
        const div = document.createElement('div');

        // Call removeImageTransparencyFromNode with editor and get the callback function
        const callback = removeImageTransparencyFromNode(mockEditor);
        callback(null as any, div);

        // Should not attempt to process
        expect(mockCanvas.getContext).not.toHaveBeenCalled();
    });

    it('should ignore non-element nodes', () => {
        const textNode = document.createTextNode('test');

        // Call removeImageTransparencyFromNode with editor and get the callback function
        const callback = removeImageTransparencyFromNode(mockEditor);
        callback(null as any, textNode);

        // Should not attempt to process
        expect(mockCanvas.getContext).not.toHaveBeenCalled();
    });
});
