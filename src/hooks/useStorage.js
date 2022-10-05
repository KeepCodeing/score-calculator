export const setStorage = (vid, tid) => {
  const voted = getStorage();
  if (!voted[vid]) voted[vid] = {};
  voted[vid][tid] = true;
  localStorage.setItem("voted", JSON.stringify(voted));
};

export const getStorage = () => {
  const voted = localStorage.getItem("voted") || "{}";
  return JSON.parse(voted);
};

export const checkStorage = (vid, tid) => {
  const voted = getStorage();
  if (!voted[vid]) voted[vid] = {};
  return voted[vid][tid];
};

export const useStorage = () => ({
  setStorage,
  getStorage,
  checkStorage,
});
