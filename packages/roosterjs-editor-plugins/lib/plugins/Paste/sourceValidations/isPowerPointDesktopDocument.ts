import { PROG_ID_NAME } from './constants';

const POWERPOINT_ATTRIBUTE_VALUE = 'PowerPoint.Slide';

/**
 * @internal
 * Checks whether the Array provided contains strings that identify Power Point Desktop documents
 * @param htmlAttributes html attributes to check.
 * @returns
 */
export function isPowerPointDesktopDocument(htmlAttributes: Record<string, string>) {
    return htmlAttributes[PROG_ID_NAME] == POWERPOINT_ATTRIBUTE_VALUE;
}
