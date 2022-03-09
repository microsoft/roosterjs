import BuildInPluginState from '../../../BuildInPluginState';
import CodeElement from './CodeElement';
import RibbonButtonCode from './RibbonButtonCode';

export default class RibbonCode extends CodeElement {
    private buttonsVarName: string;

    constructor(state: BuildInPluginState, ribbonButton: RibbonButtonCode) {
        super();
        this.buttonsVarName = ribbonButton.getButtonVarName();
    }

    getCode() {
        return `<roosterjsReact.Ribbon buttons={${this.buttonsVarName}} plugin={ribbonPlugin}/>;\n`;
    }
}
