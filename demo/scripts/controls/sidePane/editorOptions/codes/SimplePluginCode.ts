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

export class ImageEditCode extends SimplePluginCode {
    constructor() {
        super('ImageEdit');
    }
}

export class CutPasteListChainCode extends SimplePluginCode {
    constructor() {
        super('CutPasteListChain');
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
