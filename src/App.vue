<template>
  <div id="app">
    <Menu mode="horizontal" :theme="theme1" active-name="1">
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
      <Menu :theme="theme2" width="50px" @on-select="selectTree">
        <Menu-item name="1" class="left-nav">任务开发</Menu-item>
        <Menu-item name="2" class="left-nav">脚本开发</Menu-item>
      </Menu>

      <taskTree v-if="showTree === '1'" v-on:getFile="showFileDia"></taskTree>
      <scriptsTree v-else></scriptsTree>

      <div style="width:240px; height:110px; top: 130px; left: 240px; position:absolute; z-index: 99; background: #ffffff;">
        <span style="display:inline-block; position:relative; text-align: center; top: 90px; font-size: 0.5rem; border: black 1px solid; width:90px">节点组件</span>
      </div>
      <span>
        <div id='myPaletteDiv' ref="palette" style="border: solid 1px black; width:90px; height: 50vh; background: #ffffff;position:absolute;top:174px;left: 240px;z-index: 98">
        </div>
      </span>
      <span>
        <Menu mode="horizontal" :theme="theme3" active-name="1" @on-select="createSaveSelect" class="create-save">
          <Modal v-model="modelShow" title="请输入文件名称" @on-ok="createFile">
            <input type="text" v-model="fileName">
          </Modal>
          <Menu-item name="1">
              新建
          </Menu-item>
          <Menu-item name="2">
              保存
          </Menu-item>
        </Menu>
        <div id="myDiagramDiv" ref="diagram"
             style="width:1650px; height:100vh; background-color: #ffffff; border: solid 1px black">
        </div>
      </span>
    </div>
    <br>
    <button @click="showModel">show model</button>
    <span @click="setLayout" class="auto-layout"></span>
    <p>this is {{GraphObjectModel}}</p>
    <Modal
      v-model="showCustom"
      title="普通的Modal对话框标题"
      @on-ok="submitTheProps"
      @on-cancel="cancelCreate"
      >
      <input type="text" v-model="customProps.name">
      <p>对话框内容</p>
      <p>对话框内容</p>
    </Modal>
  </div>
</template>

<script>
import Hello from './components/Hello'
import scriptsTree from './components/scriptsTree'
import resourceManager from './components/resourceManager'
import taskTree from './components/taskTree'

export default {
  name: 'app',
  data () {
    return {
      GraphObjectModel: {},
      modelData: {},
      showCustom: false,
      customProps: {},
      objData: {},
      Diagram: '',
      theme1: 'dark',
      theme2: 'light',
      theme3: 'primary',
      modelShow: false,
      fileName: '',
      showTree: '1',
      fileId: ''
    }
  },
  mounted () {
    var go = this.$go
    var self = this
    console.log(this.$refs.diagram.id)
    var $ = go.GraphObject.make
    var myDiagram =
      $(go.Diagram, this.$refs.diagram.id,
        {
          allowDrop: true,
          initialContentAlignment: go.Spot.Center, // center Diagram contents
          'undoManager.isEnabled': true // enable Ctrl-Z to undo and Ctrl-Y to redo
        })
    //  define a simple Node template
    myDiagram.nodeTemplate = $(go.Node, 'Table',
      {
        locationObjectName: 'BODY',
        locationSpot: go.Spot.Center,
        selectionObjectName: 'BODY',
        doubleClick: function (e, obj) {
          console.log(obj.data.name)
          // 浅拷贝出对象数据
          self.objData = obj.data
          console.log(self.showCustom)
          self.customProps.name = obj.data.name
          self.showCustom = true
        }
      },
      // the body
      $(go.Panel, go.Panel.Spot, {
        row: 2,
        column: 1,
        name: 'BODY',
        stretch: go.GraphObject.fill
      },
        $(go.Shape, 'Rectangle',
          { fill: '#DFF0FE',
            stroke: 'blue',
            strokeWidth: 2,
            desiredSize: new go.Size(70, 32)},
//          绑定设置形状属性
            new go.Binding('desiredSize', 'size'),
            new go.Binding('fill')),
        $(go.TextBlock,
          {margin: 5, stroke: 'black', font: '8px sans-serif', wrap: go.TextBlock.None, alignment: new go.Spot(0.5, 0.5)},
//          类型绑定设置属性
          new go.Binding('font'),
          new go.Binding('text'),
          new go.Binding('alignment', 'textAlignment')),
        $(go.TextBlock,
          {margin: 5, stroke: 'black', font: 'normal small-caps bolder 14px cursive', wrap: go.TextBlock.None, overflow: go.TextBlock.OverflowEllipsis, width: 50, alignment: new go.Spot(0.5, 0.5), textAlign: 'center'},
//          绑定设置名字属性
          new go.Binding('text', 'name'),
          new go.Binding('width'),
          new go.Binding('alignment', 'nameAlignment'))
      ),
      //  the port number
      $(go.Panel, 'Horizontal',
        { row: 1,
          column: 1,
          itemArray: [{'portColor': '#ffffff', 'portId': 'top'}],
          itemTemplate:
            $(go.Panel,
              {
                _side: 'top',
                fromSpot: go.Spot.Top,
                toSpot: go.Spot.Top,
                toLinkable: true,
                cursor: 'crosshair'
              },
              new go.Binding('portId', 'portId'),
              $(go.Shape, 'Rectangle', {
                stroke: null,
                strokeWidth: 0,
                desiredSize: new go.Size(8, 8),
                margin: new go.Margin(1, 0)},
                new go.Binding('fill', 'portColor')
                )
            )
        },
        new go.Binding('itemArray', 'itemArrayTop')
      ),
      $(go.Panel, 'Horizontal',
        { row: 3,
          column: 1,
          itemArray: [{'portColor': '#ffffff', 'portId': 'bottom'}],
          itemTemplate:
            $(go.Panel,
              {
                _side: 'bottom',
                fromSpot: go.Spot.Bottom,
                toSpot: go.Spot.Bottom,
                fromLinkable: true,
                cursor: 'crosshair'
              },
              new go.Binding('portId', 'portId'),
              $(go.Shape, 'Rectangle', {
                stroke: null,
                strokeWidth: 0,
                desiredSize: new go.Size(8, 8),
                margin: new go.Margin(1, 0)},
                new go.Binding('fill', 'portColor')
              )
            )
        },
        new go.Binding('itemArray', 'itemArrayBottom')
      )
    )
    console.log(this.$refs.palette.id)
//    palete面板
    $(go.Palette, this.$refs.palette.id, {
      maxSelectionCount: 1,
      contentAlignment: new go.Spot(0.4, 0.5),
      nodeTemplateMap: myDiagram.nodeTemplateMap,
      model: new go.GraphLinksModel([
        {text: '机器学习', name: '', status: 0},
        {text: 'step', name: '', status: 0},
        {text: '数据库', name: '', status: 0},
        {text: '???', name: '', status: 0}
      ])
    })
    myDiagram.linkTemplate =
      $(go.Link, {
        routing: go.Link.AvoidsNodes,
        reshapable: true,
        resegmentable: true,
        relinkableFrom: true,
        relinkableTo: true
      },
      new go.Binding('points').makeTwoWay(),
      $(go.Shape, { stroke: '#2f4f4f', strokeWidth: 2 }),
      $(go.Shape, {toArrow: 'Standard'}))
    var nodeDataArray = []
    var linkDataArray = []
//    完成内容nodeDataArray, linkDataArray的绑定
    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray)
    myDiagram.model.linkFromPortIdProperty = 'fromPort'
    myDiagram.model.linkToPortIdProperty = 'toPort'
    //  get the model data
    var tool = myDiagram.toolManager.draggingTool
    tool.doDropOnto = function (e, obj) {
      self.objData = myDiagram.model.nodeDataArray[nodeDataArray.length - 1]
      self.customProps.name = self.objData.name
      if (self.objData.status === 0) {
        self.showCustom = true
//        拖动放入改变节点风格
        myDiagram.model.setDataProperty(self.objData, 'itemArrayTop', [{'portColor': '#ff0000', 'portId': 'top'}])
        myDiagram.model.setDataProperty(self.objData, 'itemArrayBottom', [{'portColor': '#ff0000', 'portId': 'bottom'}])
        myDiagram.model.setDataProperty(self.objData, 'textAlignment', new go.Spot(0.5, 0.7))
        myDiagram.model.setDataProperty(self.objData, 'nameAlignment', new go.Spot(0.5, 0.4))
        myDiagram.model.setDataProperty(self.objData, 'size', new go.Size(150, 56))
        myDiagram.model.setDataProperty(self.objData, 'font', '6px sans-serif')
        myDiagram.model.setDataProperty(self.objData, 'width', 120)
        myDiagram.model.setDataProperty(self.objData, 'fill', '#ffffff')
      }
    }
    this.modelData = myDiagram.model
    this.Diagram = myDiagram
  },
  components: {
    Hello,
    scriptsTree,
    resourceManager,
    taskTree
  },
  methods: {
    showModel () {
      this.GraphObjectModel = this.modelData.toJSON()
    },
    submitTheProps () {
      this.showCustom = false
      var newtext = this.customProps.name
      console.log(newtext)
      this.Diagram.model.setDataProperty(this.objData, 'name', newtext)
      this.objData.status = 1
    },
    setLayout () {
      let digraphLayout = new this.$go.LayeredDigraphLayout()
      digraphLayout.direction = 90
      this.Diagram.layout = digraphLayout
      var reCover = () => {
        this.Diagram.layout = new this.$go.Layout()
      }
      setTimeout(reCover, 100)
    },
    cancelCreate () {
      console.log(this.objData.status)
      if (this.objData.status === 0) {
        this.Diagram.commandHandler.deleteSelection()
      }
    },
    createSaveSelect (e) {
      if (e === '1') {
        this.modelShow = true
      } else {
        console.log(this.fileName)
        var taskForm = new FormData()
        taskForm.append('name', this.fileName)
        taskForm.append('id', this.fileId)
        taskForm.append('viewJson', JSON.stringify(this.modelData))
        this.axios.post('http://' + this.$mainUrl + '/windata-server/web/api/tasks', taskForm).then((res) => {
          console.log(res)
        })
      }
    },
    selectTree (select) {
      this.showTree = select
    },
    createFile () {
      console.log(this.fileName)
      if (this.fileName !== '') {
        var temp = this.showTree
        this.showTree = -1
        var recover = () => {
          this.showTree = temp
        }
        setTimeout(recover, 10)
        var taskForm = new FormData()
        taskForm.append('name', this.fileName)
        this.axios.post('http://' + this.$mainUrl + '/windata-server/web/api/tasks', taskForm).then((res) => {
          var taskData = res.data.content.data
          this.fileId = taskData.id
        })
      } else {
        alert('请输入文件名')
      }
    },
    selectFile (e) {
      console.log(e)
    },
    showFileDia (fileJson) {
      console.log(fileJson, 'hahaha')
      var fileModel = JSON.parse(fileJson)
      fileModel = JSON.parse(fileModel)
      console.dir(fileModel, 'filemode dir')
      fileModel.nodeDataArray.forEach((item) => {
        item.size = new this.$go.Size(item.size.width, item.size.height)
        item.width = 120
        item.nameAlignment = new this.$go.Spot(item.nameAlignment.x, item.nameAlignment.y)
        item.textAlignment = new this.$go.Spot(item.textAlignment.x, item.textAlignment.y)
      })
      console.log(fileModel.linkDataArray, 'link')
      console.log(fileModel.nodeDataArray[0].nameAlignment, 'node')
//      console.log(JSON.parse(fileModel), '2131')
      this.Diagram.model = new this.$go.GraphLinksModel(fileModel.nodeDataArray, fileModel.linkDataArray)
      this.modelData = this.Diagram.model
    }
  }
}
</script>

<style lang="scss">
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
    height:80px;
    line-height: 80px;
  }
  .logo{
    height:80px;
    span {
      width:80px;
      height: 80px;
      background: url('./assets/image/Windata.png');
      background-size:100% 100%;
    }
  }
  .right-content{
    margin-left:900px !important;
  }

  .ivu-menu-vertical{
    display:inline-block;
  }
  .content-container{
    display: flex;
  }

  .info{
    width:180px;
  }
  .ivu-tree-title{
    font-size: 0.5rem;
  }

  .auto-layout{
    background: url('../image/autoLayout.jpg');
    position:absolute;
    top: 130px;
    right:40px;
    background-size:100% 100%;
    width: 30px;
    height: 20px;
    z-index: 100;
  }

  .create-save{
    height:40px;
    background: rgb(200,200,200);
    line-height: 40px;
  }

  .create-save .ivu-menu-item{
    height:40px;
    background: rgb(200,200,200);
    color: black !important;
  }
  .create-save .ivu-menu-item-active{
    background: #e0e0e0 !important;
    color: #0000ff !important;
  }

  .create-save .ivu-menu-item:hover{
    background: #e0e0e0 !important;
  }


</style>
