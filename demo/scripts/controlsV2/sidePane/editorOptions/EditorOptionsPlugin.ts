import { getDefaultContentEditFeatureSettings } from './getDefaultContentEditFeatureSettings';
import { OptionPaneProps, OptionState, UrlPlaceholder } from './OptionState';
import { OptionsPane } from './OptionsPane';
import { SidePaneElementProps } from '../SidePaneElement';
import { SidePanePluginImpl } from '../SidePanePluginImpl';

const initialState: OptionState = {
    pluginList: {
        autoFormat: true,
        edit: true,
        paste: true,
        shortcut: true,
        tableEdit: true,
        contextMenu: true,
        emoji: true,
        pasteOption: true,
        sampleEntity: true,

        // Legacy plugins
        contentEdit: false,
        hyperlink: false,
        watermark: false,
        imageEdit: false,
        tableCellSelection: true,
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
    disableCache: false,
    tableFeaturesContainerSelector: '#' + 'EditorContainer',
    allowExcelNoBorderTable: false,
    imageMenu: true,
    tableMenu: true,
    listMenu: true,
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
