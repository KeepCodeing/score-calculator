<template>
  <div>
    <el-collapse style="padding: 0 20px" v-model="active">
      <el-collapse-item name="my">
        <template #title>
          <div class="my-vote-title">
            <span>我的投票</span><span>总计: {{ totalScore }}分</span>
          </div>
        </template>
        <el-form
          ref="form"
          style="margin-top: 20px"
          label-width="80px"
          label-position="left"
          :model="myVote"
          :rules="voteRules"
          status-icon
        >
          <el-form-item required label="学号" prop="id">
            <el-input v-model="myVote.id" />
          </el-form-item>
          <el-form-item required label="姓名" prop="name">
            <el-input v-model="myVote.name" />
          </el-form-item>
          <el-form-item required label="班会方案" prop="plan">
            <el-input-number style="width: 100%" v-model="myVote.plan" />
          </el-form-item>
          <el-form-item required label="班会主题" prop="subject">
            <el-input-number style="width: 100%" v-model="myVote.subject" />
          </el-form-item>
          <el-form-item required label="班会形式" prop="formal">
            <el-input-number style="width: 100%" v-model="myVote.formal" />
          </el-form-item>
          <el-form-item required label="班会内容" prop="content">
            <el-input-number style="width: 100%" v-model="myVote.content" />
          </el-form-item>
          <el-form-item required label="展示效果" prop="result">
            <el-input-number style="width: 100%" v-model="myVote.result" />
          </el-form-item>
        </el-form>
        <el-button
          @click="handleSubmit"
          style="margin-top: 20px; width: 100%"
          type="success"
          >提交评分</el-button
        >
      </el-collapse-item>
      <el-collapse-item title="全体投票" name="all">
        <el-table>
          <el-table-column prop="total" label="总分"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="id" label="学号"></el-table-column>
          <el-table-column prop="plan" label="班会方案"></el-table-column>
          <el-table-column prop="subject" label="班会主题"></el-table-column>
          <el-table-column prop="formal" label="班会形式"></el-table-column>
          <el-table-column prop="content" label="班会内容"></el-table-column>
          <el-table-column prop="result" label="展示效果"></el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const active = ref("my");

const route = useRoute();
const router = useRouter();

const voteId = route.params.id;

if (!voteId) router.replace("/home");

const myVote = reactive({
  plan: 20,
  subject: 20,
  formal: 20,
  content: 20,
  result: 20,
});

const totalScore = ref(0);

const form = ref(null);

const handleSubmit = () => {
  form.value.validate((val) => {
    if (!val) return;
    totalScore.value =
      myVote.plan +
      myVote.subject +
      myVote.formal +
      myVote.content +
      myVote.result;
  });
};

const validator = (rule, value, callback) => {
  if (value < 0 || value > 20)
    return callback(new Error("单项分数应在0-20之间！"));
  callback();
};

const voteRules = reactive({
  plan: [{ validator }],
  subject: [{ validator }],
  formal: [{ validator }],
  content: [{ validator }],
  result: [{ validator }],
});
</script>

<style scoped>
.my-vote-title {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-right: 10px;
}
</style>
