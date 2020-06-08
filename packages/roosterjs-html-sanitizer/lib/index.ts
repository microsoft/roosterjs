// This package is deprecated.
// All exports here are just for backward compatibility.
// Please use type from their real packages directly
export {
    HtmlSanitizer,
    htmlToDom,
    splitWithFragment,
    getInheritableStyles,
} from 'roosterjs-editor-dom';

export {
    HtmlSanitizerOptions,
    SanitizeHtmlOptions,
    AttributeCallback,
    AttributeCallbackMap,
    ElementCallback,
    StringMap,
    StyleCallback,
    StyleCallbackMap,
    ElementCallbackMap,
} from 'roosterjs-editor-types';

export type Map<T> = { [name: string]: T };
