import type { ContentEditFeatureSettings } from 'roosterjs-editor-types';
import type { SidePaneElementProps } from '../SidePaneElement';
import type { ContentModelSegmentFormat } from 'roosterjs-content-model-types';

export interface BuildInPluginList {
    contentEdit: boolean;
    hyperlink: boolean;
    watermark: boolean;
    imageEdit: boolean;
    tableCellSelection: boolean;
    tableResize: boolean;
    customReplace: boolean;
    announce: boolean;
}

export interface OptionState {
    pluginList: BuildInPluginList;
    contentEditFeatures: ContentEditFeatureSettings;
    defaultFormat: ContentModelSegmentFormat;
    linkTitle: string;
    watermarkText: string;
    forcePreserveRatio: boolean;
    isRtl: boolean;
    cacheModel: boolean;
    tableFeaturesContainerSelector: string;
    applyChangesOnMouseUp: boolean;
}

export interface OptionPaneProps extends OptionState, SidePaneElementProps {}

export const UrlPlaceholder = '$url$';
