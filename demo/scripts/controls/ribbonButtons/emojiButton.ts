import { createEmojiPlugin, RibbonButton } from 'roosterjs-react';

/**
 * Key of localized strings of Emoji button
 */
export type EmojiButtonStringKey = 'buttonNameEmoji';

/**
 * "Emoji" button on the format ribbon
 */
export const emoji: RibbonButton<EmojiButtonStringKey> = {
    key: 'buttonNameEmoji',
    unlocalizedText: 'Emoji',
    iconName: 'Emoji',
    flipWhenRtl: true,
    onClick: () => {
        createEmojiPlugin().getName();
    },
};
