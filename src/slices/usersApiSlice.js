
import { authApi } from './authApiSlice'

// const USER_URL = 'api/users'
const USER_URL = 'api/user'
const AUTH_URL = 'api/auth'

export const userApiSlice = authApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/register`,
        method: 'POST',
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: 'POST',
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    sendVerificationOtp: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/send-verify-otp`,
        method: 'POST',
      }),
    }),
    verifyOtp: builder.mutation({
      query: (otp) => ({
        url: `${AUTH_URL}/verify-account`,
        method: 'POST',
        body: { otp },
      }),
    }),
    sendResetOtp: builder.mutation({
      query: (email) => ({
        url: '/api/auth/send-reset-otp',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ email, otp, newPassword }) => ({
        url: '/api/auth/reset-password',
        method: 'POST',
        body: { email, otp, newPassword },
      }),
    }),
    // getAuthState: builder.query({
    //   query: () => `${AUTH_URL}/is-auth`,
    // }),
    // fetchUserData: builder.query({
    //   query: () => `${AUTH_URL}/data`,
    //   providesTags: ['User'],
    // }),
  }),
})
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useUpdateUserMutation,
  // useGetAuthStateQuery,
  // useFetchUserDataQuery,
  useSendVerificationOtpMutation,
  useVerifyOtpMutation,
  useSendResetOtpMutation,
  useResetPasswordMutation
} = userApiSlice