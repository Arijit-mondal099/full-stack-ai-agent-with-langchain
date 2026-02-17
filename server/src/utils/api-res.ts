
export class ApiResponse<T> {
  status: number;
  message: string;
  success: boolean;
  data: T | null;

  constructor(status: number, message: string, data: T | null = null) {
    this.status = status;
    this.success = status < 400;
    this.message = message;
    this.data = data;
  }
}
