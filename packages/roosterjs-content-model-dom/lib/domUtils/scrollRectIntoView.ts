import type { DOMHelper, Rect } from 'roosterjs-content-model-types';

/**
 * Scroll a given rectangle into view within a scroll container
 * @param scrollContainer The container to scroll
 * @param visibleRect The currently visible rectangle within the scroll container
 * @param domHelper The DOM helper of the editor
 * @param targetRect The target rectangle to scroll into view
 * @param scrollMargin Optional margin to apply when scrolling
 * @param preferTop Optional flag to indicate whether to prefer aligning the top or bottom of the target rect when the target rect is higher than visible rect @default false
 */
export function scrollRectIntoView(
    scrollContainer: HTMLElement,
    visibleRect: Rect,
    domHelper: DOMHelper,
    targetRect: Rect,
    scrollMargin: number = 0,
    preferTop: boolean = false
) {
    let zoomScale: number | undefined;
    let margin = 0;

    if (scrollMargin != 0) {
        zoomScale = getZoomScale(domHelper, zoomScale);

        margin = Math.max(
            0,
            Math.min(
                scrollMargin * zoomScale,
                (visibleRect.bottom - visibleRect.top - targetRect.bottom + targetRect.top) / 2
            )
        );
    }

    const top = targetRect.top - margin;
    const bottom = targetRect.bottom + margin;
    const height = bottom - top;

    // Define scroll operations
    const scrollUp = () => {
        zoomScale = getZoomScale(domHelper, zoomScale);
        scrollContainer.scrollTop -= (visibleRect.top - top) / zoomScale;
    };

    const scrollDown = () => {
        zoomScale = getZoomScale(domHelper, zoomScale);
        scrollContainer.scrollTop += (bottom - visibleRect.bottom) / zoomScale;
    };

    // Determine which operations to perform and in what order
    const needsScrollUp = top < visibleRect.top;
    const needsScrollDown = bottom > visibleRect.bottom;

    if (height > visibleRect.bottom - visibleRect.top) {
        // If the target rect is larger than visible rect, only perform one scroll operation
        if (preferTop) {
            scrollUp();
        } else {
            scrollDown();
        }
    } else if (preferTop) {
        if (needsScrollUp) {
            scrollUp();
        } else if (needsScrollDown) {
            scrollDown();
        }
    } else {
        if (needsScrollDown) {
            scrollDown();
        } else if (needsScrollUp) {
            scrollUp();
        }
    }
}

// domHelper.calculateZoomScale() may be an expensive call, so we cache the value during a single operation
function getZoomScale(domHelper: DOMHelper, knownZoomScale: number | undefined): number {
    if (knownZoomScale === undefined) {
        return domHelper.calculateZoomScale();
    } else {
        return knownZoomScale;
    }
}
