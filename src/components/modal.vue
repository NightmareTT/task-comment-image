<template>
    <div>
		<div class="zhezhao" id='zhezhao'>
			<div class="tankuang" v-if="showType == 'voice'">
				<div class="main-voice">
                    <div class="main-content" v-if="showMsg == 'success'">
                        <p>点击录音</p>
                        <div class="record-btn" @click="timeStart">
                        </div>
                    </div>
                    <div class="main-content" v-if="showMsg == 'other'">
                        <div class="content-time">
                            <img src="../assets/image/voice_left.png"  alt="">
                            <p>{{str}}</p>
                            <img src="../assets/image/voice_right.png"  alt="">
                        </div>
                        <div class="record-stop-btn" @click="stop">
                        </div>
                    </div>
                    <div class="main-content" v-if="showMsg == 'error'">
                        <p>未检测到麦克风</p>
                        <button @click="checkAudio">重新检测</button>
                    </div>
                </div>
			</div>
            <div class="tankuang" v-if="showType== 'text'">
                <div class="main-content">
                    <textarea v-model="content" name="1" id="" cols="40" rows="6"  autofocus></textarea>
                    <div class="post-btn">
                        <span class="btn-error" @click="closeModal">×</span>
                        <span class="btn-right" @click='configText'>√</span>    
                    </div>
                    
                </div>
			</div>
		</div>
    </div>
</template>
<script>
var record;
import { HZRecorder } from '../assets/js/HZRecorder'
export default {
    name:"showModal",
    props:{
        showMessage:{
            type:String,
            default:'success'
        },
        showType:{
            type:String,
            default:''
        },
        textContent:{
            type:String,
            default:''
        }
        
    },
    data(){
        return{
            showTime:false,
            time:null,
            second:0,
            minute:0,
            showMsg:'',
            str:'00:00',
            voice:'',
            content:''
        }
    },
    mounted(){
        this.showMsg = this.showMessage
        this.content = this.textContent
        if(this.showType == 'voice'){
            this.checkAudio()
        }
    },
    methods:{
        timeStart(){
            this.showMsg = "other"
            this.startVoice()
            this.time = setInterval(()=>{
                this.timer()
            },1000)
        },
                
        timer () {//定义计时函数
            this.second = this.second + 1
            if (this.second >= 60) {
                this.second = 0
                this.minute =this.minute + 1        //分钟
            }

            if (this.minute >=60) {
                this.minute =0
            }
            this.str = this.toDub(this.minute) +':' +this.toDub(this.second)/*+""+this.toDubms(this.ms)+"毫秒"*/
        },
         toDub (n) {//补0操作
            if (n < 10) {
                return '0' + n
            }else {
                return '' + n
            }
        },
        stop () {
            console.log("time,",this.minute,this.second)
            clearInterval(this.time)
            this.endVideo()
        },
        checkAudio(){
            let _this = this
             try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
                window.URL = window.URL || window.webkitURL;

                // audio_context = new AudioContext;
                console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
            } catch (e) {
                // alert('No web audio support in this browser!');
            }

            navigator.getUserMedia({audio: true}, function (stream) {
                record = new HZRecorder(stream)
                _this.showMsg = 'success'
            }, function(e) {
                _this.showMsg = 'error'
                console.log('No live audio input: ' + e);
            });
        },
        startVoice(){
            this.voice = ''
             record.start();
        },
        endVideo(){
            this.voice = ''
            record && record.getBlob();
            this.voice = record.getBlob()
            console.log("语音",this.voice)
        },
        closeModal(){
            this.$parent.closeModal()
        },
        configText(){
            console.log("ssa",this.content)
            if(this.content == ''){
                return;
            }
            this.$parent.closeModal()
            this.$parent.createText(this.content)
            this.content = ''
        }
    }
}
</script>
<style scoped>
    .main-voice{
        height: 248px;
        background: rgba(0,0,0,0.90);
        border-radius: 8px;
    }
    .zhezhao{
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        border: 1px solid #e2e2e2;
        
    }
    .tankuang{
        position: relative;
        width: 400px;
        margin: 10% auto;
    }
    #header{
        height: 40px;
        line-height: 40px;
        margin-left: 10px;
    }
 
    #header-right{
        position: absolute;
        width: 25px;
        height: 25px;
        border-radius: 5px;
        background: red;
        color: #fff;
        right: 5px;
        top: 5px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modal-line{
        width:80%;
        margin-left: 40px;
        border: 1px solid #000;
    }
    .content-time{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .content-time p{
        margin: 0 10px;
    }
    .main-content{
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        align-items: center;
        position: relative;
        height: 100%;
    }
    .main-content p{
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #FFFFFF;
    }
    textarea{
        background: rgba(0,0,0,0.90);
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #FFFFFF;
        border: none;
    }
    .post-btn{
        position: absolute;
        top: 26px;
        right: -46px;
    }
    .btn-error, .btn-right{
        background: rgba(0,0,0,0.70);
        color: #ffffff;
        padding: 8px 12px;
        border-radius: 50%;
        cursor: pointer;
    }
    .btn-right{
        margin-left: 10px;
    }
    .record-btn{
        width: 100px;
        height: 100px;
        border: 1px solid #FFFFFF;
        border-radius: 50%;
        cursor: pointer;
    }
    .record-btn::after{
        content: '';
        display: block;
        width: 80px;
        height: 80px;
        background-color: #FF6919 ;
        position: relative;
        top: 10px;
        left: 10px;
        border-radius: 50%;
    }
    .record-stop-btn{
        width: 100px;
        height: 100px;
        border: 1px solid #FFFFFF;
        border-radius: 50%;
        cursor: pointer;
    }
     .record-stop-btn::after{
         content: '';
        display: block;
        width: 32px;
        height: 32px;
        background-color: #FF6919 ;
        position: relative;
        top: 34px;
        left: 34px;
    }
</style>