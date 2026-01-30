import { CreateOptions, DeleteResult, HydratedDocument, Types, UpdateWriteOpResult } from "mongoose";
import { FlattenMaps, Model, MongooseUpdateQueryOptions, PopulateOptions, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";

export type Lean<T> =FlattenMaps<T>;
export abstract class DatabaseRepository<TRowDocument, TDocument=HydratedDocument<TRowDocument>> {
    constructor(protected model:Model<TDocument>){}



    async findOne({ filter, select, options }: {
        // RootFilterQuery partial on types 
        filter?: RootFilterQuery<TRowDocument>,
        select?: ProjectionType<TRowDocument> | null,
        options?: QueryOptions<TDocument> | null
    }): Promise<
        | TDocument
        | null
    > {

        const doc = this.model.findOne(filter).select(select || "");
        if (options?.populate) {
            doc.populate(options?.populate as PopulateOptions | PopulateOptions[]);
        };
        if (options?.lean) {
            doc.lean(options?.lean)
        };
        return await doc.exec()
    }
    async findById({ id, select, options }: {
        // RootFilterQuery partial on types 
        id?: RootFilterQuery<TRowDocument> | any,
        select?: ProjectionType<TRowDocument> | null,
        options?: QueryOptions<TDocument> | null
    }): Promise<
        Lean<TDocument>
        | TDocument
        | null
    > {

        const doc = this.model.findById(id).select(select || "");
        if (options?.populate) {
            doc.populate(options?.populate as PopulateOptions[]);
        };
        if (options?.lean) {
            doc.lean(options?.lean)
        };
        return await doc.exec()
    }
    async find({ filter, select, options }: {
        // RootFilterQuery partial on types 
        filter?: RootFilterQuery<TRowDocument>,
        select?: ProjectionType<TRowDocument> | undefined,
        options?: QueryOptions<TDocument> | undefined
    }): Promise<
        TDocument[]
        | []
        | Lean<TDocument>[]
    > {

        const doc = this.model.find(filter || {}).select(select || "");
        if (options?.populate) {
            doc.populate(options?.populate as PopulateOptions[]);
        };
        if (options?.lean) {
            doc.lean(options?.lean)
        };
        if (options?.skip) {
            doc.skip(options?.skip)
        };
        if (options?.limit) {
            doc.limit(options?.limit)
        };
        return await doc.exec()
    };
    async paginate({
        filter = {},
        select,
        options = {},
        page = "all",
        size = 5
    }: {
        // RootFilterQuery partial on types 
        filter: RootFilterQuery<TDocument>,
        select?: ProjectionType<TDocument> | undefined,
        options?: QueryOptions<TDocument> | undefined
        page?: number | "all",
        size?: number,
    }): Promise<
        {
            docsCount?:number,
            limit?: number,
            page?:number
            currentPage?:number | undefined,
            result:TDocument[] |Lean<TDocument>[]
        }
    > {
        let docsCount: number | undefined = undefined;
        let pages: number | undefined = undefined;
        if (page !== "all") {
            page = Math.floor(!page || page < 1 ? 1 : page);
            options.limit = Math.floor(size < 1 || !size ? 5 : size);
            options.skip = (page - 1) * options.limit;

            console.log(await this.model.estimatedDocumentCount()); //collection meta data / fast /without filter
            console.log(await this.model.countDocuments(filter)); //with filter / count the freeze / query middleware
            docsCount = await this.model.countDocuments(filter);
            pages = Math.ceil(docsCount / options.limit);
        }
        const result = await this.find({ filter, select, options })



        return {
            docsCount,
            limit: options.limit,
            currentPage: page !== "all" ? page : undefined,
            result
        }
    };
    async create({
        data,
        options,
    }: {
            data: Partial<TRowDocument>[],
        options?: CreateOptions | undefined
    }): Promise<TDocument[]> {
        return await this.model.create(data, options)||[]
    }
    async insertMany({
        data,
    }: {
        data: Partial<TDocument>[],
    }): Promise<TDocument[]> {
        return await this.model.insertMany(data) as TDocument[];
    }


    async updateOne({
        filter,
        update,
        options
    }: {
            filter: RootFilterQuery<TRowDocument>,
        update?: UpdateQuery<TDocument>,
        options?: MongooseUpdateQueryOptions<TDocument> | null
    }): Promise<UpdateWriteOpResult> {
        if (Array.isArray(update)) {
            update.push({
                $set: {
                    __v: { $add: ["$__v", 1] }
                }
            })
            return await this.model.updateOne(filter || {}, update, options)
        };

        console.log({
            ...update,
            $inc: { __v: 1 }
        });

        return await this.model.updateOne(filter, {
            ...update,
            $inc: { __v: 1 }
        }, options)
    };
    async updateMany({
        filter,
        update,
        options
    }: {
            filter: RootFilterQuery<TRowDocument>,
        update?: UpdateQuery<TDocument>,
        options?: MongooseUpdateQueryOptions<TDocument> | null
    }): Promise<UpdateWriteOpResult> {
        if (Array.isArray(update)) {
            update.push({
                $set: {
                    __v: { $add: ["$__v", 1] }
                }
            })
            return await this.model.updateMany(filter || {}, update, options)
        };

        console.log({
            ...update,
            $inc: { __v: 1 }
        });

        return await this.model.updateOne(filter, {
            ...update,
            $inc: { __v: 1 }
        }, options)
    };


    async findByIdAndUpdate({
        id,
        update,
        options = { new: true }
    }: {
        id?: Types.ObjectId,
        update?: UpdateQuery<TDocument>,
        options?: QueryOptions<TDocument> | null
    }): Promise<TDocument | Lean<TDocument> | null> {
        return await this.model.findByIdAndUpdate(
            id, {
            ...update,
            $inc: { __v: 1 }
        }, options)
    };
    async findOneAndUpdate({
        filter,
        update,
        options = { new: true }
    }: {
            filter?: RootFilterQuery<TRowDocument>,
        update?: UpdateQuery<TDocument>,
        options?: QueryOptions<TDocument> | null
        }): Promise<TDocument  | null> {
        if (Array.isArray(update)) {
            update.push({
                $set: {
                    __v: { $add: ["$__v", 1] }
                }
            })
            return await this.model.findOneAndUpdate(filter || {}, update, options)
        };
        return await this.model.findOneAndUpdate(
            filter, {
            ...update,
            $inc: { __v: 1 }
        }, options)
    };



    async deleteOne({
        filter,
        // options

    }: {
            filter: RootFilterQuery<TRowDocument>,
        // options?: (DeleteOptions & MongooseBaseQueryOptions<TDocument>) | null


    }): Promise<DeleteResult> {
        return await this.model.deleteOne(filter);
    };


    async findOneAndDelete({
        filter,
        options

    }: {
            filter: RootFilterQuery<TRowDocument>,
        options?: QueryOptions<TDocument> | null

    }): Promise<TDocument | null> {
        return await this.model.findOneAndDelete(filter, options);
    };
    async deleteMany({
        filter,

    }: {
        filter: RootFilterQuery<TDocument>,

    }): Promise<DeleteResult> {
        return await this.model.deleteMany(filter);
    };
}