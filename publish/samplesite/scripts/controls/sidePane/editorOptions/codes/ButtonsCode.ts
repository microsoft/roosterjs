import CodeElement from './CodeElement';

const codeMap: { [id: string]: string } = {
    buttonB: 'roosterjs.toggleBold(editor)',
    buttonI: 'roosterjs.toggleItalic(editor)',
    buttonU: 'roosterjs.toggleUnderline(editor)',
    buttonBullet: 'roosterjs.toggleBullet(editor)',
    buttonNumbering: 'roosterjs.toggleNumbering(editor)',
    buttonUndo: 'editor.undo()',
    buttonRedo: 'editor.redo()',
};

export default class ButtonsCode extends CodeElement {
    getCode() {
        return Object.keys(codeMap)
            .map(
                id =>
                    `document.getElementById('${id}').addEventListener('click', () => ${codeMap[id]});\n`
            )
            .join('');
    }
}
