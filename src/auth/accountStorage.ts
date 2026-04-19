import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCOUNTS_KEY = 'pet_app_accounts_v1';
const SESSION_EMAIL_KEY = 'pet_app_session_email_v1';

export type StoredAccount = {
  id: string;
  name: string;
  email: string;
  city: string;
  password: string;
  createdAt: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function loadAccounts(): Promise<StoredAccount[]> {
  const raw = await AsyncStorage.getItem(ACCOUNTS_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

async function saveAccounts(accounts: StoredAccount[]) {
  await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export async function registerAccount(input: {
  name: string;
  email: string;
  city: string;
  password: string;
}): Promise<{ ok: true; account: StoredAccount } | { ok: false; error: string }> {
  const accounts = await loadAccounts();
  const email = normalizeEmail(input.email);
  if (accounts.some((a) => a.email === email)) {
    return { ok: false, error: 'Пользователь с таким email уже зарегистрирован.' };
  }
  const account: StoredAccount = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    name: input.name.trim(),
    email,
    city: input.city.trim(),
    password: input.password,
    createdAt: new Date().toISOString(),
  };
  accounts.push(account);
  await saveAccounts(accounts);
  return { ok: true, account };
}

export async function loginAccount(
  email: string,
  password: string
): Promise<{ ok: true; account: StoredAccount } | { ok: false; error: string }> {
  const accounts = await loadAccounts();
  const e = normalizeEmail(email);
  const found = accounts.find((a) => a.email === e);
  if (!found) {
    return {
      ok: false,
      error: 'Аккаунт не найден. Проверьте email или зарегистрируйтесь.',
    };
  }
  if (found.password !== password) {
    return { ok: false, error: 'Неверный пароль.' };
  }
  return { ok: true, account: found };
}

export async function persistSession(account: StoredAccount) {
  await AsyncStorage.setItem(SESSION_EMAIL_KEY, account.email);
}

export async function clearSession() {
  await AsyncStorage.removeItem(SESSION_EMAIL_KEY);

}


export async function getPersistedSession(): Promise<StoredAccount | null> {
  const email = await AsyncStorage.getItem(SESSION_EMAIL_KEY);
  if (!email) return null;
  const accounts = await loadAccounts();
  const found = accounts.find((a) => a.email === email) ?? null;
  if (!found) {
    await clearSession();
  }
  return found;
}
