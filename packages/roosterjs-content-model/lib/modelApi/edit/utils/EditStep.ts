import { ContentModelEntity } from '../../../publicTypes/entity/ContentModelEntity';
import { ContentModelParagraph } from '../../../publicTypes/block/ContentModelParagraph';
import { EntityOperation } from 'roosterjs-editor-types';
import { InsertPoint } from '../../../publicTypes/selection/InsertPoint';
import { TableSelectionContext } from '../../../publicTypes/selection/TableSelectionContext';
import type { CompatibleEntityOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * @internal
 */
export interface EditContext {
    insertPoint?: InsertPoint;
    lastParagraph?: ContentModelParagraph;
    lastTableContext?: TableSelectionContext;
    addUndoSnapshot?: boolean;
    isChanged: boolean;
}

/**
 * @internal
 */
export interface InsertableEditContext extends EditContext {
    insertPoint: InsertPoint;
}

/**
 * @internal
 */
export type OnDeleteEntity = (
    entity: ContentModelEntity,
    operation:
        | EntityOperation.RemoveFromStart
        | EntityOperation.RemoveFromEnd
        | EntityOperation.Overwrite
        | CompatibleEntityOperation.RemoveFromStart
        | CompatibleEntityOperation.RemoveFromEnd
        | CompatibleEntityOperation.Overwrite
) => boolean;

/**
 * @internal
 */
export interface EditOptions {
    onDeleteEntity?: OnDeleteEntity;
}

/**
 * @internal
 */
export type EditStep = (context: InsertableEditContext, options: Required<EditOptions>) => void;
