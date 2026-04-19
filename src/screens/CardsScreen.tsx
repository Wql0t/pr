import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Modal,
  PanResponder,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';
import {
  formatQuestionnaireSubtitle,
  loadQuestionnaires,
  questionnaireCoverSource,
} from '../feed/questionnaireStorage';

export type CardItem = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image: ImageSourcePropType;
};

function builtInDemoCards(): CardItem[] {
  return [
    {
      id: 'demo-1',
      title: 'Гречка',
      subtitle: '67 мес',
      description:
        'Практический опыт показывает, что сложившаяся структура организации способствует повышению актуальности существующих финансовых и административных условий.',
      image: require('../../assets/gr1.png'),
    },
    {
      id: 'demo-2',
      title: 'Мурзик',
      subtitle: '24 мес',
      description:
        'Разнообразный и богатый опыт говорит о том, что новая модель организационной деятельности требует анализа дальнейших направлений развития.',
      image: require('../../assets/gr2.png'),
    },
    {
      id: 'demo-3',
      title: 'Бобик',
      subtitle: '14 мес',
      description:
        'Значимость этих проблем настолько очевидна, что постоянный количественный рост и сфера нашей активности обеспечивает актуальность новых предложений.',
      image: require('../../assets/gr3.png'),
    },
  ];
}

type Props = {
  feedReloadKey?: number;
  onBack?: () => void;
  onSwipeLeft?: (card: CardItem) => void;
  onSwipeRight?: (card: CardItem) => void;
  onSwipeUp?: (card: CardItem) => void;
};

function stubSwipeLeft(card: CardItem) {
  console.log('swipe left', card.id);
}
function stubSwipeRight(card: CardItem) {
  console.log('swipe right', card.id);
}
function stubSwipeUp(card: CardItem) {
  console.log('swipe up', card.id);
}

export function CardsScreen({
  feedReloadKey = 0,
  onBack,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
}: Props) {
  const { width: screenW, height: screenH } = useWindowDimensions();

  const isSmall = screenW < 360;
  const isTablet = screenW >= 768;

  const SWIPE_THRESHOLD = Math.min(120, screenW * 0.22);
  const SWIPE_UP_THRESHOLD = Math.min(120, screenH * 0.16);

  const ui = useMemo(() => {
    const horizontalPadding = isTablet ? 28 : 16;
    const cardMaxWidth = isTablet ? 520 : 420;
    const cardWidth = Math.min(screenW - horizontalPadding * 2, cardMaxWidth);
    const imageHeight = isTablet
      ? Math.min(360, Math.round(screenH * 0.34))
      : isSmall
      ? Math.min(220, Math.round(screenH * 0.27))
      : Math.min(280, Math.round(screenH * 0.32));

    return {
      horizontalPadding,
      topTitleSize: isTablet ? 24 : isSmall ? 16 : 18,
      backBtnSize: isTablet ? 52 : 44,
      backIconSize: isTablet ? 34 : 30,
      cardWidth,
      imageHeight,
      cardRadius: isTablet ? 24 : 18,
      cardPadding: isTablet ? 22 : isSmall ? 14 : 16,
      titleSize: isTablet ? 30 : isSmall ? 20 : 22,
      subtitleSize: isTablet ? 22 : isSmall ? 16 : 18,
      textSize: isTablet ? 18 : isSmall ? 14 : 15.5,
      textLineHeight: isTablet ? 26 : isSmall ? 20 : 21,
      hintSize: isTablet ? 15 : 13,
      topPadding: isTablet ? 12 : 6,
      bottomPadding: isTablet ? 24 : 18,
    };
  }, [screenW, screenH, isSmall, isTablet]);

  const [cards, setCards] = useState<CardItem[]>(builtInDemoCards);
  const [index, setIndex] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const enterOpacity = useRef(new Animated.Value(1)).current;

  const cardsRef = useRef(cards);
  const indexRef = useRef(index);
  cardsRef.current = cards;
  indexRef.current = index;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await loadQuestionnaires();
      const fromUser: CardItem[] = stored.map((q) => ({
        id: q.id,
        title: q.petName,
        subtitle: formatQuestionnaireSubtitle(q),
        description: q.aboutPet,
        image: questionnaireCoverSource(q),
      }));
      const merged = [...fromUser, ...builtInDemoCards()];
      if (!cancelled) {
        setCards(merged);
        setIndex(0);
        position.setValue({ x: 0, y: 0 });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [feedReloadKey]);

  useEffect(() => {
    enterOpacity.setValue(0.88);
    Animated.timing(enterOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [index, enterOpacity]);

  const current = cards[index];

  const handleLeft = onSwipeLeft ?? stubSwipeLeft;
  const handleRight = onSwipeRight ?? stubSwipeRight;
  const handleUp = onSwipeUp ?? stubSwipeUp;

  const handleLeftRef = useRef(handleLeft);
  const handleRightRef = useRef(handleRight);
  const handleUpRef = useRef(handleUp);
  handleLeftRef.current = handleLeft;
  handleRightRef.current = handleRight;
  handleUpRef.current = handleUp;

  const rotate = useMemo(
    () =>
      position.x.interpolate({
        inputRange: [-screenW / 2, 0, screenW / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
        extrapolate: 'clamp',
      }),
    [position.x, screenW]
  );

  const cardMotionStyle = useMemo(
    () => ({
      transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }],
      opacity: enterOpacity,
    }),
    [position.x, position.y, rotate, enterOpacity]
  );

  const resetPosition = useCallback(() => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      friction: 7,
      tension: 70,
    }).start();
  }, [position]);

  const finishSwipe = useCallback(
    (dir: 'left' | 'right' | 'up') => {
      const toX = dir === 'right' ? screenW * 1.2 : dir === 'left' ? -screenW * 1.2 : 0;
      const toY = dir === 'up' ? -screenH * 1.05 : dir === 'left' || dir === 'right' ? 28 : 0;

      Animated.timing(position, {
        toValue: { x: toX, y: toY },
        duration: 240,
        useNativeDriver: true,
      }).start(() => {
        const list = cardsRef.current;
        const idx = indexRef.current;
        const swiped = list[idx];

        if (swiped) {
          if (dir === 'right') handleRightRef.current(swiped);
          else if (dir === 'left') handleLeftRef.current(swiped);
          else handleUpRef.current(swiped);
        }

        position.setValue({ x: 0, y: 0 });
        setIndex((v) => (v + 1) % list.length);
      });
    },
    [position, screenH, screenW]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 || Math.abs(g.dy) > 8,
        onPanResponderMove: (_, g) => {
          position.setValue({ x: g.dx, y: g.dy });
        },
        onPanResponderRelease: (_, g) => {
          const list = cardsRef.current;
          const idx = indexRef.current;
          if (!list[idx]) return;

          if (g.dy < -SWIPE_UP_THRESHOLD && Math.abs(g.dx) < SWIPE_THRESHOLD * 0.9) {
            finishSwipe('up');
            return;
          }
          if (g.dx > SWIPE_THRESHOLD) {
            finishSwipe('right');
            return;
          }
          if (g.dx < -SWIPE_THRESHOLD) {
            finishSwipe('left');
            return;
          }

          resetPosition();
        },
      }),
    [SWIPE_THRESHOLD, SWIPE_UP_THRESHOLD, finishSwipe, position, resetPosition]
  );

  return (
    <ImageBackground source={require('../../assets/bg.jpg')} style={s.bg} resizeMode="cover">
      <Modal
        visible={detailOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDetailOpen(false)}
      >
        <Pressable style={s.modalOverlay} onPress={() => setDetailOpen(false)}>
          <Pressable style={[s.modalCard, { maxWidth: Math.min(ui.cardWidth + 40, screenW - 32) }]} onPress={() => {}}>
            <View style={s.modalHeader}>
              <Text style={[s.modalTitle, { fontSize: isTablet ? 20 : 17 }]}>Анкета</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Закрыть"
                onPress={() => setDetailOpen(false)}
                style={({ pressed }) => [s.modalCloseBtn, pressed && s.pressed]}
              >
                <Text style={s.modalCloseText}>×</Text>
              </Pressable>
            </View>
            {current ? (
              <ScrollView style={s.modalScroll} showsVerticalScrollIndicator={false}>
                <Image
                  source={current.image}
                  style={[s.modalImage, { height: ui.imageHeight }]}
                  resizeMode="cover"
                />
                <View style={{ padding: ui.cardPadding }}>
                  <Text style={[s.cardTitle, { fontSize: ui.titleSize }]}>
                    {current.title}
                    {current.subtitle ? (
                      <Text style={[s.cardSubtitle, { fontSize: ui.subtitleSize }]}>
                        {'  '}
                        {current.subtitle}
                      </Text>
                    ) : null}
                  </Text>
                  <View style={s.divider} />
                  <Text
                    style={[
                      s.cardText,
                      {
                        fontSize: ui.textSize,
                        lineHeight: ui.textLineHeight,
                      },
                    ]}
                  >
                    {current.description}
                  </Text>
                </View>
              </ScrollView>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>

      <SafeAreaView style={s.safe}>
        <View
          style={[
            s.topRow,
            {
              paddingHorizontal: ui.horizontalPadding,
              paddingTop: ui.topPadding,
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Назад"
            onPress={() => onBack?.()}
            style={({ pressed }) => [
              s.backBtn,
              {
                width: ui.backBtnSize,
                height: ui.backBtnSize,
                borderRadius: isTablet ? 14 : 12,
              },
              pressed && s.pressed,
            ]}
          >
            <Text style={[s.backIcon, { fontSize: ui.backIconSize }]}>‹</Text>
          </Pressable>

          <Text style={[s.topTitle, { fontSize: ui.topTitleSize }]}>Лента</Text>

          <View style={{ width: ui.backBtnSize }} />
        </View>

        <View style={[s.stage, { paddingHorizontal: ui.horizontalPadding }]}>
          {current ? (
            <Animated.View
              key={current.id}
              style={[s.cardSlot, { width: ui.cardWidth }, cardMotionStyle]}
              collapsable={false}
              {...panResponder.panHandlers}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Открыть анкету"
                onPress={() => setDetailOpen(true)}
                style={({ pressed }) => [
                  s.card,
                  { borderRadius: ui.cardRadius },
                  pressed && s.cardPressed,
                ]}
              >
                <Image
                  source={current.image}
                  style={[s.cardImage, { height: ui.imageHeight }]}
                  resizeMode="cover"
                  defaultSource={require('../../assets/gr1.png')}
                />

                <View style={[s.cardBody, { padding: ui.cardPadding }]}>
                  <Text style={[s.cardTitle, { fontSize: ui.titleSize }]}>
                    {current.title}
                    {current.subtitle ? (
                      <Text style={[s.cardSubtitle, { fontSize: ui.subtitleSize }]}>
                        {'  '}
                        {current.subtitle}
                      </Text>
                    ) : null}
                  </Text>

                  <View style={s.divider} />

                  <Text
                    numberOfLines={5}
                    style={[
                      s.cardText,
                      {
                        fontSize: ui.textSize,
                        lineHeight: ui.textLineHeight,
                      },
                    ]}
                  >
                    {current.description}
                  </Text>
                </View>
              </Pressable>
            </Animated.View>
          ) : null}
        </View>

        <View
          style={[
            s.hintRow,
            {
              paddingHorizontal: ui.horizontalPadding,
              paddingBottom: ui.bottomPadding,
            },
          ]}
        >
          <Text style={[s.hintText, { fontSize: ui.hintSize }]}>
            Свайп влево, вправо или вверх — следующая анкета. Тап по карточке — подробности.
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: {
    flex: 1,
  },

  safe: {
    flex: 1,
  },

  topRow: {
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  topTitle: {
    color: '#FFFFFF',
    letterSpacing: 0.2,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },

  backBtn: {
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    color: '#fff',
    marginTop: -2,
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },

  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardSlot: {
    maxWidth: '100%',
  },

  cardPressed: {
    opacity: 0.97,
  },

  card: {
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.10)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  cardImage: {
    width: '100%',
    backgroundColor: '#D7DCE3',
  },

  cardBody: {},

  cardTitle: {
    color: '#3D3B2F',
    fontWeight: '800',
  },

  cardSubtitle: {
    color: '#6B6756',
    fontWeight: '700',
  },

  divider: {
    height: 2,
    backgroundColor: 'rgba(61,59,47,0.35)',
    marginTop: 10,
    marginBottom: 10,
  },

  cardText: {
    color: '#5A574A',
  },

  hintRow: {
    alignItems: 'center',
  },

  hintText: {
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  modalCard: {
    width: '100%',
    maxHeight: '88%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.10)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.12)',
  },

  modalTitle: {
    color: '#3D3B2F',
    fontWeight: '800',
  },

  modalCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalCloseText: {
    fontSize: 26,
    color: '#3D3B2F',
    marginTop: -2,
    fontWeight: '500',
  },

  modalScroll: {
    flexGrow: 0,
  },

  modalImage: {
    width: '100%',
    backgroundColor: '#D7DCE3',
  },
});
