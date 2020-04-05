import * as chai from "chai";

// test build output
// import pc, { ILoaderConfig, IRuleConfig, IPolicyConfig } from "../../lib";
// import { and, or } from "../../lib/rules";

// test sources
import pc, { ILoaderConfig, IDecisionRequest, IRuleConfig, IPolicyConfig, setLogLevel } from "../index";
import { and, or } from "../rules";
import { PermissionResponse } from "../core/AuthorizationDecision";
import { IDecisionContext } from "../core/IDecisionRequest";

// debug tests
setLogLevel("info");

type User = {
    id: string;
    email: string;
};

type Resource = {
    id: string;
    createdById: string;
};

// this is a custom context so we can set some context before calling authorize
// intended to load first before any policies evaluate (to add things like req.locals, etc)
interface ICustomContext extends IDecisionContext {
    locals: object;
}

// intended to be a loader that is needed to resolve before loader1
const preLoader1: ILoaderConfig<User, Resource> = {
    name: "preLoader1",
    loaders: [],
    resolve: async (): Promise<{ preData: string }> => {
        return { preData: "test" };
    },
};

// intended to load as part of trueRule
const loader1: ILoaderConfig<User, Resource> = {
    loaders: [preLoader1],
    name: "loader1",
    key: (name, user, resource) => `${name}:${user.id}:${resource.id}`,
    resolve: async (req: IDecisionRequest<User, Resource, ICustomContext>): Promise<{ data: string }> => {
        // assert on some loader data that we expected to laod before us
        const preLoaderData = req.context.store.get(preLoader1.name);
        chai.expect(preLoaderData).to.contain({ preData: "test" });
        const { locals } = req.context;
        chai.expect(locals).to.contain({ locals: 1 });
        return { data: "test" };
    },
};

// a rule that will return TRUE if loaders load data correctly
const trueRule: IRuleConfig<User, Resource> = {
    name: "trueRule",
    loaders: [loader1],
    evaluate: async (req: IDecisionRequest<User, Resource>) => {
        const result =
            req.context.store.get<{ data: string }>(`loader1:${req.user.id}:${req.resource.id}`).data === "test";
        chai.expect(result).to.be.true;
        return result;
    },
};

// a rule that will return NULL
const nullRule: IRuleConfig<User, Resource> = {
    name: "nullRule",
    evaluate: async () => null,
};

// a rule that will return FALSE
const falseRule: IRuleConfig<User, Resource> = {
    name: "falseRule",
    evaluate: async () => false,
};

// an example policy
const policy1: IPolicyConfig<User, Resource> = {
    name: "policy1",
    resourceTypes: ["something", "test"],
    actionTypes: ["create"],
    // use rule combinators to combine complex rules
    rules: [and([trueRule, or([nullRule, falseRule])])],
};

// an example pep with 1 policy
const pep = pc<User, Resource, ICustomContext>().action("create").resourceType("test").policies([policy1]);

describe("integration tests", () => {
    it("works", async () => {
        // resLocals is just an example of a scoped variable you may want to include as part of your decision context
        const resLocals = { locals: 1 };

        // calling decide on the PEP with user, resource, and a Loader with res locals
        const result = await pep
            .context({
                locals: resLocals,
            })
            .authorize({
                user: {
                    id: "userId",
                    email: "test@test.com",
                },
                resource: {
                    id: "resourceId",
                    createdById: "userId",
                },
            });
        chai.expect(result.response).to.equal(PermissionResponse.Deny);
    });
});
