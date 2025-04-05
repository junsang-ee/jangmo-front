export const USER_CATEGORIES = [
  {name: "내 정보", component: "UserDetail"},
  {name: "참여 내역", component: "NotFound"},
  {name: "로그아웃", component: "Login"},
]

export const MANAGER_CATEGORIES = [
  {name: "내 정보", component: "UserDetail"},
  {name: "유저 관리", component: "UserManagement"},
  {name: "로그아웃", component: "Login"},
]

export const getCategories = (role) => {
  if (role === "ADMIN" || role === "MANAGER")
    return MANAGER_CATEGORIES;
  else return USER_CATEGORIES;
}

