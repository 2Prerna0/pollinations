import { displayContentID } from "../network/utils";
import { getIPNSURL, getWebURL } from "../network/ipfsConnector";
import { Button, Link, ListItem as MuiListItem, Table, TableRow, TableBody, TableCell as MuiTableCell, withStyles, styled, List, Typography, Box} from "@material-ui/core"
import Debug from "debug";

const debug = Debug("NodeStatus");

const colabURL = "https://colab.research.google.com/github/pollinations/pollinations/blob/dev/colabs/pollinator.ipynb";

const TableCell = withStyles({
    root: {
      borderBottom: "none",
      padding: "2px"
    }
  })(MuiTableCell);


// Display the connection status to colab and currect IPFS hash
export default ({ nodeID, contentID, ipfs }) => {
    
    const gpu = parseGPU(ipfs);
    debug("parsed GPU", gpu)

    const gpuInfo = gpu && `${gpu} ${gpuSmilie[gpu]}`;
    
    return <Box style={{width:"220px", marginLeft:"auto"}}>
        <Table size="small" aria-label="a dense table" >
                    <TableBody>
                        <TableRow>
                            <TableCell><b>Node</b></TableCell>
                            <TableCell>{ nodeID ? gpuInfo || displayContentID(nodeID) : <ColabConnectButton />}</TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell ><b>ContentID</b></TableCell>
                            <TableCell>{contentID ?
                                <Link
                                    href={getWebURL(contentID)} 
                                    children={displayContentID(contentID)}
                                    target="_blank"
                                />
                                : <p children="Not connected..." />}
                        </TableCell>
                        </TableRow>
                        {/* <TableRow>
                            <TableCell><b>Status</b></TableCell>
                            <TableCell>
                                {colabState}
                            </TableCell>
                        </TableRow> */}
                    </TableBody>
                </Table>
            </Box>;
}


const gpuSmilie = {
    "Tesla T4" : "😴",
    "Tesla K80" : "😐",
    "Tesla P100" : "😀",
    "Tesla V100" : "😍",
}

// extract GPU name from ipfs
// the GPU was written to ipfs by running `nvidia-smi` on colab
const parseGPU = (ipfs)  => 
 ipfs?.output?.gpu?.replace(/\(.*\)/g, "")?.replace("GPU 0:", "")?.trim();


const ColabConnectButton = () => <Button color="secondary" href={colabURL} target="_blank">[ Launch ]</Button>;

