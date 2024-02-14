export default class AppError extends Error {
  constructor(
    public statuscode: number,
    public message: string,
  ) {
    super(message);
    this.statuscode = statuscode;
    Error.captureStackTrace(this, this.constructor);
  }
}
