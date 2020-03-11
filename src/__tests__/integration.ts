import * as chai from "chai";

// test build output
// import pc, { ILoaderConfig, IRuleConfig, IPolicyConfig } from "../../lib";
// import { and, or } from "../../lib/rules";

// test sources
import pc, { ILoaderConfig, IDecisionRequest, IRuleConfig, IPolicyConfig, setLogLevel } from "../index";
import { and, or } from "../rules";
import { PermissionResponse } from "../core/DecisionResponse";

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

// this is a ILoaderConfing builder because it can create a config with a resolve scoped to a local variable
// intended to load first before any policies evaluate (to add things like req.locals, etc)
const createPcLoader1: (locals?: any) => ILoaderConfig<User, any> = (locals: any) => ({
    name: "resLocals",
    resolve: () => locals,
});

// intended to be a loader that is needed to resolve before loader1
const preLoader1: ILoaderConfig<User, Resource> = {
    name: "preLoader1",
    loaders: [createPcLoader1()],
    resolve: async (): Promise<{ preData: string }> => {
        return { preData: "test" };
    },
};

// intended to load as part of trueRule
const loader1: ILoaderConfig<User, Resource> = {
    loaders: [preLoader1],
    name: "loader1",
    key: (name, user, resource) => `${name}:${user.id}:${resource.id}`,
    resolve: async (req: IDecisionRequest<User, Resource>): Promise<{ data: string }> => {
        // assert on some loader data that we expected to laod before us
        const preLoaderData = req.context.get(preLoader1.name);
        chai.expect(preLoaderData).to.contain({ preData: "test" });
        const pcLoader1 = req.context.get(createPcLoader1().name);
        chai.expect(pcLoader1).to.contain({ createPcLoader1: 1 });
        return { data: "test" };
    },
};

// a rule that will return TRUE if loaders load data correctly
const trueRule: IRuleConfig<User, Resource> = {
    name: "trueRule",
    loaders: [loader1],
    evaluate: async (req: IDecisionRequest<User, Resource>) => {
        const result = req.context.get<{ data: string }>(`loader1:${req.user.id}:${req.resource.id}`).data === "test";
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
const pep = pc<User, Resource>()
    .action("create")
    .resourceType("test")
    .policies([policy1]);

describe("integration tests", () => {
    it("works", async () => {
        // resLocals is just an example of a scoped variable you may want to include as part of your decision context
        const resLocals = { createPcLoader1: 1 };

        // calling decide on the PEP with user, resource, and a Loader with res locals
        const result = await pep.decide({
            user: {
                id: "userId",
                email: "test@test.com",
            },
            resource: {
                id: "resourceId",
                createdById: "userId",
            },
            loaders: [createPcLoader1(resLocals)],
        });
        chai.expect(result.response).to.equal(PermissionResponse.Deny);
    });
});
