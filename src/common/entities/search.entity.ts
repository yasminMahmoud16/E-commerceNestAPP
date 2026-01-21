export class GetAllResponse<T=any> {
    result:{
        docsCount?: number,
        limit?: number,
        page?: number
        currentPage?: number | undefined,
        result: T[] 
    }
}