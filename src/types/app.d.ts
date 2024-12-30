export interface IErrorObj {
  [key: string]: { statusCode: number; message: string };
}

export interface IProfile {
  fullname: string;
  username: string;
  photoProfile?: string;
  cover?: string;
  bio?: string;
}
