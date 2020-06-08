import { ChangeSource, DocumentCommand, QueryScope } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { HtmlSanitizer } from 'roosterjs-editor-dom';

/**
 * Toggle header at selection
 * @param editor The editor instance
 * @param level The header level, can be a number from 0 to 6, in which 1 ~ 6 refers to
 * the HTML header element &lt;H1&gt; to &lt;H6&gt;, 0 means no header
 * if passed in param is outside the range, will be rounded to nearest number in the range
 */
export default function toggleHeader(editor: Editor, level: number) {
    level = Math.min(Math.max(Math.round(level), 0), 6);

    editor.addUndoSnapshot(() => {
        editor.focus();

        let wrapped = false;
        editor.queryElements('H1,H2,H3,H4,H5,H6', QueryScope.OnSelection, header => {
            if (!wrapped) {
                editor.getDocument().execCommand(DocumentCommand.FormatBlock, false, '<DIV>');
                wrapped = true;
            }

            let div = editor.getDocument().createElement('div');
            while (header.firstChild) {
                div.appendChild(header.firstChild);
            }
            editor.replaceNode(header, div);
        });

        if (level > 0) {
            let traverser = editor.getSelectionTraverser();
            let blockElement = traverser ? traverser.currentBlockElement : null;
            let sanitizer = new HtmlSanitizer({
                styleCallbacks: {
                    'font-size': () => false,
                },
            });
            while (blockElement) {
                let element = blockElement.collapseToSingleElement();
                sanitizer.sanitize(element);
                blockElement = traverser.getNextBlockElement();
            }
            editor.getDocument().execCommand(DocumentCommand.FormatBlock, false, `<H${level}>`);
        }
    }, ChangeSource.Format);
}
