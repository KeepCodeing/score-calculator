export const setStorage = (vid) => {
  const voted = getStorage();
  voted[vid] = true;
  localStorage.setItem("voted", JSON.stringify(voted));
};

export const getStorage = () => {
  const voted = localStorage.getItem("voted") || "{}";
  return JSON.parse(voted);
};

export const checkStorage = (vid) => {
  const voted = getStorage();
  return voted[vid];
};

export const useStorage = () => ({
  setStorage,
  getStorage,
  checkStorage,
});
