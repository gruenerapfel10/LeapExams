'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EXAM_TYPES, ExamType, DEFAULT_EXAM } from '../constants';

interface ExamContextType {
  examType: ExamType;
  setExamType: (type: ExamType) => void;
  isExamTypeLoaded: boolean;
}

const LOCAL_STORAGE_KEY = 'leapexams_selected_exam_type';
const ExamContext = createContext<ExamContextType | undefined>(undefined);

export function ExamProvider({ children }: { children: React.ReactNode }) {
  const [examType, setExamTypeState] = useState<ExamType>(DEFAULT_EXAM);
  const [isExamTypeLoaded, setIsExamTypeLoaded] = useState(false);

  // Load exam type from localStorage on initial mount
  useEffect(() => {
    try {
      // Only run this on the client side
      if (typeof window !== 'undefined') {
        const savedExamType = localStorage.getItem(LOCAL_STORAGE_KEY);
        
        if (savedExamType && Object.values(EXAM_TYPES).includes(savedExamType as ExamType)) {
          setExamTypeState(savedExamType as ExamType);
        }
        
        // Mark as loaded regardless of whether we found a saved value
        setIsExamTypeLoaded(true);
      }
    } catch (error) {
      console.error('Error loading exam type from localStorage:', error);
      setIsExamTypeLoaded(true); // Still mark as loaded so the app can function
    }
  }, []);

  // Memoized function to set exam type
  const setExamType = useCallback((type: ExamType) => {
    if (!Object.values(EXAM_TYPES).includes(type)) {
      console.error(`Invalid exam type: ${type}`);
      return;
    }
    
    try {
      setExamTypeState(type);
      localStorage.setItem(LOCAL_STORAGE_KEY, type);
    } catch (error) {
      console.error('Error saving exam type to localStorage:', error);
    }
  }, []);

  // Provide context value
  const contextValue = {
    examType,
    setExamType,
    isExamTypeLoaded
  };

  return (
    <ExamContext.Provider value={contextValue}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
} 