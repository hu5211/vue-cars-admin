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
    ],
    //年检状态
    yearCheck_type: [
        { label: "未年检", value: false },
        { label: "已年检", value: true }
    ],
    //档位状态
    gear_type: [
        { label: "手动", value: 1 },
        { label: "自动", value: 2 },
        { label: "人工智能", value: 3 }
    ],
    // 能源类型
    energyType: [
        { label: "电", value: 1 },
        { label: "油", value: 2 },
        { label: "混合动力", value: 3 }
    ],
    //关键字搜索
    keyWord_options: [
        { lable: "停车场名称", value: "parkingName" },
        { lable: "详细区域", value: "address" }
    ]
}

export default {
    namespaced: true,
    state,
};
