import { ContentModelDocument, DomToModelOption } from 'roosterjs-content-model-types';
import { MergeModelOption } from '../../modelApi/common/mergeModel';
import { OnDeleteEntity } from '../../modelApi/edit/utils/DeleteSelectionStep';
import {
    BeforePasteEvent,
    BeforePasteEventData,
    CompatibleBeforePasteEvent,
} from 'roosterjs-editor-types';

/**
 * Data of ContentModelBeforePasteEvent
 */
export interface ContentModelBeforePasteEventData extends BeforePasteEventData {
    /**
     * domToModel Options to use when creating the content model from the paste fragment
     */
    domToModelOption: Partial<DomToModelOption>;
    /**
     * customizedMerge Customized merge function to use when merging the paste fragment into the editor
     */
    customizedMerge?: (
        target: ContentModelDocument,
        source: ContentModelDocument,
        onDeleteEntity: OnDeleteEntity,
        options?: MergeModelOption
    ) => boolean;
}

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export default interface ContentModelBeforePasteEvent
    extends ContentModelBeforePasteEventData,
        BeforePasteEvent {}

/**
 * Provides a chance for plugin to change the content before it is pasted into editor.
 */
export interface CompatibleContentModelBeforePasteEvent
    extends ContentModelBeforePasteEventData,
        CompatibleBeforePasteEvent {}
