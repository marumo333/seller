"use client"
import { Provider } from "react-redux";
import store from "./store";
import React from "react";


export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>
      {children}
   </Provider>; // ← `Provider` が使われていることを確認
}

