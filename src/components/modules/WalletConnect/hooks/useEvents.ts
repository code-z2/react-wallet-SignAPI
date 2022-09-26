import { useCallback } from 'react';
import { SignClientTypes } from '@walletconnect/types';
import { IEventsProps } from '../types';

function useEvents({ setProposalEvent, setRequestEvent, client }: IEventsProps) {
  const onSessionProposal = useCallback((proposal: SignClientTypes.EventArguments['session_proposal']) => {
    setProposalEvent({
      proposal,
      isProposalEvent: true,
    });
    console.log('proposal reached ', proposal);
  }, []);

  const onSessionRequest = useCallback(async (requestEvent: SignClientTypes.EventArguments['session_request']) => {
    console.log('session_request', requestEvent);
    const { topic, params } = requestEvent;
    const { request } = params;
    const requestSession = client?.session.get(topic);
    // verify if it is currently using the client
    console.log(client);

    setRequestEvent({
      requestEvent,
      requestSession,
      requestMethod: request.method,
      isRequestEvent: true,
    });
  }, []);

  async function loadEvents() {
    console.log('events reached', client);
    try {
      client?.on('session_proposal', onSessionProposal);
      client?.on('session_request', onSessionRequest);
    } catch (err: unknown) {
      console.log(err);
    }
  }
  return { loadEvents, onSessionProposal, onSessionRequest };
}

export default useEvents;
