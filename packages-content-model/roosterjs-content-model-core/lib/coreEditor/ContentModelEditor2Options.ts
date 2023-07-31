import {
    ContentModelSegmentFormat,
    DomToModelOption,
    ModelToDomOption,
} from 'roosterjs-content-model-types';

/**
 * Options for Content Model editor
 */
export interface ContentModelEditor2Options {
    /**
     * Default options used for DOM to Content Model conversion
     */
    defaultDomToModelOptions?: DomToModelOption;

    /**
     * Default options used for Content Model to DOM conversion
     */
    defaultModelToDomOptions?: ModelToDomOption;

    /**
     * Default format
     */
    defaultFormat?: ContentModelSegmentFormat;
}
