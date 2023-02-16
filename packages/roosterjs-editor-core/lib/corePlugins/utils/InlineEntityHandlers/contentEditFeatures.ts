import { cacheGetEventData, getEntitySelector, Position } from 'roosterjs-editor-dom';
import { DELIMITER_AFTER, DELIMITER_BEFORE, DelimiterType } from './constants';
import { isDelimiter } from './isDelimiter';
import {
    Entity,
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
export function addInlineEntityContentEditFeatures(editor: IEditor | null | undefined) {
    editor?.addContentEditFeature(
        <GenericContentEditFeature<PluginEvent>>MoveBeforeDelimiterFeature
    );
    editor?.addContentEditFeature(
        <GenericContentEditFeature<PluginEvent>>MoveAfterDelimiterFeature
    );
}

//After to Before
const MoveBeforeDelimiterFeature: GenericContentEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.LEFT],
    shouldHandleEvent(event: PluginKeyboardEvent, editor: IEditor) {
        const position = editor.getFocusedPosition();
        if (!position) {
            return false;
        }

        const entityAtCursor = editor.getElementAtCursor(getEntitySelector(), position.element);
        let delimiter: [DelimiterType, Entity] | null = null;

        return !!(
            entityAtCursor &&
            (delimiter = isDelimiter(entityAtCursor)) &&
            delimiter[0] == DelimiterType.After &&
            cacheDelimiter(event, delimiter[1])
        );
    },
    handleEvent(event: PluginKeyboardEvent, editor: IEditor) {
        const entity = cacheDelimiter(event);
        if (!entity) {
            return;
        }
        const id = entity.id;
        const idBefore = id.substring(0, id.indexOf('_')) + DELIMITER_BEFORE;
        const elBefore = editor.queryElements(getEntitySelector(idBefore))[0];

        if (elBefore) {
            const selection = elBefore.ownerDocument.getSelection();

            if (selection) {
                editor.runAsync(() => {
                    if (event.rawEvent.shiftKey) {
                        selection.extend(elBefore, 0);
                        event.rawEvent.preventDefault();
                    } else {
                        selection.setPosition(elBefore, 0);
                        event.rawEvent.preventDefault();
                    }
                });
            }
        }
    },
};

// Before to after
const MoveAfterDelimiterFeature: GenericContentEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.RIGHT],
    shouldHandleEvent(event: PluginKeyboardEvent, editor: IEditor) {
        const position = editor.getFocusedPosition();
        let delimiter: [DelimiterType, Entity] | null = null;

        if (!position) {
            return false;
        }

        position.element.normalize();
        if (position.isAtEnd && position.node.nextSibling) {
            const elAtCursor = editor.getElementAtCursor(
                getEntitySelector(),
                position.node.nextSibling
            );

            return !!(
                elAtCursor &&
                (delimiter = isDelimiter(elAtCursor))?.[0] == DelimiterType.Before &&
                delimiter?.[1] &&
                !!cacheDelimiter(event, delimiter[1])
            );
        }

        const entityAtCursor = editor.getElementAtCursor(getEntitySelector(), position.element);

        return !!(
            entityAtCursor &&
            (delimiter = isDelimiter(entityAtCursor)) &&
            delimiter[0] == DelimiterType.Before &&
            cacheDelimiter(event, delimiter[1])
        );
    },
    handleEvent(event: PluginKeyboardEvent, editor: IEditor) {
        const entity = cacheDelimiter(event);

        if (!entity) {
            return;
        }

        const id = entity.id;

        const idAfter = id.substring(0, id.indexOf('_')) + DELIMITER_AFTER;
        const elAfter = editor.queryElements(getEntitySelector(idAfter))[0];

        if (elAfter) {
            editor.runAsync(() => {
                if (event.rawEvent.shiftKey) {
                    const selection = elAfter.ownerDocument.getSelection();
                    selection?.extend(elAfter, 1);
                    event.rawEvent.preventDefault();
                } else {
                    editor.select(new Position(elAfter, PositionType.After));
                    event.rawEvent.preventDefault();
                }
            });
        }
    },
};

function cacheDelimiter(event: PluginEvent, delimiter?: Entity) {
    return cacheGetEventData(event, 'delimiter_cache_key', () => delimiter);
}
