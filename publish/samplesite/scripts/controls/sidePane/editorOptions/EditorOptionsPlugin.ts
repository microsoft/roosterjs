import BuildInPluginState, { BuildInPluginProps, UrlPlaceholder } from '../../BuildInPluginState';
import OptionsPane from './OptionsPane';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { getDefaultContentEditFeatures } from 'roosterjs-editor-plugins';
import { SidePaneElementProps } from '../SidePaneElement';

const initialState: BuildInPluginState = {
    pluginList: {
        hyperlink: true,
        paste: true,
        contentEdit: true,
        watermark: false,
        imageResize: true,
        tableResize: true,
        customReplace: true,
        pickerPlugin: true,
    },
    contentEditFeatures: getDefaultContentEditFeatures(),
    defaultFormat: {},
    linkTitle: 'Ctrl+Click to follow the link:' + UrlPlaceholder,
    watermarkText: 'Type content here ...',
    showRibbon: true,
    useExperimentFeatures: true,
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
