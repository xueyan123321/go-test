<template>
  <div>
    <span>
          <div style="width:240px; height:140px; top: 100px; left: 290px; position:absolute; z-index: 99; background: #ffffff;">
            <span style="display:inline-block; position:relative; text-align: center; top: 120px; font-size: 0.5rem; border: black 1px solid; width:90px">节点组件</span>
          </div>
          <div id='myPaletteDiv' ref="palette" style="border: solid 1px black; width:90px; height: 50vh; background: #ffffff;position:absolute;top:175px;left: 290px;z-index: 98">
          </div>
        </span>
    <span>
          <Menu mode="horizontal" theme="primary" active-name="1" @on-select="createSaveSelect" class="create-save">
            <Modal v-model="createFileModal" title="请输入文件名称" @on-ok="createFile">
              <input type="text" v-model="newFileName">
            </Modal>
            <Menu-item name="createTask">
              <span class="create-task"></span>
                新建任务
            </Menu-item>
            <Menu-item name="saveTask">
              <span class="save-task"></span>
                保存任务
            </Menu-item>
            <Menu-item name="deleteTask">
              <span class="delete-task"></span>
                删除任务
            </Menu-item>
            <Menu-item name="renameTask">
              <span class="rename-task"></span>
               重命名任务
            </Menu-item>
            <Menu-item name="runTask">
              <span class="run-task"></span>
                运行任务
            </Menu-item>
          </Menu>
          <div class="diagram-container" style="position: relative">
            <div id="myDiagramDiv" ref="diagram"
                 style="width:85vw; height:80vh; background-color: #ffffff; border: solid 1px black;">
            </div>
            <span @click="setLayout" class="auto-layout"></span>
          </div>
    </span>
    <!--rename file modal-->
    <Modal v-model="renameModal"
           title="重命名文件"
           class="rename-modal"
           @on-ok="submitNewName"
    >
      <label for="rename">文件名</label>
      <input type="text" id="rename" v-model="task.name">
    </Modal>
    <!--aggregate query and Source data query's modal-->
    <Modal
      v-model="showCustom"
      title="定制图表框属性"
      @on-ok="submitTheProps"
      @on-cancel="cancelCreate"
    >
      <div class="customNodeProps">
        <span>节点名: </span><input type="text" v-model="customNodeProps.name">
        <span>索引名: </span><input type="text" v-model="customNodeProps.indexName">
        <strong class="title">查询命令</strong>
        <div class="query-part">
          <span class="title-template">查询模板:</span><textarea cols="70" rows="10" v-model="customNodeProps.jsonFile" v-if="customNodeProps.update"></textarea>
          <button style="margin-left:0%; margin-top:2%; margin-right:60%" @click="format">格式化查询模板</button>
          <div class='date-type' v-for="(item,key) in customNodeProps.outputTypeArray"><span>{{item}}</span><input type="text" v-model="customNodeProps.param[key]"></div>
        </div>
        <strong class="title">查询字段</strong>
        <div class="query-item">
          <input type="text" v-model="customNodeProps.queryItem" id="queryItem" @keydown="keyAddItem"><button @click="addItem">添加字段</button>
          <div class="first-drop-area"
               @dragover="preventAction"
               @drop="changeOrder"
          >0</div>
          <div v-for="(item,index) in customNodeProps.items" class="segment">
            <div class="li-framework">
              <div class="middle-area li-left-area" v-show="customNodeProps.showArea"
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
              <div class="middle-area li-right-area" v-show="customNodeProps.showArea"
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
               @drop="changeOrder">{{customNodeProps.length}}<span style="color:red;visibility: hidden;">haha</span>
          </div>
        </div>
      </div>
    </Modal>
    <!--data export and message notification's modal-->
    <Modal
      v-model="showCustom2"
      title="定制图表框属性"
      @on-ok = "submitTheProps"
      @on-cancel ="cancelCreate"
    >
      <div class="customNodeProps">
        <span>节点名: </span><input type="text" v-model="customNodeProps.name">
      </div>
    </Modal>
    <!--whether to save modal-->
    <Modal
      v-model="whetherSave"
      @on-ok="saveLastFile"
    >
      <div style="text-align: center;font-size: 1rem">是否保存上一次图表数据?</div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  const SUCCESS = 200
  const SOURCE_QUERY = 1000
  const AGGREGATION_QUERY = 1001
  const DATA_EXPORT = 9000
  const MESSAGE_NOTIFY = 8000
  export default{
    data () {
      return {
        objData: {},
        createFileModal: false,
        newFileName: '',
        //      diagram status
        Diagram: '',
        task: {name: '', id: '', modelData: {}},
        lastTask: {name: '', id: '', modelData: {}},
        diaChanged: false,
        whetherSave: false,
        //      diagram properties' modal
        renameModal: false,
        showCustom: false,
        showCustom2: false,
        customNodeProps: {name: '', jsonFile: '', items: [], param: [], queryItem: '', outputTypeArray: [], showArea: false, update: true}
      }
    },
    props: {
      fileData: Object
    },
    watch: {
      fileData: function () {
        this.showFileDia(this.fileData)
      }
    },
    mounted () {
      //  设置拦截器
      this.setAxiosInterceptor()
      var go = this.$go
      var $ = go.GraphObject.make
      var {modelData, Diagram} = this.initTheDiagram($, go)
      this.task.modelData = modelData
      this.Diagram = Diagram
    },
    methods: {
      setAxiosInterceptor () {
        //  设置axios拦截器
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
      },
      initTheDiagram ($, go) {
        var self = this
        console.log(this.$refs.diagram.id)
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
              console.log(self.task.id, 'aa')
              console.log(obj.data.name)
              self.customNodeProps.outputTypeArray = []
              self.axios.get(`http://${self.$mainUrl}/windata-server/web/api/taskNode?taskNodeId=${obj.data.id}&name=${obj.data.name}`).then((res) => {
                if (res.data.content.errorCode === SUCCESS) {
                  try {
                    self.customNodeProps.name = res.data.content.data.name
                  } catch (e) {
                    self.customNodeProps.name = ''
                  }
                  try {
                    var param = JSON.parse(res.data.content.data.paramJson)
                  } catch (e) {
                    param = {}
                  }
                  console.log(param, 'param')
                  self.customNodeProps.indexName = param.indexName
                  self.customNodeProps.jsonFile = param.searchTemplate
                  self.customNodeProps.queryItem = ''
                  if (param.specifyColumns !== undefined) {
                    self.customNodeProps.items = param.specifyColumns
                  } else {
                    self.customNodeProps.items = []
                  }
                  var i = 0
                  for (var key in param.searchParams) {
                    self.customNodeProps.outputTypeArray.push(key)
                    self.customNodeProps.param[i] = param.searchParams[key]
                    i++
                  }
                  if (obj.data.type === SOURCE_QUERY || obj.data.type === AGGREGATION_QUERY) {
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
            {text: '源数据查询', name: '', id: '', status: 0, type: SOURCE_QUERY, loc: ''},
            {text: '聚合查询', name: '', id: '', status: 0, type: AGGREGATION_QUERY, loc: ''},
            {text: '数据导出', name: '', id: '', status: 0, type: DATA_EXPORT, loc: ''},
            {text: '消息通知', name: '', id: '', status: 0, type: MESSAGE_NOTIFY, loc: ''}
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
          self.customNodeProps.name = self.objData.name
          if (self.objData.status === 0) {
            //  初始化节点编辑框
            if (self.objData.type === SOURCE_QUERY || self.objData.type === AGGREGATION_QUERY) {
              self.showCustom = true
              self.customNodeProps.indexName = ''
              self.customNodeProps.jsonFile = ''
              self.customNodeProps.outputTypeArray = []
              self.customNodeProps.param = []
              self.customNodeProps.queryItem = ''
              self.customNodeProps.items = []
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
          delNodeForm.append('taskId', self.task.id)
          delNodeForm.append('taskNodeId', self.objData.id)
          if (self.objData.status !== 0) {
            self.axios.post('http://' + self.$mainUrl + '/windata-server/web/api/taskNodes/del', delNodeForm).then((res) => {
              if (res.data.content.errorCode === SUCCESS) {
                console.log(res)
              } else {
                alert('删除:' + res.data.content.errorMsg)
              }
            }).catch((error) => {
              alert(error)
            })
            self.createSaveSelect('saveTask')
          }
        }
        return {modelData: myDiagram.model, Diagram: myDiagram}
      },
      //  methods relate to node Custom Property
      submitTheProps () {
        var correctSubmit = true // correctSubmit为false时，判断不符合要求的提交
        if (this.objData.type === SOURCE_QUERY || this.objData.type === AGGREGATION_QUERY) {
          if (this.customNodeProps.name === '' || this.customNodeProps.jsonFile === '' || this.customNodeProps.param.indexOf('') !== -1 || this.customNodeProps.param === []) {
            correctSubmit = false
          } else {
            correctSubmit = true
          }
        } else {
          if (this.customNodeProps.name === '') {
            correctSubmit = false
          } else {
            correctSubmit = true
          }
        }
        if (correctSubmit === false) {
          alert('请填写所有字段，提交失败')
          if (this.objData.status === 0) {
            this.Diagram.commandHandler.deleteSelection()
          }
        } else {
          var newtext = this.customNodeProps.name
          console.log(newtext)
          console.log(this.task.id)
          this.Diagram.model.setDataProperty(this.objData, 'name', newtext)
          this.objData.status = 1
//        构建nodeForm的data数据上传节点数据
          var nodeForm = new FormData()
          nodeForm.append('name', newtext)
          nodeForm.append('taskId', this.task.id)
          nodeForm.append('viewType', this.objData.type)
          nodeForm.append('id', this.objData.id)
          console.log(this.objData.id, 'hehe')
          var nodeParam = {}
          nodeParam.indexName = this.customNodeProps.indexName
          nodeParam.searchTemplate = this.customNodeProps.jsonFile
          nodeParam.searchParams = {}
          this.customNodeProps.outputTypeArray.forEach((item, index) => {
            nodeParam.searchParams[item] = this.customNodeProps.param[index]
          })
          if (this.item !== []) {
            nodeParam.specifyColumns = this.customNodeProps.items
          } else {
            nodeParam.specifyColumns = '所有字段'
          }
          nodeParam = JSON.stringify(nodeParam)
          nodeForm.append('paramJson', nodeParam)
          //  上传节点
          this.axios.post('http://' + this.$mainUrl + '/windata-server/web/api/taskNodes', nodeForm).then((res) => {
            if (res.data.content.errorCode === SUCCESS) {
              this.objData.id = res.data.content.data.id
              this.createSaveSelect('saveTask')
            } else {
              alert(res.data.content.errorMsg)
            }
            console.log(this.objData.id, 'hehe1')
          }).catch((res) => {
            alert(res)
          })
        }
      },
      cancelCreate () {
        console.log(this.objData.status)
        if (this.objData.status === 0) {
          this.Diagram.commandHandler.deleteSelection()
        }
      },
      preventAction (event) {
        event.preventDefault()
      },
      changeOrder (event) {
        // 拖拽位置点
        event.target.style.position = 'absolute'
        console.log(event.target.innerText)
        //  获取拖拽目标索引
        var id = event.dataTransfer.getData('id')
        console.log(this.customNodeProps.items[id.valueOf()])
        console.log(id, 'id')
        // 插入拖拽位置点
        var itemValue = this.customNodeProps.items[id.valueOf()]
        this.customNodeProps.items.splice(id.valueOf(), 1)
        this.customNodeProps.items.splice(event.target.innerText.valueOf(), 0, itemValue)
      },
      startDrag (evt) {
        evt.dataTransfer.setData('id', evt.target.id)
      },
      showTheArea (evt) {
        this.customNodeProps.showArea = true
        evt.target.style.visibility = 'hidden'
      },
      endDrag (evt) {
        this.customNodeProps.showArea = false
        evt.target.style.visibility = 'visible'
      },
      showArrow (evt) {
        console.log(evt)
        evt.target.style.position = 'static'
      },
      hideArrow (evt) {
        evt.target.style.position = 'absolute'
      },
      createSaveSelect (e) {
        if (e === 'createTask') {
          this.createFileModal = true
        } else if (e === 'saveTask') {
          console.log(this.task.name)
          this.saveFile(this.task.name, this.task.id, this.task.modelData)
        } else if (e === 'deleteTask') {
          this.deleteTask()
        } else if (e === 'runTask') {
          this.runTask()
        } else if (e === 'renameTask') {
          this.renameTask()
        } else {
          alert('未知错误')
        }
      },
      saveFile (fileName, fileId, modelData) {
        var taskForm = new FormData()
        taskForm.append('name', fileName)
        taskForm.append('id', fileId)
        console.log(this.task.modelData, 'before stringfy')
        taskForm.append('viewJson', JSON.stringify(modelData))
        console.log(this.task.modelData, 'after stringfy')
        this.axios.post('http://' + this.$mainUrl + '/windata-server/web/api/tasks', taskForm).then((res) => {
          if (res.data.content.errorCode === SUCCESS) {
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
      deleteTask () {
        var temp = this.showTree
        this.showTree = -1
        var recover = () => {
          this.showTree = temp
        }
        setTimeout(recover, 10)
        var delTask = new FormData()
        delTask.append('name', this.task.name)
        delTask.append('id', this.task.id)
        this.axios.post('http://' + this.$mainUrl + '/windata-server/web/api/tasks/del', delTask).then((res) => {
          if (res.data.content.errorCode === SUCCESS) {
            console.log(res)
          } else {
            alert(res.data.content.errorMsg)
          }
        }).catch((error) => {
          alert(error)
        })
      },
      runTask () {
        this.saveFile(this.task.name, this.task.id, this.task.modelData)
        var runTask = new FormData()
        runTask.append('id', this.task.id)
        this.axios.post('http://' + this.$mainUrl + '/windata-server/web/api/task/run', runTask).then((res) => {
          if (res.data.content.errorCode === SUCCESS) {
            console.log(res)
          } else {
            alert(res.data.content.errorMsg)
          }
        }).catch((error) => {
          alert(error)
        })
      },
      renameTask () {
        this.renameModal = true
      },
      createFile () {
        console.log(this.newFileName)
        this.manipulateName(this.newFileName)
        this.newFileName = ''
      },
      submitNewName () {
        this.manipulateName(this.task.name, this.task.id)
      },
      manipulateName (newFileName, id) {
        // 刷新任务列表
        if (!id) {
          id = ''
        }
        if (newFileName !== '') {
          var temp = this.showTree
          this.showTree = -1
          var recover = () => {
            this.showTree = temp
          }
          setTimeout(recover, 10)
          //
          var taskForm = new FormData()
          taskForm.append('name', newFileName)
          taskForm.append('id', id)
          this.axios.post('http://' + this.$mainUrl + '/windata-server/web/api/tasks', taskForm).then((res) => {
            if (res.data.content.errorCode === SUCCESS) {
              var taskData = res.data.content.data
              this.task.id = taskData.id
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
      saveLastFile () {
        this.saveFile(this.lastTask.name, this.lastTask.id, this.lastTask.modelData)
      },
      changeListener () {
        //   文件改变，表格变化位为真
        this.diaChanged = true
        console.log(this.diaChanged)
      },
      showFileDia ({fileJson, name, id} = {fileJson: '', name: '', id: ''}) {
        console.log(fileJson, 'fileJson')
        console.log(name, 'name')
        console.log(id, 'id')
        // 保存上次数据以便询问是否保存上次数据
        this.querryChange()
        this.lastTask.name = this.task.name
        this.lastTask.id = this.task.id
        console.log(this.lastTask.name, 'lastFileName')
        console.log(this.lastTask.id, 'lastFileId')

        for (var key in this.task.modelData) {
          this.lastTask.modelData[key] = this.task.modelData[key]
        }
        // 更换现name和id
        this.task.name = name
        this.task.id = id
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
//      this.task.modelData = this.Diagram.model
        var addChangelisten = () => {
          this.Diagram.model.addChangedListener(this.changeListener)
        }
        setTimeout(addChangelisten, 100)
      },
      querryChange () {
        if (this.diaChanged === true) {
          this.whetherSave = true
        }
//        表格变化位置位为假
        this.diaChanged = false
        this.Diagram.model.removeChangedListener(this.changeListener)
      },
      format () {
        console.log(this.customNodeProps.jsonFile)
        try {
          var customNodeProps = JSON.parse(this.customNodeProps.jsonFile)
        } catch (e) {
          alert('请输入正确的json格式文件')
        }
        this.customNodeProps.update = false
        var recover = () => {
          this.customNodeProps.update = true
        }
        setTimeout(recover, 10)
        this.customNodeProps.jsonFile = JSON.stringify(customNodeProps, null, '\t')
        var regEx = new RegExp(/\{\{(.*?)\}\}/g)
        var outputArray = this.customNodeProps.jsonFile.match(regEx)
        outputArray = outputArray.map(function (item) {
          item = item.replace(/\{/g, '')
          item = item.replace(/\}/g, '')
          return item
        })
        console.log(outputArray)
        this.customNodeProps.outputTypeArray = outputArray
      },
      addItem () {
//        判断是否已经有了这个字段
        if (this.customNodeProps.items.indexOf(this.customNodeProps.queryItem) !== -1) {
          alert('已经有了这个字段！')
        } else {
          if (this.customNodeProps.queryItem !== '') {
            this.customNodeProps.items.push(this.customNodeProps.queryItem)
            this.customNodeProps.queryItem = ''
          } else {
            alert('不能为空')
          }
        }
      },
      deleteItem (item) {
        this.customNodeProps.items = this.customNodeProps.items.filter(it => it !== item
        )
      },
      keyAddItem (event) {
        if (event.keyCode === 13) {
          this.addItem()
        }
      },
      setLayout () {
        let digraphLayout = new this.$go.LayeredDigraphLayout()
        digraphLayout.direction = 90
        this.Diagram.layout = digraphLayout
        var recoverLayout = () => {
          this.Diagram.layout = new this.$go.Layout()
        }
        setTimeout(recoverLayout, 100)
      }
    }
  }
</script>

<style lang="scss"
       rel="stylesheet/scss" scoped>
  $menuBackground:rgb(248,248,248);
  @import '../../assets/scss/mixin.scss';
  .auto-layout{
    @include imgIcon('autoLayout.jpg');
    position:absolute;
    top: 10px;
    right:10px;
    width: 30px;
    height: 20px;
    z-index: 100;
    cursor:pointer;
  }

  .create-save {
    height:30px;
    width:85vw !important;
    background: $menuBackground;
    line-height: 30px;
    .ivu-menu-item {
      height: 30px;
      color: #000000;
      font-size: 0.5rem;
      background: $menuBackground;
    }
    .ivu-menu-item-active {
      background: $menuBackground;
      color: #000000;
    }
    .ivu-menu-item:hover {
      background: $menuBackground;
    }
  }

  .customNodeProps{
    display:flex;
    flex-wrap:wrap;
    span{
      width: 15%;
      margin-top:2%;
      margin-right: 2px;
    }
    .title{
      margin-top:2%;
      display:inline-block;
      margin-bottom:1%;
      width:100%;
      font-size:0.8rem;
    }
    .title-template{
      width:100%;
    }
    .query-part{
      border: #000000 solid 1px;
      padding:2%;
    }
    .item-content{
      display:inline-block;
    }
    input{
      width: 40%;
      margin-top:2%;
      margin-right: 40%;
    }
    textarea{
      margin-top:2%;
    }
    .delete-icon{
      display:inline-block;
      width:10px;
      height: 10px;
      background: url('deleteIcon.png');
      background-size:100% 100% ;
      margin-right:1%;
    }
  }

  .query-item{
    width:100%;
    li{
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
    .segment{
      display:inline-block;
    }
    .middle-area{
      display:inline-block;
      height:30px;
      vertical-align: middle;
      width:25px;
      background: white;
      color: white;
      cursor:crosshair;
      top:5px;
    }
    .li-left-area{
      position: absolute;
      height:40px;
      width:90px;
      opacity: 0.2;
      z-index:2;
    }
    .li-right-area{
      position: absolute;
      height:40px;
      width:0px;
      opacity: 0.2;
      right:0px;
      z-index:2;
      top:0px;
    }
    button{
      margin-right:40%;
    }
    input{
      margin-right:10px;
    }
  }

  .li-framework{
    position: relative;
    display:inline-block;
  }

  .first-drop-area{
    display:inline-block;
    position: absolute;
    bottom:140px;
    left:0px;
    width:16px;
    height: 40px;
    color:#ffffff;
    background: #ffffff;
    vertical-align: middle;
    cursor:crosshair
  }

  .last-drop-area{
    margin-top:2px;
    display:inline-block;
    width:100px;
    height: 25px;
    color:#ffffff;
    background: #ffffff;
    vertical-align: middle;
  }

  .delete-part{
    border-left: 1px solid;
    display:inline-block;
    padding: 2px;
  }

  .date-type{
    width:100%
  }

  .create-task{
    @include imgIcon('create-file.png');
    height: 18px;
    width: 22px;
  }

  .save-task{
    @include imgIcon('savefile.png');
    height: 20px;
    width: 24px;
  }

  .rename-task{
    @include imgIcon('rename.png');
    height:14px;
    width: 15px;
    margin-right: 2px;
  }

  .run-task{
    @include imgIcon('runtask.jpg');
    height: 20px;
    width: 24px;
  }

  .delete-task{
    @include imgIcon('remove.png');
    height: 16px;
    width: 18px;
    margin-right:4px;
  }

  .rename-modal{
    label{
      margin-right:10px;
    }
  }

  @media (max-width: 1680px){
    .ivu-menu-horizontal{
      width:100vw;
    }
  }
</style>
