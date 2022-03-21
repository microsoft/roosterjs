import {
    EditorPlugin,
    IEditor,
    InlineElement,
    PluginEvent,
    PluginEventType,
    PositionType,
} from 'roosterjs-editor-types';

/**
 * A plugin that solves mathematical operations on the editor
 */
export default class MathNapkinPlugin implements EditorPlugin {
    private editor: IEditor;

    constructor() {}

    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'MathNapkin';
    }

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    public initialize(editor: IEditor): void {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    public dispose(): void {
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    public onPluginEvent(event: PluginEvent) {
        if (event.eventType != PluginEventType.Input || this.editor.isInIME()) {
            return;
        }

        const range = this.editor.getSelectionRange();
        if (range == null) {
            return;
        }

        const searcher = this.editor.getContentSearcherOfCursor(event);
        let stringToSearch: string;
        let equal: string;
        let lastChar: string;
        searcher.forEachTextInlineElement((textInlineElement: InlineElement) => {
            stringToSearch = textInlineElement.getTextContent();
            equal = stringToSearch.charAt(stringToSearch.length - 2);
            lastChar = stringToSearch.charAt(stringToSearch.length - 1).replace(/\s/g, ' ');
        });

        if (!(equal === '=' && lastChar === ' ')) {
            return;
        }

        extractMathExpression(stringToSearch);

        const resultRange = searcher.getRangeFromText(stringToSearch, true /* exactMatch */);
        const document = this.editor.getDocument();
        const parsingSpan = document.createElement('span');
        parsingSpan.innerText = stringToSearch + 'teste';
        const nodeToInsert =
            parsingSpan.childNodes.length == 1 ? parsingSpan.childNodes[0] : parsingSpan;

        this.editor.addUndoSnapshot(
            () => {
                resultRange.deleteContents();
                resultRange.insertNode(nodeToInsert);
                this.editor.select(nodeToInsert, PositionType.End);
            },
            null /*changeSource*/,
            true /*canUndoByBackspace*/
        );
    }
}

function extractMathExpression(stringToSearch: string) {
    const isAMathExpression = /(?:(?:^|[-+_*/])(?:\s*-?\d+(\.\d+)?(?:[eE][+-]?\d+)?\s*))+$/;
    const isALetter = /[a-zA-Z]/;
    const stringWithNoSpace = stringToSearch.replace(' ', '#');
    const stringLength = stringWithNoSpace.length - 2;
    let expression;

    for (let i = 0; i < stringLength; i++) {
        expression = stringWithNoSpace.substr(stringLength - i, i);
        if (isALetter.test(expression)) {
            break;
        }
    }
    expression = expression.split('#')[1];
    if (!isAMathExpression.test(expression)) {
        return '';
    }
    console.log(calculate(expression));
    return calculate(expression);
}

function calculate(expression: string) {
    const expLength = expression.length;
    let mathExpression: any;
    for (let i = 0; i < expLength; i++) {
        mathExpression = isNaN(parseInt(expression[i]))
            ? mathExpression + expression[i]
            : mathExpression + parseInt(expression[i]);
    }
    return mathExpression;
}
