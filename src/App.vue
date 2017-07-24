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
              新建任务
          </Menu-item>
          <Menu-item name="2">
              保存任务
          </Menu-item>
          <Menu-item name="3">
              删除任务
          </Menu-item>
          <Menu-item name="4">
              运行任务
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
      title="定制图表框属性"
      @on-ok="submitTheProps"
      @on-cancel="cancelCreate"
      >
      <div class="customProps">
        <span>节点名: </span><input type="text" v-model="customProps.name">
        <span>索引名: </span><input type="text" v-model="customProps.indexName">
        <span>查询模板:</span><textarea cols="70" rows="10" v-model="customProps.jsonFile" v-if="update"></textarea>
        <button style="margin-left:16%; margin-top:2%; margin-right:60%" @click="format">格式化查询模板</button>
        <div class='date-type' v-for="(item,key) in outputTypeArray"><span>{{item}}</span><input type="text" v-model="param[key]"></div>
      </div>
    </Modal>
    <Modal
      v-model="showCustom2"
      title="定制图表框属性"
      @on-ok = "submitTheProps"
      @on-cancel ="cancelCreate"
    >
      <div class="customProps">
        <span>节点名: </span><input type="text" v-model="customProps.name">
      </div>
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
      customProps: {name: '', jsonFile: ''},
      objData: {},
      Diagram: '',
      theme1: 'dark',
      theme2: 'light',
      theme3: 'primary',
      modelShow: false,
      fileName: '',
      showTree: '1',
      fileId: '',
      update: true,
      outputTypeArray: [],
      param: [],
      showCustom2: false
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
        click: function (e, object) {
          self.objData = object.data
        },
        doubleClick: function (e, obj) {
          console.log(self.fileId, 'aa')
          console.log(obj.data.name)
          self.axios.get(`http://${self.$mainUrl}/windata-server/web/api/taskNode?taskNodeId=${obj.data.id}&name=${obj.data.name}`).then((res) => {
            if (res.data.content.errorCode === 200) {
              try {
                self.customProps.name = res.data.content.data.name
              } catch (e) {
                self.customProps.name = ''
              }
              try {
                var param = JSON.parse(res.data.content.data.paramJson)
              } catch (e) {
                param = {}
              }
              console.log(param)
              self.customProps.indexName = param.indexName
              self.customProps.jsonFile = param.searchTemplate
              var i = 0
              for (var key in param.searchParams) {
                self.param[i] = param.searchParams[key]
                i++
              }
              if (obj.data.type === 1000 || obj.data.type === 1001) {
                self.showCustom = true
              } else {
                self.showCustom2 = true
              }
              console.log(self.param, 'param')
            } else {
              alert(res.data.content.errorMsg)
            }
          }).catch((e) => {
            alert(e)
          })
          // 浅拷贝出对象数据
          self.objData = obj.data
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
        {text: '源数据查询', name: '', id: '', status: 0, type: 1000},
        {text: '聚合查询', name: '', id: '', status: 0, type: 1001},
        {text: '数据导出', name: '', id: '', status: 0, type: 9000},
        {text: '消息通知', name: '', id: '', status: 0, type: 8000}
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
      self.objData = myDiagram.model.nodeDataArray[myDiagram.model.nodeDataArray.length - 1]
      console.log(self.objData, 'sasa')
      self.customProps.name = self.objData.name
      if (self.objData.status === 0) {
          //  初始化节点编辑框
        if (self.objData.type === 1000 || self.objData.type === 1001) {
          self.showCustom = true
          self.customProps.jsonFile = ''
          self.outputTypeArray = []
          self.param = []
        } else {
          console.log(self.objData.type)
          self.showCustom2 = true
        }
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
    myDiagram.commandHandler.deleteSelection = function (obj) {
      go.CommandHandler.prototype.deleteSelection.call(myDiagram.commandHandler)
      console.log(self.objData)
      var delNodeForm = new FormData()
      delNodeForm.append('taskId', self.fileId)
      delNodeForm.append('taskNodeId', self.objData.id)
      self.axios.post('http://' + self.$mainUrl + '/windata-server/web/api/taskNodes/del', delNodeForm).then((res) => {
        if (res.data.content.errorCode === 200) {
          console.log(res)
        } else {
          alert(res.data.content.errorMsg)
        }
      }).catch((error) => {
        alert(error)
      })
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
      var flag = 0 // flag为1时，判断不符合要求的提交
      if (this.objData.type === '1000' || this.objData.type === '10001') {
        if (this.customProps.name === '' || this.customProps.jsonFile === '' || this.param.indexOf('') !== -1 || this.param === []) {
          flag = 1
        }
      } else {
        if (this.customProps.name === '') {
          flag = 1
        }
      }
      if (flag === 1) {
        alert('请填写所有字段，提交失败')
        this.objData.status = 1
      } else {
        var newtext = this.customProps.name
        console.log(newtext)
        console.log(this.fileId)
        this.Diagram.model.setDataProperty(this.objData, 'name', newtext)
        this.objData.status = 1
//        构建nodeForm的data数据上传节点数据
        var nodeForm = new FormData()
        nodeForm.append('name', newtext)
        nodeForm.append('taskId', this.fileId)
        nodeForm.append('viewType', this.objData.type)
        nodeForm.append('id', this.objData.id)
        console.log(this.objData.id, 'hehe')
        var nodeParam = {}
        nodeParam.indexName = this.customProps.indexName
        nodeParam.searchTemplate = this.customProps.jsonFile
        nodeParam.searchParams = {}
        this.outputTypeArray.forEach((item, index) => {
          nodeParam.searchParams[item] = this.param[index]
        })
        nodeParam = JSON.stringify(nodeParam)
        nodeForm.append('paramJson', nodeParam)
        //  上传节点
        this.axios.post('http://' + this.$mainUrl + '/windata-server/web/api/taskNodes', nodeForm).then((res) => {
          if (res.data.content.errorCode === 200) {
            this.objData.id = res.data.content.data.id
          } else {
            alert(res.data.content.errorMsg)
          }
          console.log(this.objData.id, 'hehe1')
        }).catch((res) => {
          alert(res)
        })
      }
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
      } else if (e === '2') {
        console.log(this.fileName)
        var taskForm = new FormData()
        taskForm.append('name', this.fileName)
        taskForm.append('id', this.fileId)
        console.log(this.modelData, 'before stringfy')
        taskForm.append('viewJson', JSON.stringify(this.modelData))
        console.log(this.modelData, 'after stringfy')
        this.axios.post('http://' + this.$mainUrl + '/windata-server/web/api/tasks', taskForm).then((res) => {
          if (res.data.content.errorCode === 200) {
            console.log(res)
          } else {
            alert(res.data.content.errorMsg)
          }
        }).catch((error) => {
          alert(error)
        })
      } else if (e === '3') {
        var temp = this.showTree
        this.showTree = -1
        var recover = () => {
          this.showTree = temp
        }
        setTimeout(recover, 10)
        var delTask = new FormData()
        delTask.append('name', this.fileName)
        delTask.append('id', this.fileId)
        this.axios.post('http://' + this.$mainUrl + '/windata-server/web/api/tasks/del', delTask).then((res) => {
          if (res.data.content.errorCode === 200) {
            console.log(res)
          } else {
            alert(res.data.content.errorMsg)
          }
        }).catch((error) => {
          alert(error)
        })
      } else {
        var runTask = new FormData()
        runTask.append('id', this.fileId)
        this.axios.post('http://' + this.$mainUrl + '/windata-server/web/api/task/run', runTask).then((res) => {
          if (res.data.content.errorCode === 200) {
            console.log(res)
          } else {
            alert(res.data.content.errorMsg)
          }
        }).catch((error) => {
          alert(error)
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
          if (res.data.content.errorCode === 200) {
            var taskData = res.data.content.data
            this.fileId = taskData.id
          } else {
            alert(res.data.content.errorMsg)
          }
        }).catch((error) => {
          alert(error)
        })
      } else {
        alert('请输入文件名')
      }
    },
    showFileDia (fileJson, name, id) {
      console.log(fileJson, 'fileJson')
      console.log(name, 'name')
      console.log(id, 'id')
      this.fileName = name
      this.fileId = id
      console.log(fileJson, 'fileJson')
      var fileModel = JSON.parse(fileJson)
      fileModel = JSON.parse(fileModel)
      console.log(fileModel, 'hahaha')
      try {
        fileModel.nodeDataArray.forEach((item) => {
          item.size = new this.$go.Size(item.size.width, item.size.height)
          item.width = 120
          item.nameAlignment = new this.$go.Spot(item.nameAlignment.x, item.nameAlignment.y)
          item.textAlignment = new this.$go.Spot(item.textAlignment.x, item.textAlignment.y)
        })
      } catch (e) {
        fileModel = {}
        fileModel.nodeDataArray = []
        fileModel.linkDataArray = []
      }
//      console.log(fileModel.linkDataArray, 'link')
//      console.log(fileModel.nodeDataArray[0].nameAlignment, 'node')
      this.Diagram.model.nodeDataArray = fileModel.nodeDataArray
      this.Diagram.model.linkDataArray = fileModel.linkDataArray
//      this.modelData = this.Diagram.model
    },
    format () {
      console.log(this.customProps.jsonFile)
      try {
        var customProps = JSON.parse(this.customProps.jsonFile)
      } catch (e) {
        alert('请输入正确的json格式文件')
      }
      this.update = false
      var recover = () => {
        this.update = true
      }
      setTimeout(recover, 10)
      this.customProps.jsonFile = JSON.stringify(customProps, null, '\t')
      var regEx = new RegExp(/\{\{(.*?)\}\}/g)
      var outputArray = this.customProps.jsonFile.match(regEx)
      outputArray = outputArray.map(function (item) {
        item = item.replace(/\{/g, '')
        item = item.replace(/\}/g, '')
        return item
      })
      console.log(outputArray)
      this.outputTypeArray = outputArray
    }
  }
}
</script>

<style scoped>
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
  .logo {
    height: 80px;
  }

  .logo  span {
      width:80px;
      height: 80px;
      background: url('./assets/image/Windata.png');
      background-size:100% 100%;
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
    background: rgb(200,200,200) !important;
    color: black !important;
  }
  .create-save .ivu-menu-item-active{
    background: #e0e0e0 !important;
    color: #0000ff !important;
  }

  .create-save .ivu-menu-item:hover{
    background: #e0e0e0 !important;
  }

  .customProps{
    display:flex;
    flex-wrap:wrap
  }

  .customProps span{
    width: 15%;
    margin-top:2%;
    margin-right: 10px;
  }

  .customProps input{
    width: 40%;
    margin-top:2%;
    margin-right: 40%;
  }

  .customProps textarea{
    margin-top:2%;
  }

  .date-type{
    width:100%
  }
</style>
