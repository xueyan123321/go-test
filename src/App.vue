<template>
  <div id="app">
    <span>
      <div id='myPaletteDiv' ref="palette" style="border: solid 1px black; width:200px; height: 400px; background: #ff0000">
      </div>
    </span>
    <span>
      <div id="myDiagramDiv" ref="diagram"
           style="width:400px; height:400px; background-color: #DAE4E4;">
      </div>
    </span>
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
    <hello></hello>
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
      objData: {}
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
        }
      },
      // the body
      $(go.Panel, 'Auto', {
        row: 2,
        column: 1,
        name: 'BODY',
        stretch: go.GraphObject.fill
      },
        $(go.Shape, 'Rectangle',
          { fill: '#ffffff',
            stroke: null,
            strokeWidth: 0,
            desiredSize: new go.Size(112, 56)}),
        $(go.TextBlock,
          {margin: 0, stroke: 'black', font: 'bold 16px sans-serif', editable: true},
          new go.Binding('text').makeTwoWay())
      ),
      //  the port number
      $(go.Panel, 'Horizontal',
        { row: 1,
          column: 1,
          itemArray: [{'portColor': '#ff0000', 'portId': 'bottom0'}],
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
        }
      ),
      $(go.Panel, 'Horizontal',
        { row: 3,
          column: 1,
          itemArray: [{'portColor': '#ff0000', 'portId': 'top0'}],
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
        }
      )
    )
    console.log(this.$refs.palette.id)
    $(go.Palette, this.$refs.palette.id, {
      maxSelectionCount: 1,
      contentAlignment: new go.Spot(0.5, 20),
      nodeTemplateMap: myDiagram.nodeTemplateMap,
      model: new go.GraphLinksModel([
        {text: '机器学习', name: ''},
        {text: 'step', name: ''},
        {text: '数据库', name: ''},
        {text: '???', name: ''}
      ])
    })
    myDiagram.linkTemplate =
      $(go.Link, {
        routing: go.Link.AvoidsNodes,
        corner: 4,
        curve: go.Link.Bezier,
        reshapable: true,
        resegmentable: true,
        relinkableFrom: true,
        relinkableTo: true
      },
      new go.Binding('points').makeTwoWay(),
      $(go.Shape, { stroke: '#2f4f4f', strokeWidth: 2 }),
      $(go.Shape, {toArrow: 'Standard'}))
    var nodeDataArray = [{text: 'unit\nOne', name: 'haha'}
    ]
    var linkDataArray = []
    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray)
    myDiagram.model.linkFromPortIdProperty = 'fromPort'
    myDiagram.model.linkToPortIdProperty = 'toPort'
    //  get the model data
    this.modelData = myDiagram.model
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
      this.objData.name = this.customProps.name
    }
  }
}
</script>

<style lang="scss">

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
    margin-top: 60px;
  }
</style>
