import React, { useEffect, useState } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import wcClient from './init';
import QrReader from './components/QrReader';
import { Button, Spinner, Input, useToast, Image } from '@chakra-ui/react';
import { Eth } from '@web3uikit/icons';
import SignClient from '@walletconnect/sign-client';
import useEvents from './hooks/useEvents';
import { IProposal, IRequests } from './types';
import SessionProposalModal from './modals/SessionProposalModal';

function WCModal() {
  const toast = useToast();
  const [wcUri, setwcUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, toggleModal] = useState(false);
  const [client, setClient] = useState<SignClient>();
  const [initialized, setInitialized] = useState(false);
  const [proposalEvent, setProposalEvent] = useState<IProposal>();
  const [requestEvent, setRequestEvent] = useState<IRequests>();

  const { loadEvents } = useEvents({ setProposalEvent, setRequestEvent, client });

  const bgColor = useColorModeValue('none', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const descBgColor = useColorModeValue('gray.100', 'gray.600');

  const initClient = async () => {
    const newClient = await wcClient();
    setClient(newClient);
    setInitialized(true);
    console.log('client has been initialised');
  };

  useEffect(() => {
    if (!(initialized && client)) {
      initClient();
    }
  }, []);

  useEffect(() => {
    if (initialized && client) {
      console.log('loading events ...');
      loadEvents();
    }
  }, [initialized]);

  async function onConnect(uri: string) {
    try {
      setLoading(true);
      if (initialized) {
        console.log('pairing with client!');
        await client?.pair({ uri });
      }
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: `${err}`,
        status: 'error',
        isClosable: true,
        duration: 9000,
      });
    } finally {
      setwcUri('');
      setLoading(false);
    }
  }

  return (
    <>
      <Button size="sm" onClick={() => toggleModal(!modal)}>
        <Eth fontSize="20px" />
      </Button>
      {modal && (
        <Box
          bgColor={bgColor}
          padding={3}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
          position="absolute"
          zIndex={50}
          backdropBrightness="50%"
          top={70}
          right={50}
          shadow="xl"
        >
          {proposalEvent?.isProposalEvent ? (
            <SessionProposalModal
              proposal={proposalEvent?.proposal}
              setProposalEvent={setProposalEvent}
              client={client as SignClient}
            />
          ) : requestEvent?.isRequestEvent ? (
            <></>
          ) : (
            <Box>
              <Box maxHeight="260px" overflow={'hidden'} borderRadius="xl">
                <QrReader onConnect={onConnect} />
              </Box>
              <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="smaller" marginTop={2} textAlign="center">
                or enter wallet connect URI
              </Box>
              <Box bgColor={descBgColor} padding={1.5} borderRadius="lg" marginY={2}>
                <Input
                  value={wcUri}
                  onChange={(e) => setwcUri(e.target.value)}
                  placeholder="wc:a281567bb3e4..."
                  size="sm"
                />
              </Box>
              <Button
                onClick={() => onConnect(wcUri)}
                disabled={!wcUri}
                width="100%"
                bgGradient="linear(to-l, #7928CA, #FF0080)"
              >
                {loading ? (
                  <Spinner size="sm" />
                ) : (
                  <Image src="/wallet-connect-logo.svg" width={35} height={35} alt="WC icon" />
                )}
              </Button>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}

export default WCModal;
