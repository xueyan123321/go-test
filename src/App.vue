<template>
  <div id="app">
    <div id="myDiagramDiv" ref="diagram"
         style="width:400px; height:400px; background-color: #DAE4E4;">
    </div>
    <hello></hello>
  </div>
</template>

<script>
import Hello from './components/Hello'

export default {
  name: 'app',
  mounted () {
    var go = this.$go
    console.log(this.$refs.digram)
    var $ = go.GraphObject.make
    var myDiagram =
      $(go.Diagram, this.$refs.diagram.id,
        {
          initialContentAlignment: go.Spot.Center, // center Diagram contents
          'undoManager.isEnabled': true // enable Ctrl-Z to undo and Ctrl-Y to redo
        })
    //  define a simple Node template
    myDiagram.nodeTemplate = $(go.Node, 'Table',
      // the body
      $(go.Panel, 'Auto', {
        row: 2,
        column: 1,
        name: 'Body',
        stretch: go.GraphObject.fill
      },
        $(go.Shape, 'Rectangle',
          { fill: '#ffffff',
            stroke: null,
            strokeWidth: 0,
            desiredSize: new go.Size(112, 56)}),
        $(go.TextBlock,
          'Default Text',
          {margin: 0, stroke: 'black', font: 'bold 16px sans-serif'},
          new go.Binding('text', 'name'))
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
      ),
      $(go.Panel, 'Horizontal',
        { row: 3,
          column: 1,
          itemArray: [{'portColor': '#ff0000', 'portId': 'bottom0'}],
          itemTemplate:
            $(go.Panel,
              {
                _side: 'bottom',
                fromSpot: go.Spot.Bottom,
                toSpot: go.Spot.Bottom,
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
      )
    )
    myDiagram.linkTemplate =
      $(go.Link, {
        routing: go.Link.AvoidsNodes,
        corner: 4,
        curve: go.Link.JumpGap,
        reshapable: true,
        resegmentable: true,
        relinkableFrom: true,
        relinkableTo: true
      },
      $(go.Shape, { stroke: '#2f4f4f', strokeWidth: 2 }))
//    go.Diagram.inherit(CustomLink, go.Link)
    var model = $(go.Model)
    model.nodeDataArray = [
        {key: 'Don', name: 'Don Meow'},
        {key: 'Co', name: 'Copricat'},
        {key: 'De', name: 'Demeter'}
    ]
    model.linkDataArray = [
      {from: 'Don', to: 'co'}
    ]
    myDiagram.model = model
  },
  components: {
    Hello
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
