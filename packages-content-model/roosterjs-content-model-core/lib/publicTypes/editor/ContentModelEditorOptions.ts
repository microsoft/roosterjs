import { ContentModelCoreApiMap } from '../coreApi/ContentModelCoreApiMap';
import type {
    ContentModelSegmentFormat,
    DomToModelOption,
    ModelToDomOption,
} from 'roosterjs-content-model-types';

/**
 * Options for Content Model editor
 */
export interface ContentModelEditorOptions {
    /**
     * Default options used for DOM to Content Model conversion
     */
    defaultDomToModelOptions?: DomToModelOption;

    /**
     * Default options used for Content Model to DOM conversion
     */
    defaultModelToDomOptions?: ModelToDomOption;

    /**
     * Reuse existing DOM structure if possible, and update the model when content or selection is changed
     */
    cacheModel?: boolean;

    /**
     * Default segment format for text
     */
    defaultSegmentFormat?: ContentModelSegmentFormat;

    /**
     * A function map to override default core API implementation
     * Default value is null
     */
    coreApiOverride?: Partial<ContentModelCoreApiMap>;
}
