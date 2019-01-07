import Editor from '../editor/Editor';
import EditorPlugin from '../interfaces/EditorPlugin';
import { PluginCompositionEvent, PluginEventType } from 'roosterjs-editor-types';

/**
 * IME Component helps handle IME related stuff
 */
export default class IMEPlugin implements EditorPlugin {
    private inIme = false;
    private disposers: (() => void)[];

    getName() {
        return 'IME';
    }

    initialize(editor: Editor) {
        this.disposers = [
            editor.addDomEventHandler('compositionstart', () => (this.inIme = true)),
            editor.addDomEventHandler('compositionend', (e: CompositionEvent) => {
                this.inIme = false;
                editor.triggerEvent(<PluginCompositionEvent>{
                    eventType: PluginEventType.CompositionEnd,
                    rawEvent: e,
                });
            }),
        ];
    }

    dispose() {
        this.disposers.forEach(d => d());
        this.disposers = null;
    }

    /**
     * Check if editor is in IME input sequence
     * @returns True if editor is in IME input sequence, otherwise false
     */
    public isInIME() {
        return this.inIme;
    }
}
