<template>
  <div class="container">
    <el-steps :active="curStep" simple>
      <el-step title="人数" :icon="Lock" />
      <el-step title="编号" :icon="Edit" />
      <el-step title="加入" :icon="Check" />
    </el-steps>
    <div class="content">
      <el-carousel
        ref="carousel"
        arrow="never"
        :autoplay="false"
        indicator-position="none"
      >
        <el-carousel-item>
          <div style="text-align: left">请输入人数限制：</div>
          <el-input
            v-model="voteLimit"
            maxlength="2"
            style="height: 50px; font-size: 20px; margin-top: 20px"
          />
          <el-button
            @click="handleLimitSubmit"
            type="primary"
            style="margin-top: 20px; width: 100%; height: 40px"
            >确定</el-button
          >
        </el-carousel-item>
        <el-carousel-item>
          <div style="text-align: left">请输入打分场次编号：</div>
          <el-input
            v-model="voteCode"
            maxlength="6"
            style="height: 50px; font-size: 20px; margin-top: 20px"
          />
          <el-button
            @click="handleCodeSubmit"
            type="primary"
            style="margin-top: 20px; width: 100%; height: 40px"
            >确定</el-button
          >
        </el-carousel-item>
        <el-carousel-item>
          <div style="text-align: left">
            扫码或输入场次编号（{{ voteCode }}）即可加入打分！
          </div>

          <vue-qr
            v-if="curStep === 2"
            style="margin-top: 20px"
            :text="joinUrl"
            qid="qrcode"
          ></vue-qr>
          <el-button
            @click="$router.replace('/home')"
            type="success"
            style="margin-top: 20px; width: 100%"
            >回到主页</el-button
          >
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script setup>
import { Edit, Check, Lock } from "@element-plus/icons-vue";
import { ref } from "vue";
import vueQr from "vue-qr/src/packages/vue-qr.vue";
import { createVote } from "../../service/create";
import { ElMessage } from "element-plus";

const voteLimit = ref(0);
const voteCode = ref(0);
const carousel = ref(null);
const curStep = ref(0);

const joinUrl = ref(import.meta.env.VITE_JOIN_URL);

const handleLimitSubmit = () => {
  const val = +voteLimit.value;
  if (val !== val || val <= 0) {
    ElMessage({
      message: "请确认人数是否正确！",
      type: "warning",
    });
    return;
  }

  carousel.value.next();
  curStep.value++;
};

const handleCodeSubmit = async () => {
  if (!Number.isInteger(+voteCode.value)) {
    ElMessage.warning({
      message: "请输入数字编号！",
    });
    return;
  }
  const { code } = await createVote({
    uuid: voteCode.value,
    paresoncount: voteLimit.value,
  });

  if (code === "-1") {
    ElMessage.error({
      message: "该编号已被使用！",
    });
  } else {
    carousel.value.next();
    curStep.value++;
    joinUrl.value += `/${voteCode.value}`;
  }
};
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  background: #ecf0f1;
}

.content {
  padding: 30px 20px;
  text-align: center;
}
</style>
