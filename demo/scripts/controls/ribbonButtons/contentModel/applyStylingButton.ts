import { RibbonButton } from 'roosterjs-react';
import {
    ContentModelSegmentFormat,
    isContentModelEditor,
    setStyledDecorator,
    setStyledSegment,
} from 'roosterjs-content-model';
import { getObjectKeys } from 'roosterjs-editor-dom';

const applyStylingButtonKey = 'buttonNameApplyStyling';

interface Style {
    headingLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    format: ContentModelSegmentFormat;
}

const styles: Record<string, Style> = {
    heading1: {
        //margin & and what not, merely examples
        headingLevel: 1,
        format: {
            textColor: 'blue',
            fontSize: '3rem',
        },
    },
    heading2: {
        //margin & and what not, merely examples
        headingLevel: 2,
        format: {
            textColor: 'red',
            fontSize: '2rem',
        },
    },
    heading3: {
        //margin & and what not, merely examples
        headingLevel: 3,
        format: {
            textColor: 'green',
            fontSize: '1rem',
        },
    },
};

const styleMenuItems = getObjectKeys(styles).reduce((map, key) => {
    map[key] = key;
    return map;
}, <Record<string, string>>{});

//inside decorator(?what about quote) we want to set a new property called styles. If this property
//is different, we want to replace all format IN DECORATOR and block (paragraph)
//segments can be ignored as long as they are kept inline if needed

/**
 * @internal
 */
export const applyStylingButton: RibbonButton<typeof applyStylingButtonKey> = {
    key: applyStylingButtonKey,
    unlocalizedText: 'Apply Styling',
    iconName: 'Personalize',
    dropDownMenu: {
        items: styleMenuItems,
        getSelectedItemKey: formatState => formatState.styleName,
        allowLivePreview: true,
    },
    onClick: (editor, style) => {
        if (isContentModelEditor(editor)) {
            const { format, headingLevel } = styles[style];
            if (editor.getSelectionRangeEx().areAllCollapsed) {
                setStyledDecorator(editor, style, `h${headingLevel}`, format);
            } else {
                setStyledSegment(editor, style, format);
            }
        }
    },
};
