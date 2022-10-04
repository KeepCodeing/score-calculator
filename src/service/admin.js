import service from "./";

export const getAllVotes = function () {
  return service({
    url: "/demo/scoretable/selectAll",
    method: "get",
  });
};
