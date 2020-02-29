import { IAuthorizationRequest } from "./authorization-request";
import { PermissionResponse } from "./authorization-response";

export default interface IPolicySet<UserT, ResourceT> {
    evaluate(request: IAuthorizationRequest<UserT, ResourceT>): Promise<PermissionResponse>;
}
