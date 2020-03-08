import { IAuthorizationRequest } from "../IAuthorizationRequest";

export interface IPIPConfig<U, R> {
    // unique name used to store data from resolve
    name: string;

    // returns any object which will be stored in the context
    resolve(R: IAuthorizationRequest<U, R>): Promise<any>;

    // pips needed before this pip to resolve data (circular pips not allowed)
    pips?: IPIPConfig<U, R>[];

    // key used to store/retrieve this data, defaults to "name"
    key?(name: string, user: U, resource: R): string;
}
