import type { ContentModelParagraph } from '../block/ContentModelParagraph';
import type { DeleteResult } from '../enum/DeleteResult';
import type { FormatWithContentModelContext } from './FormatWithContentModelContext';
import type { InsertPoint } from '../selection/InsertPoint';
import type { TableSelectionContext } from '../selection/TableSelectionContext';

/**
 * Result of deleteSelection API
 */
export interface DeleteSelectionResult {
    /**
     * Insert point position after delete, or null if there is no insert point
     */
    insertPoint: InsertPoint | null;

    /**
     * Delete result
     */
    deleteResult: DeleteResult;
}

/**
 * A context object used by EditingStep
 */
export interface DeleteSelectionContext extends DeleteSelectionResult {
    /**
     * Last paragraph after previous step
     */
    lastParagraph?: ContentModelParagraph;

    /**
     * Last table context after previous step
     */
    lastTableContext?: TableSelectionContext;

    /**
     * Format context provided by formatContentModel API
     */
    formatContext?: FormatWithContentModelContext;
}

/**
 * DeleteSelectionContext with a valid insert point that can be handled by next step
 */
export interface ValidDeleteSelectionContext extends DeleteSelectionContext {
    /**
     * Insert point position after delete
     */
    insertPoint: InsertPoint;
}

/**
 * Represents an editing step function for deleteSelection API
 * @param context The valid delete selection context object returned from previous step
 */
export type EditingStepFunc = (context: ValidDeleteSelectionContext) => void;

/**
 * Represents an editing step for deleteSelection API.
 * It can be a simple callback function or a combination of callback and a checker function too see if we should run this step
 */
export type EditingStep =
    | EditingStepFunc
    | {
          shouldRun: (context: ValidDeleteSelectionContext) => boolean;
          callback: EditingStepFunc;
      };
