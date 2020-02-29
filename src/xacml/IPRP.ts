import { IAuthorizationRequest } from "./authorization-request";
import IPolicySet from "./IPolicySet";

export default interface IPRP<UserT, ResourceT> {
    getPolicySet(request: IAuthorizationRequest<UserT, ResourceT>): IPolicySet<UserT, ResourceT>;
}
