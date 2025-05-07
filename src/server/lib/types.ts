export type User = {
    userId : number | null;
    googleId: string;
    email: string;
    name: string;
    roleId : number;
};

export type Role = {
    id : number | null;
    role : string;
}

export type PrimitiveTypes = "string" | "number" | "boolean" | "symbol" | "undefined" | "bigint" | "object" | "function";

  