'use client';

import { ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { RecoilRoot } from "recoil";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <RecoilRoot>
      <MantineProvider>
        {children}
      </MantineProvider>
    </RecoilRoot>
  );
}
