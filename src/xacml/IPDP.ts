import { IAuthorizationRequest } from "./authorization-request";
import { IAuthorizationResponse } from "./authorization-response";

export default interface IPDP<UserT, ResourceT> {
    authorize(request: IAuthorizationRequest<UserT, ResourceT>): Promise<IAuthorizationResponse>;
}
