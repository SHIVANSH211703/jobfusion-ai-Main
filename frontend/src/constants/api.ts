const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

export const API = {
  BASE_URL: API_BASE_URL,

  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH_TOKEN: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
    SEND_VERIFICATION_EMAIL: "/auth/send-verification-email",
    VERIFY_EMAIL: "/auth/verify-email",
  },

  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile",
    UPLOAD_AVATAR: "/profile/avatar",
  },

  DASHBOARD: {
    GET: "/dashboard",
    ANALYTICS: "/dashboard/analytics",
  },

  INTERVIEWS: {
    GET_ALL: "/interviews",
    CREATE: "/interviews",
    PREPARE: "/interviews/preparation",
    UPDATE: (id: string) => `/interviews/${id}`,
    DELETE: (id: string) => `/interviews/${id}`,
  },

  NOTIFICATIONS: {
    GET_ALL: "/notifications",
    READ_ALL: "/notifications/read-all",
    READ: (id: string) => `/notifications/${id}/read`,
  },

  RESUME: {
    GET_ALL: "/resume",
    CREATE: "/resume",
    UPLOAD: "/resume-upload",

    GET_BY_ID: (id: string) => `/resume/${id}`,
    UPDATE: (id: string) => `/resume/${id}`,
    DELETE: (id: string) => `/resume/${id}`,

    ANALYZE: (id: string) => `/resume/${id}/analyze`,
    IMPROVE: (id: string) => `/resume/${id}/improve`,
    TAILOR: (id: string) => `/resume/${id}/tailor`,
    CAREER_GAP: (id: string) => `/resume/${id}/career-gap`,
    JOB_MATCH: (id: string) => `/resume/${id}/job-match`,
    COVER_LETTER: (id: string) => `/resume/${id}/cover-letter`,
    VERSIONS: (id: string) => `/resume/${id}/versions`,
    VERSION: (id: string, versionId: string) => `/resume/${id}/versions/${versionId}`,
    RESTORE_VERSION: (id: string, versionId: string) => `/resume/${id}/versions/${versionId}/restore`,
  },

  JOBS: {
    GET_ALL: "/jobs",
    SEARCH: "/jobs/search",
    SAVED_SEARCHES: "/jobs/saved-searches",
    SAVED_SEARCH: (id: string) => `/jobs/saved-searches/${id}`,

    GET_BY_ID: (id: string) => `/jobs/${id}`,

    SAVED: "/jobs/saved",
    APPLIED: "/jobs/applied",

    SAVE: (id: string) => `/jobs/${id}/save`,
    UNSAVE: (id: string) => `/jobs/${id}/save`,

    APPLY: (id: string) => `/jobs/${id}/apply`,
    APPLICATION: (id: string) => `/jobs/${id}/application`,

    MATCH: (id: string) => `/jobs/${id}/match`,
  },
} as const;