import { ContentModelBlockGroup } from '../../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelEntity } from '../../../publicTypes/entity/ContentModelEntity';
import { ContentModelParagraph } from '../../../publicTypes/block/ContentModelParagraph';
import { ContentModelSelectionMarker } from '../../../publicTypes/segment/ContentModelSelectionMarker';
import { EntityOperation } from 'roosterjs-editor-types';
import { TableSelectionContext } from '../../selection/iterateSelections';
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
export type EditEntry = (
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
    onDeleteEntity?: EditEntry;
}

/**
 * @internal
 */
export type EditStep = (context: InsertableEditContext, options: Required<EditOptions>) => void;
