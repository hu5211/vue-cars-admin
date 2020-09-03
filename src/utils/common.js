import store from "@/store";
//省市街道
export function address(value) {
    let address = value;
    let addressInfo = "";
    if (address) {
        let split = address.split(",");
        addressInfo += split[0];
        //街道详细
        if (split[1]) {
            addressInfo += `<br />${split[1]}`;
        }
    }
    return addressInfo;
}

//停车场类型
export function parkingType(value) {
    const data = store.state.config.parking_type_json[value];
    if (data) { return data.label; }
}

//年检类型
export function yearCheckType(value) {
    const data = store.state.config.yearCheck_type;
    const filterData = data.filter(item => item.value == value);
    if (filterData.length > 0) {
        return filterData[0].label;
    } else {
        return "";
    }
}

//能源类型
export function energyType(value) {
    const data = store.state.config.energyType;
    const filterData = data.filter(item => item.value === parseInt(value));
    if (filterData.length > 0) {
        return filterData[0].label;
    } else {
        return "";
    }
}