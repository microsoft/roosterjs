import { CodeElement } from './CodeElement';
import { getObjectKeys } from 'roosterjs-content-model-dom';

const codeMap: { [id: string]: string } = {
    buttonB: 'roosterjsContentModel.toggleBold(editor)',
    buttonI: 'roosterjsContentModel.toggleItalic(editor)',
    buttonU: 'roosterjsContentModel.toggleUnderline(editor)',
    buttonBullet: 'roosterjsContentModel.toggleBullet(editor)',
    buttonNumbering: 'roosterjsContentModel.toggleNumbering(editor)',
    buttonUndo: 'roosterjsContentModel.undo(editor)',
    buttonRedo: 'roosterjsContentModel.redo(editor)',
    buttonTable: 'roosterjsContentModel.insertTable(editor, 3, 3)',
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
