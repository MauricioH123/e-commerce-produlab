import { capitalizeWords } from "../utils/stringUtils.js";


export function createCategoryDTO(name:string):string{
    return capitalizeWords(name)
}