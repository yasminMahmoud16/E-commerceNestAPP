export interface IMulterFile extends Express.Multer.File{
    finalPath?:string
}

export interface IAttachment{
    secure_url: string;
    public_id: string;
}

