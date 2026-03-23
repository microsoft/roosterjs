import { stripInvisibleUnicode } from '../../domUtils/stripInvisibleUnicode';
import type {
    ContentModelBlock,
    ContentModelBlockGroup,
    ContentModelDocument,
    ContentModelSegment,
} from 'roosterjs-content-model-types';

/**
 * Strip invisible Unicode characters from all text and link hrefs in a content model.
 * This sanitizes the model at initialization time to prevent hidden content in links
 * or text (e.g. zero-width chars, bidirectional marks, Unicode Tags).
 * For General segments, all Text nodes under the element are also sanitized.
 * @param model The content model document to sanitize in-place
 */
export function sanitizeInvisibleUnicode(model: ContentModelDocument): void {
    sanitizeBlockGroup(model);
}

function sanitizeBlockGroup(group: ContentModelBlockGroup): void {
    for (const block of group.blocks) {
        sanitizeBlock(block);
    }
}

function sanitizeBlock(block: ContentModelBlock): void {
    switch (block.blockType) {
        case 'Paragraph':
            for (const segment of block.segments) {
                sanitizeSegment(segment);
            }
            break;

        case 'Table':
            for (const row of block.rows) {
                for (const cell of row.cells) {
                    sanitizeBlockGroup(cell);
                }
            }
            break;

        case 'BlockGroup':
            sanitizeBlockGroup(block);

            if (block.blockGroupType === 'General' && block.element) {
                sanitizeTextNodes(block.element);
            }
            break;

        case 'Entity':
        case 'Divider':
            break;
    }
}

function sanitizeSegment(segment: ContentModelSegment): void {
    if (segment.link?.format.href) {
        segment.link.format.href = stripInvisibleUnicode(segment.link.format.href);
    }

    switch (segment.segmentType) {
        case 'Text':
            segment.text = stripInvisibleUnicode(segment.text);
            break;

        case 'General':
            sanitizeTextNodes(segment.element);
            sanitizeBlockGroup(segment);
            break;

        case 'Image':
        case 'Entity':
        case 'Br':
        case 'SelectionMarker':
            break;
    }
}

function sanitizeTextNodes(element: HTMLElement): void {
    const walker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_TEXT);

    let node: Text | null;

    while ((node = walker.nextNode() as Text | null)) {
        if (node.nodeValue) {
            node.nodeValue = stripInvisibleUnicode(node.nodeValue);
        }
    }
}
