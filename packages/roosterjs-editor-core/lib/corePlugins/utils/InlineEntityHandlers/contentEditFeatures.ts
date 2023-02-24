import { cacheGetEventData, Position } from 'roosterjs-editor-dom';
import {
    DelimiterClasses,
    GenericContentEditFeature,
    IEditor,
    Keys,
    PluginEvent,
    PluginKeyboardEvent,
    PositionType,
} from 'roosterjs-editor-types';

/**
 * @internal
 * @param editor editor Instance
 */
export function getInlineEntityContentEditFeatures() {
    return [
        <GenericContentEditFeature<PluginEvent>>MoveBeforeDelimiterFeature,
        <GenericContentEditFeature<PluginEvent>>MoveAfterDelimiterFeature,
    ];
}

/**
 * Content edit feature to move the cursor from Delimiter After Entity to the delimiter Before
 */
const MoveBeforeDelimiterFeature: GenericContentEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.LEFT],
    shouldHandleEvent: getIsDelimiterAfterOrInCursor,
    handleEvent(event: PluginKeyboardEvent, editor: IEditor) {
        const delimiter = cacheDelimiter(event);
        if (!delimiter) {
            return;
        }
        const delimiterBefore = delimiter.previousElementSibling?.previousElementSibling;

        if (delimiterBefore) {
            const selection = delimiterBefore.ownerDocument.getSelection();

            if (selection) {
                editor.runAsync(() => {
                    if (event.rawEvent.shiftKey) {
                        selection.extend(delimiterBefore, 0);
                        event.rawEvent.preventDefault();
                    } else {
                        selection.setPosition(delimiterBefore, 0);
                        event.rawEvent.preventDefault();
                    }
                });
            }
        }
    },
};

/**
 * Content edit feature to move the cursor from Delimiter Before Entity to the delimiter After
 */
const MoveAfterDelimiterFeature: GenericContentEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.RIGHT],
    shouldHandleEvent: getIsDelimiterBeforeOrInCursor,
    handleEvent(event: PluginKeyboardEvent, editor: IEditor) {
        const delimiter = cacheDelimiter(event);
        if (!delimiter) {
            return;
        }
        const delimiterAfter = delimiter.nextElementSibling?.nextElementSibling;

        if (delimiterAfter) {
            editor.runAsync(() => {
                if (event.rawEvent.shiftKey) {
                    const selection = delimiterAfter.ownerDocument.getSelection();
                    selection?.extend(delimiterAfter, 1);
                    event.rawEvent.preventDefault();
                } else {
                    editor.select(new Position(delimiterAfter, PositionType.After));
                    event.rawEvent.preventDefault();
                }
            });
        }
    },
};

function cacheDelimiter(event: PluginEvent, delimiter?: HTMLElement | null) {
    return cacheGetEventData(event, 'delimiter_cache_key', () => delimiter);
}

function getIsDelimiterAfterOrInCursor(event: PluginKeyboardEvent, editor: IEditor) {
    const position = editor.getFocusedPosition();
    if (!position) {
        return false;
    }

    if (position?.offset == 0 && position.node.previousSibling) {
        const entityAtCursor = editor.getElementAtCursor(
            '.' + DelimiterClasses.DELIMITER_AFTER,
            position.node.previousSibling
        );

        if (entityAtCursor) {
            return !!(entityAtCursor && cacheDelimiter(event, entityAtCursor));
        }
    }
    const entityAtCursor = editor.getElementAtCursor(
        '.' + DelimiterClasses.DELIMITER_AFTER,
        position.element
    );

    return !!(
        entityAtCursor &&
        cacheDelimiter(event, entityAtCursor) &&
        entityAtCursor.previousElementSibling?.previousElementSibling?.className ===
            DelimiterClasses.DELIMITER_BEFORE
    );
}

function getIsDelimiterBeforeOrInCursor(event: PluginKeyboardEvent, editor: IEditor) {
    const position = editor.getFocusedPosition();

    if (!position) {
        return false;
    }

    position.element.normalize();
    if (position.isAtEnd && position.node.nextSibling) {
        const elAtCursor = editor.getElementAtCursor(
            '.' + DelimiterClasses.DELIMITER_BEFORE,
            position.node.nextSibling
        );

        return !!(elAtCursor && cacheDelimiter(event, elAtCursor));
    }

    const entityAtCursor = editor.getElementAtCursor(
        '.' + DelimiterClasses.DELIMITER_BEFORE,
        position.element
    );

    return !!(
        entityAtCursor &&
        cacheDelimiter(event, entityAtCursor) &&
        entityAtCursor.nextElementSibling?.nextElementSibling?.className ===
            DelimiterClasses.DELIMITER_AFTER
    );
}
