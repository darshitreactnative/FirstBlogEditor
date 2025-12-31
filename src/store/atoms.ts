// src/store/atoms.ts
import { atom } from "jotai";
import { BlogPost } from "../models/BlogPost";

export const postsAtom = atom<BlogPost[]>([]);
export const userAtom = atom<any>(null);
export const onlineAtom = atom(true);
