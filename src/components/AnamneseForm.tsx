import React, { useEffect } from 'react';

export const AnamneseForm: React.FC = () => {
  useEffect(() => {
    // Redirect to the static HTML version
    window.location.href = '/anamnese.html';
  }, []);

  return null;
};
