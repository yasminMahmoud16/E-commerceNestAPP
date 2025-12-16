import {  IProduct } from "src/common";

export class ProductResponse {
    product:IProduct
}
export class GetAllResponse {
    result:{
        docsCount?: number,
        limit?: number,
        page?: number
        currentPage?: number | undefined,
        result: IProduct[] 
    }
}
