import { IRuleConfig } from "../rule";
import { AuthorizationActions } from "../AuthorizationActions";

export interface IPolicyConfig<U, R> {
    resourceTypes: Array<number | string>;
    actionTypes: AuthorizationActions[];
    rules: IRuleConfig<U, R>[];
    priority?: number;
}
