import * as Color from 'color';
import * as React from 'react';
import { getComputedStyle } from 'roosterjs-editor-dom';

const styles = require('./ColorPicker.scss');

export interface ColorPickerProps {
    initColor: Color;
    onSelect?: (color: Color) => void;
    className?: string;
}

enum Keys {
    PageUp = 33,
    PageDown = 34,
    End = 35,
    Home = 36,
    Left = 37,
    Up = 38,
    Right = 39,
    Down = 40,
}

export default function ColorPicker(props: ColorPickerProps): JSX.Element {
    const hueBar = React.useRef<HTMLDivElement>(null);
    const picker = React.useRef<HTMLDivElement>(null);
    const hsv = props.initColor.hsv();
    const [hue, setHue] = React.useState(hsv.hue());
    const [saturation, setSaturation] = React.useState(hsv.saturationv());
    const [value, setValue] = React.useState(hsv.value());
    const isRtl = getComputedStyle(document.body, 'direction') == 'rtl';

    const onMouseDownHueBar = React.useCallback((e: React.MouseEvent<EventTarget>) => {
        startDrag(hueBar.current!, x => setHue(x * 360));
    }, []);

    const onMouseDownPicker = React.useCallback((e: React.MouseEvent<EventTarget>) => {
        startDrag(picker.current!, (x, y) => {
            setSaturation(x * 100);
            setValue(100 - y * 100);
        });
    }, []);

    const onChangeHue = React.useCallback(
        (e: React.KeyboardEvent<EventTarget>) => {
            let newHue = hue;
            switch (e.which) {
                case Keys.Left:
                    newHue += isRtl ? 1 : -1;
                    break;
                case Keys.Up:
                    newHue--;
                    break;
                case Keys.Right:
                    newHue += isRtl ? -1 : 1;
                    break;
                case Keys.Down:
                    newHue++;
                    break;
                case Keys.PageUp:
                    newHue -= 10;
                    break;
                case Keys.PageDown:
                    newHue += 10;
                    break;
                case Keys.Home:
                    newHue = 0;
                    break;
                case Keys.End:
                    newHue = 360;
                    break;
            }
            setHue(Math.max(Math.min(newHue, 360), 0));
        },
        [hue, isRtl]
    );

    const onChangeColor = React.useCallback(
        (e: React.KeyboardEvent<EventTarget>) => {
            let newSaturation = saturation;
            let newValue = value;
            switch (e.which) {
                case Keys.Left:
                    newSaturation += isRtl ? 1 : -1;
                    break;
                case Keys.Right:
                    newSaturation += isRtl ? -1 : 1;
                    break;
                case Keys.Home:
                    newSaturation = 0;
                    break;
                case Keys.End:
                    newSaturation = 100;
                    break;
                case Keys.Up:
                    newValue++;
                    break;
                case Keys.Down:
                    newValue--;
                    break;
                case Keys.PageUp:
                    newValue += 10;
                    break;
                case Keys.PageDown:
                    newValue -= 10;
                    break;
            }
            setSaturation(Math.max(Math.min(newSaturation, 100), 0));
            setValue(Math.max(Math.min(newValue, 100), 0));
        },
        [saturation, value, isRtl]
    );

    React.useEffect(() => {
        props.onSelect?.(props.initColor);
    }, []);

    React.useEffect(() => {
        props.onSelect?.(Color.hsv(hue, saturation, value).rgb());
    }, [hue, saturation, value]);

    return (
        <div className={styles.container}>
            <div
                tabIndex={0}
                className={styles.picker}
                ref={picker}
                style={{
                    backgroundColor: Color.hsv(hue, 100, 100).rgb().toString(),
                }}
                onKeyDown={onChangeColor}
                onMouseDown={onMouseDownPicker}>
                <div className={styles.layer1}>
                    <div className={styles.layer2} />
                </div>
                <div
                    className={styles.currentColor}
                    style={{
                        left: saturation + '%',
                        top: 100 - value + '%',
                    }}>
                    <div />
                </div>
            </div>

            <div
                className={styles.newColor}
                style={{ backgroundColor: Color.hsv(hue, saturation, value).rgb().toString() }}
            />
            <div
                className={styles.initColor}
                style={{ backgroundColor: props.initColor.toString() }}
            />

            <div
                className={styles.hueBar}
                ref={hueBar}
                tabIndex={0}
                onMouseDown={onMouseDownHueBar}
                onKeyDown={onChangeHue}>
                <div
                    className={styles.currentColor}
                    style={{
                        left: hue / 3.6 + '%',
                    }}>
                    <div />
                </div>
            </div>
        </div>
    );
}

function startDrag(element: HTMLElement, callback: (x: number, y: number) => void) {
    const rect = element.getBoundingClientRect();
    const document = element.ownerDocument;

    const onMouseChange = (e: MouseEvent) => {
        const left = e.pageX - rect.left;
        const top = e.pageY - rect.top;
        let x = Math.round((left * 100) / rect.width) / 100;
        let y = Math.round((top * 100) / rect.height) / 100;
        x = Math.min(Math.max(x, 0), 1);
        y = Math.min(Math.max(y, 0), 1);

        callback(x, y);

        if (e.type == 'mouseup') {
            document.removeEventListener('mousemove', onMouseChange, true /*useCapture*/);
            document.removeEventListener('mouseup', onMouseChange, true /*useCapture*/);
        } else {
            e.stopPropagation();
            e.preventDefault();
        }
    };

    document.addEventListener('mousemove', onMouseChange, true /*useCapture*/);
    document.addEventListener('mouseup', onMouseChange, true /*useCapture*/);
}
