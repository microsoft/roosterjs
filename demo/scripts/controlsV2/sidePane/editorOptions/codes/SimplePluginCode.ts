import { CodeElement } from './CodeElement';

class SimplePluginCode extends CodeElement {
    constructor(private name: string, private namespace: string = 'roosterjsContentModel') {
        super();
    }

    getCode() {
        return `new ${this.namespace}.${this.name}()`;
    }
}

export class AutoFormatPluginCode extends SimplePluginCode {
    constructor() {
        super('AutoFormatPlugin');
    }
}

export class EditPluginCode extends SimplePluginCode {
    constructor() {
        super('EditPlugin');
    }
}

export class PastePluginCode extends SimplePluginCode {
    constructor() {
        super('PastePlugin');
    }
}

export class ShortcutPluginCode extends SimplePluginCode {
    constructor() {
        super('ShortcutPlugin');
    }
}

export class TableEditPluginCode extends SimplePluginCode {
    constructor() {
        super('TableEditPlugin');
    }
}

export class ImageEditCode extends SimplePluginCode {
    constructor() {
        super('ImageEdit', 'roosterjs');
    }
}

export class CustomReplaceCode extends SimplePluginCode {
    constructor() {
        super('CustomReplace', 'roosterjs');
    }
}

export class TableCellSelectionCode extends SimplePluginCode {
    constructor() {
        super('TableCellSelection', 'roosterjs');
    }
}
