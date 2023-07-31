import { CreateEditorContext } from '../coreEditor/ContentModelEditor2Core';
import { EditorContext } from 'roosterjs-content-model-types';

/**
 * @internal
 * Create a EditorContext object used by ContentModel API
 */
export const createEditorContext: CreateEditorContext = core => {
    const { defaultFormat, darkColorHandler, contentDiv } = core;

    const context: EditorContext = {
        isDarkMode: darkColorHandler.isDarkColor,
        defaultFormat: defaultFormat,
        darkColorHandler: darkColorHandler,
        addDelimiterForEntity: true,
    };

    checkRootRtl(contentDiv, context);
    checkZoomScale(contentDiv, context);

    return context;
};

function checkZoomScale(element: HTMLElement, context: EditorContext) {
    const originalWidth = element?.getBoundingClientRect()?.width || 0;
    const visualWidth = element.offsetWidth;

    if (visualWidth > 0 && originalWidth > 0) {
        context.zoomScale = Math.round((originalWidth / visualWidth) * 100) / 100;
    }
}

function checkRootRtl(element: HTMLElement, context: EditorContext) {
    const style = element?.ownerDocument.defaultView?.getComputedStyle(element);

    if (style?.direction == 'rtl') {
        context.isRootRtl = true;
    }
}
