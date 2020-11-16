<template >
    <div class="btn-style">
        <div >
            {{num}}/{{allNum}}
        </div>
        <div @click="changeBig" class="big">
            <span class="icon-mark_enlarge"></span>
        </div>
        <div @click="changeSmall" class="small">
            <span class="icon-mark_narrow"></span>
        </div>
        <div @click="changeRotate" class="rotate">
            <span class="icon-mark_rotate"></span>
        </div>
        <div @click="changeComment" class="marl" v-if="isComment != 2">
            <span class="icon-mark_mark"></span>
        </div>
    </div>
</template>
<script>
export default {
    name:'tool',
    props:{
        allNum:Number,
        num:Number,
        isComment:Boolean
    },
    methods:{
        changeBig(){
            this.$parent.changeBig()
        },
        changeRotate(){
            this.$parent.changeRotate()
        },
        changeSmall(){
            this.$parent.changeSmall()
        },
        changeComment(){
            this.$parent.changeTool(false)
        }
    }
}
</script>
<style scoped>
    .btn-style{
        height: 56px;
        color:#ffffff;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }
    .btn-style div{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .btn-style div:hover{
        background: rgba(255,255,255,0.10);
        cursor: pointer;
    }
    .btn-style div:active{
        background: rgba(0,0,0,0);
        cursor: pointer;
    }
    [class*=" icon-"]:active::before, [class^="icon-"]:active::before{
        cursor: pointer;
        color:#4CBD74;
        background: rgba(0,0,0,0);
    }
</style>