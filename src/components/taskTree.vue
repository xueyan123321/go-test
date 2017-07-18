<template>
  <Tree :data="baseData" @on-select-change='select' class="info"></Tree>
</template>

<script type="text/ecmascript-6">
  export default{
    data () {
      return {
        baseData: [{
          title: `<span class="icon"></span> 任务列表`,
          expand: true,
          children: []
        }]
      }
    },
    created () {
      this.axios.get('http://' + this.$mainUrl + '/windata-server/web/api/tasks').then((res) => {
        console.log(res.data.content.data)
        var tasks = res.data.content.data
        var listTask = []
        tasks.forEach((item) => {
          listTask.push({title: `<span class="icon"></span>${item.name}`, id: item.id})
        })
        this.baseData[0].children = listTask
        console.log(this.baseData[0].children)
      })
    },
    methods: {
      select (data) {
        console.log(data)
        this.axios.get('http://' + this.$mainUrl + '/windata-server/web/api/task/' + data[0].id).then((res) => {
          console.log(res.data.content.data.viewJson)
          this.$emit('getFile', res.data.content.data.viewJson)
        })
      }
    }
  }
</script>

<style lang="scss"
       rel="stylesheet/scss">
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
