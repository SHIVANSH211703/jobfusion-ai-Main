export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,

  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH_TOKEN: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile",
    UPLOAD_AVATAR: "/profile/avatar",
  },

  RESUME: {
    GET_ALL: "/resume",
    CREATE: "/resume",
    UPLOAD: "/resume/upload",

    GET_BY_ID: (id: string) => `/resume/${id}`,
    UPDATE: (id: string) => `/resume/${id}`,
    DELETE: (id: string) => `/resume/${id}`,

    ANALYZE: (id: string) => `/resume/${id}/analyze`,
    IMPROVE: (id: string) => `/resume/${id}/improve`,
    JOB_MATCH: (id: string) => `/resume/${id}/job-match`,
    COVER_LETTER: (id: string) => `/resume/${id}/cover-letter`,
  },
} as const;