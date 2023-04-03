import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelEntity } from '../../publicTypes/entity/ContentModelEntity';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSelectionMarker } from '../../publicTypes/segment/ContentModelSelectionMarker';
import { EntityOperation } from 'roosterjs-editor-types';
import { TableSelectionContext } from '../selection/iterateSelections';
import type { CompatibleEntityOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * @internal
 */
export interface InsertPoint {
    marker: ContentModelSelectionMarker;
    paragraph: ContentModelParagraph;
    path: ContentModelBlockGroup[];
    tableContext?: TableSelectionContext;
}

/**
 * @internal
 */
export interface DeleteSelectionResult {
    insertPoint: InsertPoint | null;
    isChanged: boolean;
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
export interface DeleteSelectionOptions {
    direction?: 'forward' | 'backward' | 'selectionOnly';
    onDeleteEntity?: OnDeleteEntity;
}

/**
 * @internal
 */
export type DeleteSelectionStep = (
    context: DeleteSelectionContext,
    options: Required<DeleteSelectionOptions>,
    model: ContentModelDocument
) => void;
