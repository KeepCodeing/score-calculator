import service from "./";

export const createVote = function (data) {
  return service({
    url: "/demo/scoretable/insert",
    data,
    method: "post",
  });
};
