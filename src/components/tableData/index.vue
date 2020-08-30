<template>
  <div>
    <!-- 表格数据 -->
    <el-table
      v-loading="loading_table"
      element-loading-text="拼命加载中"
      :data="table_data"
      border
      style="width: 100%"
      size="small"
    >
      <el-table-column v-if="table_config.checkbox" type="selection" width="35"></el-table-column>
      <template v-for="item in this.table_config.thead">
        <!-- 回调 -->
        <el-table-column
          v-if="item.type ==='function'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        >
          <template slot-scope="scope">
            <span v-html=" item.callback && item.callback(scope.row,item.prop)"></span>
          </template>
        </el-table-column>
        <!-- 插槽slot -->
        <el-table-column
          v-else-if="item.type ==='slot'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <slot :name="item.slotName" :data="scope.row"></slot>
          </template>
        </el-table-column>
        <!-- 图片渲染 -->
        <!-- 插槽slot -->
        <el-table-column
          v-else-if="item.type ==='image'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl" :width="item.imgwidth || 50" alt="item.name" />
          </template>
        </el-table-column>
        <!-- 纯文本渲染 -->
        <el-table-column v-else :key="item.prop" :prop="item.prop" :label="item.label"></el-table-column>
      </template>
    </el-table>

    <el-row class="padding-top-30">
      <el-col :span="7">
        <div style="padding:5px;"></div>
      </el-col>
      <el-col :span="17">
        <el-pagination
          v-if="table_config.pagination"
          background
          class="pull-right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50,100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { GetTableData } from "@/api/common";
//api
import { ParkingList, ParkingDelete } from "@/api/parking";
export default {
  name: "TableComponent",
  data() {
    return {
      // 加载提示
      loading_table: true,
      //tableData
      table_data: [],
      table_config: {
        thead: [],
        checkbox: true,
        url: "",
        pagination: true,
        data: {}
      },
      //页码
      total: 0,
      //当前页码
      currentPage: 1
    };
  },
  beforeMount() {},
  methods: {
    //table_config
    initConfig() {
      for (let key in this.config) {
        if (Object.keys(this.table_config).includes(key)) {
          this.table_config[key] = this.config[key];
        }
      }
      //配置完成后开始读取接口数据
      this.loadData();
    },
    loadData() {
      let requestData = {
        url: this.table_config.url,
        data: this.table_config.data
      };
      this.loading_table = true;
      //获取列表
      GetTableData(requestData)
        .then(response => {
          const data = response.data;
          //判断数据是否存在
          if (data) {
            this.table_data = data.data;
          }
          //页码
          this.$nextTick(() => {
            //DOM渲染完成之后
          });
          this.total = data.total;
          this.loading_table = false;
        })
        .catch(error => {
          this.loading_table = false;
        });
    },
    requestData(params = "") {
      //   //处理业务逻辑
      if (params) {
        this.table_config.data = params;
      }
      this.loadData();
    },
    //页码
    handleSizeChange(val) {
      this.table_config.data.pageSize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.table_config.data.pageNumber = val;
      this.loadData();
    }
  },
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    config: {
      handler(newValue) {
        this.initConfig();
      },
      immediate: true
    }
  }
};
</script>
<style lang="scss" scoped>
</style>