<template>
  <div class="cars-dialog-center">
    <!-- 弹窗 -->
    <el-dialog
      :title="data.parkingName"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="close"
      @opened="opened"
    >
      <div style="height:300px;">
        <AMap ref="aMap" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
//AMAP
import AMap from "@/views/amap";
export default {
  name: "",
  components: { AMap },
  props: {
    flagVisible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 弹窗显示关闭标记
      dialogVisible: false
    };
  },
  methods: {
    opened() {
      this.$refs.aMap.mapCreate();
      //调dom元素的方法时，要确保dom元素加载完成
      this.$nextTick(() => {
        //dom元素渲染完成之后调用
        const splitLnglat = this.data.lnglat.split(",");
        const lnglat = {
          lng: splitLnglat[0],
          lat: splitLnglat[1]
        };
        this.$refs.aMap.setMarker(lnglat);
      });
    },
    close() {
      //关闭时销毁地图
      this.$refs.aMap.mapDestroy();
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
</style>