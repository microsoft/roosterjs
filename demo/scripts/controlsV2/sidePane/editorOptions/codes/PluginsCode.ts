import { CodeElement } from './CodeElement';
import { ContentEditCode } from './ContentEditCode';
import { HyperLinkCode } from './HyperLinkCode';
import { OptionState } from '../OptionState';
import { WatermarkCode } from './WatermarkCode';
import {
    AutoFormatPluginCode,
    CustomReplaceCode,
    EditPluginCode,
    ImageEditCode,
    PastePluginCode,
    TableCellSelectionCode,
    TableEditPluginCode,
    // TODO:    ShortcutPluginCode,
} from './SimplePluginCode';

export class PluginsCodeBase extends CodeElement {
    private plugins: CodeElement[];
    constructor(plugins: CodeElement[]) {
        super();

        this.plugins = plugins.filter(plugin => !!plugin);
    }

    getPluginCount() {
        return this.plugins.length;
    }

    getCode() {
        let code = '[\n';
        code += this.indent(this.plugins.map(plugin => plugin.getCode() + ',\n').join(''));
        code += ']';
        return code;
    }
}

export class PluginsCode extends PluginsCodeBase {
    constructor() {
        super([
            new AutoFormatPluginCode(),
            new EditPluginCode(),
            new PastePluginCode(),
            new TableEditPluginCode(),
            // new ShortcutPluginCode(),
        ]);
    }
}

export class LegacyPluginCode extends PluginsCodeBase {
    constructor(state: OptionState) {
        let pluginList = state.pluginList;
        const plugins: CodeElement[] = [
            pluginList.contentEdit && new ContentEditCode(state.contentEditFeatures),
            pluginList.hyperlink && new HyperLinkCode(state.linkTitle),
            pluginList.watermark && new WatermarkCode(state.watermarkText),
            pluginList.imageEdit && new ImageEditCode(),
            pluginList.customReplace && new CustomReplaceCode(),
            pluginList.tableCellSelection && new TableCellSelectionCode(),
        ];

        super(plugins);
    }
}
