<template>
  <Tree :data="baseData"
        @on-select-change='select'
        @on-toggle-expand='toggleIcon'
        class="info"></Tree>
</template>

<script type="text/ecmascript-6">
  const SUCCESS = 200
  export default{
    data () {
      return {
        baseData: [{
          title: `<span class="icon-title"></span> 任务列表`,
          expand: true,
          children: []
        }]
      }
    },
    created () {
      var self = this
      this.axios.interceptors.request.use(function (config) {
        self.$emit('sentRequest')
        return config
      }, function (error) {
        return Promise.reject(error)
      })
      this.axios.interceptors.response.use(function (response) {
        self.$emit('receiveResponse')
        return response
      }, function (error) {
        self.$emit('responseError')
        return Promise.reject(error)
      })
      this.axios.get('http://' + this.$mainUrl + '/windata-server/web/api/tasks').then((res) => {
        if (res.data.content.errorCode === SUCCESS) {
          var tasks = res.data.content.data
          var listTask = []
          tasks.forEach((item) => {
            listTask.push({title: `<span class="icon"></span>${item.name}`, id: item.id})
          })
          this.baseData[0].children = listTask
          console.log(this.baseData[0].children)
        } else {
          alert(res.data.content.errorMsg)
        }
      }).catch((e) => {
        alert(e)
      })
    },
    methods: {
      select (data) {
        console.log(data)
        if (data[0].id !== undefined) {
          this.axios.get('http://' + this.$mainUrl + '/windata-server/web/api/task/' + data[0].id).then((res) => {
            console.log(res.data.content.data)
            this.$emit('getFile', res.data.content.data.viewJson, res.data.content.data.name, res.data.content.data.id)
          }).catch((error) => {
            alert(error)
          })
        }
      },
      toggleIcon () {
        if (this.baseData[0].title === `<span class="icon-title"></span> 任务列表`) {
          this.baseData[0].title = `<span class="icon-title-open"></span> 任务列表`
        } else {
          this.baseData[0].title = `<span class="icon-title"></span> 任务列表`
        }
      }
    }
  }
</script>

<style scoped>
  .info{
    padding:10px !important;
  }

  .ivu-tree-title, ivu-tree-children{
    display:inline !important;
  }
</style>

<style lang="scss">
  @import '../../assets/scss/mixin.scss';

  .icon-title{
    @include imgIcon('openfolder.png');
    width:15px;
    height:15px;
  }

  .icon{
    @include imgIcon('diagram.png');
    margin-right:5px;
    width:16px;
    height:15px;
  }

  .icon-title-open{
    @include imgIcon('foldFiles.png');
    width:15px;
    height:15px;
    margin-right:5px;

  }
</style>
