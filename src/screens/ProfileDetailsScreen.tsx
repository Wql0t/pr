import {
  Alert,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FONTS } from '../ui/authStyles';

type Props = {
  onBack?: () => void;
  onLogout?: () => void | Promise<void>;
};

const fields = ['Телефон', 'Пол', 'Возраст', 'Описание', 'Аллергии'];

export function ProfileDetailsScreen({ onBack, onLogout }: Props) {
  const { width, height } = useWindowDimensions();

  const isSmall = width < 360;
  const isTablet = width >= 768;
  const isShort = height < 700;

  const ui = {
    contentHorizontal: isTablet ? 28 : isSmall ? 12 : 16,
    contentTop: isTablet ? 12 : 6,
    contentBottom: isTablet ? 28 : 22,

    titleCardHeight: isTablet
      ? Math.round(height * 0.2)
      : isShort
      ? Math.round(height * 0.2)
      : Math.round(height * 0.25),

    titleFontSize: isTablet ? 42 : isSmall ? 24 : 32,
    titleLineHeight: isTablet ? 48 : isSmall ? 30 : 38,

    backFontSize: isTablet ? 15 : 13,
    backPadX: isTablet ? 18 : 14,
    backPadY: isTablet ? 10 : 8,

    fieldGap: isTablet ? 16 : 12,
    fieldMinHeight: isTablet ? 58 : isSmall ? 44 : 48,
    fieldRadius: isTablet ? 28 : 24,
    fieldFontSize: isTablet ? 18 : isSmall ? 14 : 16,
    fieldPadX: isTablet ? 20 : 16,

    largeFieldMinHeight: isTablet ? 190 : isSmall ? 120 : 150,
    largeFieldRadius: isTablet ? 34 : 30,
    largeFieldPadTop: isTablet ? 18 : 16,

    submitMinWidth: isTablet ? 220 : 172,
    submitPadX: isTablet ? 34 : 28,
    submitPadY: isTablet ? 14 : 12,
    submitFontSize: isTablet ? 22 : 18,

    formPaddingRight: isTablet ? 60 : isSmall ? 12 : 28,

    stebelWidth: isTablet ? 380 : isSmall ? 220 : 320,
    stebelHeight: isTablet ? Math.round(height * 0.9) : Math.round(height * 0.72),
    stebelTop: isTablet ? -Math.round(height * 0.16) : -Math.round((isShort ? height * 0.2 : height * 0.25)),

    starSize: isTablet ? 180 : isSmall ? 100 : 138,
    starLeft: isTablet ? -10 : -18,
    starBottom: isTablet ? -26 : -40,

    topRowMarginBottom: isTablet ? 16 : 10,
    titleCardMarginBottom: isTablet ? 24 : 18,
    submitMarginTop: isTablet ? 24 : 18,
    logoutMarginTop: isTablet ? 16 : 12,
  };

  function confirmLogout() {
    if (!onLogout) return;
    Alert.alert('Выход из аккаунта', 'Выйти из текущего аккаунта?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: () => {
          void Promise.resolve(onLogout());
        },
      },
    ]);
  }

  return (
    <View style={s.root}>
      <StatusBar style="dark" />
      <ImageBackground source={require('../../assets/bg.jpg')} style={s.bg} resizeMode="cover">
        <SafeAreaView style={s.safe}>
          <View
            style={[
              s.content,
              {
                paddingHorizontal: ui.contentHorizontal,
                paddingTop: ui.contentTop,
                paddingBottom: ui.contentBottom,
              },
            ]}
          >
            <View style={[s.topRow, { marginBottom: ui.topRowMarginBottom }]}>
              <View style={s.topSpacer} />
              <Pressable
                onPress={() => onBack?.()}
                style={({ pressed }) => [
                  s.backBtn,
                  {
                    paddingHorizontal: ui.backPadX,
                    paddingVertical: ui.backPadY,
                  },
                  pressed && s.pressed,
                ]}
              >
                <Text style={[s.backBtnText, { fontSize: ui.backFontSize }]}>Назад</Text>
              </Pressable>
            </View>

            
              <Text
                style={[
                  s.title,
                  {
                    fontSize: ui.titleFontSize,
                    lineHeight: ui.titleLineHeight,
                  },
                ]}
              >
                Данные Профиля
              </Text>

            
              <View
                style={[
                  s.fieldsCol,
                  {
                    gap: ui.fieldGap,
                    paddingRight: ui.formPaddingRight,
                  },
                ]}
              >
                {fields.map((field) => {
                  const isDescription = field === 'Описание';

                  return (
                    <View
                      key={field}
                      style={[
                        s.fieldShell,
                        {
                          minHeight: ui.fieldMinHeight,
                          borderRadius: ui.fieldRadius,
                          paddingHorizontal: ui.fieldPadX,
                        },
                        isDescription && {
                          minHeight: ui.largeFieldMinHeight,
                          borderRadius: ui.largeFieldRadius,
                          justifyContent: 'flex-start',
                          paddingTop: ui.largeFieldPadTop,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          s.fieldPlaceholder,
                          {
                            fontSize: ui.fieldFontSize,
                          },
                        ]}
                      >
                        {field}
                      </Text>
                    </View>
                  );
                })}
              </View>

                          </View>

            <Pressable
              style={({ pressed }) => [
                s.submitBtn,
                {
                  marginTop: ui.submitMarginTop,
                  minWidth: ui.submitMinWidth,
                  paddingHorizontal: ui.submitPadX,
                  paddingVertical: ui.submitPadY,
                },
                pressed && s.pressed,
              ]}
            >
              <Text
                style={[
                  s.submitText,
                  {
                    fontSize: ui.submitFontSize,
                  },
                ]}
              >
                ЗАВЕРШИТЬ
              </Text>
            </Pressable>

            {onLogout ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Выйти из аккаунта"
                onPress={confirmLogout}
                style={({ pressed }) => [
                  s.logoutBtn,
                  {
                    marginTop: ui.logoutMarginTop,
                    minWidth: ui.submitMinWidth,
                    paddingHorizontal: ui.submitPadX,
                    paddingVertical: ui.submitPadY - 2,
                  },
                  pressed && s.pressed,
                ]}
              >
                <Text style={[s.logoutText, { fontSize: isTablet ? 16 : isSmall ? 13 : 14 }]}>Выйти из аккаунта</Text>
              </Pressable>
            ) : null}
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f1ecde',
  },

  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 10,
  },

  safe: {
    flex: 1,
  },

  content: {
    flex: 1,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  topSpacer: {
    flex: 1,
  },

  backBtn: {
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(133, 143, 92, 0.5)',
  },

  backBtnText: {
    color: '#7b8351',
    fontWeight: '700',
    fontFamily: FONTS.ui,
  },

  titleCard: {
    justifyContent: 'center',
    paddingTop: 6,
  },

  titleCardImage: {
    borderRadius: 18,
    zIndex: 10,
  },

  title: {
    textAlign: 'center',
    paddingBottom: 50,
    paddingTop: 30,
    color: '#8a935e',
    fontFamily: FONTS.title,
    textTransform: 'uppercase',
    zIndex: 10,
  },

  formWrap: {
    position: 'relative',
    flex: 1,
  },

  stebel: {
    position: 'absolute',
    zIndex: 0,
  },

  fieldsCol: {
    zIndex: 2,
  },

  fieldShell: {
    borderWidth: 2,
    borderColor: '#7f8853',
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
  },

  fieldPlaceholder: {
    color: 'rgba(127, 136, 83, 0.58)',
    fontFamily: FONTS.ui,
    textTransform: 'uppercase',
  },

  star: {
    position: 'absolute',
    zIndex: 0,
  },

  submitBtn: {
    alignSelf: 'center',
    borderRadius: 999,
    backgroundColor: '#8a935e',
  },

  submitText: {
    color: '#fffdf6',
    fontFamily: FONTS.title,
    textTransform: 'uppercase',
  },

  logoutBtn: {
    alignSelf: 'center',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 2,
    borderColor: 'rgba(154, 74, 74, 0.55)',
  },

  logoutText: {
    color: '#8f4545',
    fontFamily: FONTS.title,
    textTransform: 'uppercase',
    fontWeight: '700',
    textAlign: 'center',
  },

  pressed: {
    opacity: 0.88,
  },
});