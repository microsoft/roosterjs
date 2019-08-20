import CodeElement from './CodeElement';

class SimplePluginCode extends CodeElement {
    constructor(private name: string) {
        super();
    }

    getCode() {
        return `new roosterjs.${this.name}()`;
    }
}

export class PasteCode extends SimplePluginCode {
    constructor() {
        super('Paste');
    }
}

export class ImageResizeCode extends SimplePluginCode {
    constructor() {
        super('ImageResize');
    }
}

export class TableResizeCode extends SimplePluginCode {
    constructor() {
        super('TableResize');
    }
}

export class CustomReplaceCode extends SimplePluginCode {
    constructor() {
        super('CustomReplace');
    }
}
