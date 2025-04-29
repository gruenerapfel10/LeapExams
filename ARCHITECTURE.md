# Reading Module Architecture

This document describes the architecture of the modular reading module in LeapExams, designed to handle different exam types (currently IELTS and Goethe) with a common infrastructure but specialized components.

## Overview

The reading module follows OOP principles and uses factory patterns to create specialized handlers and UI components based on the selected exam type. This design ensures extensibility and maintainability as new exam types are added in the future.

## Key Components

### 1. Core Types and Interfaces

- `ReadingExamHandler`: Interface defining the contract for all exam type handlers
- Zod Schemas: Base and specialized schemas for different exam types
- UI Component Props: Common interface for all reading UI components

### 2. Handlers

Each exam type has a specialized handler that implements the `ReadingExamHandler` interface:

- `DefaultReadingExamHandler`: Base handler with generic functionality
- `IELTSReadingExamHandler`: Specialized for IELTS exams
- `GoetheReadingExamHandler`: Specialized for Goethe exams

The handler factory (`ReadingExamHandlerFactory`) creates the appropriate handler based on the exam type.

### 3. UI Components

- `DefaultReadingUI`: Base UI component for generic exams
- `IELTSReadingUI`: Specialized UI for IELTS with sections and academic focus
- `GoetheReadingUI`: Specialized UI for Goethe with vocabulary sections and context-based questions

The UI factory function (`getReadingUI`) returns the appropriate component based on the exam type.

### 4. API Layer

- Streaming passage generation
- Streaming questions generation
- Exam-type specific prompts and schemas

## Flow

1. User selects an exam type in the UI
2. Reading page fetches the appropriate UI component using the factory
3. When content generation starts, the appropriate handler is created using the factory
4. The handler provides exam-specific prompts and schemas to the AI service
5. The generated content is rendered using the specialized UI component

## Extension Points

To add a new exam type:

1. Add a new type to `EXAM_TYPES` in constants
2. Create specialized schemas in `lib/reading/types.ts`
3. Implement a new handler extending `DefaultReadingExamHandler`
4. Add the new handler to `ReadingExamHandlerFactory`
5. Create a specialized UI component
6. Add the new component to the UI factory

## Benefits

- **Extensibility**: New exam types can be added without modifying existing code
- **Separation of Concerns**: UI, business logic, and data handling are clearly separated
- **Specialized Experience**: Each exam type can provide a tailored experience
- **Code Reuse**: Common functionality is shared through inheritance and composition
- **Type Safety**: Zod schemas ensure consistent data structures 