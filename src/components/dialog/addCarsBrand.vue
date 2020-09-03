<template>
  <div class="cars-dialog-center">
    <!-- 弹窗 -->
    <el-dialog
      title="新增车辆品牌"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="close"
      @opened="opened"
    >
      <FormData :formData="form_data" :formItem="form_item" :formHandler="form_handler">
        <template v-slot:logo>
          <div class="upload-img-wrap">
            <div class="upload-img">
              <img v-show="logo_current" :src="logo_current" />
            </div>
            <div class="img-list" prop="logo">
              <li v-for="item in logo" :key="item.id" @click="logo_current=item.img">
                <img :src="item.img" alt="item.name" />
              </li>
            </div>
          </div>
        </template>
      </FormData>
    </el-dialog>
  </div>
</template>
<script>
// api
import { BrandLogo, BrandAdd, BrandDetailed, BrandEdit } from "@/api/brand";
// 组件
import FormData from "@c/formData";
export default {
  name: "",
  components: { FormData },
  props: {
    flagVisible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 弹窗显示关闭标记
      dialogVisible: false,
      //表单数据
      form_data: {
        nameCh: "",
        nameEn: "",
        imgUrl: "",
        status: "",
        content: ""
      },
      //表单配置
      form_item: [
        {
          type: "Input",
          label: "品牌中文",
          prop: "nameCh",
          width: "300px",
          required: true
        },
        {
          type: "Input",
          label: "品牌英文",
          prop: "nameEn",
          width: "300px"
        },
        {
          type: "Slot",
          slotName: "logo",
          label: "Logo",
          prop: "imgUrl"
        },
        {
          type: "Radio",
          label: "禁启用",
          prop: "status",
          options: this.$store.state.config.radio_status,
          required: true
        }
      ],
      // 表单按钮
      form_handler: [
        {
          label: "确定",
          key: "submit",
          type: "danger",
          handler: () => this.submit()
        }
      ],
      //logo
      logo: [],
      //选中的logo
      logo_current: ""
    };
  },
  methods: {
    opened() {
      this.getBrandLogo();
      this.getDetailed();
    },
    //获取logo
    getBrandLogo() {
      //存在数据时不再请求接口
      if (this.logo.length !== 0) {
        return false;
      }
      BrandLogo().then(response => {
        const data = response.data;
        if (data) {
          this.logo = data;
        }
      });
    },
    //获取详情
    getDetailed() {
      this.form_data = this.data;
      this.logo_current = this.data.imgUrl;
      this.form_data.imgUrl = this.data.imgUrl;
    },
    //提交
    submit(formName) {
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
      this.data.id ? this.edit() : this.add();
      // } else {
      //   return false;
      // }
      // });
    },
    //添加
    add() {
      this.form_data.imgUrl = this.logo_current;
      BrandAdd(this.form_data).then(response => {
        this.$message({
          type: "success",
          message: response.message
        });
        this.close();
        this.$emit("callbackComponent", {
          function: "search"
        });
      });
    },
    //编辑
    edit() {
      this.form_data.imgUrl = this.logo_current;
      const requestData = JSON.parse(JSON.stringify(this.form_data));
      requestData.id = this.data.id;
      BrandEdit(requestData).then(response => {
        this.$message({
          type: "success",
          message: response.message
        });
        this.close();
        this.$emit("callbackComponent", {
          function: "search"
        });
      });
    },
    //重置表单
    reset(formName) {
      for (let key in this.form_data) {
        this.form_data[key] = "";
      }
      // this.$refs[formName].resetFields();
      this.logo_current = "";
    },
    close() {
      this.reset();
      // 反向修改
      this.$emit("update:flagVisible", false);
    }
  },
  watch: {
    flagVisible: {
      handler(newValue, oldValue) {
        this.dialogVisible = newValue;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 40%;
}
</style>