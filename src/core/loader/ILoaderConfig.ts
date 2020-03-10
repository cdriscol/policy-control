import { IAuthorizationRequest } from "../IAuthorizationRequest";

export interface ILoaderConfig<U, R> {
    // unique name used to store data from resolve
    name: string;

    // returns any object which will be stored in the context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolve(R: IAuthorizationRequest<U, R>): Promise<any>;

    // loaders needed before this loader to resolve data (circular loaders not allowed)
    loaders?: ILoaderConfig<U, R>[];

    // key used to store/retrieve this data, defaults to "name"
    key?(name: string, user: U, resource: R): string;

    // this data should be persisted between "authorize" calls
    persist?: boolean;
}
