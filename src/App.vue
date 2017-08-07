<template>
  <div id="app">
    <Menu mode="horizontal" :theme="theme1" active-name="1" class="menu-horizontal">
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
        <Menu-item name="2" class="left-nav">资源管理</Menu-item>
      </Menu>

      <taskTree v-if="showTree === '1'"
                @getFile="showFileDia"
                @sentResponse="cover=true"
                @receiveResponse="cover=false"
                @responseError="cover=false"></taskTree>
      <resourceManager v-else></resourceManager>

      <div style="width:240px; height:140px; top: 100px; left: 240px; position:absolute; z-index: 99; background: #ffffff;">
        <span style="display:inline-block; position:relative; text-align: center; top: 120px; font-size: 0.5rem; border: black 1px solid; width:90px">节点组件</span>
      </div>
      <span>
        <div id='myPaletteDiv' ref="palette" style="border: solid 1px black; width:90px; height: 50vh; background: #ffffff;position:absolute;top:175px;left: 240px;z-index: 98">
        </div>
      </span>
      <span>
        <Menu mode="horizontal" :theme="theme3" active-name="1" @on-select="createSaveSelect" class="create-save">
          <Modal v-model="modelShow" title="请输入文件名称" @on-ok="createFile">
            <input type="text" v-model="newFileName">
          </Modal>
          <Menu-item name="1">
            <span class="create-task"></span>
              新建任务
          </Menu-item>
          <Menu-item name="2">
            <span class="save-task"></span>
              保存任务
          </Menu-item>
          <Menu-item name="3">
            <span class="delete-task"></span>
              删除任务
          </Menu-item>
          <Menu-item name="4">
            <span class="run-task"></span>
              运行任务
          </Menu-item>
        </Menu><div class="diagram-container" style="position: relative">
          <div id="myDiagramDiv" ref="diagram"
               style="width:85vw; height:80vh; background-color: #ffffff; border: solid 1px black;">
          </div>
          <span @click="setLayout" class="auto-layout"></span>
        </div>
      </span>
    </div>
    <br>
    <!--<button @click="showModel">show model</button>-->
    <!--<p>this is {{GraphObjectModel}}</p>-->
    <Modal
      v-model="showCustom"
      title="定制图表框属性"
      @on-ok="submitTheProps"
      @on-cancel="cancelCreate"
      >
      <div class="customProps">
        <span>节点名: </span><input type="text" v-model="customProps.name">
        <span>索引名: </span><input type="text" v-model="customProps.indexName">
        <strong class="title">查询命令</strong>
        <div class="query-part">
          <span class="title-template">查询模板:</span><textarea cols="70" rows="10" v-model="customProps.jsonFile" v-if="update"></textarea>
          <button style="margin-left:0%; margin-top:2%; margin-right:60%" @click="format">格式化查询模板</button>
          <div class='date-type' v-for="(item,key) in outputTypeArray"><span>{{item}}</span><input type="text" v-model="param[key]"></div>
        </div>
        <strong class="title">查询字段</strong>
        <div class="query-item">
          <input type="text" v-model="queryItem" id="queryItem" @keydown="keyAddItem"><button @click="addItem">添加字段</button>
          <div class="first-drop-area"
               @dragover="preventAction"
               @drop="changeOrder"
          >0</div>
          <div v-for="(item,index) in items" class="segment">
            <div class="li-framework">
              <div class="middle-area li-left-area" v-show="showArea"
                   @dragover="preventAction"
                   @drop="changeOrder"
                   @dragenter="showArrow"
                   @dragleave="hideArrow">
                {{index}}
              </div>
              <li draggable="true" :id="index"
                  @dragstart="startDrag"
                  @dragend="endDrag"
                  @drag="showTheArea"><div style="width: 40px;
    display: inline-block;
    text-overflow: ellipsis; overflow:hidden; vertical-align: middle; white-space: normal"  :title="item">{{item}}</div> <div class="delete-part"><span class="delete-icon" @click="deleteItem(item)"></span></div></li>
              <div class="middle-area li-right-area" v-show="showArea"
                   @dragover="preventAction"
                   @drop="changeOrder"
                   @dragenter="showArrow"
                   @dragleave="hideArrow">{{index+1}}
              </div>
            </div><div  class="middle-area"
                  @dragover="preventAction"
                  @drop="changeOrder"
                  @dragenter="showArrow"
                  @dragleave="hideArrow">{{index}}
            </div>
          </div>
          <div class="last-drop-area"
                     @dragover="preventAction"
                     @drop="changeOrder">{{items.length}}<span style="color:red;visibility: hidden;">haha</span>
          </div>
        </div>
      </div>
    </Modal>
    <Modal
      v-model="weatherSave"
      @on-ok="saveLastFile"
    >
      <div style="text-align: center;font-size: 1rem">是否保存上一次图表数据?</div>
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
import Hello from './components/Hello'
import scriptsTree from './components/scriptsTree'
import resourceManager from './components/resourceManager'
import taskTree from './components/taskTree'

export default {
  name: 'app',
  data () {
    return {
      newFileName: '',
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
      showCustom2: false,
      cover: false,
      diaChanged: false,
      weatherSave: false,
      lastFileName: '',
      lastFileId: '',
      lastModelData: {},
      queryItem: '',
      items: [],
      showArea: false
    }
  },
  mounted () {
    var go = this.$go
    var self = this
    console.log(this.$refs.diagram.id)
    var $ = go.GraphObject.make
    this.axios.interceptors.request.use(function (config) {
      self.cover = true
      return config
    }, function (error) {
      return Promise.reject(error)
    })
    this.axios.interceptors.response.use(function (response) {
      self.cover = false
      return response
    }, function (error) {
      self.cover = false
      return Promise.reject(error)
    })
    var myDiagram =
      $(go.Diagram, this.$refs.diagram.id,
        {
          allowDrop: true,
          initialContentAlignment: go.Spot.Center, // center Diagram contents
          'undoManager.isEnabled': true, // enable Ctrl-Z to undo and Ctrl-Y to redo
          'panningTool.isEnabled': false
        })
    //  define a simple Node template
    myDiagram.nodeTemplate = $(go.Node, 'Table',
      {
        locationObjectName: 'BODY',
        locationSpot: go.Spot.Center,
        selectionObjectName: 'BODY',
        click: function (e, object) {
          self.objData = object.data
          console.log(self.objData)
        },
        doubleClick: function (e, obj) {
          console.log(self.fileId, 'aa')
          console.log(obj.data.name)
          self.outputTypeArray = []
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
              console.log(param, 'param')
              self.customProps.indexName = param.indexName
              self.customProps.jsonFile = param.searchTemplate
              self.queryItem = ''
              if (param.specifyColumns !== undefined) {
                self.items = param.specifyColumns
              } else {
                self.items = []
              }
              var i = 0
              for (var key in param.searchParams) {
                self.outputTypeArray.push(key)
                self.param[i] = param.searchParams[key]
                i++
              }
              if (obj.data.type === 1000 || obj.data.type === 1001) {
                self.showCustom = true
              } else {
                self.showCustom2 = true
              }
              console.log(res.data.content.data.paramJson, 'paramJson')
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
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      // the body
      $(go.Panel, go.Panel.Spot, {
        row: 2,
        column: 1,
        name: 'BODY',
        stretch: go.GraphObject.fill
      },
        $(go.Shape, 'Rectangle',
          { fill: 'rgb(223,240,254)',
            stroke: '#0099cc',
            strokeWidth: 0.6,
            desiredSize: new go.Size(70, 32)},
//          绑定设置形状属性
            new go.Binding('desiredSize', 'size'),
            new go.Binding('fill'),
            new go.Binding('stroke')),
        $(go.TextBlock,
          {margin: 5, stroke: 'black', font: '8px sans-serif', wrap: go.TextBlock.None, alignment: new go.Spot(0.5, 0.5)},
//          类型绑定设置属性
          new go.Binding('font'),
          new go.Binding('text'),
          new go.Binding('alignment', 'textAlignment')),
        $(go.TextBlock,
          {margin: 5, stroke: 'black', font: 'normal normal bolder 14px serif', wrap: go.TextBlock.None, overflow: go.TextBlock.OverflowEllipsis, width: 50, alignment: new go.Spot(0.5, 0.5), textAlign: 'center'},
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
        {text: '源数据查询', name: '', id: '', status: 0, type: 1000, loc: ''},
        {text: '聚合查询', name: '', id: '', status: 0, type: 1001, loc: ''},
        {text: '数据导出', name: '', id: '', status: 0, type: 9000, loc: ''},
        {text: '消息通知', name: '', id: '', status: 0, type: 8000, loc: ''}
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
      $(go.Shape, { stroke: '#0099cc', strokeWidth: 2 }),
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
          self.customProps.indexName = ''
          self.customProps.jsonFile = ''
          self.outputTypeArray = []
          self.param = []
          self.queryItem = ''
          self.items = []
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
        myDiagram.model.setDataProperty(self.objData, 'stroke', 'rgb(0,153,204)')
      }
    }
    myDiagram.commandHandler.deleteSelection = function (obj) {
      go.CommandHandler.prototype.deleteSelection.call(myDiagram.commandHandler)
      console.log(self.objData)
      var delNodeForm = new FormData()
      delNodeForm.append('taskId', self.fileId)
      delNodeForm.append('taskNodeId', self.objData.id)
      if (self.objData.status !== 0) {
        self.axios.post('http://' + self.$mainUrl + '/windata-server/web/api/taskNodes/del', delNodeForm).then((res) => {
          if (res.data.content.errorCode === 200) {
            console.log(res)
          } else {
            alert('删除:' + res.data.content.errorMsg)
          }
        }).catch((error) => {
          alert(error)
        })
        self.createSaveSelect('2')
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
      var flag = 0 // flag为1时，判断不符合要求的提交
      if (this.objData.type === 1000 || this.objData.type === 1001) {
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
        if (this.objData.status === 0) {
          this.Diagram.commandHandler.deleteSelection()
        }
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
        if (this.item !== []) {
          nodeParam.specifyColumns = this.items
        } else {
          nodeParam.specifyColumns = '所有字段'
        }
        nodeParam = JSON.stringify(nodeParam)
        nodeForm.append('paramJson', nodeParam)
        //  上传节点
        this.axios.post('http://' + this.$mainUrl + '/windata-server/web/api/taskNodes', nodeForm).then((res) => {
          if (res.data.content.errorCode === 200) {
            this.objData.id = res.data.content.data.id
            this.createSaveSelect('2')
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
    preventAction (event) {
//      event.target.getElementsByTagName('span')[0].style.visibility = 'visible'
//      var hideArrow = () => {
//        event.target.getElementsByTagName('span')[0].style.visibility = 'hidden'
//      }
//      setTimeout(hideArrow, 1000)
      event.preventDefault()
    },
    changeOrder (event) {
      // 拖拽位置点
      event.target.style.position = 'absolute'
      console.log(event.target.innerText)
      //  获取拖拽目标索引
      var id = event.dataTransfer.getData('id')
      console.log(this.items[id.valueOf()])
      console.log(id, 'id')
      // 插入拖拽位置点
      var itemValue = this.items[id.valueOf()]
      this.items.splice(id.valueOf(), 1)
      this.items.splice(event.target.innerText.valueOf(), 0, itemValue)
    },
    startDrag (evt) {
      evt.dataTransfer.setData('id', evt.target.id)
    },
    showTheArea (evt) {
      this.showArea = true
      evt.target.style.visibility = 'hidden'
    },
    endDrag (evt) {
      this.showArea = false
      evt.target.style.visibility = 'visible'
    },
    showArrow (evt) {
      console.log(evt)
      evt.target.style.position = 'static'
    },
    hideArrow (evt) {
      evt.target.style.position = 'absolute'
    },
    saveFile (fileName, fileId, modelData) {
      var taskForm = new FormData()
      taskForm.append('name', fileName)
      taskForm.append('id', fileId)
      console.log(this.modelData, 'before stringfy')
      taskForm.append('viewJson', JSON.stringify(modelData))
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
//        保存成功表格变化位置为假
      this.diaChanged = false
    },
    createSaveSelect (e) {
      if (e === '1') {
        this.modelShow = true
      } else if (e === '2') {
        console.log(this.fileName)
        this.saveFile(this.fileName, this.fileId, this.modelData)
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
        this.saveFile(this.fileName, this.fileId, this.modelData)
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
      console.log(this.newFileName)
      // 刷新任务列表
      if (this.newFileName !== '') {
        var temp = this.showTree
        this.showTree = -1
        var recover = () => {
          this.showTree = temp
        }
        setTimeout(recover, 10)
        //
        var taskForm = new FormData()
        taskForm.append('name', this.newFileName)
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
        this.newFileName = ''
      } else {
        alert('请输入文件名')
      }
    },
    saveLastFile () {
      this.saveFile(this.lastFileName, this.lastFileId, this.lastModelData)
    },
    changeListener () {
        //   文件改变，表格变化位为真
      this.diaChanged = true
      console.log(this.diaChanged)
    },
    showFileDia (fileJson, name, id) {
      if (this.diaChanged === true) {
        this.weatherSave = true
      }
//        表格变化位置位为假
      this.diaChanged = false
      this.Diagram.model.removeChangedListener(this.changeListener)
      console.log(fileJson, 'fileJson')
      console.log(name, 'name')
      console.log(id, 'id')
      // 保存上次数据以便询问是否保存上次数据
      this.lastFileName = this.fileName
      this.lastFileId = this.fileId
      console.log(this.lastFileName, 'lastFileName')
      console.log(this.lastFileId, 'lastFileId')

      for (var key in this.modelData) {
        this.lastModelData[key] = this.modelData[key]
      }
      // 更换现name和id
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
//      this.Diagram.layout = new this.$go.LayeredDigraphLayout()
//      this.modelData = this.Diagram.model
      var addChangelisten = () => {
        this.Diagram.model.addChangedListener(this.changeListener)
      }
      setTimeout(addChangelisten, 100)
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
    },
    addItem () {
//        判断是否已经有了这个字段
      if (this.items.indexOf(this.queryItem) !== -1) {
        alert('已经有了这个字段！')
      } else {
        if (this.queryItem !== '') {
          this.items.push(this.queryItem)
          this.queryItem = ''
        } else {
          alert('不能为空')
        }
      }
    },
    deleteItem (item) {
      this.items = this.items.filter(it => it !== item
      )
    },
    keyAddItem (event) {
      if (event.keyCode === 13) {
        this.addItem()
      }
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
    height:60px;
    width:99vw;
    line-height: 60px;
  }
  .menu-horizontal{
    background-color: rgb(33,37,40);
  }
  .logo {
    height: 60px;
  }

  .logo  span {
      width:70px;
      height: 55px;
      background: url('./assets/image/Windata.png');
      background-size:100% 100%;
      background-position: 0 3px;
  }

  .right-content{
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
    top: 10px;
    right:10px;
    background-size:100% 100%;
    width: 30px;
    height: 20px;
    z-index: 100;
    cursor:pointer;
  }

  .create-save{
       height:30px;
       width:85vw !important;
       background: rgb(248,248,248);
       line-height: 30px;
  }

  .create-save .ivu-menu-item{
    height:30px;
    background: rgb(248,248,248) !important;
    color: black !important;
    font-size: 0.5rem;
  }
  .create-save .ivu-menu-item-active{
    background: rgb(248,248,248) !important;
    color: #000000 !important;
  }

  .create-save .ivu-menu-item:hover{
    background: rgb(248,248,248) !important;
  }

  .customProps{
    display:flex;
    flex-wrap:wrap
  }

  .customProps span{
    width: 15%;
    margin-top:2%;
    margin-right: 2px;
  }

  .customProps .title{
    margin-top:2%;
    display:inline-block;
    margin-bottom:1%;
    width:100%;
    font-size:0.8rem;
  }

  .customProps .title-template{
    width:100%;
  }

  .customProps .query-part{
    border: #000000 solid 1px;
    padding:2%;
  }

  .customProps .item-content{
    display:inline-block;
  }

  .query-item li{
    list-style: none;
    border: 1px solid;
    border-radius: 5px;
    width:80px;
    display:inline-block;
    text-align: right;
    margin-top:10px;
    margin-left:10px;
    text-overflow: ellipsis;
  }

  .query-item .segment{
    display:inline-block;
  }

  .li-framework{
    position: relative;
    display:inline-block;
  }

  .query-item .middle-area{
    display:inline-block;
    height:30px;
    vertical-align: middle;
    width:25px;
    background: white;
    color: white;
    cursor:crosshair;
    top:5px;
  }

  .first-drop-area{
    display:inline-block;
    position: absolute;
    bottom:140px;
    left:0px;
    width:16px;
    height: 40px;
    color:white;
    background: white;
    vertical-align: middle;
    cursor:crosshair
  }

  .query-item .li-left-area{
    position: absolute;
    height:40px;
    width:90px;
    opacity: 0.2;
    z-index:2;
  }

  .query-item .li-right-area{
    position: absolute;
    height:40px;
    width:0px;
    opacity: 0.2;
    right:0px;
    z-index:2;
    top:0px;
  }

  .last-drop-area{
    margin-top:2px;
    display:inline-block;
    width:100px;
    height: 25px;
    color:white;
    background: white;
    vertical-align: middle;
  }

  .query-item button{
    margin-right:40%;
  }

  .customProps input{
    width: 40%;
    margin-top:2%;
    margin-right: 40%;
  }

  .customProps textarea{
    margin-top:2%;
  }

  .customProps .delete-icon{
    display:inline-block;
    width:10px;
    height: 10px;
    background: url('assets/image/deleteIcon.png');
    background-size:100% 100% ;
    margin-right:1%;
  }

  .delete-part{
    border-left: 1px solid;
    display:inline-block;
    padding: 2px;
  }

  .query-item{
    width:100%;
  }

  .query-item input{
    margin-right:10px;
  }

  .date-type{
    width:100%
  }

  .create-task{
    height: 18px;
    width: 22px;
    background: url('../image/create-file.png');
    background-size:100% 100%;
    vertical-align: middle;
  }

  .save-task{
    height: 20px;
    width: 24px;
    background: url('../image/savefile.png');
    background-size:100% 100%;
    vertical-align: middle;
  }

  .run-task{
    height: 20px;
    width: 24px;
    background: url('../image/runtask.jpg');
    background-size:100% 100%;
    vertical-align: middle;
  }

  .delete-task{
    height: 16px;
    width: 16px;
    margin-right:4px;
    background: url('../image/remove.png');
    background-size:100% 100%;
    vertical-align: middle;
  }

  @media (max-width: 1680px){
    .ivu-menu-horizontal{
      width:100vw;
    }
  }

</style>

<style>
  .spinner {
    margin: 100px auto;
    width: 20px;
    height: 20px;
    position: absolute;
    top:250px;
    left:1000px;
    z-index:4;
  }

  .container1 > div, .container2 > div, .container3 > div {
    width: 6px;
    height: 6px;
    background-color: #00ffff;

    border-radius: 100%;
    position: absolute;
    -webkit-animation: bouncedelay 1.2s infinite ease-in-out;
    animation: bouncedelay 1.2s infinite ease-in-out;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }

  .spinner .spinner-container {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .container2 {
    -webkit-transform: rotateZ(45deg);
    transform: rotateZ(45deg);
  }

  .container3 {
    -webkit-transform: rotateZ(90deg);
    transform: rotateZ(90deg);
  }

  .circle1 { top: 0; left: 0; }
  .circle2 { top: 0; right: 0; }
  .circle3 { right: 0; bottom: 0; }
  .circle4 { left: 0; bottom: 0; }

  .container2 .circle1 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }

  .container3 .circle1 {
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
  }

  .container1 .circle2 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }

  .container2 .circle2 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }

  .container3 .circle2 {
    -webkit-animation-delay: -0.7s;
    animation-delay: -0.7s;
  }

  .container1 .circle3 {
    -webkit-animation-delay: -0.6s;
    animation-delay: -0.6s;
  }

  .container2 .circle3 {
    -webkit-animation-delay: -0.5s;
    animation-delay: -0.5s;
  }

  .container3 .circle3 {
    -webkit-animation-delay: -0.4s;
    animation-delay: -0.4s;
  }

  .container1 .circle4 {
    -webkit-animation-delay: -0.3s;
    animation-delay: -0.3s;
  }

  .container2 .circle4 {
    -webkit-animation-delay: -0.2s;
    animation-delay: -0.2s;
  }

  .container3 .circle4 {
    -webkit-animation-delay: -0.1s;
    animation-delay: -0.1s;
  }

  @-webkit-keyframes bouncedelay {
    0%, 80%, 100% { -webkit-transform: scale(0.0) }
    40% { -webkit-transform: scale(1.0) }
  }

  @keyframes bouncedelay {
    0%, 80%, 100% {
      transform: scale(0.0);
      -webkit-transform: scale(0.0);
    } 40% {
        transform: scale(1.0);
        -webkit-transform: scale(1.0);
      }
  }

  .cover{
    position:absolute;
    bottom:0px;
    top:0px;
    left:0px;
    right:0px;
    background:#000;
    opacity:0.7;
    z-index:100;
  }

</style>

