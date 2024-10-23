import {createAsyncThunk} from '@reduxjs/toolkit';

import {getRequest} from '../../../network/network';
import {ITweet} from '../../../types';
import {AxiosError} from 'axios';

export const fetchUserTweets = createAsyncThunk(
  'tweets/userTweets',
  async (_, thunkAPI) => {
    try {
      const response = await getRequest('tweets.json');
      if (response.status !== 200) {
        return thunkAPI.rejectWithValue(
          new AxiosError(`Request error: ${response.status} code`),
        );
      }
      return response.data as Array<ITweet>;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  },
);
