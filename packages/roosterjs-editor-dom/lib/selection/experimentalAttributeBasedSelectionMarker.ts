import Position from "./Position";
import createRange from "./createRange";
import queryElements from "../utils/queryElements";

const SELECTION_START_OFFSET_ATTRIBUTE = "data-offset1";
const SELECTION_END_OFFSET_ATTRIBUTE = "data-offset2";
const SELECTION_START_SELECTOR = `[${SELECTION_START_OFFSET_ATTRIBUTE}]`;
const SELECTION_END_SELECTOR = `[${SELECTION_END_OFFSET_ATTRIBUTE}]`;

type SerializablePosition = {
  anchorElement: Element;
  offsetCharacters: number;
};

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
  range: Range,
  useInlineMarker: boolean
): boolean {
  if (!range || queryElements(container, SELECTION_START_SELECTOR).length > 0) {
    return false;
  }
  let start = Position.getStart(range).normalize();
  let end = Position.getEnd(range).normalize();
  markPosition(
    positionToSerializablePosition(start),
    SELECTION_START_OFFSET_ATTRIBUTE
  );
  markPosition(
    positionToSerializablePosition(end),
    SELECTION_END_OFFSET_ATTRIBUTE
  );
  return true;
}

/**
 * If there is selection marker in content, convert into back to a selection range and remove the markers,
 * otherwise no op.
 * @param container Container HTML element to query selection markers from
 * @param retrieveSelectionRange Whether retrieve selection range from the markers if any
 * @returns The selection range converted from makers, or null if no valid marker found.
 */
export function removeMarker(
  container: HTMLElement,
  retrieveSelectionRange: boolean
): Range {
  const selectionStart = container.querySelector(SELECTION_START_SELECTOR);
  const selectionEnd = container.querySelector(SELECTION_END_SELECTOR);
  if (selectionStart == null || selectionEnd == null) {
    return null;
  }

  const toReturn = retrieveSelectionRange
    ? createRange(
        serializablePositionToPosition({
          anchorElement: selectionStart,
          offsetCharacters: Number.parseInt(
            selectionStart.getAttribute(SELECTION_START_OFFSET_ATTRIBUTE)
          )
        }),

        serializablePositionToPosition({
          anchorElement: selectionEnd,
          offsetCharacters: Number.parseInt(
            selectionEnd.getAttribute(SELECTION_END_OFFSET_ATTRIBUTE)
          )
        })
      )
    : null;

  selectionStart.removeAttribute(SELECTION_START_OFFSET_ATTRIBUTE);
  selectionEnd.removeAttribute(SELECTION_END_OFFSET_ATTRIBUTE);

  return toReturn;
}

function markPosition(sp: SerializablePosition, offsetAttribute: string) {
  sp.anchorElement.setAttribute(offsetAttribute, sp.offsetCharacters + "");
}

function positionToSerializablePosition(p: Position): SerializablePosition {
  const node = p.node;
  if (node instanceof Element) {
    let offsetCharacters = 0;
    for (let i = 0; i < p.offset; i++) {
      offsetCharacters += p.element.childNodes[i].textContent.length;
    }
    return {
      anchorElement: node,
      offsetCharacters
    };
  } else if (node instanceof Text || node instanceof Comment) {
    let parent = node.parentElement;
    let offsetCharacters = 0;
    for (let child : Node = parent.childNodes[0]; child != node; child = child.nextSibling) {
      offsetCharacters += child.textContent.length;
    }
    return {
      anchorElement: parent,
      offsetCharacters: offsetCharacters + p.offset
    };
  } else {
      throw new Error(`node of unknown type ${typeof node}`);
  }
}

function serializablePositionToPosition(sp: SerializablePosition): Position {
    // preorder walk
    const walker = sp.anchorElement.ownerDocument.createTreeWalker(
      sp.anchorElement,
      NodeFilter.SHOW_TEXT
    );

    if (sp.offsetCharacters === 0) {
      return new Position(sp.anchorElement, 0).normalize();
    }

    let cumulativeTextLength = 0;
    while (cumulativeTextLength < sp.offsetCharacters) {
        // step to next node is safe on first iteration, since the anchor element
        // is not a text node, and the initial element of a tree walker is always
        // the passed in root (regardless of if it matches the filter)
        walker.nextNode();
        const currentTextNode = walker.currentNode as Text;
        cumulativeTextLength += currentTextNode.textContent.length;

        if (cumulativeTextLength >= sp.offsetCharacters) {
          break;
        }
    }
    // distance stepped past the intended selection position
    const overstep = cumulativeTextLength - sp.offsetCharacters
    const offset = walker.currentNode.textContent.length - overstep
    return new Position(
        walker.currentNode,
        offset,
    ).normalize();
}
