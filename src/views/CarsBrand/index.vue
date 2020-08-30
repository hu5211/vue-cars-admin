<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span="20">
          <el-form :inline="true" :model="form" class="demo-form-inline" size="small">
            <el-form-item label="类型">
              <el-select v-model="form.status" placeholder="请选择类型">
                <el-option
                  v-for="item in radio_status"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="danger">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4">
          <div class="pull-right">
            <el-button type="danger" size="small" @click="dialog_show=true">新增车辆品牌</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 表格数据 -->

    <TableData ref="refs" :config="table_config">
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
        <el-button type="danger" size="mini" @click="edit(slotData.data.id)">编辑</el-button>
        <el-button
          size="mini"
          :loading="slotData.data.id == rowId"
          @click="delConfirm(slotData.data.id)"
        >删除</el-button>
      </template>
    </TableData>

    <AddCarsBrand :flagVisible.sync="dialog_show" :id="data_id" />
    <!--父组件往子组件传数据时，是一个单项数据流-->
  </div>
</template>

<script>
import { BrandList, BrandDelete, BrandStatus, BrandEdit } from "@/api/brand";
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
            type: "slot",
            width: 200,
            slotName: "operation"
          }
        ],
        url: "brandList", //请求Url地址
        data: {
          pageSize: 10,
          pageNumber: 1
        }
      },
      //筛选
      form: {
        status: ""
      },
      switch_disabled: "",
      //禁启用
      radio_status: this.$store.state.config.radio_status,
      rowId: "",
      data_id: ""
    };
  },
  beforeMount() {},
  methods: {
    edit(id) {
      this.data_id = id;
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
    },
    //删除
    delConfirm(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.rowId = id;
          BrandDelete({ id }).then(response => {
            this.$message({
              type: "success",
              message: response.message
            });
            this.rowId = "";
            //调用子组件的方法
            this.$refs.table.requestData();
          });
        })
        .catch(() => {
          this.rowId = "";
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>