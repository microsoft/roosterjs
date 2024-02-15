import type { BeforePasteEvent } from 'roosterjs-editor-types';
import type {
    DomToModelOptionForSanitizing,
    MergePastedContentFunc,
} from 'roosterjs-content-model-types';

/**
 * A temporary event type to be compatible with both legacy plugin and EditorAdapter
 */
export interface BeforePasteAdapterEvent extends BeforePasteEvent {
    /**
     * domToModel Options to use when creating the content model from the paste fragment
     */
    readonly domToModelOption: DomToModelOptionForSanitizing;

    /**
     * customizedMerge Customized merge function to use when merging the paste fragment into the editor
     */
    customizedMerge?: MergePastedContentFunc;
}
