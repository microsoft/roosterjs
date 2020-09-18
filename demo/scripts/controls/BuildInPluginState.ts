import { ContentEditFeatureSettings, DefaultFormat } from 'roosterjs-editor-types';
import { SidePaneElementProps } from './sidePane/SidePaneElement';

export const UrlPlaceholder = '$url$';

export interface BuildInPluginList {
    contentEdit: boolean;
    hyperlink: boolean;
    paste: boolean;
    watermark: boolean;
    imageResize: boolean;
    imageCrop: boolean;
    tableResize: boolean;
    customReplace: boolean;
    pickerPlugin: boolean;
}

export default interface BuildInPluginState {
    pluginList: BuildInPluginList;
    contentEditFeatures: ContentEditFeatureSettings;
    defaultFormat: DefaultFormat;
    linkTitle: string;
    watermarkText: string;
    showRibbon: boolean;
    useExperimentFeatures: boolean;
}

export interface BuildInPluginProps extends BuildInPluginState, SidePaneElementProps {}
