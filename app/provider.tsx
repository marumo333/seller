// app/provider.tsx
"use client";

import { ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { RecoilRoot } from "recoil";
import { Provider } from "react-redux";
import { store } from "./store"; // ← これが必要！
// app/layout.tsx または app/provider.tsx のどちらか
import '@mantine/core/styles.css';

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
