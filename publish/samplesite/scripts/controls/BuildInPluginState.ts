import { ContentEditFeatures } from 'roosterjs-editor-plugins';
import { DefaultFormat } from 'roosterjs-editor-types';
import { SidePaneElementProps } from './sidePane/SidePaneElement';

export const UrlPlaceholder = '$url$';

export interface BuildInPluginList {
    hyperlink: boolean;
    paste: boolean;
    contentEdit: boolean;
    watermark: boolean;
    imageResize: boolean;
    tableResize: boolean;
    customReplace: boolean;
    pickerPlugin: boolean;
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
    showRibbon: boolean;
    useExperimentFeatures: boolean;
}

export interface BuildInPluginProps extends BuildInPluginState, SidePaneElementProps {}
