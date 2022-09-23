import * as React from 'react';
import { css } from '@fluentui/react/lib/Utilities';
import { Emoji } from '../type/Emoji';
import { EmojiPaneStyle } from '../type/EmojiPaneStyles';
import { IProcessedStyleSet, IStyleSet } from '@fluentui/react/lib/Styling';
/**
 * @internal
 * Emoji icon data
 */
export interface EmojiIconProps {
    id: string;
    emoji: Emoji;
    strings: Record<string, string>;
    classNames: IProcessedStyleSet<IStyleSet<EmojiPaneStyle>>;
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
    const { emoji, onClick, isSelected, onMouseOver, onFocus, strings, id, classNames } = props;
    const content = emoji.description && strings[emoji.description];

    return (
        <button
            id={id}
            role="option"
            className={css(classNames.emoji, {
                [classNames.emojiSelected]: isSelected,
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
