import {
    AutoFormatOptions,
    CustomReplace,
    EditOptions,
    MarkdownOptions,
} from 'roosterjs-content-model-plugins';
import type { SidePaneElementProps } from '../SidePaneElement';
import type { ContentModelSegmentFormat, ExperimentalFeature } from 'roosterjs-content-model-types';

export interface BuildInPluginList {
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
    markdown: boolean;
    hyperlink: boolean;
    imageEditPlugin: boolean;
    customReplace: boolean;
    hiddenProperty: boolean;
}

export interface OptionState {
    pluginList: BuildInPluginList;

    // New plugin options
    allowExcelNoBorderTable: boolean;
    listMenu: boolean;
    tableMenu: boolean;
    imageMenu: boolean;
    watermarkText: string;
    autoFormatOptions: AutoFormatOptions;
    markdownOptions: MarkdownOptions;
    customReplacements: CustomReplace[];
    editPluginOptions: EditOptions;

    // Legacy plugin options
    defaultFormat: ContentModelSegmentFormat;
    linkTitle: string;
    forcePreserveRatio: boolean;
    tableFeaturesContainerSelector: string;

    // Editor options
    isRtl: boolean;
    disableCache: boolean;
    experimentalFeatures: Set<ExperimentalFeature>;
}

export interface OptionPaneProps extends OptionState, SidePaneElementProps {}

export const UrlPlaceholder = '$url$';
