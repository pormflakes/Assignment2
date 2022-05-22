import React, { useState, useEffect } from "react";
import classes from "./layout.module.css";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import { Button } from "@mui/material";

const selectedItemHolder = (props) => {
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offSet) {
    setPageNumber((prevPageNumber) => prevPageNumber + offSet);
  }

  function changePageBack() {
    changePage(-1);
  }

  function changePageNext() {
    changePage(+1);
  }

  return (
    <div className={classes.test}>
      {!props.selectedText && "Please select an item"}
      {props.selectedText && (
        <>
          {props.selectedText}
          {props.selectedPdf && (
            <>
              <div>
                <Button
                  id="download"
                  href={props.selectedPdf}
                  target="_blank"
                  variant="contained"
                >
                  Download PDF
                </Button>
              </div>
              <Document
                id="viewer"
                file={props.selectedPdf}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page id="page" pageNumber={pageNumber} />
              </Document>
              <p>
                Page {pageNumber} of {numPages}
              </p>

              {pageNumber > 1 && (
                <Button onClick={changePageBack}>Previous Page</Button>
              )}
              {pageNumber < numPages && (
                <Button onClick={changePageNext}>Next Page</Button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default selectedItemHolder;
