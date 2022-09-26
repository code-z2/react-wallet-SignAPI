import SignClient from '@walletconnect/sign-client';

const wcClient = async () => {
  const signClient: SignClient = await SignClient.init({
    projectId: process.env.NEXT_PUBLIC_WCPROJECT_ID,
    // optional parameters
    relayUrl: process.env.NEXT_PUBLIC_REPLAY_URL,
    metadata: {
      name: 'Pizza Wallet',
      description: 'A self custodial wallet, named after the pizza community',
      url: 'https://app.pizzawallet.io/',
      icons: ['https://docs.pizzawallet.io/img/logo.svg'],
    },
  });
  return signClient;
};

export default wcClient;
