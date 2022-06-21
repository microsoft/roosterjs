import * as React from 'react';
import EmojiIcon, { EmojiIconProps } from './EmojiIcon';
import EmojiList, { CommonEmojis, EmojiFamilyKeys, MoreEmoji } from '../utils/emojiList';
import EmojiNavBar, { EmojiNavBarProps } from './EmojiNavBar';
import EmojiStatusBar, { EmojiStatusBarProps } from './EmojiStatusBar';
import { AriaAttributes } from '../type/AriaAttributes';
import { Callout, DirectionalHint, ICalloutProps } from '@fluentui/react/lib/Callout';
import { css, KeyCodes } from '@fluentui/react/lib/Utilities';
import { Emoji } from '../type/Emoji';
import { FocusZone } from '@fluentui/react/lib/FocusZone';
import { ITextField, TextField } from '@fluentui/react/lib/TextField';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { NullFunction } from '../type/NullFunction';
import { searchEmojis } from '../utils/searchEmojis';
import { Strings } from '../type/Strings';

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

export const enum EmojiPaneMode {
    Quick,
    Partial,
    Full,
}

export const enum EmojiPaneNavigateDirection {
    Horizontal,
    Vertical,
}

export interface EmojiPaneState {
    index: number;
    mode: EmojiPaneMode;
    currentEmojiList: Emoji[];
    currentFamily: EmojiFamilyKeys;
    search: string;
    searchInBox: string;
}

export interface EmojiPaneProps {
    quickPickerClassName?: string;
    fullPickerClassName?: string;
    fullListClassName?: string;
    fullListContentClassName?: string;
    partialListClassName?: string;
    tooltipClassName?: string;
    searchInputAriaLabel?: string;
    searchPlaceholder?: string;
    onLayoutChanged?: () => void;
    onModeChanged?: (newMode: EmojiPaneMode, previousMode: EmojiPaneMode) => void;
    navBarProps?: Partial<EmojiNavBarProps>;
    statusBarProps?: Partial<EmojiStatusBarProps>;
    emojiIconProps?: Partial<EmojiIconProps>;
    searchDisabled?: boolean;
    hideStatusBar?: boolean;
}

export interface InternalEmojiPaneProps extends EmojiPaneProps {
    onSelect: (emoji: Emoji, wordBeforeCursor: string) => void;
    strings: Strings;
    onLayoutChange?: () => void;
}

export default class EmojiPane extends React.PureComponent<InternalEmojiPaneProps, EmojiPaneState> {
    private static IdCounter = 0;
    private baseId = EmojiPane.IdCounter++;
    private searchBox: ITextField;
    private listId = `EmojiPane${this.baseId}`;
    private emojiBody: HTMLElement;
    private input: HTMLInputElement;

    public static defaultProps: EmojiPaneProps = {
        onLayoutChanged: NullFunction,
        onModeChanged: NullFunction,
    };

    constructor(props: InternalEmojiPaneProps) {
        super(props);

        this.state = {
            index: 0,
            mode: EmojiPaneMode.Quick,
            currentEmojiList: CommonEmojis,
            currentFamily: EmojiFamilyKeys.People,
            search: ':',
            searchInBox: '',
        };
    }

    public render(): JSX.Element {
        return this.state.mode === EmojiPaneMode.Quick
            ? this.renderQuickPicker()
            : this.renderFullPicker();
    }

    public componentDidUpdate(_: EmojiPaneProps, prevState: EmojiPaneState) {
        // call onLayoutChange when the call out parent of the EmojiPane needs to reorient itself on the page
        const { onLayoutChanged, onModeChanged } = this.props;
        const { currentEmojiList, mode, currentFamily } = this.state;

        if (mode !== prevState.mode) {
            onModeChanged(mode, prevState.mode);
            onLayoutChanged();
            return;
        }

        const currentEmojisLength = currentEmojiList
            ? currentEmojiList.length
            : EmojiList[currentFamily].length;
        const prevEmojisLength = prevState.currentEmojiList
            ? prevState.currentEmojiList.length
            : EmojiList[prevState.currentFamily].length;
        if (mode !== EmojiPaneMode.Quick && currentEmojisLength !== prevEmojisLength) {
            onLayoutChanged();
            return;
        }
    }

    public navigate(
        change: number,
        direction: EmojiPaneNavigateDirection = EmojiPaneNavigateDirection.Horizontal
    ): number {
        const { index, currentEmojiList } = this.state;
        if (direction === EmojiPaneNavigateDirection.Vertical && index !== -1) {
            change *= EmojisPerRow;
        }

        const newIndex = index + change;
        const length = currentEmojiList.length;
        if (newIndex >= 0 && newIndex < length) {
            this.setState({ index: newIndex });
            return newIndex;
        }

        return -1;
    }

    public getEmojiElementIdByIndex(index: number): string {
        const { currentEmojiList } = this.state;
        const emoji = currentEmojiList[index];
        if (emoji) {
            return this.getEmojiIconId(emoji);
        }

        return null;
    }

    public getSelectedEmoji(): Emoji {
        const { currentEmojiList, index } = this.state;
        return currentEmojiList[index];
    }

    public showFullPicker(fullSearchText: string): void {
        const normalizedSearchValue = this.normalizeSearchText(fullSearchText, true);
        const newMode =
            normalizedSearchValue.length === 0 ? EmojiPaneMode.Full : EmojiPaneMode.Partial;
        this.setState({
            index: newMode === EmojiPaneMode.Full ? -1 : 0,
            mode: newMode,
            currentEmojiList: this.getSearchResult(normalizedSearchValue, newMode),
            search: fullSearchText,
            searchInBox: normalizedSearchValue,
        });
    }

    public setSearch(value: string): void {
        const normalizedSearchValue = this.normalizeSearchText(value, false);
        this.setState({
            index: 0,
            currentEmojiList: this.getSearchResult(normalizedSearchValue, this.state.mode),
            search: value,
        });
    }

    public get getListId(): string {
        return this.listId;
    }

    private normalizeSearchText(text: string, colonIncluded: boolean): string {
        if (text == null) {
            return '';
        }

        if (colonIncluded) {
            text = text.substr(1);
        }
        return text.trim();
    }

    private getSearchResult(searchValue: string, mode: EmojiPaneMode): Emoji[] {
        const isQuickMode = mode === EmojiPaneMode.Quick;
        if (!searchValue) {
            return isQuickMode ? this.state.currentEmojiList : EmojiList[this.state.currentFamily];
        }

        const emojiList = searchEmojis(searchValue, this.props.strings);
        return isQuickMode ? emojiList.slice(0, 5).concat([MoreEmoji]) : emojiList;
    }

    private renderQuickPicker(): JSX.Element {
        const { quickPickerClassName, tooltipClassName, strings } = this.props;
        const selectedEmoji = this.getSelectedEmoji();
        const target = selectedEmoji ? `#${this.getEmojiIconId(selectedEmoji)}` : undefined;
        const content = selectedEmoji ? strings[selectedEmoji.description] : undefined;

        // note: we're using a callout since TooltipHost does not support manual trigger, and we need to show the tooltip since quick picker is shown
        // as an autocomplete menu (false focus based on transferring navigation keyboard event)
        return (
            <div id={this.listId} role="listbox">
                {this.renderCurrentEmojiIcons()}
                <div
                    id={this.listId}
                    role="listbox"
                    className={css(
                        classNames.quickPicker,
                        classNames.roosterEmojiPane,
                        'quick-picker',
                        quickPickerClassName
                    )}>
                    {content}
                    <Callout
                        {...TooltipCalloutProps}
                        role="tooltip"
                        target={target}
                        hidden={!content}
                        className={css(classNames.tooltip, tooltipClassName)}>
                        {content}
                    </Callout>
                </div>
            </div>
        );
    }

    private renderFullPicker(): JSX.Element {
        const {
            searchDisabled,
            searchPlaceholder,
            searchInputAriaLabel,
            fullPickerClassName,
        } = this.props;
        const emojiId = this.getEmojiIconId(this.getSelectedEmoji());
        const autoCompleteAttributes = {
            [AriaAttributes.AutoComplete]: 'list',
            [AriaAttributes.Expanded]: 'true',
            [AriaAttributes.HasPopup]: 'listbox',
            [AriaAttributes.Owns]: this.listId,
        };
        if (emojiId) {
            autoCompleteAttributes[AriaAttributes.ActiveDescendant] = emojiId;
        }

        return (
            <div className={css(classNames.roosterEmojiPane, fullPickerClassName)}>
                {!searchDisabled && (
                    <TextField
                        role="combobox"
                        componentRef={this.searchRefCallback}
                        value={this.state.searchInBox}
                        onChange={this.onSearchChange}
                        inputClassName={classNames.emojiTextInput}
                        onKeyPress={this.onSearchKeyPress}
                        onKeyDown={this.onSearchKeyDown}
                        onFocus={this.onSearchFocus}
                        placeholder={searchPlaceholder}
                        ariaLabel={searchInputAriaLabel}
                        {...autoCompleteAttributes}
                    />
                )}
                {this.state.mode === EmojiPaneMode.Full
                    ? this.renderFullList()
                    : this.renderPartialList()}
            </div>
        );
    }

    private onSearchFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
        this.input = e.target as HTMLInputElement;
    };

    private onSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (!e || e.which !== KeyCodes.enter) {
            return;
        }

        const { index, currentEmojiList } = this.state;

        if (index >= 0 && currentEmojiList && currentEmojiList.length > 0) {
            this.onSelect(e, currentEmojiList[index]);
        }
    };

    private onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (!e || DirectionKeys.indexOf(e.which) < 0) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        const { emojiBody } = this;
        if (e.which === KeyCodes.home) {
            this.setState({ index: 0 });
            emojiBody.scrollTop = 0;
            return;
        }
        if (e.which === KeyCodes.end) {
            this.setState({ index: this.state.currentEmojiList.length - 1 });
            emojiBody.scrollTop = emojiBody.scrollHeight; // scrollHeight will be larger than max
            return;
        }

        const direction =
            VerticalDirectionKeys.indexOf(e.which) < 0
                ? EmojiPaneNavigateDirection.Horizontal
                : EmojiPaneNavigateDirection.Vertical;
        const newIndex = this.navigate(
            e.which === KeyCodes.left || e.which === KeyCodes.up ? -1 : 1,
            direction
        );
        if (newIndex > -1) {
            const visibleRowCount =
                this.state.mode === EmojiPaneMode.Full
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

    private renderCurrentEmojiIcons(): JSX.Element[] {
        const { strings, emojiIconProps } = this.props;
        const { currentEmojiList } = this.state;

        return currentEmojiList.map((emoji, index) => (
            <EmojiIcon
                strings={strings}
                {...emojiIconProps}
                id={this.getEmojiIconId(emoji)}
                key={emoji.key}
                onMouseOver={() => this.setState({ index })}
                onFocus={() => this.setState({ index })}
                emoji={emoji}
                isSelected={index === this.state.index}
                onClick={e => this.onSelect(e, emoji)}
                aria-posinset={index + 1}
                aria-setsize={currentEmojiList.length}
            />
        ));
    }

    private getEmojiIconId(emoji: Emoji): string {
        return emoji ? `${this.listId}-${emoji.key}` : undefined;
    }

    private renderPartialList(): JSX.Element {
        const { strings, hideStatusBar, statusBarProps, partialListClassName } = this.props;
        const { currentEmojiList } = this.state;
        const hasResult = currentEmojiList && currentEmojiList.length > 0;

        return (
            <div>
                <div
                    className={css(classNames.partialList, partialListClassName)}
                    data-is-scrollable={true}
                    tabIndex={TabIndexForFirefoxBug}
                    ref={this.onEmojiBodyRef}>
                    <FocusZone
                        id={this.listId}
                        role="listbox"
                        className={classNames.fullListContent}
                        ref={this.focusZoneRefCallback}>
                        {this.renderCurrentEmojiIcons()}
                    </FocusZone>
                </div>
                {!hideStatusBar && (
                    <EmojiStatusBar
                        strings={strings}
                        {...statusBarProps}
                        hasResult={hasResult}
                        emoji={this.getSelectedEmoji()}
                    />
                )}
            </div>
        );
    }

    private renderFullList(): JSX.Element {
        const {
            strings,
            hideStatusBar,
            navBarProps,
            statusBarProps,
            fullListClassName,
            fullListContentClassName,
        } = this.props;
        const { currentEmojiList } = this.state;
        const hasResult = currentEmojiList && currentEmojiList.length > 0;

        return (
            <div className={css(classNames.fullList, fullListClassName)}>
                <div
                    className={classNames.fullListBody}
                    data-is-scrollable={true}
                    tabIndex={TabIndexForFirefoxBug}
                    ref={this.onEmojiBodyRef}>
                    <EmojiNavBar
                        strings={strings}
                        {...navBarProps}
                        onClick={this.pivotClick}
                        currentSelected={this.state.currentFamily}
                        getTabId={this.getTabId}
                    />
                    <div role="tabpanel" aria-labelledby={this.getTabId(this.state.currentFamily)}>
                        <div>
                            <FocusZone
                                id={this.listId}
                                role="listbox"
                                className={css(
                                    classNames.fullListContent,
                                    fullListContentClassName
                                )}
                                ref={this.focusZoneRefCallback}>
                                {this.renderCurrentEmojiIcons()}
                            </FocusZone>
                        </div>
                    </div>
                </div>

                {!hideStatusBar && (
                    <EmojiStatusBar
                        strings={strings}
                        {...statusBarProps}
                        hasResult={hasResult}
                        emoji={this.getSelectedEmoji()}
                    />
                )}
            </div>
        );
    }

    private onEmojiBodyRef = (ref: HTMLDivElement) => {
        this.emojiBody = ref;
    };

    private pivotClick = (selected: string): void => {
        const currentFamily = selected as EmojiFamilyKeys;

        this.setState({ currentEmojiList: EmojiList[currentFamily], currentFamily });
    };

    private getTabId = (itemKey: EmojiFamilyKeys): string => {
        return `family_${itemKey}_${this.baseId}`;
    };

    private searchRefCallback = (ref: ITextField): void => {
        this.searchBox = ref;
        if (this.searchBox) {
            this.searchBox.focus();
            this.searchBox.setSelectionStart(this.searchBox.value.length);
        }
    };

    private focusZoneRefCallback = (ref: FocusZone): void => {
        if (this.props.searchDisabled && ref) {
            ref.focus();
        }

        if (this.input) {
            // make sure to announce the active descending after the focus zone containing the emojis is ready
            this.input.removeAttribute(AriaAttributes.ActiveDescendant);
            const emojiId = this.getEmojiIconId(this.getSelectedEmoji());
            // we need to delay so NVDA will announce the first selection
            if (emojiId) {
                setTimeout(
                    () => this.input.setAttribute(AriaAttributes.ActiveDescendant, emojiId),
                    0
                );
            }
        }
    };

    private onSearchChange = (e: any, newValue: string): void => {
        const normalizedSearchValue = this.normalizeSearchText(newValue, false);
        const newMode =
            normalizedSearchValue.length === 0 ? EmojiPaneMode.Full : EmojiPaneMode.Partial;
        this.setState({
            index: newMode === EmojiPaneMode.Full ? -1 : 0,
            currentEmojiList: this.getSearchResult(normalizedSearchValue, this.state.mode),
            searchInBox: newValue,
            mode: newMode,
        });
    };

    private onSelect = (
        e: React.MouseEvent<EventTarget> | React.KeyboardEvent<HTMLInputElement>,
        emoji: Emoji
    ): void => {
        e.stopPropagation();
        e.preventDefault();
        if (this.props.onSelect) {
            this.props.onSelect(emoji, this.state.search);
        }
    };
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

const classNames = mergeStyleSets({
    quickPicker: {
        overflowY: 'hidden',
        '.rooster-emoji-selected::after': {
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
        '@media screen and (-ms-high-contrast: active)': {
            backgroundColor: 'Highlight',
            color: 'HighlightText',
            '-ms-high-contrast-adjust': 'none',
        },
    },
});
