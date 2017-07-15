<template>
  <div id="app">
    <Menu mode="horizontal" :theme="theme1" active-name="1">
      <Menu-item class="logo">
        <span></span>
      </Menu-item>
      <Menu-item>
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
      <Menu :theme="theme2" width="50px">
          <Menu-item name="1" class="left-nav"></Menu-item>
        <router-link to="/taskTree"><Menu-item name="2" class="left-nav">任务开发</Menu-item></router-link>
        <router-link to="/scriptsTree"><Menu-item name="3" class="left-nav">脚本开发</Menu-item></router-link>
        <router-link to="/resourceManager"><Menu-item name="4" class="left-nav">资源管理</Menu-item></router-link>
          <Menu-item name="5" class="left-nav">函数管理</Menu-item>
          <Menu-item name="6" class="left-nav">表查询</Menu-item>
      </Menu>
      <router-view></router-view>
      <div style="width:240px; height:80px; top: 85px; left: 210px; position:absolute; z-index: 99; background: #ffffff;">
        <span style="display:inline-block; position:relative; text-align: center; top: 60px; font-size: 1rem; border: red 1px solid; width:90px">节点组件</span>
      </div>
      <span>
        <div id='myPaletteDiv' ref="palette" style="border: solid 1px red; width:90px; height: 50vh; background: #ffffff;position:absolute;top:100px;left: 210px;z-index: 98">
        </div>
      </span>
      <span>
        <div id="myDiagramDiv" ref="diagram"
             style="width:1650px; height:100vh; background-color: #ffffff; border: solid 1px black">
        </div>
      </span>
    </div>
    <br>
    <button @click="showModel">show model</button>
    <p>this is {{GraphObjectModel}}</p>
    <Modal
      v-model="showCustom"
      title="普通的Modal对话框标题"
      @on-ok="submitTheProps"
      >
      <input type="text" v-model="customProps.name">
      <p>对话框内容</p>
      <p>对话框内容</p>
    </Modal>
  </div>
</template>

<script>
import Hello from './components/Hello'

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
      theme2: 'light'
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
//          obj.data.text = 'one'
//          myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray)
        },
        actionMove: function (e, obj) {
//            浅拷贝出对象数据
//          self.objData = obj.data
          console.log(1)
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
          { fill: '#ffffff',
            stroke: 'blue',
            strokeWidth: 2,
            desiredSize: new go.Size(70, 32)},
            new go.Binding('desiredSize', 'size')),
        $(go.TextBlock,
          {margin: 5, stroke: 'black', font: '8px sans-serif', wrap: go.TextBlock.None, alignment: new go.Spot(0.5, 0.5)},
          new go.Binding('font'),
          new go.Binding('text').makeTwoWay(),
          new go.Binding('alignment', 'textAlignment').makeTwoWay()),
        $(go.TextBlock,
          {margin: 5, stroke: 'black', font: 'normal small-caps bolder 14px cursive', wrap: go.TextBlock.None, overflow: go.TextBlock.OverflowEllipsis, width: 50, alignment: new go.Spot(0.5, 0.5), textAlign: 'center'},
          new go.Binding('text', 'name').makeTwoWay(),
          new go.Binding('width').makeTwoWay(),
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
    var nodeDataArray = [{text: 'unitOne', name: 'haha'}
    ]
    var linkDataArray = []
//    完成内容nodeDataArray, linkDataArray的绑定
    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray)
    myDiagram.model.linkFromPortIdProperty = 'fromPort'
    myDiagram.model.linkToPortIdProperty = 'toPort'
    //  get the model data
    var tool = myDiagram.toolManager.draggingTool
    tool.doDropOnto = function (e, obj) {
      console.log(2)
      self.objData = myDiagram.model.nodeDataArray[nodeDataArray.length - 1]
      self.customProps.name = self.objData.name
      if (self.objData.status === 0) {
        self.showCustom = true
//        拖动放入改变节点风格
        myDiagram.model.setDataProperty(self.objData, 'itemArrayTop', [{'portColor': '#ff0000', 'portId': 'top'}])
        myDiagram.model.setDataProperty(self.objData, 'itemArrayBottom', [{'portColor': '#ff0000', 'portId': 'bottom'}])
        myDiagram.model.setDataProperty(self.objData, 'textAlignment', new go.Spot(0.5, 0.7))
        myDiagram.model.setDataProperty(self.objData, 'nameAlignment', new go.Spot(0.5, 0.4))
//        myDiagram.model.setDataProperty(self.objData, 'text', `\n\n\n\n\n${self.objData.text}`)
        myDiagram.model.setDataProperty(self.objData, 'size', new go.Size(150, 56))
        myDiagram.model.setDataProperty(self.objData, 'font', '6px sans-serif')
        myDiagram.model.setDataProperty(self.objData, 'width', 120)
      }
      self.objData.status = 1
    }
    this.modelData = myDiagram.model
    this.Diagram = myDiagram
  },
  components: {
    Hello
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
/*#myDiagramDiv{*/
  /*display:inline-block;*/
/*}*/
/*#myPaletteDiv{*/
  /*display:inline-block;*/
/*}*/

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
    width:150px;
  }
  .ivu-tree-title{
    font-size: 1rem;
  }


</style>
