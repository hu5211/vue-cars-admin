<template>
  <el-form
    :inline-message="true"
    :model="formData"
    ref="form"
    :label-width="labelWidth"
    size="small"
  >
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
        v-model.trim="formData[item.prop]"
        :placeholder="item.placeholder"
        :style="{width:item.width}"
        :disabled="item.disabled"
      ></el-input>
      <!-- select -->
      <el-select
        v-if="item.type === 'Select'"
        v-model.trim="formData[item.prop]"
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
      <!-- 禁启用 -->
      <el-radio-group v-if="item.type === 'Disabled'" v-model="formData[item.prop]">
        <el-radio
          v-for="radio in radio_status"
          :label="radio.value"
          :key="radio.value"
        >{{ radio.label }}</el-radio>
      </el-radio-group>
      <!-- 插槽 -->
      <slot v-if="item.type === 'Slot'" :name="item.slotName"></slot>
      <!-- radio -->
      <el-radio-group v-if="item.type === 'Radio'" v-model="formData[item.prop]">
        <el-radio
          v-for="radio in item.options"
          :label="radio.value"
          :key="radio.value"
        >{{ radio.label }}</el-radio>
      </el-radio-group>
      <!-- 富文本编辑器 -->
      <template v-if="item.type ==='Wangeditor'">
        <Wangeditor :content.sync="formData[item.prop]" :value.sync="formData[item.prop]" />
      </template>
    </el-form-item>
    <!-- 按钮 -->
    <el-form-item>
      <el-button
        v-for="item in formHandler"
        :key="item.key"
        @click="item.handler && item.handler()"
        :type="item.type"
      >{{item.label}}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
//省市区
import CityArea from "@c/common/cityArea";
// 富文本组件
import Wangeditor from "@c/common/wangeditor";
export default {
  name: "Form",
  components: { CityArea, Wangeditor },
  props: {
    labelWidth: {
      type: String,
      default: "110px"
    },
    formData: {
      type: Object,
      default: () => {}
    },
    formItem: {
      type: Array,
      default: () => {}
    },
    //按钮
    formHandler: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      // 禁启用数据
      radio_status: this.$store.state.config.radio_status
    };
  },
  methods: {
    initFormData() {
      this.formItem.forEach(item => {
        //rules 规则
        if (item.required) {
          this.rules(item);
        }
        //自定义规则
        if (item.validator) {
          item.rules = item.validator;
        }
      });
    },
    //是否存在必填规则
    rules(item) {
      const typeMsg = {
        Input: "请输入",
        Radio: "请选择",
        Select: "请选择"
      };
      const requiredRules = [
        {
          required: true,
          message: item.required_msg || `${typeMsg[item.type]}${item.label}`,
          trigger: "change"
        }
      ];
      //其他rules规则
      if (item.rules && item.rules.length > 0) {
        item.rules = requiredRules.concat(item.rules);
      } else {
        item.rules = requiredRules;
      }
    }
  },
  watch: {
    formItem: {
      handler(newValue) {
        this.initFormData();
      },
      immediate: true
    }
  }
};
</script>
<style lang="scss" scoped>
</style>