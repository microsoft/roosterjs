import { PROG_ID_NAME } from './constants';
import type { getSourceFunction, getSourceInputParams } from './getPasteSource';

const POWERPOINT_ATTRIBUTE_VALUE = 'PowerPoint.Slide';

/**
 * @internal
 * Checks whether the Array provided contains strings that identify Power Point Desktop documents
 * @param props Properties related to the PasteEvent
 * @returns
 */
const isPowerPointDesktopDocument: getSourceFunction = (props: getSourceInputParams) => {
    return props.htmlAttributes[PROG_ID_NAME] == POWERPOINT_ATTRIBUTE_VALUE;
};
export default isPowerPointDesktopDocument;
