/* global karaokeData, $, CustomEvent, chillout */
/*
 * Karaoke Module
 *
 *  Object (JSON) -> {
 *    metadata: Object (메타데이터) -> {
 *        writter: String, // 작성자
 *        lyrics: String, // 가사 전문
 *        correction_time: Time code, // 보정 시간
 *        lastedit: Time code (audio.currentTime() * 100), // 마지막으로 수정 한 타임 코드 (에디터 사용)
 *    },
 *    timeline: Array -> [
 *        [Object] (가사 한 줄) -> {
 *            start_time: Time code (audio.currentTime() * 100), // 렌더링 시작 시간
 *            end_time: Time code (audio.currentTime() * 100), // 렌더링 끝나는 시간
 *            collection: [Array] (가사 음 Collection) -> [
 *                [Object] (가사 음) -> {
 *                    text: String, // 들어갈 내용
 *                    start_time: Time code (audio.currentTime() * 100), // 시작 시간
 *                    end_time: Time code (audio.currentTime() * 100), // 끝나는 시간
 *                    pronunciation_time: Time code (ms / 10), // 발음 시간
 *                    type: Number (1~3) // 1: 가사, 2: 콜, 3: comment, 4: 콜 + 가사
 *                } ...
 *            ]
 *        } ...
 *     ]
 *  }
 *
 * 가사 한 줄 마다 : line break;
 * 가사 음 마다 : NONE;
 */

var SleepCounts = 0;

var Karaoke = {
  TypeLists: [null, "__s", "call", "cmt", "_cs"],
  CallSoundElement: null,

  SpaParsing: function(spa, c, spacing) {
    var wordObject = {
      text: spa + (spacing ? " " : ""),
      start_time: 0,
      end_time: 0,
      pronunciation_time: 0,
      type: 1,
    };

    c.push(wordObject);
  },

  SetTimelineData: function(data) {
    window.karaokeData.timeline = data;
    Karaoke.RenderDOM();
    Karaoke.startEndOpti();
  },

  SelectWord: function(posX, posY, element) {
    Sakurauchi.run("KaraokeSelection", { detail: { posX, posY, element } });
  },

  CompareArray: (a, b) => {
    if (
      typeof a === "undefined" ||
      typeof b === "undefined" ||
      typeof a !== typeof b
    ) {
      return false;
    }

    // if (a.start_time !== b.start_time) return false
    // if (a.end_time !== b.end_time) return false
    if (a.collection.length !== b.collection.length) return false;

    var diff = false;
    a.collection.forEach((v, i) => {
      diff =
        v.text !== b.collection[i].text ||
        v.type !== b.collection[i].type ||
        v.start_time !== b.collection[i].start_time ||
        v.end_time !== b.collection[i].end_time ||
        v.pronunciation_time !== b.collection[i].pronunciation_time;
    });

    return !diff;
  },

  MergeRender: function(prevArray, newArray) {
    var mergedArray = [];

    newArray.forEach((newLines, newLineInt) => {
      if (typeof prevArray[newLineInt] === "undefined") {
        mergedArray.push(newLines);
        return 0;
      }

      var comparedDone = false;
      [prevArray[newLineInt - 1], prevArray[newLineInt + 1]].forEach(
        (comparePrevLine, index) => {
          var sames = Karaoke.CompareArray(newLines, comparePrevLine);
          if (!sames) return 0;

          mergedArray.push(comparePrevLine);
          comparedDone = true;
        }
      );
      if (comparedDone) return 0;

      var lineObj = {
        start_time: 0,
        end_time: 0,
        collection: [],
      };

      newLines.collection.forEach((newWords, newWordsInt) => {
        if (
          typeof prevArray[newLineInt].collection[newWordsInt] ===
            "undefined" ||
          newWords.text !== prevArray[newLineInt].collection[newWordsInt].text
        ) {
          lineObj.collection.push(newWords);
          return 0;
        }

        lineObj.collection.push(prevArray[newLineInt].collection[newWordsInt]);
      });

      mergedArray.push(lineObj);
    });

    return mergedArray;
  },

  Render: function(text) {
    var renderedData = [];
    text = decodeURI(
      encodeURI(text)
        .replace(/(%0A)/gm, "^L_F")
        .replace(/%20%20/gm, "^S_P")
        .replace(/%20/gm, "^xF")
    );

    var splitLF = text.split("^L_F");
    splitLF.forEach((line, lineIndex) => {
      var perLineSpacing = {
        start_time: 0,
        end_time: 0,
        collection: [],
      };

      line.split("^xF").forEach((spa, index) => {
        if (/\^S_P/g.test(spa)) {
          var spaSplt = spa.split(/\^S_P/g);
          spaSplt.forEach((spBr, i) => {
            Karaoke.SpaParsing(
              spBr,
              perLineSpacing.collection,
              spaSplt.length - 1 > i
            );
          });
        } else {
          Karaoke.SpaParsing(spa, perLineSpacing.collection, false);
        }
      });

      perLineSpacing.start_time =
        Number(perLineSpacing.collection[0].start_time) / 2;
      perLineSpacing.end_time =
        Number(
          perLineSpacing.collection[perLineSpacing.collection.length - 1]
            .end_time
        ) + 100;

      renderedData.push(perLineSpacing);
    });

    return renderedData;
  },

  selectLine: num => {
    karaokeData.timeline[num].collection.forEach((v, i) => {
      Karaoke.SelectWord(
        num,
        i,
        document.getElementById("kara_" + num + "_" + i)
      );
    });
  },

  startEndOpti: function() {
    karaokeData.timeline.forEach((value, index) => {
      value.start_time = Number(value.collection[0].start_time) - 100;
      value.end_time =
        Number(value.collection[value.collection.length - 1].end_time) + 100;
    });
  },

  RenderDOM: function() {
    var inserts = "";
    karaokeData.timeline.forEach((v, lineI) => {
      var spaceEle = "";
      v.collection.forEach((word, wordI) => {
        spaceEle +=
          '<p class="lyrics ' +
          Karaoke.TypeLists[word.type] +
          '" id="kara_' +
          lineI +
          "_" +
          wordI +
          '" onclick="Karaoke.SelectWord(' +
          lineI +
          ", " +
          wordI +
          ', this)">' +
          (typeof word.ruby_text !== "undefined" && word.ruby_text !== ""
            ? "<ruby>" +
              word.text.replace(/\s/g, "&nbsp") +
              "<rt>" +
              word.ruby_text +
              "</rt></ruby>"
            : word.text.replace(/\s/g, "&nbsp")) +
          "</p>";
      });
      inserts +=
        '<div class="p_line" id="kara_' +
        lineI +
        '"><p class="line_num" onclick="Karaoke.selectLine(' +
        lineI +
        ')">' +
        lineI +
        ".</p> " +
        spaceEle +
        "</div>";
    });

    document.getElementById("karaoke").innerHTML = inserts;
  },

  clearSync: function(aftFunc) {
    var lyricsElement = document.getElementsByClassName(".lyrics");

    for (var dk = 0; dk < lyricsElement.length; dk++) {
      lyricsElement[dk].className = lyricsElement[dk].className.replace(
        /\scurrentSync/g,
        ""
      );
    }

    if (typeof aftFunc === "function") {
      aftFunc();
    }
  },

  cachedDom: {},

  AudioSync: function(timeCode, fullRender) {
    for (
      var karaLineNum = 0;
      karaLineNum < karaokeData.timeline.length;
      karaLineNum++
    ) {
      var karaLine = karaokeData.timeline[karaLineNum];
      if (
        (timeCode < karaLine.start_time || timeCode > karaLine.end_time) &&
        !fullRender
      ) {
        continue;
      }

      for (
        var karaWordNum = 0;
        karaWordNum < karaLine.collection.length;
        karaWordNum++
      ) {
        var karaWord = karaLine.collection[karaWordNum];
        if (karaWord.start_time === 0 || karaWord.start_time === "0") break;
        karaWord.start_time = Number(karaWord.start_time);
        karaWord.end_time = Number(karaWord.end_time);

        if (
          typeof Karaoke.cachedDom[karaLineNum + "." + karaWordNum] ===
          "undefined"
        ) {
          Karaoke.cachedDom[
            karaLineNum + "." + karaWordNum
          ] = document.getElementById(
            "kara_" + karaLineNum + "_" + karaWordNum
          );
        }
        var kards = Karaoke.cachedDom[karaLineNum + "." + karaWordNum];

        if (!/josenPassing/g.test(kards.className)) {
          kards.classList[
            timeCode > karaWord.start_time && timeCode > karaWord.end_time
              ? "add"
              : "remove"
          ]("josenPassing");
        }

        if (!/currentSync/g.test(kards.className)) {
          kards.classList[timeCode > karaWord.start_time ? "add" : "remove"](
            "currentSync"
          );
          var karaokeDuration =
            typeof karaWord.pronunciation_time === "undefined" ||
            karaWord.pronunciation_time === 0
              ? (((typeof karaLine.collection[karaWordNum + 1] !== "undefined"
                  ? karaLine.collection[karaWordNum + 1].start_time
                  : karaWord.end_time) || 70) -
                  karaWord.start_time) /
                2
              : karaWord.pronunciation_time;
          if (karaokeDuration < 300) karaokeDuration += 30;

          kards.style.transition =
            "text-shadow " +
            karaokeDuration / 300 +
            "s ease 0s, color " +
            karaokeDuration / 300 +
            "s ease 0s";
        }

        if (
          (/\scurrentSync/g.test(kards.className) &&
            timeCode < karaWord.start_time) ||
          timeCode > karaWord.end_time
        ) {
          kards.className = kards.className.replace(/\scurrentSync/g, "");
          kards.style.transition = "";
        }
      }
    }
  },
};

window.Karaoke = Karaoke;
