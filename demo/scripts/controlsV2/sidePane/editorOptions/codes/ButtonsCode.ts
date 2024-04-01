import { CodeElement } from './CodeElement';
import { getObjectKeys } from 'roosterjs-content-model-dom';

const codeMap: { [id: string]: string } = {
    buttonB: 'roosterjs.toggleBold(editor)',
    buttonI: 'roosterjs.toggleItalic(editor)',
    buttonU: 'roosterjs.toggleUnderline(editor)',
    buttonBullet: 'roosterjs.toggleBullet(editor)',
    buttonNumbering: 'roosterjs.toggleNumbering(editor)',
    buttonUndo: 'roosterjs.undo(editor)',
    buttonRedo: 'roosterjs.redo(editor)',
    buttonTable: 'roosterjs.insertTable(editor, 3, 3)',
    buttonDark: 'editor.setDarkModeState(!editor.isDarkMode())',
};

export class ButtonsCode extends CodeElement {
    getCode() {
        const map = { ...codeMap };
        return getObjectKeys(map)
            .map(
                id =>
                    `document.getElementById('${id}').addEventListener('click', () => ${map[id]});\n`
            )
            .join('');
    }
}
