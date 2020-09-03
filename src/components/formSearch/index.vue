<template>
  <el-form inline :inline-message="true" :model="form_data" ref="form" size="small">
    <el-form-item
      v-for="item in formItem"
      :key="item.prop"
      :label="item.label"
      :prop="item.prop"
      :rules="item.rules"
    >
      <!-- input -->
      <el-input
        v-if="item.type === 'Input'"
        v-model.trim="form_data[item.prop]"
        :placeholder="item.placeholder"
        :style="{width:item.width}"
        :disabled="item.disabled"
      ></el-input>
      <!-- select -->
      <el-select
        v-if="item.type === 'Select'"
        v-model.trim="form_data[item.prop]"
        :placeholder="item.placeholder"
        :style="{width:item.width}"
        :disabled="item.disabled"
      >
        <el-option
          v-for="selectItem in item.options"
          :label="selectItem.label || selectItem[item._label]"
          :key="selectItem.value || selectItem[item._value]"
          :value="selectItem.value || selectItem[item._value]"
        ></el-option>
      </el-select>
      <!-- city -->
      <div v-if="item.type ==='City'">
        <CityArea ref="city" :cityAreaValue.sync="city_value" />
      </div>
      <!-- 关键字 -->
      <div v-if="item.type ==='keyword'">
        <KeyWord ref="keyword" :options="['parkingName','address']" :value.sync="keyword" />
      </div>
      <!-- 插槽 -->
      <slot v-if="item.type === 'Slot'" :name="item.slotName"></slot>
    </el-form-item>
    <!-- 按钮 -->
    <el-form-item>
      <el-button type="danger" @click="search">搜索</el-button>
      <el-button type="danger" @click="reset" v-if="config.resetButton">重置</el-button>
      <template v-for="item in formHandler">
        <router-link :to="item.router" v-if="item.element === 'link'" :key="item.key">
          <el-button style="margin:0 10px;" :type="item.type">{{ item.label }}</el-button>
        </router-link>

        <el-button
          v-if="item.element ==='button'"
          :key="item.key"
          :type="item.type"
          @click="item.handler && item.handler()"
        >{{ item.label }}</el-button>
      </template>
      <!-- <el-button
        v-for="item in formHandler"
        :key="item.key"
        :type="item.type"
        @click="item.handler && item.handler()"
      >{{ item.label }}</el-button>-->
    </el-form-item>
  </el-form>
</template>
<script>
//省市区
import CityArea from "@c/common/cityArea";
import KeyWord from "@c/keyWord";
export default {
  name: "Form",
  components: { CityArea, KeyWord },
  props: {
    formItem: {
      type: Array,
      default: () => []
    },
    //按钮
    formHandler: {
      type: Array,
      default: () => []
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      keyword: {},
      form_data: {},
      city_value: ""
    };
  },
  methods: {
    //搜索
    search() {
      const searchData = {};
      // 过滤空数组
      for (let key in this.form_data) {
        if (this.form_data[key]) {
          searchData[key] = this.form_data[key];
        }
      }
      //组件
      //关键词
      if (this.$refs.keyword && this.keyword.key && this.keyword.value) {
        searchData[this.keyword.key] = this.keyword.value;
      }
      //区域
      if (this.$refs.city && this.city_value) {
        searchData.area = this.city_value;
      }

      this.$emit("callbackComponent", {
        function: "search",
        data: searchData
      });
    },
    //重置
    reset() {
      this.$refs.form.resetFields();
      // 城市组件
      if (this.$refs.city[0]) {
        this.$refs.city[0].clear();
      }
      // 关键字
      if (this.$refs.keyword[0]) {
        this.$refs.keyword[0].clear();
      }
    },
    initFormData() {
      this.formItem.forEach(item => {
        //读取下拉选项的数据
        if (item.type === "Select") {
          this.selectOption(item);
        }
      });
    },
    // 字段初始化
    initFormFelid() {
      const felid = {};
      this.formItem.forEach(item => {
        if (item.prop) {
          felid[item.prop] = "";
        }
      });
      this.form_data = felid;
    },
    //下拉选项
    selectOption(data) {
      const options = this.$store.state.config[data.options];
      if (data) {
        data.options = options;
      }
    }
  },
  watch: {
    formItem: {
      handler(newValue) {
        this.initFormData();
        // 读取字段
        this.initFormFelid();
      },
      immediate: true
    }
  }
};
</script>
<style lang="scss" scoped>
</style>