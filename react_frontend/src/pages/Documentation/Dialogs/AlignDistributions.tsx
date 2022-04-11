import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Alert, Checkbox, FormGroup } from '@mui/material'
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { getDefaultSession, login, Session } from '@inrupt/solid-client-authn-browser';
import { useRecoilState, useRecoilValue } from 'recoil'
import { project as p, datasets as d } from "../../../atoms"
import { v4 } from "uuid"
import DialogTemplate from './DialogTemplate';
import { LbdProject, LbdService, LbdDataset, LbdDistribution } from "lbdserver-client-api"
import { AGGREGATOR_ENDPOINT } from '../../../constants';
import { extract, createReferences } from '../../../util/functions';
import { DCAT, DCTERMS, LDP, RDFS } from '@inrupt/vocab-common-rdf'
import { lbdReferences, subjectObjectReferences, glTFReferences } from './alignments';
const Input = styled('input')({
    display: 'none',
});

export default function AlignDistributions(props: any) {
    const { open, title, description, Child, childProps } = props
    const [project, setProject] = useRecoilState(p)
    const [aggregator, setAggregator] = useState(AGGREGATOR_ENDPOINT)
    const [projects, setProjects] = useState([])
    const [error, setError] = useState(null)
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [datasets, setDatasets] = useRecoilState(d)
    const [toAlign, setToAlign] = useState({})

    useEffect(() => {
        const activeDatasets = Object.keys(datasets).map((i:string) => datasets[i]).filter((ds: any) => ds.active)
        const byMime = {}
        for (const ds of activeDatasets) {
            // only one distribution per dataset at this point
            const mainDistribution = extract(ds.dataset.data, ds.dataset.url)[DCAT.distribution].map(d => d["@id"])[0]
            const mime: string = extract(ds.dataset.data, mainDistribution)["http://www.w3.org/ns/dcat#mediaType"].map(d => d["@id"])[0]
            // if (mime.includes("text/turtle") || mime.includes("gltf")) {
            const url: string = extract(ds.dataset.data, mainDistribution)[DCAT.downloadURL].map(d => d["@id"])[0]
            byMime[mime] = url
            // }
        }
        setToAlign(byMime)
    }, [datasets])

    async function align() {
        try {
            setLoading(true)
            await createReferences(project, toAlign["https://www.iana.org/assignments/media-types/text/turtle"], toAlign["https://www.iana.org/assignments/media-types/model/gltf+json"], getDefaultSession())
            setLoading(false)
            setSuccess(true)
        } catch (error) {
            setLoading(false)
            setError(error)
        }

    }

    async function createIdentifiers() {
        const activeDatasets = Object.keys(datasets).map((i:string) => datasets[i]).filter((ds: any) => ds.active)

        for (const ds of activeDatasets) {
            // only one distribution per dataset at this point
            const distribution = extract(ds.dataset.data, ds.dataset.url)[DCAT.distribution].map(d => d["@id"])[0]



            console.log('distribution.split("/")[distribution.split("/") -1]', distribution.split("/")[distribution.split("/").length -1])
            const dist = new LbdDistribution(getDefaultSession(), ds.dataset, distribution.split("/")[distribution.split("/").length -1])



            const mime: string = extract(ds.dataset.data, distribution)["http://www.w3.org/ns/dcat#mediaType"].map(d => d["@id"])[0]
            switch (mime) {
                case "https://www.iana.org/assignments/media-types/text/turtle":
                    await subjectObjectReferences(dist, project)
                    break;
                case "https://www.iana.org/assignments/media-types/model/gltf+json":
                    await glTFReferences(dist, project)
                    break;
                default:
                    break;
            }
            
        }

    }

    return <div>
        <Typography variant="h5">{title}</Typography>
        <Typography>{description}</Typography>
        {(project && getDefaultSession().info.isLoggedIn) ? (
            <div>
                {(Object.keys(toAlign).length === 2) ? (
                    <div>
                    <Typography>Create abstract concepts for the selected datasets. Align glTF and RDF resources originating from the same IFC file. This can take a while.</Typography>
                <Button style={{ margin: 10, width: "200" }} variant="contained" onClick={align} disabled={loading}>Start Alignment of IFC and glTF</Button>
                </div>
                ) : (
                    <div>
                    <Typography>Create abstract concepts for the selected dataset</Typography>
                    <Button style={{ margin: 10, width: "200" }} variant="contained" onClick={createIdentifiers} disabled={loading}>Create concepts</Button>
                    </div>
                )}
                {error ? (
                <Alert onClose={() => setError(null)} severity="error">{error.message}</Alert>
            ) : (<React.Fragment/>)}
                        {success ? (
                <Alert onClose={() => setSuccess(null)} severity="success">The datasets were successfully aligned</Alert>
            ) : (<React.Fragment/>)}
            </div>
        ) : (
            <Typography>This can take a while. Make sure a project is activated and that exactly two datasets are selected, i.e., one RDF-based and one glTF 3D model originating from the same IFC file. You need to be logged in to perform this action.</Typography>
        )}
    </div>
};
