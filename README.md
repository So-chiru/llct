# LLCT

LoveLive Call Table, 러브라이브 콜표 모음집

[![withLove](https://forthebadge.com/images/badges/built-with-love.svg)](https://sochiru.pw) [![js](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://www.javascript.com) [![js](https://forthebadge.com/images/badges/made-with-pug.svg)](https://www.pugjs.org) [![forthebadge](https://forthebadge.com/images/badges/designed-in-ms-paint.svg)](https://forthebadge.com)

## 라이센스

MIT License, [여기에서 사용된 라이브러리, 전문을 읽을 수 있습니다.](https://github.com/So-chiru/LLCT/blob/master/LICENSE)

## 사이트

Github Pages에서 호스팅 중인 [사이트가 있습니다!](https://lovelivec.kr)

## 로컬 머신에서 돌려보기

Node.js를 이용해 로컬 서버를 돌려 볼 수 있습니다. 코드를 수정할 때 이 방법을 사용하여 로컬 서버를 구축하세요.

### 리포지터리 다운로드

아래 방법으로 리포지터리를 clone 하거나 직접 파일을 다운로드하여 압축을 푸세요.

```bash
$ git clone https://github.com/So-chiru/LLCT.git
```

### 의존성 라이브러리 다운로드

Yarn 패키지 매니저나 NPM을 사용하여 다운로드할 수 있습니다.

```bash
$ yarn
or
$ npm
```

### Gulp 빌드, 실행

build 명령어를 사용하여 pug, scss 파일을 dist 폴더에 컴파일할 수 있습니다.

```bash
$ gulp build
[00:00:00] Using gulpfile ~/llct/gulpfile.js
[00:00:00] Starting 'build'...
[00:00:00] Starting 'sass'...
[00:00:00] Finished 'sass' after 159 ms
    ...
[00:00:00] Finished 'assets' after 94 ms
[00:00:00] Starting 'root_assets'...
[00:00:00] Finished 'root_assets' after 10 ms
[00:00:00] Finished 'build' after
```

또한, 기본 작업을 실행하여 웹서버 실행과 수정 사항 감지에 따른 자동 빌드가 가능합니다.

```bash
$ gulp
[00:00:00] Using gulpfile ~/llct/gulpfile.js
[00:00:00] Starting 'default'...
[00:00:00] Starting 'web_sv'...
[00:00:00] Webserver started at http://localhost:20417
[00:00:00] Finished 'web_sv' after 209 ms
[00:00:00] Starting 'watch'...
```

내장 웹서버가 있어 localhost에서 바로 개발이 가능합니다.

## 가사 싱크 기여

`https://lovelivec.kr/data/lists.json` 에서 기여할 곡의 ID를 찾고 `https://lovelivec.kr/editor?id=(곡 ID)`으로 에디터를 열 수 있습니다.

### 메타데이터 작성하기

보정 값, 재생 시간을 건드려 좀 더 편한 싱크 작성이 가능합니다.

기여자 목록에 등록되기를 원하신다면 작성자 칸에 이름을 적어 넣어주세요.

### 가사 작성

띄어쓰기에 유의하세요. 띄어쓰기 1개와 2개의 기능이 다릅니다.

```plain
공백 2개 : 띄어 쓰기
공백 1개 : 단어 싱크 구분
```

예시

```plain
v : 띄어 쓰기
| : 음절 구분
혼v키v오vv부v츠v케v앗v테 -> 혼|키|오|v|부|츠|케|앗|테 (각 음절과 띄어쓰기가 구분됨)
혼v키v오v부v츠v케v앗v테 -> 혼|키|오|부|츠|케|앗|테 (각 음절만 구분됨)
혼키오부츠케앗테 -> |혼키오부츠케앗테| (모든 단어가 한 음절로 구분됨)
```

**주의: 하나의 줄에 단어가 줄거나 늘게 되면 그 뒤에 있던 시간 싱크가 0으로 덮어 써집니다.**

**주의 2: 줄이 하나 늘거나 줄게 되면 위아래에 있던 내용과 비교 및 대치합니다, 한 줄 변경일 때만 해당되며 2줄 이상 변경은 변경된 줄 이후의 싱크가 모두 0으로 덮어 써집니다.**

### 싱크 단축키, 팁

기본적으로 단어 선택은 마우스로 단어를 클릭하여 선택할 수 있습니다.

```plain
S : 선택된 단어들의 시작 지점을 현재 재생 위치 포인터가 가리키는 지점으로 설정
W : 선택된 단어들의 끝 지점을 현재 재생 위치 포인터가 가리키는 지점으로 설정
P : 선택된 단어들의 발음 끝 지점을 현재 재생 위치 포인터가 가리키는 지점으로 설정 (현재 구현 안됨)
Alt + (위 3개 키) : 기능은 같으나 수행 후 가장 먼저 선택된 단어를 선택 해제함

O : 타임코드 최적화 (forEach, 자동으로 수행됨)
Space : 노래 일시 정지 / 재생
좌측 방향키 : 0.3초 전으로
우측 방향키 : 0.3초 후로
PageUp : 30초 전으로
PageDown: 30초 후로
Home : 노래의 처음으로
End : 노래의 끝으로
```

단어, 라인의 종류는 다음과 같습니다. 귀찮으시더라도 종류를 구분하여 주신다면 감사하겠습니다.

```
1: 가사 (ex. 키보오데 잇파이노)
2: 콜 (ex. 우-하이!, 세-노 하이 하이)
3: 주석 (ex. verse 끝날때 까지 지속)
```

### 저장, 불러오기

왼쪽 위 상단바에 있는 다운로드, 업로드 버튼을 이용해 다운로드나 불러올 수 있습니다.

## 오류 보고

Issues에 재현 과정과 오류 내용을 알려주세요. 아니면 직접 개발에 참여할 수도 있습니다.

## 개발 참여

오탈자 수정, 자막 싱크 추가, 기능 추가 등 모든 종류의 수정을 환영합니다. 개발에 참여하고 싶으시면 Pull Request를 남겨주세요.
