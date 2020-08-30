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
      <!-- 内容区 -->
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-width="110px"
        size="small"
        :inline-message="true"
      >
        <el-form-item label="品牌中文" prop="nameCh">
          <el-input v-model="form.nameCh"></el-input>
        </el-form-item>

        <el-form-item label="车辆英文" prop="nameEn">
          <el-input v-model="form.nameEn"></el-input>
        </el-form-item>

        <el-form-item label="LOGO" prop="imgUrl">
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
        </el-form-item>

        <el-form-item label="禁启用" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="item in radio_status"
              :label="item.value"
              :key="item.id"
            >{{ item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="danger" @click="submit('form')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { BrandLogo, BrandAdd, BrandDetailed, BrandEdit } from "@/api/brand";
export default {
  name: "",
  components: {},
  props: {
    flagVisible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      // 弹窗显示关闭标记
      dialogVisible: false,
      // 表单
      form: {
        nameCh: "",
        nameEn: "",
        imgUrl: "",
        status: "",
        content: ""
      },
      //logo
      logo: [],
      //选中的logo
      logo_current: "",
      //状态
      radio_status: this.$store.state.config.radio_status,
      //验证表单规则
      rules: {
        nameCh: [
          { required: true, message: "请输入中文品牌", trigger: "blur" }
        ],
        nameEn: [
          { required: true, message: "请输入英文品牌", trigger: "blur" }
        ],
        status: [
          {
            required: true,
            message: "请至少选择一个",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    opened() {
      this.getBrandLogo();
      if (this.id) {
        this.getDetailed();
      }
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
      BrandDetailed({ id: this.id }).then(respones => {
        const data = respones.data;
        if (data) {
          this.form = data;
          this.logo_current = data.imgUrl;
        }
      });
    },
    //提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.id ? this.edit() : this.add();
        } else {
          return false;
        }
      });
    },
    //添加
    add() {
      this.form.imgUrl = this.logo_current;
      BrandAdd(this.form).then(response => {
        this.$message({
          type: "success",
          message: response.message
        });
        this.close();
      });
    },
    //编辑
    edit() {
      this.form.imgUrl = this.logo_current;
      const requestData = JSON.parse(JSON.stringify(this.form));
      requestData.id = this.id;
      BrandEdit(requestData).then(response => {
        this.$message({
          type: "success",
          message: response.message
        });
        this.close();
      });
    },
    //重置表单
    reset(formName) {
      this.$refs[formName].resetFields();
      this.logo_current = "";
    },
    close() {
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