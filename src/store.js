import { Store } from "pullstate";

export const userStore = new Store({
    isLoggedIn: false,
    token: null,
    user: null,
    userStudent:null
})

export const assignmentStore = new Store({
    assignmentsL:[]
})
