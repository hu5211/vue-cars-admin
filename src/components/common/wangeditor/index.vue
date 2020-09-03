<template>
  <div ref="editorDom"></div>
</template>
<script>
// 富文本
import Editor from "wangeditor";
export default {
  name: "Editor",
  conponents: {},
  mounted() {
    // 创建富文本对象
    this.editor = new Editor(this.$refs.editorDom);
    this.editor.customConfig.onchange = html => {
      //   this.form_data.content = html;
      this.$emit("update:content", html);
    };
    this.editor.create(); //创建文本实例
  },
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  watch: {
    value: {
      handler(newValue) {
        this.editor.txt.html(newValue);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>