import { SidePaneElementProps } from './sidePane/SidePaneElement';
import {
    ContentEditFeatureSettings,
    DefaultFormat,
    ExperimentalFeatures,
} from 'roosterjs-editor-types';

export const UrlPlaceholder = '$url$';

export interface BuildInPluginList {
    contentEdit: boolean;
    hyperlink: boolean;
    paste: boolean;
    watermark: boolean;
    imageEdit: boolean;
    cutPasteListChain: boolean;
    tableCellSelection: boolean;
    tableResize: boolean;
    customReplace: boolean;
    pickerPlugin: boolean;
    resetListMenu: boolean;
    imageEditMenu: boolean;
    contextMenu: boolean;
    autoFormat: boolean;
}

export default interface BuildInPluginState {
    pluginList: BuildInPluginList;
    contentEditFeatures: ContentEditFeatureSettings;
    defaultFormat: DefaultFormat;
    linkTitle: string;
    watermarkText: string;
    showRibbon: boolean;
    supportDarkMode: boolean;
    experimentalFeatures: ExperimentalFeatures[];
    forcePreserveRatio: boolean;
    isRtl: boolean;
}

export interface BuildInPluginProps extends BuildInPluginState, SidePaneElementProps {}
