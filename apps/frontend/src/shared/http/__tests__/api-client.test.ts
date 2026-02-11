import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../api-client';

// Mock global de fetch
global.fetch = vi.fn();

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET requests', () => {
    it('makes successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ status: 'success', data: mockData }),
      } as Response);

      const result = await apiClient.get('/test');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('handles GET request error', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Resource not found' }),
      } as Response);

      await expect(apiClient.get('/not-found')).rejects.toMatchObject({
        status: 404,
        message: 'Resource not found',
      });
    });
  });

  describe('POST requests', () => {
    it('makes successful POST request with data', async () => {
      const mockData = { id: 1, name: 'Created' };
      const postData = { name: 'New Item' };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({ status: 'success', data: mockData }),
      } as Response);

      const result = await apiClient.post('/items', postData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/items'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('handles POST request error', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Invalid data', code: 'VALIDATION_ERROR' }),
      } as Response);

      await expect(apiClient.post('/items', {})).rejects.toMatchObject({
        status: 400,
        message: 'Invalid data',
        code: 'VALIDATION_ERROR',
      });
    });
  });

  describe('PUT requests', () => {
    it('makes successful PUT request', async () => {
      const mockData = { id: 1, name: 'Updated' };
      const putData = { name: 'Updated Item' };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ status: 'success', data: mockData }),
      } as Response);

      const result = await apiClient.put('/items/1', putData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/items/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(putData),
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('PATCH requests', () => {
    it('makes successful PATCH request', async () => {
      const mockData = { id: 1, name: 'Patched' };
      const patchData = { name: 'Patched Item' };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ status: 'success', data: mockData }),
      } as Response);

      const result = await apiClient.patch('/items/1', patchData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/items/1'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(patchData),
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('DELETE requests', () => {
    it('makes successful DELETE request', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 204,
      } as Response);

      const result = await apiClient.delete('/items/1');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/items/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(result).toBeUndefined();
    });
  });

  describe('Error handling', () => {
    it('handles network errors', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        status: 0,
        message: 'Error de conexión con el servidor',
      });
    });

    it('handles non-JSON error responses', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as unknown as Response);

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        status: 500,
        message: 'Internal Server Error',
      });
    });
  });
});
