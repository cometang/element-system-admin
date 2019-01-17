<template>
    <div>

        <div class="editor-box">
            <vue-ueditor-wrap v-model="content" :config="myConfig" @beforeInit="addCustomButtom"></vue-ueditor-wrap>
        </div>
        <div class="btn-box">
            <el-button type="primary" @click="btn">保存草稿</el-button>
            <el-button type="primary">发布</el-button>
        </div>

        <el-dialog
                title="上传图片"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose"
                center
                @close="closeBtn">
            <span>
                        <div class="file-msg"
                             style=" width: 90%;margin: 0 auto;height: 2rem; line-height: 2rem;font-size: 1.4rem;color: #f60;
                             margin-bottom:1rem; overflow: hidden; text-overflow:ellipsis;white-space: nowrap;">
                            目前只支持后缀为 '.jpg' 图片上传.
                        </div>
                        <div style="position: relative;width: 100%;height: 5rem">
                              <div class="file-box"
                                   style="position: absolute;top: 0;left: 0;width: 100%;height: 5rem;opacity: 1;">
                            <span class="icon-box"
                                  style="display: block; float: left;width: 46%;height: 5rem;line-height: 5rem;
                            font-size:3rem;text-align: right;padding-right: 2%;">
                                <i class="el-icon-upload"></i></span>
                                <span class="icon-text" style=" display: block;float: left; width: 50%;
                                 height: 5rem;text-align: left;font-size: 1.6rem;line-height: 5rem;">上传图片</span>

                        </div>
                        <input type="file" class="input-file-box" @change="fileBtn($event)"
                               style=" position: absolute;top: 0;left: 0;width: 100%;height: 5rem;opacity: 0;">
                        </div>

                        <div class="fine-name" v-if="fileName != ''"
                        style="  width: 90%;margin: 0 auto;margin-top: 2rem;font-size: 1.4rem;height: 2rem;
                        line-height: 2rem;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                            资产文件名：{{fileName}}
                        </div>

                        <div class="line" v-if="num >0 && num<100" style="   width: 90%;height: 3rem;margin-top: 2rem;margin: 0 auto;">
                            <div class="line-title"
                                 style="float: left; width: 5rem;height: 3rem;line-height: 3rem;font-size: 1.4rem;color: #666;">上传进度:</div>
                            <div class="line-box" style="  width: auto;padding-top: 1.2rem;margin-left: 6rem;">
                                <el-progress :percentage="num"></el-progress>
                            </div>
                        </div>

                        <div class="line" v-if="num == 100" style="   width: 90%; height: 3rem;margin-top: 2rem; margin: 0 auto;">
                            <div class="line-title" style="    float: left; width: 5rem;height: 3rem;line-height: 3rem;font-size: 1.4rem;color: #666;">上传进度:</div>
                            <div class="line-text" style="   width: auto;height: 3rem;color:rgb(76, 174, 76);margin-left: 6rem;line-height: 3rem;font-size: 1.4rem;">
                                上传成功！
                            </div>
                        </div>

            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary"   @click="doUpload">确认上传</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<style>

</style>
<script>
    import ossAuth from '@/assets/api/oss/ossAuth'
    let client = ossAuth.client

    import VueUeditorWrap from 'vue-ueditor-wrap'

    export default {
        name: 'editor',
        data() {
            return {
                fileName:'',
                fileData:[],
                num:0,
                address:'',
                dialogVisible:false,
                content: '',
                myConfig: {
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 初始容器高度
                    initialFrameHeight: 700,
                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
                    // serverUrl: 'http://35.201.165.105:8000/controller.php',
                    // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
                    UEDITOR_HOME_URL: '/UEditor/'
                }
            }
        },
        methods: {

            fileBtn(ev){
                this.fileData= ev.target.files
                this.fileName = this.fileData[0].name
            },
            //关闭弹出框，重置上传的文件的相关变量
            closeBtn(){
                this.fileName = ''
                this.fileData = []
            },
            getProgress(p){
                this.num = p
            },
            doUpload(){

                let file = this.fileData[0]

                // this.$emit('getProgress', 0)
                this.getProgress(0)


                this.size = file.size
                let tmpName = encodeURIComponent(file.name)
                let date = new Date()
                date = date.getTime()
                tmpName =this.address+ +date+tmpName

                console.log(tmpName)

                this.multipartUpload(tmpName, file)
            },
            //分片上传
            multipartUpload(upName, upFile) {
                //Vue中封装的分片上传方法（详见官方文档）
                let _this = this
                const progress = async function (p) {
                    //项目中需获取进度条，故调用进度回调函数（详见官方文档）
                    // _this.$emit('getProgress', Math.round(p * 100))
                    _this.getProgress(Math.round(p * 100))
                }
                try {
                    let result = client.multipartUpload(upName, upFile, {
                        progress,
                        meta: {
                            year: 2017,
                            people: 'test'
                        }
                    }).then(res => {
                        //导入用户
                        console.log(res)
                        this.$message({
                            message: '上传成功',
                            type: 'success'
                        });
                        this.fileName = ''
                        this.fileData = []
                        this.dialogVisible = false
                        console.log(res.res.requestUrls[0])
                        let url = res.res.requestUrls[0]
                        let html = '<p><img src="'+url +'" alt=""></p>'
                        this.content = this.content+html

                    }).catch(err => {
                        this.$message.error('上传失败，请重新上传');
                        this.dialogVisible = false

                    });

                } catch (e) {
                    // 捕获超时异常
                    if (e.code === 'ConnectionTimeoutError') {
                        console.log("Woops,超时啦!");
                    }
                    console.log(e)
                }
            },
            handleClose(){

            },
            btn() {
                console.log(this.content)
            },
            addCustomButtom(editorId) {
                let that = this
                // 1. 自定义按钮
                window.UE.registerUI('test-button' + editorId, function (editor, uiName) {
                    // 注册按钮执行时的 command 命令，使用命令默认就会带有回退操作
                    editor.registerCommand(uiName, {
                        execCommand: function () {
                            editor.execCommand(
                            )
                        }
                    })
                    // 创建一个 button
                    var btn = new window.UE.ui.Button({
                        // 按钮的名字
                        name: uiName,
                        // 提示
                        title: '图片上传',
                        // 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
                        cssRules: "background-image: url('/static/upload.png') !important;background-size: cover;",
                        // 点击时执行的命令
                        onclick: function () {
                            // 这里可以不用执行命令，做你自己的操作也可
                            that.dialogVisible = true
                            // editor.execCommand(uiName)
                        }
                    })

                    // 当点到编辑内容上时，按钮要做的状态反射
                    editor.addListener('selectionchange', function () {

                        var state = editor.queryCommandState(uiName)
                        if (state === -1) {
                            btn.setDisabled(true)
                            btn.setChecked(false)
                        } else {
                            btn.setDisabled(false)
                            btn.setChecked(state)
                        }
                    })

                    // 因为你是添加 button，所以需要返回这个 button
                    return btn
                }, 0 /* 指定添加到工具栏上的哪个位置，默认时追加到最后 */, editorId /* 指定这个 UI 是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */)


            }


        },
        components: {
            VueUeditorWrap
        },
        mounted(){
            let date = new Date()
            let year =''+date.getFullYear()
            let month =''+date.getMonth()+1
            if(month.length<2){
                month = '0'+month
            }
            let day = ''+date.getDate()
            if(day.length<2){
                day ='0'+ day
            }
            this.address = 'article/image/'+year+month+day+'/'
        }
    }
</script>

<style scoped lang="scss">
    .box{
        width: 200px !important;
        height: 200px !important;
        background: #0086b3 !important;
    }
    .btn-box {
        margin-top: 10px;
        background: #fff;
        padding: 15px;
    }

    .editor-box {
        margin-bottom: 10px;
    }
    /*.line-title{*/
        /*float: left;*/
        /*width: 5rem;*/
        /*height: 3rem;*/
        /*line-height: 3rem;*/
        /*font-size: 1.4rem;*/
        /*color: #666;*/

    /*}*/
    /*.line{*/
        /*width: 90%;*/
        /*height: 3rem;*/
        /*margin-top: 2rem;*/
        /*margin: 0 auto;*/
    /*}*/
    /*.line-box{*/
        /*width: auto;*/
        /*padding-top: 1.2rem;*/
        /*margin-left: 6rem;*/
    /*}*/
    /*.line-text{*/
        /*width: auto;*/
        /*height: 3rem;*/
        /*color:rgb(76, 174, 76);*/
        /*margin-left: 6rem;*/
        /*line-height: 3rem;*/
        /*font-size: 1.4rem;*/
    /*}*/


    /*.file-msg{*/
        /*width: 90%;*/
        /*margin: 0 auto;*/
        /*height: 2rem;*/
        /*line-height: 2rem;*/
        /*font-size: 1.4rem;*/
        /*color: #f60;*/
        /*margin-bottom:1rem;*/
        /*overflow: hidden;*/
        /*text-overflow:ellipsis;*/
        /*white-space: nowrap;*/
    /*}*/
    /*.fine-name{*/
        /*width: 90%;*/
        /*margin: 0 auto;*/
        /*margin-top: 2rem;*/
        /*font-size: 1.4rem;*/
        /*height: 2rem;*/
        /*line-height: 2rem;*/
        /*overflow: hidden;*/
        /*text-overflow:ellipsis;*/
        /*white-space: nowrap;*/

    /*}*/
    .upload-btn{
        margin-left: 5%;
        margin-top: 1rem;
    }
    /*.input-file-box{*/
        <!--position: absolute;-->
        <!--top: 0;-->
        <!--left: 0;-->
        <!--width: 100%;-->
        <!--height: 5rem;-->
        <!--opacity: 0;-->
    /*}*/
    /*.icon-box{*/
        /*display: block;*/
        /*float: left;*/
        /*width: 46%;*/
        /*height: 5rem;*/
        /*line-height: 5rem;*/
        /*font-size:3rem;*/
        /*text-align: right;*/
        /*padding-right: 2%;*/
    /*}*/
    /*.icon-text{*/
        /*display: block;*/
        /*float: left;*/
        /*width: 50%;*/
        /*height: 5rem;*/
        /*text-align: left;*/
        /*font-size: 1.6rem;*/
        /*line-height: 5rem;*/
    /*}*/
    .file-box{
        margin: 0 auto;
        width: 90%;
        height: 5rem;
        border: 1px dashed #f4516c;
        position: relative;
    }
</style>



