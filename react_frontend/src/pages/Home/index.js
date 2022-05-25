import React from "react";
import { Grid } from "@mui/material";
import Model from "./model.js";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import SelectedItemHolder from "../../components/SelectedItemHolder/index.js";
import GetProjects from '../Documentation/Dialogs/GetProjects'
import CreateProject from '../Documentation/Dialogs/CreateProject'
import CreateDataset from '../Documentation/Dialogs/CreateDataset'
import GetAllDatasets from '../Documentation/Dialogs/GetAllDatasets'
import AlignDistributions from '../Documentation/Dialogs/AlignDistributions'

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
  const [selectedText, setSelectedText] = React.useState();
  const [selectedPdf, setSelectedPdf] = React.useState();
  const tabStyle = { height: 800 };

  const setSelectedItemProps = (results) => {
    if (results != undefined) {
      results = results.toLowerCase()
      if (results.includes("alu")) {
        setSelectedText("You chose a metal cladding");
        setSelectedPdf("http://localhost:5000/Louis-De-Vos/lbd/voorpost/pdfs/metal.pdf");
      } else if (results.includes("concrete") || results.includes("wall")) {
        setSelectedText("You chose a concrete shear wall");
        setSelectedPdf("http://localhost:5000/Louis-De-Vos/lbd/voorpost/pdfs/concrete.pdf");
      } else if (results.includes("door") || results.includes("flush")) {
        setSelectedText("You chose a door");
        setSelectedPdf("http://localhost:5000/Louis-De-Vos/lbd/voorpost/pdfs/door.pdf");
      } else if (results.includes("floor") || results.includes("omgeving plaat")) {
        setSelectedText("You chose a ceramic tile");
        setSelectedPdf("http://localhost:5000/Louis-De-Vos/lbd/voorpost/pdfs/keramisch.pdf");
      } else {
        setSelectedText("You chose something we cannot reuse");
        setSelectedPdf();
      }
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function getClickResult(results) {
    if (results.length > 0) {
      console.log(results[0]);
      setSelectedItemProps(results[0])
    }
  }

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
              <Tab label="Material" {...a11yProps(0)} />
              <Tab label="Upload 3D model" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel id="tab-box" style={tabStyle} value={value} index={0}>
            <SelectedItemHolder
              selectedText={selectedText}
              selectedPdf={selectedPdf}
            />
          </TabPanel>
          <TabPanel style={tabStyle} value={value} index={1}>
          {/* <Grid style={{ textAlign: "justify" }} container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}> */}
            <Grid item >
                <div style={subComponentStyle}>
                    <CreateProject title={"1. (optional) create a project (login required)"} />
                </div>
                <div style={subComponentStyle}>
                    <GetProjects style={subComponentStyle} title={"2. Get available projects for this aggregator"} />
                </div>
                <div style={subComponentStyle}>
                    <CreateDataset style={subComponentStyle} title={"3. Upload Datasets to this project"} />
                </div>
                <div style={subComponentStyle}>
                    <GetAllDatasets style={subComponentStyle} title={"4. Activate Datasets of this project"} />
                </div>
                <div style={subComponentStyle}>
                    <AlignDistributions style={subComponentStyle} title={"5. Align datasets and create abstract concepts"} />
                </div>
            </Grid>
        {/* </Grid> */}
          </TabPanel>
        </Box>
      </Grid>
      <Grid item style={{}} xs={4} sm={4} md={6}>
        <div style={subComponentStyle}>
          <Model getClickResult={getClickResult} parentNode={"tab-box"} />
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

