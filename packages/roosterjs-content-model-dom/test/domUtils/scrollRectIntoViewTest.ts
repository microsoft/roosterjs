import { DOMHelper } from 'roosterjs-content-model-types';
import { scrollRectIntoView } from '../../lib/domUtils/scrollRectIntoView';

describe('scrollRectIntoView', () => {
    let mockedScrollContainer: HTMLElement;
    let mockedDomHelper: DOMHelper;
    let calculateZoomScaleSpy: jasmine.Spy;

    beforeEach(() => {
        mockedScrollContainer = ({
            scrollTop: 0,
        } as any) as HTMLElement;

        calculateZoomScaleSpy = jasmine.createSpy('calculateZoomScale').and.returnValue(1);

        mockedDomHelper = ({
            calculateZoomScale: calculateZoomScaleSpy,
        } as any) as DOMHelper;
    });

    it('no margin, no need to scroll, no zoom', () => {
        const visibleRect = {
            top: 100,
            bottom: 200,
            left: 100,
            right: 200,
        };
        const targetRect = {
            top: 120,
            bottom: 180,
            left: 120,
            right: 180,
        };

        scrollRectIntoView(mockedScrollContainer, visibleRect, mockedDomHelper, targetRect, 0);

        expect(mockedScrollContainer.scrollTop).toBe(0);
        expect(calculateZoomScaleSpy).not.toHaveBeenCalled();
    });

    it('with margin, no need to scroll, no zoom', () => {
        const visibleRect = {
            top: 100,
            bottom: 200,
            left: 100,
            right: 200,
        };
        const targetRect = {
            top: 120,
            bottom: 180,
            left: 120,
            right: 180,
        };
        scrollRectIntoView(mockedScrollContainer, visibleRect, mockedDomHelper, targetRect, 20);

        expect(mockedScrollContainer.scrollTop).toBe(0);
        expect(calculateZoomScaleSpy).toHaveBeenCalledTimes(1);
    });

    it('need to scroll down, no zoom', () => {
        const visibleRect = {
            top: 100,
            bottom: 200,
            left: 100,
            right: 200,
        };
        const targetRect = {
            top: 220,
            bottom: 280,
            left: 120,
            right: 180,
        };
        scrollRectIntoView(mockedScrollContainer, visibleRect, mockedDomHelper, targetRect, 0);

        expect(mockedScrollContainer.scrollTop).toBe(80);
        expect(calculateZoomScaleSpy).toHaveBeenCalledTimes(1);
    });

    it('need to scroll up, no zoom', () => {
        const visibleRect = {
            top: 200,
            bottom: 300,
            left: 100,
            right: 200,
        };
        const targetRect = {
            top: 120,
            bottom: 180,
            left: 120,
            right: 180,
        };
        scrollRectIntoView(mockedScrollContainer, visibleRect, mockedDomHelper, targetRect, 0);
        expect(mockedScrollContainer.scrollTop).toBe(-80);
        expect(calculateZoomScaleSpy).toHaveBeenCalledTimes(1);
    });

    it('need to scroll down, with zoom', () => {
        const visibleRect = {
            top: 100,
            bottom: 200,
            left: 100,
            right: 200,
        };
        const targetRect = {
            top: 220,
            bottom: 280,
            left: 120,
            right: 180,
        };

        calculateZoomScaleSpy.and.returnValue(2);
        scrollRectIntoView(mockedScrollContainer, visibleRect, mockedDomHelper, targetRect, 0);

        expect(mockedScrollContainer.scrollTop).toBe(40);
        expect(calculateZoomScaleSpy).toHaveBeenCalledTimes(1);
    });

    it('need to scroll up, with zoom', () => {
        const visibleRect = {
            top: 200,
            bottom: 300,
            left: 100,
            right: 200,
        };
        const targetRect = {
            top: 120,
            bottom: 180,
            left: 120,
            right: 180,
        };
        calculateZoomScaleSpy.and.returnValue(2);
        scrollRectIntoView(mockedScrollContainer, visibleRect, mockedDomHelper, targetRect, 0);
        expect(mockedScrollContainer.scrollTop).toBe(-40);
        expect(calculateZoomScaleSpy).toHaveBeenCalledTimes(1);
    });

    it('need to scroll down, with margin, no zoom', () => {
        const visibleRect = {
            top: 100,
            bottom: 200,
            left: 100,
            right: 200,
        };
        const targetRect = {
            top: 220,
            bottom: 280,
            left: 120,
            right: 180,
        };
        scrollRectIntoView(mockedScrollContainer, visibleRect, mockedDomHelper, targetRect, 10);

        expect(mockedScrollContainer.scrollTop).toBe(90);
        expect(calculateZoomScaleSpy).toHaveBeenCalledTimes(1);
    });

    it('need to scroll up, with margin, no zoom', () => {
        const visibleRect = {
            top: 200,
            bottom: 300,
            left: 100,
            right: 200,
        };
        const targetRect = {
            top: 120,
            bottom: 180,
            left: 120,
            right: 180,
        };
        scrollRectIntoView(mockedScrollContainer, visibleRect, mockedDomHelper, targetRect, 40);
        expect(mockedScrollContainer.scrollTop).toBe(-100);
        expect(calculateZoomScaleSpy).toHaveBeenCalledTimes(1);
    });

    it('need to scroll down, with big margin, no zoom', () => {
        const visibleRect = {
            top: 100,
            bottom: 200,
            left: 100,
            right: 200,
        };
        const targetRect = {
            top: 220,
            bottom: 280,
            left: 120,
            right: 180,
        };
        scrollRectIntoView(mockedScrollContainer, visibleRect, mockedDomHelper, targetRect, 40);

        expect(mockedScrollContainer.scrollTop).toBe(100);
        expect(calculateZoomScaleSpy).toHaveBeenCalledTimes(1);
    });

    it('need to scroll up, with big margin, no zoom', () => {
        const visibleRect = {
            top: 200,
            bottom: 300,
            left: 100,
            right: 200,
        };
        const targetRect = {
            top: 120,
            bottom: 180,
            left: 120,
            right: 180,
        };
        scrollRectIntoView(mockedScrollContainer, visibleRect, mockedDomHelper, targetRect, 10);
        expect(mockedScrollContainer.scrollTop).toBe(-90);
        expect(calculateZoomScaleSpy).toHaveBeenCalledTimes(1);
    });

    it('need to scroll down with big height, no zoom', () => {
        const visibleRect = {
            top: 100,
            bottom: 200,
            left: 100,
            right: 200,
        };
        const targetRect = {
            top: 220,
            bottom: 380,
            left: 120,
            right: 180,
        };
        scrollRectIntoView(mockedScrollContainer, visibleRect, mockedDomHelper, targetRect, 0);

        expect(mockedScrollContainer.scrollTop).toBe(180);
        expect(calculateZoomScaleSpy).toHaveBeenCalledTimes(1);
    });

    it('need to scroll up big height, no zoom', () => {
        const visibleRect = {
            top: 200,
            bottom: 300,
            left: 100,
            right: 200,
        };
        const targetRect = {
            top: 120,
            bottom: 380,
            left: 120,
            right: 180,
        };
        scrollRectIntoView(mockedScrollContainer, visibleRect, mockedDomHelper, targetRect, 0);
        expect(mockedScrollContainer.scrollTop).toBe(80);
        expect(calculateZoomScaleSpy).toHaveBeenCalledTimes(1);
    });

    it('need to scroll down with big height, no zoom, prefer top', () => {
        const visibleRect = {
            top: 100,
            bottom: 200,
            left: 100,
            right: 200,
        };
        const targetRect = {
            top: 220,
            bottom: 380,
            left: 120,
            right: 180,
        };
        scrollRectIntoView(
            mockedScrollContainer,
            visibleRect,
            mockedDomHelper,
            targetRect,
            0,
            true
        );

        expect(mockedScrollContainer.scrollTop).toBe(120);
        expect(calculateZoomScaleSpy).toHaveBeenCalledTimes(1);
    });

    it('need to scroll up big height, no zoom, prefer top', () => {
        const visibleRect = {
            top: 200,
            bottom: 300,
            left: 100,
            right: 200,
        };
        const targetRect = {
            top: 120,
            bottom: 380,
            left: 120,
            right: 180,
        };
        scrollRectIntoView(
            mockedScrollContainer,
            visibleRect,
            mockedDomHelper,
            targetRect,
            0,
            true
        );
        expect(mockedScrollContainer.scrollTop).toBe(-80);
        expect(calculateZoomScaleSpy).toHaveBeenCalledTimes(1);
    });

    it('need to scroll down with big height, has margin, no zoom, prefer top', () => {
        const visibleRect = {
            top: 100,
            bottom: 200,
            left: 100,
            right: 200,
        };
        const targetRect = {
            top: 220,
            bottom: 380,
            left: 120,
            right: 180,
        };
        scrollRectIntoView(
            mockedScrollContainer,
            visibleRect,
            mockedDomHelper,
            targetRect,
            30,
            true
        );

        expect(mockedScrollContainer.scrollTop).toBe(120);
        expect(calculateZoomScaleSpy).toHaveBeenCalledTimes(1);
    });

    it('need to scroll up with big height, has margin, no zoom, prefer top', () => {
        const visibleRect = {
            top: 200,
            bottom: 300,
            left: 100,
            right: 200,
        };
        const targetRect = {
            top: 120,
            bottom: 380,
            left: 120,
            right: 180,
        };
        scrollRectIntoView(
            mockedScrollContainer,
            visibleRect,
            mockedDomHelper,
            targetRect,
            30,
            true
        );
        expect(mockedScrollContainer.scrollTop).toBe(-80);
        expect(calculateZoomScaleSpy).toHaveBeenCalledTimes(1);
    });
});
