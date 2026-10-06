import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem('edu_compare_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('edu_compare_list', JSON.stringify(compareList));
    } catch {}
  }, [compareList]);

  const addToCompare = (college) => {
    if (!college || !college._id) return false;
    if (compareList.some((c) => c._id === college._id)) return false;
    if (compareList.length >= 4) {
      alert("You can compare up to 4 colleges at a time.");
      return false;
    }
    setCompareList((prev) => [...prev, college]);
    return true;
  };

  const removeFromCompare = (collegeId) => {
    setCompareList((prev) => prev.filter((c) => c._id !== collegeId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (collegeId) => {
    return compareList.some((c) => c._id === collegeId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
