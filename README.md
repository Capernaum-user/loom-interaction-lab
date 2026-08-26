# Loom — 인터랙션 랩

[![라이브 데모](https://img.shields.io/badge/%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%8D%B0%EB%AA%A8-%EC%97%B4%EA%B8%B0-4DA3FF?style=flat-square&labelColor=141922)](https://capernaum-user.github.io/loom-interaction-lab/)
[![라이선스](https://img.shields.io/badge/%EB%9D%BC%EC%9D%B4%EC%84%A0%EC%8A%A4-MIT-232C3A?style=flat-square&labelColor=141922)](LICENSE)
![의존성](https://img.shields.io/badge/%EC%9D%98%EC%A1%B4%EC%84%B1-%EC%97%86%EC%9D%8C-232C3A?style=flat-square&labelColor=141922)
![파일](https://img.shields.io/badge/%ED%8C%8C%EC%9D%BC-%EB%8B%A8%EC%9D%BC%20HTML-232C3A?style=flat-square&labelColor=141922)

한 상용 AI 디자인 도구의 인터랙션 기법 네 가지를 공개된 자산만 보고 알아낸 뒤, **원본 파일을 한 개도 쓰지 않고 처음부터 다시 구현한** 화면 모음이다.

자기완결 단일 HTML 넉 장이다. 두 번 눌러 브라우저로 열면 그대로 돈다. 서버도 빌드도 설치도 필요 없다.

## 화면

**https://capernaum-user.github.io/loom-interaction-lab/** 에서 바로 볼 수 있다. 내려받아 두 번 눌러 열어도 똑같이 돈다.

| 화면 | 무엇 |
|---|---|
| [**랩 입구**](https://capernaum-user.github.io/loom-interaction-lab/01_Pages/LoomLab_index_active.html) | 무엇을 모방했고 무엇을 가져오지 않았는지 |
| [**무한 시안 피드**](https://capernaum-user.github.io/loom-interaction-lab/01_Pages/LoomLab_endless-feed_active.html) | 프롬프트를 넣으면 스크롤할수록 화면 시안이 끝없이 나온다 |
| [**스타일 드로퍼**](https://capernaum-user.github.io/loom-interaction-lab/01_Pages/LoomLab_style-dropper_active.html) | 한 시안의 색·서체·밀도를 뽑아 다른 시안에 옮긴다 |
| [**모션과 소리 해부**](https://capernaum-user.github.io/loom-interaction-lab/01_Pages/LoomLab_motion-sound_active.html) | 프레임 시퀀스 로더·합성 신호음·스프링 대 베지에 |

파일은 `01_Pages/` 안에 있다.

## 어떻게 도나

시안은 언어모델이 아니라 절차적 생성기가 만든다. 프롬프트와 순번을 섞어 32비트 씨앗을 만들고, 그 씨앗으로 돌린 난수가 팔레트·타이포·밀도·레이아웃을 정한다. **같은 프롬프트의 같은 순번은 언제 열어도 같은 시안이 나온다.**

| 축 | 규모 |
|---|---|
| 레이아웃 문법 | 24종 |
| 업종 사전 | 32종 (키워드 499개, 영문 프롬프트도 같은 사전으로 간다) |
| 문장 틀 | 264개 (길이대 셋. 한 마디부터 두 문장까지) |
| 사전 × 문법 조합 | 768가지 |

그 위에 한국어를 위한 장치가 둘 있다.

- **조사를 자동으로 고른다.** 틀에 `{i0}을` 이라고 적으면 채워진 낱말의 받침을 보고 을·를, 이·가, 은·는, 과·와, 으로·로 를 정한다. 채운 값 끝에만 보이지 않는 표시를 남겼다가 그 표시 뒤에 붙은 조사만 손대므로, 원문에 있던 낱말은 건드리지 않는다.
- **카드 높이가 문장 길이를 따라간다.** 그린 뒤 실제 높이를 재서 카드 비율에 넣는다. 한글 서체는 글자가 나올 때마다 조각을 나눠 받아 다 그린 뒤에도 글이 다시 흐르므로, 시점을 맞히는 대신 높이 변화를 구독해 따라간다.

## 무엇을 가져오지 않았나

원본의 문서와 스타일, 자바스크립트 번들, 로더 파일, 소리 파일, 서체를 하나도 쓰지 않았다. 화면의 그림과 소리는 전부 브라우저에서 계산해 만든다.

그 사이트의 `robots.txt` 가 시안이 놓인 경로를 크롤 금지로 두고 있어 그 경로는 열지 않았다. 확인한 것은 누구나 받을 수 있는 최상위 문서와 정적 자산뿐이다.

기법과 자산을 갈라서 봤다. 한 파일에 프레임을 쌓고 참조만 바꾼다는 발상은 방법이고, 그 방법으로 누군가 그린 그림은 저작물이다. 상표도 같은 기준을 뒀다. 어느 화면에도 원본 도구의 이름이나 로고가 나오지 않는다.

## 원본과 다른 점

| 항목 | 원본 도구 | 이 랩 |
|---|---|---|
| 시안을 만드는 것 | 언어모델 | 절차적 생성기 |
| 인터넷 | 필요하다 | 서체를 받을 때만 쓴다 |
| 같은 요청의 결과 | 매번 달라진다 | 항상 같다 |
| 비용 | 무료 크레딧 뒤에는 유료 | 없다 |

절차적 생성기라 프롬프트의 의미를 깊이 읽지는 못한다. 대신 오프라인에서 돌고 결과가 재현된다.

## 검사

헤드리스 크롬으로 돌린 결과다.

| 검사 | 결과 |
|---|---|
| 사전 × 문법 전수 렌더 | 768회 · 실패 0 |
| 문장 생성 | 8,320회 · 결함 0 |
| 사전 라우팅 | 47건 · 전부 기대와 일치 |
| 조사 경계 시험 | 21건 · 실패 0 |
| 재현성 | 1,600쌍 · 불일치 0 |
| 카드 높이 | 넘침 0장 · 남음 0장 |
| 런타임 오류 | 넉 장 모두 0건 |
| 320px 가로 스크롤 | 넉 장 모두 없음 |

## 서체

서체는 CDN `<link>` 로만 불러온다. 파일로 동봉하지 않았다. Roboto Flex 와 Geist Mono 는 Google Fonts, Pretendard 는 jsDelivr 에서 온다. 인터넷이 끊겨 있으면 시스템 서체로 떨어질 뿐 기능은 그대로 돈다.

세 서체 모두 SIL Open Font License 를 따르며 아래 MIT 와는 별개다. 이 저장소는 서체 파일을 담고 있지 않으므로 재배포에 해당하지 않는다.

## 라이선스

[MIT](LICENSE). 가져다 쓰고 고치고 다시 배포해도 된다. 저작권 표시와 라이선스 전문만 함께 남기면 된다.
