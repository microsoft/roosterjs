import { addSegment, createText, isNodeOfType, parseFormat } from 'roosterjs-content-model-dom';
import type {
    ElementProcessor,
    ContentModelBlockGroup,
    DomToModelContext,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * This processor is used to process <button> elements in the DOM and convert them into Content Model.
 * It handles the button element by creating a text segment for each text node within the button.
 */
export const pasteButtonProcessor: ElementProcessor<HTMLButtonElement> = (
    group: ContentModelBlockGroup,
    element: HTMLButtonElement,
    context: DomToModelContext
): void => {
    const format: ContentModelSegmentFormat = {};
    parseFormat(element, context.formatParsers.segment, format, context);
    // Recursively process text nodes in the button
    processTextNodesRecursively(group, element, context, format);
};

/**
 * Helper function to recursively iterate through nodes and process text nodes
 */
function processTextNodesRecursively(
    group: ContentModelBlockGroup,
    node: Node,
    context: DomToModelContext,
    format: ContentModelSegmentFormat
): void {
    if (node.nodeType === Node.TEXT_NODE) {
        // Process text node directly
        const text = createText(node.nodeValue || '', format);
        addSegment(group, text);
    } else if (isNodeOfType(node, 'ELEMENT_NODE')) {
        const newFormat: ContentModelSegmentFormat = { ...format };
        parseFormat(node, context.formatParsers.segment, newFormat, context);
        // Recursively process all child nodes
        for (let i = 0; i < node.childNodes.length; i++) {
            processTextNodesRecursively(group, node.childNodes[i], context, newFormat);
        }
    }
}
