export interface IResponseError {
  message: string;
  status: number;
}

export interface IResponse<T> {
  body?: T;
  ok: boolean;
  error?: IResponseError;
}
