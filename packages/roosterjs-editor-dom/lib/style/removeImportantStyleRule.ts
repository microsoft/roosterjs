import getStyles from './getStyles';
import setStyles from './setStyles';

/**
 * Removes the css important rule from some css properties
 * @param element The HTMLElement
 * @param styleProperties The css properties that important must be removed. Ex: ['background-color', 'background']
 */

export default function removeImportantStyleRule(element: HTMLElement, styleProperties: string[]) {
    const styles = getStyles(element);
    let modifiedStyles = 0;
    styleProperties.forEach(style => {
        if (styles[style]?.indexOf('!important') > -1) {
            const index = styles[style].indexOf('!');
            styles[style] = styles[style].substring(0, index);
            modifiedStyles++;
        }
    });
    if (modifiedStyles > 0) {
        setStyles(element, styles);
    }
}
