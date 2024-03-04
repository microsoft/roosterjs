import * as React from 'react';
import { getObjectKeys } from 'roosterjs-content-model-dom';
import { readFile } from 'roosterjs-content-model-core';
import { SidePaneElementProps } from '../SidePaneElement';
import type { PluginEvent } from 'roosterjs-content-model-types';

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

export default class ContentModelEventViewPane extends React.Component<
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
                                {event.event.eventType}
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
            case 'keyDown':
            case 'keyPress':
            case 'keyUp':
                return (
                    <span>
                        Key=
                        {event.rawEvent.key}
                    </span>
                );

            case 'mouseDown':
            case 'mouseUp':
            case 'contextMenu':
                return (
                    <span>
                        Button=
                        {event.rawEvent.button}, SrcElement=
                        {event.rawEvent.target && (event.rawEvent.target as HTMLElement).tagName},
                        PageX=
                        {event.rawEvent.pageX}, PageY=
                        {event.rawEvent.pageY}
                    </span>
                );

            case 'contentChanged':
                return (
                    <span>
                        Source=
                        {event.source}, Data=
                        {event.data && event.data.toString && event.data.toString()}
                    </span>
                );

            case 'beforePaste':
                return (
                    <span>
                        Types=
                        {event.clipboardData.types.join()}
                        {this.renderPasteContent('Plain text', event.clipboardData.text)}
                        {this.renderPasteContent('Sanitized HTML', event.clipboardData.html)}
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
                        Paste from keyboard or native context menu:
                        {event.clipboardData.pasteNativeEvent ? ' true' : ' false'}
                        {getObjectKeys(event.clipboardData.customValues).map(contentType =>
                            this.renderPasteContent(
                                contentType,
                                event.clipboardData.customValues[contentType]
                            )
                        )}
                    </span>
                );

            case 'entityOperation':
                const {
                    operation,
                    entity: { id, type },
                } = event;
                return (
                    <span>
                        Operation={operation} Type={type}; Id={id}
                    </span>
                );

            case 'beforeCutCopy':
                const { isCut } = event;
                return <span>isCut={isCut ? 'true' : 'false'}</span>;

            case 'editImage':
                return (
                    <>
                        <span>new src={event.newSrc.substr(0, 100)}</span>
                    </>
                );

            case 'zoomChanged':
                return <span>New value={event.newZoomScale}</span>;

            case 'beforeKeyboardEditing':
                return <span>Key code={event.rawEvent.which}</span>;

            case 'input':
                return <span>Input type={event.rawEvent.inputType}</span>;

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
}
