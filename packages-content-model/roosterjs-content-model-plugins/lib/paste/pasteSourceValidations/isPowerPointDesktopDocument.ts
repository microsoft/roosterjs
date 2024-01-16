import { PastePropertyNames } from './constants';
import type { GetSourceFunction } from './getPasteSource';

const POWERPOINT_ATTRIBUTE_VALUE = 'PowerPoint.Slide';

/**
 * @internal
 * Checks whether the Array provided contains strings that identify Power Point Desktop documents
 * @param props Properties related to the PasteEvent
 * @returns
 */
export const isPowerPointDesktopDocument: GetSourceFunction = props => {
    return props.htmlAttributes[PastePropertyNames.PROG_ID_NAME] == POWERPOINT_ATTRIBUTE_VALUE;
};
