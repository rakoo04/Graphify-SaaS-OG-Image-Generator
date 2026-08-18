
import React, { useState, useEffect } from 'react';
import Generator from './components/Generator';
import { Layout } from './components/Layout';
import { ApiKeyModal } from './components/ApiKeyModal';

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);

  useEffect(() => {
    const checkKey = async () => {
      try {
        if (window.aistudio) {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
          if (!selected) {
            setShowKeyModal(true);
          }
        }
      } catch (err) {
        console.error("Failed to check API key status", err);
      }
    };
    checkKey();
  }, []);

  const handleKeySelected = async () => {
    try {
      await window.aistudio.openSelectKey();
      // Per instructions: assume success and proceed
      setHasKey(true);
      setShowKeyModal(false);
    } catch (err) {
      console.error("Key selection failed", err);
    }
  };

  return (
    <Layout>
      {showKeyModal ? (
        <ApiKeyModal onSelectKey={handleKeySelected} />
      ) : (
        <Generator />
      )}
    </Layout>
  );
};

export default App;
