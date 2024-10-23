import reducer, {loadMoreTweets, refreshTweets} from './tweets.slice';
import {RequestStatus} from '../../../types';
import {fetchUserTweets} from './tweets.thunk';
import {TWEET_LIMIT} from '../../../constants/constants';
import {mockTweets} from './tweets.mock';

describe('tweetsSlice', () => {
  const initialState = {
    isRefreshing: false,
    displayedTweets: [],
    status: RequestStatus.IDLE,
    allTweets: [],
    page: 1,
  };

  it('should return the initial state when no action is passed', () => {
    expect(reducer(undefined, {type: undefined})).toEqual(initialState);
  });

  describe('loadMoreTweets', () => {
    it('should increase the page number and load more tweets', () => {
      const previousState = {
        ...initialState,
        allTweets: Array.from({length: 20}, () => mockTweets[0]),
        displayedTweets: Array.from({length: TWEET_LIMIT}, () => mockTweets[0]),
        page: 1,
      };

      const nextState = reducer(previousState, loadMoreTweets());

      expect(nextState.page).toEqual(2);
      expect(nextState.displayedTweets.length).toEqual(TWEET_LIMIT * 2);
    });
  });

  describe('refreshTweets', () => {
    it('should reset the page and refresh the displayed tweets', () => {
      const previousState = {
        ...initialState,
        allTweets: Array.from({length: 20}, () => mockTweets[0]),
        displayedTweets: Array.from({length: 5}, () => mockTweets[0]),
        page: 2,
      };

      const nextState = reducer(previousState, refreshTweets());

      expect(nextState.page).toEqual(1);
      expect(nextState.displayedTweets.length).toEqual(TWEET_LIMIT);
      expect(nextState.isRefreshing).toEqual(false);
    });
  });

  describe('extraReducers', () => {
    it('should handle fetchUserTweets.pending', () => {
      const nextState = reducer(initialState, {
        type: fetchUserTweets.pending.type,
      });

      expect(nextState.status).toEqual(RequestStatus.PENDING);
      expect(nextState.displayedTweets).toEqual([]);
    });

    it('should handle fetchUserTweets.fulfilled with valid data', () => {
      const tweets = Array.from({length: 20}, () => mockTweets[0]);

      const nextState = reducer(initialState, {
        type: fetchUserTweets.fulfilled.type,
        payload: tweets,
      });

      expect(nextState.status).toEqual(RequestStatus.SUCCESSFULL);
      expect(nextState.allTweets.length).toEqual(tweets.length);
      expect(nextState.displayedTweets.length).toEqual(TWEET_LIMIT);
      expect(nextState.page).toEqual(1);
    });

    it('should handle fetchUserTweets.rejected', () => {
      const nextState = reducer(initialState, {
        type: fetchUserTweets.rejected.type,
      });

      expect(nextState.status).toEqual(RequestStatus.FAILED);
    });
  });
});
