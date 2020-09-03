import service from "../utils/request";
/** 品牌logo */
export function BrandLogo(data = {}) {
    return service.request({
        method: "post",
        url: "/brand/logo/",
        data
    })
}

/** 品牌添加 */
export function BrandAdd(data = {}) {
    return service.request({
        method: "post",
        url: "/brand/add/",
        data
    })
}

/** 品牌列表 */
export function BrandList(data = {}) {
    return service.request({
        method: "post",
        url: "/brand/list/",
        data
    })
}

/** 品牌删除 */
export function BrandDelete(data = {}) {
    return service.request({
        method: "post",
        url: "/brand/delete/",
        data
    })
}

/** 品牌详情 */
export function BrandDetailed(data = {}) {
    return service.request({
        method: "post",
        url: "/brand/detailed/",
        data
    })
}

/** 品牌禁启用 */
export function BrandStatus(data = {}) {
    return service.request({
        method: "post",
        url: "/brand/status/",
        data
    })
}

/** 品牌编辑 */
export function BrandEdit(data = {}) {
    return service.request({
        method: "post",
        url: "/brand/edit/",
        data
    })
}