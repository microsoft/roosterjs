import { Position, SelectionRange, queryElements } from 'roosterjs-editor-dom';
import { PositionType } from 'roosterjs-editor-types';

const OFFSET_1_ATTRIBUTE = 'data-offset1';
const OFFSET_2_ATTRIBUTE = 'data-offset2';
const CURSOR_START = 'cursor-start';
const CURSOR_END = 'cursor-end';
const CURSOR_SINGLE = 'cursor-single';
const CURSOR_MARK_SELECTOR = `SPAN#${CURSOR_START},SPAN#${CURSOR_END},SPAN#${CURSOR_SINGLE}`;

/**
 * Insert selection marker element into content, so that after doing some modification,
 * we can still restore the selection as long as the selection marker is still there
 * @param container Container HTML element to query selection markers from
 * @param rawRange Current selection range
 * @param useInlineMarker Inline marker will be inserted at the position where current selection is,
 * so that even some content is changed, we can still still restore the selection. But this can cause
 * adjacent text nodes to be created. If we are sure the content won't be changed and we don't want to
 * create adjacent text nodes, set this parameter to false. This usually happens for undo/redo.
 * @returns True if selection markers are added, otherwise false.
 */
export function markSelection(
    container: HTMLElement,
    rawRange: Range,
    useInlineMarker: boolean
): boolean {
    if (!rawRange || queryElements(container, CURSOR_MARK_SELECTOR).length > 0) {
        return false;
    }
    let range = new SelectionRange(rawRange).normalize();
    if (range.collapsed || (!useInlineMarker && range.start.node == range.end.node)) {
        insertMarker(CURSOR_SINGLE, useInlineMarker, range.start, range.end);
    } else {
        insertMarker(CURSOR_START, useInlineMarker, range.start);
        insertMarker(CURSOR_END, useInlineMarker, range.end);
    }
    return true;
}

/**
 * If there is selection marker in content, convert into back to a selection range and remove the markers,
 * otherwise no op.
 * @param container Container HTML element to query selection markers from
 * @returns The selection range converted from makers, or null if no valid marker found.
 */
export function retrieveRangeFromMarker(container: HTMLElement): Range {
    let start: Position;
    let end: Position;
    let range: Range;

    let markers = queryElements(container, CURSOR_MARK_SELECTOR, marker => {
        switch (marker.id) {
            case CURSOR_START:
                start = saveCreatePosition(marker, OFFSET_1_ATTRIBUTE);
                break;
            case CURSOR_END:
                end = saveCreatePosition(marker, OFFSET_1_ATTRIBUTE);
                break;
            case CURSOR_SINGLE:
                start = saveCreatePosition(marker, OFFSET_1_ATTRIBUTE);
                end = saveCreatePosition(marker, OFFSET_2_ATTRIBUTE);
                break;
        }
    });

    if (start && end && markers.length <= 2) {
        range = new SelectionRange(start, end).getRange();
    }

    markers.forEach(marker => marker.parentNode && marker.parentNode.removeChild(marker));

    return range;
}

function saveCreatePosition(marker: HTMLElement, attrName: string) {
    let node = marker.nextSibling;
    let offset = parseInt(marker.getAttribute(attrName)) || 0;

    return node ? new Position(node, offset) : new Position(marker, PositionType.After);
}

function insertMarker(type: string, useInlineMarker: boolean, pos1: Position, pos2?: Position) {
    let node = pos1.node;
    let marker = node.ownerDocument.createElement('SPAN');
    marker.id = type;
    marker.setAttribute(OFFSET_1_ATTRIBUTE, useInlineMarker ? '0' : '' + pos1.offset);
    marker.setAttribute(OFFSET_2_ATTRIBUTE, useInlineMarker || !pos2 ? '0' : '' + pos2.offset);

    if (!useInlineMarker || pos1.offset == 0) {
        node.parentNode.insertBefore(marker, node);
    } else if (pos1.isAtEnd) {
        node.parentNode.insertBefore(marker, node.nextSibling);
    } else {
        let range = node.ownerDocument.createRange();
        range.setStart(node, pos1.offset);
        range.collapse(true /* toStart */);
        range.insertNode(marker);
    }
}
