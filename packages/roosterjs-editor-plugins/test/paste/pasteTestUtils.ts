import { createDefaultHtmlSanitizerOptions } from 'roosterjs-editor-dom';
import { BeforePasteEvent, ClipboardData, PluginEventType } from 'roosterjs-editor-types';

export const getPasteEvent = (): BeforePasteEvent => {
    return {
        eventType: PluginEventType.BeforePaste,
        clipboardData: <ClipboardData>{},
        fragment: document.createDocumentFragment(),
        sanitizingOption: createDefaultHtmlSanitizerOptions(),
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
    };
};
