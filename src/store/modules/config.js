import { setToken, setUsername, getUsername, removeToken, removeUsername } from "@/utils/cookies";
const state = {
    //停车场类型 JSON
    parking_type_json: {
        1: { label: "室内", value: 1 },
        2: { label: "室外", value: 2 }
    },
    //停车场类型
    parking_type: [
        { label: "室内", value: 1 },
        { label: "室外", value: 2 }
    ],
    //停车场状态
    radio_status: [
        { label: "禁用", value: false },
        { label: "启用", value: true }
    ]
}

export default {
    namespaced: true,
    state,
};
