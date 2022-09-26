import React from 'react';
import { IProposalModalProps, IProposal } from '../types';
import { Text, Box, Grid, GridItem, Avatar, Link, Button, Divider, useColorModeValue } from '@chakra-ui/react';
import { SessionTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { useSession } from 'next-auth/react';

function SessionProposalModal({ proposal, setProposalEvent, client }: IProposalModalProps) {
  const { data } = useSession();
  const descBgColor = useColorModeValue('gray.100', 'gray.600');
  const chain = data?.user.chainId;
  if (!proposal) {
    return <Text>Missing proposal data</Text>;
  }

  // Get required proposal data
  const { id, params } = proposal;
  const { proposer, requiredNamespaces, relays } = params;
  const { icons, name, url } = proposer.metadata;

  async function onApprove() {
    if (proposal) {
      const namespaces: SessionTypes.Namespaces = {
        eip155: {
          accounts: [`eip155:${chain}:${data?.user.address}`],
          methods: requiredNamespaces['eip155'].methods,
          events: requiredNamespaces['eip155'].events,
        },
      };

      const { acknowledged } = await client.approve({
        id,
        relayProtocol: relays[0].protocol,
        namespaces,
      });
      await acknowledged();
    }
    setProposalEvent({} as IProposal);
  }

  // Hanlde reject action
  async function onReject() {
    if (proposal) {
      await client?.reject({
        id,
        reason: getSdkError('USER_REJECTED_METHODS'),
      });
    }
    setProposalEvent({} as IProposal);
  }

  const allMethods = [...requiredNamespaces['eip155'].methods];
  const allEvents = [...requiredNamespaces['eip155'].events];

  return (
    <Box>
      <Grid
        templateColumns="repeat(17, 1fr)"
        gap={4}
        bgColor={descBgColor}
        padding={2.5}
        borderRadius="xl"
        marginTop={2}
      >
        <GridItem colSpan={3}>
          <Avatar src={icons[0]} />
        </GridItem>
        <GridItem colSpan={14}>
          <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="md">
            <Text>{name}</Text>
          </Box>
          <Box as="h4" noOfLines={1} fontSize="md">
            <Link href={url}>{url}</Link>
          </Box>
        </GridItem>
      </Grid>

      <Divider />

      <Box gap={2} bgColor={descBgColor} padding={2}>
        <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="md">
          <Text>{`Review ${chain} permissions`}</Text>
        </Box>
        <Box as="h5" noOfLines={1} fontWeight="medium" fontSize="sm">
          <Text>Ethereum Goerli</Text>
        </Box>
        <Text as="h6" fontWeight="medium" fontSize="sm">
          Methods
        </Text>
        <Text color="gray.300">{allMethods.length ? allMethods.join(', ') : '-'}</Text>
        <Text as="h6" fontWeight="medium" fontSize="sm">
          Events
        </Text>
        <Text color="gray.300">{allEvents.length ? allEvents.join(', ') : '-'}</Text>
      </Box>

      <Divider />

      <Button onClick={onReject} width="100%" bgGradient="gray.500" marginY={2}>
        Reject
      </Button>
      <Button onClick={onApprove} width="100%" bgGradient="linear(to-l, #7928CA, #FF0080)">
        Approve
      </Button>
    </Box>
  );
}

export default SessionProposalModal;
