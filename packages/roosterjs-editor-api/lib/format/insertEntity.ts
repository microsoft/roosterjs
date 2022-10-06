import {
    commitEntity,
    createElement,
    getEntityFromElement,
    getEntitySelector,
    Position,
    splitParentNode,
    splitTextNode,
    wrap,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ContentPosition,
    Entity,
    IEditor,
    KnownCreateElementDataIndex,
    NodePosition,
    NodeType,
    PositionType,
} from 'roosterjs-editor-types';

/**
 * Insert an entity into editor.
 * @param editor The editor to insert entity into.
 * @param type Type of the entity
 * @param contentNode Root element of the entity
 * @param isBlock Whether the entity will be shown as a block
 * @param isReadonly Whether the entity will be a readonly entity
 * @param position (Optional) The position to insert into. If not specified, current position will be used.
 * If isBlock is true, entity will be insert below this position
 */
export default function insertEntity(
    editor: IEditor,
    type: string,
    contentNode: Node,
    isBlock: boolean,
    isReadonly: boolean,
    position?: NodePosition | ContentPosition.Begin | ContentPosition.End | ContentPosition.DomEnd,
    forceInsertAtRootOfRegion?: boolean
): Entity {
    const wrapper = wrap(contentNode, isBlock ? 'DIV' : 'SPAN');

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
        let currentRange: Range;
        let contentPosition:
            | ContentPosition.Begin
            | ContentPosition.End
            | ContentPosition.DomEnd
            | ContentPosition.SelectionStart;

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
            position = Position.getStart(editor.getSelectionRange());
        }

        if (
            forceInsertAtRootOfRegion &&
            contentPosition == ContentPosition.SelectionStart &&
            typeof position == 'object'
        ) {
            const region = editor.getSelectedRegions()[0];
            let node = position.node;

            if (node.nodeType == NodeType.Text && !position.isAtEnd) {
                node = splitTextNode(node as Text, position.offset, true /*returnFirstPart*/);
            }

            while (region && node && node.parentNode != region.rootNode) {
                splitParentNode(node, false /*splitBefore*/);
                node = node.parentNode;
            }

            if (node) {
                position = new Position(node, PositionType.After);
                editor.select(position);

                const newline = createElement(
                    KnownCreateElementDataIndex.EmptyLine,
                    editor.getDocument()
                );

                editor.insertNode(newline);

                editor.select(newline, PositionType.Begin);
            }
        }

        editor.insertNode(wrapper, {
            updateCursor: false,
            insertOnNewLine: isBlock,
            replaceSelection: true,
            position: contentPosition,
        });

        if (contentPosition == ContentPosition.SelectionStart) {
            if (currentRange) {
                editor.select(currentRange);
            } else if (!isBlock) {
                editor.select(wrapper, PositionType.After);
            }
        }
    }

    if (isBlock) {
        // Insert an extra empty line for block entity to make sure
        // user can still put cursor below the entity.
        const br = editor.getDocument().createElement('BR');
        wrapper.parentNode.insertBefore(br, wrapper.nextSibling);
    }

    const entity = getEntityFromElement(wrapper);
    editor.triggerContentChangedEvent(ChangeSource.InsertEntity, entity);

    return entity;
}
