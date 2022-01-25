import CodeElement from './CodeElement';

export default class TableSelectionCode extends CodeElement {
    constructor() {
        super();
    }

    getCode() {
        return 'new roosterjs.TableCellSelection(contentDiv)';
    }
}
