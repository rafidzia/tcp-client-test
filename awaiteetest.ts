import { EventEmitter } from 'events';
import util from 'util';

const EventResolverSymbol = Symbol.for('EventResolver');

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
     * @inheritdoc
     * For additional purpose, any boolean return value from listener will be evaluated and override the emit return value.
     * If a single listener return false, the return value will be false.
     */
    emit(eventName: string | symbol, ...args: any[]): boolean {
        let result = true
        let response = super.emit(eventName, ...args, (r: boolean | Promise<boolean>) => {
            if (util.types.isPromise(r)) {
                result = util.inspect(r).slice(10, 15) !== "false" 
            } else {
                result = r !== false 
            }
        });
        return result && response
    }
    /**
     *  Similar to `emitter.emit(eventName, ...args)`, but return a promise that resolve when all listeners are done.
     * 
     * For additional purpose, any boolean return value from listener will be evaluated and override the emit return value.
     * If a single listener return false, the return value will be false.
     */
    emitAsync(eventName: string | symbol, ...args: any[]): Promise<boolean> {
        return new Promise((resolve) => {
            let listenerCount = super.listenerCount(eventName)
            if (listenerCount == 0) return resolve(false)
            let count = 0;
            let responseStatus = true
            const resolveCounting = (listener: Function, val: boolean) => {
                if (listener.name == boundOnceWrapper) return
                count++;
                responseStatus = val !== false 
                if (count >= listenerCount) resolve(responseStatus)
            }
            super.emit(eventName, ...args, EventResolverSymbol, resolveCounting);
        });
    }
    /**
     * @inheritdoc
     * For additional purpose, the listener can return boolean value to response the emit/emitAsync
     */
    on(eventName: string | symbol, listener: (...args: any[]) => void): this {
        const wrappedListener = this.#generateWrappedListener(eventName, listener)
        this.listenerMap.set(listener, wrappedListener);
        this.listenerMap.set(wrappedListener, listener);
        return super.on(eventName, wrappedListener);
    }

    /**
     * @inheritdoc
     * For additional purpose, the listener can return boolean value to response the emit/emitAsync
     */
    addListener = this.on;

    /**
     * @inheritdoc
     * For additional purpose, the listener can return boolean value to response the emit/emitAsync
     */
    once(eventName: string | symbol, listener: (...args: any[]) => void): this {
        const wrappedListener = this.#generateOnceWrapperListener(eventName, listener)
        this.listenerMap.set(listener, wrappedListener);
        this.listenerMap.set(wrappedListener, listener);
        return super.once(eventName, wrappedListener);
    }

    /**
     * @inheritdoc
     * For additional purpose, the listener can return boolean value to response the emit/emitAsync
     */
    prependListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        const wrappedListener = this.#generateWrappedListener(eventName, listener)
        this.listenerMap.set(listener, wrappedListener);
        this.listenerMap.set(wrappedListener, listener);
        return super.prependListener(eventName, wrappedListener);
    }

    /**
     * @inheritdoc
     * For additional purpose, the listener can return boolean value to response the emit/emitAsync
     */
    prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        const wrappedListener = this.#generateOnceWrapperListener(eventName, listener)
        this.listenerMap.set(listener, wrappedListener);
        this.listenerMap.set(wrappedListener, listener);
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
                    return resolver(listener, await listener(...args));
                }
            }
            const cb = args.pop();
            cb(listener(...args));
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
                    this.removeListener(eventName, listener);
                    return resolver(listener, await listener(...args));
                }
            }
            this.removeListener(eventName, listener);
            const cb = args.pop();
            cb(listener(...args));
        };
    }

    listeners(eventName: string | symbol): Function[] {
        return super.listeners(eventName).map(listener => this.listenerMap.get(listener as ()=>void) as Function)
    }

    removeListener(
        eventName: string | symbol,
        listener: (...args: any[]) => void,
    ): this {
        let wrappedListener = this.listenerMap.get(listener);
        if (wrappedListener) {
            this.listenerMap.delete(wrappedListener);
            super.removeListener(eventName, wrappedListener);
        }
        this.listenerMap.delete(listener);
        return super.removeListener(eventName, listener);
    }

    off = this.removeListener;

    removeAllListeners(eventName?: string | symbol | undefined): this {
        if (!eventName) {
            this.listenerMap = new WeakMap<
                (...args: any[]) => void,
                (...args: any[]) => void
            >();
        }else{
            super.listeners(eventName).forEach(listener => {
                let OriginalListener = this.listenerMap.get(listener as ()=>void);
                if (OriginalListener) {
                    this.listenerMap.delete(OriginalListener);
                }
                this.listenerMap.delete(listener as ()=>void);
            })
        }
        return eventName ? super.removeAllListeners(eventName) : super.removeAllListeners();
    }
}

export type AsyncEventEmitterInterface = AsyncEventEmitter

const ee = new AsyncEventEmitter()


ee.setMaxListeners(20000)

let data = {test: 1}


// for(let i = 0; i < 100; i++){
//     ee.on("test", (res: {test: number}) => {
//         let x = res
//         console.log(x)
//     })
// }

// ee.emit("test", data)


// setTimeout(()=>{
//     data.test = 2
//     // ee.emit("test", data
// }, 20000)



function x (){
    return new Promise((resolve) => {
        resolve(false)
    
        setTimeout(() => {
            resolve(true)
        }, 2000)
    })
}

(async ()=>{
    console.log(await x())
})()

// function setEE(ee: AsyncEventEmitterInterface) {
//     ee.on("asd", () => {
//         console.log("---------------------")
//         return true
//     })

//     ee.on("asd", async (data: string) => {
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 console.log(data)
//                 resolve()
//             }, 3000)
//         })
//         // return true
//     })
// }


// let count = 0

// async function demo() {

//     setEE(ee)

//     await ee.emitAsync("asd", "first?")
//     console.log("second?")
//     await ee.emitAsync("asd", "third?")
//     console.log("fourth?")

//     ee.removeAllListeners('asd')

//     //@ts-ignore
//     // ee = null

//     count++
//     console.log(count)
// }
// demo()
// setInterval(demo , 10000)