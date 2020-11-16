<template>
    <div class="container">
        <div class='main-canvas'>
            <canvas  id="canvas" ref="canvas" :width="width" :height="height" >
                
            </canvas>
        </div>
        <div class="tool-area" v-if="showTool">
             <tool-bottom :allNum='allNum' :num='num' :isComment='isComment'></tool-bottom>
        </div>
         <div class="work-area" v-else>
            <click-btn  :undoDisable='undoDisable'></click-btn>    
        </div>
      
       <div class="closeCanvas" @click="closeCanvas('draft')"></div>

        <modal-Audio v-if="noAudio" :showMessage='showMessage' :showType='showType' :textContent='textContent'></modal-Audio>  
        <close-modal v-if="showModal" :modalMsg='modalMsg'></close-modal> 
       
        <!-- 左右 -->
        <div class="click-left" @click="leftImage" v-if="showLeft"></div>
        <div class="click-right" @click="rightImage" v-if="showRight"></div>
    </div>
</template>

<script>

var canvas;
// var recorder ;
var img;
var voicePlay;
var voicePause;
import clickBtn from './clickBtn'
import closeModal from './closeModal'
import modalAudio from './modal'
import toolBottom from './tool'
// import {HZRecorder } from '../assets/js/HZRecorder'
export default {
    name: 'task-comment-image',
    data () {
        return {
            width:document.documentElement.clientWidth,   //点击图片传过来
            height: document.documentElement.clientHeight,
            btnClick:false,
            showRight:true,  //显示左右切换
            showLeft:true,
            showTool:true,   // 无画布的工具栏
            modalMsg:'',
            showModal:false,
            watchDisable:false,    //监听返回上一步
            panning:false,
            writePen:false,
            pointer:{},     //鼠标位置
            curOpType:0,
            noAudio:false,
            scaleX:1,
            scaleY:1,
            showMessage:'',   //语音的具体内容判断
            zoom:1,   //放大缩小
            seleteObject:[],
            svgRight: '<svg t="1605012641911" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4442" width="48" height="34"><path d="M997.888 70.144C686.592 261.12 460.8 502.272 358.912 623.104L110.08 428.032 0 516.608l429.568 437.248C503.296 764.416 737.792 394.24 1024 131.072l-26.112-60.928m0 0z" p-id="4443" fill="#FC303A"></path></svg>',
            svgError: '<svg t="1604632250848" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1689" width="48" height="34"><path d="M157.867 874.667l-72.533-59.733c123.733-93.867 238.933-196.267 345.6-307.2-157.867-157.867-277.333-311.467-345.6-375.467l132.267-110.933c81.067 145.067 174.933 281.6 290.133 401.067 110.933-123.733 209.067-256 290.133-405.333 0 0 128 136.533 140.8 115.2-51.2 55.467-170.667 221.867-337.067 388.267 98.133 98.133 200.533 192 311.467 277.333l-29.867 55.467c-132.267-64-251.733-149.333-358.4-251.733-110.933 106.667-234.667 200.533-366.933 273.067v0z" p-id="1690" fill="#FC303A"></path></svg>',
            zoomPoint:new fabric.Point(document.documentElement.clientWidth/2,document.documentElement.clientHeight/2),//初始时缩放原点的位置设为（0,0），这是页面的左上顶点
            lastzoomPoint:{x:document.documentElement.clientWidth/2,y:document.documentElement.clientHeight/2},//初始时，前一次缩放原点同样为(0,0)
            lastmousePoint:{x:document.documentElement.clientWidth/2,y:document.documentElement.clientHeight/2},//进行缩放，需要对此刻缩放位置进行保存，来计算出缩放原点，此刻初始时设为0,0
            lastzoom:1,//表示为上一次的缩放倍数，此刻设为1
            relativeMouseX:0,//表示相对的鼠标位移，用来记录画布的绝对移动距离
            relativeMouseY:0,//表示相对的鼠标位移，用来记录画布的绝对移动距离
            showType:'',    //弹窗显示文本还是语音
            textContent:'',   //打开文本内容
            imgText:require('../assets/image/mark_icon_text.png'),
            imgVoicePlay:require('../assets/image/mark_voice_bt_play.png'),
            imgVoicePause:require('../assets/image/mark_voice_bt_pause.png'),
            backgroundPic:'',
            changeText:false,
            config : {
                canvasState             : [],
                currentStateIndex       : -1,
                redoStatus              : false, //撤销状态
                undoStatus              : false,  // 重做状态
                undoFinishedStatus      : 1,
                redoFinishedStatus      : 1,
            },
            undoDisable:true,
            rotateAngle:'',   //旋转角度
            imageData:[],
            imageIndex:null,   //当前图片index
            dataJson:{},
            allNum:0,  //图片张数
            num:0,
            rotateImage:null,   //图片旋转角度
            isComment:0,    //是否开启审批 0: 未审批，1: 审批未完成， 2： 已审批
        }
    },
    components:{
        clickBtn,
        modalAudio,
        closeModal,
        toolBottom
    },
    props: {
        propData: Array,
  
    },
    created(){
      
    },
    watch:{
        imageIndex(n){
            this.num = n+1
            this.isComment = this.imageData[n].comment
            if(n <= 0){
                this.showRight = true
                this.showLeft = false
            }else if( n == this.imageData.length-1){
                this.showRight = false
                this.showLeft = true
            }else{
                this.showRight = true
                this.showLeft = true
            }
        }
    },
    mounted(){
        //图片  "/files/$!{id}?type=1" 
        this.backgroundPic = ''
        // this.backgroundPic = this.propData
          this.imageData = [
            {
                fileId:require("../assets/image/0.jpg"),
                id:0,
                angel:180,
                json:{},
                comment:0,
            },
            {
                fileId:require("../assets/image/1.jpg"),
                id:1,
                angel:90,
                json:{},
                comment:1,

            },
            {
                fileId:require("../assets/image/2.jpg"),
                id:2,
                angel:90,
                json:{},
                comment:2,
            }
        ]
        let id = 1;
        this.imageData.forEach((item,index) =>{
            if(id == item.id){
                this.backgroundPic = item.fileId
                this.imageIndex = index
                this.rotateImage = item.angle
                this.isComment = item.comment
            }
        })
        // this.onLoad()
        this.enterKeyup()
        img = document.createElement('img')
        img.src = this.imgText
        voicePlay = document.createElement('img')
        voicePlay.src = this.imgVoicePlay
        voicePause = document.createElement('img')
        voicePause.src = this.imgVoicePause
        this.initMouse()
        this.setImage()
        this.indicateSelect(false)
        this.allNum = this.imageData.length
        this.num = this.imageIndex+1

    },
    destroyed(){
        this.enterKeyupDestroyed()
    },
    methods:{
        // 切换图片初始化
        initData(){
            this.initConfig()
            this.setImage()
            // this.initMouse()
        },
        // 重新加载
        onLoad(){
            canvas.loadFromJSON(this.imageData[this.imageIndex].json,canvas.renderAll.bind(canvas));
        },
        // 新增监听键盘事件
        enterKeyupDestroyed() {
            document.removeEventListener("keyup", this.enterKey);
        },
        //监听delete、backspace按键
        enterKeyup() {
            document.addEventListener("keyup", this.enterKey);
        },
        enterKey(event){
            if(event.keyCode == 46 || event.keyCode == 8){
                this.seleteObject.forEach(it=>{
                    canvas.remove(it)
                })
            }
        },
        //监听鼠标事件
        initMouse(e){
           canvas = new fabric.Canvas('canvas');
            let _this = this;
            // //鼠标按下事件
            canvas.on("mouse:down", function(e) {
                _this.pointer = e.pointer
                     //按住alt键才可拖动画布
                console.log(_this.curOpType,'[[][][')
                console.log("211",e.e)
                switch (_this.curOpType){
                    case 0 :
                        if(e.e.altKey) {
                            _this.panning = true;
                            canvas.selection = false;
                        }
                        break;
                    case 2 :
                        // _this.panning = true;
                        // canvas.selection = false;
                        break;
                    case 3 :
                        _this.createRight(e.pointer)
                        break;
                    case 4 :
                        _this.createError(e.pointer)
                        break;
                    case 5 :
                        //
                        _this.createPan(e.pointer)
                        break;
                    case 6 :
                        break;
                    case 7 :
                         _this.changeText = false
                        _this.textContent = ''
                        _this.noAudio = true
                        _this.showType = 'text'
                        break;
                    case 8 :
                        _this.showType = 'voice'
                        _this.noAudio = true
                        // _this.checkAudio()
                        break;
                    default:
                        break;
                }
            });
            //鼠标抬起事件
            canvas.on("mouse:up", function(e) {
                canvas.selection = true;
                _this.panning = false;

            });
            // 移动画布事件
            canvas.on("mouse:move", function(e) {
                if (_this.panning && e && e.e) {
                    var delta = new fabric.Point(e.e.movementX, e.e.movementY);
                    canvas.relativePan(delta);
                    _this.relativeMouseX += e.e.movementX ;//累计每一次移动时候的偏差
					_this.relativeMouseY += e.e.movementY 
                }
            });
            canvas.on('mouse:dblclick', function (e) {
                console.log("shaungji",e)
                _this.changeText = false
                if(e.target &&e.target.class == 'text'){
                    _this.noAudio = true
                    _this.showType = 'text'
                    _this.textContent = e.target.value
                    _this.changeText = true
                }
                 
            });
            // 鼠标滚动画布放大缩小
            canvas.on("mouse:wheel", function(e) {
                _this.changeSize(event.deltaY)
            });

            canvas.on('object:selected', function (e) {
                console.log(e,'sssssss')
                 
            });
        
            canvas.on('selection:created', (e) => {
                console.log(e,'.;.;.;.;.')
                // 选中图层事件触发时，动态更新赋值
                _this.seleteObject = e.selected
                _this.selectedObj = e.target
            })
            //记录事件
            canvas.on('object:modified', function(){
                _this.watchDisable = true
                _this.updateCanvasState()
            });
            canvas.on('object:added', function(e){
                _this.watchDisable = true
                _this.updateCanvasState()
            });
            canvas.on('object:removed', function(){
                _this.updateCanvasState()
            });
            canvas.on('object:rotating', function(){
                _this.updateCanvasState()
            });
        },
         //设置背景图
        setImage(){
            let _this = this
            canvas.setBackgroundImage(_this.backgroundPic, canvas.renderAll.bind(canvas), {
                crossOrigin: 'anonymous',
                top: canvas.getCenter().top,
                left: canvas.getCenter().left,
                originX: 'center',
                originY: 'center'
            });
      
        },
        //变大
        changeBig(){
            this.changeSize('big')
        },
        //缩小
        changeSmall(){
            this.changeSize('small')
            canvas.renderAll()
        },
        //旋转
        changeRotate(){
            this.rotateAngle = ''
            let backAngle = canvas.backgroundImage.angle 
            let angleBack = backAngle === 360 ? 90 :backAngle + 90;
            this.rotateAngle = angleBack
            canvas.backgroundImage.rotate(angleBack)
             canvas.getObjects().map(function(o) {
                const currAngle = o.angle;
                const angle = currAngle === 360 ? 90 :currAngle + 90;
                o.rotate(angle)
            });
            canvas.renderAll();
        },
        //改变大小公共方法
        changeSize(val){
            let _this = this
            if(val === 'big'){
                _this.zoom = 0.1 + canvas.getZoom()
            }else if(val === 'small'){
                _this.zoom = -0.1 + canvas.getZoom()
            }else{
                _this.zoom = (val > 0 ? -0.1 : 0.1) + canvas.getZoom();
            }
             
            _this.zoom = Math.max(0.1, _this.zoom); //最小为原来的1/10
            _this.zoom = Math.min(3, _this.zoom); //最大是原来的3倍
            var zoomPoint = new fabric.Point(this.width/2,this.height/2);
            // var zoomPoint = new fabric.Point(event.pageX, event.pageY);
            canvas.zoomToPoint(zoomPoint, _this.zoom);

            this.lastzoomPoint.x = this.lastzoomPoint.x + (this.zoomPoint.x - this.lastmousePoint.x - this.relativeMouseX) / this.lastzoom
            this.lastzoomPoint.y = this.lastzoomPoint.y + (this.zoomPoint.y - this.lastmousePoint.y - this.relativeMouseY) / this.lastzoom

            _this.lastmousePoint.x = zoomPoint.x
            _this.lastmousePoint.y = zoomPoint.y
            _this.lastzoom = _this.zoom
          
            _this.relativeMouseX = 0
            _this.relativeMouseY = 0
        },
        //语音
        createVoice(val,time){
            // let audio = document.createElement("audio")
            // audio.src = window.URL.createObjectURL(blob);
            // audio.play();
            var Rect = new fabric.Rect({
                left:_this.getPoint().x,
                top: _this.getPoint().y,
                fill: '#D81B60',
                width: 60,
                height: 25,
                rx: 10,
                ry: 10,
                hasControls: true,
            });
            var video = new fabric.Image(this.voicePlay, function(objects, options) {
                var obj = fabric.util.groupSVGElements(objects, options);
                obj.set({
                    left: x,
                    top:y,
                    selectable: false,
                })
                 canvas.add(obj);
            });
            var timer = new fabric.Text(time,
                {
                    left: _this.getPoint().x+32,
                    top: _this.getPoint().y+8,
                    fontSize:12,
                    width:30,
                    height:30,
                    class:'text2',
                }
            );
            var groupVideo = new fabric.Group([ Rect, video, timer ], {
                selectable: false,
                class:'text',
            });
            canvas.add(groupVideo);
        },
        //初始数据
        indicateSelect(val) {
            let _this = this;
            var objs = canvas.getObjects();
            console.log("obj",objs)
            objs.forEach(obj => {
                if (_this.curOpType === 0 && val) {
                    obj.selectable = true;
                } else {
                    console.log("SSss")
                    obj.selectable = false;
                }
            });
        },
        //创建正确标签  ”√“
        createRight(pointer){
            let x = this.getPoint().x
            let y = this.getPoint().y
            new fabric.loadSVGFromString(this.svgRight, function(objects, options) {
                var obj = fabric.util.groupSVGElements(objects, options);
                obj.set({
                    left:x+10,
                    top: y+3,
                    selectable: false,
                })
                 canvas.add(obj);
            });
        },
        // 新建错误标记  ”X“
        createError(pointer){
            let x = this.getPoint().x
            let y = this.getPoint().y
             new fabric.loadSVGFromString(this.svgError, function(objects, options) {
                var obj = fabric.util.groupSVGElements(objects, options);
                obj.set({
                    left: x,
                    top:y,
                    selectable: false,
                })
                 canvas.add(obj);
            });

        },
        // 选择对应功能
        chooseBtn(val,bool){
           if(val === 5){
                this.writePen = bool
                if(!this.writePen){
                    this.curOpType = 0
                }
                this.createPan()
            }else{
                this.writePen = false
                this.createPan()
            }
            this.curOpType = val
            this.indicateSelect(true)
        },
        // 修改画笔属性
        changePenSize(val){
            canvas.freeDrawingBrush.width = val
        },
         changePenColor(val){
            canvas.freeDrawingBrush.color = val
        },
        //画笔
        createPan(){
            let _this = this
            canvas.isDrawingMode = _this.writePen
        },
        //文本
        createText(val){
            let _this = this
            var Rect = new fabric.Rect({
                left:_this.getPoint().x,
                top: _this.getPoint().y,
                fill: '#D81B60',
                width: 60,
                height: 25,
                rx: 10,
                ry: 10,
                hasControls: true,
            });
            var imageText = new fabric.Image(img,
                {
                    left:_this.getPoint().x+10,
                    top: _this.getPoint().y+3,
                    width:20,
                    height:20,
                    class:'text1'
                }
            );
             var imageText1 = new fabric.Text("注释",
                {
                    left: _this.getPoint().x+32,
                    top: _this.getPoint().y+8,
                    fontSize:12,
                    width:30,
                    height:30,
                    class:'text2',
                }
            );
            var group = new fabric.Group([ Rect, imageText, imageText1 ], {
                selectable: false,
                class:'text',
                value:val
            });
            if(!_this.changeText){
                canvas.add(group);
            }else{
                console.log(canvas.getActiveObjects(),'//1/')
                console.log(canvas.getObjects(),'/2//')
                canvas.getActiveObjects()[0].value = val
            }
        },
        // 初始化
        initConfig(){
            this.config.canvasState = [],
            this.config.currentStateIndex = -1,
            this.config.redoStatus = false, //撤销状态
            this.config.undoStatus = false,  // 重做状态
            this.config.undoFinishedStatus = 1,
            this.config.redoFinishedStatus = 1
        },
          // 历史记录
        updateCanvasState() {
            let _self = this;
            if(_self.watchDisable){
                _self.undoDisable = false
            }else{
                _self.undoDisable = true
            }
            if (
                _self.config.undoStatus == false &&
                _self.config.redoStatus == false
            ) {
                let jsonData = canvas.toJSON();
                let canvasAsJson = JSON.stringify(jsonData);
                if (
                    _self.config.currentStateIndex <
                    _self.config.canvasState.length
                ) {
                    let indexToBeInserted = _self.config.currentStateIndex + 1;
                    _self.config.canvasState[indexToBeInserted] = canvasAsJson;
                    let numberOfElementsToRetain = indexToBeInserted + 1;
                    _self.config.canvasState = _self.config.canvasState.splice(
                        0,
                        numberOfElementsToRetain
                    );
                } else {
                    _self.config.canvasState.push(canvasAsJson);
                }
                _self.config.currentStateIndex = _self.config.canvasState.length - 1;
            }
        },
        //记录事件
        undo() {
            let _self =this;
             _self.watchDisable = true
            if(_self.config.undoFinishedStatus){
                if(_self.config.currentStateIndex == -1){
                    _self.config.undoStatus = false;
                }
                else{
                    if (_self.config.canvasState.length >= 1) {
                        _self.config.undoFinishedStatus = 0;
                        if(_self.config.currentStateIndex != 0){
                            _self.config.undoStatus = true;
                            canvas.loadFromJSON(_self.config.canvasState[_self.config.currentStateIndex-1],function(){
                                // var jsonData = JSON.parse(_self.config.canvasState[_self.config.currentStateIndex-1]);
                                canvas.renderAll();
                                _self.config.undoStatus = false;
                                _self.config.currentStateIndex -= 1;
                                _self.config.undoFinishedStatus = 1;
                            });
                        }
                        else if(_self.config.currentStateIndex == 0){
                            _self.watchDisable = false
                            canvas.getObjects().map(function(o) {
                                canvas.remove(o);
                            });
                            _self.initConfig()
                        }
                    }
                }
            }
        },
        // 关闭功能弹窗
        closeModal(){
            this.noAudio = false
            this.showModal = false
        },
        //获取中心点位置
        getPoint(){
            let params = {x:0,y:0}
            params.x = this.lastzoomPoint.x + (this.pointer.x - this.zoomPoint.x - this.relativeMouseX) / canvas.getZoom()
            params.y = this.lastzoomPoint.y + (this.pointer.y - this.zoomPoint.y - this.relativeMouseY) / canvas.getZoom()
            return params
        },
        //保存json数据
        saveJson(val){
            let json = canvas.toJSON()
            // this.saveData()
            console.log(val,'22')
            if(val == 'complete'){
                this.imageData[this.imageIndex].comment = 2
                this.isComment = 2
            }else if(val == 'draft'){
                this.imageData[this.imageIndex].comment = 1
                this.isComment = 1
            }
            this.imageData[this.imageIndex].json = json
            this.showModal = false
            this.showTool = true
            this.curOpType = 0
            this.writePen = false
            this.createPan()
            this.showLeft = true
            this.showRight = true
            // canvas.loadFromJSON(json,canvas.renderAll.bind(canvas));
                // canvas.renderAll();
            // console.log(canvas.getObjects())
            this.indicateSelect(false)
        },
        //关闭画布
        closeCanvas(val){
            if(this.showTool){
                document.getElementById("task-image").style.display = 'none'
                return
            }
            this.modalMsg = val
            this.showModal = true
        },
        //关闭底部工具栏
        changeTool(val){
            this.showTool = val
            this.showLeft = val
            this.showRight = val
            this.curOpType = 0
            this.indicateSelect(true)
        },
        // 左右切换
        leftImage(){
            this.backgroundPic = ''
            this.imageIndex  -= 1 ;
            this.backgroundPic = this.imageData[this.imageIndex].fileId
            canvas.clear()
            this.initData()
            this.onLoad()
            this.indicateSelect(false)
        },
        rightImage(){
            this.backgroundPic = ''
            this.imageIndex  += 1 ;
            this.backgroundPic = this.imageData[this.imageIndex].fileId
            canvas.clear()
            this.initData()
            this.onLoad()
            this.indicateSelect(false)
        },
        //调用ajax保存接口
        saveData(){
            $.ajax({
                type: 'get',
                url : '/focus-teach/homeworks/validate/transmit' ,
                dataType:'json',
                success : function (data) {
                    console.log("222",data)
                },
                error : function (err) {
                    console.log("///",err)
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.container{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 937px;
    position: relative;
}
.main-canvas{
    position: relative;
}
.work-area{
    width:665px;
    height:56px;
    position:absolute;
    right:0;
    left:0;
    bottom:20px;
    margin:0 auto;
}
.tool-area{
     width:280px;
    height:56px;
    position:absolute;
    right:0;
    left:0;
    bottom:20px;
    margin:0 auto;
    background: rgba(0,0,0,0.90);
}
.closeCanvas{
    position: absolute;
    top: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
    background: rgba(0,0,0,0.70);
    border-radius: 50%;
    cursor: pointer;
    z-index: 99999;
}
.closeCanvas::after{
    content: "×";
    display: block;
    color: #FFFFFF;
    position: relative;
    font-size: 14px;
    top: 6px;
    left: 12px;
}
.click-left{
    position: absolute;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    left: 100px;
    right: 0;
    margin: auto 0 ;
    background: rgba(0,0,0,0.20);
    z-index: 9999999;
    cursor: pointer;
}
.click-left::after{
    content: "<";
    font-size: 24px;
    color: #FFFFFF;
    position: relative;
    top:6px ;
    left: 16px;
}
.click-right{
    position: absolute;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    right:  100px;
    margin:  0 auto;
    background: rgba(0,0,0,0.20);
    z-index: 9999999;
    cursor: pointer;
}
.click-right::after{
    content: ">";
    font-size: 24px;
    color: #FFFFFF;
    position: relative;
    top:6px ;
    left: 18px;
}
</style>