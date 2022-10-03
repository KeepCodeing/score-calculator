<template>
  <div>
    <h3 class="score-title">全体总分：{{ allSum }}</h3>
    <el-collapse style="padding: 0 20px" v-model="active">
      <el-collapse-item name="my">
        <template #title>
          <div class="my-vote-title">
            <span>我的投票</span>
          </div>
        </template>
        <el-form
          v-if="!voted"
          ref="form"
          style="margin-top: 20px"
          label-width="80px"
          label-position="left"
          :model="myVote"
          :rules="voteRules"
          status-icon
        >
          <el-form-item required label="学号" prop="account">
            <el-input v-model="myVote.account" />
          </el-form-item>
          <el-form-item required label="姓名" prop="name">
            <el-input v-model="myVote.name" />
          </el-form-item>
          <el-form-item required label="班会方案" prop="program">
            <el-input-number style="width: 100%" v-model="myVote.program" />
          </el-form-item>
          <el-form-item required label="班会主题" prop="theme">
            <el-input-number style="width: 100%" v-model="myVote.theme" />
          </el-form-item>
          <el-form-item required label="班会形式" prop="formal">
            <el-input-number style="width: 100%" v-model="myVote.formal" />
          </el-form-item>
          <el-form-item required label="班会内容" prop="content">
            <el-input-number style="width: 100%" v-model="myVote.content" />
          </el-form-item>
          <el-form-item required label="展示效果" prop="effect">
            <el-input-number style="width: 100%" v-model="myVote.effect" />
          </el-form-item>
        </el-form>
        <h3 v-else class="voted-title">您已参与投票！</h3>
        <el-button
          v-if="!voted"
          @click="handleSubmit"
          style="margin-top: 20px; width: 100%"
          type="success"
          >提交评分</el-button
        >
      </el-collapse-item>
      <el-collapse-item name="all">
        <template #title>
          <div class="my-vote-title">
            <span>全体投票</span
            ><span v-show="voteLimit !== -1">限制人数: {{ voteLimit }}人</span>
          </div>
        </template>
        <el-table :data="allVotes">
          <el-table-column prop="sum" label="总分"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="account" label="学号"></el-table-column>
          <el-table-column prop="program" label="班会方案"></el-table-column>
          <el-table-column prop="theme" label="班会主题"></el-table-column>
          <el-table-column prop="formal" label="班会形式"></el-table-column>
          <el-table-column prop="content" label="班会内容"></el-table-column>
          <el-table-column prop="effect" label="展示效果"></el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { postVote, getAllVote } from "../../service/vote";
import { checkVote } from "../../service/home";
import { ElMessage } from "element-plus";
import { useStorage } from "@/hooks/useStorage";

const active = ref("my");

const route = useRoute();
const router = useRouter();

const voteId = route.params.id;

checkVote(voteId).then((res) => {
  if (!res.data) {
    ElMessage.warning({
      message: "该打分场次不存在！",
    });
    router.replace("/home");
  }
});

const allVotes = ref([]);

const allSum = ref(0);

const voteLimit = ref(-1);

const { checkStorage, setStorage } = useStorage();

const voted = ref(checkStorage(voteId));

function updateAllVotes(stime) {
  let lastTime = 0;
  let sum = 0;
  async function _updateAllVotes(time) {
    sum += time - lastTime;
    if (sum >= 1500) {
      const res = await getAllVote(voteId);
      if (res) {
        allVotes.value = res.data.data;
        allSum.value = allVotes.value.reduce((prev, now) => prev + now.sum, 0);
        voteLimit.value === -1 && (voteLimit.value = res.data.max_count);
      }

      // 减少不必要的请求
      if (allVotes.value.length >= voteLimit.value) return;
      sum = 0;
    }
    lastTime = time;
    requestAnimationFrame(_updateAllVotes);
  }

  _updateAllVotes(stime);
}

updateAllVotes(0);

const myVote = reactive({
  program: 20,
  theme: 20,
  formal: 20,
  content: 20,
  effect: 20,
});

const totalScore = ref(0);

const form = ref(null);

const handleSubmit = () => {
  if (voted.value) return;

  form.value.validate((val) => {
    if (!val) return;
    totalScore.value =
      myVote.program +
      myVote.theme +
      myVote.formal +
      myVote.content +
      myVote.effect;

    voted.value = true;

    setStorage(voteId);

    postVote({ ...myVote, scoreid: voteId }).then((res) => {
      if (res.code === "500") {
        ElMessage.warning({
          message: "学号重复或人数已满！",
        });
      }
    });
  });
};

const validator = (rule, value, callback) => {
  if (value < 0 || value > 20)
    return callback(new Error("单项分数应在0-20之间！"));
  callback();
};

const voteRules = reactive({
  program: [{ validator }],
  theme: [{ validator }],
  formal: [{ validator }],
  content: [{ validator }],
  effect: [{ validator }],
});
</script>

<style scoped>
.my-vote-title {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-right: 10px;
}

.score-title {
  text-align: center;
  margin: 10px 0;
}

.voted-title {
  text-align: center;
}
</style>
