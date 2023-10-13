import * as React from 'react';
import { TooltipHost, TooltipOverflowMode } from '@fluentui/react/lib/Tooltip';
import type { Emoji } from '../type/Emoji';
import type { EmojiPaneStyle } from '../type/EmojiPaneStyles';
import type { IProcessedStyleSet, IStyleSet } from '@fluentui/react/lib/Styling';
/**
 * @internal
 * Emoji Status Bar data
 */
export interface EmojiStatusBarProps {
    emoji: Emoji;
    strings: Record<string, string>;
    hasResult: boolean;
    classNames: IProcessedStyleSet<IStyleSet<EmojiPaneStyle>>;
}

const NO_SUGGESTIONS = 'emjDNoSuggetions';

/**
 * @internal
 * Emoji status bar component
 */
export default function EmojiStatusBar(props: EmojiStatusBarProps) {
    const { emoji, strings, hasResult, classNames } = props;

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
    const description = emoji?.description ? strings[emoji.description] : '';

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
