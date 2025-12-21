// 동물 데이터
import * as dogsProfile from "../data/dictionary/dogs";
import * as catsProfile from "../data/dictionary/cats";
import * as rabbitsProfile from "../data/dictionary/rabbit";
import * as hamstersProfile from "../data/dictionary/Hamsters";
import * as guinealPigsProfile from "../data/dictionary/GuineaPigs";
import * as birdsProfile from "../data/dictionary/birds";
import * as turtlesProfile from "../data/dictionary/turtles";
import * as reptileProfile from "../data/dictionary/reptile";
import * as fishProfile from "../data/dictionary/fish";

// 프로필 데이터를 카드용 데이터로 변환하는 함수
const transformProfileToCard = (profile, category, id) => {
  // 카테고리별 이미지 URL 매핑 (임시 - 실제 이미지로 교체 필요)
  const imageMap = {
    말티즈:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=600&fit=crop",
    "골든 리트리버":
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
    푸들: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop",
    시츄: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop",
    먼치킨:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=300&fit=crop",
    "샴 고양이":
      "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=300&fit=crop",
    페르시안:
      "https://images.unsplash.com/photo-1573865526739-10c1d3a1f0cc?w=400&h=300&fit=crop",
    "러시안 블루":
      "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=400&h=300&fit=crop",
    "네덜란드 드워프":
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop",
    "홀랜드 롭":
      "https://images.unsplash.com/photo-1535241749838-299277b6305f?w=400&h=300&fit=crop",
    "시리안 햄스터":
      "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop",
    "로보로브스키 햄스터":
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&h=300&fit=crop",
    "아메리칸 기니피그":
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&h=300&fit=crop",
    "버저리거 (잉꼬)":
      "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop",
    코카틸:
      "https://images.unsplash.com/photo-1616781833946-79cad5d0c19c?w=400&h=300&fit=crop",
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
