import BuildInPluginState from '../../../BuildInPluginState';
import CodeElement from './CodeElement';
import HyperLinkCode from './HyperLinkCode';
import PickerPluginCode from './PickerPluginCode';
import WatermarkCode from './WatermarkCode';
import {
    CustomReplaceCode,
    EntityPluginCode,
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
            pluginList.watermark && new WatermarkCode(this.state.watermarkText),
            pluginList.imageResize && new ImageResizeCode(),
            pluginList.tableResize && new TableResizeCode(),
            pluginList.pickerPlugin && new PickerPluginCode(),
            pluginList.customReplace && new CustomReplaceCode(),
            pluginList.entityPlugin && new EntityPluginCode(),
        ].filter(plugin => !!plugin);
    }

    getCode() {
        let code = '[\n';
        code += this.indent(this.plugins.map(plugin => plugin.getCode() + ',\n').join(''));
        code += ']';
        return code;
    }
}
