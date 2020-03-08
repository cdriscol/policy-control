export enum PermissionResponse {
    Indeterminate = "indeterminate",
    Allow = "allow",
    Deny = "deny",
}

export interface IAuthorizationResponse {
    response: PermissionResponse;
    errors: string[];
}

export default class AuthorizationResponse implements IAuthorizationResponse {
    public readonly response: PermissionResponse;
    public readonly errors: string[];
    constructor(response: PermissionResponse, errors?: string[]) {
        this.response = response;
        this.errors = errors ? errors : [];
    }
}
