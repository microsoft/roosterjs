import * as React from 'react';
import { css } from '@fluentui/react/lib/Utilities';
import { Emoji } from '../type/Emoji';
import { getDataAndAriaProps } from '../utils/getAriaAndDataProp';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { Strings } from '../type/Strings';

export interface EmojiIconProps {
    id: string;
    emoji: Emoji;
    strings: Strings;
    onClick?: (e: React.MouseEvent<EventTarget>) => void;
    onMouseOver?: (e: React.MouseEvent<EventTarget>) => void;
    onFocus?: React.FocusEventHandler<HTMLButtonElement>;
    isSelected?: boolean;
    className?: string;
    selectedClassName?: string;
}

export default function EmojiIcon(props: EmojiIconProps) {
    const {
        emoji,
        onClick,
        isSelected,
        onMouseOver,
        className,
        onFocus,
        strings,
        id,
        selectedClassName,
    } = props;
    const content = strings[emoji.description];

    return (
        <button
            id={id}
            role="option"
            className={css(classNames.emoji, className, {
                [classNames.roosterEmojiSelected]: isSelected,
                [selectedClassName]: isSelected,
            })}
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

const classNames = mergeStyleSets({
    emoji: {
        fontSize: '18px',
        width: '40px',
        height: '40px',
        border: '0',
        backgroundColor: 'initial',

        '&::-moz-focus-inner': {
            border: '0',
        },
    },

    roosterEmojiPane: {
        padding: '1px',

        button: {
            outline: 0,
            position: 'relative',
            ':focus::after': {
                content: '',
                position: 'absolute',
                left: '0px',
                top: '0px',
                bottom: '0px',
                right: '0px',
                zIndex: 1,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgb(255, 255, 255)',
                borderImage: 'initial',
                outline: 'rgb(102, 102, 102) solid 1px',
            },
        },
    },

    roosterEmojiSelected: {
        '@media screen and (-ms-high-contrast: active)': {
            backgroundColor: 'Highlight',
            color: 'HighlightText',
            '-ms-high-contrast-adjust': 'none',
        },
    },
});
