import * as chai from "chai";

// test build output
// import pc, { IPIPConfig, IRuleConfig, IPolicyConfig } from "../../lib";
// import { and, or } from "../../lib/rules";

// test sources
import pc, { IPIPConfig, IAuthorizationRequest, IRuleConfig, IPolicyConfig, setLogLevel } from "../index";
import { and, or } from "../rules";
import { PermissionResponse } from "../xacml/AuthorizationResponse";

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

// this is a IPIPConfing builder because it can create a config with a resolve scoped to a local variable
// intended to load first before any policies evaluate (to add things like req.locals, etc)
const createPcPip1: (locals?: any) => IPIPConfig<User, any> = (locals: any) => ({
    name: "resLocals",
    resolve: () => locals,
});

// intended to be a pip that is needed to resolve before pip1
const prePip1: IPIPConfig<User, Resource> = {
    name: "prePip1",
    pips: [createPcPip1()],
    resolve: async (): Promise<{ preData: string }> => {
        return { preData: "test" };
    },
};

// intended to load as part of trueRule
const pip1: IPIPConfig<User, Resource> = {
    pips: [prePip1],
    name: "pip1",
    key: (name, user, resource) => `${name}:${user.id}:${resource.id}`,
    resolve: async (req: IAuthorizationRequest<User, Resource>): Promise<{ data: string }> => {
        // assert on some pip data that we expected to laod before us
        const prePipData = req.context.getPip(prePip1);
        chai.expect(prePipData).to.contain({ preData: "test" });
        const pcPip1 = req.context.getPip(createPcPip1());
        chai.expect(pcPip1).to.contain({ createPcPip1: 1 });
        return { data: "test" };
    },
};

// a rule that will return TRUE if pips load data correctly
const trueRule: IRuleConfig<User, Resource> = {
    name: "trueRule",
    pips: [pip1],
    evaluate: async (req: IAuthorizationRequest<User, Resource>) => {
        const result = req.context.getPip<{ data: string }>(pip1).data === "test";
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
        // resLocals is just an example of a scoped variable you may want to include as part of your authorization context
        const resLocals = { createPcPip1: 1 };

        // calling authorize on the PEP with user, resource, and a PIP with res locals
        const result = await pep.authorize({
            user: {
                id: "userId",
                email: "test@test.com",
            },
            resource: {
                id: "resourceId",
                createdById: "userId",
            },
            pips: [createPcPip1(resLocals)],
        });
        chai.expect(result.response).to.equal(PermissionResponse.Deny);
    });
});
