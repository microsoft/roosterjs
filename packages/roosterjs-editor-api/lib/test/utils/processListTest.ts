import * as TestHelper from '../TestHelper';
import processList, { ValidProcessListDocumentCommands } from '../../utils/processList';
import { DocumentCommand } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';

describe('processList()', () => {
    const testID = 'processList';
    let editor: Editor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('calls exec command for any potential document command', () => {
        const document = editor.getDocument();
        spyOn(document, 'execCommand');
        const randomCommand = Math.floor(Math.random() * 4);
        const commands: ValidProcessListDocumentCommands[] = [
            DocumentCommand.Indent,
            DocumentCommand.Outdent,
            DocumentCommand.InsertOrderedList,
            DocumentCommand.InsertUnorderedList,
        ];

        processList(editor, commands[randomCommand]);

        expect(document.execCommand).toHaveBeenCalledWith(commands[randomCommand], false, null);
    });

    it('moves the span, preserving its attributes after the exec command', () => {
        // Arrange
        const originalContent =
            '<ul><li><span style="font-size: 20pt; font-family: &quot;Courier New&quot;;">​big font</span></li><ul><li id="level 2"><span id="level 2 content" style="font-size: 20pt; font-family: &quot;Courier New&quot;;"><img id="focus helper" /><br></span></li></ul></ul>';
        editor.setContent(originalContent);
        const focusNode = document.getElementById('focus helper');
        TestHelper.setSelection(focusNode, 0);
        editor.deleteNode(focusNode);

        // Act
        processList(editor, DocumentCommand.Outdent);

        // Assert
        expect(editor.getContent()).toBe(
            '<ul><li><span style="font-size: 20pt; font-family: &quot;Courier New&quot;;">​big font</span></li><li id="level 2"><span id="level 2 content" style="font-size: 20pt; font-family: &quot;Courier New&quot;;"><br></span></li></ul>'
        );
    });

    it('moves the span out of the list, preserving the span after the exec command', () => {
        // Arrange
        const originalContent =
            '<ul><li><span style="font-size: 20pt; font-family: &quot;Courier New&quot;;">​big font</span></li><li id="level 2"><span id="level 2 content" style="font-size: 20pt; font-family: &quot;Courier New&quot;;"><img id="focus helper" /><br></span></li></ul>';
        editor.setContent(originalContent);
        const focusNode = document.getElementById('focus helper');
        TestHelper.setSelection(focusNode, 0);
        editor.deleteNode(focusNode);

        // Act
        processList(editor, DocumentCommand.Outdent);

        // Assert
        expect(editor.getContent()).toBe(
            '<ul><li><span style="font-size: 20pt; font-family: &quot;Courier New&quot;;">​big font</span></li></ul><span id="level 2 content" style="font-size: 20pt; font-family: &quot;Courier New&quot;;"><br></span>'
        );
    });
});
