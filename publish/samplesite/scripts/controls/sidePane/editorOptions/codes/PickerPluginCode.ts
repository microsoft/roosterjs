import CodeElement from './CodeElement';

export default class PickerPluginCode extends CodeElement {
    constructor() {
        super();
    }

    getCode() {
        return (
            'new roosterjs.PickerPlugin({\n' +
            '    onInitalize: (insertNodeCallback, setIsSuggestingCallback) => {},\n' +
            '    onDispose: () => {},\n' +
            '    onIsSuggestingChanged: (isSuggesting) => {},\n' +
            '    queryStringUpdated: (queryString) => {},\n' +
            '    onRemove: (nodeRemoved, isBackwards) => null,\n' +
            '    }, {\n' +
            "    elementIdPrefix: 'samplepicker-',\n" +
            "    changeSource: 'SAMPLE_COLOR_PICKER',\n" +
            "    triggerCharacter: ':',\n" +
            '    isHorizontal: true,\n' +
            '})'
        );
    }
}
