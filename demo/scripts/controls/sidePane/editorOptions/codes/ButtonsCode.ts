import CodeElement from './CodeElement';
import { getObjectKeys } from 'roosterjs-editor-dom';

const codeMap: { [id: string]: string } = {
    buttonB: 'roosterjs.toggleBold(editor)',
    buttonI: 'roosterjs.toggleItalic(editor)',
    buttonU: 'roosterjs.toggleUnderline(editor)',
    buttonBullet: 'roosterjs.toggleBullet(editor)',
    buttonNumbering: 'roosterjs.toggleNumbering(editor)',
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
