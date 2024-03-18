import type { ContentEditFeatureSettings } from 'roosterjs-editor-types';
import type { SidePaneElementProps } from '../SidePaneElement';
import type { ContentModelSegmentFormat } from 'roosterjs-content-model-types';

export interface LegacyPluginList {
    contentEdit: boolean;
    hyperlink: boolean;
    imageEdit: boolean;
    tableCellSelection: boolean;
    customReplace: boolean;
    announce: boolean;
}

export interface NewPluginList {
    autoFormat: boolean;
    edit: boolean;
    paste: boolean;
    shortcut: boolean;
    tableEdit: boolean;
    contextMenu: boolean;
    watermark: boolean;
    emoji: boolean;
    pasteOption: boolean;
    sampleEntity: boolean;
}

export interface BuildInPluginList extends LegacyPluginList, NewPluginList {}

export interface OptionState {
    pluginList: BuildInPluginList;

    // New plugin options
    allowExcelNoBorderTable: boolean;
    listMenu: boolean;
    tableMenu: boolean;
    imageMenu: boolean;
    watermarkText: string;

    // Legacy plugin options
    contentEditFeatures: ContentEditFeatureSettings;
    defaultFormat: ContentModelSegmentFormat;
    linkTitle: string;
    forcePreserveRatio: boolean;
    tableFeaturesContainerSelector: string;

    // Editor options
    isRtl: boolean;
    disableCache: boolean;
    applyChangesOnMouseUp: boolean;
}

export interface OptionPaneProps extends OptionState, SidePaneElementProps {}

export const UrlPlaceholder = '$url$';
