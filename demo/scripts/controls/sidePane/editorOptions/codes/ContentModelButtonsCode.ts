import CodeElement from './CodeElement';
import { getObjectKeys } from 'roosterjs-editor-dom';

const codeMap: { [id: string]: string } = {
    buttonB: 'roosterjsContentModel.toggleBold(editor)',
    buttonI: 'roosterjsContentModel.toggleItalic(editor)',
    buttonU: 'roosterjsContentModel.toggleUnderline(editor)',
    buttonBullet: 'roosterjsContentModel.toggleBullet(editor)',
    buttonNumbering: 'roosterjsContentModel.toggleNumbering(editor)',
    buttonUndo: 'editor.undo()',
    buttonRedo: 'editor.redo()',
};
const buttonDark = 'editor.setDarkModeState(!editor.isDarkMode())';

export default class ContentModelButtonsCode extends CodeElement {
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
