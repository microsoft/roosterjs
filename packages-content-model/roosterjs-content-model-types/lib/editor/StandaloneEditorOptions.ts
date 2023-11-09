import type { DomToModelOption } from '../context/DomToModelOption';
import type { ModelToDomOption } from '../context/ModelToDomOption';

/**
 * Options for Content Model editor
 */
export interface StandaloneEditorOptions {
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
}
