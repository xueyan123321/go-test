
<template>
  <div>
    <div class="menu info"><span class="upload" @click="upload"></span></div>
    <Tree :data="baseData" class="info"></Tree>
    <Modal
      v-model="modalUpload"
      title="资源上传">
      <div class="resource-container">
        <label for="name">名称：</label><input type="text" v-model="name" id="name">
        <label for="upload">上传：</label><input type="file" id="upload">
        <label for="description">描述：</label><Input v-model="description" type="textarea" :rows="4" placeholder="请输入..." id="description"></Input>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    data () {
      return {
        baseData: [{
          title: `<span class="icon"></span> parent 123`,
          children: [{
            title: '<span class="icon"></span> parent 1-0',
            disabled: true,
            children: [{
              title: '<span class="icon"></span> leaf'
            }, {
              title: '<span class="icon"></span> leaf'
            }]
          }, {
            title: '<span class="icon"></span> parent 1-1',
            checked: true,
            children: [{
              title: '<span class="icon"></span> leaf</span>'
            }]
          }]
        }],
        modalUpload: false,
        name: '',
        description: ''
      }
    },
    methods: {
      upload () {
        this.modalUpload = true
      }
    }
  }
</script>

<style scoped lang="scss">
  .info{
    width:230px;
    padding-left:10px;
  }
  .icon{
    width:15px;
    height:15px;
    background: url('../../assets/image/p14.png');
    background-size:100% 100%;
  }
  .ivu-tree-title, ivu-tree-children{
    display:inline !important;
  }
  .menu{
    display: inline-block;
    padding: 10px 0 0 10px;
  }
  .upload{
    display: inline-block;
    width:15px;
    height: 15px;
    background: url('upload.jpg');
    padding:0px;
    margin-left:200px;
    background-size:100% 100%;
    cursor:pointer
  }

  .resource-container{
    display:flex;
    flex-wrap: wrap;
  }

  .resource-container label{
    width:10%;
    margin-top:2%;
  }

  .resource-container{
    input {
      width:30%;
      margin-right: 55%;
      margin-top: 2%;
    }
  }

</style>
