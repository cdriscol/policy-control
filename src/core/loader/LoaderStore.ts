import logger from "../../logger";

export interface ILoaderStore {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prime<T = any>(key: string, data: T, persist?: boolean): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get<T = any>(key: string): T;
    // will persist data on a clear call
    persist(key: string): void;
    clear(persisted?: boolean): void;
    has(key: string): boolean;
}

export default class LoaderStore implements ILoaderStore {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly _data: Map<string, any> = new Map<string, any>();
    private readonly _persistedKeys: Set<string> = new Set<string>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prime<T = any>(key: string, data: T, persist?: boolean): void {
        if (this._data.has(key)) {
            throw new Error(
                `Calling prime twice for the same key "${key}" in the same decision context is usually a bad thing.`,
            );
        }
        logger.debug(`LoaderStore.setLoader key:${key} data:${JSON.stringify(data)}`);
        this._data.set(key, data);
        if (persist) {
            this.persist(key);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get<T = any>(key: string): T {
        if (!this._data.has(key)) {
            throw new Error(
                `Attempting to get data for key ${key}, but no data exists. Either prime the data or provider a loader to resolve your data.`,
            );
        }
        const data = this._data.get(key);
        logger.debug(`LoaderStore.getLoader key:${key} data:${JSON.stringify(data)}`);
        return data;
    }

    has(key: string): boolean {
        const result = this._data.has(key);
        logger.debug(`LoaderStore.hasLoader key:${key} result:${result}`);
        return result;
    }

    persist(key: string) {
        if (!this._persistedKeys.has(key)) {
            this._persistedKeys.add(key);
        }
    }

    clear(persisted?: boolean) {
        if (persisted) {
            this._data.clear();
            return;
        }

        Array.from(this._data.keys()).forEach(key => {
            if (!persisted && this._persistedKeys.has(key)) return;
            this._data.delete(key);
        });
    }
}
