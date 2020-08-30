<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span="21">
          <el-form :inline="true" :model="form" class="demo-form-inline" size="small">
            <el-form-item label="区域">
              <CityArea ref="cityArea" :mapLocation="true" :cityAreaValue.sync="form.area" />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="form.type" placeholder="停车场" class="width-100">
                <el-option
                  v-for="item in parking_type"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="禁启用">
              <el-select v-model="form.status" placeholder="请选择" class="width-100">
                <el-option
                  v-for="item in parking_status"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字">
              <el-select v-model="search_key" placeholder="请选择" class="width-100">
                <el-option label="停车场名称" value="parkingName"></el-option>
                <el-option label="详细区域" value="address"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="keyword" placeholder="请输入关键字按Enter搜索" class="width-120"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="search">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="3">
          <div class="pull-right">
            <router-link to="/parkingAdd">
              <el-button type="danger" size="small">新增停车场</el-button>
            </router-link>
          </div>
        </el-col>
      </el-row>
    </div>
    <TableData ref="table" :config="table_config">
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

    <ShowMapLocation :flagVisible.sync="map_Show" :data="parking_data" />
  </div>
</template>

<script>
//组件
import CityArea from "@c/common/cityArea";
import ShowMapLocation from "@c/dialog/showMapLocation";
import TableData from "@c/tableData";
//api
import { ParkingDelete, ParkingStatus } from "@/api/parking";
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
            type: "slot",
            slotName: "operation"
          }
        ],
        url: "parkingList", //请求Url地址
        data: {
          pageSize: 10,
          pageNumber: 1
        }
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
    //编辑
    edit(id) {
      this.$router.push({
        name: "ParkingAdd",
        query: {
          id: id
        }
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
          ParkingDelete({ id }).then(response => {
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