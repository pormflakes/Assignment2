import React from "react";
import { clickedInst as c } from "../atoms";
import StructuralTimberForm from "./Forms/FormStructuralTimber";
import { useRecoilValue } from "recoil";

export default function SelectFormComponent() {
    const clickedInst = useRecoilValue(c)
    let MyFormComponent
    switch (clickedInst.type) {
      case "Timber":
        MyFormComponent = <StructuralTimberForm/>
        break;
    
      default:
        MyFormComponent = <StructuralTimberForm/>
        break;
    }
    return (
      <div>{MyFormComponent}</div>
      )
  }