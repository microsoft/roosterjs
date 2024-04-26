import { AutoFormatOptions, CustomReplace, MarkdownOptions } from 'roosterjs-content-model-plugins';
import type { SidePaneElementProps } from '../SidePaneElement';
import type { ContentModelSegmentFormat } from 'roosterjs-content-model-types';

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
    markdown: boolean;
    hyperlink: boolean;
    imageEditPlugin: boolean;
    customReplace: boolean;
}

export interface BuildInPluginList extends NewPluginList {}

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

    // Legacy plugin options
    defaultFormat: ContentModelSegmentFormat;
    linkTitle: string;
    forcePreserveRatio: boolean;
    tableFeaturesContainerSelector: string;

    // Editor options
    isRtl: boolean;
    disableCache: boolean;
}

export interface OptionPaneProps extends OptionState, SidePaneElementProps {}

export const UrlPlaceholder = '$url$';
