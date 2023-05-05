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
    listEditMenu: boolean;
    imageEditMenu: boolean;
    tableEditMenu: boolean;
    contextMenu: boolean;
    autoFormat: boolean;
    contentModelPaste: boolean;
}

export default interface BuildInPluginState {
    pluginList: BuildInPluginList;
    contentEditFeatures: ContentEditFeatureSettings;
    defaultFormat: DefaultFormat;
    linkTitle: string;
    watermarkText: string;
    experimentalFeatures: ExperimentalFeatures[];
    forcePreserveRatio: boolean;
    isRtl: boolean;
}

export interface BuildInPluginProps extends BuildInPluginState, SidePaneElementProps {}
