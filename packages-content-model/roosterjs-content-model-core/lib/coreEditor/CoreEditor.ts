/**
 * Core Editor for Content Model
 */
export class CoreEditor {
    constructor(private contentDiv: HTMLDivElement) {
        this.contentDiv.contentEditable = 'true';
    }

    dispose() {
        this.contentDiv.contentEditable = 'false';
    }

    setDarkModeState() {}

    setZoomScale() {}
}
