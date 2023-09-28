import AnnounceHandler from './AnnounceHandlerImpl';
import { PluginEventType } from 'roosterjs-editor-types';
import type {
    KnownAnnounceStrings,
    EditorPlugin,
    IEditor,
    PluginEvent,
} from 'roosterjs-editor-types';

/**
 * Automatically transform -- into hyphen, if typed between two words.
 */
export default class Announce implements EditorPlugin {
    private announceHandler: AnnounceHandler | undefined;

    constructor(private readonly stringsMap?: Map<KnownAnnounceStrings, string> | undefined) {}

    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'Announce';
    }

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    initialize(editor: IEditor) {
        this.announceHandler = new AnnounceHandler(editor.getDocument(), this.stringsMap);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.announceHandler?.dispose();
        this.announceHandler = undefined;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (
            event.eventType == PluginEventType.ContentChanged &&
            event.additionalData?.getAnnounceData
        ) {
            const data = event.additionalData.getAnnounceData();
            if (data) {
                this.announceHandler?.announce(data);
            }
        }
    }
}
