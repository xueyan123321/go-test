<template>
  <div id="app">
    <Menu mode="horizontal" theme="dark" active-name="1" class="menu-horizontal">
      <Menu-item class="logo" name="-1">
        <span></span>
      </Menu-item>
      <Menu-item name="0">
        DataWorks
      </Menu-item>
      <Menu-item name="1">
        数据集成
      </Menu-item>
      <Menu-item name="2">
        数据开发
      </Menu-item>
      <Menu-item name="3">
        数据管理
      </Menu-item>
      <Menu-item name="4">
        运维中心
      </Menu-item>
      <Menu-item name="5">
        项目管理
      </Menu-item>
      <Menu-item name="6">
        机器学习平台
      </Menu-item>
      <Submenu name="7" class="right-content">
        <template slot="title">
          <!--<Icon type="stats-bars"></Icon>-->
          hi12321314
        </template>
          <Menu-item name="7-1">用户详情</Menu-item>
          <Menu-item name="7-2">帮助文档</Menu-item>
          <Menu-item name="7-3">提交工单</Menu-item>
          <Menu-item name="7-4">发布历史</Menu-item>
          <Menu-item name="7-5">退出</Menu-item>
      </Submenu>
    </Menu>
    <div class="content-container">
      <Menu theme="light" width="50px" @on-select="selectTree">
        <Menu-item name="taskTree" class="left-nav">任务开发</Menu-item>
        <Menu-item name="resourceManage" class="left-nav">资源管理</Menu-item>
      </Menu>
      <taskTree v-if="showTree === 'taskTree'"
                @getFile="transToDiagram"></taskTree>
      <resourceManager v-else></resourceManager>
      <diagram :fileData="fileData"></diagram>
    </div>
    <br>
    <!--<button @click="showModel">show model</button>-->
    <!--<p>this is {{GraphObjectModel}}</p>-->
    <div class="cover" v-if="cover">
      <div class="spinner">
        <div class="spinner-container container1">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
          <div class="circle4"></div>
        </div>
        <div class="spinner-container container2">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
          <div class="circle4"></div>
        </div>
        <div class="spinner-container container3">
          <div class="circle1"></div>
          <div class="circle2"></div>
          <div class="circle3"></div>
          <div class="circle4"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import scriptsTree from './components/scriptsTree/scriptsTree'
import resourceManager from './components/resourceManager/resourceManager'
import taskTree from './components/taskTree/taskTree'
import diagram from './components/diagram/diagram'

export default {
  name: 'app',
  data () {
    return {
      //      GraphObjectModel: {},
      showTree: 'taskTree',
      fileData: {}
    }
  },
  computed: {
    cover () {
      console.log(this.$store.getters.cover, 'getterCover')
      return this.$store.getters.cover
    }
  },
  components: {
    scriptsTree,
    resourceManager,
    taskTree,
    diagram
  },
  methods: {
    // initialize the diagram and interceptor
    selectTree (select) {
      this.showTree = select
    },
    transToDiagram (fileData) {
      console.log(fileData)
      this.fileData = fileData
    }
//    showModel () {
//      this.GraphObjectModel = this.task.modelData.toJSON()
//    }
  }
}
</script>
<style scoped lang="scss">
  @import 'assets/scss/mixin.scss';
  a{
    color:#000000
  }

  span{
    display: inline-block;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 0px;
  }
  .ivu-menu-horizontal{
    height:60px;
    width:100vw;
    line-height: 60px;
  }

  .menu-horizontal{
    background-color: rgb(33,37,40);
  }

  .logo {
    height: 60px;
    span {
      @include imgIcon('assets/image/windata.png');
      width:70px;
      height: 55px;
    }
  }

  .ivu-menu-vertical{
    display:inline-block;
  }
  .content-container{
    display: flex;
  }

  .info{
    width:230px;
  }
  .ivu-tree-title{
    font-size: 0.5rem;
  }
</style>

