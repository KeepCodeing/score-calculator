<template>
  <div>
    <el-collapse
      style="padding: 0 20px"
      v-model="active"
      @change="handleChange"
    >
      <el-collapse-item name="my">
        <template #title>
          <div class="my-vote-title">
            <span>我的投票</span><span>总计: 0分</span>
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
            <el-input v-model="myVote.plan" />
          </el-form-item>
          <el-form-item required label="班会主题" prop="subject">
            <el-input v-model="myVote.subject" />
          </el-form-item>
          <el-form-item required label="班会形式" prop="formal">
            <el-input v-model="myVote.formal" />
          </el-form-item>
          <el-form-item required label="班会内容" prop="content">
            <el-input v-model="myVote.content" />
          </el-form-item>
          <el-form-item required label="展示效果" prop="result">
            <el-input v-model="myVote.result" />
          </el-form-item>
        </el-form>
        <el-button style="margin-top: 20px; width: 100%" type="success"
          >提交评分</el-button
        >
      </el-collapse-item>
      <el-collapse-item title="全体投票" name="all">
        <div>
          Consistent with real life: in line with the process and logic of real
          life, and comply with languages and habits that the users are used to;
        </div>
        <div>
          Consistent within interface: all elements should be consistent, such
          as: design style, icons and texts, position of elements, etc.
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
const active = ref("my");

const myVote = reactive({});

const voteRules = {};

const handleChange = () => {};
</script>

<style scoped>
.my-vote-title {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-right: 10px;
}
</style>
