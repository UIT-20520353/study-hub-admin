export interface IResponseError {
  message: string;
  status: number;
}

export interface IResponse<T> {
  body?: T;
  ok: boolean;
  error?: IResponseError;
}

export interface IListResponse<T> {
  totalPages: number;
  totalElements: number;
  items: T[];
  pageSize: number;
  currentPage: number;
}
