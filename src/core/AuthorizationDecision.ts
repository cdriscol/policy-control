export enum PermissionResponse {
    Indeterminate = "indeterminate",
    Allow = "allow",
    Deny = "deny",
}

export interface IAuthorizationDecision {
    response: PermissionResponse;

    // TODO: Implement reasons why authorization fails
    // reasons: string[];
}
