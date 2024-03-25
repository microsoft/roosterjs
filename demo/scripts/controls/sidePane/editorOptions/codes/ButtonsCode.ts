import CodeElement from './CodeElement';
import { getObjectKeys } from 'roosterjs-editor-dom';

const codeMap: { [id: string]: string } = {
    buttonB: 'roosterjsLegacy.toggleBold(editor)',
    buttonI: 'roosterjsLegacy.toggleItalic(editor)',
    buttonU: 'roosterjsLegacy.toggleUnderline(editor)',
    buttonBullet: 'roosterjsLegacy.toggleBullet(editor)',
    buttonNumbering: 'roosterjsLegacy.toggleNumbering(editor)',
    buttonUndo: 'editor.undo()',
    buttonRedo: 'editor.redo()',
};
const buttonDark = 'editor.setDarkModeState(!editor.isDarkMode())';

export default class ButtonsCode extends CodeElement {
    getCode() {
        const map = { ...codeMap, buttonDark: buttonDark };
        return getObjectKeys(map)
            .map(
                id =>
                    `document.getElementById('${id}').addEventListener('click', () => ${map[id]});\n`
            )
            .join('');
    }
}
