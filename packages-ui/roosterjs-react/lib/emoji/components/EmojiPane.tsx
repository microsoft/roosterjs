import * as React from 'react';
import EmojiIcon, { EmojiIconProps } from './EmojiIcon';
import EmojiNavBar, { EmojiNavBarProps } from './EmojiNavBar';
import EmojiStatusBar, { EmojiStatusBarProps } from './EmojiStatusBar';
import { Callout, DirectionalHint, ICalloutProps } from '@fluentui/react/lib/Callout';
import { CommonEmojis, EmojiFamilyKeys, EmojiList, MoreEmoji } from '../utils/emojiList';
import { css, KeyCodes } from '@fluentui/react/lib/Utilities';
import { Emoji } from '../type/Emoji';
import { EmojiStringKeys } from '../type/EmojiStringKeys';
import { FocusZone } from '@fluentui/react/lib/FocusZone';
import { getLocalizedString, LocalizedStrings } from '../../common/index';
import { ITextField, TextField } from '@fluentui/react/lib/TextField';
import { memoizeFunction } from '@fluentui/react/lib/Utilities';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { searchEmojis } from '../utils/searchEmojis';
import { Theme, useTheme } from '@fluentui/react/lib/Theme';

// "When a div contains an element that is bigger (either taller or wider) than the parent and has the property
// overflow-x or overflow-y set to any value, then it can receive the focus."
// https://bugzilla.mozilla.org/show_bug.cgi?id=1069739
const TabIndexForFirefoxBug = -1;
const EmojisPerRow = 7;
const EmojiVisibleRowCount = 5;
const EmojiVisibleWithoutNavBarRowCount = 6;
const EmojiHeightPx = 40;
const VerticalDirectionKeys: number[] = [KeyCodes.up, KeyCodes.down];
const DirectionKeys: number[] = [
    KeyCodes.left,
    KeyCodes.right,
    KeyCodes.up,
    KeyCodes.down,
    KeyCodes.home,
    KeyCodes.end,
];

const TooltipCalloutProps: ICalloutProps = {
    isBeakVisible: true,
    beakWidth: 16,
    gapSpace: 0,
    setInitialFocus: true,
    doNotLayer: false,
    directionalHint: DirectionalHint.bottomCenter,
};

/**
 * @internal
 * Types of emoji pane size
 */
export const enum EmojiPaneMode {
    Quick,
    Partial,
    Full,
}

/**
 * @internal
 * Types of emoji Navigation direction
 */
export const enum EmojiPaneNavigateDirection {
    Horizontal,
    Vertical,
}

/**
 * @internal
 * Emoji Pane data
 */
export interface EmojiPaneState {
    index: number;
    mode: EmojiPaneMode;
    currentEmojiList: Emoji[];
    currentFamily: EmojiFamilyKeys;
    search: string;
    searchInBox: string;
}

/**
 * @internal
 * Emoji Pane customizable data
 */
export interface EmojiPaneProps {
    searchDisabled?: boolean;
    hideStatusBar?: boolean;
    navBarProps?: Partial<EmojiNavBarProps>;
    statusBarProps?: Partial<EmojiStatusBarProps>;
    emojiIconProps?: Partial<EmojiIconProps>;
    searchBoxString?: LocalizedStrings<EmojiStringKeys>;
    onSelect: (emoji: Emoji, wordBeforeCursor: string) => void;
    baseId: number;
    strings: Record<string, string>;
}

const AriaAttributes = {
    ActiveDescendant: 'aria-activedescendant',
    AutoComplete: 'aria-autocomplete',
    Controls: 'aria-controls',
    Expanded: 'aria-expanded',
    HasPopup: 'aria-haspopup',
    Owns: 'aria-owns',
    Pressed: 'aria-pressed',
};

/**
 * @internal
 * Emoji pane component functions
 */
export interface EmojiPane {
    navigate: (change: number, direction?: EmojiPaneNavigateDirection) => number;
    getEmojiElementIdByIndex: (index: number) => string | null;
    getSelectedEmoji: () => Emoji;
    showFullPicker: (fullSearchText: string) => void;
    setSearch: (value: string) => void;
    normalizeSearchText: (text: string, colonIncluded: boolean) => string;
    getSearchResult: (searchValue: string, mode: EmojiPaneMode) => Emoji[];
    getEmojiIconId: (emoji: Emoji) => string;
}

const EmojiPane = React.forwardRef(function EmojiPaneFunc(
    props: EmojiPaneProps,
    ref: React.Ref<EmojiPane>
) {
    let searchBox: ITextField;
    let emojiBody: HTMLElement;
    let input: HTMLInputElement;

    const [index, setIndex] = React.useState<number>(0);
    const [mode, setMode] = React.useState<EmojiPaneMode>(EmojiPaneMode.Quick);
    const [currentEmojiList, setCurrentEmojiList] = React.useState<Emoji[]>(CommonEmojis);
    const [currentFamily, setCurrentFamily] = React.useState<EmojiFamilyKeys>(
        EmojiFamilyKeys.People
    );
    const [search, setSearchString] = React.useState<string>(':');
    const [searchInBox, setSearchInBox] = React.useState<string>('');

    const theme = useTheme();
    const classNames = getEmojiPaneClassName(theme);
    const listId = `EmojiPane${props.baseId}`;

    const navigate = React.useCallback(
        (change: number, direction?: EmojiPaneNavigateDirection): number => {
            if (!direction) {
                direction = EmojiPaneNavigateDirection.Horizontal;
            }

            if (direction === EmojiPaneNavigateDirection.Vertical && index !== -1) {
                change *= EmojisPerRow;
            }

            const newIndex = index + change;
            const length = currentEmojiList.length;
            if (newIndex >= 0 && newIndex < length) {
                setIndex(newIndex);
                return newIndex;
            }

            return -1;
        },
        [index]
    );

    const normalizeSearchText = React.useCallback(
        (text: string, colonIncluded: boolean): string => {
            if (text == null) {
                return '';
            }

            if (colonIncluded) {
                text = text.substr(1);
            }
            return text.trim();
        },
        []
    );

    const getEmojiElementIdByIndex = React.useCallback(
        (index: number): string | null => {
            const emoji = currentEmojiList[index];
            if (emoji) {
                return getEmojiIconId(emoji);
            }

            return null;
        },
        [currentEmojiList]
    );

    const getSelectedEmoji = React.useCallback((): Emoji => {
        return currentEmojiList[index];
    }, [currentEmojiList, index]);

    const showFullPicker = React.useCallback(
        (fullSearchText: string): void => {
            const normalizedSearchValue = normalizeSearchText(fullSearchText, true);
            const newMode =
                normalizedSearchValue.length === 0 ? EmojiPaneMode.Full : EmojiPaneMode.Partial;
            setIndex(newMode === EmojiPaneMode.Full ? -1 : 0);
            setMode(newMode);
            setCurrentEmojiList(getSearchResult(normalizedSearchValue, newMode));
            setSearchString(fullSearchText);
            setSearchInBox(normalizedSearchValue);
        },
        [mode]
    );

    const setSearch = React.useCallback(
        (value: string): void => {
            const normalizedSearchValue = normalizeSearchText(value, false);
            setIndex(0);
            setCurrentEmojiList(getSearchResult(normalizedSearchValue, mode));
            setSearchString(value);
        },
        [index, search, currentEmojiList]
    );

    const getSearchResult = React.useCallback(
        (searchValue: string, mode: EmojiPaneMode): Emoji[] => {
            const isQuickMode = mode === EmojiPaneMode.Quick;
            if (!searchValue) {
                return isQuickMode ? currentEmojiList : EmojiList[currentFamily];
            }

            const emojiList = searchEmojis(searchValue, props.strings);
            return isQuickMode ? emojiList.slice(0, 5).concat([MoreEmoji]) : emojiList;
        },
        [mode, currentFamily, currentEmojiList]
    );

    const getEmojiIconId = React.useCallback((emoji: Emoji) => `${listId}-${emoji.key}`, [listId]);

    React.useImperativeHandle(
        ref,
        () => ({
            navigate,
            getEmojiElementIdByIndex,
            showFullPicker,
            getSearchResult,
            setSearch,
            getSelectedEmoji,
            normalizeSearchText,
            getEmojiIconId,
        }),
        [
            navigate,
            getEmojiElementIdByIndex,
            showFullPicker,
            getSearchResult,
            setSearch,
            getEmojiIconId,
            getSelectedEmoji,
            normalizeSearchText,
        ]
    );

    const renderQuickPicker = (
        props: EmojiPaneProps,
        index: number,
        currentEmojiList: Emoji[]
    ): JSX.Element => {
        const { strings } = props;
        const selectedEmoji = getSelectedEmoji();
        const target = selectedEmoji ? `#${getEmojiIconId(selectedEmoji)}` : undefined;
        const content = selectedEmoji?.description ? strings[selectedEmoji.description] : undefined;
        const emojiList = renderCurrentEmojiIcons(index, currentEmojiList);
        // note: we're using a callout since TooltipHost does not support manual trigger, and we need to show the tooltip since quick picker is shown
        // as an autocomplete menu (false focus based on transferring navigation keyboard event)
        return (
            <div id={listId} role="listbox">
                {emojiList}
                <div
                    id={listId}
                    role="listbox"
                    className={css(classNames.quickPicker, classNames.roosterEmojiPane)}>
                    <Callout
                        {...TooltipCalloutProps}
                        role="tooltip"
                        target={target}
                        hidden={!content || !emojiList}
                        className={classNames.tooltip}>
                        {content}
                    </Callout>
                </div>
            </div>
        );
    };

    const renderFullPicker = (
        props: EmojiPaneProps,
        index: number,
        searchInBox: string,
        currentFamily: EmojiFamilyKeys,
        currentEmojiList: Emoji[]
    ): JSX.Element => {
        const { searchDisabled, searchBoxString } = props;
        const emojiId = getEmojiIconId(getSelectedEmoji());
        const autoCompleteAttributes = {
            [AriaAttributes.AutoComplete]: 'list',
            [AriaAttributes.Expanded]: 'true',
            [AriaAttributes.HasPopup]: 'listbox',
            [AriaAttributes.Owns]: listId,
        };
        if (emojiId) {
            autoCompleteAttributes[AriaAttributes.ActiveDescendant] = emojiId;
        }

        return (
            <div className={classNames.roosterEmojiPane}>
                {!searchDisabled && (
                    <TextField
                        role="combobox"
                        componentRef={ref => searchRefCallback(ref)}
                        value={searchInBox}
                        onChange={onSearchChange}
                        inputClassName={classNames.emojiTextInput}
                        onKeyPress={onSearchKeyPress}
                        onKeyDown={onSearchKeyDown}
                        onFocus={onSearchFocus}
                        placeholder={getLocalizedString(
                            searchBoxString,
                            'emojiSearchPlaceholder',
                            'Search...'
                        )}
                        ariaLabel={getLocalizedString(
                            searchBoxString,
                            'emojiSearchInputAriaLabel',
                            'Search...'
                        )}
                        {...autoCompleteAttributes}
                    />
                )}
                {mode === EmojiPaneMode.Full
                    ? renderFullList(props, index, currentFamily, currentEmojiList)
                    : renderPartialList(props, index, currentEmojiList)}
            </div>
        );
    };

    const onSearchFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
        input = e.target as HTMLInputElement;
    };

    const onSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (!e || e.which !== KeyCodes.enter) {
            return;
        }

        if (index >= 0 && currentEmojiList && currentEmojiList.length > 0) {
            onSelect(e, currentEmojiList[index]);
        }
    };

    const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (!e || DirectionKeys.indexOf(e.which) < 0) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (e.which === KeyCodes.home) {
            setIndex(0);
            emojiBody.scrollTop = 0;
            return;
        }
        if (e.which === KeyCodes.end) {
            setIndex(currentEmojiList.length - 1);
            emojiBody.scrollTop = emojiBody.scrollHeight; // scrollHeight will be larger than max
            return;
        }

        const direction =
            VerticalDirectionKeys.indexOf(e.which) < 0
                ? EmojiPaneNavigateDirection.Horizontal
                : EmojiPaneNavigateDirection.Vertical;
        const newIndex = navigate(
            e.which === KeyCodes.left || e.which === KeyCodes.up ? -1 : 1,
            direction
        );
        if (newIndex > -1) {
            const visibleRowCount =
                mode === EmojiPaneMode.Full
                    ? EmojiVisibleRowCount
                    : EmojiVisibleWithoutNavBarRowCount;
            const currentRow = Math.floor(newIndex / EmojisPerRow);
            const visibleTop = emojiBody.scrollTop;
            const visibleBottom = visibleTop + visibleRowCount * EmojiHeightPx;
            const currentRowTop = currentRow * EmojiHeightPx;
            const currentRowBottom = currentRowTop + EmojiHeightPx;
            if (visibleTop <= currentRowTop && visibleBottom >= currentRowBottom) {
                return; // row is visible, so exit
            }

            emojiBody.scrollTop = currentRow * EmojiHeightPx;
        }
    };

    const renderCurrentEmojiIcons = (index: number, currentEmojiList: Emoji[]): JSX.Element[] => {
        const { strings } = props;
        return currentEmojiList.map((emoji, emojiIndex) => (
            <EmojiIcon
                strings={strings}
                id={getEmojiIconId(emoji)}
                key={emoji.key}
                onMouseOver={() => setIndex(emojiIndex)}
                onFocus={() => setIndex(emojiIndex)}
                emoji={emoji}
                classNames={classNames}
                isSelected={index === emojiIndex}
                onClick={e => onSelect(e, emoji)}
                aria-posinset={index + 1}
                aria-setsize={currentEmojiList.length}
            />
        ));
    };

    const renderPartialList = (
        props: EmojiPaneProps,
        index: number,
        currentEmojiList: Emoji[]
    ): JSX.Element => {
        const { strings, hideStatusBar, statusBarProps } = props;
        const hasResult = currentEmojiList && currentEmojiList.length > 0;

        return (
            <div>
                <div
                    className={classNames.partialList}
                    data-is-scrollable={true}
                    tabIndex={TabIndexForFirefoxBug}
                    ref={onEmojiBodyRef}>
                    <FocusZone
                        id={listId}
                        role="listbox"
                        className={classNames.fullListContent}
                        ref={focusZoneRefCallback}>
                        {renderCurrentEmojiIcons(index, currentEmojiList)}
                    </FocusZone>
                </div>
                {!hideStatusBar && (
                    <EmojiStatusBar
                        classNames={classNames}
                        strings={strings}
                        {...statusBarProps}
                        hasResult={hasResult}
                        emoji={getSelectedEmoji()}
                    />
                )}
            </div>
        );
    };

    const renderFullList = (
        props: EmojiPaneProps,
        index: number,
        currentFamily: EmojiFamilyKeys,
        currentEmojiList: Emoji[]
    ): JSX.Element => {
        const { strings, hideStatusBar, navBarProps, statusBarProps } = props;

        const hasResult = currentEmojiList && currentEmojiList.length > 0;

        return (
            <div className={classNames.fullList}>
                <div
                    className={classNames.fullListBody}
                    data-is-scrollable={true}
                    tabIndex={TabIndexForFirefoxBug}
                    ref={onEmojiBodyRef}>
                    <EmojiNavBar
                        strings={strings}
                        {...navBarProps}
                        onClick={pivotClick}
                        currentSelected={currentFamily}
                        getTabId={getTabId}
                        classNames={classNames}
                    />
                    <div role="tabpanel" aria-labelledby={getTabId(currentFamily)}>
                        <div>
                            <FocusZone
                                id={listId}
                                role="listbox"
                                className={classNames.fullListContent}
                                ref={focusZoneRefCallback}>
                                {renderCurrentEmojiIcons(index, currentEmojiList)}
                            </FocusZone>
                        </div>
                    </div>
                </div>

                {!hideStatusBar && (
                    <EmojiStatusBar
                        classNames={classNames}
                        strings={strings}
                        {...statusBarProps}
                        hasResult={hasResult}
                        emoji={getSelectedEmoji()}
                    />
                )}
            </div>
        );
    };

    const onEmojiBodyRef = (ref: HTMLDivElement) => {
        emojiBody = ref;
    };

    const pivotClick = (selected: string): void => {
        const currentFamily = selected as EmojiFamilyKeys;
        setCurrentEmojiList(EmojiList[currentFamily]);
        setCurrentFamily(currentFamily);
    };

    const getTabId = (itemKey: EmojiFamilyKeys): string => {
        return `family_${itemKey}_${props.baseId}`;
    };

    const searchRefCallback = (ref: ITextField | null): void => {
        if (ref) {
            searchBox = ref;
            if (searchBox?.value) {
                searchBox.focus();
                searchBox.setSelectionStart(searchBox.value.length);
            }
        }
    };

    const focusZoneRefCallback = (ref: FocusZone): void => {
        if (props.searchDisabled && ref) {
            ref.focus();
        }

        if (input) {
            // make sure to announce the active descending after the focus zone containing the emojis is ready
            input.removeAttribute(AriaAttributes.ActiveDescendant);
            const emojiId = getEmojiIconId(getSelectedEmoji());
            // we need to delay so NVDA will announce the first selection
            if (emojiId) {
                setTimeout(() => input.setAttribute(AriaAttributes.ActiveDescendant, emojiId), 0);
            }
        }
    };

    const onSearchChange = (_: any, newValue?: string): void => {
        if (typeof newValue === 'string') {
            const normalizedSearchValue = normalizeSearchText(newValue, false);
            const newMode =
                normalizedSearchValue.length === 0 ? EmojiPaneMode.Full : EmojiPaneMode.Partial;
            setIndex(newMode === EmojiPaneMode.Full ? -1 : 0);
            setCurrentEmojiList(getSearchResult(normalizedSearchValue, mode));
            setSearchInBox(newValue);
            setMode(newMode);
        }
    };

    const onSelect = (
        e: React.MouseEvent<EventTarget> | React.KeyboardEvent<HTMLInputElement>,
        emoji: Emoji
    ): void => {
        e.stopPropagation();
        e.preventDefault();
        if (props.onSelect) {
            props.onSelect(emoji, search);
        }
    };

    const renderPane = (
        props: EmojiPaneProps,
        index: number,
        searchInBox: string,
        currentFamily: EmojiFamilyKeys,
        currentEmojiList: Emoji[]
    ) => {
        return mode === EmojiPaneMode.Quick
            ? renderQuickPicker(props, index, currentEmojiList)
            : renderFullPicker(props, index, searchInBox, currentFamily, currentEmojiList);
    };

    return <>{renderPane(props, index, searchInBox, currentFamily, currentEmojiList)}</>;
});

/**
 * @internal
 * Emoji pane component
 */
export function showEmojiPane(
    onSelect: (emoji: Emoji, wordBeforeCursor: string) => void,
    strings: Record<string, string>,
    paneRef: React.RefObject<EmojiPane>,
    baseId: number,
    searchBoxString?: LocalizedStrings<EmojiStringKeys>
) {
    return (
        <EmojiPane
            ref={paneRef}
            baseId={baseId}
            searchBoxString={searchBoxString}
            strings={strings}
            onSelect={onSelect}></EmojiPane>
    );
}

const calcMaxHeight = () => {
    const buttonHeight = 40;
    const rowsOfIcons = 6; // including family bar if shown
    const bottomPaddingForContent = 5;
    const maxHeightForContent = rowsOfIcons * buttonHeight + bottomPaddingForContent;
    return maxHeightForContent.toString() + 'px';
};

const calcPaneWidth = () => {
    const buttonWidth = 40;
    const pivotItemCount = 7;
    const paneHorizontalPadding = 1;
    const paneWidth = buttonWidth * pivotItemCount + 2 * paneHorizontalPadding;
    return paneWidth.toString() + 'px';
};

const getEmojiPaneClassName = memoizeFunction((theme: Theme) => {
    const palette = theme.palette;
    return mergeStyleSets({
        quickPicker: {
            overflowY: 'hidden',
            ':after': {
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

        tooltip: {
            padding: '8px',
        },

        emojiTextInput: {
            padding: '6px',
        },

        partialList: {
            maxHeight: calcMaxHeight(),
            overflow: 'hidden',
            overflowY: 'scroll',
        },

        fullListContent: {
            width: calcPaneWidth(),
        },

        fullListBody: {
            maxHeight: calcMaxHeight(),
            overflow: 'hidden',
            overflowY: 'scroll',
            height: calcMaxHeight(),
        },

        fullList: {
            position: 'relative',
        },

        roosterEmojiPane: {
            padding: '1px',
            background: palette.white,
        },

        emoji: {
            fontSize: '18px',
            width: '40px',
            height: '40px',
            border: '0',
            position: 'relative',
            background: palette.white,
            transition: 'backgorund 0.5s ease-in-out',
        },

        emojiSelected: {
            background: palette.neutralLight,
        },

        navBar: {
            top: '-1px',
            zIndex: 10,
            position: 'sticky',
        },

        navBarTooltip: {
            display: 'inline-block',
        },

        navBarButton: {
            height: '40px',
            width: '40px',
            border: '0',
            borderBottom: 'solid 1px',
            padding: 0,
            marginBottom: 0,
            display: 'inline-block',
            color: palette.themeDark,
            background: palette.white,
            '&:hover': {
                cursor: 'default',
            },
        },

        selected: {
            borderBottom: '2px solid',
            borderBottomColor: palette.themeDark,
        },

        statusBar: {
            borderTop: 'solid 1px',
            height: '50px',
            overflow: 'hidden',
            position: 'relative',
            background: palette.white,
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
