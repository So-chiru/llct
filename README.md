# LLCT

LoveLive Call Table, 러브라이브 콜표 모음집

[![withLove](https://forthebadge.com/images/badges/built-with-love.svg)](https://sochiru.pw) [![js](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://www.javascript.com) [![js](https://forthebadge.com/images/badges/made-with-pug.svg)](https://www.pugjs.org) [![forthebadge](https://forthebadge.com/images/badges/designed-in-ms-paint.svg)](https://forthebadge.com)

## 라이센스

MIT License, [여기에서 사용된 라이브러리, 전문을 읽을 수 있습니다.](https://github.com/So-chiru/LLCT/blob/master/LICENSE)

## 사이트

Github Pages에서 호스팅 중인 [사이트가 있습니다!](https://lovelivec.kr)

## 로컬 머신에서 돌려보기

Node.js를 이용해 컴퓨터에서 서버를 돌려 볼 수 있습니다. 기여 할때에 이 방법을 사용하세요.

### 리포지터리 다운로드

아래 방법으로 리포지터리를 clone 하거나 직접 파일을 다운받아 압축을 푸세요.

```bash
$ git clone https://github.com/So-chiru/LLCT.git
```

### 의존성 라이브러리 다운로드

Yarn 패키지 매니저나 NPM을 사용하여 다운로드 받을 수 있습니다.

```bash
$ yarn
or
$ npm
```

### Gulp 빌드, 실행

build 명령어를 사용하여 pug, scss 파일을 dist 폴더에 컴파일 할 수 있습니다.

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

## 오류 보고

Issues 에 재현 과정과 오류 내용을 알려주세요. 아니면 직접 개발에 참여 할 수도 있습니다.

## 개발 참여

오탈자 수정, 자막 싱크 추가, 기능 추가등 모든 종류의 수정을 환영합니다. 개발에 참여하고 싶으시면 Pull Request를 남겨주세요.
