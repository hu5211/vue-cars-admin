import service from "../utils/request";

/**
 * 添加车辆信息
 */
export function CarsAdd(data = {}) {
    return service.request({
        method: "post",
        url: "/cars/add/",
        data
    })
}


/** 车辆列表 */
export function CarsList(data = {}) {
    return service.request({
        method: "post",
        url: "/cars/list/",
        data
    })
}

/** 车辆删除 */
export function CarsDelete(data = {}) {
    return service.request({
        method: "post",
        url: "/cars/delete/",
        data
    })
}

/** 车辆详情 */
export function CarsDetailed(data = {}) {
    return service.request({
        method: "post",
        url: "/cars/detailed/",
        data
    })
}

/** 车辆禁启用 */
export function CarsStatus(data = {}) {
    return service.request({
        method: "post",
        url: "/cars/status/",
        data
    })
}

/** 车辆编辑 */
export function CarsEdit(data = {}) {
    return service.request({
        method: "post",
        url: "/cars/edit/",
        data
    })
}