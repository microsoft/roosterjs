import CodeElement from './CodeElement';

export default class TableCellSelectionCode extends CodeElement {
    constructor() {
        super();
    }

    getCode() {
        return 'new roosterjsLegacy.TableCellSelection()';
    }
}
