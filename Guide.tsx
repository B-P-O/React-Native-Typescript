# TypeScript in React Native & Expo: Comprehensive Guide

## Introduction to TypeScript in React Native
TypeScript adds static typing to JavaScript, enhancing code quality and developer experience in React Native projects.
 This guide covers essential TypeScript patterns and practices for React Native and Expo development.

## Setting Up TypeScript with Expo

### New Project Setup
```bash
# Create a new TypeScript project with Expo
npx create-expo-app MyTSProject --template expo-template-blank-typescript
```

### Adding TypeScript to Existing Project
```bash
# Install TypeScript dependencies
npm install -D typescript @types/react @types/react-native

# Generate tsconfig.json
npx tsc --init
```

### Basic tsconfig.json for React Native
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-native",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "*": ["src/*"]
    }
  }
}
```

## Core TypeScript Types in React Native

### Component Props

```typescript
// Basic component with typed props
interface GreetingProps {
  name: string;
  age?: number;  // Optional property
  onPress: () => void;
}

const Greeting: React.FC<GreetingProps> = ({ name, age, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>Hello, {name}! {age ? `You are ${age} years old.` : ''}</Text>
    </TouchableOpacity>
  );
};
```

### Styling Types

```typescript
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

// Using type annotations for styles
type Styles = {
  container: ViewStyle;
  header: TextStyle;
  image: ImageStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
});
```

### Event Handling

```typescript
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';

// Typing text input events
const handleChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
  const text = e.nativeEvent.text;
  console.log(text);
};

// Typing gesture events
import { GestureResponderEvent } from 'react-native';

const handlePress = (event: GestureResponderEvent) => {
  const { locationX, locationY } = event.nativeEvent;
  console.log(`Pressed at: ${locationX}, ${locationY}`);
};
```

## React Native Component Props

### Built-in Component Props

```typescript
import { 
  ViewProps, 
  TextProps, 
  TextInputProps,
  TouchableOpacityProps 
} from 'react-native';

// Creating components with extended props
interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  variant = 'primary',
  ...touchableProps
}) => {
  // Implementation
};
```

## Handling State with TypeScript

```typescript
// Basic useState
const [count, setCount] = useState<number>(0);

// Complex state
interface UserState {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  preferences: {
    darkMode: boolean;
    notifications: 'all' | 'important' | 'none';
  };
}

const [user, setUser] = useState<UserState | null>(null);

// useReducer with TypeScript
type Action = 
  | { type: 'INCREMENT'; payload: number }
  | { type: 'DECREMENT'; payload: number }
  | { type: 'RESET' };

const counterReducer = (state: number, action: Action): number => {
  switch (action.type) {
    case 'INCREMENT':
      return state + action.payload;
    case 'DECREMENT':
      return state - action.payload;
    case 'RESET':
      return 0;
    default:
      return state;
  }
};

const [state, dispatch] = useReducer(counterReducer, 0);
```

## TypeScript with React Navigation

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Define navigation parameters for type safety
type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string; name: string };
  Settings: { section?: 'appearance' | 'privacy' | 'notifications' };
};

const Stack = createStackNavigator<RootStackParamList>();

// Type for the navigation prop
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

// Type for the route prop
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

// Component props with navigation types
interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const { userId, name } = route.params;
  
  return (
    <View>
      <Text>User ID: {userId}</Text>
      <Text>Name: {name}</Text>
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings', { section: 'privacy' })}
      />
    </View>
  );
};
```

## Working with Expo APIs

```typescript
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

// Location types
const getLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  
  if (status !== 'granted') {
    console.log('Permission denied');
    return;
  }
  
  const location: Location.LocationObject = await Location.getCurrentPositionAsync({});
  console.log(location.coords.latitude, location.coords.longitude);
};

// Image picker types
const pickImage = async () => {
  const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    // Do something with the image
  }
};
```

## API and Async Operations

```typescript
// Define TypeScript interfaces for API responses
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// API client with TypeScript
const fetchUser = async (userId: string): Promise<User> => {
  try {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data: User = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Usage with async/await
const loadUserData = async () => {
  try {
    const user = await fetchUser('123');
    setUser(user);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

## Custom Type Definitions and Utilities

```typescript
// Type definitions
export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    error: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

// Utility types
type Nullable<T> = T | null;
type LoadingState<T> = {
  data: Nullable<T>;
  loading: boolean;
  error: Nullable<string>;
};

function createInitialState<T>(): LoadingState<T> {
  return {
    data: null,
    loading: false,
    error: null
  };
}

// Usage
const userState = createInitialState<User>();
```

## Form Handling with TypeScript

```typescript
// Form state type definition
interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Form errors type definition
type FormErrors = Partial<Record<keyof LoginForm, string>>;

// Form handling
const [form, setForm] = useState<LoginForm>({
  email: '',
  password: '',
  rememberMe: false
});

const [errors, setErrors] = useState<FormErrors>({});

const updateField = <T extends keyof LoginForm>(
  field: T, 
  value: LoginForm[T]
) => {
  setForm(prev => ({
    ...prev,
    [field]: value
  }));
  
  // Clear error when field is updated
  if (errors[field]) {
    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  }
};
```

## Advanced TypeScript Patterns

### Generic Components

```typescript
// Generic list component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ScrollView>
      {items.map(item => (
        <View key={keyExtractor(item)}>
          {renderItem(item)}
        </View>
      ))}
    </ScrollView>
  );
}

// Usage
<List
  items={users}
  renderItem={(user) => <Text>{user.name}</Text>}
  keyExtractor={(user) => user.id}
/>
```

### Type Guards

```typescript
// Type definitions
interface PhotoMedia {
  type: 'photo';
  uri: string;
  width: number;
  height: number;
}

interface VideoMedia {
  type: 'video';
  uri: string;
  duration: number;
  thumbnail: string;
}

type Media = PhotoMedia | VideoMedia;

// Type guard functions
function isPhoto(media: Media): media is PhotoMedia {
  return media.type === 'photo';
}

function isVideo(media: Media): media is VideoMedia {
  return media.type === 'video';
}

// Usage in component
const MediaItem: React.FC<{ media: Media }> = ({ media }) => {
  if (isPhoto(media)) {
    return (
      <Image
        source={{ uri: media.uri }}
        style={{ width: media.width, height: media.height }}
      />
    );
  }
  
  if (isVideo(media)) {
    return (
      <View>
        <Image source={{ uri: media.thumbnail }} />
        <Text>Duration: {media.duration}s</Text>
      </View>
    );
  }
  
  // Exhaustiveness check
  const _exhaustiveCheck: never = media;
  return null;
};
```

## Best Practices and Tips

1. **Use strict mode** in tsconfig.json
2. **Define proper interfaces** for your component props
3. **Leverage built-in React Native types** (ViewStyle, TextStyle, etc.)
4. **Create model/interface files** for shared types
5. **Use type guards** for conditional rendering
6. **Avoid `any` type** - use unknown and type assertions when necessary
7. **Utilize utility types** like Partial<T>, Pick<T>, and Omit<T>
8. **Create barrel exports** with index.ts files
9. **Use TypeScript path aliases** for cleaner imports
10. **Add proper typings for third-party libraries** that don't have them

## Troubleshooting Common TypeScript Issues

1. **Cannot find module 'X' or its corresponding type declarations**
   - Install @types packages: `npm install --save-dev @types/X`

2. **Property 'X' does not exist on type 'Y'**
   - Verify your interface/type definitions
   - Use type assertions when necessary: `(obj as YourType).property`

3. **Type 'X' is not assignable to type 'Y'**
   - Check for mismatched types
   - Consider using union types: `type Z = X | Y`

4. **No overload matches this call**
   - Review function parameter types
   - Ensure you're passing correct types to generics

5. **React Navigation typing errors**
   - Double-check your ParamList definitions
   - Ensure navigation and route props are properly typed

This guide should serve as a comprehensive resource for implementing TypeScript in your React Native and Expo projects. For specific implementation details,
 consult the official documentation for React Native, Expo, and TypeScript.
