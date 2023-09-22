import { ContentModelParagraph } from 'roosterjs-content-model-types';
import { FormatWithContentModelContext } from '../../../publicTypes/parameter/FormatWithContentModelContext';
import { InsertPoint } from '../../../publicTypes/selection/InsertPoint';
import { TableSelectionContext } from '../../../publicTypes/selection/TableSelectionContext';

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
    formatContext?: FormatWithContentModelContext;
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
export type DeleteSelectionStep = (context: ValidDeleteSelectionContext) => void;
