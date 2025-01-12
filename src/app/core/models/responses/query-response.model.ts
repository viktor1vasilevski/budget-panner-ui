export interface QueryResponse<T> {
    data: T | T[];
    success: boolean;
    message?: string;
    //notificationType: NotificationType;
  }