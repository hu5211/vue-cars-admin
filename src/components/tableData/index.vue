<template>
  <div>
    <FormSearch
      v-if="table_config.search_form"
      :formItem="searchFormConfig.form_item || []"
      :formHandler="searchFormConfig.form_handler || []"
      :config="searchFormConfig.config || {}"
      @callbackComponent="callbackComponent"
    />
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
          :width="item.width"
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
        <!-- 图标显示 -->
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
        <!-- 操作 -->
        <el-table-column
          v-else-if="item.type ==='operation'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <slot v-if="item.slotName" :name="item.slotName" :data="scope.row"></slot>
            <!-- 编辑 -->
            <template v-if="item.default && item.default.editButton">
              <el-button
                v-if="item.default.editButtonEvent"
                type="danger"
                size="mini"
                @click="edit(scope.row.id,item.default.editButtonLink)"
              >编辑</el-button>
              <router-link
                v-else
                :to="{ name: item.default.editButtonLink,query:{id:scope.row.id} }"
              >
                <el-button type="danger" size="mini" class="mr-10">编辑</el-button>
              </router-link>
            </template>
            <!-- 删除 -->
            <el-button
              size="mini"
              v-if="item.default && item.default.deleteButton"
              :loading="scope.row.id == rowId"
              @click="delConfirm(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>

        <!-- 纯文本渲染 -->
        <el-table-column
          v-else
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        ></el-table-column>
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
import FormSearch from "@c/formSearch";
import { GetTableData, Delete } from "@/api/common";
//api
import { ParkingDelete } from "@/api/parking";
import { CarsDelete } from "@/api/cars";
export default {
  name: "TableComponent",
  components: { FormSearch },
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
        data: {},
        search_form: true
      },
      //页码
      total: 0,
      //当前页码
      currentPage: 1,
      rowId: "",
      form_data: {}
    };
  },
  beforeMount() {},
  methods: {
    callbackComponent(params) {
      this[params.function](params.data);
    },
    search(data) {
      const searchData = data;
      searchData.pageNumber = 1;
      searchData.pageSize = 10;
      this.requestData(searchData);
    },
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
    },
    //删除
    delConfirm(id) {
      this.$confirm("确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.rowId = id;
          let requestData = {
            url: this.table_config.url + "Delete",
            data: { id }
          };

          Delete(requestData).then(response => {
            this.$message({
              type: "success",
              message: response.message
            });
            this.rowId = "";
            this.loadData();
          });
        })
        .catch(() => {
          this.rowId = "";
        });
    },

    //编辑
    edit(id, routerName) {
      this.$router.push({
        name: routerName,
        query: {
          id: id
        }
      });
    }
  },
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    searchFormConfig: {
      type: Object,
      default: () => ({})
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
.mr-10 {
  margin-right: 10px;
}
</style>