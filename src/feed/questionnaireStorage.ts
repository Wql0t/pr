import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ImageSourcePropType } from 'react-native';

const QUESTIONNAIRES_KEY = 'pet_app_questionnaires_v1';

export type StoredQuestionnaire = {
  id: string;
  createdAt: string;
  petType: string;
  petName: string;
  yearsOld: string;
  monthsOld: string;
  aboutPet: string;
  /** data:image/...;base64,... или file:// — предпочтительно base64 для сохранения в JSON */
  imageUris: string[];
};

const FALLBACK_IMAGE = require('../../assets/gr1.png');

export function formatQuestionnaireSubtitle(q: StoredQuestionnaire): string {
  const y = q.yearsOld.trim();
  const m = q.monthsOld.trim();
  const ageParts: string[] = [];
  if (y) ageParts.push(`${y} г.`);
  if (m) ageParts.push(`${m} мес.`);
  const age = ageParts.join(' ');
  return age ? `${q.petType} · ${age}` : q.petType;
}

export function questionnaireCoverSource(q: StoredQuestionnaire): ImageSourcePropType {
  const first = q.imageUris.find((u) => u && u.length > 0);
  if (first) {
    return { uri: first };
  }
  return FALLBACK_IMAGE;
}

export async function loadQuestionnaires(): Promise<StoredQuestionnaire[]> {
  const raw = await AsyncStorage.getItem(QUESTIONNAIRES_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredQuestionnaire[];
  } catch {
    return [];
  }
}

export async function saveQuestionnaires(list: StoredQuestionnaire[]) {
  await AsyncStorage.setItem(QUESTIONNAIRES_KEY, JSON.stringify(list));
}

export type NewQuestionnaireInput = {
  petType: string;
  petName: string;
  yearsOld: string;
  monthsOld: string;
  aboutPet: string;
  imageUris: string[];
};

export async function addQuestionnaire(input: NewQuestionnaireInput): Promise<StoredQuestionnaire> {
  const list = await loadQuestionnaires();
  const entry: StoredQuestionnaire = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    createdAt: new Date().toISOString(),
    petType: input.petType.trim(),
    petName: input.petName.trim(),
    yearsOld: input.yearsOld.trim(),
    monthsOld: input.monthsOld.trim(),
    aboutPet: input.aboutPet.trim(),
    imageUris: input.imageUris.filter((u) => typeof u === 'string' && u.length > 0),
  };
  list.unshift(entry);
  await saveQuestionnaires(list);
  return entry;
}
