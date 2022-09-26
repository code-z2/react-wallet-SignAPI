import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Spinner, Button, Box, Image } from '@chakra-ui/react';
import { IQrReaderProps } from '../types';
const ReactQrReader = dynamic(() => import('react-qr-reader-es6'), { ssr: false });

function QrReader({ onConnect }: IQrReaderProps) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  function onError() {
    setShow(false);
  }

  async function onScan(data: string | null) {
    if (data) {
      await onConnect(data);
      setShow(false);
    }
  }

  function onShowScanner() {
    setLoading(true);
    setShow(true);
  }
  return (
    <div>
      {show ? (
        <div>
          {loading && <Spinner />}
          <div>
            <ReactQrReader
              onLoad={() => setLoading(false)}
              showViewFinder={false}
              onError={onError}
              onScan={onScan}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      ) : (
        <div>
          <Box
            minH="240px"
            minW="240px"
            border="1px"
            borderRadius="xl"
            borderColor="gray.600"
            display="flex"
            flexDir="column"
          >
            <Image src="/qr-icon.svg" width={70} height={70} alt="qr code icon" margin="auto" />
            <Button onClick={onShowScanner} margin="auto" transform="auto" translateY="-10">
              Scan QR code
            </Button>
          </Box>
        </div>
      )}
    </div>
  );
}

export default QrReader;
