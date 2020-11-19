import BuildInPluginState from '../../../BuildInPluginState';
import ButtonsCode from './ButtonsCode';
import CodeElement from './CodeElement';
import DefaultFormatCode from './DefaultFormatCode';
import ExperimentalFeaturesCode from './ExperimentalFeaturesCode';
import PluginsCode from './PluginsCode';

export default class EditorCode extends CodeElement {
    private plugins: PluginsCode;
    private defaultFormat: DefaultFormatCode;
    private buttons: ButtonsCode;
    private experimentalFeatures: ExperimentalFeaturesCode;

    constructor(state: BuildInPluginState) {
        super();

        this.plugins = new PluginsCode(state);
        this.defaultFormat = new DefaultFormatCode(state.defaultFormat);
        this.buttons = state.showRibbon ? new ButtonsCode() : null;
        this.experimentalFeatures = new ExperimentalFeaturesCode(state.experimentalFeatures);
    }

    getCode() {
        let defaultFormat = this.defaultFormat.getCode();
        let expermientalFeatures = this.experimentalFeatures.getCode();
        let code = "let contentDiv = document.getElementById('contentDiv') as HTMLDivElement;\n";
        code += `let plugins = ${this.plugins.getCode()};\n`;
        code += defaultFormat ? `let defaultFormat: DefaultFormat = ${defaultFormat};\n` : '';
        code += 'let options: roosterjs.EditorOptions = {\n';
        code += this.indent('plugins: plugins,\n');
        code += defaultFormat ? this.indent('defaultFormat: defaultFormat,\n') : '';
        code += expermientalFeatures
            ? this.indent(`experimentalFeatures: [\n${expermientalFeatures}],\n`)
            : '';
        code += '};\n';
        code += 'let editor = new roosterjs.Editor(contentDiv, options);\n';
        code += this.buttons ? this.buttons.getCode() : '';

        return code;
    }
}
