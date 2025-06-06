import { getObjectKeys } from 'roosterjs-content-model-dom';
import type { WordMetadata } from './WordMetadata';
import type { BeforePasteEvent } from 'roosterjs-content-model-types';

const FORMATING_REGEX = /[\n\t'{}"]+/g;
const STYLE_TAG = '<style';
const STYLE_TAG_END = '</style>';
const nonWordCharacterRegex = /\W/;

function extractStyleTagsFromHtml(htmlContent: string): string[] {
    const styles: string[] = [];

    let { styleIndex, styleEndIndex } = extractHtmlIndexes(htmlContent);
    while (styleIndex >= 0 && styleEndIndex >= 0) {
        const styleContent = htmlContent
            .substring(styleIndex + STYLE_TAG.length, styleEndIndex)
            .trim();
        styles.push(styleContent);
        ({ styleIndex, styleEndIndex } = extractHtmlIndexes(htmlContent, styleEndIndex + 1));
    }
    return styles;
}

function extractHtmlIndexes(html: string, startIndex: number = 0) {
    const htmlLowercase = html.toLowerCase();
    let styleIndex = htmlLowercase.indexOf(STYLE_TAG, startIndex);
    let currentIndex = styleIndex + STYLE_TAG.length;
    let nextChar = html.substring(currentIndex, currentIndex + 1);

    while (!nonWordCharacterRegex.test(nextChar) && styleIndex > -1) {
        styleIndex = htmlLowercase.indexOf(STYLE_TAG, styleIndex + 1);
        currentIndex = styleIndex + STYLE_TAG.length;
        nextChar = html.substring(currentIndex, currentIndex + 1);
    }

    const styleEndIndex = htmlLowercase.indexOf(STYLE_TAG_END, startIndex);
    return { styleIndex, styleEndIndex };
}

/**
 * @internal
 * Word Desktop content has a style tag that contains data for the lists.
 * So this function query that style tag and extract the data from the innerHTML, since it is not available from the HTMLStyleElement.sheet.
 *
 * The format is like:
 * example of style element content
 * @list l0:level1 {
 * styleTag: styleValue;
 * ...
 * }
 *
 * To extract the data:
 * 1. Substring the value of the style selector, using @ index and { index
 * 2. Substring the value of the style rules by Substring the content between { and }
 * 3. Split the value of the rules using ; as separator { styleTag: styleValue; styleTag1: StyleValue1 } = ['styleTag: styleValue',  'styleTag1: StyleValue1']
 * 4. Split the value of the rule  using : as separator: styleTag: styleValue = [styleTag, styleValue]
 * 5. Save data in record and only use the required information.
 *
 */
export function getStyleMetadata(ev: BeforePasteEvent) {
    const metadataMap: Map<string, WordMetadata> = new Map();
    const headStyles = extractStyleTagsFromHtml(ev.htmlBefore || ev.clipboardData.rawHtml || '');

    headStyles.forEach(text => {
        let index = 0;
        while (index >= 0) {
            const indexAt = text.indexOf('@', index + 1);
            const indexCurlyEnd = text.indexOf('}', indexAt);
            const indexCurlyStart = text.indexOf('{', indexAt);
            index = indexAt;

            // 1.
            const metadataName = text
                .substring(indexAt + 1, indexCurlyStart)
                .replace(FORMATING_REGEX, '')
                .replace('list', '')
                .trimRight()
                .trimLeft();

            // 2.
            const dataName = text
                .substring(indexCurlyStart, indexCurlyEnd + 1)
                .trimLeft()
                .trimRight();
            const record: Record<string, string> = {};

            // 3.
            const entries = dataName.split(';');
            entries.forEach(entry => {
                // 4.
                const [key, value] = entry.split(':');
                if (key && value) {
                    const formatedKey = key.replace(FORMATING_REGEX, '').trimRight().trimLeft();
                    const formatedValue = value.replace(FORMATING_REGEX, '').trimRight().trimLeft();
                    // 5.
                    record[formatedKey] = formatedValue;
                }
            });

            const data: WordMetadata = {
                'mso-level-number-format': record['mso-level-number-format'],
                'mso-level-start-at': record['mso-level-start-at'] || '1',
                'mso-level-text': record['mso-level-text'],
            };
            if (getObjectKeys(data).some(key => !!data[key])) {
                metadataMap.set(metadataName, data);
            }
        }
    });

    return metadataMap;
}
