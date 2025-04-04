import { defineStore } from "pinia"

export const useCategories = defineStore("categories", () => {
    const userCategories = [
        {name: "내 정보", component: "UserDetail"},
        {name: "참여 내역", component: "NotFound"},
        {name: "로그아웃", component: "Login"},
    ];

    const managerCategories = [
        {name: "내 정보", component: "UserDetail"},
        {name: "유저 관리", component: "UserManagement"},
        {name: "로그아웃", component: "Login"},
    ];

    const getCategories = (auth) => {
        if (auth === "ADMIN" || auth === "MANAGER") {
            return managerCategories;
        } else {
            return userCategories;
        }
    };
    return { getCategories };
});