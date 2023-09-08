import { applyFormat } from 'roosterjs-content-model-dom/lib/modelToDom/utils/applyFormat';
import { ContentModelSegmentFormat } from 'roosterjs-content-model-types';
import { createModelToDomContext } from '../../modelToDom/context/createModelToDomContext';

/**
 * Format an existing HTML element using Segment Format
 * @param element The element to format
 * @param format The format to apply
 */
export function applySegmentFormatToElement(
    element: HTMLElement,
    format: ContentModelSegmentFormat
) {
    const context = createModelToDomContext();
    applyFormat(element, context.formatAppliers.segment, format, context);
}
