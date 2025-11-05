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

export class PastePluginCode extends CodeElement {
    constructor(
        private allowExcelNoBorderTable: boolean,
        private pastePluginOptions: { removeTransparencyFromWordDesktopImages?: boolean }
    ) {
        super();
    }

    getCode() {
        const parts: string[] = [];

        if (this.allowExcelNoBorderTable) {
            parts.push('true');
        } else {
            parts.push('false');
        }

        parts.push('undefined'); // domToModelForSanitizing parameter

        const options: string[] = [];
        if (this.pastePluginOptions.removeTransparencyFromWordDesktopImages) {
            options.push('removeTransparencyFromWordDesktopImages: true');
        }

        if (options.length > 0) {
            parts.push(`{ ${options.join(', ')} }`);
        }

        return `new roosterjs.PastePlugin(${parts.join(', ')})`;
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

export class ImageEditPluginCode extends SimplePluginCode {
    constructor() {
        super('ImageEditPlugin');
    }
}
