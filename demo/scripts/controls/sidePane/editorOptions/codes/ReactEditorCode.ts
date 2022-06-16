import BuildInPluginState from '../../../BuildInPluginState';
import CodeElement from './CodeElement';
import DarkModeCode from './DarkModeCode';
import DefaultFormatCode from './DefaultFormatCode';
import ExperimentalFeaturesCode from './ExperimentalFeaturesCode';
import PluginsCode from './PluginsCode';
import RibbonButtonCode from './RibbonButtonCode';
import RibbonCode from './RibbonCode';

const RibbonPluginVarName = 'ribbonPlugin';

export default class ReactEditorCode extends CodeElement {
    private plugins: PluginsCode;
    private defaultFormat: DefaultFormatCode;
    private ribbon: RibbonCode;
    private ribbonButton: RibbonButtonCode;
    private experimentalFeatures: ExperimentalFeaturesCode;
    private darkMode: DarkModeCode;
    private isRtl: boolean;

    constructor(state: BuildInPluginState) {
        super();

        this.ribbonButton = new RibbonButtonCode();
        this.ribbon = new RibbonCode(state, this.ribbonButton);
        this.plugins = new PluginsCode(state, this.ribbon ? [RibbonPluginVarName] : undefined);
        this.defaultFormat = new DefaultFormatCode(state.defaultFormat);
        this.experimentalFeatures = new ExperimentalFeaturesCode(state.experimentalFeatures);
        this.darkMode = new DarkModeCode();
        this.isRtl = state.isRtl;
    }

    getCode() {
        let defaultFormat = this.defaultFormat.getCode();
        let expermientalFeatures = this.experimentalFeatures.getCode();
        let darkMode = this.darkMode.getCode();
        let code = "let root = document.getElementById('root');\n";

        if (this.ribbonButton) {
            code += `let ${RibbonPluginVarName} = roosterjsReact.createRibbonPlugin();\n`;
        }

        code += `let plugins = ${this.plugins.getCode()};\n`;
        code += defaultFormat ? `let defaultFormat: DefaultFormat = ${defaultFormat};\n` : '';
        code += 'let options: roosterjs.EditorOptions = {\n';
        code += this.indent('plugins: plugins,\n');
        code += defaultFormat ? this.indent('defaultFormat: defaultFormat,\n') : '';
        code += expermientalFeatures
            ? this.indent(`experimentalFeatures: [\n${expermientalFeatures}],\n`)
            : '';
        code += darkMode ? this.indent(`getDarkColor: ${darkMode},\n`) : '';
        code += '};\n';

        code += `let editor = <roosterjsReact.Rooster className="editor" {...options} ${
            this.isRtl ? 'dir="rtl" ' : ''
        }/>;\n`;
        let componentCode: string;

        if (this.ribbon && this.ribbonButton) {
            code += this.ribbonButton.getCode();
            code += 'let ribbon = ' + this.ribbon.getCode();
            componentCode = '<>{ribbon}{editor}</>';
        } else {
            componentCode = 'editor';
        }

        code += 'ReactDOM.render(' + componentCode + ', root);\n';

        return code;
    }
}
