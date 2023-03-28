import formatUndoSnapshot from '../utils/formatUndoSnapshot';
import { DocumentCommand, IEditor, QueryScope } from 'roosterjs-editor-types';
import { HtmlSanitizer, moveChildNodes } from 'roosterjs-editor-dom';

/**
 * Toggle header at selection
 * @param editor The editor instance
 * @param level The header level, can be a number from 0 to 6, in which 1 ~ 6 refers to
 * the HTML header element &lt;H1&gt; to &lt;H6&gt;, 0 means no header
 * if passed in param is outside the range, will be rounded to nearest number in the range
 */
export default function toggleHeader(editor: IEditor, level: number) {
    level = Math.min(Math.max(Math.round(level), 0), 6);

    formatUndoSnapshot(
        editor,
        () => {
            editor.focus();

            let wrapped = false;
            editor.queryElements('H1,H2,H3,H4,H5,H6', QueryScope.OnSelection, header => {
                if (!wrapped) {
                    editor.getDocument().execCommand(DocumentCommand.FormatBlock, false, '<DIV>');
                    wrapped = true;
                }

                const div = editor.getDocument().createElement('div');
                moveChildNodes(div, header);
                editor.replaceNode(header, div);
            });

            if (level > 0) {
                let traverser = editor.getSelectionTraverser();
                let blockElement = traverser?.currentBlockElement;
                let sanitizer = new HtmlSanitizer({
                    cssStyleCallbacks: {
                        'font-size': () => false,
                    },
                });
                while (blockElement) {
                    let element = blockElement.collapseToSingleElement();
                    sanitizer.sanitize(element);
                    blockElement = traverser?.getNextBlockElement();
                }
                editor.getDocument().execCommand(DocumentCommand.FormatBlock, false, `<H${level}>`);
            }
        },
        'toggleHeader'
    );
}
