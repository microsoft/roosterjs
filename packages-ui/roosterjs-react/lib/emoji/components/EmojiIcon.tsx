import * as React from 'react';
import { Emoji } from '../type/Emoji';
import { memoizeFunction } from '@fluentui/react/lib/Utilities';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { Strings } from '../type/Strings';
import { Theme, useTheme } from '@fluentui/react/lib/Theme';

/**
 * @internal
 * Emoji icon data
 */
export interface EmojiIconProps {
    id: string;
    emoji: Emoji;
    strings: Strings;
    onClick?: (e: React.MouseEvent<EventTarget>) => void;
    onMouseOver?: (e: React.MouseEvent<EventTarget>) => void;
    onFocus?: React.FocusEventHandler<HTMLButtonElement>;
    isSelected?: boolean;
}

/**
 * @internal
 * Emoji icon component
 */
export default function EmojiIcon(props: EmojiIconProps) {
    const { emoji, onClick, isSelected, onMouseOver, onFocus, strings, id } = props;
    const content = strings[emoji.description];
    const theme = useTheme();
    const classNames = getEmojiIconClassNames(theme);
    return (
        <button
            id={id}
            role="option"
            className={classNames.emoji}
            onClick={onClick}
            onMouseOver={onMouseOver}
            onFocus={onFocus}
            data-is-focusable={true}
            aria-label={content}
            aria-selected={isSelected}
            {...getDataAndAriaProps(props)}>
            {emoji.codePoint || '…'}
        </button>
    );
}

const getEmojiIconClassNames = memoizeFunction((theme: Theme) => {
    const palette = theme.palette;

    return mergeStyleSets({
        emoji: {
            fontSize: '18px',
            width: '40px',
            height: '40px',
            border: '0',
            outline: 0,
            position: 'relative',
            background: palette.themeLight,
            transition: 'backgorund 0.5s ease-in-out',
            ':hover': {
                background: palette.themeLighter,
            },
            '&::-moz-focus-inner': {
                border: '0',
            },
        },
    });
});

function reduceObject<T>(object: any, callback: (key: string) => boolean): T {
    if (!object) {
        return object;
    }

    return Object.keys(object).reduce((result: any, key: string) => {
        if (callback(key)) {
            result[key] = object[key];
        }
        return result;
    }, {} as T);
}

function getDataAndAriaProps<T>(props: EmojiIconProps): T {
    return reduceObject(
        props || {},
        propName => propName.indexOf('data-') === 0 || propName.indexOf('aria-') === 0
    );
}
