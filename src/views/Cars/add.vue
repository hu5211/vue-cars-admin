<template>
  <div class="parking-add">
    <el-form ref="form" :model="form" label-width="110px" size="small">
      <el-form-item label="车辆品牌">
        <el-select>
          <el-option>福特</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="车辆类型">
        <el-select>
          <el-option>HHHHH</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="停车场">
        <el-select>
          <el-option>南昌停车场</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="车牌号">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="车架号">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="发动机号">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="年检">
        <el-radio-group v-model="form.resource">
          <el-radio label="已年检"></el-radio>
          <el-radio label="未年检"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="保养日期">
        <el-row>
          <el-col :span="6">
            <el-input v-model="form.name"></el-input>
          </el-col>
          <el-col :span="18">下次保养日期2020-08-20</el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="档位">
        <el-radio-group v-model="form.resource">
          <el-radio label="自动挡"></el-radio>
          <el-radio label="手动"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="禁启用">
        <el-radio-group v-model="form.resource">
          <el-radio label="禁用"></el-radio>
          <el-radio label="启用"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="车辆属性">
        <div class="cars-attr-list" v-for="(item,index) in cars_attr" :key="item.key">
          <el-row :gutter="10">
            <el-col :span="2">
              <el-input value="100"></el-input>
            </el-col>
            <el-col :span="3">
              <el-input value="100"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" v-if="index == 0" @click="addCarsAttr">+</el-button>
              <el-button v-else>-</el-button>
            </el-col>
          </el-row>
        </div>
      </el-form-item>

      <el-form-item label="车辆描述">
        <div ref="editorDom" style="text-align:left;"></div>
      </el-form-item>

      <el-form-item>
        <el-button type="danger">确定</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Editor from "wangeditor";
export default {
  name: "ParkingAdd",
  data() {
    return {
      //富文本
      editor: null,
      cars_attr: [
        { key1: 11, value1: 22 },
        { key2: 22, value2: 22 },
        { key3: 33, value3: 22 },
        { key4: 44, value4: 22 }
      ],
      form: {
        name: ""
      }
    };
  },
  mounted() {
    this.createEditor();
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },

    // 添加车辆属性
    addCarsAttr() {
      this.cars_attr.push({ key4: 44, value4: 22 });
    },
    // 创建富文本对象
    createEditor() {
      this.editor = new Editor(this.$refs.editorDom);
      this.editor.customConfig.onchange = html => {};
      this.editor.create(); //创建文本实例
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>