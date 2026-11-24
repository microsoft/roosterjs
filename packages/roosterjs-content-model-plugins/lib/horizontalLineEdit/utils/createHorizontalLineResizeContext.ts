import { DEFAULT_BORDER_COLOR, WRAPPER_ATTRIBUTE, WRAPPER_GAP } from '../constants';
import { wrap } from 'roosterjs-content-model-dom';
import { updateHorizontalLinePreview } from './resizeHorizontalLine';
import type { HorizontalLineEditOptions } from '../HorizontalLineEditOptions';
import type { HorizontalLineResizeContext } from '../types/HorizontalLineResizeContext';

/**
 * @internal
 * Measure the line and create its isolated editing UI without changing its styles.
 */
export function createHorizontalLineResizeContext(
    line: HTMLHRElement,
    zoomScale: number,
    options: HorizontalLineEditOptions
): HorizontalLineResizeContext {
    const doc = line.ownerDocument;
    const style = doc.defaultView!.getComputedStyle(line);
    const rect = line.getBoundingClientRect();
    const dimensions = { width: rect.width / zoomScale, height: rect.height / zoomScale };
    const wrapper = doc.createElement('div');
    const preview = line.cloneNode(false) as HTMLHRElement;

    preview.removeAttribute('id');
    preview.style.display = 'table';
    preview.style.position = 'absolute';
    preview.style.left = '0';
    preview.style.top = '0';
    preview.style.margin = '0';
    preview.style.boxSizing = 'border-box';
    preview.style.width = '100%';
    preview.style.height = '100%';
    preview.style.minWidth = preview.style.minHeight = '0';
    preview.style.maxWidth = preview.style.maxHeight = 'none';
    wrapper.style.cssText = 'position:relative;box-sizing:border-box;user-select:none;';
    wrapper.contentEditable = 'false';
    wrapper.style.marginTop = style.marginTop;
    wrapper.style.marginBottom = style.marginBottom;
    wrapper.style.marginLeft = style.marginLeft;
    wrapper.style.marginRight = style.marginRight;
    wrapper.style.outline = '1px solid ' + (options.borderColor ?? DEFAULT_BORDER_COLOR);
    wrapper.style.outlineOffset = WRAPPER_GAP + 'px';
    wrapper.appendChild(preview);

    const horizontalBorderWidth =
        parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
    const context: HorizontalLineResizeContext = {
        line,
        wrapper,
        preview,
        dimensions,
        originalDimensions: { ...dimensions },
        widthAdjustment:
            horizontalBorderWidth + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
        horizontalBorderWidth,
        originalVerticalFormat: {
            borderTop: preview.style.borderTop,
            borderBottom: preview.style.borderBottom,
            borderLeft: preview.style.borderLeft,
            borderRight: preview.style.borderRight,
            backgroundColor: preview.style.backgroundColor,
            paddingTop: preview.style.paddingTop,
            paddingBottom: preview.style.paddingBottom,
        },
        useBorderBox: style.boxSizing == 'border-box',
        host: wrap(doc, line, 'span'),
        handles: new Map(),
        helpers: [],
    };
    context.host.setAttribute(WRAPPER_ATTRIBUTE, '');
    context.host.style.display = 'contents';
    context.host.attachShadow({ mode: 'open' }).appendChild(wrapper);
    updateHorizontalLinePreview(context);
    return context;
}
