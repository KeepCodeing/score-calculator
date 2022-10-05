import service from "./";

export const getAllVotes = function () {
  return service({
    url: "/demo/scoretable/selectAll",
    method: "get",
  });
};

export const getVoteDetail = function (vid) {
  return service({
    url: `/demo/teacher/admin/select/${vid}`,
    method: "get",
  });
};
