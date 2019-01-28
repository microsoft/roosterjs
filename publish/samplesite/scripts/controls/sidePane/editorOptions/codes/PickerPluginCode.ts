import CodeElement from './CodeElement';

export default class PickerPluginCode extends CodeElement {
    constructor() {
        super();
    }

    getImports() {
        return [
            {
                name: 'PickerPlugin',
                path: 'roosterjs-picker-plugin',
                isDefault: false,
            },
        ];
    }

    getCode() {
        return (
            'new PickerPlugin(new SampleColorPickerPluginDataProvider(), {\n' +
            "    elementIdPrefix: 'samplepicker-',\n" +
            "    changeSource: 'SAMPLE_COLOR_PICKER',\n" +
            "    triggerCharacter: ':',\n" +
            '    isHorizontal: true,\n' +
            '})'
        );
    }
}
