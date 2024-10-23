import {createAsyncThunk} from '@reduxjs/toolkit';

import {getRequest} from '../../../network/network';
import {IUser} from '../../../types';
import {AxiosError} from 'axios';

export const fetchUser = createAsyncThunk(
  'users/fetchUser',
  async (_, thunkAPI) => {
    try {
      const response = await getRequest('user.json');
      if (response.status !== 200) {
        return thunkAPI.rejectWithValue(
          new AxiosError(`Request error: ${response.status} code`),
        );
      }
      response.data = {
        ...response.data,
        profileImage: response.data['profile-image'],
      };
      return response.data as IUser;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  },
);
