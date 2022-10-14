<template>
  <div>
    <el-collapse
      @change="changeVote"
      accordion
      style="padding: 0 20px"
      v-model="active"
    >
      <el-collapse-item
        v-for="item in votes"
        :keys="item.uuid"
        :name="item.uuid"
      >
        <template #title>
          <div class="my-vote-title">
            <span>投票编号：{{ item.uuid }}</span
            ><span>限制人数: {{ item.paresoncount }}人</span>
          </div>
        </template>
        <el-table :data="currentVoteData">
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="sum" label="总分"></el-table-column>
          <el-table-column prop="avg" label="均分"></el-table-column>
          <el-table-column prop="curr_count" label="参与人数"></el-table-column>
          <el-table-column prop="program" label="班会方案"></el-table-column>
          <el-table-column prop="theme" label="班会主题"></el-table-column>
          <el-table-column prop="formal" label="班会形式"></el-table-column>
          <el-table-column prop="content" label="班会内容"></el-table-column>
          <el-table-column prop="effect" label="展示效果"></el-table-column>
        </el-table>
        <el-button style="margin-top: 20px" @click="download" type="primary"
          >下载数据</el-button
        >
        <el-button
          style="margin-top: 20px"
          @click="() => handleVoteDetail(item)"
          type="success"
          >查看详情</el-button
        >
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { getAllVotes, getVoteDetail } from "@/service/admin";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElLoading } from "element-plus";

const votes = ref([]);

const active = ref(0);

const router = useRouter();

const download = () => {
  let a = document.createElement("a");

  a.setAttribute(
    "download",
    `http://huiyuanai.cloud:8099/demo/exceltitle/excel/${active.value}`
  );
  a.setAttribute(
    "href",
    `http://huiyuanai.cloud:8099/demo/exceltitle/excel/${active.value}`
  );
  a.setAttribute("target", "_self");

  a.style.display = "none";
  document.body.appendChild(a);

  a.click();

  a = null;
};

onMounted(async () => {
  if (!localStorage.getItem("admin")) {
    router.replace("/home");
    return ElMessage.error({
      message: "您没有权限访问该页面哦！",
    });
  }

  const loading = ElLoading.service({
    lock: true,
    text: "数据加载中...",
    background: "rgba(0, 0, 0, 0.7)",
  });

  try {
    const {
      data: { data },
    } = await getAllVotes();
    votes.value = data;
  } catch (e) {
    votes.value = [];
  } finally {
    loading.close();
  }
});

const currentVoteData = ref([]);

const changeVote = async (vid) => {
  if (!vid) return;
  const { data } = await getVoteDetail(vid);
  currentVoteData.value = data.map((item) => ({
    ...item,
    avg: item.curr_count ? item.sum / item.curr_count : 0,
    count: 0,
  }));
};

const handleVoteDetail = (item) => {
  router.push(`/detail/${item.uuid || -1}`);
};
</script>

<style scoped>
.my-vote-title {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-right: 10px;
}
.my-voted-title {
  display: flex;
  justify-content: space-between;
}
</style>
