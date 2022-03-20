<template>
  <!-- <div >
   <img alt="Vue logo" src="../assets/logo.png"> -->
  <!-- </div> -->

  <el-container class="home">
    <el-aside min-width="200px;" style="border:solid black 1px;padding-right:1px">

      <el-tree :data="data" node-key="id" :props="defaultProps" @node-click="handleNodeClick" :default-expand-all="false">
        <span class="custom-tree-node" slot-scope="{  data }">
          <!-- <span>{{ node }}</span> -->
          <i class="el-icon-files"></i><span style="margin-left:5px">{{ data.name }}</span>
        </span>
      </el-tree>

    </el-aside>
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
  // @ is an alias to /src

  import HelloWorld from "@/components/HelloWorld.vue";
  import router from "../router/index.js";
  import { getRequest } from "../utils/api";
  export default {
    name: "Home",
    components: {},
    data() {
      return {
        data: [
          {
            name: "Level one 1",
            children: [],
          },
        ],

        defaultProps: {
          children: "children",
          label: "name",
        },
      };
    },
    mounted() {
      // console.log(router);
      // 获取路由
      getRequest("/getDir").then((response) => {
        console.log(response);
        let res = response.data;
        this.data = this.convertToTreeData(res);
      });
    },
    methods: {
      handleNodeClick(data) {
        if (data.type == "vue") {
          let name = (() => {
            let arr = data.name.split(".");
            return arr.slice(0, arr.length - 1).join(".");
          })();
          console.log(data.name, data.type, data.relPath, name.toLowerCase());
          console.log(this.$route);
          if (name.toLowerCase() == "home") {
            return;
          }
          if (this.$router.mode == "hash") {
            if ("#/" + name.toLowerCase() == window.location.hash) {
              this.$message.warning("重复进入");
            } else {
              this.$router.push("/" + name.toLowerCase());
            }
          }
        } else {
          console.log("不是vue文件");
        }
      },
      convertToTreeData(data) {
        let dirNum = 0;
        let fileNum = 0;
        if (data.directories) {
          dirNum = data.directories.length;
        }
        if (data.files) {
          dirNum = data.files.length;
        }
        if (!data.files && !data.directories) {
          return;
        }
        let len = dirNum + fileNum;
        let fileArray = new Array(len).fill("");

        // if()

        //  循环每一个文件
        Array.from(data.files).forEach((item, idx, arr) => {
          fileArray[idx] = {
            name: item.name,
            children: [],
            relPath: item.relPath,
            comment: item.comment,
            absPath: item.absPath,
            size: item.size,
            type: item.type,
          };
        });

        //  循环每一个文件夹
        Array.from(data.directories).forEach((item, idx, arr) => {
          fileArray[idx + fileNum] = {
            name: item.name,
            children: [],
            relPath: item.relPath,
            comment: item.comment,
            absPath: item.absPath,
            tag: item.tag,
          };
          fileArray[idx + fileNum].children = this.convertToTreeData(item);
        });

        return fileArray;
      },
    },
  };
</script>
<style scoped>
.home {
  background-color: antiquewhite;
  height: 100vh;
  width: 100vw;
}
</style>
