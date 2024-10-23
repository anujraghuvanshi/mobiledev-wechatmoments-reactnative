import {AxiosError} from 'axios';
import {getRequest} from '../../../network/network';
import {store} from '../../../store';
import {fetchUser} from './user.thunk';

jest.mock('../../../network/network', () => ({
  getRequest: jest.fn(),
}));

describe('User thunk', () => {
  it('should succeed and dispatch action fulfilled', async () => {
    const mockRes = {id: 1, name: 'Anuj Singh'};
    (getRequest as jest.Mock).mockResolvedValue({
      status: 200,
      data: mockRes,
    });

    const result = await store.dispatch(fetchUser());

    expect(getRequest).toHaveBeenCalledWith('user.json');
    expect(result.type).toBe('users/fetchUser/fulfilled');
    expect(result.payload).toEqual(mockRes);
  });

  it('should fail and dispatch action rejected', async () => {
    const error = new Error('Promise failed');
    (getRequest as jest.Mock).mockRejectedValue(error);

    const result = await store.dispatch(fetchUser());

    expect(getRequest).toHaveBeenCalledWith('user.json');
    expect(result.type).toBe('users/fetchUser/rejected');

    expect(result.payload).toBe(error);
  });

  it('should dispatch rejected action when error code is not 200', async () => {
    const errRes = {status: 500};
    (getRequest as jest.Mock).mockResolvedValue(errRes);

    const result = await store.dispatch(fetchUser());

    expect(result.type).toBe('users/fetchUser/rejected');

    expect(result.payload).toBeInstanceOf(AxiosError);
  });
});
