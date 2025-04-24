// app/provider.tsx
"use client";

import { ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { RecoilRoot } from "recoil";
import { Provider } from "react-redux";
import { store } from "./store"; // ← これが必要！

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <RecoilRoot>
      <Provider store={store}>
        <MantineProvider>
          {children}
        </MantineProvider>
      </Provider>
    </RecoilRoot>
  );
}
