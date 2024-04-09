import { CodeElement } from './CodeElement';

class SimplePluginCode extends CodeElement {
    constructor(private name: string, private namespace: string = 'roosterjs') {
        super();
    }

    getCode() {
        return `new ${this.namespace}.${this.name}()`;
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
        super('ImageEdit', 'roosterjsLegacy');
    }
}

export class CustomReplaceCode extends SimplePluginCode {
    constructor() {
        super('CustomReplace', 'roosterjsLegacy');
    }
}
