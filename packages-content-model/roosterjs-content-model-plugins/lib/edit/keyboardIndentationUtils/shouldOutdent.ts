export function shouldOutdent(rawEvent: KeyboardEvent) {
    return (
        (rawEvent.key === 'Tab' && rawEvent.shiftKey) ||
        (rawEvent.key === 'ArrowLeft' && rawEvent.shiftKey && rawEvent.altKey)
    );
}
