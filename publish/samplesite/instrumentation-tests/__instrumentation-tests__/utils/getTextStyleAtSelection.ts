const getTextStyleAtSelection = () => {
    let container = window.getSelection().getRangeAt(0).startContainer;
    const containerElement = (container instanceof Node) ? container.parentElement : container;
    const style = window.getComputedStyle(containerElement);
    return {
        fontWeight: style.getPropertyValue('font-weight'),
        fontStyle: style.getPropertyValue('font-style'),
        textDecoration: style.getPropertyValue('text-decoration'),
    }
}

export default getTextStyleAtSelection;
