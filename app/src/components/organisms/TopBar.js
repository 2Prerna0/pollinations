import { useState } from 'react'
import styled  from '@emotion/styled'

import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'

import RouterLink from '../molecules/RouterLink'
import { HorizontalBorder } from '../atoms/Borders'
import { BigTitle } from '../atoms/BigTitle'
import { SocialLinks } from '../Social'

const MenuLinks = [
  { children: 'models', to: '/models' },
  { children: 'about', to: '/about' },
  { children: 'feed', to: '/feed' },
  { children: 'help', to: '/help' },
  { children: 'my pollens', to: '/localpollens' },
]

const TopBar = () => {
    const [open, setOpen] = useState(true)

    return <Container maxWidth='lg'>

        <VisibleContentStyle>
            <BigTitle>
                <RouterLink to={"/"}>
                pollinations.ai
                </RouterLink>
            </BigTitle>
            <Button onClick={()=> setOpen(state=>!state)}>
                Menu
            </Button>
        </VisibleContentStyle>

        <HorizontalBorder />

        <HiddenContentStyle open={open}>
            {
                MenuLinks
                .map( linkProps => <h6 key={linkProps.to} onClick={()=>setOpen(true)}>
                <RouterLink {...linkProps} />
                </h6>)
            }
            <SocialLinks style={{alignSelf: 'end'}}/>
        </HiddenContentStyle>
        
    </Container>
}

const VisibleContentStyle = styled.div`
display: flex;
justify-content: space-between;
`

const HiddenContentStyle = styled.div`
width: 100%;
height: ${props => props.open ? '0px' : 'auto'};
transition: height 0.1s ease-in;

padding: 0.1em 1em;
overflow-y: hidden;
background-color: #222;

display: grid;
grid-template-columns: repeat(auto-fit, minmax(calc(90vw / 6), 1fr));
align-items: center;
`

export default TopBar