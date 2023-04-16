<template>
  <div>
    <div
      class="logo"
      :style="{ backgroundImage: `url('/src/assets/img//logo.jpg')` }"
    ></div>
    <h3 class="score-title">全体总分：{{ allSum }}</h3>
    <div class="light-box" v-if="voteLimit !== -1">
      <div class="light-box-item" v-for="item in allVotes.length" :key="item.id"></div>
      <div
        class="light-box-item"
        style="background: green"
        v-for="item in voteLimit - allVotes.length"
        :key="item"
      ></div>
    </div>
    <el-collapse style="padding: 0 20px" v-model="active">
      <el-collapse-item name="my">
        <template #title>
          <div class="my-vote-title">
            <span>我的投票</span>
          </div>
        </template>
        <el-form
          ref="form"
          style="margin-top: 20px"
          label-width="80px"
          label-position="left"
          :model="myVote"
          status-icon
        >
          <!-- :rules="voteRules" -->
          <el-form-item required label="老师" prop="teacherid">
            <el-select
              style="width: 100%"
              v-model="myVote.teacherid"
              placeholder="请选择老师"
            >
              <el-option
                v-for="item in teacherList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="学号" prop="account">
            <el-input disabled v-model="myVote.account" />
          </el-form-item> -->
          <el-form-item label="姓名" prop="name">
            <el-input disabled v-model="myVote.name" />
          </el-form-item>
          <template v-if="currentVoteType !== -1">
            <template v-for="(item, idx) in voteFieldMap[currentVoteType]">
              <el-form-item
                :label="item.label"
                :label-width="voteFieldWidthList[currentVoteType]"
                :prop="voteFieldList[idx]"
                required
              >
                <el-input-number
                  :max="item.score"
                  :min="0"
                  style="width: 100%"
                  v-model="myVote[voteFieldList[idx]]"
                />
              </el-form-item>
            </template>
          </template>
          <template v-if="currentVoteType === -1">
            <div>
              <h2 style="text-align: center">选择教师后即可打分投票~</h2>
            </div>
          </template>
          <!-- <el-form-item required label="班会方案" prop="program">
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
          </el-form-item> -->
        </el-form>
        <!-- <h3 v-if="voted" class="voted-title">您已参与投票！</h3> -->
        <el-button
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
        <el-table :data="allVotes" v-if="currentVoteType !== -1">
          <el-table-column prop="sum" label="总分"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <!-- <el-table-column prop="account" label="学号"></el-table-column> -->
          <el-table-column
            v-for="(item, idx) in voteFieldMap[currentVoteType]"
            :prop="voteFieldList[idx]"
            :label="item.label"
            :width="voteFieldWidthList[currentVoteType]"
          >
          </el-table-column>
          <!-- <el-table-column prop="program" label="班会方案"></el-table-column>
          <el-table-column prop="theme" label="班会主题"></el-table-column>
          <el-table-column prop="formal" label="班会形式"></el-table-column>
          <el-table-column prop="content" label="班会内容"></el-table-column>
          <el-table-column prop="effect" label="展示效果"></el-table-column> -->
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <el-dialog v-model="dialogVisible" title="请输入个人信息" width="60%">
      <el-form label-width="70" :model="myVote">
        <!-- <el-form-item label="学号" required prop="account">
          <el-input v-model="myVote.account"></el-input>
        </el-form-item> -->
        <el-form-item label="姓名" required prop="name">
          <el-input v-model="myVote.name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleInfoSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { postVote, getAllVote, getTeachers } from "../../service/vote";
import { checkVote, updateVoteCount } from "../../service/home";
import { ElMessage } from "element-plus";
import { useStorage } from "@/hooks/useStorage";

const active = ref("my");

const route = useRoute();
const router = useRouter();

const userInfoStr = localStorage.getItem("user-info") || "{}";
const userInfo = userInfoStr && JSON.parse(userInfoStr);

// input设置了max就会自动减去多余部分，所以这样做能保证初始值都是最大值
const myVote = reactive({
  program: 50,
  theme: 50,
  formal: 50,
  content: 50,
  effect: 50,
  account: userInfo.account || "",
  name: userInfo.name || "",
});

const currentVoteType = ref(-1);

const voteFieldList = ["program", "theme", "formal", "content", "effect"];

const voteFieldWidthList = [150, 230, 200];

// 案例研讨 谈心谈话 育人故事分享
// 0，1，2分别对应是不同场次的key，直接把名字作为mapkey更加直观，但又要加一层映射...
const voteFieldMap = {
  0: [
    { label: "提问清晰，逻辑明了", score: 30 },
    { label: "答案能抓住问题本质", score: 20 },
    { label: "有清晰的解决思路", score: 20 },
    { label: "实施办法可行有效", score: 20 },
    { label: "团队协作精神", score: 10 },
  ],
  1: [
    { label: "了解相关政策与现代学生特征", score: 50 },
    { label: "善于引导，答疑解惑有成效", score: 50 },
  ],
  2: [
    { label: "语言自然，简洁朴实", score: 50 },
    { label: "事例生动、感情真挚、具备感染力", score: 50 },
  ],
};

const voteId = route.params.id;

const teacherList = ref([]);

// 账号提示改为每次进入都提示，这样可以防止错误输入后无法更改
const dialogVisible = ref(true);

const handleCancel = () => {
  // router.replace("/home");
  ElMessage.warning({
    message: "不填写信息无法进行投票！",
  });
  dialogVisible.value = false;
};

// 需求变化：不用判断人数是否已满，不过后台去掉这个限制即可
// 现在根据用户信息来判断是否有权投票

// const joined = JSON.parse(localStorage.getItem("joined") || "[]");
// 去掉已投票校验，交给后端验证
const joined = [];

// 大部分之前的逻辑都可以保留，主要是投票进行限制
if (!joined.includes(voteId)) {
  checkVote(voteId).then((res) => {
    if (res.code === "-1") {
      ElMessage.warning({
        message: res.msg,
      });
      router.replace("/home");
    }
  });
}

// const joined = JSON.parse(localStorage.getItem("joined") || "[]");
// if (!joined.includes(voteId)) {
//   joined.push(voteId);
//   updateVoteCount(voteId);
// }
// localStorage.setItem("joined", JSON.stringify(joined));

const handleInfoSubmit = () => {
  if (/* !myVote.account || */ !myVote.name) {
    return ElMessage.warning({
      message: "请输入完整信息！",
    });
  }

  // TODO: 判断用户输入信息是否有效？这个操作可以在提交时后台一并处理
  // 也可以在输入完信息后做个校验

  localStorage.setItem(
    "user-info",
    JSON.stringify({ account: myVote.account, name: myVote.name })
  );
  updateVoteCount(voteId);
  // const joined = JSON.parse(localStorage.getItem("joined") || "[]");
  // if (!joined.includes(voteId)) {
  //   joined.push(voteId);
  // }
  // localStorage.setItem("joined", JSON.stringify(joined));
  dialogVisible.value = false;
};

// if (!myVote.account) dialogVisible.value = true;

const allVotes = ref([]);

const allSum = ref(0);

const voteLimit = ref(-1);

const { checkStorage, setStorage } = useStorage();

const voted = ref(checkStorage(voteId, -1));

onMounted(async () => {
  const { data } = await getTeachers(voteId);
  teacherList.value = data;
  const joined = JSON.parse(localStorage.getItem("joined") || "[]");
  // console.log(joined);
  if (!joined.includes(voteId)) {
    updateVoteCount(voteId).then(() => {
      // joined.push(voteId);
      // localStorage.setItem("joined", JSON.stringify(joined));

      checkVote(voteId).then((res) => {
        if (res.code === "-1") {
          ElMessage.warning({
            message: res.msg,
          });
          router.replace("/home");
        }
      });
    });
  }
});

// console.log(import.meta.env.VITE_UPDATE_LIMIT);
function updateAllVotes(stime) {
  let lastTime = 0;
  let sum = 0;
  async function _updateAllVotes(time) {
    sum += time - lastTime;
    if (sum >= import.meta.env.VITE_UPDATE_LIMIT) {
      const res = await getAllVote(voteId, myVote.teacherid);
      if (res) {
        allVotes.value = res.data.data;
        allSum.value = allVotes.value.reduce((prev, now) => prev + now.sum, 0);
        voteLimit.value === -1 && (voteLimit.value = res.data.max_count);
        res.data.voteType && (currentVoteType.value = res.data.voteType);
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

watch(
  () => myVote.teacherid,
  (val, oldVal) => {
    if (val !== undefined) updateAllVotes(0);
    voted.value = checkStorage(voteId, val);
  }
);

const totalScore = ref(0);

const form = ref(null);

const handleSubmit = () => {
  // if (voted.value) return;

  form.value.validate((val) => {
    if (!val) return;
    totalScore.value =
      myVote.program + myVote.theme + myVote.formal + myVote.content + myVote.effect;

    // voted.value = true;

    setStorage(voteId, myVote.teacherid);

    const voteScores = {
      ...myVote,
    };

    if (currentVoteType.value !== 0) {
      voteScores.formal = 0;
      voteScores.content = 0;
      voteScores.effect = 0;
    }

    postVote({ ...voteScores, scoreid: voteId }).then((res) => {
      if (res.code === "500") {
        ElMessage.warning({
          message: "学号重复或人数已满！",
        });
      }
      if (res.code === "-1") {
        ElMessage.warning({
          message: res.msg,
        });
      }
    });
  });
};

const validator = (rule, value, callback) => {
  if (value < 0 || value > 20) return callback(new Error("单项分数应在0-20之间！"));
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

.light-box {
  width: 100%;
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
}

.light-box-item {
  height: 40px;
  width: 40px;
  margin: 5px;
  background: yellow;
}

.logo {
  height: 150px;
  width: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
