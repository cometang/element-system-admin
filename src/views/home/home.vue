<template>
    <div>
        <el-container>
            <el-aside width="200px" class="slide-box">
                <div class="logo-box">
                    <i class="iconfont icon-logo"></i>
                </div>
                <el-menu
                        :default-active="this.$store.state.navDefaultActive"
                        class="el-menu-vertical-demo"
                        background-color="#545c64"
                        text-color="#fff"
                        active-text-color="#ffd04b"
                        style="overflow: hidden;width: 200px;background: #545c64;"
                >
                         <el-menu-item  v-for="(item,key) in menuList" :index="''+key" :key="key" @click="navActive(key,item)" >
                            <i class="iconfont  icon-box " :class="item.icon"></i>
                            <span slot="title">{{item.title}}</span>
                        </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header class="header-box">
                    <div class="system-box">el-后台管理框架</div>
                    <!--<div class="system-mech">-->
                        <!--<span>-->
                           <!--<div class="system-center"> lalalalla</div>-->
                        <!--</span>-->
                        <!--<div class="system-right" >-->
                            <!--<el-tag>更换机构</el-tag>-->
                        <!--</div>-->
                    <!--</div>-->

                </el-header>
                <el-main style="background: #f0f2f5;height: 100vh;overflow-y: auto;padding-bottom:100px; ">

                    <router-view > </router-view>

                </el-main>
            </el-container>
        </el-container>

    </div>
</template>

<script>
    import menuList from '../../assets/const/menu'
    export default {
        name: "home",
        components: {},
        data() {
            return {
                menuList:[]
            }
        },
        methods: {
            navActive(index,item) {
                this.$store.state.navDefaultActive =  ''+index
                this.$router.push(item.path)
            },
        },
        created() {
            this.$router.push('/dashboard')
        },
        mounted() {
            this.menuList = menuList
            console.log(this.menuList)
        }

    }
</script>

<style scoped lang="scss">
    .slide-box {
        width: 200px;
        background: #545c64;
        min-height: 100vh;
        overflow: hidden;
    }

    .logo-box {
        width: 200px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        font-size: 40px;
        color: #fff;
    }

    .logo-box i {
        width: 200px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        color: #fff;
        font-size: 40px;

    }

    .header-box {
        background: #545c64;
        font-size: 1.8rem;
        line-height: 60px;
        color: #fff;

    }

    .icon-box {
        display: block;
        float: left;
        width: 2rem;
        height: 56px;
        margin-right: 10px;
        font-size: 2rem;
    }

    .system-box {
        float: left;
        width: 250px;
        height: 60px;
        letter-spacing: 5px;
        font-size: 20px;
        font-weight: 600;
        text-align: center;
    }

    .system-mech {
        position: relative;
        width: auto;
        height: 60px;
        margin-left: 250px;
        letter-spacing: 5px;
        font-weight: 600;
        text-align: center;

    }

    .system-center {
        position: absolute;
        width: 300px;
        height: 60px;
        left: 50%;
        margin-left: -250px;
    }

    .system-right {
        position: absolute;
        right: 0;
        cursor: pointer;
    }

    .system-right span {
        color: #fff;
        border: 1px solid #ddd;
        background: rgba(255, 255, 255, .3);
    }

</style>
