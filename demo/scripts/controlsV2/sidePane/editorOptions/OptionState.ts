import type {
    AutoLinkFeatureSettings,
    CodeFeatureSettings,
    CursorFeatureSettings,
    EntityFeatureSettings,
    MarkdownFeatureSettings,
    ShortcutFeatureSettings,
    StructuredNodeFeatureSettings,
    TableFeatureSettings,
    TextFeatureSettings,
    ContentEditFeatureSettings as ContentEditFeatureSettingsOriginal,
} from 'roosterjs-editor-types';
import type { SidePaneElementProps } from '../SidePaneElement';
import type { ContentModelSegmentFormat } from 'roosterjs-content-model-types';

export interface LegacyPluginList {
    contentEdit: boolean;
    hyperlink: boolean;
    imageEdit: boolean;
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

export type ContentEditFeatureSettings = Omit<TableFeatureSettings, 'upDownInTable'> &
    StructuredNodeFeatureSettings &
    AutoLinkFeatureSettings &
    ShortcutFeatureSettings &
    CursorFeatureSettings &
    MarkdownFeatureSettings &
    EntityFeatureSettings &
    TextFeatureSettings &
    CodeFeatureSettings;

export interface OptionState {
    pluginList: BuildInPluginList;

    // New plugin options
    allowExcelNoBorderTable: boolean;
    listMenu: boolean;
    tableMenu: boolean;
    imageMenu: boolean;
    watermarkText: string;

    // Legacy plugin options
    contentEditFeatures: ContentEditFeatureSettingsOriginal;
    defaultFormat: ContentModelSegmentFormat;
    linkTitle: string;
    forcePreserveRatio: boolean;
    tableFeaturesContainerSelector: string;

    // Editor options
    isRtl: boolean;
    cacheModel: boolean;
    applyChangesOnMouseUp: boolean;
}

export interface OptionPaneProps extends OptionState, SidePaneElementProps {}

export const UrlPlaceholder = '$url$';
