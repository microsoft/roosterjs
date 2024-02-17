import { OptionPaneProps, OptionState } from './OptionState';
import { OptionsPane } from './OptionsPane';
import { SidePaneElementProps } from '../SidePaneElement';
import { SidePanePluginImpl } from '../SidePanePluginImpl';

const initialState: OptionState = {
    // pluginList: {
    //     contentEdit: true,
    //     hyperlink: true,
    //     paste: false,
    //     watermark: false,
    //     imageEdit: true,
    //     cutPasteListChain: false,
    //     tableCellSelection: true,
    //     tableResize: true,
    //     customReplace: true,
    //     listEditMenu: true,
    //     imageEditMenu: true,
    //     tableEditMenu: true,
    //     contextMenu: true,
    //     autoFormat: true,
    //     announce: true,
    // },
    // contentEditFeatures: getDefaultContentEditFeatureSettings(),
    defaultFormat: {},
    // linkTitle: 'Ctrl+Click to follow the link:' + UrlPlaceholder,
    // watermarkText: 'Type content here ...',
    // forcePreserveRatio: false,
    // applyChangesOnMouseUp: false,
    // experimentalFeatures: [],
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
