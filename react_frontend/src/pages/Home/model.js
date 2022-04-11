import * as React from "react";
import Viewer from "../../components/Viewer";

export default function BasicTabs(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
 
      <Viewer />
  );
}

const tabStyle = { height: 800 };
