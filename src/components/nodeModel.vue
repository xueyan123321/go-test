<template>
  <div>
    <!--<Button type="primary" @click="modal1 = true">显示对话框</Button>-->

    <p>{{show}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['show'],
//    data () {
//      return {
//        modal1: this.show
//      }
//    },
    methods: {
      ok () {
        this.$Message.info('点击了确定')
      },
      cancel () {
        this.$Message.info('点击了取消')
      }
    }
  }
</script>

<style lang="scss"
       rel="stylesheet/scss">

</style>
