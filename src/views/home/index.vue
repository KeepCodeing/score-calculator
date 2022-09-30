<template>
  <div class="container">
    <el-carousel height="150px">
      <el-carousel-item v-for="item in 4" :key="item">
        <h3 class="small justify-center" text="2xl">
          学校公告等信息{{ item }}
        </h3>
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
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";

const actions = [
  { title: "创建投票", color: "#3498db", type: "create" },
  { title: "加入投票", color: "#2ecc71", type: "join" },
];

const router = useRouter();

// 这里一开始没想全面，以为创建投票直接创建就行了
// 而加入直接跳转，所以写成了策略模式
// 但想了想创建投票需要限定人数，所以可以跳转，也可以弹框
// 而加入需要输入投票id，所以也是一样，如果只是简单跳转
// 确实是没必要这样做了

// 创建投票用跳转+更新的方式来
const createVote = () => router.push("/create");

// 加入投票需要弹窗用户输入后对比是否存在才可跳转
const joinVote = () => {
  ElMessageBox.prompt("请输入场次编号", "提示", {
    confirmButtonText: "加入打分",
    cancelButtonText: "取消",
    inputErrorMessage: "编号长度不应超过六位！",
    inputValidator: (value) => value.length <= 6,
  })
    .then(({ value }) => {
      // TODO: 检测场次编号是否存在

      router.replace(`/vote/${value}`);
    })
    .catch(() => {});
};

const strategy = {
  create: createVote,
  join: joinVote,
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
</style>
