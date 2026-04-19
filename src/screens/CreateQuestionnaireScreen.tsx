import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addQuestionnaire } from '../feed/questionnaireStorage';

const OLIVE = '#6b704c';
const OLIVE_SOFT = 'rgba(107, 112, 76, 0.22)';
const TEXT_MUTED = '#6a6a6a';
const LAST_STEP = 5;

const PET_TYPES = [
  'Собака',
  'Кошка',
  'Хомяк',
  'Черепаха',
  'Рыба',
  'Енот',
  'Лиса',
  'Ёж',
  'Крыса',
  'Попугай',
  'Лошадь',
  'Кролик',
  'Ещё…',
];

const PROGRESS_STRIP = [
  require('../../assets/Group 1.png'),
  require('../../assets/Group 2.png'),
  require('../../assets/Group 3.png'),
  require('../../assets/Group 4.png'),
  require('../../assets/Group 5.png'),
  require('../../assets/Group 6.png'),
];

const CARD_ASSET = require('../../assets/card.png');

function serifFont(): string | undefined {
  return Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });
}

function cardImageAspectRatio(): number {
  const meta = Image.resolveAssetSource(CARD_ASSET);
  if (!meta?.width || !meta?.height) return 0.55;
  return meta.width / meta.height;
}

type Props = {
  onBack?: () => void;
  onComplete?: () => void;
};

export function CreateQuestionnaireScreen({ onBack, onComplete }: Props) {
  const { width: screenW, height: screenH } = useWindowDimensions();

  const isSmall = screenW < 360;
  const isTablet = screenW >= 768;
  const isShort = screenH < 700;

  const [step, setStep] = useState(0);
  const [petType, setPetType] = useState<string | null>(null);
  const [petName, setPetName] = useState('');
  const [yearsOld, setYearsOld] = useState('');
  const [monthsOld, setMonthsOld] = useState('');
  const [aboutPet, setAboutPet] = useState('');
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null]);
  const [saving, setSaving] = useState(false);

  const aspect = cardImageAspectRatio();
  const serif = serifFont();

  const ui = useMemo(() => {
    const sideMargin = isTablet ? Math.max(28, screenW * 0.06) : Math.max(14, screenW * 0.04);

    let cardW = isTablet
      ? Math.min(560, screenW - sideMargin * 2)
      : Math.min(420, screenW - sideMargin * 2);

    let cardH = cardW / aspect;
    const maxH = isTablet ? screenH * 0.8 : isShort ? screenH * 0.76 : screenH * 0.72;

    if (cardH > maxH) {
      cardH = maxH;
      cardW = cardH * aspect;
    }

    const padX = Math.round(cardW * (isTablet ? 0.09 : 0.085));
    const padLeft = padX + 5;
    const padRight = padX;
    const padTop = Math.round(cardH * (isTablet ? 0.13 : 0.125));
    const padBottom = Math.round(cardH * (isTablet ? 0.06 : 0.055));

    const stripH = Math.round(
      Math.min(isTablet ? 62 : 52, Math.max(isTablet ? 46 : 38, cardW * 0.13))
    );

    const titlePx = Math.round(
      isTablet ? Math.min(30, Math.max(22, screenW * 0.036)) : Math.min(24, Math.max(16, screenW * 0.052))
    );

    const headingPx = Math.round(
      isTablet ? Math.min(24, Math.max(18, screenW * 0.031)) : Math.min(20, Math.max(15, screenW * 0.046))
    );

    const subPx = Math.round(
      isTablet ? Math.min(17, Math.max(13, screenW * 0.022)) : Math.min(15, Math.max(11, screenW * 0.036))
    );

    const bodyPx = Math.round(
      isTablet ? Math.min(18, Math.max(15, screenW * 0.024)) : Math.min(16, Math.max(13, screenW * 0.038))
    );

    const pillVertical = isTablet ? 12 : isSmall ? 8 : 10;
    const pillHorizontal = isTablet ? 16 : isSmall ? 12 : 14;

    const inputVertical = isTablet ? 14 : isSmall ? 10 : 12;
    const inputHorizontal = isTablet ? 18 : isSmall ? 14 : 16;

    const circleSize = isTablet ? 54 : isSmall ? 44 : 48;
    const photoWideHeight = isTablet ? 108 : isSmall ? 78 : 88;
    const textAreaMinHeight = isTablet ? 140 : isSmall ? 96 : 110;

    return {
      sideMargin,
      cardW,
      cardH,
      padLeft,
      padRight,
      padTop,
      padBottom,
      stripH,
      titlePx,
      headingPx,
      subPx,
      bodyPx,
      pillVertical,
      pillHorizontal,
      inputVertical,
      inputHorizontal,
      circleSize,
      photoWideHeight,
      textAreaMinHeight,
      titleTopMargin: isTablet ? 12 : 8,
      centerPaddingVertical: isTablet ? 18 : 10,
      subtitleMarginBottom: isTablet ? 18 : 14,
      contentBottomPadding: isTablet ? 10 : 6,
      finishMinWidth: cardW * (isTablet ? 0.7 : 0.82),
    };
  }, [screenW, screenH, isTablet, isSmall, isShort, aspect]);

  const serifText = (px: number) => ({ fontFamily: serif, fontSize: px });

  async function pickPhoto(slot: 0 | 1 | 2) {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Доступ к фото', 'Разрешите доступ к галерее, чтобы добавить снимок.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: slot === 2 ? [16, 9] : [1, 1],
        quality: 0.75,
        base64: true,
      });
      if (result.canceled || !result.assets[0]) return;
      const asset = result.assets[0];
      let uri: string;
      if (asset.base64) {
        const rawType = asset.mimeType?.split('/')[1];
        const ext = rawType === 'png' ? 'png' : 'jpeg';
        uri = `data:image/${ext};base64,${asset.base64}`;
      } else if (asset.uri) {
        uri = asset.uri;
      } else {
        return;
      }
      setPhotos((prev) => {
        const copy = [...prev];
        copy[slot] = uri;
        return copy;
      });
    } catch {
      Alert.alert('Ошибка', 'Не удалось выбрать фото.');
    }
  }

  async function publishQuestionnaire() {
    if (!petType) return;
    setSaving(true);
    try {
      await addQuestionnaire({
        petType,
        petName,
        yearsOld,
        monthsOld,
        aboutPet,
        imageUris: photos.filter((p): p is string => Boolean(p && p.length > 0)),
      });
      setPhotos([null, null, null]);
      onComplete?.();
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить анкету в хранилище.');
    } finally {
      setSaving(false);
    }
  }

  let ok = true;
  if (step === 0) ok = petType != null;
  else if (step === 1) ok = petName.trim().length > 0;
  else if (step === 2) ok = yearsOld.trim().length > 0 || monthsOld.trim().length > 0;
  else if (step === 3) ok = aboutPet.trim().length > 0;

  const innerPad = {
    paddingLeft: ui.padLeft,
    paddingRight: ui.padRight,
    paddingTop: ui.padTop,
    paddingBottom: ui.padBottom,
  };

  let body: React.ReactNode;

  if (step === 0) {
    body = (
      <>
        <Text style={[styles.cardTitle, serifText(ui.headingPx)]}>Познакомимся поближе!</Text>
        <Text style={[styles.cardSubtitle, serifText(ui.subPx), { marginBottom: ui.subtitleMarginBottom }]}>
          Что же у вас за питомец?
        </Text>

        <View style={[styles.pillGrid, { gap: isTablet ? 12 : 10, marginBottom: isTablet ? 20 : 16 }]}>
          {PET_TYPES.map((label) => {
            const selected = petType === label;
            return (
              <Pressable
                key={label}
                onPress={() => setPetType(label)}
                style={({ pressed }) => [
                  styles.pill,
                  {
                    paddingVertical: ui.pillVertical,
                    paddingHorizontal: ui.pillHorizontal,
                  },
                  selected && styles.pillSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    serifText(ui.bodyPx),
                    selected && styles.pillTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={[
            styles.primaryPill,
            {
              paddingVertical: isTablet ? 14 : 12,
              paddingHorizontal: isTablet ? 42 : 36,
            },
            !ok && styles.primaryPillDisabled,
          ]}
          disabled={!ok}
          onPress={() => step < LAST_STEP && setStep(step + 1)}
        >
          <Text
            style={[
              styles.primaryPillText,
              {
                fontFamily: serif,
                fontSize: isTablet ? 17 : 16,
              },
            ]}
          >
            Далее
          </Text>
        </Pressable>
      </>
    );
  } else if (step === 1) {
    body = (
      <>
        <Text style={[styles.cardTitle, serifText(ui.headingPx)]}>Как зовут вашего питомца?</Text>
        <Text style={[styles.cardSubtitle, serifText(ui.subPx), { marginBottom: ui.subtitleMarginBottom }]}>
          Как корабль назовёшь — так он и поплывёт
        </Text>

        <View style={[styles.nameRow, { gap: isTablet ? 12 : 10, marginTop: 8 }]}>
          <TextInput
            value={petName}
            onChangeText={setPetName}
            placeholder="Имя"
            placeholderTextColor={TEXT_MUTED}
            style={[
              styles.nameInput,
              serifText(ui.bodyPx),
              {
                paddingVertical: ui.inputVertical,
                paddingHorizontal: ui.inputHorizontal,
              },
            ]}
          />

          <Pressable
            style={[
              styles.circleNext,
              {
                width: ui.circleSize,
                height: ui.circleSize,
                borderRadius: ui.circleSize / 2,
              },
              !ok && styles.circleNextDisabled,
            ]}
            disabled={!ok}
            onPress={() => step < LAST_STEP && setStep(step + 1)}
          >
            <Text style={[styles.playIcon, { fontSize: isTablet ? 17 : 16 }]}>▶</Text>
          </Pressable>
        </View>
      </>
    );
  } else if (step === 2) {
    body = (
      <>
        <Text style={[styles.cardTitle, serifText(ui.headingPx)]}>
          Укажите возраст {petName.trim() ? `«${petName.trim()}»` : 'питомца'}
        </Text>
        <Text style={[styles.cardSubtitle, serifText(ui.subPx), { marginBottom: ui.subtitleMarginBottom }]}>
          Используйте реальный возраст
        </Text>

        <View style={[styles.ageRow, { gap: isTablet ? 10 : 8, marginTop: 8 }]}>
          <TextInput
            value={yearsOld}
            onChangeText={setYearsOld}
            placeholder="Лет"
            placeholderTextColor={TEXT_MUTED}
            keyboardType="number-pad"
            style={[
              styles.ageInput,
              serifText(ui.bodyPx),
              styles.ageInputGrow,
              {
                paddingVertical: ui.inputVertical,
                paddingHorizontal: isTablet ? 14 : 12,
              },
            ]}
          />
          <TextInput
            value={monthsOld}
            onChangeText={setMonthsOld}
            placeholder="Месяцев"
            placeholderTextColor={TEXT_MUTED}
            keyboardType="number-pad"
            style={[
              styles.ageInput,
              serifText(ui.bodyPx),
              styles.ageInputGrow,
              {
                paddingVertical: ui.inputVertical,
                paddingHorizontal: isTablet ? 14 : 12,
              },
            ]}
          />
          <Pressable
            style={[
              styles.circleNext,
              {
                width: ui.circleSize,
                height: ui.circleSize,
                borderRadius: ui.circleSize / 2,
              },
              !ok && styles.circleNextDisabled,
            ]}
            disabled={!ok}
            onPress={() => step < LAST_STEP && setStep(step + 1)}
          >
            <Text style={[styles.playIcon, { fontSize: isTablet ? 17 : 16 }]}>▶</Text>
          </Pressable>
        </View>
      </>
    );
  } else if (step === 3) {
    body = (
      <>
        <Text style={[styles.cardTitle, serifText(ui.headingPx)]}>Расскажите о вашем питомце</Text>
        <Text style={[styles.cardSubtitle, serifText(ui.subPx), { marginBottom: ui.subtitleMarginBottom }]}>
          Напишите об особенностях и интересных моментах
        </Text>

        <TextInput
          value={aboutPet}
          onChangeText={setAboutPet}
          placeholder="Творите"
          placeholderTextColor={TEXT_MUTED}
          multiline
          textAlignVertical="top"
          style={[
            styles.textArea,
            serifText(ui.bodyPx),
            {
              minHeight: ui.textAreaMinHeight,
              padding: isTablet ? 14 : 12,
            },
          ]}
        />

        <Pressable
          style={[
            styles.circleNext,
            styles.circleNextAlone,
            {
              width: ui.circleSize,
              height: ui.circleSize,
              borderRadius: ui.circleSize / 2,
              marginTop: isTablet ? 18 : 14,
            },
            !ok && styles.circleNextDisabled,
          ]}
          disabled={!ok}
          onPress={() => step < LAST_STEP && setStep(step + 1)}
        >
          <Text style={[styles.playIcon, { fontSize: isTablet ? 17 : 16 }]}>▶</Text>
        </Pressable>
      </>
    );
  } else if (step === 4) {
    body = (
      <>
        <Text style={[styles.cardTitle, serifText(ui.headingPx)]}>Загрузите фото</Text>
        <Text style={[styles.cardSubtitle, serifText(ui.subPx), { marginBottom: ui.subtitleMarginBottom }]}>
          Их увидят пользователи
        </Text>

        <View style={[styles.photoRow, { gap: isTablet ? 14 : 12, marginBottom: 12 }]}>
          <Pressable
            accessibilityLabel="Добавить фото 1"
            onPress={() => void pickPhoto(0)}
            style={[styles.photoSlot, { borderRadius: isTablet ? 16 : 14 }]}
          >
            {photos[0] ? (
              <Image source={{ uri: photos[0] }} style={styles.photoFilled} resizeMode="cover" />
            ) : (
              <Text
                style={[
                  styles.plusCircle,
                  {
                    width: isTablet ? 42 : 36,
                    height: isTablet ? 42 : 36,
                    borderRadius: isTablet ? 21 : 18,
                    lineHeight: isTablet ? 40 : 34,
                    fontSize: isTablet ? 26 : 22,
                  },
                ]}
              >
                +
              </Text>
            )}
          </Pressable>

          <Pressable
            accessibilityLabel="Добавить фото 2"
            onPress={() => void pickPhoto(1)}
            style={[styles.photoSlot, { borderRadius: isTablet ? 16 : 14 }]}
          >
            {photos[1] ? (
              <Image source={{ uri: photos[1] }} style={styles.photoFilled} resizeMode="cover" />
            ) : (
              <Text
                style={[
                  styles.plusCircle,
                  {
                    width: isTablet ? 42 : 36,
                    height: isTablet ? 42 : 36,
                    borderRadius: isTablet ? 21 : 18,
                    lineHeight: isTablet ? 40 : 34,
                    fontSize: isTablet ? 26 : 22,
                  },
                ]}
              >
                +
              </Text>
            )}
          </Pressable>
        </View>

        <Pressable
          accessibilityLabel="Добавить широкое фото"
          onPress={() => void pickPhoto(2)}
          style={[
            styles.photoSlotWide,
            {
              height: ui.photoWideHeight,
              borderRadius: isTablet ? 16 : 14,
            },
          ]}
        >
          {photos[2] ? (
            <Image source={{ uri: photos[2] }} style={styles.photoFilledWide} resizeMode="cover" />
          ) : (
            <Text
              style={[
                styles.plusCircle,
                {
                  width: isTablet ? 42 : 36,
                  height: isTablet ? 42 : 36,
                  borderRadius: isTablet ? 21 : 18,
                  lineHeight: isTablet ? 40 : 34,
                  fontSize: isTablet ? 26 : 22,
                },
              ]}
            >
              +
            </Text>
          )}
        </Pressable>

        <Pressable
          style={[
            styles.circleNext,
            styles.circleNextAlone,
            {
              width: ui.circleSize,
              height: ui.circleSize,
              borderRadius: ui.circleSize / 2,
              marginTop: isTablet ? 18 : 14,
            },
          ]}
          onPress={() => setStep(step + 1)}
        >
          <Text style={[styles.playIcon, { fontSize: isTablet ? 17 : 16 }]}>▶</Text>
        </Pressable>
      </>
    );
  } else {
    body = (
      <>
        <Text style={[styles.cardTitle, serifText(ui.headingPx)]}>Мы на финише!</Text>
        <Text style={[styles.cardSubtitle, serifText(ui.subPx), { marginBottom: ui.subtitleMarginBottom }]}>
          Осталось только нажать на кнопку)
        </Text>

        <Pressable
          style={[
            styles.finishBtn,
            {
              minWidth: ui.finishMinWidth,
              paddingVertical: isTablet ? 16 : 14,
              paddingHorizontal: isTablet ? 34 : 28,
              borderRadius: isTablet ? 18 : 16,
            },
            saving && styles.finishBtnDisabled,
          ]}
          disabled={saving}
          onPress={() => void publishQuestionnaire()}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.finishBtnText, serifText(ui.bodyPx + 1)]}>Выложить анкету</Text>
          )}
        </Pressable>
      </>
    );
  }

  return (
    <ImageBackground source={require('../../assets/paper.jpg')} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe}>
        <Text style={[styles.screenTitle, serifText(ui.titlePx), { marginTop: ui.titleTopMargin }]}>
          Создание анкеты
        </Text>

        <View style={[styles.center, { paddingVertical: ui.centerPaddingVertical }]}>
          <View style={[styles.cardShell, { width: ui.cardW, height: ui.cardH }]}>
            <Image source={CARD_ASSET} style={styles.cardImage} resizeMode="stretch" />

            <View style={[styles.cardInner, innerPad]}>
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: ui.contentBottomPadding }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {body}
              </ScrollView>

              <View style={[styles.footerStrip, { height: ui.stripH }]}>
                <Image
                  source={PROGRESS_STRIP[step]}
                  style={[styles.progressImage, { height: ui.stripH }]}
                  resizeMode="contain"
                />
                <Pressable
                  style={[styles.backTouch, { width: ui.cardW * 0.22, height: ui.stripH }]}
                  onPress={() => (step > 0 ? setStep(step - 1) : onBack?.())}
                  accessibilityLabel="Назад"
                />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },

  safe: { flex: 1 },

  screenTitle: {
    textAlign: 'center',
    color: '#0a0a0a',
    textDecorationLine: 'underline',
    textShadowColor: 'rgba(255,255,255,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardShell: {
    position: 'relative',
    alignSelf: 'center',
  },

  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: 360,
    marginLeft: -20,
    height: 550,

  },

  cardInner: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
  },

  scroll: {
    flex: 1,
    minHeight: 0,
  },

  scrollContent: {
    flexGrow: 1,
  },

  cardTitle: {
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },

  cardSubtitle: {
    color: TEXT_MUTED,
  },

  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  pill: {
    borderRadius: 999,
    backgroundColor: OLIVE_SOFT,
    borderWidth: 1,
    borderColor: OLIVE,
  },

  pillSelected: {
    backgroundColor: OLIVE,
  },

  pillText: {
    color: OLIVE,
  },

  pillTextSelected: {
    color: '#fff',
  },

  primaryPill: {
    alignSelf: 'center',
    marginTop: 4,
    borderRadius: 999,
    backgroundColor: OLIVE,
  },

  primaryPillDisabled: {
    opacity: 0.45,
  },

  primaryPillText: {
    color: '#fff',
    fontWeight: '600',
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  nameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: OLIVE,
    borderRadius: 999,
    color: '#111',
    backgroundColor: 'rgba(255,255,255,0.55)',
    minWidth: 0,
  },

  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ageInput: {
    borderWidth: 1,
    borderColor: OLIVE,
    borderRadius: 14,
    color: '#111',
    backgroundColor: 'rgba(255,255,255,0.55)',
  },

  ageInputGrow: {
    flex: 1,
    minWidth: 0,
  },

  circleNext: {
    borderWidth: 1.5,
    borderColor: OLIVE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    flexShrink: 0,
  },

  circleNextAlone: {
    alignSelf: 'center',
  },

  circleNextDisabled: {
    opacity: 0.4,
  },

  playIcon: {
    color: OLIVE,
    marginLeft: 3,
  },

  textArea: {
    borderWidth: 1,
    borderColor: OLIVE,
    borderRadius: 16,
    color: '#111',
    backgroundColor: 'rgba(255,255,255,0.45)',
  },

  photoRow: {
    flexDirection: 'row',
  },

  photoSlot: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1.5,
    borderColor: OLIVE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.35)',
    overflow: 'hidden',
  },

  photoSlotWide: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: OLIVE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.35)',
    marginBottom: 12,
    overflow: 'hidden',
  },

  photoFilled: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },

  photoFilledWide: {
    width: '100%',
    height: '100%',
  },

  plusCircle: {
    borderWidth: 1.5,
    borderColor: OLIVE,
    textAlign: 'center',
    color: OLIVE,
    overflow: 'hidden',
  },

  finishBtn: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: OLIVE,
    minHeight: 48,
    justifyContent: 'center',
  },

  finishBtnDisabled: {
    opacity: 0.65,
  },

  finishBtnText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },

  footerStrip: {
    justifyContent: 'flex-end',
    position: 'relative',
    flexShrink: 0,
  },

  progressImage: {
    width: '100%',
  },

  backTouch: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },

  pressed: {
    opacity: 0.85,
  },
});