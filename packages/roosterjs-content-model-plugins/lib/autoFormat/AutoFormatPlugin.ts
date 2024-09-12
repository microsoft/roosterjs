import { ChangeSource } from 'roosterjs-content-model-dom';
import { createLink } from './link/createLink';
import { createLinkAfterSpace } from './link/createLinkAfterSpace';
import { formatTextSegmentBeforeSelectionMarker } from 'roosterjs-content-model-api';
import { keyboardListTrigger } from './list/keyboardListTrigger';
import { transformFraction } from './numbers/transformFraction';
import { transformHyphen } from './hyphen/transformHyphen';
import { transformOrdinals } from './numbers/transformOrdinals';
import { unlink } from './link/unlink';
import type {
    ContentChangedEvent,
    EditorInputEvent,
    EditorPlugin,
    FormatContentModelOptions,
    IEditor,
    KeyDownEvent,
    PluginEvent,
} from 'roosterjs-content-model-types';

/**
 * Options to customize the Content Model Auto Format Plugin
 */
export type AutoFormatOptions = {
    /**
     * When true, after type *, ->, -, --, => , —, > and space key a type of bullet list will be triggered. @default true
     */
    autoBullet?: boolean;

    /**
     * When true, after type 1, A, a, i, I followed by ., ), - or between () and space key a type of numbering list will be triggered. @default true
     */
    autoNumbering?: boolean;

    /**
     * When press backspace before a link, remove the hyperlink
     */
    autoUnlink?: boolean;

    /**
     * When paste or type content with a link, create hyperlink for the link
     */
    autoLink?: boolean;

    /**
     * Transform -- into hyphen, if typed between two words
     */
    autoHyphen?: boolean;

    /**
     * Transform 1/2, 1/4, 3/4 into fraction character
     */
    autoFraction?: boolean;

    /**
     * Transform ordinal numbers into superscript
     */
    autoOrdinals?: boolean;

    /**
     * When paste content or type content with telephone, create hyperlink for the telephone number
     */
    autoTel?: boolean;

    /**
     * When paste or type a content with mailto, create hyperlink for the content
     */
    autoMailto?: boolean;
};

/**
 * @internal
 */
const DefaultOptions: Partial<AutoFormatOptions> = {
    autoBullet: false,
    autoNumbering: false,
    autoUnlink: false,
    autoLink: false,
    autoHyphen: false,
    autoFraction: false,
    autoOrdinals: false,
};

/**
 * Auto Format plugin handles auto formatting, such as transforming * characters into a bullet list.
 * It can be customized with options to enable or disable auto list features.
 */
export class AutoFormatPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    /**
     * @param options An optional parameter that takes in an object of type AutoFormatOptions, which includes the following properties:
     *  - autoBullet: A boolean that enables or disables automatic bullet list formatting. Defaults to false.
     *  - autoNumbering: A boolean that enables or disables automatic numbering formatting. Defaults to false.
     *  - autoLink: A boolean that enables or disables automatic hyperlink creation when pasting or typing content. Defaults to false.
     *  - autoUnlink: A boolean that enables or disables automatic hyperlink removal when pressing backspace. Defaults to false.
     *  - autoHyphen: A boolean that enables or disables automatic hyphen transformation. Defaults to false.
     *  - autoFraction: A boolean that enables or disables automatic fraction transformation. Defaults to false.
     *  - autoOrdinals: A boolean that enables or disables automatic ordinal number transformation. Defaults to false.
     */
    constructor(private options: AutoFormatOptions = DefaultOptions) {}

    /**
     * Get name of this plugin
     */
    getName() {
        return 'AutoFormat';
    }

    /**
     * The first method that editor will call to a plugin when editor is initializing.
     * It will pass in the editor instance, plugin should take this chance to save the
     * editor reference so that it can call to any editor method or format API later.
     * @param editor The editor object
     */
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * The last method that editor will call to a plugin before it is disposed.
     * Plugin can take this chance to clear the reference to editor. After this method is
     * called, plugin should not call to any editor method since it will result in error.
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Core method for a plugin. Once an event happens in editor, editor will call this
     * method of each plugin to handle the event as long as the event is not handled
     * exclusively by another plugin.
     * @param event The event to handle:
     */
    onPluginEvent(event: PluginEvent) {
        if (this.editor) {
            switch (event.eventType) {
                case 'input':
                    this.handleEditorInputEvent(this.editor, event);
                    break;
                case 'keyDown':
                    this.handleKeyDownEvent(this.editor, event);
                    break;
                case 'contentChanged':
                    this.handleContentChangedEvent(this.editor, event);
                    break;
            }
        }
    }

    private handleEditorInputEvent(editor: IEditor, event: EditorInputEvent) {
        const rawEvent = event.rawEvent;
        const selection = editor.getDOMSelection();
        if (
            rawEvent.inputType === 'insertText' &&
            selection &&
            selection.type === 'range' &&
            selection.range.collapsed
        ) {
            switch (rawEvent.data) {
                case ' ':
                    const formatOptions: FormatContentModelOptions = {
                        changeSource: '',
                        apiName: '',
                    };
                    formatTextSegmentBeforeSelectionMarker(
                        editor,
                        (model, previousSegment, paragraph, _markerFormat, context) => {
                            const {
                                autoBullet,
                                autoNumbering,
                                autoLink,
                                autoHyphen,
                                autoFraction,
                                autoOrdinals,
                                autoMailto,
                                autoTel,
                            } = this.options;
                            let shouldHyphen = false;
                            let shouldLink = false;
                            let shouldList = false;
                            let shouldFraction = false;
                            let shouldOrdinals = false;

                            if (autoBullet || autoNumbering) {
                                shouldList = keyboardListTrigger(
                                    model,
                                    paragraph,
                                    context,
                                    autoBullet,
                                    autoNumbering
                                );
                            }

                            if (autoLink || autoTel || autoMailto) {
                                shouldLink = createLinkAfterSpace(
                                    previousSegment,
                                    paragraph,
                                    context,
                                    autoLink,
                                    autoTel,
                                    autoMailto
                                );
                            }

                            if (autoHyphen) {
                                shouldHyphen = transformHyphen(previousSegment, paragraph, context);
                            }

                            if (autoFraction) {
                                shouldFraction = transformFraction(
                                    previousSegment,
                                    paragraph,
                                    context
                                );
                            }

                            if (autoOrdinals) {
                                shouldOrdinals = transformOrdinals(
                                    previousSegment,
                                    paragraph,
                                    context
                                );
                            }

                            formatOptions.apiName = getApiName(shouldList, shouldHyphen);
                            formatOptions.changeSource = getChangeSource(
                                shouldList,
                                shouldHyphen,
                                shouldLink
                            );

                            return (
                                shouldList ||
                                shouldHyphen ||
                                shouldLink ||
                                shouldFraction ||
                                shouldOrdinals
                            );
                        },
                        formatOptions
                    );

                    break;
            }
        }
    }

    private handleKeyDownEvent(editor: IEditor, event: KeyDownEvent) {
        const rawEvent = event.rawEvent;
        if (!rawEvent.defaultPrevented && !event.handledByEditFeature) {
            switch (rawEvent.key) {
                case 'Backspace':
                    if (this.options.autoUnlink) {
                        unlink(editor, rawEvent);
                    }
                    break;
            }
        }
    }

    private handleContentChangedEvent(editor: IEditor, event: ContentChangedEvent) {
        const { autoLink, autoTel, autoMailto } = this.options;
        if (event.source == 'Paste' && (autoLink || autoTel || autoMailto)) {
            createLink(editor, autoLink, autoTel, autoMailto);
        }
    }
}

const getApiName = (shouldList: boolean, shouldHyphen: boolean) => {
    return shouldList ? 'autoToggleList' : shouldHyphen ? 'autoHyphen' : '';
};

const getChangeSource = (shouldList: boolean, shouldHyphen: boolean, shouldLink: boolean) => {
    return shouldList || shouldHyphen
        ? ChangeSource.AutoFormat
        : shouldLink
        ? ChangeSource.AutoLink
        : '';
};
