import * as React from 'react';
import EmojiList, { EmojiFabricIconCharacterMap, EmojiFamilyKeys } from '../utils/emojiList';
import { css } from '@fluentui/react/lib/Utilities';
import { FocusZone, FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { Icon } from '@fluentui/react/lib/Icon';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { Strings } from '../type/Strings';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';

export interface EmojiNavBarProps {
    onClick?: (selected: string) => void;
    currentSelected?: string;
    getTabId?: (selected: string) => string;
    className?: string;
    buttonClassName?: string;
    selectedButtonClassName?: string;
    iconClassName?: string;
    strings: Strings;
}

export default function EmojiNavBar(props: EmojiNavBarProps) {
    const {
        currentSelected,
        getTabId,
        strings = {},
        iconClassName,
        className,
        buttonClassName,
        selectedButtonClassName,
    } = props;
    const keys = Object.keys(EmojiList) as EmojiFamilyKeys[];
    const onFamilyClick = (key: string) => {
        if (props.onClick) {
            props.onClick(key);
        }
    };

    return (
        // for each emoji family key, create a button to use as nav bar
        <div className={css(classNames.navBar, className)} role="tablist">
            <FocusZone direction={FocusZoneDirection.horizontal}>
                {keys.map((key, index) => {
                    const selected = key === currentSelected;
                    const friendlyName = strings[key];
                    return (
                        <TooltipHost
                            hostClassName={classNames.navBarTooltip}
                            content={friendlyName}
                            key={key}>
                            <button
                                className={css(
                                    classNames.navBarButton,
                                    buttonClassName,
                                    'emoji-nav-bar-button',
                                    {
                                        [classNames.selected]: selected,
                                        [selectedButtonClassName]: selected,
                                    }
                                )}
                                key={key}
                                onClick={onFamilyClick.bind(this, key)}
                                id={getTabId(key)}
                                role="tab"
                                aria-selected={selected}
                                aria-label={friendlyName}
                                data-is-focusable="true"
                                aria-posinset={index + 1}
                                aria-setsize={keys.length}>
                                <Icon
                                    iconName={EmojiFabricIconCharacterMap[key]}
                                    className={iconClassName}
                                />
                            </button>
                        </TooltipHost>
                    );
                })}
            </FocusZone>
        </div>
    );
}

const classNames = mergeStyleSets({
    navBar: {
        position: 'absolute',
        top: '-0.5px',
        zIndex: 10,
    },
    navBarTooltip: {
        display: 'inline-block',
    },
    navBarButton: {
        height: '40px',
        width: '40px',
        border: '0',
        borderBottom: 'solid 1px',
        display: 'inline-block',
        padding: '0',
        margin: '0',

        '&::-moz-focus-inner': {
            border: 0,
        },

        '&:hover': {
            cursor: 'default',

            '@media screen and (-ms-high-contrast: active)': {
                backgroundColor: 'Highlight',
                color: 'HighlightText',
                '-ms-high-contrast-adjust': 'none',
            },

            selected: {
                '@media screen and (-ms-high-contrast: active)': {
                    border: '1px solid Highlight',
                    background: 'none',
                },
            },
        },
    },
    selected: {
        borderBottom: '2px solid',

        '@media screen and (-ms-high-contrast: active)': {
            borderBottomColor: 'Highlight',
        },
    },
});
