import CodeElement from './CodeElement';

class SimplePluginCode extends CodeElement {
    constructor(private name: string, private path: string, private isDefault: boolean) {
        super();
    }

    getImports() {
        return [
            {
                name: this.name,
                path: this.path,
                isDefault: this.isDefault,
            },
        ];
    }

    getCode() {
        return `new ${this.name}()`;
    }
}

export class PasteCode extends SimplePluginCode {
    constructor() {
        super('Paste', 'roosterjs-editor-plugins', false);
    }
}

export class ImageResizeCode extends SimplePluginCode {
    constructor() {
        super('ImageResize', 'roosterjs-plugin-image-resize', false);
    }
}

export class TableResizeCode extends SimplePluginCode {
    constructor() {
        super('TableResize', 'roosterjs-editor-plugins', false);
    }
}
