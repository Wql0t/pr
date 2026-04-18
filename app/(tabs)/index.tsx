import { Image } from 'expo-image';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const stories = [
  {
    id: '1',
    title: 'ДАНИИЛ И\nБУЛЬБОЧКА',
    text: 'Практический опыт показывает, что сложившаяся структура организации способствет развитию существующих финансовых и административных условий.',
    image: require('@/assets/home/story-1.png'),
  },
  {
    id: '2',
    title: 'МАША И\nСАЛАМАНДРА',
    text: 'Практический опыт показывает, что сложившаяся структура позволяет находить питомцев, которые подходят по характеру.',
    image: require('@/assets/home/story-2.png'),
  },
  {
    id: '3',
    title: 'СЕРГЕЙ И\nПУШУРА',
    text: 'История о любви, заботе и новом доме для животного, которое очень этого ждало.',
    image: require('@/assets/home/story-3.png'),
  },
  {
    id: '4',
    title: 'САМАРА И\nКРЯНОН',
    text: 'Ещё одна добрая история про хозяина и питомца, которые идеально подошли друг другу.',
    image: require('@/assets/home/story-4.png'),
  },
];

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.82;

  const player = useVideoPlayer(require('@/assets/home/video-1.mp4'), (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.page}>
        <View style={styles.videoTopSection}>
          <VideoView
            player={player}
            style={styles.videoTopBackground}
            contentFit="cover"
            nativeControls={false}
          />

          <View style={styles.videoTopOverlay} />

          <View style={styles.topRedStripeWide} />
          <View style={styles.topRedStripeThin} />

          <Image
            source={require('@/assets/home/top-rat.png')}
            style={styles.topRat}
            contentFit="contain"
          />

          <View style={styles.headerRow}>
            <View style={styles.headerLeftGroup}>
              <Pressable style={styles.profileCircle}>
                <Image
                  source={require('@/assets/home/profile-icon.png')}
                  style={styles.profileCircleImage}
                  contentFit="contain"
                />
              </Pressable>

              <Pressable style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Войти.</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.glassCardWrap}>
            <View style={styles.glassLeftStripe} />

            <View style={styles.glassCard}>
              <View style={styles.glassOverlay} />

              <View style={styles.glassInner}>
                <Text style={styles.heroTitle}>
                  НАЙДИТЕ <Text style={styles.heroAccent}>своего</Text> ПИТОМЦА.
                </Text>

                <View style={styles.heroTextLines}>
                  <View style={styles.redLineTop} />
                  <View style={styles.redLineBottom} />
                </View>

                <Text style={styles.heroDescription}>
                  Подарите дом тому, кто подходит вам. Мультиплатформа для людей, кто хочет завести
                  питомца или стать хозяином
                </Text>

                <View style={styles.startWrap}>
                  <Pressable style={styles.startButton}>
                    <Text style={styles.startButtonText}>Начать.</Text>

                    <Image
                      source={require('@/assets/home/top-cat.png')}
                      style={styles.startCat}
                      contentFit="contain"
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.middleRedStripe} />

        <View style={styles.paperCatSection}>
          <Image
            source={require('@/assets/home/paper.jpg')}
            style={styles.paperSectionBg}
            contentFit="cover"
          />

          <View style={styles.paperDecorStripe} />
          <View style={styles.paperDecorStripeThin} />

          <Image
            source={require('@/assets/home/big-cat-center.png')}
            style={styles.bigCat}
            contentFit="contain"
          />
        </View>

        <View style={styles.bottomRedStripe} />

        <View style={styles.cardsSection}>
          <Image
            source={require('@/assets/home/paper.jpg')}
            style={styles.middlePaperBg}
            contentFit="cover"
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
            bounces={false}
            alwaysBounceHorizontal={false}
            overScrollMode="never"
            snapToInterval={cardWidth + 18}
            decelerationRate="fast"
            snapToAlignment="start"
          >
            {stories.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.storyCard,
                  {
                    width: cardWidth,
                    marginRight: index === stories.length - 1 ? 0 : 18,
                  },
                ]}
              >
                <View style={styles.storyTextColumn}>
                  <Text style={styles.storyTitle}>{item.title}</Text>
                  <Text style={styles.storyBody}>{item.text}</Text>

                  <Pressable style={styles.readButton}>
                    <Text style={styles.readButtonText}>Читать.</Text>
                  </Pressable>
                </View>

                <Image source={item.image} style={styles.storyImage} contentFit="cover" />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerTop}>
            <View style={styles.footerColumnLeft}>
              <Text style={styles.footerTitle}>ЮРИДИЧЕСКАЯ ИНФОРМАЦИЯ</Text>
              <Text style={styles.footerLink}>КОНФИДЕНЦИАЛЬНОСТЬ</Text>
              <Text style={styles.footerLink}>ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ</Text>
              <Text style={styles.footerLink}>УСЛОВИЯ</Text>
              <Text style={styles.footerLink}>О НАС</Text>
              <Text style={styles.footerLink}>КОНТАКТЫ</Text>

              <Text style={styles.footerTitleSpacing}>ЧАСТЫЕ ВОПРОСЫ</Text>
              <Text style={styles.footerSmallLink}>ТРАЛАЛА ДЕЛО?</Text>
              <Text style={styles.footerSmallLink}>ШИМИШАНШИНИ БАНАНИНИ ИЗИ ПУПИ?</Text>
              <Text style={styles.footerSmallLink}>НЕГРО СТЕФАНО?</Text>
              <Text style={styles.footerSmallLink}>ТРАЛАЛА ДЕЛО?</Text>
              <Text style={styles.footerSmallLink}>ШИМИШАНШИНИ</Text>
              <Text style={styles.footerSmallLink}>НИГРОНЕНАШВЕДОВУИИЕ?</Text>
            </View>

            <View style={styles.footerColumnRight}>
              <Text style={styles.footerTitle}>СОЦИАЛЬНЫЕ СЕТИ</Text>

              <View style={styles.socialsRow}>
                <Text style={styles.socialIcon}>◎</Text>
                <Text style={styles.socialIcon}>f</Text>
                <Text style={styles.socialIcon}>𝕏</Text>
                <Text style={styles.socialIcon}>▶</Text>
                <Text style={styles.socialIcon}>✈</Text>
              </View>
            </View>
          </View>

          <View style={styles.footerBottomLine} />

          <View style={styles.footerBrandRow}>
            <Text style={styles.vexaText}>VEXA</Text>

            <View style={styles.footerMiniCenterBlock}>
              <Image
                source={require('@/assets/home/big-cat.png')}
                style={styles.footerMiniCat}
                contentFit="contain"
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const CREAM = '#eadfcf';
const OLIVE = '#7c7a4d';
const DARK = '#050505';
const RED = '#7e0f1f';
const TEXT_LIGHT = '#f2eee6';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#d9d3c5',
  },

  content: {
    flexGrow: 1,
  },

  page: {
    minHeight: '100%',
    backgroundColor: '#d9d3c5',
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: 0,
  },

  videoTopSection: {
    minHeight: 620,
    position: 'relative',
    overflow: 'hidden',
  },

  videoTopBackground: {
    ...StyleSheet.absoluteFillObject,
  },

  videoTopOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(172, 182, 171, 0.28)',
  },

  topRedStripeWide: {
    position: 'absolute',
    top: 0,
    left: 122,
    width: 34,
    height: 96,
    backgroundColor: RED,
    zIndex: 1,
  },

  topRedStripeThin: {
    position: 'absolute',
    top: 0,
    left: 160,
    width: 4,
    height: 96,
    backgroundColor: CREAM,
    zIndex: 1,
  },

  topRat: {
    position: 'absolute',
    top: 10,
    right: 10,  // было 32, теперь ближе к правому краю
    width: 150,
    height: 64,
  },

  headerRow: {
    paddingTop: 20,
    paddingHorizontal: 10,
    zIndex: 4,
  },

  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: CREAM,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  profileCircleImage: {
    width: 28,
    height: 28,
  },

  loginButton: {
    backgroundColor: CREAM,
    borderRadius: 999,
    minWidth: 110,
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginButtonText: {
    color: OLIVE,
    fontSize: 18,
    fontWeight: '900',
  },

  glassCardWrap: {
    marginTop: 28,
    marginHorizontal: 22,
    position: 'relative',
    zIndex: 3,
  },

  glassLeftStripe: {
    position: 'absolute',
    left: -10,
    top: 28,
    bottom: 28,
    width: 10,
    backgroundColor: RED,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    zIndex: 4,
  },

  glassCard: {
    minHeight: 380,
    borderRadius: 38,
    overflow: 'hidden',
    borderWidth: 10,
    borderColor: CREAM,
    backgroundColor: 'rgba(230, 234, 228, 0.22)',
    zIndex: 3,
  },

  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(225, 231, 226, 0.30)',
  },

  glassInner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },

  heroTitle: {
    color: '#f1eee7',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },

  heroAccent: {
    color: '#b11f22',
    fontStyle: 'italic',
  },

  heroTextLines: {
    alignItems: 'center',
    marginBottom: 8,
  },

  redLineTop: {
    width: 76,
    height: 2,
    backgroundColor: '#a34545',
    marginBottom: 14,
  },

  redLineBottom: {
    width: 52,
    height: 2,
    backgroundColor: '#a34545',
  },

  heroDescription: {
    color: TEXT_LIGHT,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    maxWidth: 270,
    alignSelf: 'center',
    marginTop: 8,
  },

startWrap: {
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 18,
    justifyContent: 'center',  // добавить для вертикальной центровки содержимого
},

  startButton: {
    backgroundColor: '#e4d4bd',
    borderRadius: 999,
    paddingLeft: 42,
    paddingRight: 86,
    paddingVertical: 16,
    minWidth: 250,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  startCat: {
    position: 'absolute',
    right: 7,
    top: '-60%',
    width: 98,
    height: 62,
    zIndex: 2,
    transform: [{ translateY: -26 }],
  },

  startButtonText: {
    color: OLIVE,
    fontSize: 26,
    fontWeight: '900',
    alignSelf: 'flex-start',
  },

  middleRedStripe: {
    height: 14,
    backgroundColor: RED,
    zIndex: 3,
  },

  paperCatSection: {
    minHeight: 420,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#e7dece',
  },

  paperSectionBg: {
    ...StyleSheet.absoluteFillObject,
  },

  paperDecorStripe: {
    position: 'absolute',
    top: 250,
    right: 0,
    width: 150,
    height: 54,
    backgroundColor: RED,
    zIndex: 1,
  },

  paperDecorStripeThin: {
    position: 'absolute',
    top: 250,
    left: 60,
    width: 178,
    height: 6,
    backgroundColor: CREAM,
    zIndex: 2,
  },

  bigCat: {
    width: 460,
    height: 570,
    alignSelf: 'center',
    marginTop: -36,
    marginRight: 180,
    zIndex: 3,
  },

  bottomRedStripe: {
    height: 14,
    backgroundColor: RED,
    zIndex: 3,
  },

  cardsSection: {
    backgroundColor: '#e7dece',
    paddingTop: 18,
    paddingBottom: 14,
    position: 'relative',
  },

  middlePaperBg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.6,
  },

  cardsRow: {
    paddingLeft: 0,
    paddingRight: 12,
  },

  storyCard: {
    minHeight: 178,
    backgroundColor: '#d9cfb8',
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 18,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  storyTextColumn: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 12,
  },

  storyTitle: {
    color: OLIVE,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 18,
    marginBottom: 8,
  },

  storyBody: {
    color: '#8b8c6f',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 18,
  },

  storyImage: {
    width: 142,
    height: '100%',
  },

  readButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#e2d6c4',
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  readButtonText: {
    color: OLIVE,
    fontSize: 14,
    fontWeight: '900',
  },

  footer: {
    backgroundColor: DARK,
    paddingTop: 14,
    paddingHorizontal: 12,
    paddingBottom: 22,
    minHeight: 340,
    position: 'relative',
    overflow: 'hidden',
  },

  footerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },

  footerColumnLeft: {
    width: '58%',
  },

  footerColumnRight: {
    width: '34%',
  },

  footerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 8,
  },

  footerTitleSpacing: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 18,
    marginBottom: 6,
  },

  footerLink: {
    color: '#f4f4f4',
    fontSize: 12,
    marginBottom: 6,
  },

  footerSmallLink: {
    color: '#f4f4f4',
    fontSize: 10,
    marginBottom: 2,
  },

  socialsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },

  socialIcon: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },

  footerBottomLine: {
    marginTop: 16,
    height: 2,
    backgroundColor: '#d7d2ca',
    zIndex: 2,
  },

  footerBrandRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },

  vexaText: {
    color: '#ffffff',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 1,
  },

  footerMiniCenterBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  footerMiniCat: {
    width: 132,
    height: 132,
  },
});