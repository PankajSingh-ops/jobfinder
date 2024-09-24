"use client";
import { store } from "@/store"
import { loadFromCookies } from "@/store/slices/authSlice";
import { ReactNode, useEffect } from "react"
import { Provider } from "react-redux"

export default function StoreProvider({ children }:{children:ReactNode}) {
  useEffect(() => {
    store.dispatch(loadFromCookies()); // Load the stored cookie data on app load
  }, []);
  return (
    <Provider store={store}>
        {children}
    </Provider>
  )
}
