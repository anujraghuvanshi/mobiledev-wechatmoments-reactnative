import {AxiosError} from 'axios';
import {getRequest} from '../../../network/network';
import {store} from '../../../store';
import {fetchUserTweets} from './tweets.thunk';
import {mockTweets} from './tweets.mock';

jest.mock('../../../network/network', () => ({
  getRequest: jest.fn(),
}));

describe('Tweet thunk', () => {
  it('should succeed and dispatch action fulfilled', async () => {
    const mockRes = {
      status: 200,
      data: mockTweets,
    };
    (getRequest as jest.Mock).mockResolvedValue(mockRes);

    const result = await store.dispatch(fetchUserTweets());

    expect(getRequest).toHaveBeenCalledWith('tweets.json');
    expect(result.type).toBe('tweets/userTweets/fulfilled');
    expect(result.payload).toEqual(mockTweets);
  });

  it('should fail and dispatch action rejected', async () => {
    const error = new Error('Promise failed');
    (getRequest as jest.Mock).mockRejectedValue(error);

    const result = await store.dispatch(fetchUserTweets());

    expect(getRequest).toHaveBeenCalledWith('tweets.json');
    expect(result.type).toBe('tweets/userTweets/rejected');

    expect(result.payload).toEqual(error);
  });

  it('should dispatch rejected action when error code is not 200', async () => {
    const errRes = {status: 500};
    (getRequest as jest.Mock).mockResolvedValue(errRes);

    const result = await store.dispatch(fetchUserTweets());

    expect(result.type).toBe('tweets/userTweets/rejected');

    expect(result.payload).toBeInstanceOf(AxiosError);
  });
});
