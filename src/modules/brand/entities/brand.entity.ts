import { IBrand } from "src/common";
import { BrandDocument, Lean } from "src/DB";

export class BrandResponse {
    brand:IBrand
}
export class GetAllResponse {
    result:{
        docsCount?: number,
        limit?: number,
        page?: number
        currentPage?: number | undefined,
        result: IBrand[] 
    }
}
