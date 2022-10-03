import service from ".";

export const getAllVote = (vid) => {
  return service({
    method: "get",
    url: `/demo/socreinfo/selectById/${vid}`,
  });
};

export const postVote = (data) => {
  return service({
    method: "post",
    url: "/demo/socreinfo/insert",
    data,
  });
};
