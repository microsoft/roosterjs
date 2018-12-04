import createRange from '../selection/createRange';
import Position from '../selection/Position';
import queryElements from '../utils/queryElements';
import { NodePosition, PositionType } from 'roosterjs-editor-types';

const OFFSET_1_ATTRIBUTE = 'data-offset1';
const OFFSET_2_ATTRIBUTE = 'data-offset2';
const CURSOR_START = 'cursor-start';
const CURSOR_END = 'cursor-end';
const CURSOR_SINGLE = 'cursor-single';
const CURSOR_MARK_SELECTOR = `SPAN#${CURSOR_START},SPAN#${CURSOR_END},SPAN#${CURSOR_SINGLE}`;

/**
 * @deprecated
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
    range: Range,
    useInlineMarker: boolean
): boolean {
    if (!range || queryElements(container, CURSOR_MARK_SELECTOR).length > 0) {
        return false;
    }
    let start = Position.getStart(range).normalize();
    let end = Position.getEnd(range).normalize();
    if (start.equalTo(end) || (!useInlineMarker && start.node == end.node)) {
        insertMarker(CURSOR_SINGLE, useInlineMarker, start, end);
    } else {
        insertMarker(CURSOR_END, useInlineMarker, end);
        insertMarker(CURSOR_START, useInlineMarker, start);
    }
    return true;
}

/**
 * @deprecated
 * If there is selection marker in content, convert into back to a selection range and remove the markers,
 * otherwise no op.
 * @param container Container HTML element to query selection markers from
 * @param retrieveSelectionRange Whether retrieve selection range from the markers if any
 * @returns The selection range converted from makers, or null if no valid marker found.
 */
export function removeMarker(container: HTMLElement, retrieveSelectionRange: boolean): Range {
    let start: NodePosition;
    let end: NodePosition;
    let range: Range;

    let markers = queryElements(
        container,
        CURSOR_MARK_SELECTOR,
        retrieveSelectionRange
            ? marker => {
                  switch (marker.id) {
                      case CURSOR_START:
                          start = safeCreatePosition(marker, OFFSET_1_ATTRIBUTE);
                          break;
                      case CURSOR_END:
                          end = safeCreatePosition(marker, OFFSET_1_ATTRIBUTE);
                          break;
                      case CURSOR_SINGLE:
                          start = safeCreatePosition(marker, OFFSET_1_ATTRIBUTE);
                          end = safeCreatePosition(marker, OFFSET_2_ATTRIBUTE);
                          break;
                  }
              }
            : null
    );

    if (start && end && markers.length <= 2) {
        range = createRange(start, end);
    }

    markers.forEach(marker => marker.parentNode && marker.parentNode.removeChild(marker));

    return range;
}

function safeCreatePosition(marker: HTMLElement, attrName: string) {
    let node = marker.nextSibling;
    let offset = parseInt(marker.getAttribute(attrName)) || 0;

    return node ? new Position(node, offset) : new Position(marker, PositionType.After);
}

function insertMarker(
    type: string,
    useInlineMarker: boolean,
    pos1: NodePosition,
    pos2?: NodePosition
) {
    let node = pos1.node;
    let marker = node.ownerDocument.createElement('SPAN');
    let offset = getRestorableOffset(pos1);
    marker.id = type;
    marker.setAttribute(OFFSET_1_ATTRIBUTE, useInlineMarker ? '0' : '' + offset);
    marker.setAttribute(
        OFFSET_2_ATTRIBUTE,
        useInlineMarker || !pos2 ? '0' : '' + getRestorableOffset(pos2)
    );

    if (!useInlineMarker || offset == 0) {
        node.parentNode.insertBefore(marker, node);
    } else if (pos1.isAtEnd) {
        node.parentNode.insertBefore(marker, node.nextSibling);
    } else {
        let range = node.ownerDocument.createRange();
        range.setStart(node, offset);
        range.collapse(true /* toStart */);
        range.insertNode(marker);
    }
}

function getRestorableOffset(position: NodePosition): number {
    return position.offset == 0 && position.isAtEnd ? 1 : position.offset;
}
