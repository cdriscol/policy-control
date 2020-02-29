import { IAuthorizationRequest } from "./authorization-request";

export default interface IRule<UserT, ResourceT> {
    evaluate(R: IAuthorizationRequest<UserT, ResourceT>): boolean | undefined;
}
