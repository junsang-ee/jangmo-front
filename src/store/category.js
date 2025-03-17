import { defineStore } from "pinia"

export const useCategories = defineStore("categories", () => {
    const userCategories = [
        {name: "내 정보", component: "UserDetail"},
        {name: "참여 내역", component: "NotFound"}
    ];

    const managerCategories = [
        {name: "내 정보", component: "UserDetail"},
        {name: "유저 관리", component: "NotFound"},
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