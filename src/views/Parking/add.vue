<template>
  <div class="parking-add">
    <FormData ref="vuForm" :formData="form_data" :formItem="form_item" :formHandler="form_handler">
      <template v-slot:city>
        <CityArea
          ref="cityArea"
          :mapLocation="true"
          :cityAreaValue.sync="form_data.area"
          @callback="callbackComponent"
        />
      </template>
      <template v-slot:amap>
        <div class="address-map">
          <AMap ref="amap" :options="option_map" @callback="callbackComponent" />
        </div>
      </template>
    </FormData>
  </div>
</template>

<script>
//AMAP
import AMap from "../amap";
// 组件
import CityArea from "@c/common/cityArea";
import FormData from "@c/formData";
//API
import { ParkingAdd, ParkingDetailed, ParkingEdit } from "@/api/parking";
export default {
  name: "ParkingAdd",
  data() {
    let validateNumber = (rule, value, callback) => {
      const regNumber = /^[0-9]*$/;
      if (!value) {
        callback(new Error("请输入可停放车辆"));
      } else if (!regNumber.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    return {
      //表单数据配置
      form_data: {
        parkingName: "",
        area: "",
        address: "",
        type: "",
        carsNumber: "",
        status: "",
        lnglat: ""
      },
      //表单配置
      form_item: [
        {
          type: "Input",
          label: "停车场名称",
          placeholder: "请输入停车场名称",
          prop: "parkingName",
          width: "300px",
          required: true
        },
        {
          type: "Slot",
          slotName: "city",
          label: "区域",
          prop: "area"
        },
        {
          type: "Input",
          label: "详细地址",
          placeholder: "请输入详细地址",
          prop: "address",
          width: "600px",
          required: true
        },
        {
          type: "Radio",
          label: "类型",
          prop: "type",
          options: this.$store.state.config.parking_type,
          required: true
        },
        {
          type: "Input",
          label: "可停放车辆",
          placeholder: "请输入数字类型",
          prop: "carsNumber",
          width: "150px",
          required: true,
          validator: [{ validator: validateNumber, trigger: "change" }]
        },
        {
          type: "Radio",
          label: "禁启用",
          prop: "status",
          options: this.$store.state.config.radio_status,
          required: true
        },
        {
          type: "Slot",
          slotName: "amap",
          label: "位置"
        },
        {
          type: "Input",
          label: "经纬度",
          placeholder: "请选择地图",
          prop: "lnglat",
          width: "200px",
          disabled: true
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
      //id
      id: this.$route.query.id,
      //地图配置
      option_map: { mapLoad: true },
      radio_status: this.$store.state.config.radio_status,
      type: this.$store.state.config.parking_type,
      button_loading: false
    };
  },
  components: { AMap, CityArea, FormData },
  beforeMount() {},
  mounted() {},
  methods: {
    formValidate() {
      this.$refs.vuForm.$refs.form.validate(valid => {
        if (valid) {
          this.button_loading = true;
          this.id ? this.editParking() : this.addParking();
        } else {
          return false;
        }
      });
    },
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data);
      }
    },
    //地图加载完成
    mapLoad() {
      this.getDetaile();
    },
    setMapCenter(data) {
      this.$refs.amap.setMapCenter(data.address);
    },
    getLnglat(data) {
      this.form_data.lnglat = data.lnglat.value;
    },
    //新增停车场API
    addParking() {
      ParkingAdd(this.form_data)
        .then(response => {
          this.$message({
            message: response.message,
            type: "success"
          });
          this.button_loading = false;
          this.$router.push({
            name: "ParkingIndex"
          });
        })
        .catch(error => {
          this.button_loading = false;
        });
    },

    //编辑停车场API
    editParking() {
      let requestData = JSON.parse(JSON.stringify(this.form_data));
      requestData.id = this.id;
      ParkingEdit(requestData)
        .then(response => {
          this.$message({
            message: response.message,
            type: "success"
          });
          this.button_loading = false;
          this.$router.push({ name: "ParkingIndex" });
        })
        .catch(error => {
          this.button_loading = false;
        });
    },

    //获取详情
    getDetaile() {
      if (!this.id) {
        return false;
      }
      ParkingDetailed({ id: this.id }).then(response => {
        const data = response.data;
        //还原数据
        for (let key in data) {
          if (Object.keys(this.form_data).includes(key)) {
            this.form_data[key] = data[key];
          }
        }
        //设置覆盖物
        //dom元素渲染完成之后调用
        const splitLnglat = data.lnglat.split(",");
        const lnglat = {
          lng: splitLnglat[0],
          lat: splitLnglat[1]
        };
        this.$refs.amap.setMarker(lnglat);
        //还原省市区
        this.$refs.cityArea.initDefault(data.region);
      });
    }
    //重置表单
    // reset(formName) {
    //   this.$refs[formName].resetFields();
    //   //清除cityArea的值
    //   this.$refs.cityArea.clear();
    //   this.$refs.amap.clearMarker();
    // }
  }
};
</script>
<style lang="scss" scoped>
.address-map {
  width: 80%;
  height: 300px;
}
.el-input {
  width: 30%;
}
</style>