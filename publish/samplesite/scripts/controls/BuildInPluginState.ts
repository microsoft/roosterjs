import { ContentEditFeatures } from 'roosterjs-editor-plugins';
import { DefaultFormat } from 'roosterjs-editor-types';

export const UrlPlaceholder = '$url$';

export interface BuildInPluginList {
    hyperlink: boolean;
    paste: boolean;
    contentEdit: boolean;
    watermark: boolean;
    imageResize: boolean;
    tableResize: boolean;
}

export type ContentEditFeatureState = Pick<
    ContentEditFeatures,
    Exclude<keyof ContentEditFeatures, 'smartOrderedListStyles'>
>;

export default interface BuildInPluginState {
    pluginList: BuildInPluginList;
    contentEditFeatures: ContentEditFeatureState;
    defaultFormat: DefaultFormat;
    linkTitle: string;
    watermarkText: string;
}
