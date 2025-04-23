import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserData, updateProfile } from '@/api/users';
import type { UpdateProfileDto } from '@/api/dto';

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const userData = await fetchUserData();
  return userData;
});

export const updateUser = createAsyncThunk(
  'users/update',
  async (updateData: UpdateProfileDto) => {
    const response = await updateProfile(updateData);
    if (response.error) {
      throw new Error(response.error.message);
    }
    const updatedUser = await fetchUserData();
    return updatedUser;
  },
);
