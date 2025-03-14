let effectCallback: (() => void) | null = null

export class Signal<T> {
    private value: T;
    private subscribers: (() => void)[] = []

    constructor(initialValue: T) {
        this.value = initialValue
    }

    set(newValue: T) {
        // TODO: deep compare, currently only works for primitive types
        if (this.value === newValue) {
            return
        }
        this.value = newValue
        this.subscribers.forEach(subscriber => subscriber())
    }

    get() {
        if(effectCallback) {
            this.subscribe(effectCallback)
        }
        return this.value
    }

    private subscribe(subscriber: () => void) {
        this.subscribers.push(subscriber)
    }
}


export function createEffect(callback: () => void) {
    effectCallback = callback
    callback()
    effectCallback = null
}
