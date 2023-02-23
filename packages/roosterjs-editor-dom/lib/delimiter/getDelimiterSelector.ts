import { DelimiterClasses } from './DelimiterClasses';

/**
 * Get a selector string for specified delimiter type and id
 * @param type (Optional) Type of delimiter
 * @param id (Optional) Id of delimiter
 */
export default function getEntitySelector(type?: string, id?: string): string {
    const typeSelector = type ? `.${DelimiterClasses.DELIMITER_TYPE_PREFIX}${type}` : '';
    const idSelector = id ? `.${DelimiterClasses.DELIMITER_ID_PREFIX}${id}` : '';
    return '.' + DelimiterClasses.DELIMITER + typeSelector + idSelector;
}
