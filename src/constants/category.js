export const USER_CATEGORIES = [
  {name: "내 정보", component: "UserDetail"},
  {name: "참여 내역", component: "NotFound"},
]

export const MANAGER_CATEGORIES = [
  {name: "내 정보", component: "UserDetail"},
  {name: "유저 관리", component: "UserManagement"},
  {name: "매치 관리", component: "MatchManagement"},
  {name: "투표 관리", component: "VoteManagement"},
  {name: "구장 관리", component: "GroundManagement"},
]

export const getCategories = (role) => {
  if (role === "ADMIN" || role === "MANAGER")
    return MANAGER_CATEGORIES;
  else return USER_CATEGORIES;
}

