import React, { useState, useEffect } from "react";
import classes from "./layout.module.css";

const SelectedItemHolder = (props) => {
  return (
    <div className={classes.test}>
      {!props.selectedItem && "Please select an item"}
      {props.selectedItem && "Selected item:"}
      <br/>
      {props.selectedItem && props.selectedItem.split("#")[1]}
    </div>
  );
};

export default SelectedItemHolder;
