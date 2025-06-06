import { ChangeSource } from 'roosterjs-content-model-dom';
import { checkAndInsertHorizontalLine } from './horizontalLine/checkAndInsertHorizontalLine';
import { createLink } from './link/createLink';
import { formatTextSegmentBeforeSelectionMarker, promoteLink } from 'roosterjs-content-model-api';
import { keyboardListTrigger } from './list/keyboardListTrigger';
import { transformFraction } from './numbers/transformFraction';
import { transformHyphen } from './hyphen/transformHyphen';
import { transformOrdinals } from './numbers/transformOrdinals';
import { unlink } from './link/unlink';
import type { AutoFormatOptions } from './interface/AutoFormatOptions';
import type {
    ContentChangedEvent,
    ContentModelText,
    EditorInputEvent,
    EditorPlugin,
    FormatContentModelContext,
    FormatContentModelOptions,
    IEditor,
    KeyDownEvent,
    PluginEvent,
    ReadonlyContentModelDocument,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
interface Feature {
    enabled: boolean;
    transformFunction: (
        model: ReadonlyContentModelDocument,
        previousSegment: ContentModelText,
        paragraph: ShallowMutableContentModelParagraph,
        context: FormatContentModelContext
    ) => boolean | HTMLElement;
    changeSource: string;
    apiName: string;
}

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
    removeListMargins: false,
    autoHorizontalLine: false,
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
     *  - removeListMargins: A boolean to remove list margins when it is automatically triggered. Defaults to false.
     *  - autoHyphen: A boolean that enables or disables automatic hyphen transformation. Defaults to false.
     *  - autoFraction: A boolean that enables or disables automatic fraction transformation. Defaults to false.
     *  - autoOrdinals: A boolean that enables or disables automatic ordinal number transformation. Defaults to false.
     *  - autoLink: A boolean that enables or disables automatic hyperlink url address creation when pasting or typing content. Defaults to false.
     *  - autoUnlink: A boolean that enables or disables automatic hyperlink removal when pressing backspace. Defaults to false.
     *  - autoTel: A boolean that enables or disables automatic hyperlink telephone numbers transformation. Defaults to false.
     *  - autoMailto: A boolean that enables or disables automatic hyperlink email address transformation. Defaults to false.
     *  - autoHorizontalLine: A boolean that enables or disables automatic horizontal line creation. Defaults to false.
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

    private autoLink: Feature = {
        enabled: !!(this.options.autoLink || this.options.autoTel || this.options.autoMailto),
        transformFunction: (_model, previousSegment, paragraph, context) => {
            const { autoLink, autoTel, autoMailto } = this.options;
            const linkSegment = promoteLink(previousSegment, paragraph, {
                autoLink,
                autoTel,
                autoMailto,
            });

            if (linkSegment) {
                return createAnchor(linkSegment.link?.format.href || '', linkSegment.text);
            }
            return false;
        },
        apiName: 'autoLink',
        changeSource: ChangeSource.AutoLink,
    };

    private tabFeatures: Feature[] = [
        {
            enabled: !!(this.options.autoBullet || this.options.autoNumbering),
            transformFunction: (model, _previousSegment, paragraph, context) =>
                keyboardListTrigger(
                    model,
                    paragraph,
                    context,
                    this.options.autoBullet,
                    this.options.autoNumbering,
                    this.options.removeListMargins
                ),
            apiName: 'autoToggleList',
            changeSource: ChangeSource.AutoFormat,
        },
        this.autoLink,
    ];

    private features: Feature[] = [
        ...this.tabFeatures,
        {
            enabled: !!this.options.autoHyphen,
            apiName: 'autoHyphen',
            changeSource: ChangeSource.Format,
            transformFunction: (_model, previousSegment, paragraph, context) =>
                transformHyphen(previousSegment, paragraph, context),
        },
        {
            enabled: !!this.options.autoFraction,
            apiName: 'autoFraction',
            changeSource: ChangeSource.Format,
            transformFunction: (_model, previousSegment, paragraph, context) =>
                transformFraction(previousSegment, paragraph, context),
        },
        {
            enabled: !!this.options.autoOrdinals,
            apiName: 'autoOrdinal',
            changeSource: ChangeSource.Format,
            transformFunction: (_model, previousSegment, paragraph, context) =>
                transformOrdinals(previousSegment, paragraph, context),
        },
    ];

    private enterFeatures: Feature[] = [
        {
            enabled: !!this.options.autoHorizontalLine,
            transformFunction: (model, _previousSegment, paragraph, context) =>
                checkAndInsertHorizontalLine(model, paragraph, context),
            apiName: 'autoHorizontalLine',
            changeSource: ChangeSource.AutoFormat,
        },
        this.autoLink,
    ];

    private handleKeyboardEvents(editor: IEditor, features: Feature[]): FormatContentModelOptions {
        const formatOptions: FormatContentModelOptions = {
            changeSource: '',
            apiName: '',
            getChangeData: undefined,
        };

        formatTextSegmentBeforeSelectionMarker(
            editor,
            (model, previousSegment, paragraph, _markerFormat, context) => {
                let featureApplied: Feature | undefined = undefined;
                for (const feature of features) {
                    if (feature.enabled) {
                        const result = feature.transformFunction(
                            model,
                            previousSegment,
                            paragraph,
                            context
                        );
                        if (result) {
                            if (typeof result !== 'boolean') {
                                formatOptions.getChangeData = () => result;
                            }
                            featureApplied = feature;
                            break;
                        }
                    }
                }

                if (featureApplied) {
                    formatOptions.changeSource = featureApplied.changeSource;
                    formatOptions.apiName = featureApplied.apiName;
                }

                return !!featureApplied;
            },
            formatOptions
        );
        return formatOptions;
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
                    this.handleKeyboardEvents(editor, this.features);
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
                case 'Tab':
                    if (!rawEvent.shiftKey) {
                        const eventHandled = this.handleKeyboardEvents(editor, this.tabFeatures);
                        if (eventHandled.apiName == 'autoToggleList') {
                            event.rawEvent.preventDefault();
                        }
                    }
                    break;
                case 'Enter':
                    const eventHandled = this.handleKeyboardEvents(editor, this.enterFeatures);
                    if (eventHandled.apiName == 'autoHorizontalLine') {
                        event.rawEvent.preventDefault();
                    }
                    break;
            }
        }
    }

    private handleContentChangedEvent(editor: IEditor, event: ContentChangedEvent) {
        const { autoLink, autoTel, autoMailto } = this.options;
        if (event.source == 'Paste' && (autoLink || autoTel || autoMailto)) {
            createLink(editor, {
                autoLink,
                autoTel,
                autoMailto,
            });
        }
    }
}

const createAnchor = (url: string, text: string) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.textContent = text;
    return anchor;
};
