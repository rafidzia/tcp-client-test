import EventEmitter from 'events';

export const EventResolverSymbol = Symbol.for('EventResolver');

// bound onceWrapper listener name when using once
const boundOnceWrapper = "bound onceWrapper"

/**
 * An EventEmitter that supports async (return a Promise when using emitAsync) listeners.
 * 
 * The listener that listen from emitAsync, can return boolean value to response the emitAsync
 */
export class AsyncEventEmitter extends EventEmitter {
    private listenerMap = new WeakMap<
        (...args: any[]) => void,
        (...args: any[]) => void
    >();
    /**
     * Similar to `emitter.emit(eventName, ...args)`, but returns a promise that resolves when all listeners are done.
     */
    emitAsync(eventName: string | symbol, ...args: any[]): Promise<boolean> {
        return new Promise((resolve) => {
            let listenerCount = super.listenerCount(eventName)
            if (listenerCount == 0) return resolve(false)
            let count = 0;
            let responseList: boolean[] = []
            const resolveCounting = (listener: Function, val: boolean) => {
                if (listener.name == boundOnceWrapper) return
                count++;
                responseList.push(val)
                if (count >= listenerCount) resolve(responseList.indexOf(false) >= 0)
            }
            super.emit(eventName, ...args, EventResolverSymbol, resolveCounting);
        });
    }

    on(eventName: string | symbol, listener: (...args: any[]) => void): this {
        const wrappedListener = this.#generateWrappedListener(eventName, listener)
        this.listenerMap.set(listener, wrappedListener);
        return super.on(eventName, wrappedListener);
    }

    addListener = this.on;

    once(eventName: string | symbol, listener: (...args: any[]) => void): this {
        const wrappedListener = this.#generateOnceWrapperListener(eventName, listener)
        this.listenerMap.set(listener, wrappedListener);
        return super.once(eventName, wrappedListener);
    }

    prependListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        const wrappedListener = this.#generateWrappedListener(eventName, listener)
        this.listenerMap.set(listener, wrappedListener);
        return super.prependListener(eventName, wrappedListener);
    }

    prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        const wrappedListener = this.#generateOnceWrapperListener(eventName, listener)
        this.listenerMap.set(listener, wrappedListener);
        return super.prependOnceListener(eventName, wrappedListener);
    }

    #generateWrappedListener(eventName: string | symbol, listener: (...args: any[]) => void) {
        return async (...args: any[]) => {
            if (args?.length >= 2) {
                const resolver = args[args.length - 1];
                const key = args[args.length - 2];
                if (
                    typeof resolver === 'function' &&
                    key === EventResolverSymbol
                ) {
                    args.splice(args.length - 2, 2)
                    let val = await listener(...args);
                    return resolver(listener, typeof val == "boolean" ? val : true);
                }
            }
            return await listener(...args);
        };
    }

    #generateOnceWrapperListener(eventName: string | symbol, listener: (...args: any[]) => void) {
        return async (...args: any[]) => {
            if (args?.length >= 2) {
                const resolver = args[args.length - 1];
                const key = args[args.length - 2];
                if (
                    typeof resolver === 'function' &&
                    key === EventResolverSymbol
                ) {
                    args.splice(args.length - 2, 2)
                    let val = await listener(...args);
                    this.removeListener(eventName, listener);
                    return resolver(listener, typeof val == "boolean" ? val : true);
                }
            }
            this.removeListener(eventName, listener);
            return await listener(...args);
        };
    }

    removeListener(
        eventName: string | symbol,
        listener: (...args: any[]) => void,
    ): this {
        let wrappedListener = this.listenerMap.get(listener);
        if (wrappedListener) {
            this.listenerMap.delete(listener);
            return super.removeListener(eventName, wrappedListener);
        } else {
            return super.removeListener(eventName, listener);
        }
    }

    off = this.removeListener;

    removeAllListeners(event?: string | symbol | undefined): this {
        if (!event) {
            this.listenerMap = new WeakMap<
                (...args: any[]) => void,
                (...args: any[]) => void
            >();
        }
        return event ? super.removeAllListeners(event) : super.removeAllListeners();
    }
}

export type AsyncEventEmitterInterface = AsyncEventEmitter




function setEE(ee: AsyncEventEmitterInterface) {
    ee.on("asd", () => {
        console.log("---------------------")
    })

    ee.on("asd", async (data: string) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(data)
                resolve()
            }, 3000)
        })
    })
}

let count = 0


async function demo(){

    let ee = new AsyncEventEmitter()

    setEE(ee)

    await ee.emitAsync("asd", "first?")
    console.log("second?")
    await ee.emitAsync("asd", "third?")
    console.log("fourth?")

    ee.removeAllListeners()

    //@ts-ignore
    ee = null

    count++
    console.log(count)
}
demo()
setInterval(demo , 10000)