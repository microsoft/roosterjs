import * as React from 'react';
import { css } from '@fluentui/react/lib/Utilities';
import { EmojiFabricIconCharacterMap, EmojiFamilyKeys, EmojiList } from '../utils/emojiList';
import { EmojiPaneStyle } from '../type/EmojiPaneStyles';
import { FocusZone, FocusZoneDirection } from '@fluentui/react/lib/FocusZone';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { Icon } from '@fluentui/react/lib/Icon';
import { IProcessedStyleSet, IStyleSet } from '@fluentui/react/lib/Styling';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';

/**
 * @internal
 * Emoji Nav Bar data
 */
export interface EmojiNavBarProps {
    onClick?: (selected: string) => void;
    currentSelected?: string;
    getTabId?: (selected: EmojiFamilyKeys) => string;
    strings: Record<string, string>;
    classNames: IProcessedStyleSet<IStyleSet<EmojiPaneStyle>>;
}

/**
 * @internal
 */
export default function EmojiNavBar(props: EmojiNavBarProps) {
    const { currentSelected, getTabId, strings = {}, classNames } = props;
    const keys = getObjectKeys(EmojiList);
    const onFamilyClick = (key: string) => {
        if (props.onClick) {
            props.onClick(key);
        }
    };

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
                                className={css(classNames.navBarButton, {
                                    [classNames.selected]: selected,
                                })}
                                key={key}
                                onClick={onFamilyClick.bind(onclick, key)}
                                id={getTabId?.(key)}
                                role="tab"
                                aria-selected={selected}
                                aria-label={friendlyName}
                                data-is-focusable="true"
                                aria-posinset={index + 1}
                                tabIndex={0}
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
