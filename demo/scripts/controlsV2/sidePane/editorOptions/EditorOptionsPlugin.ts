import { emojiReplacements } from './getReplacements';
import { OptionPaneProps, OptionState, UrlPlaceholder } from './OptionState';
import { OptionsPane } from './OptionsPane';
import { SidePaneElementProps } from '../SidePaneElement';
import { SidePanePluginImpl } from '../SidePanePluginImpl';

const initialState: OptionState = {
    pluginList: {
        autoFormat: true,
        edit: true,
        paste: true,
        shortcut: true,
        tableEdit: true,
        contextMenu: true,
        watermark: true,
        emoji: true,
        pasteOption: true,
        sampleEntity: true,
        markdown: true,
        hyperlink: true,
        customReplace: true,
    },
    defaultFormat: {
        fontFamily: 'Calibri',
        fontSize: '11pt',
        textColor: '#000000',
    },
    linkTitle: 'Ctrl+Click to follow the link:' + UrlPlaceholder,
    watermarkText: 'Type content here ...',
    forcePreserveRatio: false,
    applyChangesOnMouseUp: false,
    isRtl: false,
    disableCache: false,
    tableFeaturesContainerSelector: '#' + 'EditorContainer',
    allowExcelNoBorderTable: false,
    imageMenu: true,
    tableMenu: true,
    listMenu: true,
    autoFormatOptions: {
        autoBullet: true,
        autoLink: true,
        autoNumbering: true,
        autoUnlink: false,
        autoHyphen: true,
        autoFraction: true,
        autoOrdinals: true,
    },
    markdownOptions: {
        bold: true,
        italic: true,
        strikethrough: true,
        codeFormat: {},
    },
    customReplacements: emojiReplacements,
};

export class EditorOptionsPlugin extends SidePanePluginImpl<OptionsPane, OptionPaneProps> {
    constructor() {
        super(OptionsPane, 'options', 'Editor Options');
    }

    getBuildInPluginState(): OptionState {
        let result: OptionState;
        this.getComponent(component => (result = component.getState()));
        return result || initialState;
    }

    getComponentProps(base: SidePaneElementProps) {
        return {
            ...initialState,
            ...base,
        };
    }
}
