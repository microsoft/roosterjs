import { ContentEditFeatureSettings } from 'roosterjs-editor-types';
import { getAllFeatures } from 'roosterjs-editor-plugins';
import { getObjectKeys } from 'roosterjs-content-model-dom';
import { OptionPaneProps, OptionState, UrlPlaceholder } from './OptionState';
import { OptionsPane } from './OptionsPane';
import { SidePaneElementProps } from '../SidePaneElement';
import { SidePanePluginImpl } from '../SidePanePluginImpl';

const listFeatures = {
    autoBullet: false,
    indentWhenTab: false,
    outdentWhenShiftTab: false,
    outdentWhenBackspaceOnEmptyFirstLine: false,
    outdentWhenEnterOnEmptyLine: false,
    mergeInNewLineWhenBackspaceOnFirstChar: false,
    maintainListChain: false,
    maintainListChainWhenDelete: false,
    autoNumberingList: false,
    autoBulletList: false,
    mergeListOnBackspaceAfterList: false,
    outdentWhenAltShiftLeft: false,
    indentWhenAltShiftRight: false,
};

function getDefaultContentEditFeatureSettings(): ContentEditFeatureSettings {
    const allFeatures = getAllFeatures();

    return {
        ...getObjectKeys(allFeatures).reduce((settings, key) => {
            settings[key] = !allFeatures[key].defaultDisabled;
            return settings;
        }, <ContentEditFeatureSettings>{}),
        ...listFeatures,
    };
}

const initialState: OptionState = {
    pluginList: {
        contentEdit: false,
        hyperlink: false,
        watermark: false,
        imageEdit: false,
        tableCellSelection: false,
        tableResize: false,
        customReplace: false,
        announce: false,
    },
    contentEditFeatures: getDefaultContentEditFeatureSettings(),
    defaultFormat: {},
    linkTitle: 'Ctrl+Click to follow the link:' + UrlPlaceholder,
    watermarkText: 'Type content here ...',
    forcePreserveRatio: false,
    applyChangesOnMouseUp: false,
    isRtl: false,
    cacheModel: true,
    tableFeaturesContainerSelector: '#' + 'EditorContainer',
};

export class EditorOptionsPlugin extends SidePanePluginImpl<OptionsPane, OptionPaneProps> {
    constructor() {
        super(OptionsPane, 'options', 'Editor Options');
    }

    getBuildInPluginState(): OptionState {
        let result: OptionState;
        this.getComponent(component => (result = component.getState()));
        return result || initialState;
    }

    getComponentProps(base: SidePaneElementProps) {
        return {
            ...initialState,
            ...base,
        };
    }
}
