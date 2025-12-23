// 동물 데이터
import * as dogsProfile from "../data/dictionary/dogs";
import * as catsProfile from "../data/dictionary/cats";
import * as rabbitsProfile from "../data/dictionary/rabbit";
import * as hamstersProfile from "../data/dictionary/hamsters";
import * as guinealPigsProfile from "../data/dictionary/guineaPigs";
import * as birdsProfile from "../data/dictionary/birds";
import * as turtlesProfile from "../data/dictionary/turtles";
import * as reptileProfile from "../data/dictionary/reptile";
import * as fishProfile from "../data/dictionary/fish";

// 프로필 데이터를 카드용 데이터로 변환하는 함수
const transformProfileToCard = (profile, category, id) => {
  // 카테고리별 이미지 URL 매핑
  const imageMap = {
    // 강아지
    "말티즈": "/images/animals/dogs/maltese.jpg.png",
    "골든 리트리버": "/images/animals/dogs/goldenRetriever.jpg.png",
    "푸들": "/images/animals/dogs/poodel.jpg.png",
    "시추": "/images/animals/dogs/shihTzu.jpg",
    "치와와": "/images/animals/dogs/chiguahua.jpg.png",
    "포메라니안": "/images/animals/dogs/pomeranian.jpg",
    "웰시 코기 펨브록": "/images/animals/dogs/welshCorgiPembroke.jpg",
    "시베리안 허스키": "/images/animals/dogs/siberianHusky.jpg.png",

    // 고양이
    "먼치킨": "/images/animals/cats/munchkin.jpg",
    "샴": "/images/animals/cats/siamese.jpg",
    "스핑크스": "/images/animals/cats/sphynx.jpg",
    "페르시안": "/images/animals/cats/persianCat.jpg.png",
    "벵갈": "/images/animals/cats/bengal.jpg",
    "러시안 블루": "/images/animals/cats/russianBlue.jpg",

    // 토끼
    "네덜란드 드워프": "/images/animals/rabbit/neterland.jpg",
    "홀랜드 롭": "/images/animals/rabbit/hollandLop.jpg",
    "미니 렉스": "/images/animals/rabbit/miniRex.jpg",
    "라이온헤드 래빗": "/images/animals/rabbit/lionhead.jpg",

    // 햄스터
    "시리아 햄스터 (골든 햄스터)": "/images/animals/hamsters/syrian.jpg",
    "로보로브스키 햄스터 (로보 햄스터)": "/images/animals/hamsters/roborovski.jpg",
    "드워프 햄스터 – 윈터화이트": "/images/animals/hamsters/winterWhite.jpg",

    // 기니피그
    "아메리칸 기니피그 (잉글리시 기니피그)": "/images/animals/guinealPig/american.jpg",
    "아비시니안 기니피그": "/images/animals/guinealPig/abyssinian.jpg",
    "실키 / 셰틀랜드 (Silkie / Sheltie)": "/images/animals/guinealPig/silkie.jpg",
    "페루비안 기니피그": "/images/animals/guinealPig/peruvian.jpg",

    // 어류
    "구피": "/images/animals/fish/guppy.jpg",
    "엔젤피시": "/images/animals/fish/angelfish.jpg",
    "금붕어": "/images/animals/fish/goldfish.jpg",
    "클라운피시 (니모, 흰동가리)": "/images/animals/fish/clownfish.jpg",
    "블루탱 (탱, 도리)": "/images/animals/fish/blueTang.jpg",

    // 거북이
    "붉은귀거북 (리버쿠터)": "/images/animals/turtles/redEaredSlider.jpg",
    "옐로우벨리드 슬라이더": "/images/animals/turtles/yellowBelliedSlider.jpg",
    "페인티드 터틀 (페인팅 거북)": "/images/animals/turtles/paintedTurtle.jpg",
    "쿠터 터틀 (리버/플로리다 쿠터)": "/images/animals/turtles/cooter.jpg",
    "머스크 터틀 (스틴크팟)": "/images/animals/turtles/commonMusk.jpg",

    // 파충류
    "레오파드 게코 (표범무늬 도마뱀붙이)": "/images/animals/reptile/leopard.jpg",
    "볼 파이톤": "/images/animals/reptile/ballPython.jpg",
    "비어디드 드래곤": "/images/animals/reptile/beardedDragon.jpg",
    "콘 스네이크 (옥수수뱀)": "/images/animals/reptile/corn.jpg",

    // 새
    "버저리거 (잉꼬)": "/images/animals/birds/budgerigar.jpg",
    "코카틸": "/images/animals/birds/cockatiel.jpg",
    "러브버드": "/images/animals/birds/lovebird.jpg",
    "카나리아": "/images/animals/birds/canary.jpg",
    "피니치류 (제브라 피니치)": "/images/animals/birds/finch.jpg",
  };

  return {
    id: id,
    name: profile.breed_kr,
    breed: profile.breed_en,
    category: category,
    image:
      imageMap[profile.breed_kr] ||
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop",
    description: profile.breedOverview,
    tags: profile.badges || profile.temperamentTags.slice(0, 3),
    size: profile.averageSize,
    personality: profile.temperamentTags.join(", "),
    exercise: profile.dailyCare?.exerciseAndWalk?.[0]?.title || "정보 없음",
    grooming: profile.groomingLevel,
    // 상세 페이지용 추가 정보
    fullProfile: profile,
  };
};

// 동물 데이터 배열 생성
let idCounter = 1;
export const animalData = [
  // 강아지
  transformProfileToCard(dogsProfile.malteseProfile, "강아지", idCounter++),
  transformProfileToCard(
    dogsProfile.goldenRetrieverProfile,
    "강아지",
    idCounter++
  ),
  transformProfileToCard(dogsProfile.poodleProfile, "강아지", idCounter++),
  transformProfileToCard(dogsProfile.shihTzuProfile, "강아지", idCounter++),
  transformProfileToCard(dogsProfile.chihuahuaProfile, "강아지", idCounter++),
  transformProfileToCard(dogsProfile.pomeranianProfile, "강아지", idCounter++),
  transformProfileToCard(
    dogsProfile.welshCorgiPembrokeProfile,
    "강아지",
    idCounter++
  ),
  transformProfileToCard(
    dogsProfile.siberianHuskyProfile,
    "강아지",
    idCounter++
  ),

  // 고양이
  transformProfileToCard(catsProfile.munchkinProfile, "고양이", idCounter++),
  transformProfileToCard(catsProfile.siameseCatProfile, "고양이", idCounter++),
  transformProfileToCard(catsProfile.sphynxProfile, "고양이", idCounter++),
  transformProfileToCard(catsProfile.persianCatProfile, "고양이", idCounter++),
  transformProfileToCard(catsProfile.bengalProfile, "고양이", idCounter++),
  transformProfileToCard(catsProfile.russianBlueProfile, "고양이", idCounter++),

  // 토끼
  transformProfileToCard(
    rabbitsProfile.netherlandDwarfProfile,
    "토끼",
    idCounter++
  ),
  transformProfileToCard(
    rabbitsProfile.hollandLopRabbitProfile,
    "토끼",
    idCounter++
  ),
  transformProfileToCard(rabbitsProfile.miniRexProfile, "토끼", idCounter++),
  transformProfileToCard(
    rabbitsProfile.lionheadRabbitProfile,
    "토끼",
    idCounter++
  ),

  // 햄스터
  transformProfileToCard(
    hamstersProfile.syrianHamsterProfile,
    "햄스터",
    idCounter++
  ),
  transformProfileToCard(
    hamstersProfile.roborovskiHamsterProfile,
    "햄스터",
    idCounter++
  ),
  transformProfileToCard(
    hamstersProfile.roborovskiHamsterProfile,
    "햄스터",
    idCounter++
  ),

  // 기니피그
  transformProfileToCard(
    guinealPigsProfile.americanGuineaPigProfile,
    "기니피그",
    idCounter++
  ),
  transformProfileToCard(
    guinealPigsProfile.abyssinianGuineaPigProfile,
    "기니피그",
    idCounter++
  ),
  transformProfileToCard(
    guinealPigsProfile.silkieGuineaPigProfile,
    "기니피그",
    idCounter++
  ),
  transformProfileToCard(
    guinealPigsProfile.peruvianGuineaPigProfile,
    "기니피그",
    idCounter++
  ),

  // 새
  transformProfileToCard(birdsProfile.budgerigarProfile, "새", idCounter++),
  transformProfileToCard(birdsProfile.cockatielProfile, "새", idCounter++),
  transformProfileToCard(birdsProfile.lovebirdProfile, "새", idCounter++),
  transformProfileToCard(birdsProfile.canaryProfile, "새", idCounter++),
  transformProfileToCard(birdsProfile.finchesProfile, "새", idCounter++),

  // 거북이
  transformProfileToCard(
    turtlesProfile.redEaredSliderProfile,
    "거북이",
    idCounter++
  ),
  transformProfileToCard(
    turtlesProfile.yellowBelliedSliderProfile,
    "거북이",
    idCounter++
  ),
  transformProfileToCard(
    turtlesProfile.paintedTurtleProfile,
    "거북이",
    idCounter++
  ),
  transformProfileToCard(
    turtlesProfile.cooterTurtleProfile,
    "거북이",
    idCounter++
  ),
  transformProfileToCard(
    turtlesProfile.commonMuskTurtleProfile,
    "거북이",
    idCounter++
  ),

  // 파충류
  transformProfileToCard(
    reptileProfile.leopardGeckoProfile,
    "파충류",
    idCounter++
  ),
  transformProfileToCard(
    reptileProfile.ballPythonProfile,
    "파충류",
    idCounter++
  ),
  transformProfileToCard(
    reptileProfile.beardedDragonProfile,
    "파충류",
    idCounter++
  ),
  transformProfileToCard(
    reptileProfile.cornSnakeProfile,
    "파충류",
    idCounter++
  ),

  // 어류
  transformProfileToCard(fishProfile.guppyProfile, "어류", idCounter++),
  transformProfileToCard(fishProfile.angelfishProfile, "어류", idCounter++),
  transformProfileToCard(fishProfile.goldfishProfile, "어류", idCounter++),
  transformProfileToCard(fishProfile.clownfishProfile, "어류", idCounter++),
  transformProfileToCard(fishProfile.blueTangProfile, "어류", idCounter++),
];

// ID로 동물 찾기 함수
export const getAnimalById = (id) => {
  return animalData.find((animal) => animal.id === parseInt(id));
};
