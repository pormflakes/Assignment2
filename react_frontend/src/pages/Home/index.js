import React from "react";
import { Grid } from "@mui/material";
import Model from "./model.js";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Home = () => {
  const [value, setValue] = React.useState(0);
  const tabStyle = { height: 800 };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid
      style={{ textAlign: "justify" }}
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 6 }}
    >
      <Grid item style={{}} xs={0} sm={2} md={3}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="tabje 1" {...a11yProps(0)} />
              <Tab label="tabje 2" {...a11yProps(1)} />
              <Tab label="tabje 3" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel id="tab-box" style={tabStyle} value={value} index={0}>
            1{" "}
          </TabPanel>
          <TabPanel style={tabStyle} value={value} index={1}>
            2{" "}
          </TabPanel>
          <TabPanel style={tabStyle} value={value} index={2}>
            3
          </TabPanel>
        </Box>
      </Grid>
      <Grid item style={{}} xs={4} sm={4} md={6}>
        <div style={subComponentStyle}>
          <Model parentNode={"tab-box"} />
        </div>
      </Grid>
    </Grid>
  );
};

const subComponentStyle = {
  marginTop: 30,
  border: "2px solid gray",
  borderRadius: 15,
  padding: 15,
};

export default Home;


//comment date: 05/06/2020
//comment Louis