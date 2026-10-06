// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// const ChangePassword = () => {
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setMessage('');
//     setError('');

//     if (newPassword !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('userToken');

//       const response = await axios.post(
//         'http://localhost:5001/api/user/change-password',
//         {
//           currentPassword,
//           newPassword,
//           confirmPassword
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       setMessage(response.data.message);

//       setCurrentPassword('');
//       setNewPassword('');
//       setConfirmPassword('');
//     } catch (error) {
//       setError(
//         error.response?.data?.message || 'Something went wrong'
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

//       <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">

//         <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
//           Change Password
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Current Password
//             </label>

//             <input
//               type="password"
//               placeholder="Enter current password"
//               value={currentPassword}
//               onChange={(e) => setCurrentPassword(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               New Password
//             </label>

//             <input
//               type="password"
//               placeholder="Enter new password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Confirm New Password
//             </label>

//             <input
//               type="password"
//               placeholder="Confirm new password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
//               required
//             />
//           </div>

//           {error && (
//             <p className="text-sm text-red-600">
//               {error}
//             </p>
//           )}

//           {message && (
//             <p className="text-sm text-green-600">
//               {message}
//             </p>
//           )}

//           <button
//             type="submit"
//             className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Change Password
//           </button>

//         </form>

//         <div className="text-center mt-4">
//           <Link
//             to="/dashboard"
//             className="text-sm text-blue-600 hover:underline"
//           >
//             Back to Dashboard
//           </Link>
//         </div>

//       </div>

//     </div>
//   );
// };

// export default ChangePassword;
