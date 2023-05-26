import { ContentModelEntity } from '../../../publicTypes/entity/ContentModelEntity';
import { ContentModelParagraph } from '../../../publicTypes/block/ContentModelParagraph';
import { EntityOperation } from 'roosterjs-editor-types';
import { InsertPoint } from '../../../publicTypes/selection/InsertPoint';
import { TableSelectionContext } from '../../../publicTypes/selection/TableSelectionContext';
import type { CompatibleEntityOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * @internal
 */
export const enum DeleteResult {
    NotDeleted,
    SingleChar,
    Range,
    NothingToDelete,
}

/**
 * @internal
 */
export interface DeleteSelectionResult {
    insertPoint: InsertPoint | null;
    deleteResult: DeleteResult;
}

/**
 * @internal
 */
export interface DeleteSelectionContext extends DeleteSelectionResult {
    lastParagraph?: ContentModelParagraph;
    lastTableContext?: TableSelectionContext;
}

/**
 * @internal
 */
export interface ValidDeleteSelectionContext extends DeleteSelectionContext {
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
export type DeleteSelectionStep = (
    context: ValidDeleteSelectionContext,
    onDeleteEntity: OnDeleteEntity
) => void;
