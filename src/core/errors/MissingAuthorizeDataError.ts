export class MissingAuthorizeDataError extends Error {
    constructor(fields: string[]) {
        super();
        this.message = `Missing data required to authorize: [${fields.join(",")}]`;
    }
}
