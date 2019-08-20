import * as React from 'react';
import { getTagOfNode } from 'roosterjs-editor-dom';
import { PendableFormatState, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { SidePaneElementProps } from '../SidePaneElement';

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

const EventTypeMap = {
    [PluginEventType.BeforeDispose]: 'BeforeDispose',
    [PluginEventType.BeforePaste]: 'BeforePaste',
    [PluginEventType.CompositionEnd]: 'CompositionEnd',
    [PluginEventType.ContentChanged]: 'ContentChanged',
    [PluginEventType.EditorReady]: 'EditorReady',
    [PluginEventType.ExtractContent]: 'ExtractContent',
    [PluginEventType.KeyDown]: 'KeyDown',
    [PluginEventType.KeyPress]: 'KeyPress',
    [PluginEventType.KeyUp]: 'KeyUp',
    [PluginEventType.MouseDown]: 'MouseDown',
    [PluginEventType.MouseUp]: 'MouseUp',
    [PluginEventType.Input]: 'Input',
    [PluginEventType.PendingFormatStateChanged]: 'PendingFormatStateChanged',
    [PluginEventType.DarkModeChanged]: 'DarkModeChanged',
    [PluginEventType.Scroll]: 'Scroll',
};

export default class EventViewPane extends React.Component<
    SidePaneElementProps,
    EventViewPaneState
> {
    private events: EventEntry[] = [];
    private displayCount = React.createRef<HTMLSelectElement>();
    private lasteIndex = 0;

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
            this.events.push({
                time: new Date(),
                event: event,
                index: this.lasteIndex++,
            });

            while (this.events.length > 100) {
                this.events.shift();
            }
            this.setState({
                currentIndex: this.lasteIndex,
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
                        {this.renderPasteContent('Palin text', event.clipboardData.text)}
                        {this.renderPasteContent('Sanitized HTML', event.clipboardData.html)}
                        {this.renderPasteContent('Original HTML', event.clipboardData.rawHtml)}
                        {this.renderPasteContent('Image', event.clipboardData.image, img => (
                            <img ref={ref => this.renderImage(ref, img)} className={styles.img} />
                        ))}
                    </span>
                );
            case PluginEventType.PendingFormatStateChanged:
                const formatState = event.formatState;
                const keys = Object.keys(formatState) as (keyof PendableFormatState)[];
                return <span>{keys.map(key => `${key}=${event.formatState[key]}; `)}</span>;
        }
        return null;
    }

    private clear = () => {
        this.events = [];
        this.setState({
            currentIndex: -1,
        });
    };

    private renderImage = (img: HTMLImageElement, imageFile: File) => {
        let reader = new FileReader();
        reader.onload = (e: ProgressEvent) =>
            (img.src = (event.target as FileReader).result as string);

        reader.readAsDataURL(imageFile);
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
}
