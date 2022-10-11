import service from ".";

export const checkVote = (id) => {
  return service({
    method: "get",
    url: `/demo/scoretable/selectById/${id}`,
  });
};


export const updateVoteCount = (id) => {
  return service({
    method: "get",
    url: `/demo/scoretable/addCount/${id}`
  })
}