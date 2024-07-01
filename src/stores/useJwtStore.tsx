import { create } from "zustand";
import { persist } from "zustand/middleware";

type JwtStore = {
  jwt: string;
  setJwt: (jwt: string) => void;
};

export const useJwtStore = create<JwtStore>()(
  persist(
    (set) => ({
      jwt: "",
      setJwt: (m: string) => {
        set(() => ({
          jwt: m,
        }));
      },
    }),
    {
      name: "pixel-pay-jwt-store",
      partialize: (state) => ({
        jwt: state.jwt,
      }),
    },
  ),
);
