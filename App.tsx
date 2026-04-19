import { useEffect, useState } from 'react';
import { Alert, View, ActivityIndicator, StyleSheet } from 'react-native';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { CardsScreen } from './src/screens/CardsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { AchievementsScreen } from './src/screens/AchievementsScreen';
import { ProfileDetailsScreen } from './src/screens/ProfileDetailsScreen';
import { SidebarDrawer } from './src/ui/SidebarDrawer';
import type { SidebarItemId } from './src/ui/SidebarDrawer';
import HomeScreen from './src/screens/index';
import { CreateQuestionnaireScreen } from './src/screens/CreateQuestionnaireScreen';
import {
  clearSession,
  getPersistedSession,
  loginAccount,
  persistSession,
  registerAccount,
  type StoredAccount,
} from './src/auth/accountStorage';

type Route = 'home' | 'login' | 'register' | 'main';
type MainView = 'cards' | 'profile' | 'profileDetails' | 'createQuestionnaire' | 'acv';
type RegisterBackRoute = 'home' | 'login';

export default function App() {
  const [ready, setReady] = useState(false);
  const [route, setRoute] = useState<Route>('home');
  const [registerBackRoute, setRegisterBackRoute] = useState<RegisterBackRoute>('home');
  const [mainView, setMainView] = useState<MainView>('cards');
  const [user, setUser] = useState<StoredAccount | null>(null);
  const [feedReloadKey, setFeedReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const session = await getPersistedSession();
        if (!cancelled && session) {
          setUser(session);
          setRoute('main');
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleSidebarSelect(id: SidebarItemId) {
    if (id === 'profile') {
      setMainView('profile');
      return;
    }
    if (id === 'cards') {
      setMainView('cards');
      return;
    }
    if (id === 'create') {
      setMainView('createQuestionnaire');
      return;
    }
    if (id === 'acv') {
      setMainView('acv');
      return;
    }
    console.log('sidebar select', id);
  }

  if (!ready) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color="#5f6843" />
      </View>
    );
  }

  if (route === 'home') {
    return (
      <HomeScreen
        onLogin={() => setRoute('login')}
        onStart={() => {
          setRegisterBackRoute('home');
          setRoute('register');
        }}
      />
    );
  }

  if (route === 'register') {
    return (
      <RegisterScreen
        onBack={() => setRoute(registerBackRoute)}
        onSubmit={async (params) => {
          const result = await registerAccount(params);
          if (!result.ok) {
            Alert.alert('Ошибка', result.error);
            return;
          }
          setUser(result.account);
          await persistSession(result.account);
          setMainView('cards');
          setRoute('main');
        }}
      />
    );
  }

  if (route === 'main') {
    return (
      <SidebarDrawer enabled onSelect={handleSidebarSelect}>
        {mainView === 'acv' ? (
          <AchievementsScreen onBack={() => setMainView('acv')} />
        ) : mainView === 'profile' ? (
          <ProfileScreen
            name={user?.name}
            email={user?.email}
            location={user?.city}
            onSettings={() => setMainView('profileDetails')}
          />
        ) : mainView === 'profileDetails' ? (
          <ProfileDetailsScreen
            onBack={() => setMainView('profile')}
            onLogout={async () => {
              await clearSession();
              setUser(null);
              setMainView('cards');
              setRoute('login');
            }}
          />
        ) : mainView === 'createQuestionnaire' ? (
          <CreateQuestionnaireScreen
            onBack={() => setMainView('cards')}
            onComplete={() => {
              setFeedReloadKey((k) => k + 1);
              setMainView('cards');
            }}
          />
        ) : (
          <CardsScreen feedReloadKey={feedReloadKey} onBack={() => setRoute('home')} />
        )}
      </SidebarDrawer>
    );
  }

  return (
    <LoginScreen
      onBack={() => {
        setRegisterBackRoute('login');
        setRoute('register');
      }}
      onSubmit={async (email, password) => {
        const result = await loginAccount(email, password);
        if (!result.ok) {
          Alert.alert('Ошибка', result.error);
          return;
        }
        setUser(result.account);
        await persistSession(result.account);
        setMainView('cards');
        setRoute('main');
      }}
    />
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8eadf',
  },
});
