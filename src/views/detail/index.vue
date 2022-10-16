<template>
  <div>
    <div class="logo" :style="{ backgroundImage: `url(/img/logo.jpg)` }"></div>
    <el-row style="padding: 10px">
      <el-col
        v-for="(item, idx) in voteDetail"
        :key="item.id"
        :md="4"
        :sm="12"
        :xs="12"
        style="text-align: center"
      >
        <el-progress
          :color="colorList[idx % colorLen]"
          type="dashboard"
          :percentage="item.avg"
        >
          <template #default="{ percentage }">
            <span class="percentage-value"
              ><span style="color: #e74c3c">{{ percentage }}</span
              >分</span
            >
            <span class="percentage-label">{{ item.name }}</span>
          </template>
        </el-progress>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElLoading } from "element-plus";
import { getVoteDetail } from "@/service/admin";
import { onMounted, ref, onUnmounted } from "vue";

const route = useRoute();
const router = useRouter();

const voteDetail = ref([]);

const colorList = [
  "#1abc9c",
  "#2ecc71",
  "#9b59b6",
  "#3498db",
  "#34495e",
  "#16a085",
  "#27ae60",
  "#2980b9",
  "#e74c3c",
];

const { id } = route.params;

const colorLen = colorList.length;

const loading = ElLoading.service({
  lock: true,
  text: "数据加载中...",
  background: "rgba(0, 0, 0, 0.7)",
});

const fetchData = async () => {
  try {
    const { data } = await getVoteDetail(id);
    voteDetail.value = data.map((item) => ({
      name: item.name,
      avg: item.sum / (item.curr_count || 1),
      count: item.curr_count,
      id: item.id,
    }));
  } catch (e) {
    console.log(e);
  } finally {
    !voteDetail.value.length || loading.close();
  }
};

onMounted(() => {
  if (id === -1 || !localStorage.getItem("admin")) {
    router.back();
    return ElMessage.error({
      message: "您没有权限访问该页面哦！",
    });
  }

  fetchData();
});

const timer = setInterval(() => {
  fetchData();
}, 3000);

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 18px;
}
.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 24px;
}

.logo {
  height: 150px;
  width: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
