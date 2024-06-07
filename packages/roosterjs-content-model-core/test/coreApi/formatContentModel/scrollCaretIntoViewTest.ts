import * as getDOMInsertPointRect from 'roosterjs-content-model-dom/lib/domUtils/selection/getDOMInsertPointRect';
import { EditorCore } from 'roosterjs-content-model-types';
import { scrollCaretIntoView } from '../../../lib/coreApi/formatContentModel/scrollCaretIntoView';

describe('scrollCaretIntoView', () => {
    let getDOMInsertPointRectSpy: jasmine.Spy;
    let getVisibleViewportSpy: jasmine.Spy;
    let calculateZoomScaleSpy: jasmine.Spy;
    let core: EditorCore;
    let mockedScrollContainer: HTMLElement;
    const startContainer = 'STARTCONTAINER' as any;
    const endContainer = 'ENDCONTAINER' as any;
    const startOffset = 'STARTOFFSET' as any;
    const endOffset = 'ENDOFFSET' as any;
    const mockedDocument = 'DOCUMENT' as any;

    beforeEach(() => {
        getDOMInsertPointRectSpy = spyOn(getDOMInsertPointRect, 'getDOMInsertPointRect');
        getVisibleViewportSpy = jasmine.createSpy('getVisibleViewport');
        calculateZoomScaleSpy = jasmine.createSpy('calculateZoomScale').and.returnValue(1);

        mockedScrollContainer = {
            scrollTop: 50,
        } as any;

        core = {
            physicalRoot: {
                ownerDocument: mockedDocument,
            },
            api: {
                getVisibleViewport: getVisibleViewportSpy,
            },
            domEvent: {
                scrollContainer: mockedScrollContainer,
            },
            domHelper: {
                calculateZoomScale: calculateZoomScaleSpy,
            },
        } as any;
    });

    it('range selection, not reverted, caret is in view, zoom scale=1', () => {
        getDOMInsertPointRectSpy.and.returnValue({
            top: 30,
            bottom: 40,
        } as any);
        getVisibleViewportSpy.and.returnValue({
            top: 0,
            bottom: 100,
        } as any);

        scrollCaretIntoView(core, {
            type: 'range',
            isReverted: false,
            range: {
                startContainer,
                endContainer,
                startOffset,
                endOffset,
            } as any,
        });

        expect(getDOMInsertPointRectSpy).toHaveBeenCalledWith(mockedDocument, {
            node: endContainer,
            offset: endOffset,
        });
        expect(getVisibleViewportSpy).toHaveBeenCalledWith(core);
        expect(calculateZoomScaleSpy).not.toHaveBeenCalled();
        expect(mockedScrollContainer.scrollTop).toBe(50);
    });

    it('range selection, not reverted, caret is in view, zoom scale=2', () => {
        getDOMInsertPointRectSpy.and.returnValue({
            top: 30,
            bottom: 40,
        } as any);
        getVisibleViewportSpy.and.returnValue({
            top: 0,
            bottom: 100,
        } as any);
        calculateZoomScaleSpy.and.returnValue(2);

        scrollCaretIntoView(core, {
            type: 'range',
            isReverted: false,
            range: {
                startContainer,
                endContainer,
                startOffset,
                endOffset,
            } as any,
        });

        expect(getDOMInsertPointRectSpy).toHaveBeenCalledWith(mockedDocument, {
            node: endContainer,
            offset: endOffset,
        });
        expect(getVisibleViewportSpy).toHaveBeenCalledWith(core);
        expect(calculateZoomScaleSpy).not.toHaveBeenCalled();
        expect(mockedScrollContainer.scrollTop).toBe(50);
    });

    it('range selection, not reverted, caret is above view, zoom scale=1', () => {
        getDOMInsertPointRectSpy.and.returnValue({
            top: 30,
            bottom: 45,
        } as any);
        getVisibleViewportSpy.and.returnValue({
            top: 40,
            bottom: 100,
        } as any);

        scrollCaretIntoView(core, {
            type: 'range',
            isReverted: false,
            range: {
                startContainer,
                endContainer,
                startOffset,
                endOffset,
            } as any,
        });

        expect(getDOMInsertPointRectSpy).toHaveBeenCalledWith(mockedDocument, {
            node: endContainer,
            offset: endOffset,
        });
        expect(getVisibleViewportSpy).toHaveBeenCalledWith(core);
        expect(calculateZoomScaleSpy).toHaveBeenCalledWith();
        expect(mockedScrollContainer.scrollTop).toBe(40);
    });

    it('range selection, not reverted, caret is above view, zoom scale=2', () => {
        getDOMInsertPointRectSpy.and.returnValue({
            top: 30,
            bottom: 45,
        } as any);
        getVisibleViewportSpy.and.returnValue({
            top: 40,
            bottom: 100,
        } as any);
        calculateZoomScaleSpy.and.returnValue(2);

        scrollCaretIntoView(core, {
            type: 'range',
            isReverted: false,
            range: {
                startContainer,
                endContainer,
                startOffset,
                endOffset,
            } as any,
        });

        expect(getDOMInsertPointRectSpy).toHaveBeenCalledWith(mockedDocument, {
            node: endContainer,
            offset: endOffset,
        });
        expect(getVisibleViewportSpy).toHaveBeenCalledWith(core);
        expect(calculateZoomScaleSpy).toHaveBeenCalledWith();
        expect(mockedScrollContainer.scrollTop).toBe(45);
    });

    it('range selection, not reverted, caret is below view, zoom scale=1', () => {
        getDOMInsertPointRectSpy.and.returnValue({
            top: 120,
            bottom: 140,
        } as any);
        getVisibleViewportSpy.and.returnValue({
            top: 40,
            bottom: 100,
        } as any);
        calculateZoomScaleSpy.and.returnValue(1);

        scrollCaretIntoView(core, {
            type: 'range',
            isReverted: false,
            range: {
                startContainer,
                endContainer,
                startOffset,
                endOffset,
            } as any,
        });

        expect(getDOMInsertPointRectSpy).toHaveBeenCalledWith(mockedDocument, {
            node: endContainer,
            offset: endOffset,
        });
        expect(getVisibleViewportSpy).toHaveBeenCalledWith(core);
        expect(calculateZoomScaleSpy).toHaveBeenCalledWith();
        expect(mockedScrollContainer.scrollTop).toBe(90);
    });

    it('range selection, not reverted, caret is below view, zoom scale=0.5', () => {
        getDOMInsertPointRectSpy.and.returnValue({
            top: 120,
            bottom: 140,
        } as any);
        getVisibleViewportSpy.and.returnValue({
            top: 40,
            bottom: 100,
        } as any);
        calculateZoomScaleSpy.and.returnValue(0.5);

        scrollCaretIntoView(core, {
            type: 'range',
            isReverted: false,
            range: {
                startContainer,
                endContainer,
                startOffset,
                endOffset,
            } as any,
        });

        expect(getDOMInsertPointRectSpy).toHaveBeenCalledWith(mockedDocument, {
            node: endContainer,
            offset: endOffset,
        });
        expect(getVisibleViewportSpy).toHaveBeenCalledWith(core);
        expect(calculateZoomScaleSpy).toHaveBeenCalledWith();
        expect(mockedScrollContainer.scrollTop).toBe(130);
    });

    it('range selection, not reverted, caret is above and below view, zoom scale=1', () => {
        getDOMInsertPointRectSpy.and.returnValue({
            top: 10,
            bottom: 80,
        } as any);
        getVisibleViewportSpy.and.returnValue({
            top: 30,
            bottom: 40,
        } as any);
        calculateZoomScaleSpy.and.returnValue(1);

        scrollCaretIntoView(core, {
            type: 'range',
            isReverted: false,
            range: {
                startContainer,
                endContainer,
                startOffset,
                endOffset,
            } as any,
        });

        expect(getDOMInsertPointRectSpy).toHaveBeenCalledWith(mockedDocument, {
            node: endContainer,
            offset: endOffset,
        });
        expect(getVisibleViewportSpy).toHaveBeenCalledWith(core);
        expect(calculateZoomScaleSpy).toHaveBeenCalledWith();
        expect(mockedScrollContainer.scrollTop).toBe(90);
    });

    it('range selection, reverted, caret is above, zoom scale=1', () => {
        getDOMInsertPointRectSpy.and.returnValue({
            top: 10,
            bottom: 20,
        } as any);
        getVisibleViewportSpy.and.returnValue({
            top: 30,
            bottom: 40,
        } as any);
        calculateZoomScaleSpy.and.returnValue(1);

        scrollCaretIntoView(core, {
            type: 'range',
            isReverted: true,
            range: {
                startContainer,
                endContainer,
                startOffset,
                endOffset,
            } as any,
        });

        expect(getDOMInsertPointRectSpy).toHaveBeenCalledWith(mockedDocument, {
            node: startContainer,
            offset: startOffset,
        });
        expect(getVisibleViewportSpy).toHaveBeenCalledWith(core);
        expect(calculateZoomScaleSpy).toHaveBeenCalledWith();
        expect(mockedScrollContainer.scrollTop).toBe(30);
    });

    it('image selection, not reverted, caret is above view, zoom scale=1', () => {
        getDOMInsertPointRectSpy.and.returnValue({
            top: 10,
            bottom: 20,
        } as any);
        getVisibleViewportSpy.and.returnValue({
            top: 30,
            bottom: 40,
        } as any);
        calculateZoomScaleSpy.and.returnValue(1);

        const mockedImage = 'IMAGE' as any;

        scrollCaretIntoView(core, {
            type: 'image',
            image: mockedImage,
        });

        expect(getDOMInsertPointRectSpy).toHaveBeenCalledWith(mockedDocument, {
            node: mockedImage,
            offset: 0,
        });
        expect(getVisibleViewportSpy).toHaveBeenCalledWith(core);
        expect(calculateZoomScaleSpy).toHaveBeenCalledWith();
        expect(mockedScrollContainer.scrollTop).toBe(30);
    });
});
