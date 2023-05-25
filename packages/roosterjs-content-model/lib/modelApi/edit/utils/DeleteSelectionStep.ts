import { ContentModelDocument } from '../../../publicTypes/group/ContentModelDocument';
import { ContentModelEntity } from '../../../publicTypes/entity/ContentModelEntity';
import { ContentModelParagraph } from '../../../publicTypes/block/ContentModelParagraph';
import { EntityOperation } from 'roosterjs-editor-types';
import { InsertPoint } from '../../../publicTypes/selection/InsertPoint';
import { TableSelectionContext } from '../../../publicTypes/selection/TableSelectionContext';
import type { CompatibleEntityOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * @internal
 */
export interface DeleteSelectionContext {
    insertPoint?: InsertPoint;
    lastParagraph?: ContentModelParagraph;
    lastTableContext?: TableSelectionContext;
    isChanged: boolean;
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
    context: DeleteSelectionContext,
    onDeleteEntity: OnDeleteEntity,
    model: ContentModelDocument,
    direction?: 'forward' | 'backward' | 'selectionOnly'
) => void;
