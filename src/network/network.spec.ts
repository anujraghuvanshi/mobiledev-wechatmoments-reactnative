import axios from 'axios';
import {getRequest} from './network';

jest.mock('axios');

describe('getRequest', () => {
  const BASE_URL =
    'https://techops-recsys-lateral-hiring.github.io/moments-data';

  it('should make a GET request to the correct URL', async () => {
    const mockData = {data: {message: 'Success'}};
    (axios.get as jest.Mock).mockResolvedValue(mockData);

    const url = 'test-endpoint';
    const response = await getRequest(url);

    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/${url}`);
    expect(response).toEqual(mockData);
  });

  it('should handle errors correctly', async () => {
    const mockError = new Error('Request failed');
    (axios.get as jest.Mock).mockRejectedValue(mockError);

    const url = 'invalid-endpoint';

    await expect(getRequest(url)).rejects.toThrow('Request failed');
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/${url}`);
  });
});
