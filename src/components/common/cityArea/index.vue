<template>
  <el-cascader
    :class="{'cascader-input' : initValueFlag}"
    :placeholder="initValue"
    v-model="value"
    :options="cascader_options"
    :props="cascader_props"
    @change="changeValue"
  ></el-cascader>
</template>

<script>
import { GetCity } from "@/api/common";
export default {
  name: "cityArea",
  data() {
    const _this = this;
    return {
      address: [],
      addressData: {},
      value: "",
      cascader_options: [],
      cascader_props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const level = node.level;
          //请求参数
          const requestData = {};
          //声明自定义配置
          const jsonType = {
            0: { type: "province" },
            1: { type: "city", code: "province" },
            2: { type: "area", code: "city" }
          };
          if (jsonType[level].code) {
            requestData[`${jsonType[level].code}_code`] = node.value;
          }
          requestData.type = jsonType[level].type;

          GetCity(requestData).then(resonse => {
            const data = resonse.data.data;
            const type = jsonType[level].type.toUpperCase();
            //自定义 value label
            data.forEach(item => {
              item.value = item[`${type}_CODE`];
              item.label = item[`${type}_NAME`];
              if (level === 2) {
                item.leaf = level >= 2;
              }
            });
            //存储省市数据
            _this.addressData[jsonType[level].type] = data;
            //返回节点数据
            resolve(data);
          });
          // 获取address
          if (node.level !== 0) {
            _this.getAddress(node);
          }
        }
      },
      initValue: "请选择省市区",
      initValueFlag: false
    };
  },
  methods: {
    //初始化默认值
    initDefault(value) {
      if (value) {
        this.initValueFlag = true;
        this.initValue = value.split(",").join(" / ");
      }
    },
    changeValue(value) {
      this.$emit("update:cityAreaValue", value.join());
      //匹配最后一项
      const lastCode = value[value.length - 1];
      const area = this.addressData.area.filter(
        item => item.value == lastCode
      )[0];
      this.address[2] = area.label;
      this.getAddress();
    },
    // 获取中文地址
    getAddress(node) {
      if (node) {
        const index = node.level - 1;
        this.address[index] = node.label;
      }
      //为true时，执行地图交互
      if (this.mapLocation) {
        this.$emit("callback", {
          function: "setMapCenter",
          data: {
            address: this.address.join("")
          }
        });
      }
    },
    //清除city
    clear() {
      this.value = "";
    }
  },
  props: {
    cityAreaValue: { type: String, default: "" },
    mapLocation: { type: Boolean, default: false }
  }
};
</script>

<style lang="scss" scoped>
</style>