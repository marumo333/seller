import { atom } from "recoil";

export const isMobileState = atom<boolean>({
  key: "isMobileState",
  default: false,
});
