<template>
  <Tree :data="baseData" class="info"></Tree>
</template>

<script type="text/ecmascript-6">
  export default{
    data () {
      return {
        baseData: [{
          title: `<span class="icon"></span> parent 123`,
          children: [{
            title: '<span class="icon"></span> parent 1-0',
            disabled: true,
            children: [{
              title: '<span class="icon"></span> leaf'
            }, {
              title: '<span class="icon"></span> leaf'
            }]
          }, {
            title: '<span class="icon"></span> parent 1-1',
            checked: true,
            children: [{
              title: '<span class="icon"></span> leaf</span>'
            }]
          }]
        }]
      }
    }
  }
</script>

<style scoped>
  .info{
    padding:10px !important;
  }
  .icon{
    width:15px;
    height:15px;
    background: url('../assets/image/p14.png');
    background-size:100% 100%;
  }
  .ivu-tree-title, ivu-tree-children{
    display:inline !important;
  }
</style>
