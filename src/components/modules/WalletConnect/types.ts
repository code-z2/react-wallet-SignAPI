import { SignClient } from '@walletconnect/sign-client/dist/types/client';
import { SignClientTypes, SessionTypes } from '@walletconnect/types';

export interface IQrReaderProps {
  onConnect: (uri: string) => Promise<void>;
}

export interface IEventsProps {
  setProposalEvent: (e: IProposal) => void;
  setRequestEvent: (e: IRequests) => void;
  client: SignClient | undefined;
}

export interface IProposalModalProps {
  proposal: SignClientTypes.EventArguments['session_proposal'];
  setProposalEvent: (e: IProposal) => void;
  client: SignClient;
}

export interface IProposal {
  proposal: SignClientTypes.EventArguments['session_proposal'];
  isProposalEvent: boolean;
}

export interface IRequests {
  requestEvent: SignClientTypes.EventArguments['session_request'];
  requestSession: SessionTypes.Struct | undefined;
  requestMethod: string;
  isRequestEvent: boolean;
}
