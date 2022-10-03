import service from ".";

export const checkVote = (id) => {
  return service({
    method: "get",
    url: `/demo/scoretable/selectById/${id}`,
  });
};
