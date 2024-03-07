import { parseValueWithUnit } from 'roosterjs-content-model-dom';
import type { EditorContext } from 'roosterjs-content-model-types';

const DefaultRootFontSize = 16;

/**
 * @internal
 */
export function getRootComputedStyleForContext(
    document: Document
): Pick<EditorContext, 'rootFontSize'> {
    const rootComputedStyle = document.defaultView?.getComputedStyle(document.documentElement);
    return { rootFontSize: parseValueWithUnit(rootComputedStyle?.fontSize) || DefaultRootFontSize };
}
