import { HttpParams, HttpHeaders } from "@angular/common/http";

export type RequestOptions = {
    params?: HttpParams | { [param: string]: string | string[] };
    responseType?:"json" | "blob" | "text";
    headers?: HttpHeaders;
}