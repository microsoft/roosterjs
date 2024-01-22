import type { BeforePasteEvent } from 'roosterjs-editor-types';
import type {
    DomToModelOptionForPaste,
    MergePastedContentFunc,
} from 'roosterjs-content-model-types';

/**
 * A temporary event type to be compatible with both legacy plugin and content model editor
 */
export interface ContentModelBeforePasteEvent extends BeforePasteEvent {
    /**
     * domToModel Options to use when creating the content model from the paste fragment
     */
    readonly domToModelOption: DomToModelOptionForPaste;

    /**
     * customizedMerge Customized merge function to use when merging the paste fragment into the editor
     */
    customizedMerge?: MergePastedContentFunc;
}
