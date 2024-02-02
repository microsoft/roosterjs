import { isCharacterValue } from '../../publicApi/domUtils/eventUtils';
import { iterateSelections } from '../../publicApi/selection/iterateSelections';
import type {
    ContentModelBlockGroup,
    ContentModelParagraph,
    IStandaloneEditor,
    KeyDownEvent,
    RangeSelection,
} from 'roosterjs-content-model-types';
import {
    addDelimiters,
    createBr,
    createParagraph,
    isEntityDelimiter,
    isEntityElement,
    isNodeOfType,
} from 'roosterjs-content-model-dom';

const DELIMITER_BEFORE = 'entityDelimiterBefore';
const DELIMITER_AFTER = 'entityDelimiterAfter';
const DELIMITER_SELECTOR = '.' + DELIMITER_AFTER + ',.' + DELIMITER_BEFORE;
const ZERO_WIDTH_SPACE = '\u200B';
const ENTITY_INFO_NAME = '_Entity';
const INLINE_ENTITY_SELECTOR = 'span.' + ENTITY_INFO_NAME;

/**
 * @internal exported only for unit test
 */
export function preventTypeInDelimiter(
    node: HTMLElement,
    editor: IStandaloneEditor,
    handleAsEnterKey: boolean
) {
    const isNodeEntity = isEntityElement(node);
    const isAfter = isNodeEntity ? undefined : node.classList.contains(DELIMITER_AFTER);
    const entitySibling = isNodeEntity
        ? node
        : isAfter
        ? node.previousElementSibling
        : node.nextElementSibling;
    if (entitySibling && isEntityElement(entitySibling)) {
        removeInvalidDelimiters(
            [entitySibling.previousElementSibling, entitySibling.nextElementSibling].filter(
                element => !!element
            ) as HTMLElement[]
        );
        editor.formatContentModel(model => {
            let blockWithSelection: ContentModelParagraph | undefined;
            let parent: ContentModelBlockGroup | undefined;
            iterateSelections(model, (path, _, block, _segments) => {
                if (block?.blockType == 'Paragraph') {
                    if (block.isImplicit) {
                        delete block.isImplicit;
                    }

                    block.segments.forEach(segment => {
                        if (segment.segmentType == 'Text') {
                            segment.text = segment.text.replace(ZERO_WIDTH_SPACE, '');
                        }
                    });

                    if (handleAsEnterKey) {
                        blockWithSelection = block;
                        parent = path[path.length - 1];
                    }
                }
            });

            if (
                blockWithSelection &&
                !blockWithSelection.segments.some(w => w.segmentType == 'Entity') &&
                parent &&
                isAfter == false
            ) {
                const paragraph = createParagraph(
                    false,
                    blockWithSelection.format,
                    blockWithSelection.segmentFormat
                );
                const indexBlock = parent.blocks.indexOf(blockWithSelection);
                const selectionMarker = blockWithSelection.segments.find(
                    w => w.segmentType == 'SelectionMarker'
                );
                if (selectionMarker) {
                    const index = blockWithSelection.segments.indexOf(selectionMarker);
                    blockWithSelection.segments.splice(index, 1);
                    paragraph.segments.push(selectionMarker);
                }
                paragraph.segments.push(createBr());
                parent.blocks.splice(indexBlock + 1, 0, paragraph);
            }
            return true;
        });
    }
}

function addDelimitersIfNeeded(nodes: Element[] | NodeListOf<Element>) {
    nodes.forEach(node => {
        if (
            isNodeOfType(node, 'ELEMENT_NODE') &&
            isEntityElement(node) &&
            !node.isContentEditable
        ) {
            addDelimiters(node.ownerDocument, node as HTMLElement);
        }
    });
}

function removeNode(el: Node | undefined | null) {
    el?.parentElement?.removeChild(el);
}

function removeInvalidDelimiters(nodes: Element[] | NodeListOf<Element>) {
    nodes.forEach(node => {
        if (isEntityDelimiter(node)) {
            const sibling = node.classList.contains(DELIMITER_BEFORE)
                ? node.nextElementSibling
                : node.previousElementSibling;
            if (!(isNodeOfType(sibling, 'ELEMENT_NODE') && isEntityElement(sibling))) {
                removeNode(node);
            }
        } else {
            removeDelimiterAttr(node);
        }
    });
}

function removeDelimiterAttr(node: Element | undefined | null, checkEntity: boolean = true) {
    if (!node) {
        return;
    }

    const isAfter = node.classList.contains(DELIMITER_AFTER);
    const entitySibling = isAfter ? node.previousElementSibling : node.nextElementSibling;
    if (checkEntity && entitySibling && isEntityElement(entitySibling)) {
        return;
    }

    node.classList.remove(DELIMITER_AFTER, DELIMITER_BEFORE);

    node.normalize();
    node.childNodes.forEach(cn => {
        const index = cn.textContent?.indexOf(ZERO_WIDTH_SPACE) ?? -1;
        if (index >= 0) {
            const range = new Range();
            range.setStart(cn, index);
            range.setEnd(cn, index + 1);
            range.deleteContents();
        }
    });
}

function getFocusedElement(selection: RangeSelection): HTMLElement | null {
    const { range, isReverted } = selection;
    let node: Node | null = isReverted ? range.startContainer : range.endContainer;
    const offset = isReverted ? range.startOffset : range.endOffset;
    if (!isNodeOfType(node, 'ELEMENT_NODE')) {
        if (node.textContent != ZERO_WIDTH_SPACE && (node.textContent || '').length == offset) {
            node = node.nextSibling ?? node.parentElement?.nextElementSibling ?? null;
        } else {
            node = node?.parentElement ?? null;
        }
    } else {
        node = node.childNodes.length == offset ? node : node.childNodes.item(offset);
    }
    if (node && !node.hasChildNodes()) {
        node = node.nextSibling;
    }
    return isNodeOfType(node, 'ELEMENT_NODE') ? node : null;
}

/**
 * @internal
 */
export function handleDelimiterContentChangedEvent(editor: IStandaloneEditor) {
    const helper = editor.getDOMHelper();
    removeInvalidDelimiters(helper.queryElements(DELIMITER_SELECTOR));
    addDelimitersIfNeeded(helper.queryElements(INLINE_ENTITY_SELECTOR));
}

/**
 * @internal
 */
export function handleDelimiterKeyDownEvent(editor: IStandaloneEditor, event: KeyDownEvent) {
    const selection = editor.getDOMSelection();
    const { rawEvent } = event;
    if (!selection || selection.type != 'range') {
        return;
    }
    const isEnter = rawEvent.key === 'Enter';
    if (
        selection.range.collapsed &&
        (isCharacterValue(rawEvent) ||
            isEnter ||
            rawEvent.key === 'ArrowRight' ||
            rawEvent.key === 'ArrowLeft')
    ) {
        const node = getFocusedElement(selection);
        if (node && (isEntityDelimiter(node) || isEntityElement(node))) {
            switch (rawEvent.key) {
                case 'ArrowRight':
                case 'ArrowLeft':
                    handleArrowEvent(editor, event, node);
                    break;
                case 'Enter':
                default:
                    if (
                        isEnter &&
                        (node.classList.contains(DELIMITER_AFTER) ||
                            node.classList.contains(DELIMITER_BEFORE))
                    ) {
                        removeDelimiterAttr(node);
                    }

                    editor
                        .getDocument()
                        .defaultView?.requestAnimationFrame(() =>
                            preventTypeInDelimiter(node, editor, isEnter)
                        );
                    break;
            }
        }
    }
}
function handleArrowEvent(editor: IStandaloneEditor, event: KeyDownEvent, element: HTMLElement) {
    const isRTL = editor.getDocument().defaultView?.getComputedStyle(element).direction === 'rtl';
    const shouldCheckBefore = isRTL == (event.rawEvent.key === 'ArrowLeft');

    if (
        shouldCheckBefore
            ? !element.classList.contains(DELIMITER_BEFORE)
            : !element.classList.contains(DELIMITER_AFTER)
    ) {
        return;
    }
    let isChanged = false;
    editor.formatContentModel(model => {
        iterateSelections(model, (_path, _tableContext, block) => {
            if (block?.blockType == 'Paragraph') {
                const selectionMarker = block.segments.find(
                    s => s.segmentType == 'SelectionMarker'
                );
                if (selectionMarker) {
                    const index = block.segments.indexOf(selectionMarker);
                    const indexToInsert = shouldCheckBefore ? index + 1 : index - 1;
                    if (indexToInsert > block.segments.length - 1 || indexToInsert < 0) {
                        return;
                    }
                    block.segments.splice(index, 1);
                    block.segments.splice(
                        shouldCheckBefore ? index + 1 : index - 1,
                        0,
                        selectionMarker
                    );
                    isChanged = true;
                }
            }
        });
        return isChanged;
    });
    if (isChanged) {
        event.rawEvent.preventDefault();
    }
}
