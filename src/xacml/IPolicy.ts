import { AuthorizationActions } from "./authorization-actions";
import { IAuthorizationRequest } from "./authorization-request";
import IPIP from "./IPIP";
import IRule from "./IRule";

export default interface IPolicy<UserT, ResourceT> {
    resourceTypes: Array<number | string>;
    actionTypes: AuthorizationActions[];
    pips?: IPIP<UserT, ResourceT>[];
    rules: IRule<UserT, ResourceT>[];
    check(request: IAuthorizationRequest<UserT, ResourceT>): Promise<boolean>;
}
