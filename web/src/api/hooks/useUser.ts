// // src/api/hooks/useUser.ts - This file contains the custom hook for managing user profile data.
// import { useState, useEffect } from 'react';
// import { getUserProfile, updateUserProfile, UserAccount } from '../models/userApi';

// export function useUserProfile(userId: string) {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);
//   const [profile, setProfile] = useState<UserAccount | null>(null);

//   useEffect(() => {
//     let isMounted = true;

//     async function fetchProfile() {
//       try {
//         setLoading(true);
//         const userData = await getUserProfile(userId);
        
//         if (isMounted) {
//           setProfile(userData);
//           setError(null);
//         }
//       } catch (err) {
//         if (isMounted) {
//           setError(err instanceof Error ? err : new Error('Unknown error occurred'));
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     }

//     fetchProfile();

//     return () => {
//       isMounted = false;
//     };
//   }, [userId]);

//   const updateProfile = async (userData: Parameters<typeof updateUserProfile>[1]) => {
//     try {
//       setLoading(true);
//       const updated = await updateUserProfile(userId, userData);
//       if (updated) {
//         setProfile(prev => prev ? { ...prev, ...updated } : updated);
//       }
//       return updated;
//     } catch (err) {
//       setError(err instanceof Error ? err : new Error('Unknown error occurred'));
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { profile, loading, error, updateProfile };
// }