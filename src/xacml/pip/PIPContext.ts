import { IPIPConfig } from "./IPIPConfig";
import logger from "../../logger";

export interface IPIPContext<U, R> {
    setPip<T = any>(pip: IPIPConfig<U, R>, data: T): void;
    getPip<T = any>(pip: IPIPConfig<U, R>): T;
    hasPip(pip: IPIPConfig<U, R>): boolean;
}

export default class PIPContext<U, R> implements IPIPContext<U, R> {
    private readonly _user: U;
    private readonly _resource: R;
    private readonly _data: Map<string, any>;

    constructor(user: U, resource: R) {
        this._user = user;
        this._resource = resource;
        this._data = new Map<string, any>();
    }

    setPip<T = any>(pip: IPIPConfig<U, R>, data: T): void {
        const key = this.getKey(pip);
        if (this._data.has(key)) {
            throw new Error(
                `You cannot set pip data twice for the same key ${key}, consider using IPIP.key to create a unique key`,
            );
        }
        logger.debug(`PIPContext.setPip key:${key} data:${JSON.stringify(data)}`);
        this._data.set(key, data);
    }

    getPip<T = any>(pip: IPIPConfig<U, R>): T {
        const key = this.getKey(pip);
        if (!this._data.has(key)) {
            throw new Error(
                `Attempting to get data for key ${key}, but no data exists. Make sure you have loaded the ${pip.name} PIP before you make this call.`,
            );
        }
        const data = this._data.get(key);
        logger.debug(`PIPContext.getPip key:${key} data:${JSON.stringify(data)}`);
        return data;
    }

    hasPip(pip: IPIPConfig<U, R>): boolean {
        const key = this.getKey(pip);
        const result = this._data.has(key);
        logger.debug(`PIPContext.hasPip key:${key} result:${result}`);
        return result;
    }

    private getKey(pip: IPIPConfig<U, R>): string {
        return pip.key ? pip.key(pip.name, this._user, this._resource) : pip.name;
    }
}
