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

      <!-- 操作 -->
      <template v-slot:operation="slotData">
        <el-button type="danger" size="mini" @click="edit(slotData.data)">编辑</el-button>
      </template>
    </TableData>

    <AddCarsBrand
      :flagVisible.sync="dialog_show"
      :data="dataId"
      @callbackComponent="callbackComponent"
    />
    <!--父组件往子组件传数据时，是一个单项数据流-->
  </div>
</template>

<script>
import { BrandStatus } from "@/api/brand";
import AddCarsBrand from "@c/dialog/addCarsBrand.vue";
import TableData from "@c/tableData";
export default {
  name: "Parking",
  components: { AddCarsBrand, TableData },
  data() {
    return {
      // 弹窗标记
      dialog_show: false,
      //表格配置
      table_config: {
        thead: [
          {
            label: "LOGO",
            prop: "imgUrl",
            type: "image",
            width: 80
          },
          {
            label: "车辆品牌",
            prop: "nameCh",
            type: "function",
            callback: (row, prop) => {
              return `${row.nameCh}/${row.nameEn}`;
            }
          },
          {
            label: "禁启用",
            prop: "status",
            type: "slot",
            slotName: "status"
          },
          {
            label: "操作",
            type: "operation",
            default: {
              deleteButton: true
            },
            slotName: "operation",
            width: "180px"
          }
        ],
        url: "brandList", //请求Url地址
        data: {
          pageSize: 10,
          pageNumber: 1
        }
      },

      //搜索
      search_form_config: {
        form_item: [
          {
            label: "车辆品牌",
            type: "Input",
            width: "200px",
            prop: "brand",
            placeholder: "请输入车辆品牌"
          },
          {
            label: "禁启用",
            prop: "status",
            type: "Select",
            width: "100px",
            options: "radio_status"
          }
        ],
        config: {
          resetButton: true
        },
        form_handler: [
          {
            label: "新增车辆品牌",
            prop: "add",
            type: "success",
            element: "button",
            handler: () => {
              this.dialog_show = true;
            }
          }
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
    callbackComponent(params) {
      if (params.function) {
        this[params.function]();
      }
    },
    // 搜索
    search() {
      const requestData = {
        pageSize: 10,
        pageNumber: 1
      };
      if (this.form.brand) {
        requestData.brand = this.form.brand;
      }
      // 调用子组件方法
      this.$refs.table.requestData(requestData);
    },
    //编辑
    edit(data) {
      this.dataId = data;
      this.dialog_show = true;
    },
    //禁启用
    switchChange(data) {
      const requestData = {
        id: data.id,
        status: data.status
      };
      this.switch_disabled = data.id;
      BrandStatus(requestData)
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
  }
};
</script>
<style lang="scss" scoped>
</style>