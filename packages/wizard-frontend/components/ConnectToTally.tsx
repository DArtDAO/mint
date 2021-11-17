import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { Box, Button, Link } from '@chakra-ui/react'
import React, { useState } from 'react'
import { tallyApiURI, tallyWebBaseURI } from '../config'

interface TallyCreateGovParams {
  name: string
  description: string
  website: string
  icon: string
  color: string
  tokenAddress: string
  governanceAddress: string
  chainIdCAIP: string
  startBlock: number
}

export const ConnectToTally = ({
  orgName,
  tokenAddress,
  governanceAddress,
  chainId,
  startBlock,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isCreated, setIsCreated] = useState(false)
  const [tallyUrl, setTallyUrl] = useState('')

  const chainIdCAIP = `eip155:${chainId}`

  const client = new ApolloClient({
    uri: tallyApiURI,
    cache: new InMemoryCache(),
  })

  const createGovOnTally = async (params: TallyCreateGovParams) => {
    const createOrgResponse = await client.mutate({
      mutation: gql`
        mutation {
          createOrganization (
            name: "${params.name}"
            description: "${params.description}"
            website: "${params.website}"
            icon: "${params.icon}"
            color: "${params.color}"
          ) {
            name
            id
          }
        }`,
    })
    console.log(createOrgResponse)
    const orgId = createOrgResponse['data']['createOrganization']['id']
    console.log(orgId)
    const createTokenResponse = await client.mutate({
      mutation: gql`
        mutation {
          createToken (
              address: "${params.tokenAddress}"
              chainId: "${chainIdCAIP}"
              type:ERC721
              start: "${params.startBlock}"
            ) {
              id
              address
            }
        }`,
    })
    console.log(createTokenResponse)
    const createGovResponse = await client.mutate({
      mutation: gql`
        mutation {
          createGovernance (
            address: "${params.governanceAddress}"
            chainId: "${chainIdCAIP}"
            type: OPENZEPPELINGOVERNOR
            start: "${startBlock}"
            organization: ${orgId}
            token: "${params.tokenAddress}"
          )
        }
      `,
    })
    console.log(createGovResponse)
  }

  const getTallyUrl = (chainIdCAIP: string, governanceAddress: string) => {
    return `${tallyWebBaseURI}${chainIdCAIP}:${governanceAddress}`
  }

  const onClick = async () => {
    setIsLoading(true)
    try {
      await createGovOnTally({
        name: orgName,
        description: orgName,
        website: `http://${orgName}`,
        icon: 'https://cdn-images-1.medium.com/max/92/1*q59g_GBPQ4c_y10ORUoKhg@2x.png',
        color: '#A1DDF1',
        tokenAddress: tokenAddress,
        governanceAddress: governanceAddress,
        chainIdCAIP: chainIdCAIP,
        startBlock: startBlock,
      })
      setIsCreated(true)
      setTallyUrl(getTallyUrl(chainIdCAIP, governanceAddress))
    } catch (error) {
      alert(`Sorry, we encountered an error: ${JSON.stringify(error, null, 2)}`)
    }
    setIsLoading(false)
  }

  return (
    <Box>
      <Button colorScheme="teal" onClick={onClick} isLoading={isLoading}>
        Connect to Tally
      </Button>
      {isCreated ? (
        <Box>
          Manage your DAO here:{' '}
          <Link href={tallyUrl} isExternal>
            {tallyUrl}
          </Link>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  )
}