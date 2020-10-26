import BuildInPluginState from '../../../BuildInPluginState';
import CodeElement from './CodeElement';
import ContentEditCode from './ContentEditCode';
import HyperLinkCode from './HyperLinkCode';
import PickerPluginCode from './PickerPluginCode';
import WatermarkCode from './WatermarkCode';
import {
    CustomReplaceCode,
    CutPasteListChainCode,
    ImageResizeCode,
    PasteCode,
    TableResizeCode,
} from './SimplePluginCode';

export default class PluginsCode extends CodeElement {
    private plugins: CodeElement[];

    constructor(private state: BuildInPluginState) {
        super();

        let pluginList = state.pluginList;
        this.plugins = [
            pluginList.contentEdit && new ContentEditCode(state.contentEditFeatures),
            pluginList.hyperlink && new HyperLinkCode(state.linkTitle),
            pluginList.paste && new PasteCode(),
            pluginList.watermark && new WatermarkCode(this.state.watermarkText),
            pluginList.imageResize && new ImageResizeCode(),
            pluginList.cutPasteListChain && new CutPasteListChainCode(),
            pluginList.tableResize && new TableResizeCode(),
            pluginList.pickerPlugin && new PickerPluginCode(),
            pluginList.customReplace && new CustomReplaceCode(),
        ].filter(plugin => !!plugin);
    }

    getCode() {
        let code = '[\n';
        code += this.indent(this.plugins.map(plugin => plugin.getCode() + ',\n').join(''));
        code += ']';
        return code;
    }
}
