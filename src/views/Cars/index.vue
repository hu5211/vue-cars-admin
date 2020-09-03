<template>
  <div>
    <!-- 表格数据 -->
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

      <template v-slot:operation="slotData">
        <el-button type="danger" size="mini">修改</el-button>
      </template>
    </TableData>
  </div>
</template>

<script>
import CityArea from "@c/common/cityArea";
// 接口
import { CarsStatus } from "@/api/cars";
// 组件
import TableData from "@c/tableData";
//common
import { yearCheckType, energyType, address } from "@/utils/common";
export default {
  name: "Cars",
  components: { TableData, CityArea },
  data() {
    return {
      // 弹窗标记
      dialog_show: false,
      //表格配置
      table_config: {
        thead: [
          {
            label: "车辆LOGO",
            prop: "imgUrl",
            type: "image",
            width: "80px"
          },
          {
            label: "车辆品牌",
            prop: "nameCh",
            width: "100px"
          },
          {
            label: "车牌号",
            prop: "carsMode",
            width: "100px"
          },
          {
            label: "年检",
            prop: "yearCheck",
            type: "function",
            callback: (row, prop) => yearCheckType(row[prop]),
            width: "80px"
          },
          {
            label: "能源类型",
            prop: "energyType",
            type: "function",
            callback: (row, prop) => energyType(row[prop]),
            width: "100px"
          },
          {
            label: "禁启用",
            prop: "status",
            type: "slot",
            slotName: "status",
            width: "80px"
          },
          {
            label: "停车场",
            prop: "parkingName"
          },
          {
            label: "区域",
            prop: "address",
            type: "function",
            callback: (row, prop) => address(row[prop])
          },
          {
            label: "操作",
            type: "operation",
            default: {
              deleteButton: true,
              editButton: true,
              editButtonLink: "CarsAdd"
            }
          }
        ],
        url: "carsList", //请求Url地址
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
            router: "/carsAdd"
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
        brand: ""
      },
      switch_disabled: "",
      rowId: "",
      dataId: {}
    };
  },
  beforeMount() {},
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
      CarsStatus(requestData)
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