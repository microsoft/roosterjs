import { createDefaultHtmlSanitizerOptions } from 'roosterjs-editor-dom';
import {
    BeforePasteEvent,
    ClipboardData,
    PasteType,
    PluginEventType,
} from 'roosterjs-editor-types';

export const EXCEL_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:excel';
export const POWERPOINT_ATTRIBUTE_VALUE = 'PowerPoint.Slide';
export const WORD_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:word';

export const getPasteEvent = (): BeforePasteEvent => {
    return {
        eventType: PluginEventType.BeforePaste,
        clipboardData: <ClipboardData>{},
        fragment: document.createDocumentFragment(),
        sanitizingOption: createDefaultHtmlSanitizerOptions(),
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
        pasteType: PasteType.Normal,
    };
};

export const getWacElement = (): HTMLElement => {
    const element = document.createElement('span');
    element.classList.add('WACImageContainer');
    return element;
};
