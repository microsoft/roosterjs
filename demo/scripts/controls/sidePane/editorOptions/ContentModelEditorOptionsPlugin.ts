import BuildInPluginState, { BuildInPluginProps, UrlPlaceholder } from '../../BuildInPluginState';
import ContentModelOptionsPane from './ContentModelOptionsPane';
import getDefaultContentEditFeatureSettings from './getDefaultContentEditFeatureSettings';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { ExperimentalFeatures } from 'roosterjs-editor-types';
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
        contentModelPaste: false,
    },
    contentEditFeatures: getDefaultContentEditFeatureSettings(),
    defaultFormat: {},
    linkTitle: 'Ctrl+Click to follow the link:' + UrlPlaceholder,
    watermarkText: 'Type content here ...',
    forcePreserveRatio: false,
    experimentalFeatures: [
        ExperimentalFeatures.AutoFormatList,
        ExperimentalFeatures.ReusableContentModel,
        ExperimentalFeatures.EditWithContentModel,
        ExperimentalFeatures.InlineEntityReadOnlyDelimiters,
    ],
    isRtl: false,
};

export default class ContentModelEditorOptionsPlugin extends SidePanePluginImpl<
    ContentModelOptionsPane,
    BuildInPluginProps
> {
    constructor() {
        super(ContentModelOptionsPane, 'options', 'Editor Options');
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
