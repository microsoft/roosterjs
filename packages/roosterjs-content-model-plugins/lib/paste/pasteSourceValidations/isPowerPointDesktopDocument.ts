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
    const { htmlAttributes, environment, htmlHeadString } = props;

    const rawHtmlContainsPptAttribute =
        !!environment.isSafari && htmlHeadString.indexOf(POWERPOINT_ATTRIBUTE_VALUE) > -1;

    return (
        htmlAttributes[PastePropertyNames.PROG_ID_NAME] == POWERPOINT_ATTRIBUTE_VALUE ||
        rawHtmlContainsPptAttribute
    );
};
