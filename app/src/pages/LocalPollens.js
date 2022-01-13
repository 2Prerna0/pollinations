import { Box, Button, Card, CardHeader } from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import RouterLink from "../components/molecules/RouterLink"
import { mediaToDisplay } from "../data/media"
import useIPFS from "../hooks/useIPFS"
import useLocalPollens from "../hooks/useLocalPollens"
import { displayContentID } from "../network/utils"
import { getNotebookMetadata } from "../utils/notebookMetadata"
// import { CardContainerStyle } from "./styles/card"

const LocalPollens = ({ node }) => {

    const { pollens, popCID } = useLocalPollens(node)

    if (!pollens) 
        return <> </>

    return <>

        <Typography variant='h2' children='My Pollen' />


        <Box margin='2em 0' display='grid' gridGap='5em' gridTemplateColumns='repeat(auto-fill, minmax(300px, 1fr))'>
            {
                pollens
                .sort( (a,b) => new Date(b.date) - new Date(a.date) )
                .map(pollen => <Pollen key={pollen.cid} {...pollen} popCID={popCID}  />)
            }
        </Box>

    </>
}

const Pollen = ({date, cid, popCID}) => {
    console.log(date, cid, popCID)

    const ipfs = useIPFS(cid)

    if (!ipfs?.output)
        return null

    const { first } = mediaToDisplay(ipfs.output)
    const metadata = getNotebookMetadata(ipfs)

    const primaryInputField = metadata?.primaryInput
    const primaryInput = ipfs?.input?.[primaryInputField]

    return <Box>
        <Card 
        //    style={CardContainerStyle}
        >
            <CardHeader subheader={<SubHeader cid={cid} />} />

            <Box padding='1em'>
                <br />
                <Typography>
                    {primaryInput}
                </Typography>
            </Box>
            { // catch other formats
                <video controls loop
                    src={first.url} style={{
                        width: '100%', marginTop: '2em'
                    }} />
            }
            <Box minWidth='100%' display='flex' justifyContent='space-around' padding='1em 0'>
                <Button onClick={()=>popCID(cid)}>
                    [ Remove Pollen ]
                </Button>
                {/* <Button disabled>
                    [ Mint Pollen ]
                </Button> */}
            </Box>
        </Card>
    </Box>
}

export default LocalPollens

const SubHeader = ({ cid }) => <>
    <Typography className='Lato noMargin' variant="h4" component="h4" gutterBottom>
        <RouterLink to={`/p/${cid}`}>
            {displayContentID(cid)}
        </RouterLink>
    </Typography>
</>