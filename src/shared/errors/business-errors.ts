export function BusinessLogicException(message: string|Record<string, any>, httpStatus: number) {
  this.message = message;
  this.httpStatus = httpStatus;
}