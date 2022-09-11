export const ErrorType = {
  auth: {
    unauthorized: { code: 401, msg: '인증에 실패했습니다.' },
    forbidden: { code: 403, msg: '권한이 없습니다.' },
  },
  user: {
    notFound: { code: 404, msg: '존재하지 않는 유저입니다.' },
    forbidden: { code: 403, msg: '권한이 없습니다.' },
    conflict: { code: 409, msg: '사용할 수 없는 이메일입니다.' },
  },
};
