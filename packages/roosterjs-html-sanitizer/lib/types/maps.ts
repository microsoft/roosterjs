export type Map<T> = { [name: string]: T };

/**
 * Element callback, will be called when HtmlSanitizer process an element with the given tag
 * @param element The HTML element
 * @param context A context object to store values which can used for communicating among callbacks
 * @returns True if this element should be kept, otherwise false
 */
export type ElementCallback = (element: HTMLElement, context: Object) => boolean;

/**
 * Attribute callback, will be called when HtmlSanitizer process an attribute with given name
 * @param value Value of the attribute
 * @param element The HTML element contains this attribute
 * @param context A context object to store values which can used for communicating among callbacks
 * @returns null to remove this attribute, otherwise keep the attribute with the value returned
 */
export type AttributeCallback = (value: string, element: HTMLElement, context: Object) => string;

/**
 * Style callback, will be called when HtmlSanitizer process an inline CSS style with given name
 * @param value Value of the CSS rule
 * @param element The HTML element contains this CSS style
 * @param context A context object to store values which can used for communicating among callbacks
 * @returns True if this rule should be kept, otherwise false
 */
export type StyleCallback = (value: string, element: HTMLElement, context: Object) => boolean;

/**
 * A map of elements callback. Tag name should be in upper case
 */
export type ElementCallbackMap = Map<ElementCallback>;

/**
 * A map of atttribute callbacks. Tag name should be in lower case
 */
export type AttributeCallbackMap = Map<AttributeCallback>;

/**
 * A map of style callbacks. Style name should be in lower case
 */
export type StyleCallbackMap = Map<StyleCallback>;

/**
 * A map of atttribute callbacks. Tag name should be in lower case
 */
export type StringMap = Map<string>;
