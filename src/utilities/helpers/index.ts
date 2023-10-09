// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce(fn: Function, delayMs = 100) {
    let timeout: ReturnType<typeof setTimeout>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (this: any, ...args: any[]) {
        clearTimeout(timeout);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        timeout = setTimeout(() => fn.apply(this, args), delayMs);
    };
}
