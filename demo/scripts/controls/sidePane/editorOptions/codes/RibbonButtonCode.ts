import CodeElement from './CodeElement';

const ButtonVarName = 'buttons';

export default class RibbonButtonCode extends CodeElement {
    private supportDarkMode: boolean;

    getCode() {
        let code = `let ${ButtonVarName} = roosterjsReact.getButtons();\n`;

        if (this.supportDarkMode) {
            code += `${ButtonVarName}.push({\n`;
            code += this.indent('key: "buttonNameDarkMode",\n');
            code += this.indent('unlocalizedText: "Dark Mode",\n');
            code += this.indent('iconName: "ClearNight",\n');
            code += this.indent('isChecked: formatState => formatState.isDarkMode,\n');
            code += this.indent('onClick: editor => {\n');
            code += this.indent('    editor.setDarkModeState(!editor.isDarkMode());\n');
            code += this.indent('    editor.focus();\n');
            code += this.indent('},\n');
            code += '});\n';
        }

        return code;
    }

    getButtonVarName() {
        return ButtonVarName;
    }
}
