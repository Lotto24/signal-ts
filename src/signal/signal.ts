let effectCallback: (() => void) | null = null

export class Signal<T> {
    private value: T
    private subscribers: ((value: T) => void)[] = []

    constructor(value: T) {
        this.value = value
        this.subscribers = []
    }

    subscribe(subscriber: (value: T) => void) {
        this.subscribers.push(subscriber)
    }

    set(value: T) {
        if (this.value === value) {
            return
        }
        this.value = value
        this.subscribers.forEach(subscriber => subscriber(this.value))
    }

    get() {
        if (effectCallback) {
            this.subscribe(effectCallback)
        }
        return this.value
    }
}

export const createEffect = (effect: () => void) => {
    effectCallback = effect
    effect()
    effectCallback = null
}
