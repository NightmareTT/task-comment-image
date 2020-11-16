<template >
    <div class="main-content">
        <div class="close">
            <div class="complete" v-if="modalMsg == 'complete'">
            <svg t="1605092176515" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11660" width="60" height="60"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512-230.4-512-512-512z m0 832c-38.4 0-64-25.6-64-64s25.6-64 64-64 64 25.6 64 64-25.6 64-64 64z m64-256c0 38.4-25.6 64-64 64s-64-25.6-64-64V256c0-38.4 25.6-64 64-64s64 25.6 64 64v320z" p-id="11661" fill="#FC9D30"></path></svg>
            <p>批注保存后将不可修改，是否确定？</p>
            <div class="btn-style">
                <div class="save-btn" @click="saveJson">确定</div>
                <div class="cancel-btn" @click="cancle">取消</div>
            </div>
            <div class="close-modal" @click="cancle"></div>
        </div>
        <div class="draft"  v-if="modalMsg == 'draft'">
            <svg t="1605092176515" class="icon"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11660" width="60" height="60"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512-230.4-512-512-512z m0 832c-38.4 0-64-25.6-64-64s25.6-64 64-64 64 25.6 64 64-25.6 64-64 64z m64-256c0 38.4-25.6 64-64 64s-64-25.6-64-64V256c0-38.4 25.6-64 64-64s64 25.6 64 64v320z" p-id="11661" fill="#FC9D30"></path></svg>
            <p>退出批注，是否保存草稿？</p>
            <div class="btn-style">
                <div class="save-btn" @click="saveJson">是</div>
                <div class="cancel-btn" @click="cancle">否</div>
            </div>
             <div class="close-modal" @click="cancle"></div>
        </div>
        </div>
        
    </div>
</template>
<script>
export default {
    name:'closeModal',
    props:{
        modalMsg:String
    },
    data(){
        return{

        }
    },
    methods:{
        cancle(){
            this.$parent.closeModal()
        },
        saveJson(){
            this.$parent.saveJson(this.modalMsg)
        }
    }
}
</script>
<style scoped>
    .main-content{
        position: fixed;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .close{
        width: 400px;
        height: 225px;
        background-color: #ffffff;
        border-radius: 4px;
        box-shadow: 0 5px 10px 0 rgba(0,0,0,0.20);
    }
    .save-btn{
        background: #FF9800;
        border-radius: 4px;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        line-height: 32px;
        width: 96px;
        height: 32px;
        margin-right: 16px;
        cursor: pointer;
    }
    .cancel-btn{
        background: #FFFFFF;
        border: 1px solid #CCCCCC;
        border-radius: 4px;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #000000;
        letter-spacing: 0;
        text-align: center;
        line-height: 32px;
        width: 96px;
        height: 32px;
        cursor: pointer;
    }
    .btn-style{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .draft, .complete{
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        height: 100%;
        position: relative;
    }
    .close-modal{
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
    }
    .close-modal::after{
        content: "×";
        display: block;
        position: relative;
        color:#979797;
        font-size: 28px;
    }
</style>