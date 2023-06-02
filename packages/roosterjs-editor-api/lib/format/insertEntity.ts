import commitListChains from '../utils/commitListChains';
import {
    addDelimiters,
    applyFormat,
    commitEntity,
    createElement,
    getEntityFromElement,
    getEntitySelector,
    Position,
    VListChain,
    wrap,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ContentPosition,
    Entity,
    ExperimentalFeatures,
    IEditor,
    KnownCreateElementDataIndex,
    NodePosition,
    PositionType,
} from 'roosterjs-editor-types';
import type { CompatibleContentPosition } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * Insert an entity into editor.
 * @param editor The editor to insert entity into.
 * @param type Type of the entity
 * @param contentNode Root element of the entity
 * @param isBlock Whether the entity will be shown as a block
 * @param isReadonly Whether the entity will be a readonly entity
 * @param position @optional The position to insert into. If not specified, current position will be used.
 * If isBlock is true, entity will be insert below this position
 * @param insertToRegionRoot @optional When pass true, insert the entity at the root level of current region.
 * Parent nodes will be split if need
 * @param focusAfterEntity @optional When pass true, focus will be moved next to the entity. For inline entity,
 * focus will be after right after the entity (and the delimiter if exist). For block entity, focus will be in
 * the new empty line below the entity
 */
export default function insertEntity(
    editor: IEditor,
    type: string,
    contentNode: Node,
    isBlock: boolean,
    isReadonly: boolean,
    position?:
        | NodePosition
        | ContentPosition.Begin
        | ContentPosition.End
        | ContentPosition.DomEnd
        | CompatibleContentPosition.Begin
        | CompatibleContentPosition.End
        | CompatibleContentPosition.DomEnd,
    insertToRegionRoot?: boolean,
    focusAfterEntity?: boolean
): Entity {
    const wrapper = wrap(contentNode, isBlock ? 'div' : 'span');

    // For inline & readonly entity, we need to set display to "inline-block" otherwise
    // there will be some weird behavior when move cursor around the entity node.
    // And we should only do this for readonly entity since "inline-block" has some side effect
    // in IE that there will be a resize border around the inline-block element. We made some
    // workaround for readonly entity for this issue but for editable entity, keep it as "inline"
    // will just work fine.
    if (!isBlock && isReadonly) {
        wrapper.style.display = 'inline-block';
    }

    commitEntity(wrapper, type, isReadonly);

    if (!editor.contains(wrapper)) {
        let currentRange: Range | null = null;
        let contentPosition:
            | ContentPosition.Begin
            | ContentPosition.End
            | ContentPosition.DomEnd
            | ContentPosition.SelectionStart
            | CompatibleContentPosition.Begin
            | CompatibleContentPosition.End
            | CompatibleContentPosition.DomEnd
            | CompatibleContentPosition.SelectionStart;

        if (typeof position == 'number') {
            contentPosition = position;
        } else if (position) {
            currentRange = editor.getSelectionRange();
            const node = position.normalize().node;
            const existingEntity = node && editor.getElementAtCursor(getEntitySelector(), node);

            // Do not insert entity into another entity
            if (existingEntity) {
                position = new Position(existingEntity, PositionType.After);
            }

            editor.select(position);
            contentPosition = ContentPosition.SelectionStart;
        } else {
            editor.focus();
            contentPosition = ContentPosition.SelectionStart;
        }

        const regions = insertToRegionRoot && editor.getSelectedRegions();
        const chains = regions && VListChain.createListChains(regions);

        editor.insertNode(wrapper, {
            updateCursor: false,
            insertOnNewLine: isBlock,
            replaceSelection: true,
            position: contentPosition,
            insertToRegionRoot: insertToRegionRoot,
        });

        if (chains) {
            commitListChains(editor, chains);
        }

        if (contentPosition == ContentPosition.SelectionStart) {
            if (currentRange) {
                editor.select(currentRange);
            } else if (!isBlock) {
                editor.select(wrapper, PositionType.After);
            }
        }
    }

    const entity = getEntityFromElement(wrapper)!;

    if (isBlock) {
        // Insert an extra empty line for block entity to make sure
        // user can still put cursor below the entity.
        const newLine = createElement(KnownCreateElementDataIndex.EmptyLine, editor.getDocument());

        wrapper.parentNode?.insertBefore(newLine!, wrapper.nextSibling);

        if (newLine) {
            applyFormat(
                newLine as HTMLElement,
                editor.getDefaultFormat(),
                editor.isDarkMode(),
                editor.getDarkColorHandler()
            );
        }

        if (focusAfterEntity) {
            const br = newLine?.querySelector('br');
            const pos = br && new Position(br, PositionType.Before);

            if (pos) {
                editor.select(pos);
            }
        }
    } else if (
        isReadonly &&
        editor.isFeatureEnabled(ExperimentalFeatures.InlineEntityReadOnlyDelimiters)
    ) {
        addDelimiters(entity.wrapper);
        if (entity.wrapper.nextElementSibling) {
            editor.select(new Position(entity.wrapper.nextElementSibling, PositionType.After));
        }
    }

    editor.triggerContentChangedEvent(ChangeSource.InsertEntity, entity);

    return entity;
}
