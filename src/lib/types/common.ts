export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type AsyncResult<T> = Promise<{
  data?: T;
  error?: string;
}>;

export type ValidationResult = {
  isValid: boolean;
  errors?: string[];
};