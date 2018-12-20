import BuildInPluginState, { UrlPlaceholder } from '../../BuildInPluginState';
import OptionsPane from './OptionsPane';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { getDefaultContentEditFeatures } from 'roosterjs-editor-plugins';

const initialState: BuildInPluginState = {
    pluginList: {
        hyperlink: true,
        paste: true,
        contentEdit: true,
        watermark: false,
        imageResize: false,
        tableResize: false,
    },
    contentEditFeatures: getDefaultContentEditFeatures(),
    defaultFormat: {},
    linkTitle: 'Ctrl+Click to follow the link:' + UrlPlaceholder,
    watermarkText: 'Type content here ...',
};

export default class EditorOptionsPlugin extends SidePanePluginImpl<
    OptionsPane,
    BuildInPluginState
> {
    name: 'EditorOptions';

    constructor() {
        super(OptionsPane, 'Editor Options');
    }

    getBuildInPluginState(): BuildInPluginState {
        let result: BuildInPluginState;
        this.getComponent(component => (result = component.getState()));
        return result || initialState;
    }

    getComponentProps() {
        return initialState;
    }
}
