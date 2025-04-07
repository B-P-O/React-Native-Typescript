Best Practices and Tips for TypeScript in React Native
Type Safety
Use Strict Type Checking
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true
  }
}

tsconfig.json
Avoid Using any
Avoid using the any type as it defeats the purpose of TypeScript. Instead, use:

Specific types like string, number, boolean
Type aliases and interfaces for complex objects
unknown when the type is truly not known
Record<string, unknown> for objects with dynamic properties
Use Type Assertions Sparingly
Only use type assertions (as Type) when you're certain about the type and TypeScript cannot infer it correctly.

Component Structure
Prefer Functional Components with React Hooks
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

interface Props {
  title: string;
}

const BestPracticeComponent: React.FC<Props> = ({ title }) => {
  const [count, setCount] = useState<number>(0);
  
  return (
    <View>
      <Text>{title}: {count}</Text>
    </View>
  );
};

export default BestPracticeComponent;

BestPracticeComponent.tsx
Use React.PropsWithChildren for Components with Children
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ContainerProps {
  padding?: number;
  backgroundColor?: string;
}

const Container: React.FC<React.PropsWithChildren<ContainerProps>> = ({
  children,
  padding = 16,
  backgroundColor = '#ffffff'
}) => {
  return (
    <View style={[styles.container, { padding, backgroundColor }]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
  }
});

export default Container;

Container.tsx
Type Organization
Create a Types Directory
Organize your types in a dedicated directory:

// User related types
export interface User {
  id: string;
  name: string;
  email: string;
}

// Product related types
export interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Common UI component props
export interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

index.ts
Use Barrel Exports
Create index files to simplify imports:

export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Header } from './Header';
export { default as UserAvatar } from './UserAvatar';

index.ts
State Management
Type Redux Store and Actions
// Action types
export enum ActionTypes {
  ADD_TODO = 'ADD_TODO',
  TOGGLE_TODO = 'TOGGLE_TODO',
  REMOVE_TODO = 'REMOVE_TODO'
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// Action interfaces
export interface AddTodoAction {
  type: ActionTypes.ADD_TODO;
  payload: {
    text: string;
  };
}

export interface ToggleTodoAction {
  type: ActionTypes.TOGGLE_TODO;
  payload: {
    id: string;
  };
}

export interface RemoveTodoAction {
  type: ActionTypes.REMOVE_TODO;
  payload: {
    id: string;
  };
}

// Union type for all actions
export type TodoActions = AddTodoAction | ToggleTodoAction | RemoveTodoAction;

// State interface
export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

// Root state interface
export interface RootState {
  todo: TodoState;
  // Add other state slices here
}

types.ts
Type Context API
import React, { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  secondary: string;
}

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  setTheme: (theme: Theme) => void;
}

const defaultColors: Record<Theme, ThemeColors> = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#007AFF',
    secondary: '#5856D6'
  },
  dark: {
    background: '#000000',
    text: '#FFFFFF',
    primary: '#0A84FF',
    secondary: '#5E5CE6'
  },
  system: {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#007AFF',
    secondary: '#5856D6'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const value: ThemeContextType = {
    theme,
    colors: defaultColors[theme],
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

ThemeContext.tsx
Performance Optimization
Use React.memo with TypeScript
import React from 'react';
import { Text } from 'react-native';

interface Props {
  value: string;
  onPress?: () => void;
}

const MemoizedComponent = React.memo<Props>(({ value, onPress }) => {
  return <Text onPress={onPress}>{value}</Text>;
});

export default MemoizedComponent;

MemoizedComponent.tsx
Type useCallback and useMemo Properly
import { useCallback, useMemo } from 'react';

interface Item {
  id: string;
  name: string;
}

export const useItemHandlers = (items: Item[]) => {
  // Properly typed callback
  const handleItemSelect = useCallback((id: string): void => {
    console.log(`Selected item: ${id}`);
  }, []);

  // Properly typed memo
  const sortedItems = useMemo((): Item[] => {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  return {
    handleItemSelect,
    sortedItems
  };
};

useCallbackExample.tsx
Testing
Type Jest Tests
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';

describe('Button Component', () => {
  it('renders correctly with props', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button 
        title="Test Button" 
        onPress={onPressMock} 
        disabled={false} 
      />
    );
    
    const buttonElement = getByText('Test Button');
    expect(buttonElement).toBeTruthy();
    
    fireEvent.press(buttonElement);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});

Button.test.tsx
Utility Types
Leverage TypeScript Utility Types
// Example of common utility types in action

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  role: 'admin' | 'user';
}

// Omit sensitive fields for public API
type PublicUser = Omit<User, 'password'>;

// Pick only what's needed for profile display
type UserProfile = Pick<User, 'id' | 'name' | 'email'>;

// Make fields optional for update operations
type UserUpdate = Partial<UserProfile>;

// Make fields required for creation
type RequiredUserFields = Required<Pick<User, 'name' | 'email' | 'password'>>;

// Read-only user object for immutable data
type ReadOnlyUser = Readonly<User>;

// Extract the possible role values
type UserRole = User['role']; // 'admin' | 'user'

// Record for mapping IDs to users
type UserMap = Record<string, PublicUser>;

utilityTypes.ts
Error Handling
Type-Safe Error Handling
// Define error types
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export class ValidationError extends Error {
  field: string;
  
  constructor(message: string, field: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

// Type guard functions
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

// Type-safe error handler
export function handleError(error: unknown): string {
  if (isApiError(error)) {
    return `API Error (${error.status}): ${error.message}`;
  } else if (isValidationError(error)) {
    return `Validation Error in ${error.field}: ${error.message}`;
  } else if (error instanceof Error) {
    return `Error: ${error.message}`;
  } else {
    return 'An unknown error occurred';
  }
}

errorHandling.ts
Key Takeaways
Define Clear Interfaces: Create explicit interfaces for props, state, and API responses.

Avoid Type Any: Use specific types or unknown when necessary.

Organize Types: Keep types organized in dedicated files or directories.

Use TypeScript Utility Types: Leverage built-in utility types like Partial, Omit, and Pick.

Type Guards: Implement type guards for runtime type checking.

Strict Mode: Enable strict mode in tsconfig.json for maximum type safety.

Consistent Naming: Follow a consistent naming convention for types and interfaces.

Component Props: Use React.FC for functional components.

Type Assertions: Use type assertions sparingly and only when necessary.

Documentation: Add JSDoc comments to explain complex types and functions.
