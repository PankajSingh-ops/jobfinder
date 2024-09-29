"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchProfileData } from '@/store/slices/profileSlice';
import Header from '@/app/common/ui/Header';

function ProfilePage() {
  const dispatch: AppDispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await dispatch(fetchProfileData()).unwrap();
        console.log(profileData);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div>
      <Header />
      {profile.fullname ? (
        <div>
          <h1>{profile.fullname}</h1>
          <p>{profile.email}</p>
          <p>{profile._id}</p>
          <p>{profile.gender}</p>
          {/* Add other profile details as needed */}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

export default ProfilePage;
