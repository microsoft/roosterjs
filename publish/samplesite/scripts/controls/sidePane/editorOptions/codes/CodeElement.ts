export default abstract class CodeElement {
    abstract getCode(): string;

    protected encode(src: string): string {
        return src.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    }

    protected indent(src: string): string {
        return src
            .split('\n')
            .map(line => (line == '' ? '' : '    ' + line + '\n'))
            .join('');
    }
}
