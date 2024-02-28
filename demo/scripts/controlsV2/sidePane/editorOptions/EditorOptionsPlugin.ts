import { getDefaultContentEditFeatureSettings } from './getDefaultContentEditFeatureSettings';
import { OptionPaneProps, OptionState, UrlPlaceholder } from './OptionState';
import { OptionsPane } from './OptionsPane';
import { SidePaneElementProps } from '../SidePaneElement';
import { SidePanePluginImpl } from '../SidePanePluginImpl';

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
