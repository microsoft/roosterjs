import type { InsertPoint } from '../selection/InsertPoint';

/**
 * Options to specify how to merge models
 */
export interface MergeModelOption {
    /**
     * When there is only a table to merge, whether merge this table into current table (if any), or just directly insert (nested table).
     * This is usually used when paste table inside a table
     * @default false
     */
    mergeTable?: boolean;

    /**
     * Use this insert position to merge instead of querying selection from target model
     * @default undefined
     */
    insertPosition?: InsertPoint;

    /**
     * Use this to decide whether to change the source model format when doing the merge.
     * 'mergeAll': segment format of the insert position will be merged into the content that is merged into current model.
     * If the source model already has some format, it will not be overwritten.
     * 'keepSourceEmphasisFormat': format of the insert position will be set into the content that is merged into current model.
     * If the source model already has emphasis format, such as, fontWeight, Italic or underline different than the default style, it will not be overwritten.
     * 'none' the source segment format will not be modified.
     * @default undefined
     */
    mergeFormat?: 'mergeAll' | 'keepSourceEmphasisFormat' | 'none';

    /**
     * Whether to add a paragraph after the merged content.
     */
    addParagraphAfterMergedContent?: boolean;
}
