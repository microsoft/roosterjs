import CodeElement from './CodeElement';

export default class DarkModeCode extends CodeElement {
    constructor(private darkModeSupported: boolean) {
        super();
    }

    getCode() {
        return this.darkModeSupported ? 'roosterjs.getDarkColor' : null;
    }
}
