import CodeElement from './CodeElement';

class SimplePluginCode extends CodeElement {
    constructor(private name: string, private namespace: string = 'roosterjs') {
        super();
    }

    getCode() {
        return `new ${this.namespace}.${this.name}()`;
    }
}

export class PasteCode extends SimplePluginCode {
    constructor() {
        super('Paste');
    }
}

export class ContentModelPasteCode extends SimplePluginCode {
    constructor() {
        super('ContentModelPastePlugin', 'roosterjsContentModel');
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
