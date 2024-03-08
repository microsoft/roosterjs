import BuildInPluginState, { BuildInPluginProps, UrlPlaceholder } from '../../BuildInPluginState';
import getDefaultContentEditFeatureSettings from './getDefaultContentEditFeatureSettings';
import OptionsPane from './OptionsPane';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { SidePaneElementProps } from '../SidePaneElement';

const initialState: BuildInPluginState = {
    pluginList: {
        contentEdit: true,
        hyperlink: true,
        paste: true,
        watermark: false,
        imageEdit: true,
        cutPasteListChain: true,
        tableCellSelection: true,
        tableResize: true,
        customReplace: true,
        listEditMenu: true,
        imageEditMenu: true,
        tableEditMenu: true,
        contextMenu: true,
        autoFormat: true,
        announce: true,
    },
    contentEditFeatures: getDefaultContentEditFeatureSettings(),
    defaultFormat: {},
    linkTitle: 'Ctrl+Click to follow the link:' + UrlPlaceholder,
    watermarkText: 'Type content here ...',
    forcePreserveRatio: false,
    experimentalFeatures: [],
    isRtl: false,
    tableFeaturesContainerSelector: '#' + 'EditorContainer',
};

export default class EditorOptionsPlugin extends SidePanePluginImpl<
    OptionsPane,
    BuildInPluginProps
> {
    constructor() {
        super(OptionsPane, 'options', 'Editor Options');
    }

    getBuildInPluginState(): BuildInPluginState {
        let result: BuildInPluginState;
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
