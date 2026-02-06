/**
 * Tipos para respuestas HTTP estandarizadas
 */

export interface SuccessResponse<T = unknown> {
  status: 'success';
  data: T;
}

export interface ErrorResponse {
  status: 'error';
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T = unknown> {
  status: 'success';
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Helper para crear respuestas exitosas
 */
export const successResponse = <T>(data: T): SuccessResponse<T> => ({
  status: 'success',
  data,
});

/**
 * Helper para crear respuestas paginadas
 */
export const paginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> => ({
  status: 'success',
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
});
