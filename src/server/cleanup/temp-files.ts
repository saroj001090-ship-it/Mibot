export type TempFileRecord={key:string;createdAt:Date;expiresAt:Date;userConsented:boolean};
export function shouldDeleteTempFile(file:TempFileRecord,now=new Date()){return file.expiresAt<=now;}
