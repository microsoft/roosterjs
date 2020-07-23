import { ContentEditFeatureSettings } from 'roosterjs-editor-plugins/lib/EditFeatures';
import { DefaultFormat } from 'roosterjs-editor-types';
import { SidePaneElementProps } from './sidePane/SidePaneElement';

export const UrlPlaceholder = '$url$';

export interface BuildInPluginList {
    hyperlink: boolean;
    paste: boolean;
    watermark: boolean;
    imageResize: boolean;
    tableResize: boolean;
    customReplace: boolean;
    pickerPlugin: boolean;
    entityPlugin: boolean;
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
