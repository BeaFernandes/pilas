export type ApiError = { [key: string]: string }

export class ApiHandleError extends Error {
    errorCode: number
    //data: string | { [key: string]: string | Iterable<string> } | null
    data: ApiError
  
    constructor(
      errorCode: number,
      data: ApiError
    ) {
      super()
      this.errorCode = errorCode
      this.data = data
    }
  }
  