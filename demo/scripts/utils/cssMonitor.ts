import { Stylesheet } from '@fluentui/merge-styles/lib/Stylesheet';

let isCssMonitorStarted: boolean = false;
const activeWindows: Window[] = [];

function startCssMonitor() {
    if (!isCssMonitorStarted) {
        isCssMonitorStarted = true;
        Stylesheet.getInstance().setConfig({
            onInsertRule: (cssText: string) => {
                activeWindows.forEach(win => {
                    const style = win.document.createElement('style');
                    style.textContent = cssText;
                    win.document.head.appendChild(style);
                });
            },
        });
    }
}

export function registerWindowForCss(win: Window) {
    startCssMonitor();

    activeWindows.push(win);

    const styles = document.getElementsByTagName('STYLE');
    const fragment = win.document.createDocumentFragment();

    for (let i = 0; i < styles.length; i++) {
        const style = win.document.createElement('style');
        fragment.appendChild(style);

        const originalStyle = styles[i] as HTMLStyleElement;
        const rules = originalStyle.sheet.cssRules;
        let cssText = '';

        for (let j = 0; j < rules.length; j++) {
            const rule = rules[j] as CSSStyleRule;
            cssText += rule.cssText;
        }

        style.textContent = cssText;
    }

    win.document.head.appendChild(fragment);
}

export function unregisterWindowForCss(win: Window) {
    const index = activeWindows.indexOf(win);

    if (index >= 0) {
        activeWindows.splice(index, 1);
    }
}
