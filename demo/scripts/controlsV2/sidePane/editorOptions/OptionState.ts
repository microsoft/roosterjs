import type { SidePaneElementProps } from '../SidePaneElement';
import type { ContentModelSegmentFormat } from 'roosterjs-content-model-types';

export interface OptionState {
    // TODO: pluginList: BuildInPluginList;
    // contentEditFeatures: ContentEditFeatureSettings;
    defaultFormat: ContentModelSegmentFormat;
    // linkTitle: string;
    // watermarkText: string;
    // experimentalFeatures: ExperimentalFeatures[];
    // forcePreserveRatio: boolean;
    isRtl: boolean;
    cacheModel?: boolean;
    tableFeaturesContainerSelector: string;
    // applyChangesOnMouseUp?: boolean;
}

export interface OptionPaneProps extends OptionState, SidePaneElementProps {}
