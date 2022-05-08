import React, { useState, useEffect } from "react";
import Viewer from "./Viewer";
import { AGGREGATOR_ENDPOINT } from "../../constants";
import { extract, createReferences } from "../../util/functions";
import { DCAT, DCTERMS, LDP, RDFS } from "@inrupt/vocab-common-rdf";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  project as p,
  datasets as d,
  selectedElements as s,
} from "../../atoms";
import { useThemeProps } from "@mui/system";

const LBDviewer = (props, { parentNode }) => {
  const [model, setModel] = useState("");
  const [dataset, setDataset] = useState("");
  const [selectedElements, setSelectedElements] = useRecoilState(s);
  const [selection, setSelection] = useState([]);
  const [results, setResults] = useState([]);
  const project = useRecoilValue(p);
  const datasets = useRecoilValue(d);

  useEffect(() => {
    setActiveDatasets();
  }, [datasets]);

  function setActiveDatasets() {
    const activeDatasets = Object.keys(datasets)
      .map((i) => datasets[i])
      .filter((ds) => ds.active);
    // const filtered = []
    // only display one dataset/distribution at this point
    let model, dataset;
    for (const ds of activeDatasets) {
      // only one distribution per dataset at this point
      const mainDistribution = extract(ds.dataset.data, ds.dataset.url)[
        DCAT.distribution
      ].map((d) => d["@id"])[0];
      const mime = extract(ds.dataset.data, mainDistribution)[
        "http://www.w3.org/ns/dcat#mediaType"
      ].map((d) => d["@id"])[0];
      if (mime.includes("gltf")) {
        const url = extract(ds.dataset.data, mainDistribution)[
          DCAT.downloadURL
        ].map((d) => d["@id"])[0];
        model = url;
        dataset = ds.dataset.url;
        setModel((p) => url);
        setDataset((p) => ds.dataset.url);
        // filtered.push(url)
      }
    }
    return { model, dataset };
  }

  useEffect(() => {
    const { model: distribution } = setActiveDatasets();
    const filtered = [];
    selectedElements.forEach((item) => {
      item.references.forEach((ref) => {
        if (ref.distribution == distribution) {
          filtered.push(ref.identifier);
        }
      });
    });
    setSelection((prev) => filtered);
  }, [selectedElements]);

  function SelectFormComponent() {
    let MyComponent;
    switch (results.type) {
      case "Window":
        MyComponent = MyWindowForm;
        break;

      default:
        break;
    }
    return MyComponent;
  }

  async function onSelect(sel) {
    setSelectedElements((prev) => []);
    for (const s of sel) {
      console.log("s", s);
      const concept = await project.getConceptByIdentifier(s, dataset, model);
      console.log("concept", concept);
      const graphReferences = concept.references.filter((item) => {
        return item.identifier.startsWith("http");
      });
      for (const ref of graphReferences) {
        const query = `Select Distinct * where {
          <${ref.identifier}> a ?value ;
             .
        }
        `;

        // const query = `
        // PREFIX props: <https://w3id.org/props#>
        // Select ?material where {
        //     <${ref.identifier}> props:nameIfcRoot_attribute_simple ?material
        //        .
        //   }
        //   `;
        console.log("query", query);
        const results = await project.directQuery(query, [ref.distribution]);
        setResults(results);
        props.getClickResult(results);
        //check ?type of results and choose Form Component based on this type
        //
      }

      if (concept) {
        setSelectedElements((prev) => [...prev, concept]);
      }
    }

    setSelection(sel);
  }

  return (
    <div>
      {model.length > 0 ? (
        <div>
          {SelectFormComponent(results)}
          <Viewer
            height={550}
            models={[model]}
            projection={"perspective"}
            onSelect={onSelect}
            selection={selection}
          />
        </div>
      ) : (
        <div>
          <p style={{ paddingTop: "10%" }}>No glTF models selected </p>
        </div>
      )}
    </div>
  );
};

export default LBDviewer;
