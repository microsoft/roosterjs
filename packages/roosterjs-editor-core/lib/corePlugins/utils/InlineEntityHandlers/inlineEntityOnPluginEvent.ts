import {
    ChangeSource,
    DelimiterClasses,
    IEditor,
    PluginEventType,
    PositionType,
    SelectionRangeTypes,
} from 'roosterjs-editor-types';
import {
    addDelimiterAfter,
    addDelimiterBefore,
    getDelimiterFromElement,
    getEntityFromElement,
    getEntitySelector,
    isBlockElement,
    isCharacterValue,
    Position,
    safeInstanceOf,
} from 'roosterjs-editor-dom';
import type { Entity, PluginEvent } from 'roosterjs-editor-types';

const DELIMITER_SELECTOR =
    '.' + DelimiterClasses.DELIMITER_AFTER + ',.' + DelimiterClasses.DELIMITER_BEFORE;
const INLINE_ENTITY_SELECTOR = 'span' + getEntitySelector();

export function inlineEntityOnPluginEvent(event: PluginEvent, editor: IEditor) {
    switch (event.eventType) {
        case PluginEventType.ContentChanged:
            if (event.source === ChangeSource.SetContent) {
                normalizeDelimitersInEditor(editor);
            }
            break;
        case PluginEventType.EditorReady:
            normalizeDelimitersInEditor(editor);
            break;

        case PluginEventType.BeforePaste:
            addDelimitersIfNeeded(event.fragment.querySelectorAll(INLINE_ENTITY_SELECTOR));
            break;

        case PluginEventType.ExtractContentWithDom:
        case PluginEventType.BeforeCutCopy:
            event.clonedRoot.querySelectorAll(DELIMITER_SELECTOR).forEach(node => {
                node.parentElement?.removeChild(node);
            });
            break;

        case PluginEventType.KeyDown:
            const range = editor.getSelectionRangeEx();
            if (
                range.type == SelectionRangeTypes.Normal &&
                range.areAllCollapsed &&
                isCharacterValue(event.rawEvent)
            ) {
                const position = editor.getFocusedPosition();

                if (!position) {
                    return;
                }

                const delimiter = editor.getElementAtCursor(DELIMITER_SELECTOR, position.element);

                if (
                    !delimiter ||
                    (!delimiter.classList.contains(DelimiterClasses.DELIMITER_AFTER) &&
                        !delimiter.classList.contains(DelimiterClasses.DELIMITER_BEFORE))
                ) {
                    return;
                }

                delimiter.normalize();
                editor.runAsync(() => {
                    delimiter.childNodes.forEach(nodeToMove => {
                        delimiter.parentElement?.insertBefore(
                            nodeToMove,
                            delimiter.className == DelimiterClasses.DELIMITER_BEFORE
                                ? delimiter
                                : delimiter.nextSibling
                        );
                        const selection = nodeToMove.ownerDocument?.getSelection();

                        if (selection) {
                            selection.setPosition(
                                nodeToMove,
                                new Position(nodeToMove, PositionType.End).offset
                            );
                        }
                    });
                });
            }
    }
}

/**
 * @internal
 * @param editor Editor instance
 */
export function normalizeDelimitersInEditor(editor: IEditor) {
    removeInvalidDelimiters(editor.queryElements(DELIMITER_SELECTOR));
    addDelimitersIfNeeded(editor.queryElements(INLINE_ENTITY_SELECTOR));
}

function getDelimiters(entityWrapper: HTMLElement): (HTMLElement | undefined)[] {
    return [entityWrapper.nextElementSibling, entityWrapper.previousElementSibling].map(el =>
        el && safeInstanceOf(el, 'HTMLElement') && getDelimiterFromElement(el) ? el : undefined
    );
}

function addDelimitersIfNeeded(nodes: Element[] | NodeListOf<Element>) {
    nodes.forEach(node => {
        if (safeInstanceOf(node, 'HTMLElement') && isReadOnly(getEntityFromElement(node))) {
            const [delimiterAfter, delimiterBefore] = getDelimiters(node);

            if (!delimiterAfter) {
                addDelimiterAfter(node);
            }
            if (!delimiterBefore) {
                addDelimiterBefore(node);
            }
        }
    });
}

function removeNode(el: Node | undefined) {
    el?.parentElement?.removeChild(el);
}

function isReadOnly(entity: Entity | null) {
    return (
        entity?.isReadonly &&
        !isBlockElement(entity.wrapper) &&
        safeInstanceOf(entity.wrapper, 'HTMLElement')
    );
}

function removeInvalidDelimiters(nodes: Element[]) {
    nodes.forEach(node => {
        if (getDelimiterFromElement(node)) {
            const sibling = node.classList.contains(DelimiterClasses.DELIMITER_BEFORE)
                ? node.nextElementSibling
                : node.previousElementSibling;
            if (!(safeInstanceOf(sibling, 'HTMLElement') && getEntityFromElement(sibling))) {
                removeNode(node);
            }
        } else {
            node?.classList.remove(
                DelimiterClasses.DELIMITER_BEFORE,
                DelimiterClasses.DELIMITER_AFTER
            );
        }
    });
}
