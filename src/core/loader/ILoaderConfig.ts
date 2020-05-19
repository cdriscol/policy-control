import { IDecisionRequest, IDecisionContext } from "../IDecisionRequest";

export interface ILoaderConfig<U, R, C extends IDecisionContext = IDecisionContext> {
    // unique name used to store data from resolve
    name: string;

    // returns any object which will be stored in the context
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolve(R: IDecisionRequest<U, R, C>): Promise<any>;

    // loaders needed before this loader to resolve data (circular loaders not allowed)
    loaders?: ILoaderConfig<U, R>[];

    // key used to store/retrieve this data, defaults to "name"
    key?(name: string, user: U, resource: R): string;

    // this data should be persisted between "decide" calls
    persist?: boolean;
}
