import { IAuthorizationResponse } from "./authorization-response";

export default interface IPEP {
    authorize(): Promise<IAuthorizationResponse>;
}
