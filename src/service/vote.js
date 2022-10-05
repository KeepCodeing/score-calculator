import service from ".";

export const getAllVote = (vid, tid) => {
  return service({
    method: "get",
    url: `/demo/socreinfo/selectById/${vid}/${tid}`,
  });
};

export const postVote = (data) => {
  return service({
    method: "post",
    url: "/demo/socreinfo/insert",
    data,
  });
};

export const getTeachers = (vid) => {
  return service({
    method: "get",
    url: `/demo/teacher/selectByScoreid/${vid}`,
  });
};
