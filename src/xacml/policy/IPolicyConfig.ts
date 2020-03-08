import { IRuleConfig } from "../rule";
import { AuthorizationActions } from "../AuthorizationActions";

export interface IPolicyConfig<U, R> {
    name: string;
    resourceTypes: Array<number | string>;
    actionTypes: AuthorizationActions[];
    rules: IRuleConfig<U, R>[];
    priority?: number;
}
