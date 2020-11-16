<template>
  <div id="app">
        <comment-task-image ></comment-task-image>
  </div>
</template>

<script>
import commentTaskImage from './components/comment'
export default {
    name:'app',
    data(){
      return {
    
      }
    },
    components:{
      commentTaskImage
    },
    
}
</script>

<style  scoped>

#app{
    
    width: 100%;
    height: 100%;
    font-size: 14px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    min-height: 875px;
    overflow: hidden;

}

</style>