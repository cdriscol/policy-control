import { IAuthorizationRequest } from "./authorization-request";

export default interface IPIP<UserT, ResourceT> {
    enrich(R: IAuthorizationRequest<UserT, ResourceT>): Promise<IAuthorizationRequest<UserT, ResourceT>>;
}
