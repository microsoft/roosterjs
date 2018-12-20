import BuildInPluginState from '../../../BuildInPluginState';
import CodeElement from './CodeElement';
import ContentEditCode from './ContentEditCode';
import HyperLinkCode from './HyperLinkCode';
import WatermarkCode from './WatermarkCode';
import {
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
            pluginList.hyperlink && new HyperLinkCode(state.linkTitle),
            pluginList.paste && new PasteCode(),
            pluginList.contentEdit &&
                new ContentEditCode(this.state.contentEditFeatures),
            pluginList.watermark && new WatermarkCode(this.state.watermarkText),
            pluginList.imageResize && new ImageResizeCode(),
            pluginList.tableResize && new TableResizeCode(),
        ].filter(plugin => !!plugin);
    }

    getImports() {
        return this.plugins.reduce(
            (imports, plugin) => imports.concat(plugin.getImports()),
            [],
        );
    }

    getCode() {
        let code = '[\n';
        code += this.indent(
            this.plugins.map(plugin => plugin.getCode() + ',\n').join(''),
        );
        code += ']';
        return code;
    }
}
