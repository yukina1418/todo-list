export const ResponseType = {
  auth: {
    login: { code: 201, msg: '로그인을 성공했습니다.' },
    restoreAccessToken: {
      code: 201,
      msg: '액세스 토큰 재발행을 성공했습니다.',
    },
  },
  user: {
    fetch: { code: 200, msg: '유저 정보 조회를 성공했습니다.' },
    create: { code: 201, msg: '회원가입이 완료되었습니다.' },
    update: { code: 200, msg: '회원정보 수정이 완료되었습니다.' },
    delete: { code: 200, msg: '회원탈퇴가 완료되었습니다.' },
  },
};
