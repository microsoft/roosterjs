import { ContentModelSegmentFormat } from 'roosterjs-content-model-types';

/**
 * Plugin state for ContentModelFormatPlugin
 */
export interface ContentModelFormatPluginState {
    /**
     * Default format of this editor
     */
    defaultFormat: ContentModelSegmentFormat;
}
