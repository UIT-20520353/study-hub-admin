import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ModalType = "success" | "error" | "info";

export interface ModalState {
  isOpen: boolean;
  content: React.ReactNode | null;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  type?: ModalType;
  hideCloseButton?: boolean;
}

const initialState: ModalState = {
  isOpen: false,
  content: null,
  title: "",
  size: "md",
  type: "info",
  hideCloseButton: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<Omit<ModalState, "isOpen">>) => {
      state.isOpen = true;
      state.content = action.payload.content;
      state.title = action.payload.title;
      state.size = action.payload.size;
      state.type = action.payload.type || "info";
      state.hideCloseButton = action.payload.hideCloseButton || false;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.content = null;
      state.title = "";
      state.type = "info";
      state.hideCloseButton = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
