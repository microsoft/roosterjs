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
import { IProcessedStyleSet, IStyleSet } from '@fluentui/react/lib/Styling';
import { ITextField, TextField } from '@fluentui/react/lib/TextField';
import { searchEmojis } from '../utils/searchEmojis';

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
    classNames?: IProcessedStyleSet<IStyleSet<EmojiPaneStyle>>;
    onSelect: (emoji: Emoji, wordBeforeCursor: string) => void;
    baseId: number;
    strings: Record<string, string>;
}

/**
 * @internal
 * EmojiPane Style classes
 */
interface EmojiPaneStyle {
    quickPicker: IStyleSet;
    tooltip: IStyleSet;
    emojiTextInput: IStyleSet;
    partialList: IStyleSet;
    fullListContent: IStyleSet;
    fullListBody: IStyleSet;
    fullList: IStyleSet;
    roosterEmojiPane: IStyleSet;
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
    navigate: (change: number, direction: EmojiPaneNavigateDirection) => number;
    getEmojiElementIdByIndex: (index: number) => string;
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

    const [state, setState] = React.useState<EmojiPaneState>({
        index: 0,
        mode: EmojiPaneMode.Quick,
        currentEmojiList: CommonEmojis,
        currentFamily: EmojiFamilyKeys.People,
        search: ':',
        searchInBox: '',
    });

    const listId = `EmojiPane${props.baseId}`;

    const navigate = (
        change: number,
        direction: EmojiPaneNavigateDirection = EmojiPaneNavigateDirection.Horizontal
    ): number => {
        const { index, currentEmojiList } = state;
        if (direction === EmojiPaneNavigateDirection.Vertical && index !== -1) {
            change *= EmojisPerRow;
        }

        const newIndex = index + change;
        const length = currentEmojiList.length;
        if (newIndex >= 0 && newIndex < length) {
            setState({ ...state, index: newIndex });
            return newIndex;
        }

        return -1;
    };

    const normalizeSearchText = (text: string, colonIncluded: boolean): string => {
        if (text == null) {
            return '';
        }

        if (colonIncluded) {
            text = text.substr(1);
        }
        return text.trim();
    };

    const getEmojiElementIdByIndex = (index: number): string => {
        const { currentEmojiList } = state;
        const emoji = currentEmojiList[index];
        if (emoji) {
            return getEmojiIconId(emoji);
        }

        return null;
    };

    const getSelectedEmoji = (): Emoji => {
        const { currentEmojiList, index } = state;
        return currentEmojiList[index];
    };

    const showFullPicker = (fullSearchText: string): void => {
        const normalizedSearchValue = normalizeSearchText(fullSearchText, true);
        const newMode =
            normalizedSearchValue.length === 0 ? EmojiPaneMode.Full : EmojiPaneMode.Partial;
        setState({
            ...state,
            index: newMode === EmojiPaneMode.Full ? -1 : 0,
            mode: newMode,
            currentEmojiList: getSearchResult(normalizedSearchValue, newMode),
            search: fullSearchText,
            searchInBox: normalizedSearchValue,
        });
    };

    const setSearch = (value: string): void => {
        const normalizedSearchValue = normalizeSearchText(value, false);
        setState({
            ...state,
            index: 0,
            currentEmojiList: getSearchResult(normalizedSearchValue, state.mode),
            search: value,
        });
    };

    const getListId = (): string => {
        return listId;
    };

    const getSearchResult = (searchValue: string, mode: EmojiPaneMode): Emoji[] => {
        const isQuickMode = mode === EmojiPaneMode.Quick;
        if (!searchValue) {
            return isQuickMode ? state.currentEmojiList : EmojiList[state.currentFamily];
        }

        const emojiList = searchEmojis(searchValue, props.strings);
        return isQuickMode ? emojiList.slice(0, 5).concat([MoreEmoji]) : emojiList;
    };

    const getEmojiIconId = (emoji: Emoji): string => {
        return emoji ? `${listId}-${emoji.key}` : undefined;
    };

    React.useImperativeHandle(
        ref,
        () => ({
            navigate,
            getEmojiElementIdByIndex,
            showFullPicker,
            getSearchResult,
            setSearch,
            getListId,
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
            getListId,
            getSelectedEmoji,
            normalizeSearchText,
        ]
    );

    const renderQuickPicker = (): JSX.Element => {
        const { strings, classNames } = props;
        const selectedEmoji = getSelectedEmoji();
        const target = selectedEmoji ? `#${getEmojiIconId(selectedEmoji)}` : undefined;
        const content = selectedEmoji ? strings[selectedEmoji.description] : undefined;

        // note: we're using a callout since TooltipHost does not support manual trigger, and we need to show the tooltip since quick picker is shown
        // as an autocomplete menu (false focus based on transferring navigation keyboard event)
        return (
            <div id={listId} role="listbox">
                {renderCurrentEmojiIcons()}
                <div
                    id={listId}
                    role="listbox"
                    className={css(
                        classNames.quickPicker,
                        classNames.roosterEmojiPane,
                        'quick-picker'
                    )}>
                    <Callout
                        {...TooltipCalloutProps}
                        role="tooltip"
                        target={target}
                        hidden={!content}
                        className={classNames.tooltip}>
                        {content}
                    </Callout>
                </div>
            </div>
        );
    };

    const renderFullPicker = (): JSX.Element => {
        const { searchDisabled, searchBoxString, classNames } = props;
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
                        componentRef={searchRefCallback}
                        value={state.searchInBox}
                        onChange={onSearchChange}
                        inputClassName={classNames.emojiTextInput}
                        onKeyPress={onSearchKeyPress}
                        onKeyDown={onSearchKeyDown}
                        onFocus={onSearchFocus}
                        placeholder={getLocalizedString(
                            searchBoxString,
                            'searchPlaceholder',
                            'Search...'
                        )}
                        ariaLabel={getLocalizedString(
                            searchBoxString,
                            'searchInputAriaLabel',
                            'Search...'
                        )}
                        {...autoCompleteAttributes}
                    />
                )}
                {state.mode === EmojiPaneMode.Full ? renderFullList() : renderPartialList()}
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

        const { index, currentEmojiList } = state;

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
            setState({ ...state, index: 0 });
            emojiBody.scrollTop = 0;
            return;
        }
        if (e.which === KeyCodes.end) {
            setState({ ...state, index: state.currentEmojiList.length - 1 });
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
                state.mode === EmojiPaneMode.Full
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

    const renderCurrentEmojiIcons = (): JSX.Element[] => {
        const { strings } = props;
        const { currentEmojiList } = state;

        return currentEmojiList.map((emoji, index) => (
            <EmojiIcon
                strings={strings}
                id={getEmojiIconId(emoji)}
                key={emoji.key}
                onMouseOver={() => setState({ ...state, index })}
                onFocus={() => setState({ ...state, index })}
                emoji={emoji}
                isSelected={index === state.index}
                onClick={e => onSelect(e, emoji)}
                aria-posinset={index + 1}
                aria-setsize={currentEmojiList.length}
            />
        ));
    };

    const renderPartialList = (): JSX.Element => {
        const { strings, hideStatusBar, statusBarProps, classNames } = props;
        const { currentEmojiList } = state;
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
                        {renderCurrentEmojiIcons()}
                    </FocusZone>
                </div>
                {!hideStatusBar && (
                    <EmojiStatusBar
                        strings={strings}
                        {...statusBarProps}
                        hasResult={hasResult}
                        emoji={getSelectedEmoji()}
                    />
                )}
            </div>
        );
    };

    const renderFullList = (): JSX.Element => {
        const { strings, hideStatusBar, navBarProps, statusBarProps, classNames } = props;
        const { currentEmojiList } = state;
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
                        currentSelected={state.currentFamily}
                        getTabId={getTabId}
                    />
                    <div role="tabpanel" aria-labelledby={getTabId(state.currentFamily)}>
                        <div>
                            <FocusZone
                                id={listId}
                                role="listbox"
                                className={classNames.fullListContent}
                                ref={focusZoneRefCallback}>
                                {renderCurrentEmojiIcons()}
                            </FocusZone>
                        </div>
                    </div>
                </div>

                {!hideStatusBar && (
                    <EmojiStatusBar
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

        setState({ ...state, currentEmojiList: EmojiList[currentFamily], currentFamily });
    };

    const getTabId = (itemKey: EmojiFamilyKeys): string => {
        return `family_${itemKey}_${props.baseId}`;
    };

    const searchRefCallback = (ref: ITextField): void => {
        searchBox = ref;
        if (searchBox) {
            searchBox.focus();
            searchBox.setSelectionStart(searchBox.value.length);
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

    const onSearchChange = (e: any, newValue: string): void => {
        const normalizedSearchValue = normalizeSearchText(newValue, false);
        const newMode =
            normalizedSearchValue.length === 0 ? EmojiPaneMode.Full : EmojiPaneMode.Partial;
        setState({
            ...state,
            index: newMode === EmojiPaneMode.Full ? -1 : 0,
            currentEmojiList: getSearchResult(normalizedSearchValue, state.mode),
            searchInBox: newValue,
            mode: newMode,
        });
    };

    const onSelect = (
        e: React.MouseEvent<EventTarget> | React.KeyboardEvent<HTMLInputElement>,
        emoji: Emoji
    ): void => {
        e.stopPropagation();
        e.preventDefault();
        if (props.onSelect) {
            props.onSelect(emoji, state.search);
        }
    };

    return <>{state.mode === EmojiPaneMode.Quick ? renderQuickPicker() : renderFullPicker()}</>;
});

/**
 * @internal
 * Emoji pane component
 */
export function showEmojiPane(
    onSelect: (emoji: Emoji, wordBeforeCursor: string) => void,
    strings: Record<string, string>,
    classNames: IProcessedStyleSet<IStyleSet<EmojiPaneStyle>>,
    paneRef: (ref: EmojiPane) => void,
    baseId: number,
    searchBoxString?: LocalizedStrings<EmojiStringKeys>
) {
    return (
        <EmojiPane
            ref={paneRef}
            baseId={baseId}
            searchBoxString={searchBoxString}
            strings={strings}
            classNames={classNames}
            onSelect={onSelect}></EmojiPane>
    );
}
