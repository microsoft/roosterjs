import BuildInPluginState from '../../../BuildInPluginState';
import CodeElement from './CodeElement';
import ContentEditCode from './ContentEditCode';
import HyperLinkCode from './HyperLinkCode';
import TableCellSelectionCode from './TableCellSelectionCode';
import WatermarkCode from './WatermarkCode';
import {
    CustomReplaceCode,
    CutPasteListChainCode,
    ImageEditCode,
    PasteCode,
    TableResizeCode,
} from './SimplePluginCode';

export default class PluginsCode extends CodeElement {
    private plugins: CodeElement[];

    constructor(private state: BuildInPluginState, private additionalPlugins?: string[]) {
        super();

        let pluginList = state.pluginList;
        this.plugins = [
            pluginList.contentEdit && new ContentEditCode(state.contentEditFeatures),
            pluginList.hyperlink && new HyperLinkCode(state.linkTitle),
            pluginList.paste && new PasteCode(),
            pluginList.watermark && new WatermarkCode(this.state.watermarkText),
            pluginList.imageEdit && new ImageEditCode(),
            pluginList.cutPasteListChain && new CutPasteListChainCode(),
            pluginList.tableResize && new TableResizeCode(),
            pluginList.customReplace && new CustomReplaceCode(),
            pluginList.tableCellSelection && new TableCellSelectionCode(),
        ].filter(plugin => !!plugin);
    }

    getCode() {
        let code = '[\n';
        code += this.indent(this.plugins.map(plugin => plugin.getCode() + ',\n').join(''));

        if (this.additionalPlugins) {
            code += this.indent(this.additionalPlugins.map(p => p + ',\n').join(''));
        }
        code += ']';
        return code;
    }
}
