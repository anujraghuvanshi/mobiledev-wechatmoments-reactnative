import {ActionReducerMapBuilder, createSlice} from '@reduxjs/toolkit';
import {ITweet, RequestStatus} from '../../../types';
import {fetchUserTweets} from './tweets.thunk';
import {TWEET_LIMIT} from '../../../constants/constants';

interface ITweetsState {
  status: RequestStatus;
  displayedTweets: Array<ITweet>;
  allTweets: Array<ITweet>;
  page: number;
  isRefreshing: boolean;
}

const initialState: ITweetsState = {
  isRefreshing: false,
  displayedTweets: [],
  status: RequestStatus.IDLE,
  allTweets: [],
  page: 1,
};

const tweetsSlice = createSlice({
  name: 'tweets',
  initialState,
  reducers: {
    loadMoreTweets: (nextState: ITweetsState) => {
      nextState.page = nextState.page + 1;
      nextState.displayedTweets = nextState.allTweets.slice(
        0,
        nextState.page * TWEET_LIMIT,
      );
    },
    refreshTweets: (nextState: ITweetsState) => {
      nextState.page = 1;
      nextState.displayedTweets = nextState.allTweets.slice(
        0,
        nextState.page * TWEET_LIMIT,
      );
      nextState.isRefreshing = false;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<ITweetsState>) => {
    builder.addCase(fetchUserTweets.pending, nextState => {
      nextState.displayedTweets = [];
      nextState.status = RequestStatus.PENDING;
    });
    builder.addCase(fetchUserTweets.fulfilled, (nextState, action) => {
      // nextState.allTweets = action.payload.filter(tweet => tweet.sender);
      nextState.allTweets = action.payload;
      nextState.status = RequestStatus.SUCCESSFULL;
      nextState.displayedTweets = nextState.allTweets.slice(0, TWEET_LIMIT);
      nextState.page = 1;
    });
    builder.addCase(fetchUserTweets.rejected, nextState => {
      nextState.status = RequestStatus.FAILED;
    });
  },
});

export const {loadMoreTweets, refreshTweets} = tweetsSlice.actions;

export default tweetsSlice.reducer;
