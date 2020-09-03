<template>
  <div class="parking-add">
    <FormData ref="vuForm" :formData="form_data" :formItem="form_item" :formHandler="form_handler">
      <template v-slot:maintain>
        <el-row :gutter="30">
          <el-col :span="6">
            <el-date-picker
              v-model="form_data.maintainDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width:100%;"
            ></el-date-picker>
          </el-col>
          <el-col :span="6">下次保养日期2020-08-20</el-col>
        </el-row>
      </template>

      <template v-slot:energy>
        <el-radio-group v-model="form_data.energyType" @change="changeEnergyType">
          <el-radio v-for="item in energyType" :key="item.value" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
        <div
          class="progress-bar-wrap"
          v-if="form_data.energyType == 3 || form_data.energyType == 1"
        >
          <span class="label-text">电量：</span>
          <el-row>
            <el-col :span="12">
              <el-slider v-model="form_data.electric" show-input></el-slider>
            </el-col>
          </el-row>
        </div>
        <div
          class="progress-bar-wrap"
          v-if="form_data.energyType == 3 || form_data.energyType == 2"
        >
          <span class="label-text">油量：</span>
          <el-row>
            <el-col :span="12">
              <el-slider v-model="form_data.oil" show-input></el-slider>
            </el-col>
          </el-row>
        </div>
      </template>

      <template v-slot:carsAttr>
        <el-button type="primary" @click="addCarsAttr">添加汽车属性</el-button>
        <div class="cars-attr-list" v-for="(item,index) in cars_attr" :key="item.key">
          <el-row :gutter="10">
            <el-col :span="2">
              <el-input v-model="item.attr_key"></el-input>
            </el-col>
            <el-col :span="3">
              <el-input v-model="item.attr_value"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button @click="delCarsAttr(index)">删除</el-button>
            </el-col>
          </el-row>
        </div>
      </template>
    </FormData>
  </div>
</template>

<script>
// 组件
import CityArea from "@c/common/cityArea";
import FormData from "@c/formData";
// 接口
import { GetCarsBrand, GetParking } from "@/api/common";
import { CarsAdd, CarsDetailed, CarsEdit } from "@/api/cars";
export default {
  name: "ParkingAdd",
  components: { FormData },
  data() {
    return {
      //富文本
      editor: null,
      //能源类型
      energyType: this.$store.state.config.energyType,
      cars_attr: [],
      form_item: [
        {
          type: "Select",
          label: "车辆品牌",
          placeholder: "请选择车辆品牌",
          prop: "carsBrandId",
          _value: "id",
          _label: "nameCh",
          options: [],
          required: true
        },
        {
          type: "Select",
          label: "停车场名称",
          placeholder: "请选择停车场",
          prop: "parkingId",
          _value: "id",
          _label: "parkingName",
          options: [],
          required: true
        },
        {
          type: "Input",
          label: "车辆型号",
          placeholder: "请选择车辆型号",
          prop: "carsMode",
          width: "200px",
          required: true
        },
        {
          type: "Input",
          label: "车牌号",
          placeholder: "请输入车牌号",
          prop: "carsNumber",
          width: "200px",
          required: true
        },
        {
          type: "Input",
          label: "车架号",
          placeholder: "请输入车架号",
          prop: "carsFrameNumber",
          width: "200px",
          required: true
        },
        {
          type: "Input",
          label: "发动机号",
          placeholder: "请输入发动机号",
          prop: "engineNumber",
          width: "200px",
          required: true
        },
        {
          type: "Radio",
          label: "年检",
          placeholder: "请选择年检",
          prop: "yearCheck",
          options: this.$store.state.config.yearCheck_type
        },
        {
          type: "Slot",
          label: "保养日期",
          slotName: "maintain",
          prop: "maintainDate"
        },
        {
          type: "Radio",
          label: "档位",
          placeholder: "请选择档位",
          prop: "gear",
          options: this.$store.state.config.gear_type
        },
        {
          type: "Slot",
          label: "能源类型",
          slotName: "energy",
          prop: "energyType"
        },
        {
          type: "Disabled",
          label: "禁启用",
          prop: "status"
        },
        {
          type: "Slot",
          label: "车辆属性",
          slotName: "carsAttr",
          prop: "carsAttr"
        },
        {
          type: "Wangeditor",
          label: "车辆描述",
          prop: "content"
        }
      ],
      form_handler: [
        {
          label: "确定",
          key: "submit",
          type: "danger",
          handler: () => this.formValidate()
        }
      ],
      form_data: {
        parkingId: "",
        carsBrandId: "",
        carsMode: "",
        carsNumber: "",
        carsFrameNumber: "",
        engineNumber: "",
        yearCheck: true,
        gear: 1,
        energyType: 2,
        electric: 100,
        oil: 100,
        carsAttr: "",
        content: "",
        maintainDate: "",
        status: true
      },
      // 车辆品牌列表
      carsBrandList: [],
      button_loading: false,

      //id
      id: this.$route.query.id
    };
  },
  beforeMount() {
    this.GetCarsBrandList();
    this.GetParkingList();
    this.getDetaile();
  },
  mounted() {},
  methods: {
    formValidate() {
      this.formatCarsAttr();
      this.$refs.vuForm.$refs.form.validate(valid => {
        if (valid) {
          this.id ? this.edit() : this.add();
        }
      });
    },
    //编辑
    edit() {
      const requestData = JSON.parse(JSON.stringify(this.form_data));
      requestData.id = this.id;
      CarsEdit(requestData)
        .then(response => {
          this.$message({
            message: response.message,
            type: "success"
          });
          this.$router.push({
            name: "CarsIndex"
          });
        })
        .catch(error => {});
    },
    //添加
    add() {
      CarsAdd(this.form_data)
        .then(response => {
          this.$message({
            message: response.message,
            type: "success"
          });
          this.$router.push({
            name: "CarsIndex"
          });
        })
        .catch(error => {});
    },
    //获取详情
    getDetaile() {
      if (!this.id) {
        return false;
      }
      CarsDetailed({ id: this.id }).then(response => {
        const data = response.data;
        //还原数据
        for (let key in data) {
          if (Object.keys(this.form_data).includes(key)) {
            this.form_data[key] = data[key];
          }
        }
        const carsAttr = JSON.parse(data.carsAttr);
        this.cars_attr = carsAttr;
        const arr = [];
        for (let key in carsAttr) {
          const json = {};
          json.attr_key = key;
          json.attr_value = carsAttr[key];
          arr.push(json);
        }
        this.cars_attr = arr;
      });
    },

    //获取车辆品牌列表
    GetCarsBrandList() {
      GetCarsBrand().then(respones => {
        const data = respones.data.data;
        if (data) {
          const carsBrand = this.form_item.filter(
            item => item.prop == "carsBrandId"
          );
          if (carsBrand.length > 0) {
            carsBrand[0].options = data;
          }
        }
      });
    },
    //获取停车场
    GetParkingList() {
      GetParking().then(respones => {
        const data = respones.data.data;
        if (data) {
          const parking = this.form_item.filter(
            item => item.prop == "parkingId"
          );
          if (parking.length > 0) {
            parking[0].options = data;
          }
        }
      });
    },
    // 添加车辆属性
    addCarsAttr() {
      this.cars_attr.push({ attr_key: "", attr_value: "" });
    },
    //删除车辆属性
    delCarsAttr(index) {
      this.cars_attr.splice(index, 1); //第一个参数指定数组索引位置，第二个删除多少个
    },
    //车辆属性格式化
    formatCarsAttr() {
      const data = this.cars_attr;
      if (data && data.length == 0) {
        return false;
      }
      const carsAttr = {};
      data.forEach(item => {
        if (item.attr_key) {
          carsAttr[item.attr_key] = item.attr_value;
        }
      });
      this.form_data.carsAttr = JSON.stringify(carsAttr);
    },

    changeEnergyType(value) {
      this.form_data.oil = 0;
      this.form_data.electric = 0;
    }
  }
};
</script>
<style lang="scss" scoped>
.progress-bar-wrap {
  padding-left: 50px;
  margin-top: 10px;
  position: relative;
  .label-text {
    position: absolute;
    left: 0;
    color: #454545;
  }
}
.cars-attr-list {
  margin-top: 10px;
  overflow: hidden;
}
</style>