import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelEntity } from '../../publicTypes/entity/ContentModelEntity';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { EntityOperation, PluginEventType } from 'roosterjs-editor-types';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { InsertPosition } from '../../modelApi/selection/deleteSelections';
import { iterateSelections } from '../../modelApi/selection/iterateSelections';
import { normalizeContentModel } from '../../modelApi/common/normalizeContentModel';

interface BlockAndPath {
    path: ContentModelBlockGroup[];
    index: number;
}

/**
 *
 * @param editor
 */
export default function deleteOrBackspaceKey(
    editor: IContentModelEditor,
    key: 'delete' | 'backspace',
    rawEvent?: KeyboardEvent
) {
    formatWithContentModel(editor, 'deleteKey', model => {
        const insertPoint = getInsertPoint(model);
        let isDeleted = false;

        if (insertPoint) {
            const { paragraph, marker, path } = insertPoint;

            if (paragraph.segments[paragraph.segments.length - 1]?.segmentType == 'Br') {
                // If the last segment is BR, remove it for now. If need, we will add it back later when normalize model
                // So that if this is an empty paragraph, it will start to delete next block
                const noMarkerSegments = paragraph.segments.filter(
                    x => x.segmentType != 'SelectionMarker'
                );

                if (noMarkerSegments[noMarkerSegments.length - 2]?.segmentType != 'Br') {
                    paragraph.segments.pop();
                }
            }

            const index = paragraph.segments.indexOf(marker);
            const nextIndex = index + (key == 'delete' ? 1 : -1);

            if (nextIndex >= 0 && nextIndex < paragraph.segments.length) {
                isDeleted = deleteFromSegment(editor, insertPoint, nextIndex, key, rawEvent);
            } else {
                const siblingBlock = getLeafSiblingBlock(path, paragraph, key == 'delete');

                if (siblingBlock) {
                    isDeleted = deleteBlock(
                        editor,
                        path[0],
                        paragraph,
                        siblingBlock,
                        key == 'delete',
                        rawEvent
                    );
                }
            }

            if (isDeleted) {
                if (rawEvent) {
                    rawEvent.preventDefault();
                }

                normalizeContentModel(model);
            }
        }

        return isDeleted;
    });
}

function deleteBlock(
    editor: IContentModelEditor,
    currentParent: ContentModelBlockGroup,
    paragraph: ContentModelParagraph,
    blockAndPath: BlockAndPath,
    isDelete: boolean,
    rawEvent?: KeyboardEvent
): boolean {
    const { path, index } = blockAndPath;
    const parent = path[0];
    const block = parent.blocks[index];

    switch (block?.blockType) {
        case 'Paragraph':
            if (isDelete) {
                paragraph.segments.push(...block.segments);
                parent.blocks.splice(index, 1);
            } else {
                block.cachedElement = undefined;

                if (block.segments[block.segments.length - 1]?.segmentType == 'Br') {
                    block.segments.pop();
                }

                block.segments.push(...paragraph.segments);
                const currentIndex = currentParent.blocks.indexOf(paragraph);

                if (currentIndex >= 0) {
                    currentParent.blocks.splice(currentIndex, 1);
                }
            }
            return true;

        case 'Table':
            parent.blocks.splice(index, 1);
            return true;

        case 'Entity':
            deleteEntity(editor, block, isDelete, rawEvent);

            if (!rawEvent || !rawEvent.defaultPrevented) {
                parent.blocks.splice(index, 1);
            }

            return true;

        case 'Divider':
        case 'BlockGroup':
            parent.blocks.splice(index, 1);
            return true;
    }

    return false;
}

function getLeafSiblingBlock(
    path: ContentModelBlockGroup[],
    block: ContentModelBlock,
    isNext: boolean
): BlockAndPath | null {
    const newPath = [...path];

    while (newPath.length > 0) {
        let group = newPath[0];
        const index = group.blocks.indexOf(block);

        if (index < 0) {
            break;
        }

        let nextIndex = index + (isNext ? 1 : -1);
        let nextBlock = group.blocks[nextIndex];

        if (nextBlock) {
            while (nextBlock.blockType == 'BlockGroup') {
                const childIndex = isNext ? 0 : nextBlock.blocks.length - 1;
                const child = nextBlock.blocks[childIndex];

                if (!child) {
                    return {
                        path: newPath,
                        index: nextIndex,
                    };
                } else if (child.blockType != 'BlockGroup') {
                    newPath.unshift(nextBlock);

                    return {
                        path: newPath,
                        index: childIndex,
                    };
                } else {
                    newPath.unshift(nextBlock);
                    nextIndex = childIndex;
                    nextBlock = child;
                }
            }

            return {
                path: newPath,
                index: nextIndex,
            };
        } else if (group.blockGroupType != 'Document' && group.blockGroupType != 'TableCell') {
            newPath.shift();
            block = group;
        } else {
            break;
        }
    }

    return null;
}

function deleteEntity(
    editor: IContentModelEditor,
    entity: ContentModelEntity,
    isFromStart: boolean,
    rawEvent?: KeyboardEvent
) {
    if (entity.id && entity.type) {
        editor.triggerPluginEvent(PluginEventType.EntityOperation, {
            entity: {
                id: entity.id,
                isReadonly: entity.isReadonly,
                type: entity.type,
                wrapper: entity.wrapper,
            },
            operation: isFromStart
                ? EntityOperation.RemoveFromStart
                : EntityOperation.RemoveFromEnd,
            rawEvent: rawEvent,
        });
    }
}

function deleteFromSegment(
    editor: IContentModelEditor,
    insertPoint: InsertPosition,
    index: number,
    key: 'delete' | 'backspace',
    rawEvent?: KeyboardEvent
): boolean {
    const { paragraph } = insertPoint;
    const segment = paragraph.segments[index];
    let isDeleted = false;

    switch (segment.segmentType) {
        case 'Br':
        case 'Image':
            paragraph.segments.splice(index, 1);
            isDeleted = true;
            break;

        case 'Entity':
            deleteEntity(editor, segment, key == 'delete', rawEvent);

            if (!rawEvent || !rawEvent.defaultPrevented) {
                paragraph.segments.splice(index, 1);
            }

            isDeleted = true;
            break;

        case 'Text':
            let text = segment.text;

            if (text.length > 0) {
                segment.text =
                    key == 'delete' ? text.substring(1) : text.substring(0, text.length - 1);
            } else {
                paragraph.segments.splice(index, 1);
            }

            isDeleted = true;
            break;
    }

    if (isDeleted && rawEvent) {
        rawEvent.preventDefault();
    }

    return isDeleted;
}

function getInsertPoint(model: ContentModelDocument): InsertPosition | null {
    let result: InsertPosition | undefined;

    iterateSelections(
        [model],
        (path, tableContext, block, segments) => {
            if (
                block?.blockType == 'Paragraph' &&
                segments?.length == 1 &&
                segments[0].segmentType == 'SelectionMarker'
            ) {
                result = {
                    marker: segments[0],
                    paragraph: block,
                    tableContext: tableContext,
                    path: path,
                };
            }

            return true;
        },
        {
            contentUnderSelectedTableCell: 'ignoreForTableOrCell',
        }
    );

    return result || null;
}
