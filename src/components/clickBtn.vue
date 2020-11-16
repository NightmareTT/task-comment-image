<template >
    <div>
        <div class="main-pen" v-show="showPen">
            <div class="right-error">
                <div :class="[penTypeNum==item.id?'active':'']" v-for="(item,index) in penType" :key="index + 'a'"  @click="drawPen(item.id)"> 
                     <span :class="item.icon"></span>
                </div>
            </div>
            <div   class="write-pen">
                <div :class="[penTypeNum==5?'active':'','rotate']" @click="drawPen(5)">
                    <span class="icon-mark_graffiti" ></span>
                </div>
                <div class='line' ></div>
                <div :class="[sizeNum==item.id?'focus':'','focus-size']"  v-for="(item,index) in sizeType" :key="index + 'b'"  @click="drawPenSize(item.id)" > 
                    <div :class="[sizeNum==item.id?'active':'',item.className]"></div>
                </div>
                <div class='line' ></div>
                <div :class="[colorNum==item.id?'focus':'','focus-size']" v-for="(item,index) in colorType" :key="index + 'c'"  @click="drawPenColor(item.id)"  > 
                    <div :class="[colorNum==item.id?'active':'',item.className]" ></div>
                </div>
            </div>
        </div>
        <!-- <div class="main-sticke" v-show="showSticke">
            dsdd
        </div> -->
        <div class="btn-style" style="background:rgba(0,0,0,0.90);">
            <div @click="changeBig">
                <span class="icon-mark_enlarge"></span>
            </div>
            <div @click="changeSmall">
                <span class="icon-mark_narrow"></span>
            </div>
            <div @click="changeRotate">
               <span class="icon-mark_rotate"></span>
            </div>
            <div class='line'></div>
            <div :class="[btnNum==item.id&&btnBool?'active':'']" v-for="(item,index) in mainBtn" :key="index" @click="changeBtn(item.id)">
                 <span :class="item.icon"></span>
            </div>  
            <div class='line'></div>
            <div  @click="undo" ><span class="icon-mark_revoke"></span></div>
            <div class="last-one" @click="saveJson">完成</div>
        </div>
        
    </div>
</template>
<script>
export default {
    name:'clickBtn',
    data(){
        return {
            mainBtn:[
                {
                    id:0,
                    icon:'icon-mark_move1'
                },
                {
                    id:5,
                    icon:'icon-mark_mark'
                },
                // {
                //     id:6,
                //     icon:'icon-mark_sticker1'
                // },
                // {
                //     id:7,
                //     icon:'icon-mark_text'
                // },
                // {
                //     id:8,
                //     icon:'icon-mark_voice1'
                // }
                ],
            show:false,
            showSticke:false,
            penType:[
                {
                    name:'right',
                    icon:"icon-mark_right",
                    id:3
                },
                {
                    name:'ok',
                    icon:"icon-mark_wrong",
                    id:4
                },
           
            ],
            sizeType:[
                {
                    className:'fourSize',
                    id:4
                },
                {
                    className:'tenSize',
                    id:10
                },
                {
                    className:'sixTeenSize',
                    id:16
                },
            ],
            colorType:[
                {
                    id:1,
                     className:'whiteColor',
                },
                {
                    id:2,
                    className:'blackColor',
                },
                {
                    id:3,
                    className:'redColor',
                },
            ],
            colorNum:null,
            sizeNum:null,
            penTypeNum:5,
            btnBool:false,
            btnNum:null,
            showPen:false,
        }
    },
    props:{
        undoDisable:Boolean
    },
    mounted(){
    },
    methods:{
        init(){
            this.penTypeNum = 5
            this.colorNum = 14
            this.sizeNum = 11
        },
        changeBtn(val){
            if(this.btnNum != val){
                this.btnBool = false
            }
            if(val == 5){
                this.showPen = true
            }else{
                this.showPen = false
            }
            if(val == 6){
                this.showSticke = true
            }else{
                this.showSticke = false
            }
            this.btnNum = val
            this.btnBool = !this.btnBool
            if(!this.btnBool){
                this.showPen = false
                this.showSticke = false
                val = 0
            }
            this.init()
            if(val != 5){
                this.$parent.chooseBtn(val,this.btnBool)
            }else if(val == 5){
                this.drawPenSize(10)
                this.drawPenColor(2)
                this.drawPen(5)

            }
        },
        changeBig(){
            this.$parent.changeBig()
        },
        changeRotate(){
            this.$parent.changeRotate()
        },
        changeSmall(){
            this.$parent.changeSmall()
        },
        undo(){
            this.$parent.undo()
        },
        //对错画笔
        drawPen(val){
            this.penTypeNum = val
            if(val == 5){
                this.$parent.chooseBtn(val,true)
            }else{
                this.$parent.chooseBtn(val,false)
            }
        },
        //画笔大小啊
        drawPenSize(val){
            this.sizeNum = val
            this.$parent.changePenSize(val)
        },
        //画笔颜色
        drawPenColor(val){
            this.colorNum = val
            let color = ''
            if(val == 1){
                color = '#ffffff'
            }else if(val == 2){
                color = '#000000'
            }else if(val == 3){
                color = '#FF303A'
            }
            this.$parent.changePenColor(color)
        },
        //保存数据
        saveJson(){
            this.$parent.closeCanvas('complete')
        }
    }

}
</script>
<style scoped>
  .btn-style{
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
      height: 56px;
  }
  [class*=" icon-"]:hover::before, [class^="icon-"]:hover::before{
       cursor: pointer;
       color:#4CBD74;
  }
  .main-pen{
      position: absolute;
      top: -60px;
      height: 56px;
      width:665px ;
       display: flex;
      flex-direction: row;
  }
  .right-error{
      width: 120px;
      height: 56px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-evenly;
      background:rgba(0,0,0,0.90); 
      margin-right: 4px;
  }
  .btn-style button,.btn-style img{
    width: 50px;
    cursor: pointer;
  }
    .last-one:hover{
        background-color: #FF6F00 ;
    }
    .last-one:active{
        background-color: #E68A00 ;
    }
   .last-one{
        background: #FF9800;
        border-radius: 4px;
        color:white;
        padding:7px 16px;
        cursor: pointer;
   }
  .line{
      height: 19px;
      border: 1px solid #ffffff;
  }
  .color-style{
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
  }
  .write-pen{
        width: 541px;
        height: 56px;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        background:rgba(0,0,0,0.90); 
  }
    .main-sticke{
        position: absolute;
        top: -148px;
        width: 400px;
        height: 144px;
        background: rgba(0,0,0,0.90);
    }
    
    .active [class*=" icon-"]::before,.active [class^="icon-"]::before{
        color:#4CBD74;
    }
    .focus-size{
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        width:50px;
        height:100%
    }
    .focus{
       background: rgba(255,255,255,0.10);
    }
    .fourSize{
        width: 4px;
        height: 4px;
        background-color: #999999;
        border-radius: 50%;
    }
    .tenSize{
        width: 10px;
        height: 10px;
        background-color: #999999;
        border-radius: 50%;
    }
    .sixTeenSize{
        width: 16px;
        height: 16px;
        background-color: #FFFFFF;
        border-radius: 50%;
    }
    .whiteColor{
        width: 22px;
        height: 22px;
        background-color: #FFFFFF;
        border-radius: 50%;
    }
    .blackColor{
        width: 28px;
        height: 28px;
        background-color: #ffffff;
        border-radius: 50%;
    }
    .blackColor::after{
        content:'';
        display: block;
        width: 22px;
        height: 22px;
        background-color: #000000;
        border-radius: 50%;
        position: relative;
        top: 3px;
        left: 3px;
    }
    .redColor{
         width: 22px;
        height: 22px;
        background-color: #FFFFFF;
        border-radius: 50%;
    }
    .redColor::after{
        content:'';
        display: block;
        width: 20px;
        height: 20px;
        background-color:#FF303A;
        border-radius: 50%;
        position: relative;
        top: 1px;
        left: 1px;
    }
</style>