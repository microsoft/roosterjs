import * as React from 'react';
import { EntityOperation, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { SidePaneElementProps } from '../SidePaneElement';
import {
    getObjectKeys,
    getTagOfNode,
    HtmlSanitizer,
    readFile,
    safeInstanceOf,
} from 'roosterjs-editor-dom';

const styles = require('./EventViewPane.scss');

export interface EventEntry {
    index: number;
    time: Date;
    event: PluginEvent;
}

export interface EventViewPaneState {
    displayCount: number;
    currentIndex: number;
}

const EventTypeMap: { [key in PluginEventType]: string } = {
    [PluginEventType.BeforeDispose]: 'BeforeDispose',
    [PluginEventType.BeforePaste]: 'BeforePaste',
    [PluginEventType.CompositionEnd]: 'CompositionEnd',
    [PluginEventType.ContentChanged]: 'ContentChanged',
    [PluginEventType.EditorReady]: 'EditorReady',
    [PluginEventType.EntityOperation]: 'EntityOperation',
    [PluginEventType.ExtractContentWithDom]: 'ExtractContentWithDom',
    [PluginEventType.KeyDown]: 'KeyDown',
    [PluginEventType.KeyPress]: 'KeyPress',
    [PluginEventType.KeyUp]: 'KeyUp',
    [PluginEventType.MouseDown]: 'MouseDown',
    [PluginEventType.MouseUp]: 'MouseUp',
    [PluginEventType.Input]: 'Input',
    [PluginEventType.PendingFormatStateChanged]: 'PendingFormatStateChanged',
    [PluginEventType.Scroll]: 'Scroll',
    [PluginEventType.BeforeCutCopy]: 'BeforeCutCopy',
    [PluginEventType.ContextMenu]: 'ContextMenu',
    [PluginEventType.EnteredShadowEdit]: 'EnteredShadowEdit',
    [PluginEventType.LeavingShadowEdit]: 'LeavingShadowEdit',
    [PluginEventType.EditImage]: 'EditImage',
    [PluginEventType.BeforeSetContent]: 'BeforeSetContent',
    [PluginEventType.ZoomChanged]: 'ZoomChanged',
    [PluginEventType.SelectionChanged]: 'SelectionChanged',
    [PluginEventType.BeforeKeyboardEditing]: 'BeforeKeyboardEditing',
};

const EntityOperationMap: { [key in EntityOperation]: string } = {
    [EntityOperation.AddShadowRoot]: 'AddShadowRoot',
    [EntityOperation.RemoveShadowRoot]: 'RemoveShadowRoot',
    [EntityOperation.Click]: 'Click',
    [EntityOperation.ContextMenu]: 'ContextMenu',
    [EntityOperation.Escape]: 'Escape',
    [EntityOperation.NewEntity]: 'NewEntity',
    [EntityOperation.Overwrite]: 'Overwrite',
    [EntityOperation.PartialOverwrite]: 'PartialOverwrite',
    [EntityOperation.RemoveFromEnd]: 'RemoveFromEnd',
    [EntityOperation.RemoveFromStart]: 'RemoveFromStart',
    [EntityOperation.ReplaceTemporaryContent]: 'ReplaceTemporaryContent',
    [EntityOperation.UpdateEntityState]: 'UpdateEntityState',
};

export default class EventViewPane extends React.Component<
    SidePaneElementProps,
    EventViewPaneState
> {
    private events: EventEntry[] = [];
    private displayCount = React.createRef<HTMLSelectElement>();
    private lastIndex = 0;

    constructor(props: SidePaneElementProps) {
        super(props);
        this.state = {
            displayCount: 20,
            currentIndex: -1,
        };
    }

    render() {
        let displayCount = Math.min(this.events.length, this.state.displayCount);
        let displayedEvents =
            displayCount > 0 ? this.events.slice(this.events.length - displayCount) : [];
        displayedEvents = displayedEvents.reverse();

        return (
            <>
                <div>
                    Show item count:
                    <select
                        defaultValue={this.state.displayCount.toString()}
                        ref={this.displayCount}
                        onChange={this.onDisplayCountChanged}>
                        <option value={'0'}>Disabled</option>
                        <option value={'20'}>20</option>
                        <option value={'50'}>50</option>
                        <option value={'100'}>100</option>
                    </select>{' '}
                    <button onClick={this.clear}>Clear all</button>
                </div>
                <div>
                    {displayedEvents.map(event => (
                        <details key={event.index.toString()}>
                            <summary>
                                {`${event.time.getHours()}:${event.time.getMinutes()}:${event.time.getSeconds()}.${event.time.getMilliseconds()} `}
                                {EventTypeMap[event.event.eventType]}
                            </summary>
                            <div className={styles.eventContent}>
                                {this.renderEvent(event.event)}
                            </div>
                        </details>
                    ))}
                </div>
            </>
        );
    }

    addEvent(event: PluginEvent) {
        if (this.state.displayCount > 0) {
            if (event.eventType == PluginEventType.BeforePaste) {
                const sanitizer = new HtmlSanitizer(event.sanitizingOption);
                const fragment = event.fragment.cloneNode(true /*deep*/) as DocumentFragment;

                sanitizer.convertGlobalCssToInlineCss(fragment);
                sanitizer.sanitize(fragment);
                (event.clipboardData as any).html = this.getHtml(fragment);
            }

            this.events.push({
                time: new Date(),
                event: event,
                index: this.lastIndex++,
            });

            while (this.events.length > 100) {
                this.events.shift();
            }
            this.setState({
                currentIndex: this.lastIndex,
            });
        }
    }

    private renderEvent(event: PluginEvent): JSX.Element {
        switch (event.eventType) {
            case PluginEventType.KeyDown:
            case PluginEventType.KeyPress:
            case PluginEventType.KeyUp:
                return (
                    <span>
                        Key=
                        {event.rawEvent.which}
                    </span>
                );

            case PluginEventType.MouseDown:
            case PluginEventType.MouseUp:
            case PluginEventType.ContextMenu:
                return (
                    <span>
                        Button=
                        {event.rawEvent.button}, SrcElement=
                        {event.rawEvent.target && getTagOfNode(event.rawEvent.target as Node)},
                        PageX=
                        {event.rawEvent.pageX}, PageY=
                        {event.rawEvent.pageY}
                    </span>
                );

            case PluginEventType.ContentChanged:
                return (
                    <span>
                        Source=
                        {event.source}, Data=
                        {event.data && event.data.toString && event.data.toString()}
                    </span>
                );

            case PluginEventType.BeforePaste:
                return (
                    <span>
                        Types=
                        {event.clipboardData.types.join()}
                        {this.renderPasteContent('Plain text', event.clipboardData.text)}
                        {this.renderPasteContent(
                            'Sanitized HTML',
                            (event.clipboardData as any).html
                        )}
                        {this.renderPasteContent('Original HTML', event.clipboardData.rawHtml)}
                        {this.renderPasteContent('Image', event.clipboardData.image, img => (
                            <img
                                ref={ref => ref && this.renderImage(ref, img)}
                                className={styles.img}
                            />
                        ))}
                        {this.renderPasteContent(
                            'LinkPreview',
                            event.clipboardData.linkPreview
                                ? JSON.stringify(event.clipboardData.linkPreview)
                                : ''
                        )}
                        {getObjectKeys(event.clipboardData.customValues).map(contentType =>
                            this.renderPasteContent(
                                contentType,
                                event.clipboardData.customValues[contentType]
                            )
                        )}
                    </span>
                );
            case PluginEventType.PendingFormatStateChanged:
                const formatState = event.formatState;
                const keys = getObjectKeys(formatState);
                return <span>{keys.map(key => `${key}=${event.formatState[key]}; `)}</span>;

            case PluginEventType.EntityOperation:
                const {
                    operation,
                    entity: { id, type },
                } = event;
                return (
                    <span>
                        Operation={EntityOperationMap[operation]} Type={type}; Id={id}
                    </span>
                );

            case PluginEventType.BeforeCutCopy:
                const { isCut } = event;
                return <span>isCut={isCut ? 'true' : 'false'}</span>;

            case PluginEventType.EditImage:
                return (
                    <>
                        <span>new src={event.newSrc.substr(0, 100)}</span>
                    </>
                );

            case PluginEventType.ZoomChanged:
                return (
                    <span>
                        Old value={event.oldZoomScale} New value={event.newZoomScale}
                    </span>
                );

            case PluginEventType.BeforeKeyboardEditing:
                return <span>Key code={event.rawEvent.which}</span>;

            default:
                return null;
        }
    }

    private clear = () => {
        this.events = [];
        this.setState({
            currentIndex: -1,
        });
    };

    private renderImage = (img: HTMLImageElement, imageFile: File) => {
        readFile(imageFile, dataUrl => (img.src = dataUrl));
    };

    private onDisplayCountChanged = () => {
        let value = parseInt(this.displayCount.current.value);
        this.setState({
            displayCount: value,
        });
    };

    private renderPasteContent(
        title: string,
        content: any,
        renderer: (content: any) => JSX.Element = content => <span>{content}</span>
    ): JSX.Element {
        return (
            content && (
                <details>
                    <summary>{title}</summary>
                    <div className={styles.pasteContent}>{renderer(content)}</div>
                </details>
            )
        );
    }

    private getHtml(fragment: DocumentFragment) {
        const stringArray: string[] = [];
        for (let child = fragment.firstChild; child; child = child.nextSibling) {
            stringArray.push(
                safeInstanceOf(child, 'HTMLElement')
                    ? child.outerHTML
                    : safeInstanceOf(child, 'Text')
                    ? child.nodeValue
                    : ''
            );
        }

        return stringArray.join('');
    }
}
