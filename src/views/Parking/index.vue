<template>
  <div>
    <TableData ref="table" :config="table_config" :searchFormConfig="search_form_config">
      <!-- 禁启用 -->
      <template v-slot:status="slotData">
        <el-switch
          :disabled="slotData.data.id  == switch_disabled"
          @change="switchChange(slotData.data)"
          v-model="slotData.data.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>
      </template>
      <!-- 查看地图 -->
      <template v-slot:lnglat="slotData">
        <el-button @click="showMap(slotData.data)" size="mini">查看地图</el-button>
      </template>
    </TableData>

    <ShowMapLocation :flagVisible.sync="map_Show" :data="parking_data" />
  </div>
</template>

<script>
//组件
import CityArea from "@c/common/cityArea";
import ShowMapLocation from "@c/dialog/showMapLocation";
import TableData from "@c/tableData";
//api
import { ParkingStatus } from "@/api/parking";
// common/
import { address, parkingType } from "@/utils/common";
export default {
  name: "Parking",
  data() {
    return {
      //表格配置
      table_config: {
        thead: [
          { label: "停车场名称", prop: "parkingName" },
          {
            label: "类型",
            prop: "type",
            type: "function",
            callback: (row, prop) => parkingType(row[prop])
          },
          {
            label: "区域",
            prop: "address",
            type: "function",
            callback: (row, prop) => address(row[prop])
          },
          { label: "可停放车辆", prop: "carsNumber" },
          {
            label: "禁启用",
            prop: "status",
            type: "slot",
            slotName: "status"
          },
          {
            label: "查看位置",
            prop: "lnglat",
            type: "slot",
            slotName: "lnglat"
          },
          {
            label: "操作",
            type: "operation",
            default: {
              deleteButton: true,
              editButton: true,
              editButtonLink: "ParkingAdd"
            }
          }
        ],
        url: "parkingList", //请求Url地址
        data: {
          pageSize: 10,
          pageNumber: 1
        }
      },
      //搜索
      search_form_config: {
        form_item: [
          { label: "区域", type: "City" },
          {
            label: "类型",
            type: "Select",
            width: "100px",
            prop: "parkingType",
            options: "parking_type"
          },
          {
            label: "禁启用",
            prop: "status",
            type: "Select",
            width: "100px",
            options: "radio_status"
          },
          {
            label: "关键字",
            type: "keyword"
          }
        ],
        form_handler: [
          {
            label: "新增车辆",
            prop: "add",
            type: "success",
            element: "link",
            router: "/parkingAdd"
          }
          // {
          //   label: "下载",
          //   prop: "down",
          //   type: "success",
          //   element: "button",
          //   handler: () => {
          //     this.aaa();
          //   }
          // }
        ]
      },
      //筛选
      form: {
        area: "",
        type: "",
        status: ""
      },
      switch_disabled: "",
      //关键词内容
      search_key: "",
      keyword: "",
      //禁启用
      radio_status: this.$store.state.config.radio_status,
      //停车场类型
      parking_type: this.$store.state.config.parking_type,
      //地图显示
      map_Show: false,
      parking_data: {},
      table_loading: false,
      rowId: ""
    };
  },
  components: { CityArea, ShowMapLocation, TableData },
  methods: {
    // search
    search() {
      const requestData = {
        pageSize: 10,
        pageNumber: 1
      };
      //过滤筛选
      const filterData = JSON.parse(JSON.stringify(this.form));
      for (let key in filterData) {
        if (filterData[key]) {
          requestData[key] = filterData[key];
        }
      }
      //关键字
      if (this.keyword && this.search_key) {
        requestData[this.search_key] = this.keyword;
      }
      //调用子组件的方法
      this.$refs.table.requestData(requestData);
    },

    //禁启用
    switchChange(data) {
      const requestData = {
        id: data.id,
        status: data.status
      };
      this.switch_disabled = data.id;
      ParkingStatus(requestData)
        .then(response => {
          this.$message({
            type: "success",
            message: response.message
          });
          this.switch_disabled = "";
        })
        .catch(error => {
          this.switch_disabled = "";
        });
    },

    //显示地图
    showMap(data) {
      this.map_Show = true;
      this.parking_data = data;
    }
  },
  //动元素渲染之前（生命周期）
  beforeMount() {},
  //动元素渲染完成（生命周期）
  mounted() {}
};
</script>
<style lang="scss" scoped>
</style>