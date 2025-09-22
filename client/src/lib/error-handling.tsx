'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.handleAPIError =
  exports.UIError =
  exports.APIError =
  exports.CustomError =
    void 0;
class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}
exports.CustomError = CustomError;
class APIError extends CustomError {
  status;
  constructor(message, status) {
    super(message);
    this.status = status;
    this.status = status;
  }
}
exports.APIError = APIError;
class UIError extends CustomError {
  constructor(message) {
    super(message);
  }
}
exports.UIError = UIError;
const handleAPIError = error => {
  if (error instanceof APIError) {
    // Handle API errors (e.g., show a toast)
    console.error(`API Error (${error.status}): ${error.message}`);
  } else if (error instanceof Error) {
    // Handle other errors
    console.error(`An unexpected error occurred: ${error.message}`);
  }
};
exports.handleAPIError = handleAPIError;
