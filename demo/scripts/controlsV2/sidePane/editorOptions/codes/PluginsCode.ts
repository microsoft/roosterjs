import { AutoFormatCode } from './AutoFormatCode';
import { CodeElement } from './CodeElement';
import { HyperLinkCode } from './HyperLinkCode';
import { MarkdownCode } from './MarkdownCode';
import { OptionState } from '../OptionState';
import { WatermarkCode } from './WatermarkCode';

import {
    EditPluginCode,
    ImageEditCode,
    PastePluginCode,
    TableEditPluginCode,
    ShortcutPluginCode,
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
    constructor(state: OptionState) {
        const pluginList = state.pluginList;

        super([
            pluginList.autoFormat && new AutoFormatCode(state.autoFormatOptions),
            pluginList.edit && new EditPluginCode(),
            pluginList.paste && new PastePluginCode(),
            pluginList.tableEdit && new TableEditPluginCode(),
            pluginList.shortcut && new ShortcutPluginCode(),
            pluginList.watermark && new WatermarkCode(state.watermarkText),
            pluginList.markdown && new MarkdownCode(state.markdownOptions),
            pluginList.hyperlink && new HyperLinkCode(state.linkTitle),
        ]);
    }
}

export class LegacyPluginCode extends PluginsCodeBase {
    constructor(state: OptionState) {
        const pluginList = state.pluginList;

        const plugins: CodeElement[] = [pluginList.imageEdit && new ImageEditCode()];

        super(plugins);
    }
}
