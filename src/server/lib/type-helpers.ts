import { PrimitiveTypes } from "./types";

export function hasKeys(obj:object,  keys : {name: string; type:PrimitiveTypes}[] ){
    let valid = true;
    keys.forEach((key)=>{
        let index = Object.keys(obj).indexOf(key.name);
        Object.keys(obj) as string[]
        if(index === -1){
            valid = false;
        }
        else if(typeof obj[Object.keys(obj)[index] as keyof typeof obj] !== key.type){
            valid = false;
        }
    })
    return valid;
}