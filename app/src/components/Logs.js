import React from 'react'
import { Button, CardContent, Link, Typography } from "@material-ui/core"
// import ReactJson from 'react-json-view'
import Ansi from "ansi-to-react";

import { getWebURL } from '../network/ipfsConnector';
// import JupyterViewer from "react-jupyter-notebook";

export const IpfsLog = ({state}) => {
    const {ipfs, contentID} = state;
    const log = ipfs.output && ipfs.output.log;
    if (!log)
        return null;
    return <div style={{maxWidth: '100%', overflow: 'hidden'}}>
         <h3>Logs [<Button 
                href={getWebURL(`${contentID}/output/log`)} 
                target="_blank"
            >
                See Full
            </Button>]</h3>
        {log && <CardContent>
            <Typography
                variant="body2"
                color="textPrimary"
                component="pre">
                    <Ansi>
                {
                     log ? formatLog(log) : "Loading..."
                        // <JupyterViewer
                        //     rawIpynb={ipfs?.output?.["notebook_output.ipynb"]}
                        //     mediaAlign="center"
                        //     displaySource="hide"
                        //     displayOutput="auto"
                        //     />
                }
                </Ansi>
            </Typography>
        </CardContent>}

        {/* <CardContent>
            <ReactJson
                src={ipfs}
                name={displayContentID(contentID)}
                enableClipboard={false}
                displayDataTypes={false}
                displayObjectSize={false}
                collapsed={true} />
        </CardContent> */}

    </div>

}
const formatLog = 
        log =>  log
                .replace(/\].*/g, "")
                .split("\n")
                .filter(s => !s.startsWith("unhandled iopub"))
                .slice(-10)
                .join("\n");


