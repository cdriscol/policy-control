export enum PermissionResponse {
    Indeterminate = 1,
    Allow = 2,
    Deny = 3,
}

export interface IAuthorizationResponse {
    response: PermissionResponse;
    errors: string[];
}

export class AuthorizationResponse implements IAuthorizationResponse {
    public readonly response: PermissionResponse;
    public readonly errors: string[];
    constructor(response: PermissionResponse, errors?: string[]) {
        this.response = response;
        this.errors = errors ? errors : [];
    }
}
