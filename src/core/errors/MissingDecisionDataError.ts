export class MissingDecisionDataError extends Error {
    constructor(fields: string[]) {
        super();
        this.message = `Missing data required to make a decision: [${fields.join(",")}]`;
    }
}
