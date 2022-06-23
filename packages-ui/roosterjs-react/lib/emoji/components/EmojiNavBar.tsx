import * as React from 'react';
import { css, memoizeFunction } from '@fluentui/react/lib/Utilities';
import { EmojiFabricIconCharacterMap, EmojiFamilyKeys, EmojiList } from '../utils/emojiList';
import { FocusZone, FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { Icon } from '@fluentui/react/lib/Icon';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { Strings } from '../type/Strings';
import { Theme, useTheme } from '@fluentui/react/lib/Theme';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';

/**
 * @internal
 * Emoji Nav Bar data
 */
export interface EmojiNavBarProps {
    onClick?: (selected: string) => void;
    currentSelected?: string;
    getTabId?: (selected: string) => string;
    strings: Strings;
}

/**
 * @internal
 */
export default function EmojiNavBar(props: EmojiNavBarProps) {
    const { currentSelected, getTabId, strings = {} } = props;
    const keys = Object.keys(EmojiList) as EmojiFamilyKeys[];
    const onFamilyClick = (key: string) => {
        if (props.onClick) {
            props.onClick(key);
        }
    };
    const theme = useTheme();
    const classNames = getNavBarStyle(theme);
    return (
        // for each emoji family key, create a button to use as nav bar
        <div className={classNames.navBar} role="tablist">
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
                                className={css(classNames.navBarButton, 'emoji-nav-bar-button', {
                                    [classNames.selected]: selected,
                                })}
                                key={key}
                                onClick={onFamilyClick.bind(this, key)}
                                id={getTabId(key)}
                                role="tab"
                                aria-selected={selected}
                                aria-label={friendlyName}
                                data-is-focusable="true"
                                aria-posinset={index + 1}
                                aria-setsize={keys.length}>
                                <Icon iconName={EmojiFabricIconCharacterMap[key]} />
                            </button>
                        </TooltipHost>
                    );
                })}
            </FocusZone>
        </div>
    );
}

const getNavBarStyle = memoizeFunction((theme: Theme) => {
    const pallete = theme.palette;
    return mergeStyleSets({
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
            background: pallete.themeDark,

            '&::-moz-focus-inner': {
                border: 0,
            },

            '&:hover': {
                cursor: 'default',
            },
        },
        selected: {
            borderBottom: '2px solid',
            borderBottomColor: pallete.themeLighter,
        },
    });
});
