<template>
  <div class="container">
    <el-carousel height="150px">
      <el-carousel-item>
        <div
          class="logo"
          :style="{ backgroundImage: `url('/src/assets/img/logo.jpg')` }"
        ></div>
      </el-carousel-item>
    </el-carousel>
    <div class="content">
      <div class="action-group">
        <div
          v-for="item in actions"
          class="action-btn"
          :style="{ backgroundColor: item.color }"
          @click="handleAction(item.type)"
        >
          {{ item.title }}
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="请输入个人信息" width="60%">
      <el-form label-width="70" :model="userInfo">
        <el-form-item label="学号" required prop="account">
          <el-input v-model="userInfo.account"></el-input>
        </el-form-item>
        <el-form-item label="姓名" required prop="name">
          <el-input v-model="userInfo.name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleInfoSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { checkVote, updateVoteCount } from "../../service/home";
import { ref, reactive } from "vue";

const actions = [
  { title: "创建投票", color: "#3498db", type: "create" },
  { title: "加入投票", color: "#2ecc71", type: "join" },
  { title: "投票管理", color: "#fbc531", type: "manage" },
];

const router = useRouter();

const dialogVisible = ref(false);
const userInfo = reactive({
  account: "",
  name: "",
});

// 这里一开始没想全面，以为创建投票直接创建就行了
// 而加入直接跳转，所以写成了策略模式
// 但想了想创建投票需要限定人数，所以可以跳转，也可以弹框
// 而加入需要输入投票id，所以也是一样，如果只是简单跳转
// 确实是没必要这样做了

// 创建投票用跳转+更新的方式来
const createVote = () => router.push("/create");

const currentVoteId = ref(-114514);

const handleInfoSubmit = () => {
  if (!userInfo.account || !userInfo.name) {
    ElMessage.error({
      message: "请填写完整信息！",
    });
    return;
  }
  updateVoteCount(currentVoteId.value);
  localStorage.setItem("user-info", JSON.stringify(userInfo));
  dialogVisible.value = false;

  router.replace(`/vote/${currentVoteId.value}`);
};

// 加入投票需要弹窗用户输入后对比是否存在才可跳转
const joinVote = () => {
  ElMessageBox.prompt("请输入场次编号", "提示", {
    confirmButtonText: "加入打分",
    cancelButtonText: "取消",
    inputErrorMessage: "编号长度不应超过六位！",
    inputValidator: (value) => value.length <= 6,
  })
    .then(({ value }) => {
      // 需求变动：不需要检测人数，只要存在且未超时就可进入
      checkVote(value).then((res) => {
        if (res.code === "-1") {
          return ElMessage.warning({
            message: res.msg || "该场次已满！",
          });
        }

        router.replace(`/vote/${value}`);
      });

      // TODO: 检测场次编号是否存在（超时、是否已满）
      // checkVote(value).then((res) => {
      //   if (res.code === "-1") {
      //     return ElMessage.warning({
      //       message: res.msg || "该场次已满！",
      //     });
      //   }
      //   const userInfo = localStorage.getItem("user-info");
      //   // 用户信息不存在，提示输入然后更新场次人数
      //   if (!userInfo) {
      //     currentVoteId.value = value;
      //     dialogVisible.value = true;
      //     return;
      //   }
      //   // 信息存在，查看是否加入过本场次
      //   // 如果加入就不更新
      //   // 自己封装的hooks简直费拉不堪，干脆不用算了
      //   const joined = JSON.parse(localStorage.getItem("joined") || "[]");
      //   if (!joined.includes(value)) {
      //     joined.push(value);
      //     updateVoteCount(value);
      //   }
      //   localStorage.setItem("joined", JSON.stringify(joined));
      //   // console.log(joined);
      //   router.replace(`/vote/${value}`);
      // });
    })
    .catch((e) => {
      console.log(e);
    });
};

// 管理投票写死在前端了...
const manageVote = () => {
  ElMessageBox.prompt("请输入管理员秘钥", "提示", {
    confirmButtonText: "投票管理",
    cancelButtonText: "取消",
    inputType: "password",
  })
    .then(({ value }) => {
      if (value !== import.meta.env.VITE_ADMIN_CODE) {
        ElMessage.error({
          message: "秘钥错误！",
        });
      } else {
        router.replace("/admin");
        localStorage.setItem("admin", true);
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const strategy = {
  create: createVote,
  join: joinVote,
  manage: manageVote,
};

const handleAction = (type, ...args) => strategy[type] && strategy[type](args);
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.container {
  height: 100%;
  width: 100%;
}

.content {
  height: calc(100% - 150px);
  width: 100%;
  display: flex;

  justify-content: center;
  align-items: center;
}

.action-group {
  width: 60%;
}

.action-btn {
  text-align: center;
  height: 70px;
  line-height: 70px;

  color: white;
  margin: 20px 0;
}

.logo {
  height: 100%;
  width: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
