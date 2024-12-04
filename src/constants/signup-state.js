export const SignupState = {
    ENTER_MOBILE: 'ENTER_MOBILE',
    ENTER_CODE: 'ENTER_CODE',
    ENTER_DETAIL: 'ENTER_DETAIL',
};

export const SignupMessage = {
    [SignupState.ENTER_MOBILE]: '인증번호 발송',
    [SignupState.ENTER_CODE]: '인증번호 확인',
    [SignupState.ENTER_DETAIL]: '회원가입 완료',
};