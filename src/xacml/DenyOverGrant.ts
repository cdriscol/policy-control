import { IAuthorizationRequest } from "./authorization-request";
import { AuthorizationResponse, IAuthorizationResponse, PermissionResponse } from "./authorization-response";
import IPDP from "./IPDP";
import IPRP from "./IPRP";

export default class DenyOverGrant<UserT, ResourceT> implements IPDP<UserT, ResourceT> {
    private readonly prps: IPRP<UserT, ResourceT>[];

    constructor(prps: IPRP<UserT, ResourceT>[]) {
        this.prps = prps;
    }

    public async authorize(request: IAuthorizationRequest<UserT, ResourceT>): Promise<IAuthorizationResponse> {
        const authResponse = await this.prps.reduce(
            async (curResponsePromise: Promise<PermissionResponse>, curPrp: IPRP<UserT, ResourceT>) => {
                const response = await curResponsePromise;
                if (response !== PermissionResponse.Indeterminate) {
                    return response;
                }

                const policySet = curPrp.getPolicySet(request);
                const newResponse = await policySet.evaluate(request);
                // Eventually make this configurable and have a "combinatorFunction" that is passed to a "combinatorPDP"
                return Math.max(response, newResponse);
            },
            Promise.resolve(PermissionResponse.Indeterminate),
        );

        return new AuthorizationResponse(authResponse);
    }
}
