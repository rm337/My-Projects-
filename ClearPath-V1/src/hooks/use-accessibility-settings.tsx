import { useCallback, useEffect, useState } from "react";
export type TextSize = "normal" | "large" | "largest";
const SIZE_TO_ROOT: Record<TextSize,string>={normal:"100%",large:"115%",largest:"132%"};
const STORAGE_KEY="clearpath-accessibility";
type Settings={textSize:TextSize;highContrast:boolean;reduceMotion:boolean};
const DEFAULTS:Settings={textSize:"normal",highContrast:false,reduceMotion:false};
export function useAccessibilitySettings(){const[settings,setSettings]=useState<Settings>(DEFAULTS);useEffect(()=>{try{const raw=window.localStorage.getItem(STORAGE_KEY);if(raw)setSettings({...DEFAULTS,...(JSON.parse(raw) as Partial<Settings>)});}catch{}},[]);useEffect(()=>{const root=document.documentElement;root.style.fontSize=SIZE_TO_ROOT[settings.textSize];root.dataset["contrast"]=settings.highContrast?"high":"normal";root.dataset["motion"]=settings.reduceMotion?"reduce":"normal";try{window.localStorage.setItem(STORAGE_KEY,JSON.stringify(settings));}catch{}},[settings]);const setTextSize=useCallback((textSize:TextSize)=>setSettings(s=>({...s,textSize})),[]);const toggleContrast=useCallback(()=>setSettings(s=>({...s,highContrast:!s.highContrast})),[]);const toggleMotion=useCallback(()=>setSettings(s=>({...s,reduceMotion:!s.reduceMotion})),[]);return{...settings,setTextSize,toggleContrast,toggleMotion};}
