export enum PermissionResponse {
    Indeterminate = "indeterminate",
    Allow = "allow",
    Deny = "deny",
}

export interface IAuthorizationResponse {
    response: PermissionResponse;
    // TODO: this is not used currently
    errors: string[];
}
