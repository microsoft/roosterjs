import * as React from 'react';
import { Emoji } from '../type/Emoji';
import { memoizeFunction } from '@fluentui/react/lib/Utilities';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { Theme, useTheme } from '@fluentui/react/lib/Theme';
import { TooltipHost, TooltipOverflowMode } from '@fluentui/react/lib/Tooltip';
/**
 * @internal
 * Emoji Status Bar data
 */
export interface EmojiStatusBarProps {
    emoji: Emoji;
    strings: Record<string, string>;
    hasResult: boolean;
}

const NO_SUGGESTIONS = 'emjDNoSuggetions';

/**
 * @internal
 * Emoji status bar component
 */
export default function EmojiStatusBar(props: EmojiStatusBarProps) {
    const { emoji, strings, hasResult } = props;
    const theme = useTheme();
    const classNames = getNavBarClassNames(theme);
    if (!hasResult) {
        const noResultDescription = strings[NO_SUGGESTIONS];
        return (
            <div className={classNames.statusBar}>
                <div style={{ display: 'none' }} aria-live="polite">
                    {noResultDescription}
                </div>
                <div className={classNames.statusBarNoResultDetailsContainer}>
                    <TooltipHost
                        content={noResultDescription}
                        overflowMode={TooltipOverflowMode.Parent}>
                        <span role="alert">{noResultDescription}</span>
                    </TooltipHost>
                </div>
            </div>
        );
    }

    const icon = emoji ? emoji.codePoint : '';
    const description = emoji ? strings[emoji.description] : '';

    return (
        <div className={classNames.statusBar}>
            <i className={classNames.statusBarIcon} role="presentation" aria-hidden="true">
                {icon}
            </i>

            <div className={classNames.statusBarDetailsContainer}>
                <div className={classNames.statusBarDetails}>
                    <TooltipHost content={description} overflowMode={TooltipOverflowMode.Parent}>
                        {description}
                    </TooltipHost>
                </div>
            </div>
        </div>
    );
}

const getNavBarClassNames = memoizeFunction((theme: Theme) => {
    const palette = theme.palette;
    return mergeStyleSets({
        statusBar: {
            borderTop: 'solid 1px',
            height: '50px',
            overflow: 'hidden',
            position: 'relative',
            background: palette.themeDarker,
        },

        statusBarIcon: {
            padding: '4px',
            fontSize: '25px',
            display: 'inline-block',
            fontStyle: 'normal',
            fontWeight: 'normal',
            lineHeight: '40px',
        },

        statusBarDetailsContainer: {
            padding: '0 4px',
            lineHeight: '50px',
            position: 'absolute',
            display: 'inline-block',
            left: '40px',
            right: '0',
            top: '0',
        },

        statusBarDetails: {
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },

        statusBarNoResultDetailsContainer: {
            lineHeight: '50px',
            position: 'absolute',
            display: 'inline-block',
            top: '0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            left: '0',
            padding: '0 8px',
        },
    });
});
