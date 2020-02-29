import { IAuthorizationRequest } from "./authorization-request";
import { IAuthorizationResponse } from "./authorization-response";
import IPDP from "./IPDP";
import IPEP from "./IPEP";

export default class PEP<UserT, ResourceT> implements IPEP {
    private request: IAuthorizationRequest<UserT, ResourceT>;
    private pdp: IPDP<UserT, ResourceT>;

    constructor(pdp: IPDP<UserT, ResourceT>, request: IAuthorizationRequest<UserT, ResourceT>) {
        this.request = request;
        this.pdp = pdp;
    }

    public async authorize(): Promise<IAuthorizationResponse> {
        return this.pdp.authorize(this.request);
    }
}
