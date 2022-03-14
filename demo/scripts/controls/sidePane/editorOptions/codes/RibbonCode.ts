import BuildInPluginState from '../../../BuildInPluginState';
import CodeElement from './CodeElement';
import RibbonButtonCode from './RibbonButtonCode';

export default class RibbonCode extends CodeElement {
    private buttonsVarName: string;
    private isRtl: boolean;

    constructor(state: BuildInPluginState, ribbonButton: RibbonButtonCode) {
        super();
        this.buttonsVarName = ribbonButton.getButtonVarName();
        this.isRtl = state.isRtl;
    }

    getCode() {
        return `<roosterjsReact.Ribbon buttons={${this.buttonsVarName}} plugin={ribbonPlugin} ${
            this.isRtl ? 'dir="rtl" ' : ''
        }/>;\n`;
    }
}
